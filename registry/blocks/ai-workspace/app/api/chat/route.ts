/* ai-workspace chat route (REQ-SURF-172, REQ-FIN-88): Next.js App Router
 * handler that streams an assistant reply from Kiro Prism.
 *
 * Kiro Prism is the default LLM layer: base URL, key and model come from
 * PRISM_BASE_URL / PRISM_API_KEY / PRISM_MODEL. Prism speaks the
 * OpenAI-compatible protocol, so the route uses the generic
 * `@ai-sdk/openai-compatible` adapter pointed at Prism — no direct provider
 * SDK. With PRISM_MODEL unset, the first id from `<base>/models` is used.
 *
 * Guards, in order:
 *   503 { kind: 'auth' }               PRISM_API_KEY unset
 *   429 { kind: 'rate-limit', retryAfterMs } + Retry-After
 *                                      token bucket (capacity 20, refill 20/min)
 *   413 { kind: 'payload-too-large' }  body > 32768 bytes, measured while
 *                                      streaming (Content-Length is not trusted)
 *   400 { kind: 'bad-request' }        invalid JSON / messages
 *   502 { kind: 'network' }            no model could be resolved from Prism
 *
 * The route has NO authentication of its own and the bucket is per instance —
 * see README.md before exposing it.
 *
 * Only `POST` is exported: Next.js rejects other named exports from a route
 * file. */
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';

const DEFAULT_PRISM_BASE_URL = 'https://prism.auraone.ai/v1';
const MAX_BODY_BYTES = 32768;
const BUCKET_CAPACITY = 20;
/** Tokens regained per millisecond: 20 per minute. */
const REFILL_PER_MS = BUCKET_CAPACITY / 60_000;
const MAX_TRACKED_CLIENTS = 10_000;
const PRISM_CLIENT = 'auraglass-ai-workspace';

interface Bucket {
  tokens: number;
  updatedAt: number;
}

const buckets = new Map<string, Bucket>();

function json(status: number, body: Record<string, unknown>, headers?: Record<string, string>): Response {
  return Response.json(body, headers ? { status, headers } : { status });
}

function prismConfig() {
  const apiKey = process.env.PRISM_API_KEY?.trim() || undefined;
  const baseURL = (process.env.PRISM_BASE_URL?.trim() || DEFAULT_PRISM_BASE_URL).replace(/\/+$/, '');
  const model = process.env.PRISM_MODEL?.trim() || undefined;
  return { apiKey, baseURL, model };
}

/** Bucket key. `x-forwarded-for` is client-controlled, so it is ignored unless
 * the deployment declares a trusted reverse proxy (AI_WORKSPACE_TRUST_PROXY=1);
 * then the right-most hop — the address the nearest proxy saw — is used.
 * Without it every caller shares one instance-wide bucket, which cannot be
 * bypassed by rotating a spoofed header. */
function clientKey(req: Request): string {
  if (process.env.AI_WORKSPACE_TRUST_PROXY !== '1') return 'instance';
  const hops = (req.headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean);
  return hops.length > 0 ? `ip:${hops[hops.length - 1]}` : 'instance';
}

function refill(bucket: Bucket, now: number): void {
  const elapsed = Math.max(0, now - bucket.updatedAt);
  bucket.tokens = Math.min(BUCKET_CAPACITY, bucket.tokens + elapsed * REFILL_PER_MS);
  bucket.updatedAt = now;
}

/** Keep the map bounded: drop full (idle) buckets, then the oldest entries. */
function prune(now: number): void {
  for (const [key, bucket] of buckets) {
    refill(bucket, now);
    if (bucket.tokens >= BUCKET_CAPACITY) buckets.delete(key);
  }
  for (const key of buckets.keys()) {
    if (buckets.size < MAX_TRACKED_CLIENTS) break;
    buckets.delete(key);
  }
}

function take(key: string, now: number): { ok: true } | { ok: false; retryAfterMs: number } {
  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= MAX_TRACKED_CLIENTS) prune(now);
    bucket = { tokens: BUCKET_CAPACITY, updatedAt: now };
    buckets.set(key, bucket);
  } else {
    refill(bucket, now);
  }
  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return { ok: true };
  }
  return { ok: false, retryAfterMs: Math.ceil((1 - bucket.tokens) / REFILL_PER_MS) };
}

/** Reads the body through its stream and stops as soon as it passes `limit`
 * bytes, so a lying or missing Content-Length cannot force an unbounded read.
 * Returns null when the cap is exceeded. */
async function readCappedBody(req: Request, limit: number): Promise<string | null> {
  if (!req.body) return '';
  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel().catch(() => undefined);
      return null;
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}

function isClientMessage(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const m = value as { role?: unknown; parts?: unknown };
  // System prompts belong to the server; clients send user/assistant turns only.
  return (m.role === 'user' || m.role === 'assistant') && Array.isArray(m.parts);
}

async function resolveModel(baseURL: string, apiKey: string, configured: string | undefined, signal: AbortSignal): Promise<string | null> {
  if (configured) return configured;
  try {
    const res = await fetch(`${baseURL}/models`, {
      headers: { Authorization: `Bearer ${apiKey}`, 'X-Prism-Client': PRISM_CLIENT },
      signal,
    });
    if (!res.ok) return null;
    const list = (await res.json()) as { data?: Array<{ id?: unknown }> };
    const id = list.data?.[0]?.id;
    return typeof id === 'string' && id.length > 0 ? id : null;
  } catch {
    return null;
  }
}

export async function POST(req: Request): Promise<Response> {
  const { apiKey, baseURL, model } = prismConfig();
  if (!apiKey) {
    return json(503, { kind: 'auth', message: 'PRISM_API_KEY is not configured' });
  }

  const slot = take(clientKey(req), Date.now());
  if (!slot.ok) {
    return json(
      429,
      { kind: 'rate-limit', message: 'too many requests', retryAfterMs: slot.retryAfterMs },
      { 'Retry-After': String(Math.ceil(slot.retryAfterMs / 1000)) },
    );
  }

  const declared = Number(req.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return json(413, { kind: 'payload-too-large', message: `request body exceeds ${MAX_BODY_BYTES} bytes` });
  }
  const raw = await readCappedBody(req, MAX_BODY_BYTES);
  if (raw === null) {
    return json(413, { kind: 'payload-too-large', message: `request body exceeds ${MAX_BODY_BYTES} bytes` });
  }

  let body: { messages?: unknown };
  try {
    body = JSON.parse(raw) as { messages?: unknown };
  } catch {
    return json(400, { kind: 'bad-request', message: 'invalid JSON' });
  }
  if (!Array.isArray(body?.messages) || !body.messages.every(isClientMessage)) {
    return json(400, { kind: 'bad-request', message: 'messages must be an array of user/assistant UI messages' });
  }

  let messages: ReturnType<typeof convertToModelMessages>;
  try {
    messages = convertToModelMessages(body.messages as UIMessage[]);
  } catch {
    return json(400, { kind: 'bad-request', message: 'messages could not be converted' });
  }

  const modelId = await resolveModel(baseURL, apiKey, model, req.signal);
  if (!modelId) {
    return json(502, { kind: 'network', message: 'no Kiro Prism model available' });
  }

  const prism = createOpenAICompatible({
    name: 'kiro-prism',
    baseURL,
    apiKey,
    headers: { 'X-Prism-Client': PRISM_CLIENT },
  });
  const result = streamText({ model: prism.chatModel(modelId), messages, abortSignal: req.signal });
  return result.toUIMessageStreamResponse();
}
