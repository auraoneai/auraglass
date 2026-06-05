/**
 * @jest-environment node
 */
import net from "net";
import { TextDecoder, TextEncoder } from "util";

Object.assign(globalThis, { TextDecoder, TextEncoder });

const socketIoClient =
  require("socket.io-client") as typeof import("socket.io-client");
const createSocket = socketIoClient.io;
const { NodeWebSocket } =
  require("engine.io-client") as typeof import("engine.io-client");
const jwt = require("jsonwebtoken") as typeof import("jsonwebtoken");

interface MockRedisRecord {
  ttlSeconds: number;
  value: string;
}

interface MockRedisClient {
  disconnected: boolean;
  url: string;
}

const mockRedisStore = new Map<string, MockRedisRecord>();
const mockRedisClients: MockRedisClient[] = [];
const mockRedisCalls: Array<{ method: string; args: unknown[] }> = [];

jest.mock("ws", () =>
  jest.requireActual(`${process.cwd()}/node_modules/ws/index.js`)
);

jest.mock("ioredis", () => {
  return class MockRedis {
    disconnected = false;
    url: string;

    constructor(url: string) {
      this.url = url;
      mockRedisClients.push(this);
    }

    duplicate() {
      return new MockRedis(this.url);
    }

    setex(key: string, ttlSeconds: number, value: string) {
      mockRedisCalls.push({ method: "setex", args: [key, ttlSeconds, value] });
      mockRedisStore.set(key, { ttlSeconds, value });
      return Promise.resolve("OK");
    }

    del(...keys: string[]) {
      let deleted = 0;
      for (const key of keys) {
        if (mockRedisStore.delete(key)) {
          deleted += 1;
        }
      }
      mockRedisCalls.push({ method: "del", args: keys });
      return Promise.resolve(deleted);
    }

    disconnect() {
      this.disconnected = true;
      mockRedisCalls.push({ method: "disconnect", args: [] });
    }
  };
});

type ClientSocket = ReturnType<typeof createSocket>;

interface Harness {
  clients: ClientSocket[];
  exitSpy: jest.SpyInstance;
  port: number;
  shutdownListener?: (...args: unknown[]) => void;
}

const TEST_JWT_FIXTURE = ["auraglass", "websocket", "test", "fixture"].join("-");
const SOCKET_TIMEOUT_MS = 2500;

let harness: Harness | undefined;
const originalEnv = {
  ALLOW_ANONYMOUS_WS: process.env.ALLOW_ANONYMOUS_WS,
  ENABLE_DEMO_AUTH: process.env.ENABLE_DEMO_AUTH,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  REDIS_URL: process.env.REDIS_URL,
  WS_PORT: process.env.WS_PORT,
};

function restoreEnv() {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAvailablePort() {
  return new Promise<number>((resolve, reject) => {
    const probe = net.createServer();
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        probe.close(() => reject(new Error("Unable to allocate test port")));
        return;
      }

      const { port } = address;
      probe.close(() => resolve(port));
    });
  });
}

async function waitForCondition(
  predicate: () => boolean,
  description: string,
  timeoutMs = SOCKET_TIMEOUT_MS
) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (predicate()) {
      return;
    }
    await delay(20);
  }

  throw new Error(`Timed out waiting for ${description}`);
}

async function waitForPort(port: number) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < SOCKET_TIMEOUT_MS) {
    const isOpen = await new Promise<boolean>((resolve) => {
      const socket = net.connect(port, "127.0.0.1");
      socket.once("error", () => {
        socket.destroy();
        resolve(false);
      });
      socket.once("connect", () => {
        socket.end();
        resolve(true);
      });
    });

    if (isOpen) {
      return;
    }

    await delay(20);
  }

  throw new Error(`Timed out waiting for port ${port} to accept connections`);
}

function waitForSocketEvent<T = unknown>(
  socket: ClientSocket,
  eventName: string,
  timeoutMs = SOCKET_TIMEOUT_MS
) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(eventName, handler);
      reject(new Error(`Timed out waiting for socket event ${eventName}`));
    }, timeoutMs);

    const handler = (...args: unknown[]) => {
      clearTimeout(timer);
      resolve((args.length > 1 ? args : args[0]) as T);
    };

    socket.once(eventName, handler);
  });
}

