import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import { AIConfig } from './config';
import { CacheService } from './cache-service';
import { ErrorHandler } from './error-handler';

export interface SearchResult {
  id: string;
  content: string;
  metadata: Record<string, any>;
  score: number;
  highlights?: string[];
}

export interface IndexableDocument {
  id: string;
  content: string;
  title?: string;
  metadata?: Record<string, any>;
  tags?: string[];
}

type PineconeIndexSummary = {
  name?: string;
  status?: {
    ready?: boolean;
  };
};

export class SemanticSearchService {
  private pinecone: Pinecone;
  private openai: OpenAI;
  private cache: CacheService;
  private errorHandler: ErrorHandler;
  private index: any;

  constructor(private config: AIConfig) {
    this.pinecone = new Pinecone({
      apiKey: config.pinecone.apiKey,
    });
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    this.cache = new CacheService(config.redis);
    this.errorHandler = new ErrorHandler();
  }

  async initialize(): Promise<void> {
    try {
      await this.cache.connect();

      const indexes = await this.pinecone.listIndexes();
      const indexExists = indexes.indexes?.some(
        (idx: PineconeIndexSummary) => idx.name === this.config.pinecone.indexName
      );

      if (!indexExists) {
        await this.createIndex();
      }

      this.index = this.pinecone.index(this.config.pinecone.indexName);
    } catch (error) {
      this.errorHandler.handleError(error, {
        service: 'SemanticSearch',
        operation: 'initialize',
      });
      throw error;
    }
  }

  private async createIndex(): Promise<void> {
    await this.pinecone.createIndex({
      name: this.config.pinecone.indexName,
      dimension: 1536,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
      },
    });

