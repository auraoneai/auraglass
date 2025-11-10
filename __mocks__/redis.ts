type RedisValue = any;

class MockRedisClient {
  private store = new Map<string, RedisValue>();

  connect = async () => undefined;
  disconnect = async () => undefined;
  quit = async () => undefined;

  get = async (key: string) => this.store.get(key) ?? null;
  set = async (key: string, value: RedisValue, _options?: any) => {
    this.store.set(key, value);
  };
  setEx = async (key: string, ttl: number, value: RedisValue) => {
    this.store.set(key, value);
  };
  del = async (key: string) => {
    this.store.delete(key);
  };
  flushAll = async () => {
    this.store.clear();
  };
  on = (_event: string, _callback: (...args: any[]) => void) => this;
}

export const createClient = (_options?: any) => new MockRedisClient();

export type RedisClientType = MockRedisClient;
