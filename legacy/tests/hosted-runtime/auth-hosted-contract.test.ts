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

jest.mock(
  "express-rate-limit",
  () => ({
    __esModule: true,
    default: jest.fn(() => jest.fn()),
  }),
  { virtual: true }
);

import { AuthMiddleware } from "../../src/services/auth/middleware";
import { AuthError, AuthService, TokenPayload } from "../../src/services/auth/auth-service";
import { readRepoFile } from "./helpers/hostedRuntimeContracts";

const tokenPayload: TokenPayload = {
  userId: "user-1",
  email: "user@example.test",
  role: "developer",
  permissions: ["ai:use_openai"],
};

const createAuthService = (overrides: Partial<jest.Mocked<AuthService>> = {}) =>
  ({
    verifyToken: jest.fn(() => tokenPayload),
    validateApiKey: jest.fn(() => true),
    hasPermission: jest.fn(() => true),
    hasAnyPermission: jest.fn(() => true),
    ...overrides,
  }) as unknown as jest.Mocked<AuthService>;

const createResponse = () =>
  ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  }) as any;

describe("Hosted JWT and protected route contract", () => {
  it("rejects missing bearer tokens on protected routes", async () => {
    const authService = createAuthService();
    const middleware = new AuthMiddleware(authService);
    const req = { headers: {}, cookies: {}, query: {} } as any;
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

  it("rejects invalid bearer tokens with a typed auth error", async () => {
    const authService = createAuthService({
      verifyToken: jest.fn(() => {
        throw new AuthError("Invalid token", "INVALID_TOKEN", 401);
      }),
    });
    const middleware = new AuthMiddleware(authService);
    const req = {
      headers: { authorization: "Bearer bad-token" },
      cookies: {},
      query: {},
    } as any;
    const res = createResponse();
    const next = jest.fn();

    await middleware.authenticate(req, res, next);

    expect(authService.verifyToken).toHaveBeenCalledWith("bad-token");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Invalid token",
      code: "INVALID_TOKEN",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects expired bearer tokens with a typed auth error", async () => {
    const authService = createAuthService({
      verifyToken: jest.fn(() => {
        throw new AuthError("Token expired", "TOKEN_EXPIRED", 401);
      }),
    });
    const middleware = new AuthMiddleware(authService);
    const req = {
      headers: { authorization: "Bearer expired-token" },
      cookies: {},
      query: {},
    } as any;
    const res = createResponse();
    const next = jest.fn();

    await middleware.authenticate(req, res, next);

    expect(authService.verifyToken).toHaveBeenCalledWith("expired-token");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: "Token expired",
      code: "TOKEN_EXPIRED",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("passes valid bearer tokens to downstream protected routes", async () => {
    const authService = createAuthService();
    const middleware = new AuthMiddleware(authService);
    const req = {
      headers: { authorization: "Bearer valid-token" },
      cookies: {},
      query: {},
    } as any;
    const res = createResponse();
    const next = jest.fn();

    await middleware.authenticate(req, res, next);

    expect(req.user).toEqual(tokenPayload);
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("rejects protected routes when the authenticated token lacks permissions", async () => {
    const authService = createAuthService({
      hasPermission: jest.fn(() => false),
    });
    const middleware = new AuthMiddleware(authService);
    const req = { user: tokenPayload } as any;
    const res = createResponse();
    const next = jest.fn();

    await middleware.requirePermission("collab:edit_document" as any)(
      req,
      res,
      next
    );

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Insufficient permissions",
      required: "collab:edit_document",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("Hosted auth service route contract", () => {
  it("implements every auth method used by server/index.ts routes", () => {
    const prototype = AuthService.prototype as any;

    for (const method of ["login", "register", "refreshToken", "revokeToken"]) {
      expect(typeof prototype[method]).toBe("function");
    }
  });
});

describe("Demo auth production guard", () => {
  const demoServerSource = readRepoFile("server/api-server.js");

  it("requires an explicit local-demo flag and forbids demo auth in production", () => {
    expect(/ENABLE_DEMO_AUTH/.test(demoServerSource)).toBe(true);
    expect(/NODE_ENV/.test(demoServerSource)).toBe(true);
    expect(/production/.test(demoServerSource)).toBe(true);
    expect(
      /const enableDemoAuth = process\.env\.ENABLE_DEMO_AUTH === 'true';/.test(
        demoServerSource
      )
    ).toBe(false);
  });
});
