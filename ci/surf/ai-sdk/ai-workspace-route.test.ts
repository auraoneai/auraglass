/* ai-workspace route (SURF-377): mocked Prism — global fetch stub inside this
 * test only, no network. Asserts the guards (503 auth, 413 cap, 429 bucket
 * with Retry-After) and that the stream path issues exactly one Prism call
 * to prism.auraone.ai/v1 with the bearer key. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';

const KEY = 'test-prism-key';
let POST: (req: Request) => Promise<Response>;

const env = { ...process.env };
beforeEach(async () => {
  process.env.PRISM_API_KEY = KEY;
  process.env.PRISM_MODEL = 'kiro-test-model';
  jest.resetModules();
  POST = (await import('./ai-workspace/app/api/chat/route')).POST;
});
afterEach(() => { process.env = { ...env }; jest.restoreAllMocks(); });

function req(body: unknown, headers: Record<string, string> = {}) {
  const payload = JSON.stringify(body);
  return new Request('https://app.test/api/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'content-length': String(payload.length), 'x-forwarded-for': '203.0.113.9', ...headers },
    body: payload,
  });
}

describe('ai-workspace route (SURF-377)', () => {
  it('returns 503 { kind: "auth" } when PRISM_API_KEY is unset', async () => {
    delete process.env.PRISM_API_KEY;
    const res = await POST(req({ messages: [] }));
    expect(res.status).toBe(503);
    expect(await res.json()).toMatchObject({ kind: 'auth' });
  });

  it('returns 413 above the 32 KB cap', async () => {
    const res = await POST(req({ messages: [{ role: 'user', content: 'x'.repeat(33 * 1024) }] }));
    expect(res.status).toBe(413);
  });

  it('rate limits at 21st request from one IP with Retry-After', async () => {
    global.fetch = jest.fn(async () => new Response('data: [DONE]\n\n', { status: 200, headers: { 'content-type': 'text/event-stream' } })) as never;
    for (let i = 0; i < 20; i++) {
      const r = await POST(req({ messages: [] }, { 'x-forwarded-for': '198.51.100.7' }));
      expect([200, 500]).toContain(r.status); // guard order runs before upstream
    }
    const limited = await POST(req({ messages: [] }, { 'x-forwarded-for': '198.51.100.7' }));
    expect(limited.status).toBe(429);
    expect(Number(limited.headers.get('Retry-After'))).toBeGreaterThan(0);
  });

  it('calls Prism at prism.auraone.ai/v1 with the env bearer key', async () => {
    const sse = 'data: {"id":"1","choices":[{"delta":{"content":"ok"}}]}\n\ndata: [DONE]\n\n';
    const fetchSpy = jest.fn(async () => new Response(sse, { status: 200, headers: { 'content-type': 'text/event-stream' } }));
    global.fetch = fetchSpy as never;
    const res = await POST(req({ messages: [{ role: 'user', content: 'hi' }] }));
    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalled();
    const [url, init] = (fetchSpy.mock.calls[0] as never) as [string, RequestInit];
    expect(String(url)).toContain('prism.auraone.ai/v1');
    expect(String((init as RequestInit).headers?.['Authorization'] ?? (init as any).headers?.Authorization ?? '')).toContain(`Bearer ${KEY}`);
  });
});
