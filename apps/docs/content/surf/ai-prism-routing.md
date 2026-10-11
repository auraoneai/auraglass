# Routing models through Kiro Prism

The `./ai` surface is presentational — **the library never calls a model, a
network endpoint, or `process.env`**. Your app owns the route. The
`ai-workspace` registry block ships a reference implementation that routes
through Kiro Prism over the OpenAI-compatible protocol.

## The reference route

`registry/blocks/ai-workspace/app/api/chat/route.ts` (interim copy:
`ci/surf/ai-sdk/ai-workspace/app/api/chat/route.ts`):

```ts
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';

const prism = createOpenAICompatible({
  name: 'kiro-prism',
  baseURL: 'https://prism.auraone.ai/v1',
  apiKey: process.env.PRISM_API_KEY, // server-only — never NEXT_PUBLIC_*
});

export async function POST(req: Request) {
  const model = process.env.PRISM_MODEL ?? (await firstPrismModel());
  const { messages } = await req.json();
  const result = streamText({ model: prism(model), messages });
  return result.toUIMessageStreamResponse();
}
```

Behaviour the block ships:

| Concern | Behaviour |
| --- | --- |
| Model | `PRISM_MODEL`, else the first `id` from `GET https://prism.auraone.ai/v1/models` resolved at request time |
| Missing key | `503` with `{ "kind": "auth" }` |
| Body cap | `413` above 32 KB |
| Rate limit | per-IP token bucket, 20 req/min → `429` + `Retry-After` + `{ "kind": "rate-limit", "retryAfterMs" }` |

The bucket is **per instance**. Move it to a shared store (Redis, durable
objects) before deploying more than one instance.

## Using with the Vercel AI SDK

`useChat()` messages are already assignable to `AgMessage` — pass them through:

```tsx
'use client';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Thread, Composer } from 'aura-glass/ai';

export function Chat() {
  const { messages, sendMessage, stop, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });
  return (
    <>
      <Thread messages={messages} />
      <Composer
        status={status}
        onSubmit={({ text }) => sendMessage({ text })}
        onStop={status === 'streaming' ? stop : undefined}
      />
    </>
  );
}
```

`registry/items/ai-sdk-adapter/useAuraChat.ts` wraps exactly this shape into
`{ threadProps, composerProps, status }`.

## CI and secrets posture

- `PRISM_API_KEY` never appears in this repo — not in fixtures, not in CI
  variables (OI-14). Test harnesses stub `fetch` in-process.
- The AI SDK pins (`ai@5.0.29`, `@ai-sdk/react@2.0.29`,
  `@ai-sdk/openai-compatible@1.0.29`) install into `.artifacts/` during the
  `surf:test:ai-sdk` job — never into the library's `package.json`. The
  additive `contract/ai-sdk-devdeps` PR lands them as devDependencies;
  SURF-390 then moves the interim files to their final paths.
