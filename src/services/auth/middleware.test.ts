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

import { AuthMiddleware } from "./middleware";
import { AuthService, TokenPayload } from "./auth-service";

const tokenPayload: TokenPayload = {
  userId: "user-1",
  email: "user@example.com",
  role: "user",
  permissions: [],
};

const createAuthService = () =>
  ({
    verifyToken: jest.fn(() => tokenPayload),
    validateApiKey: jest.fn(() => true),
    hasPermission: jest.fn(() => true),
    hasAnyPermission: jest.fn(() => true),
  }) as unknown as jest.Mocked<AuthService>;

const createResponse = () =>
  ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }) as any;

describe("AuthMiddleware credential extraction", () => {
  it("authenticates bearer tokens from the Authorization header", async () => {
    const authService = createAuthService();
    const middleware = new AuthMiddleware(authService);
    const req = {
      headers: { authorization: "Bearer header-token" },
      cookies: {},
      query: {},
    } as any;
    const res = createResponse();
    const next = jest.fn();

    await middleware.authenticate(req, res, next);

    expect(authService.verifyToken).toHaveBeenCalledWith("header-token");
    expect(req.user).toEqual(tokenPayload);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("authenticates cookie tokens for browser sessions", async () => {
    const authService = createAuthService();
    const middleware = new AuthMiddleware(authService);
    const req = {
      headers: {},
      cookies: { token: "cookie-token" },
      query: {},
    } as any;
    const res = createResponse();
    const next = jest.fn();

    await middleware.authenticate(req, res, next);

    expect(authService.verifyToken).toHaveBeenCalledWith("cookie-token");
    expect(req.user).toEqual(tokenPayload);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects query-string JWTs so credentials are not accepted from URLs", async () => {
    const authService = createAuthService();
    const middleware = new AuthMiddleware(authService);
    const req = {
      headers: {},
      cookies: {},
      query: { token: "query-token" },
    } as any;
    const res = createResponse();
    const next = jest.fn();

    await middleware.authenticate(req, res, next);

    expect(authService.verifyToken).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "No authentication token provided",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("authenticates API keys from the x-api-key header", async () => {
    const authService = createAuthService();
    const middleware = new AuthMiddleware(authService);
    const req = {
      headers: { "x-api-key": "ak_headerkey123456789012345" },
      query: {},
    } as any;
    const res = createResponse();
    const next = jest.fn();

    await middleware.authenticateApiKey(req, res, next);

    expect(authService.validateApiKey).toHaveBeenCalledWith(
      "ak_headerkey123456789012345"
    );
    expect(req.apiKey).toBe("ak_headerkey123456789012345");
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("rejects query-string API keys so credentials are not accepted from URLs", async () => {
    const authService = createAuthService();
    const middleware = new AuthMiddleware(authService);
    const req = {
      headers: {},
      query: { apiKey: "ak_querykey1234567890123456" },
    } as any;
    const res = createResponse();
    const next = jest.fn();

    await middleware.authenticateApiKey(req, res, next);

    expect(authService.validateApiKey).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No API key provided" });
    expect(next).not.toHaveBeenCalled();
  });
});