    await this.waitForIndexReady();
  }

  private async waitForIndexReady(maxAttempts = 30): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      const indexes = await this.pinecone.listIndexes();
      const index = indexes.indexes?.find(
        (idx: PineconeIndexSummary) => idx.name === this.config.pinecone.indexName
      );

      if (index?.status?.ready) {
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    throw new Error('Index creation timeout');
  }

  async indexDocuments(documents: IndexableDocument[]): Promise<void> {
    if (!this.index) {
      await this.initialize();
    }

    try {
      const batchSize = 100;
      const batches = this.chunkArray(documents, batchSize);

      for (const batch of batches) {
        const vectors = await Promise.all(
          batch.map(async (doc) => {
            const embedding = await this.generateEmbedding(doc.content);
            return {
              id: doc.id,
              values: embedding,
              metadata: {
                content: doc.content.substring(0, 1000),
                title: doc.title || '',
                ...doc.metadata,
                tags: doc.tags?.join(',') || '',
              },
            };
          })
        );

        await this.index.upsert(vectors);
      }

      await this.cache.delete('search:*');
    } catch (error) {
      this.errorHandler.handleError(error, {
        service: 'SemanticSearch',
        operation: 'indexDocuments',
        metadata: { documentCount: documents.length },
      });
      throw error;
    }
  }

  async search(
    query: string,
    options: {
      topK?: number;
      filter?: Record<string, any>;
      includeMetadata?: boolean;
      namespace?: string;
    } = {}
  ): Promise<SearchResult[]> {
    if (!this.index) {
      await this.initialize();
    }

    const {
      topK = 10,
      filter,
      includeMetadata = true,
      namespace,
    } = options;

    const cacheKey = `search:${query}:${JSON.stringify(options)}`;

    if (this.config.costOptimization.enableCaching) {
      const cached = await this.cache.get<SearchResult[]>(cacheKey);
      if (cached) return cached;
    }

    try {
      const queryEmbedding = await this.generateEmbedding(query);

      const queryResponse = await this.index.namespace(namespace || '').query({
        vector: queryEmbedding,
        topK,
        includeMetadata,
        filter,
      });

      const results: SearchResult[] = queryResponse.matches.map((match: any) => ({
        id: match.id,
        content: match.metadata?.content || '',
        metadata: match.metadata || {},
        score: match.score || 0,
        highlights: this.generateHighlights(query, match.metadata?.content || ''),
      }));

      if (this.config.costOptimization.enableCaching) {
        await this.cache.set(cacheKey, results, 300);
      }

      return results;
    } catch (error) {
      return this.errorHandler.handleWithFallback(
        error,
        () => this.fallbackSearch(query, options),
        {
          service: 'SemanticSearch',
          operation: 'search',
          metadata: { query },
        }
      );
    }
  }

  async hybridSearch(
    query: string,
    options: {
      semanticWeight?: number;
      keywordWeight?: number;
      topK?: number;
      filter?: Record<string, any>;
    } = {}
  ): Promise<SearchResult[]> {
    const {
      semanticWeight = 0.7,
      keywordWeight = 0.3,
      topK = 10,
      filter,
    } = options;

    const [semanticResults, keywordResults] = await Promise.all([
      this.search(query, { topK: topK * 2, filter }),
      this.keywordSearch(query, { topK: topK * 2, filter }),
    ]);

    const scoreMap = new Map<string, number>();
    const resultMap = new Map<string, SearchResult>();

    semanticResults.forEach((result) => {
      const score = result.score * semanticWeight;
      scoreMap.set(result.id, score);
      resultMap.set(result.id, result);
    });

    keywordResults.forEach((result) => {
      const existingScore = scoreMap.get(result.id) || 0;
      const newScore = existingScore + result.score * keywordWeight;
      scoreMap.set(result.id, newScore);
      if (!resultMap.has(result.id)) {
        resultMap.set(result.id, result);
      }
    });

    const combinedResults = Array.from(resultMap.values())
      .map((result) => ({
        ...result,
        score: scoreMap.get(result.id) || 0,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return combinedResults;
  }

  private async keywordSearch(
    query: string,
    options: {
      topK?: number;
      filter?: Record<string, any>;
    } = {}
  ): Promise<SearchResult[]> {
    const keywords = query.toLowerCase().split(/\s+/).filter(k => k.length > 2);

    if (!this.index) {
      return [];
    }

    try {
      const results = await this.index.namespace('').query({
        vector: new Array(1536).fill(0),
        topK: options.topK || 10,
        includeMetadata: true,
        filter: {
          ...options.filter,
          $or: keywords.map(keyword => ({
            content: { $contains: keyword },
          })),
        },
      });

      return results.matches.map((match: any) => {
        const content = match.metadata?.content || '';
        const keywordScore = this.calculateKeywordScore(keywords, content);

        return {
          id: match.id,
          content,
          metadata: match.metadata || {},
          score: keywordScore,
          highlights: this.generateHighlights(query, content),
        };
      });
    } catch (error) {
      console.error('Keyword search error:', error);
      return [];
    }
  }

  private calculateKeywordScore(keywords: string[], content: string): number {
    const lowerContent = content.toLowerCase();
    let score = 0;

    keywords.forEach(keyword => {
      const occurrences = (lowerContent.match(new RegExp(keyword, 'g')) || []).length;
      score += occurrences * (1 / keywords.length);
    });

    return Math.min(score / 10, 1);
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text.substring(0, 8000),
      });

      return response.data[0].embedding;
    } catch (error) {
      this.errorHandler.handleError(error, {
        service: 'SemanticSearch',
        operation: 'generateEmbedding',
      });
      throw error;
    }
  }

  private generateHighlights(query: string, content: string): string[] {
    const words = query.toLowerCase().split(/\s+/);
    const sentences = content.split(/[.!?]+/);
    const highlights: string[] = [];

    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      const hasMatch = words.some(word => lowerSentence.includes(word));

      if (hasMatch && sentence.trim().length > 20) {
        highlights.push(sentence.trim());
      }
    });

    return highlights.slice(0, 3);
  }

  private fallbackSearch(
    query: string,
    options: any
  ): SearchResult[] {
    console.warn('Falling back to basic search implementation');

    return [
      {
        id: 'fallback-1',
        content: 'Search service is temporarily unavailable. Please try again later.',
        metadata: { fallback: true },
        score: 0.5,
        highlights: [],
      },
    ];
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  async deleteDocument(id: string): Promise<void> {
    if (!this.index) {
      await this.initialize();
    }

    await this.index.deleteOne(id);
    await this.cache.delete('search:*');
  }

  async deleteAllDocuments(namespace?: string): Promise<void> {
    if (!this.index) {
      await this.initialize();
    }

    await this.index.namespace(namespace || '').deleteAll();
    await this.cache.delete('search:*');
  }
}
