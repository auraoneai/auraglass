/* ai-workspace chat route (SURF-376): Kiro Prism via streamText +
 * createOpenAICompatible. Consumer-owned (the library makes no model call);
 * lives under ci/surf/ai-sdk until contract/ai-sdk-devdeps lands.
 *
 * Guards: 32 KB body cap (413), per-IP 20 req/min bucket (429 + Retry-After),
 * 503 { kind: 'auth' } when PRISM_API_KEY is unset. Model comes from
 * PRISM_MODEL or the first /v1/models entry at request time. The bucket is
 * per-instance (see README) — scale-out deployments replace it with shared
 * storage. */
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';

const BASE_URL = 'https://prism.auraone.ai/v1';
const MAX_BODY_BYTES = 32 * 1024;
const WINDOW_MS = 60_000;
const LIMIT = 20;
const bucket = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd?.split(',')[0] ?? 'unknown').trim();
}

function rateLimited(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = bucket.get(ip);
  if (!entry || entry.resetAt <= now) {
    bucket.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }
  entry.count += 1;
  return { limited: entry.count > LIMIT, retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)) };
}

async function resolveModel(apiKey: string): Promise<string | null> {
  if (process.env.PRISM_MODEL) return process.env.PRISM_MODEL;
  try {
    const res = await fetch(`${BASE_URL}/models`, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) return null;
    const list = (await res.json()) as { data?: Array<{ id?: string }> };
    return list.data?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.PRISM_API_KEY;
  if (!apiKey) {
    return Response.json({ kind: 'auth', message: 'PRISM_API_KEY not configured' }, { status: 503 });
  }

  const len = Number(req.headers.get('content-length') ?? '0');
  if (len > MAX_BODY_BYTES) {
    return Response.json({ kind: 'payload-too-large', message: 'request body exceeds 32 KB' }, { status: 413 });
  }
  const ip = clientIp(req);
  const { limited, retryAfter } = rateLimited(ip);
  if (limited) {
    return Response.json(
      { kind: 'rate-limit', message: 'too many requests' },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    );
  }

  let body: { messages?: unknown };
  try {
    body = await req.json();
  } catch {
    return Response.json({ kind: 'bad-request', message: 'invalid JSON' }, { status: 400 });
  }
  if (!Array.isArray(body.messages)) {
    return Response.json({ kind: 'bad-request', message: 'messages must be an array' }, { status: 400 });
  }

  const modelId = await resolveModel(apiKey);
  if (!modelId) {
    return Response.json({ kind: 'upstream', message: 'no Prism model available' }, { status: 502 });
  }

  const prism = createOpenAICompatible({ name: 'kiro-prism', baseURL: BASE_URL, apiKey });
  const result = streamText({ model: prism.chatModel(modelId), messages: body.messages as never });
  return result.toUIMessageStreamResponse();
}