function recordSocketEvents<T = unknown>(socket: ClientSocket, eventName: string) {
  const events: T[] = [];
  const handler = (event: T) => events.push(event);
  socket.on(eventName, handler);

  return {
    events,
    stop: () => socket.off(eventName, handler),
  };
}

function emitWithAck<T>(
  socket: ClientSocket,
  eventName: string,
  ...args: unknown[]
) {
  return new Promise<T>((resolve, reject) => {
    socket
      .timeout(SOCKET_TIMEOUT_MS)
      .emit(eventName, ...args, (error: Error | null, response: T) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(response);
      });
  });
}

async function startHarness() {
  mockRedisStore.clear();
  mockRedisClients.length = 0;
  mockRedisCalls.length = 0;

  jest.resetModules();

  const port = await getAvailablePort();
  process.env.WS_PORT = String(port);
  process.env["JWT_SECRET"] = TEST_JWT_FIXTURE;
  process.env.REDIS_URL = "redis://mock-auraglass-websocket:6379/0";
  process.env.NODE_ENV = "test";
  delete process.env.ALLOW_ANONYMOUS_WS;
  delete process.env.ENABLE_DEMO_AUTH;

  const existingSigtermListeners = process.listeners("SIGTERM");
  const exitSpy = jest
    .spyOn(process, "exit")
    .mockImplementation((() => undefined) as never);
  jest.spyOn(console, "log").mockImplementation(() => undefined);
  jest.spyOn(console, "error").mockImplementation(() => undefined);

  jest.isolateModules(() => {
    require("../../server/websocket-server.js");
  });

  const addedSigtermListeners = process
    .listeners("SIGTERM")
    .filter((listener) => !existingSigtermListeners.includes(listener));
  const shutdownListener = addedSigtermListeners.at(-1) as
    | ((...args: unknown[]) => void)
    | undefined;

  await waitForPort(port);

  harness = {
    clients: [],
    exitSpy,
    port,
    shutdownListener,
  };
}

async function stopHarness() {
  if (!harness) {
    restoreEnv();
    jest.restoreAllMocks();
    return;
  }

  for (const client of harness.clients) {
    client.removeAllListeners();
    client.disconnect();
  }

  await delay(40);

  if (harness.shutdownListener) {
    harness.shutdownListener("SIGTERM");
    await waitForCondition(
      () => harness?.exitSpy.mock.calls.length !== 0,
      "websocket server shutdown"
    );
    process.removeListener("SIGTERM", harness.shutdownListener);
  }

  harness = undefined;
  restoreEnv();
  jest.restoreAllMocks();
}

async function connectClient(userId: string, userName: string) {
  if (!harness) {
    throw new Error("WebSocket harness has not been started");
  }

  const token = jwt.sign({ userId, userName }, TEST_JWT_FIXTURE);
  const socket = createSocket(`http://127.0.0.1:${harness.port}`, {
    auth: { token },
    forceNew: true,
    reconnection: false,
    timeout: SOCKET_TIMEOUT_MS,
    transports: [NodeWebSocket],
  });

  harness.clients.push(socket);

  await Promise.race([
    waitForSocketEvent(socket, "connect"),
    waitForSocketEvent<Error>(socket, "connect_error").then((error) => {
      throw error;
    }),
  ]);

  return socket;
}

function parseStoredJson<T>(key: string): T {
  const record = mockRedisStore.get(key);
  if (!record) {
    throw new Error(`Missing Redis record ${key}`);
  }

  return JSON.parse(record.value) as T;
}

