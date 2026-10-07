import http, { Server } from "http";
import { AddressInfo } from "net";
import { TextDecoder, TextEncoder } from "util";
import * as jwt from "jsonwebtoken";

type JsonResponse<TBody = any> = {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: TBody;
};

type SessionPayload = {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    permissions: string[];
    passwordHash?: string;
  };
};

const originalEnv = process.env;
const jwtSecret = "auraglass-hosted-auth-route-flow-secret";

let server: Server | undefined;
let baseUrl = "";
let logSpy: jest.SpyInstance | undefined;

function requestJson<TBody = any>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    token?: string;
  } = {}
): Promise<JsonResponse<TBody>> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const serializedBody =
      options.body === undefined ? undefined : JSON.stringify(options.body);

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method: options.method || "POST",
        headers: {
          Accept: "application/json",
          ...(serializedBody
            ? {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(serializedBody),
              }
            : {}),
          ...(options.token
            ? {
                Authorization: `Bearer ${options.token}`,
              }
            : {}),
        },
      },
      (res) => {
        let rawBody = "";

        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          rawBody += chunk;
        });
        res.on("end", () => {
          try {
            resolve({
              status: res.statusCode || 0,
              headers: res.headers,
              body: rawBody ? JSON.parse(rawBody) : undefined,
            });
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on("error", reject);

    if (serializedBody) {
      req.write(serializedBody);
    }

    req.end();
  });
}

function createExpiredAccessToken(): string {
  return jwt.sign(
    {
      userId: "expired-user",
      email: "expired@example.test",
      role: "developer",
      permissions: ["ai:use_openai"],
    },
    jwtSecret,
    { expiresIn: -1 }
  );
}

function uniqueEmail(prefix: string): string {
  return `${prefix}.${Date.now()}.${Math.random()
    .toString(16)
    .slice(2)}@example.test`;
}

