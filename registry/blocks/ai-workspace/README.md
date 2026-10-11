# ai-workspace

AI chat block: `Thread` + `Composer` + `UsageMeter` + `ProviderErrorState`
driven by `useAuraChat` (registry item `ai-sdk-adapter`), with a Next.js App
Router chat route that streams from **Kiro Prism**.

| File | Installs to | Purpose |
|---|---|---|
| `index.tsx` | block | `AiWorkspace` — live by default (`DefaultChatTransport({ api: '/api/chat' })`), or any `transport` you pass |
| `page.tsx` | `app/ai-workspace/page.tsx` | full page: app shell, thread, composer, run inspector |
| `app/api/chat/route.ts` | `app/api/chat/route.ts` | `POST` chat route → Kiro Prism |
| `replay-transport.ts` | block | `createReplayTransport(replies)` — fixture replay for stories and tests |
| `fixtures.ts` | block | support-engineering agent session (citations, approval-gated rollback) |

## Configuration (server-side only)

| Variable | Required | Default | Meaning |
|---|---|---|---|
| Prism key (the `PRISM_*` key variable read at the top of `app/api/chat/route.ts`) | yes | — | Kiro Prism key, sent as `Authorization: Bearer`. Without it the route answers `503 { kind: 'auth' }`. |
| `PRISM_BASE_URL` | no | `https://prism.auraone.ai/v1` | OpenAI-compatible Prism base URL. |
| `PRISM_MODEL` | no | first id from `<PRISM_BASE_URL>/models` | Model id. When unset, the route lists `/models` on each request and uses the first entry. |
| `AI_WORKSPACE_TRUST_PROXY` | no | unset | Set to `1` only behind a reverse proxy you control that sets `X-Forwarded-For`. |

Keep the key in a server secret store. Never expose it through a
`NEXT_PUBLIC_*` variable or client code. The route talks to Prism over its
OpenAI-compatible API with the generic `@ai-sdk/openai-compatible` adapter. It
does not use a provider SDK.

## Before you expose the route: authentication and authorisation

**The route has no authentication or authorisation of its own.** Anyone who
can reach `POST /api/chat` can spend your Prism quota and send prompts under
your key. Before you deploy it, the consuming app must add:

- **Authentication**: identify the caller, for example with a session check in
  `middleware.ts` or at the top of `POST`, and reject anonymous requests with
  `401`.
- **Authorisation**: decide whether this user may use the assistant, which
  models and tools they may use, and their spend limits. Reject others with
  `403`.
- **Tool gating**: run approval-gated tools (such as the rollback in the
  fixtures) only after a server-side permission check for the approving user.
  An approval sent by the client is not proof of permission.

Also, the route rejects client `system` messages. Put system prompts on the
server.

## Guards

| Condition | Response |
|---|---|
| Prism key variable unset | `503 { kind: 'auth' }` |
| Rate limit exceeded | `429 { kind: 'rate-limit', retryAfterMs }` + `Retry-After` (seconds) |
| Body over 32,768 bytes | `413 { kind: 'payload-too-large' }`. The route counts bytes while streaming the body, so a missing or false `Content-Length` cannot get round the cap. |
| Invalid JSON or `messages` | `400 { kind: 'bad-request' }` |
| No model from Prism | `502 { kind: 'network' }` |

Messages pass through `convertToModelMessages` before `streamText`. The
response is a UI message stream for `useChat`.

## Rate limiting is per instance

The token bucket (capacity 20, refills 20 per minute) lives **in the memory of
one server instance**:

- Each instance, serverless isolate, or region keeps its own buckets. With N
  instances, a client can make up to N × 20 requests per minute. Buckets reset
  when an instance restarts or cold-starts.
- If you scale out, replace the in-memory `Map` with shared storage (Redis,
  Upstash, Durable Objects, or your gateway's rate limiter) keyed by the
  authenticated user.
- `X-Forwarded-For` is set by the client, so by default the route ignores it
  and all callers share **one bucket per instance**. Behind a trusted proxy,
  set `AI_WORKSPACE_TRUST_PROXY=1`. The route then keys buckets by the
  right-most `X-Forwarded-For` hop, which is the address your proxy saw. Once
  authentication is in place, key by user id instead.

## Stories and tests

Stories render `AiWorkspace` with `createReplayTransport([REPLAY_REPLY])`. The
real `useAuraChat` → `useChat` path runs, with no server or model call.
`tests/capability/registry/ai-workspace-route.test.ts` tests the route against
a mocked Prism (`fetch` mocked; no network calls).
