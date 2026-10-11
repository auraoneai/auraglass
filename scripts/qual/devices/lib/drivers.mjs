/* Minimal browser drivers used on the device host (no dependencies):
   - W3C WebDriver over HTTP (Appium/XCUITest on Device Farm iOS hosts, safaridriver on mac1.metal)
   - Chrome DevTools Protocol over WebSocket (Android Chrome via `adb forward`) */

export function webdriver(baseUrl, { fetchImpl = globalThis.fetch } = {}) {
  const base = baseUrl.replace(/\/$/, '');
  async function req(method, path, body) {
    const res = await fetchImpl(`${base}${path}`, {
      method,
      headers: { 'content-type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || (json.value && json.value.error)) {
      const e = json.value || {};
      throw new Error(`webdriver ${method} ${path}: ${res.status} ${e.error || ''} ${e.message || ''}`.trim());
    }
    return json.value;
  }
  let sessionId = null;
  return {
    async newSession(alwaysMatch) {
      const v = await req('POST', '/session', { capabilities: { alwaysMatch } });
      sessionId = v.sessionId;
      return v;
    },
    setTimeouts: (t) => req('POST', `/session/${sessionId}/timeouts`, t),
    navigate: (url) => req('POST', `/session/${sessionId}/url`, { url }),
    executeAsync: (script, args) => req('POST', `/session/${sessionId}/execute/async`, { script, args }),
    async deleteSession() {
      if (!sessionId) return;
      const id = sessionId;
      sessionId = null;
      await req('DELETE', `/session/${id}`);
    },
    get sessionId() {
      return sessionId;
    },
  };
}

/**
 * CDP client over a WebSocket-like object ({ send, close, addEventListener }).
 * `connect` opens the first `page` target listed by the DevTools HTTP endpoint.
 */
export function cdpSession(socket) {
  let nextId = 1;
  const pending = new Map();
  const waiters = [];
  socket.addEventListener('message', (ev) => {
    const msg = JSON.parse(typeof ev.data === 'string' ? ev.data : ev.data.toString());
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(`cdp: ${msg.error.message}`));
      else resolve(msg.result);
    } else if (msg.method) {
      for (let i = waiters.length - 1; i >= 0; i--) {
        if (waiters[i].method === msg.method) waiters.splice(i, 1)[0].resolve(msg.params);
      }
    }
  });
  return {
    send(method, params = {}) {
      const id = nextId++;
      socket.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
    },
    once(method, timeoutMs = 30_000) {
      return new Promise((resolve, reject) => {
        const w = { method, resolve };
        waiters.push(w);
        setTimeout(() => {
          const i = waiters.indexOf(w);
          if (i >= 0) {
            waiters.splice(i, 1);
            reject(new Error(`cdp: timed out waiting for ${method}`));
          }
        }, timeoutMs).unref?.();
      });
    },
    close: () => socket.close(),
  };
}

export async function cdpConnect(httpBase, { fetchImpl = globalThis.fetch, WebSocketImpl = globalThis.WebSocket } = {}) {
  if (typeof WebSocketImpl !== 'function') throw new Error('cdp: no WebSocket implementation (Node ≥22, or --experimental-websocket on Node 20)');
  const list = await (await fetchImpl(`${httpBase.replace(/\/$/, '')}/json/list`)).json();
  const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
  if (!page) throw new Error('cdp: no page target');
  const socket = new WebSocketImpl(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', () => reject(new Error('cdp: websocket error')), { once: true });
  });
  return cdpSession(socket);
}
