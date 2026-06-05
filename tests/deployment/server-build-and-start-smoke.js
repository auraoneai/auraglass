#!/usr/bin/env node

const http = require('http');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const repoRoot = path.resolve(__dirname, '../..');
const timeoutMs = Number(process.env.AURAGLASS_SERVER_SMOKE_TIMEOUT_MS || 600000);

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = address && typeof address === 'object' ? address.port : 0;
      server.close(() => resolve(port));
    });
  });
}

function waitForHttpOk(port, pathname, deadline, processState) {
  return new Promise((resolve, reject) => {
    const poll = () => {
      if (processState.exitCode !== null) {
        reject(
          new Error(
            `server:build-and-start exited before ${pathname} became healthy with code ${processState.exitCode}`
          )
        );
        return;
      }

      if (Date.now() > deadline) {
        reject(new Error(`Timed out waiting for http://127.0.0.1:${port}${pathname}`));
        return;
      }

      const request = http.get(
        {
          host: '127.0.0.1',
          port,
          path: pathname,
          timeout: 2000,
        },
        (response) => {
          response.resume();
          if (response.statusCode === 200) {
            resolve();
            return;
          }
          setTimeout(poll, 500);
        }
      );

      request.on('timeout', () => {
        request.destroy();
        setTimeout(poll, 500);
      });
      request.on('error', () => setTimeout(poll, 500));
    };

    poll();
  });
}

function waitForTcp(port, deadline, processState) {
  return new Promise((resolve, reject) => {
    const poll = () => {
      if (processState.exitCode !== null) {
        reject(
          new Error(
            `server:build-and-start exited before WebSocket port listened with code ${processState.exitCode}`
          )
        );
        return;
      }

      if (Date.now() > deadline) {
        reject(new Error(`Timed out waiting for TCP port ${port}`));
        return;
      }

      const socket = net.createConnection({ host: '127.0.0.1', port });
      socket.setTimeout(2000);
      socket.on('connect', () => {
        socket.end();
        resolve();
      });
      socket.on('timeout', () => {
        socket.destroy();
        setTimeout(poll, 500);
      });
      socket.on('error', () => setTimeout(poll, 500));
    };

    poll();
  });
}

function appendTail(current, chunk) {
  const next = current + chunk.toString();
  return next.length > 20000 ? next.slice(next.length - 20000) : next;
}

function stopProcess(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode) {
      resolve();
      return;
    }

    const killTimer = setTimeout(() => {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch {
        child.kill('SIGKILL');
      }
      resolve();
    }, 5000);

    child.once('exit', () => {
      clearTimeout(killTimer);
      resolve();
    });

    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {
      child.kill('SIGTERM');
    }
  });
}

async function main() {
  const apiPort = await getFreePort();
  const wsPort = await getFreePort();
  const processState = { exitCode: null };
  let outputTail = '';

  const child = spawn('npm', ['run', 'server:build-and-start'], {
    cwd: repoRoot,
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      API_SERVER_PORT: String(apiPort),
      WS_PORT: String(wsPort),
      NODE_ENV: 'test',
      ENABLE_AI_CACHING: 'false',
      ENABLE_BACKGROUND_REMOVAL: 'false',
      ENABLE_DEMO_AUTH: 'true',
      ENABLE_SEMANTIC_SEARCH: 'false',
      ENABLE_VISION_API: 'false',
      FORCE_COLOR: '0',
    },
  });

  child.stdout.on('data', (chunk) => {
    outputTail = appendTail(outputTail, chunk);
  });
  child.stderr.on('data', (chunk) => {
    outputTail = appendTail(outputTail, chunk);
  });
  child.once('exit', (code) => {
    processState.exitCode = code;
  });

  try {
    const deadline = Date.now() + timeoutMs;
    await waitForHttpOk(apiPort, '/health', deadline, processState);
    await waitForTcp(wsPort, deadline, processState);
    console.log(
      `server:build-and-start smoke passed: API health http://127.0.0.1:${apiPort}/health and WebSocket TCP 127.0.0.1:${wsPort}`
    );
  } catch (error) {
    console.error(error.message);
    if (outputTail.trim()) {
      console.error('\nCaptured process output tail:\n');
      console.error(outputTail.trim());
    }
    process.exitCode = 1;
  } finally {
    await stopProcess(child);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
