/**
 * AuraGlass AI API Client
 *
 * Easy-to-use client for accessing production AI features from React components.
 * Handles authentication, error handling, and request/response formatting.
 */

export interface AIClientConfig {
  apiUrl?: string;
  wsUrl?: string;
  getAuthToken?: () => Promise<string | null>;
  onError?: (error: Error) => void;
}

export class AIClientError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly provider?: string;
  readonly feature?: string;
  readonly docsUrl?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    options: {
      status?: number;
      code?: string;
      provider?: string;
      feature?: string;
      docsUrl?: string;
      details?: unknown;
    } = {}
  ) {
    super(message);
    this.name = "AIClientError";
    this.status = options.status;
    this.code = options.code;
    this.provider = options.provider;
    this.feature = options.feature;
    this.docsUrl = options.docsUrl;
    this.details = options.details;
  }
}

export interface FormFieldSuggestion {
  fieldName: string;
  fieldType:
    | "text"
    | "email"
    | "password"
    | "number"
    | "date"
    | "select"
    | "checkbox"
    | "radio"
    | "textarea"
    | "file";
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    customMessage?: string;
  };
  options?: Array<{ value: string; label: string }>;
}

export interface SearchResult {
  id: string;
  content: string;
  metadata: Record<string, any>;
  score: number;
  highlights?: string[];
}

export interface ImageAnalysis {
  faces?: Array<{
    boundingBox: { left: number; top: number; width: number; height: number };
    confidence: number;
    emotions: { joy: number; sorrow: number; anger: number; surprise: number };
  }>;
  objects?: Array<{
    name: string;
    confidence: number;
    boundingBox: { left: number; top: number; width: number; height: number };
  }>;
  text?: {
    text: string;
    confidence: number;
    blocks: Array<{ text: string; confidence: number; boundingBox: any }>;
  };
  labels?: Array<{ description: string; score: number }>;
  safeSearch?: {
    adult: string;
    violence: string;
    medical: string;
  };
  colors?: Array<{
    color: { red: number; green: number; blue: number };
    score: number;
    pixelFraction: number;
  }>;
}

class AIClient {
  private config: Required<AIClientConfig>;
  private authToken: string | null = null;

  constructor(config: AIClientConfig = {}) {
    this.config = {
      apiUrl:
        config.apiUrl ||
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:3002",
      wsUrl:
        config.wsUrl || process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001",
      getAuthToken:
        config.getAuthToken || (() => Promise.resolve(this.authToken)),
      onError: config.onError || (() => undefined),
    };
  }

  /**
   * Set authentication token for API requests
   */
  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  /**
   * Make authenticated API request
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const token = await this.config.getAuthToken();
      const url = `${this.config.apiUrl}${endpoint}`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: response.statusText }));
        throw new AIClientError(
          error.message ||
            error.error ||
            response.statusText ||
            "Request failed",
          {
            status: response.status,
            code: error.code,
            provider: error.provider,
            feature: error.feature,
            docsUrl: error.docsUrl,
            details: error,
          }
        );
      }

      return await response.json();
    } catch (error) {
      this.config.onError(error as Error);
      throw error;
    }
  }

  // ============================================
  // Authentication Methods
  // ============================================

  /**
   * Login with email and password
   */
  async login(
    email: string,
    password: string
  ): Promise<{
    token: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name?: string;
      role: string;
      permissions: string[];
    };
  }> {
    const result = await this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    this.authToken = (result as any).token;
    return result as any;
  }

  /**
   * Register new user
   */
  async register(email: string, password: string, name?: string) {
    const result = await this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });

    this.authToken = (result as any).token;
    return result;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    const result = await this.request<{ token: string }>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });

    this.authToken = result.token;
    return result;
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await this.request("/api/auth/logout", { method: "POST" });
    this.authToken = null;
  }

  // ============================================
  // AI Methods
  // ============================================

  /**
   * Generate smart form fields based on context
   *
   * @example
   * const fields = await client.generateFormFields('user registration form');
   */
  async generateFormFields(
    context: string,
    existingFields: FormFieldSuggestion[] = []
  ): Promise<FormFieldSuggestion[]> {
    const result = await this.request<{ fields: FormFieldSuggestion[] }>(
      "/api/ai/generate-form",
      {
        method: "POST",
        body: JSON.stringify({ context, existingFields }),
      }
    );

    return result.fields;
  }

  /**
   * Perform semantic search with AI-enhanced query
   *
   * @example
   * const results = await client.search('how to add glassmorphism', { limit: 10 });
   */
  async search(
    query: string,
    options: {
      limit?: number;
      semanticWeight?: number;
      keywordWeight?: number;
    } = {}
  ): Promise<{
    results: SearchResult[];
    enhancedQuery: string;
    intent: string;
    totalResults: number;
  }> {
    return await this.request("/api/ai/search", {
      method: "POST",
      body: JSON.stringify({ query, options }),
    });
  }

  /**
   * Index documents for semantic search
   *
   * @example
   * await client.indexDocuments([
   *   { id: '1', content: 'Document content...', title: 'Doc 1' }
   * ]);
   */
  async indexDocuments(
    documents: Array<{
      id: string;
      content: string;
      title?: string;
      metadata?: Record<string, any>;
      tags?: string[];
    }>
  ): Promise<{ success: boolean; indexed: number }> {
    return await this.request("/api/ai/index-documents", {
      method: "POST",
      body: JSON.stringify({ documents }),
    });
  }

  /**
   * Analyze image with Google Vision API
   *
   * @example
   * const analysis = await client.analyzeImage(base64Image, ['faces', 'objects']);
   */
  async analyzeImage(
    imageData: string,
    analysisTypes: ("faces" | "objects" | "text" | "labels" | "all")[] = ["all"]
  ): Promise<ImageAnalysis> {
    const result = await this.request<{ analysis: ImageAnalysis }>(
      "/api/ai/analyze-image",
      {
        method: "POST",
        body: JSON.stringify({ image: imageData, analysisTypes }),
      }
    );

    return result.analysis;
  }

  /**
   * Remove background from image
   *
   * @example
   * const processedImage = await client.removeBackground(base64Image);
   */
  async removeBackground(imageData: string): Promise<string> {
    const result = await this.request<{ image: string }>(
      "/api/ai/remove-background",
      {
        method: "POST",
        body: JSON.stringify({ image: imageData }),
      }
    );

    return result.image;
  }

  /**
   * Generate content summary
   *
   * @example
   * const summary = await client.summarize(longText, 200);
   */
  async summarize(content: string, maxLength: number = 200): Promise<string> {
    const result = await this.request<{ summary: string }>(
      "/api/ai/summarize",
      {
        method: "POST",
        body: JSON.stringify({ content, maxLength }),
      }
    );

    return result.summary;
  }

  /**
   * Check server health
   */
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
    uptime: number;
    services: Record<string, boolean>;
    features: Record<string, boolean>;
  }> {
    // Health check doesn't require authentication
    const url = `${this.config.apiUrl}/health`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Health check failed");
    }

    return await response.json();
  }
}

// Export singleton instance
export const aiClient = new AIClient();

// Export class for custom instances
export default AIClient;
