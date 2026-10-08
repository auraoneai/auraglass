# ci/surf/ai-sdk — interim AI SDK harness (SURF-281, REQ-SURF-106)

Everything SDK-importing lives here until `contract/ai-sdk-devdeps` merges —
the repo's `package.json` stays free of `ai`/`@ai-sdk/*` (AC-SURF-02). The
`surf:test:ai-sdk` CI job installs the exact pins in `package-pins.json` into
`.artifacts/surf/ai-sdk/` (`npm install --prefix --no-save`) and runs `tsc` +
Jest from this directory.

Contents:
- `package-pins.json` — the pinned SDK versions (also the contract PR body).
- `ai-sdk-compat.test-d.ts` — `UIMessage[]` → `AgMessage[]` assignability +
  `ChatStatus` mirror, checked against the pins.
- `ai-sdk-adapter/useAuraChat.ts` — `useChat` → `{ threadProps, composerProps,
  status }` adapter for `./ai` (final home: `registry/items/ai-sdk-adapter`).
- `ai-workspace/app/api/chat/route.ts` — the ai-workspace chat route:
  `streamText` + `createOpenAICompatible({ name: 'kiro-prism', baseURL:
  'https://prism.auraone.ai/v1', apiKey: PRISM_API_KEY })`. Model from
  `PRISM_MODEL` or the first `/v1/models` entry at request time. 32 KB body
  cap (413), per-IP 20 req/min bucket (429 + `Retry-After`), 503
  `{ kind: 'auth' }` without the key. The bucket is **per-instance** — a
  horizontally scaled deployment must replace it with shared storage; no CI
  job holds a Prism key (OI-14) and tests use a mocked Prism only.