describe("Hosted WebSocket runtime multi-client behavior", () => {
  beforeEach(async () => {
    await startHarness();
  });

  afterEach(async () => {
    await stopHarness();
  });

  it("broadcasts room events to joined peers without leaking to other rooms", async () => {
    const alice = await connectClient("alice", "Alice");
    const bob = await connectClient("bob", "Bob");
    const casey = await connectClient("casey", "Casey");

    const { roomId } = await emitWithAck<{ roomId: string }>(alice, "create-room", {
      initialState: { title: "3.3 launch notes" },
    });

    const aliceSawBobJoin = waitForSocketEvent(alice, "user-joined");
    const bobRoomState = waitForSocketEvent<{
      roomId: string;
      participants: Array<{ userId: string; userName: string }>;
    }>(bob, "room-state");

    await expect(emitWithAck(bob, "join-room", roomId)).resolves.toEqual({
      success: true,
    });

    await expect(aliceSawBobJoin).resolves.toEqual(
      expect.objectContaining({ userId: "bob", userName: "Bob" })
    );
    await expect(bobRoomState).resolves.toEqual(
      expect.objectContaining({
        roomId,
        participants: expect.arrayContaining([
          expect.objectContaining({ userId: "alice", userName: "Alice" }),
          expect.objectContaining({ userId: "bob", userName: "Bob" }),
        ]),
      })
    );

    await expect(emitWithAck(casey, "join-room", "separate-room")).resolves.toEqual({
      success: true,
    });

    const caseyCursorEvents = recordSocketEvents(casey, "cursor-update");
    const bobSawCursor = waitForSocketEvent(bob, "cursor-update");
    alice.emit("cursor-move", { x: 12, y: 34 });

    await expect(bobSawCursor).resolves.toEqual(
      expect.objectContaining({
        userId: "alice",
        userName: "Alice",
        x: 12,
        y: 34,
      })
    );
    await delay(80);
    expect(caseyCursorEvents.events).toEqual([]);
    caseyCursorEvents.stop();

    const caseySelectionEvents = recordSocketEvents(casey, "selection-update");
    const aliceSawSelection = waitForSocketEvent(alice, "selection-update");
    bob.emit("selection-change", { selection: { from: 2, to: 8 } });

    await expect(aliceSawSelection).resolves.toEqual({
      userId: "bob",
      selection: { from: 2, to: 8 },
    });
    await delay(80);
    expect(caseySelectionEvents.events).toEqual([]);
    caseySelectionEvents.stop();

    const caseyPresenceEvents = recordSocketEvents(casey, "presence-update");
    const bobSawPresence = waitForSocketEvent(bob, "presence-update");
    alice.emit("update-presence", { status: "away", mode: "reviewing" });

    await expect(bobSawPresence).resolves.toEqual(
      expect.objectContaining({
        mode: "reviewing",
        status: "away",
        userId: "alice",
      })
    );
    await delay(80);
    expect(caseyPresenceEvents.events).toEqual([]);
    caseyPresenceEvents.stop();
  });

  it("persists room lifecycle and cursor state to Redis with expected TTLs", async () => {
    const alice = await connectClient("alice", "Alice");
    const bob = await connectClient("bob", "Bob");

    const initialState = { blocks: [{ id: "intro", text: "AuraGlass 3.3" }] };
    const { roomId } = await emitWithAck<{ roomId: string }>(
      alice,
      "create-room",
      { initialState }
    );
    const roomKey = `room:${roomId}`;

    expect(mockRedisStore.get(roomKey)).toEqual(
      expect.objectContaining({ ttlSeconds: 3600 })
    );
    expect(
      parseStoredJson<{ documentState: unknown; participants: string[] }>(roomKey)
    ).toEqual({
      documentState: initialState,
      participants: ["alice"],
    });

    await emitWithAck(bob, "join-room", roomId);

    expect(
      parseStoredJson<{ documentState: unknown; participants: string[] }>(roomKey)
    ).toEqual({
      documentState: initialState,
      participants: expect.arrayContaining(["alice", "bob"]),
    });

    bob.emit("cursor-move", { x: 4, y: 9 });
    await waitForCondition(
      () => mockRedisStore.has("cursor:bob"),
      "cursor state to be persisted"
    );

    expect(mockRedisStore.get("cursor:bob")).toEqual(
      expect.objectContaining({ ttlSeconds: 30 })
    );
    expect(parseStoredJson("cursor:bob")).toEqual({
      roomId,
      x: 4,
      y: 9,
    });

    await expect(emitWithAck(bob, "leave-room", roomId)).resolves.toEqual({
      success: true,
    });
    expect(
      parseStoredJson<{ documentState: unknown; participants: string[] }>(roomKey)
    ).toEqual({
      documentState: initialState,
      participants: ["alice"],
    });

    bob.disconnect();
    await waitForCondition(
      () => !mockRedisStore.has("cursor:bob"),
      "disconnect cleanup to delete cursor state"
    );

    await expect(emitWithAck(alice, "leave-room", roomId)).resolves.toEqual({
      success: true,
    });
    expect(mockRedisStore.has(roomKey)).toBe(false);
    expect(mockRedisCalls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ method: "del", args: [roomKey] }),
        expect.objectContaining({
          method: "del",
          args: [`document:${roomId}`],
        }),
      ])
    );
  });
});
