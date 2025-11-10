type IndexMetadata = {
  vectors: Map<string, {
    id: string;
    values: number[];
    metadata: Record<string, any>;
  }>;
};

type QueryOptions = {
  topK?: number;
  includeMetadata?: boolean;
};

export class Pinecone {
  private indexes = new Map<string, IndexMetadata>();

  constructor(_config: Record<string, unknown>) {}

  listIndexes = async () => ({
    indexes: Array.from(this.indexes.entries()).map(([name]) => ({
      name,
      status: { ready: true },
    })),
  });

  createIndex = async ({ name }: { name: string }) => {
    if (!this.indexes.has(name)) {
      this.indexes.set(name, {
        vectors: new Map(),
      });
    }
  };

  index = (name: string) => {
    if (!this.indexes.has(name)) {
      this.indexes.set(name, {
        vectors: new Map(),
      });
    }

    const store = this.indexes.get(name)!;

    const query = async ({ topK = 10, includeMetadata = true }: QueryOptions & { vector: number[] }) => {
      const matches = Array.from(store.vectors.values()).map((entry) => ({
        id: entry.id,
        score: 0.5,
        metadata: includeMetadata ? entry.metadata : undefined,
      }));

      return {
        matches: matches.slice(0, topK),
      };
    };

    return {
      upsert: async (vectors: Array<{ id: string; values: number[]; metadata: Record<string, any> }>) => {
        vectors.forEach((vector) => {
          store.vectors.set(vector.id, vector);
        });
      },
      namespace: (namespaceName: string) => ({
        query,
        deleteAll: async () => {
          store.vectors.clear();
        },
      }),
      deleteOne: async (id: string) => {
        store.vectors.delete(id);
      },
    };
  };
}
