// @ts-nocheck - Optional Redis dependency
import { createHash } from "crypto";
import { createClient, RedisClientType } from "redis";

const SAFE_CACHE_KEY_PATTERN = /^[A-Za-z0-9:._-]+$/;
const MAX_SAFE_CACHE_KEY_LENGTH = 160;
const FALLBACK_TTL_SECONDS = 60;
type RedisClientFactory = (options: { url: string }) => RedisClientType;

export class CacheService {
  private client: RedisClientType | null = null;
  private connected = false;
  private memoryCache: Map<string, { value: any; expiry: number }> = new Map();

  constructor(
    private config: { url: string; ttl: number },
    private clientFactory: RedisClientFactory = createClient as RedisClientFactory
  ) {}

  async connect(): Promise<void> {
    if (this.connected) return;

    try {
      this.client = this.clientFactory({ url: this.config.url });
      this.client.on("error", () => {
        this.connected = false;
      });

      await this.client.connect();
      this.connected = true;
    } catch {
      this.connected = false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const cacheKey = this.normalizeKey(key);

    try {
      if (this.connected && this.client) {
        const value = await this.client.get(cacheKey);
        return value ? JSON.parse(value) : null;
      } else {
        const cached = this.memoryCache.get(cacheKey);
        if (cached && cached.expiry > Date.now()) {
          return cached.value;
        }
        this.memoryCache.delete(cacheKey);
        return null;
      }
    } catch {
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const cacheKey = this.normalizeKey(key);
    const ttlSeconds = this.normalizeTtl(ttl);

    try {
      if (this.connected && this.client) {
        await this.client.setEx(cacheKey, ttlSeconds, JSON.stringify(value));
      } else {
        this.memoryCache.set(cacheKey, {
          value,
          expiry: Date.now() + ttlSeconds * 1000,
        });

        this.cleanupMemoryCache();
      }
    } catch {
      this.memoryCache.set(cacheKey, {
        value,
        expiry: Date.now() + ttlSeconds * 1000,
      });
    }
  }

  async delete(key: string): Promise<void> {
    const cacheKey = this.normalizeKey(key);

    try {
      if (this.connected && this.client) {
        await this.client.del(cacheKey);
      } else {
        this.memoryCache.delete(cacheKey);
      }
    } catch {
      this.memoryCache.delete(cacheKey);
    }
  }

  async flush(): Promise<void> {
    try {
      if (this.connected && this.client) {
        await this.client.flushAll();
      } else {
        this.memoryCache.clear();
      }
    } catch {
      this.memoryCache.clear();
    }
  }

  private normalizeKey(key: string): string {
    const value = String(key);

    if (
      value.length > 0 &&
      value.length <= MAX_SAFE_CACHE_KEY_LENGTH &&
      SAFE_CACHE_KEY_PATTERN.test(value)
    ) {
      return value;
    }

    return `hashed:${createHash("sha256").update(value).digest("hex")}`;
  }

  private normalizeTtl(ttl?: number): number {
    const ttlSeconds = ttl ?? this.config.ttl;

    if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
      return FALLBACK_TTL_SECONDS;
    }

    return Math.floor(ttlSeconds);
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
