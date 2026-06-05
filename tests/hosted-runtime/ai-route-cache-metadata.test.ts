import http, { Server } from "http";
import { AddressInfo } from "net";
import { TextDecoder, TextEncoder } from "util";

const mockOpenAICreate = jest.fn();

jest.mock("openai", () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: mockOpenAICreate,
      },
    },
  })),
}));

type JsonResponse<TBody = any> = {
  status: number;
  body: TBody;
};

const originalEnv = process.env;
const jwtSecret = "auraglass-ai-route-cache-metadata-secret";

let server: Server | undefined;
let baseUrl = "";
let logSpy: jest.SpyInstance | undefined;

function requestJson<TBody = any>(
  path: string,
  options: {
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
        method: "POST",
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
          resolve({
            status: res.statusCode || 0,
            body: rawBody ? JSON.parse(rawBody) : undefined,
          });
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
    ENABLE_SMART_FORMS: "true",
    ENABLE_AI_CACHING: "true",
    OPENAI_API_KEY: "sk-test-route-cache",
    OPENAI_MODEL: "gpt-4-turbo",
    REDIS_URL: "redis://cache.example.test:6379",
    RATE_LIMIT_MAX_REQUESTS: "1000",
    SENTRY_DSN: "",
  };

  mockOpenAICreate.mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({
            fields: [
              {
                fieldName: "email",
                fieldType: "email",
                label: "Email",
                required: true,
              },
            ],
          }),
        },
      },
    ],
  });

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

describe("Hosted AI route cache metadata", () => {
  it("returns cached false on the first form-generation response and cached true on the repeated response", async () => {
    const login = await requestJson<{ token: string }>("/api/auth/login", {
      body: {
        email: "cache-metadata@example.test",
        password: "cache-metadata-password",
      },
    });

    expect(login.status).toBe(200);

    const payload = {
      context: "Newsletter signup form",
      existingFields: [],
    };

    const first = await requestJson<{
      fields: unknown[];
      cached: boolean;
      usage: Record<string, unknown>;
    }>("/api/ai/generate-form", {
      body: payload,
      token: login.body.token,
    });

    expect(first).toMatchObject({
      status: 200,
      body: {
        fields: expect.any(Array),
        cached: false,
        usage: expect.objectContaining({
          provider: "openai",
          feature: "smart form generation",
          model: "gpt-4-turbo",
          cached: false,
          promptTokensEstimate: expect.any(Number),
          completionTokensEstimate: expect.any(Number),
          estimatedCostUsd: expect.any(Number),
        }),
      },
    });
    expect(JSON.stringify(first.body.usage)).not.toContain(payload.context);

    const second = await requestJson<{
      fields: unknown[];
      cached: boolean;
      usage: Record<string, unknown>;
    }>("/api/ai/generate-form", {
      body: payload,
      token: login.body.token,
    });

    expect(second).toMatchObject({
      status: 200,
      body: {
        fields: first.body.fields,
        cached: true,
        usage: expect.objectContaining({
          provider: "openai",
          feature: "smart form generation",
          cached: true,
          promptTokensEstimate: 0,
          completionTokensEstimate: 0,
          estimatedCostUsd: 0,
        }),
      },
    });
    expect(mockOpenAICreate).toHaveBeenCalledTimes(1);
  });
});
