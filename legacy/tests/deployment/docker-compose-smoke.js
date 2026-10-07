#!/usr/bin/env node
"use strict";

const { execFileSync, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const https = require("node:https");
const net = require("node:net");
const path = require("node:path");

const root = path.resolve(__dirname, "..", "..");
const project = `auraglass33smoke${Date.now()}`;
const timeoutMs = Number(process.env.AURAGLASS_COMPOSE_SMOKE_TIMEOUT_MS || 900000);
const sslDir = path.join(root, "ssl");
const certPath = path.join(sslDir, "cert.pem");
const keyPath = path.join(sslDir, "key.pem");
const createdCerts = [];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    env: options.env || process.env,
    encoding: "utf8",
    stdio: options.stdio || "pipe",
  });

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
    );
  }

  return result.stdout;
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Could not allocate port")));
        return;
      }
      const { port } = address;
      server.close(() => resolve(port));
    });
  });
}

function requestJson(url, options = {}) {
  const client = url.startsWith("https:") ? https : http;
  return new Promise((resolve, reject) => {
    const req = client.get(
      url,
      {
        timeout: 2500,
        rejectUnauthorized: options.rejectUnauthorized ?? false,
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk;
        });
        res.on("end", () => {
          resolve({
            status: res.statusCode || 0,
            body: body ? JSON.parse(body) : undefined,
          });
        });
      }
    );
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
  });
}

function waitForTcp(port) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(port, "127.0.0.1");
    socket.once("connect", () => {
      socket.end();
      resolve();
    });
    socket.once("error", reject);
    socket.setTimeout(2500, () => {
      socket.destroy(new Error("timeout"));
    });
  });
}

async function waitFor(predicate, label) {
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeoutMs) {
    try {
      const value = await predicate();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw lastError || new Error(`Timed out waiting for ${label}`);
}

function ensureSmokeCerts() {
  fs.mkdirSync(sslDir, { recursive: true });
  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) return;

  run("openssl", [
    "req",
    "-x509",
    "-nodes",
    "-newkey",
    "rsa:2048",
    "-keyout",
    keyPath,
    "-out",
    certPath,
    "-days",
    "1",
    "-subj",
    "/CN=localhost",
  ]);
  createdCerts.push(certPath, keyPath);
}

function cleanup(env) {
  try {
    run("docker", ["compose", "-p", project, "down", "-v", "--remove-orphans"], {
      env,
      stdio: "pipe",
    });
  } catch {}

  for (const file of createdCerts) {
    try {
      fs.unlinkSync(file);
    } catch {}
  }
}

(async () => {
  run("docker", ["--version"]);
  run("docker", ["compose", "version"]);
  ensureSmokeCerts();

  const [
    redisPort,
    apiPort,
    wsPort,
    frontendPort,
    nginxHttpPort,
    nginxHttpsPort,
  ] = await Promise.all([
    getFreePort(),
    getFreePort(),
    getFreePort(),
    getFreePort(),
    getFreePort(),
    getFreePort(),
  ]);

  const env = {
    ...process.env,
    JWT_SECRET: "auraglass-compose-smoke-secret",
    OPENAI_API_KEY: "",
    PINECONE_API_KEY: "",
    GOOGLE_VISION_API_KEY: "",
    REMOVEBG_API_KEY: "",
    SENTRY_DSN: "",
    CLIENT_URL: `http://localhost:${frontendPort}`,
    REDIS_HOST_PORT: String(redisPort),
    API_HOST_PORT: String(apiPort),
    WS_HOST_PORT: String(wsPort),
    FRONTEND_HOST_PORT: String(frontendPort),
    NGINX_HTTP_HOST_PORT: String(nginxHttpPort),
    NGINX_HTTPS_HOST_PORT: String(nginxHttpsPort),
  };

  try {
    run("docker", ["compose", "-p", project, "config", "--quiet"], { env });
    run(
      "docker",
      ["compose", "-p", project, "up", "-d", "--build", "redis", "api", "websocket", "frontend", "nginx"],
      { env, stdio: "pipe" }
    );

    await waitFor(async () => {
      const response = await requestJson(`http://127.0.0.1:${apiPort}/health`);
      return response.status === 200 && response;
    }, "API /health");

    await waitFor(async () => {
      const response = await requestJson(`http://127.0.0.1:${apiPort}/ready`);
      return (response.status === 200 || response.status === 503) && response;
    }, "API /ready");

    await waitFor(() => waitForTcp(wsPort).then(() => true), "WebSocket TCP");

    await waitFor(async () => {
      const response = await requestJson(
        `https://127.0.0.1:${nginxHttpsPort}/health`
      );
      return response.status === 200 && response;
    }, "Nginx /health");

    const redisPing = run(
      "docker",
      ["compose", "-p", project, "exec", "-T", "redis", "redis-cli", "ping"],
      { env }
    ).trim();
    if (redisPing !== "PONG") {
      throw new Error(`Expected Redis PONG, got ${redisPing}`);
    }

    console.log(
      `docker compose smoke passed: api=${apiPort}, ws=${wsPort}, redis=${redisPort}, nginx=https://127.0.0.1:${nginxHttpsPort}`
    );
  } finally {
    cleanup(env);
  }
})().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