beforeAll(async () => {
  jest.resetModules();
  logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
  (globalThis as any).TextDecoder = TextDecoder;
  (globalThis as any).TextEncoder = TextEncoder;

  process.env = {
    ...originalEnv,
    NODE_ENV: "test",
    JWT_SECRET: jwtSecret,
    ENABLE_DEMO_AUTH: "true",
    ENABLE_AI_CACHING: "false",
    OPENAI_API_KEY: "",
    PINECONE_API_KEY: "",
    GOOGLE_VISION_API_KEY: "",
    GOOGLE_APPLICATION_CREDENTIALS: "",
    GOOGLE_CLOUD_PROJECT_ID: "",
    REMOVEBG_API_KEY: "",
    RATE_LIMIT_MAX_REQUESTS: "1000",
    SENTRY_DSN: "",
  };

  const hostedServer = await import("../../server/index");
  server = await hostedServer.startServer(0);
  const address = server.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterAll(async () => {
  if (server?.listening) {
    await new Promise<void>((resolve, reject) => {
      server?.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }

  process.env = originalEnv;
  logSpy?.mockRestore();
});

describe("Hosted auth route flow", () => {
  it("validates required auth route inputs at the HTTP boundary", async () => {
    await expect(requestJson("/api/auth/login", { body: {} })).resolves.toMatchObject({
      status: 400,
      body: { error: "Email and password are required" },
    });

    await expect(
      requestJson("/api/auth/register", { body: { email: "missing-password@example.test" } })
    ).resolves.toMatchObject({
      status: 400,
      body: { error: "Email and password are required" },
    });

    await expect(requestJson("/api/auth/refresh", { body: {} })).resolves.toMatchObject({
      status: 400,
      body: { error: "Refresh token is required" },
    });

    await expect(requestJson("/api/auth/logout", { body: {} })).resolves.toMatchObject({
      status: 401,
      body: { error: "Authentication required" },
    });
  });

  it("registers a demo user, refreshes the session, and revokes the access token on logout", async () => {
    const email = uniqueEmail("register-flow");

    const register = await requestJson<SessionPayload>("/api/auth/register", {
      body: {
        email: email.toUpperCase(),
        password: "correct-horse-battery-staple",
        name: "Route Flow User",
      },
    });

    expect(register.status).toBe(200);
    expect(register.body).toEqual({
      token: expect.any(String),
      refreshToken: expect.any(String),
      user: expect.objectContaining({
        id: expect.stringMatching(/^demo_/),
        email,
        name: "Route Flow User",
        role: "developer",
        permissions: expect.arrayContaining([
          "ai:use_openai",
          "ai:use_vision",
          "ai:use_embeddings",
          "collab:join_room",
        ]),
      }),
    });
    expect(register.body.user.passwordHash).toBeUndefined();

    const duplicateRegister = await requestJson("/api/auth/register", {
      body: {
        email,
        password: "correct-horse-battery-staple",
      },
    });

    expect(duplicateRegister).toMatchObject({
      status: 409,
      body: {
        error: "User already exists",
        code: "USER_EXISTS",
      },
    });

    const refresh = await requestJson<{ token: string }>("/api/auth/refresh", {
      body: { refreshToken: register.body.refreshToken },
    });

    expect(refresh).toMatchObject({
      status: 200,
      body: { token: expect.any(String) },
    });

    const authenticatedAiRoute = await requestJson("/api/ai/summarize", {
      body: { content: "Summarize this authenticated route-flow smoke." },
      token: refresh.body.token,
    });

    expect(authenticatedAiRoute).toMatchObject({
      status: 503,
      body: {
        error: "Provider not configured",
        code: "AURA_PROVIDER_UNCONFIGURED",
      },
    });
    expect(authenticatedAiRoute.body).not.toMatchObject({
      error: "Authentication required",
    });

    const logout = await requestJson("/api/auth/logout", {
      token: register.body.token,
    });

    expect(logout).toMatchObject({
      status: 200,
      body: {
        success: true,
        message: "Logged out successfully",
      },
    });

    const revokedAccess = await requestJson("/api/ai/summarize", {
      body: { content: "This revoked access token should not reach AI routes." },
      token: register.body.token,
    });

    expect(revokedAccess).toMatchObject({
      status: 401,
      body: {
        error: "Token revoked",
        code: "TOKEN_REVOKED",
      },
    });
  });

  it("logs in an existing demo user and rejects bad credentials", async () => {
    const email = uniqueEmail("login-flow");
    const password = "login-flow-password";

    const firstLogin = await requestJson<SessionPayload>("/api/auth/login", {
      body: { email, password },
    });

    expect(firstLogin).toMatchObject({
      status: 200,
      body: {
        token: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({
          email,
        }),
      },
    });

    const badPassword = await requestJson("/api/auth/login", {
      body: { email, password: "not-the-password" },
    });

    expect(badPassword).toMatchObject({
      status: 401,
      body: {
        error: "Invalid email or password",
        code: "INVALID_CREDENTIALS",
      },
    });

    const secondLogin = await requestJson<SessionPayload>("/api/auth/login", {
      body: { email, password },
    });

    expect(secondLogin).toMatchObject({
      status: 200,
      body: {
        token: expect.any(String),
        refreshToken: expect.any(String),
        user: expect.objectContaining({
          email,
        }),
      },
    });
  });

  it("rejects invalid refresh tokens", async () => {
    const refresh = await requestJson("/api/auth/refresh", {
      body: { refreshToken: "not-a-refresh-token" },
    });

    expect(refresh).toMatchObject({
      status: 401,
      body: {
        error: "Invalid refresh token",
        code: "INVALID_REFRESH_TOKEN",
      },
    });
  });

  it("keeps protected routes covered for missing, invalid, and expired bearer tokens", async () => {
    await expect(
      requestJson("/api/ai/summarize", {
        body: { content: "missing token" },
      })
    ).resolves.toMatchObject({
      status: 401,
      body: { error: "Authentication required" },
    });

    await expect(
      requestJson("/api/ai/summarize", {
        body: { content: "invalid token" },
        token: "not-a-jwt",
      })
    ).resolves.toMatchObject({
      status: 401,
      body: {
        error: "Invalid token",
        code: "INVALID_TOKEN",
      },
    });

    await expect(
      requestJson("/api/ai/summarize", {
        body: { content: "expired token" },
        token: createExpiredAccessToken(),
      })
    ).resolves.toMatchObject({
      status: 401,
      body: {
        error: "Token expired",
        code: "TOKEN_EXPIRED",
      },
    });
  });
});
