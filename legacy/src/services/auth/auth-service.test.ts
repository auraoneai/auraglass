jest.mock(
  "jsonwebtoken",
  () => ({
    sign: jest.fn(),
    verify: jest.fn(),
    decode: jest.fn(),
    TokenExpiredError: class TokenExpiredError extends Error {},
    JsonWebTokenError: class JsonWebTokenError extends Error {},
  }),
  { virtual: true }
);

jest.mock(
  "bcryptjs",
  () => ({
    hash: jest.fn(),
    compare: jest.fn(),
  }),
  { virtual: true }
);

import { AuthService } from "./auth-service";

describe("AuthService security defaults", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("requires JWT_SECRET outside test environments", () => {
    delete process.env.JWT_SECRET;
    process.env.NODE_ENV = "production";

    expect(() => new AuthService()).toThrow(
      "JWT_SECRET is required to initialize AuthService"
    );
  });

  it("generates cryptographically random API keys accepted by the validator", () => {
    process.env.NODE_ENV = "test";
    const authService = new AuthService();

    const keys = new Set(
      Array.from({ length: 64 }, () => authService.generateApiKey())
    );

    expect(keys.size).toBe(64);

    for (const key of keys) {
      expect(key).toMatch(/^ak_[a-f0-9]{48}$/);
      expect(authService.validateApiKey(key)).toBe(true);
    }
  });
});
