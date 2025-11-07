import { createClient, RedisClientType } from 'redis';

export class CacheService {
  private client: RedisClientType | null = null;
  private connected = false;
  private memoryCache: Map<string, { value: any; expiry: number }> = new Map();

  constructor(private config: { url: string; ttl: number }) {}

  async connect(): Promise<void> {
    if (this.connected) return;

    try {
      this.client = createClient({ url: this.config.url });
      this.client.on('error', (err: Error) => {
        console.warn('Redis client error, falling back to memory cache:', err.message);
        this.connected = false;
      });

      await this.client.connect();
      this.connected = true;
    } catch (error) {
      console.warn('Failed to connect to Redis, using memory cache:', error);
      this.connected = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.connected && this.client) {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        const cached = this.memoryCache.get(key);
        if (cached && cached.expiry > Date.now()) {
          return cached.value;
        }
        this.memoryCache.delete(key);
        return null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const ttlSeconds = ttl || this.config.ttl;

    try {
      if (this.connected && this.client) {
        await this.client.setEx(key, ttlSeconds, JSON.stringify(value));
      } else {
        this.memoryCache.set(key, {
          value,
          expiry: Date.now() + ttlSeconds * 1000,
        });

        this.cleanupMemoryCache();
      }
    } catch (error) {
      console.error('Cache set error:', error);
      this.memoryCache.set(key, {
        value,
        expiry: Date.now() + ttlSeconds * 1000,
      });
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (this.connected && this.client) {
        await this.client.del(key);
      } else {
        this.memoryCache.delete(key);
      }
    } catch (error) {
      console.error('Cache delete error:', error);
      this.memoryCache.delete(key);
    }
  }

  async flush(): Promise<void> {
    try {
      if (this.connected && this.client) {
        await this.client.flushAll();
      } else {
        this.memoryCache.clear();
      }
    } catch (error) {
      console.error('Cache flush error:', error);
      this.memoryCache.clear();
    }
  }

  private cleanupMemoryCache(): void {
    if (this.memoryCache.size > 1000) {
      const now = Date.now();
      const entries = Array.from(this.memoryCache.entries());

      const expired = entries.filter(([, data]) => data.expiry <= now);
      expired.forEach(([key]) => this.memoryCache.delete(key));

      if (this.memoryCache.size > 500) {
        const sorted = entries
          .filter(([, data]) => data.expiry > now)
          .sort((a, b) => a[1].expiry - b[1].expiry);

        const toRemove = sorted.slice(0, Math.floor(sorted.length / 2));
        toRemove.forEach(([key]) => this.memoryCache.delete(key));
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.connected = false;
      this.client = null;
    }
  }
}
