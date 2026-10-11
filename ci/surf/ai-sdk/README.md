# ci/surf/ai-sdk — interim AI SDK harness (being retired, REQ-SURF-106)

The SDK pins now live in the root `package.json` devDependencies
(`ai@5.0.29`, `@ai-sdk/react@2.0.29`, `@ai-sdk/openai-compatible@1.0.29`), so
SDK-typed code no longer needs a scratch install. This directory is being
emptied in three steps (REQ-FIN-85 / REQ-FIN-88 / REQ-FIN-90):

- Done (REQ-SURF-106, `next-fin/f-ai-sdk`): the `UIMessage` → `AgMessage`
  compat test moved to `tests/types/surf/ai-sdk-compat.test-d.ts` (plain
  type-level asserts, no `tsd`, checked by the root `tsc -p tsconfig.json`);
  the duplicate `ai-sdk-adapter/` was deleted — `registry/items/ai-sdk-adapter`
  is canonical and its test moved there; `scripts/surf/gen-ai-fixtures.mjs`
  typechecks the fixture corpus against the pinned `ai` types.
- Pending (REQ-SURF-172, `next-fin/f-ai-route`): `ai-workspace/app/api/chat/route.ts`
  and `ai-workspace-route.test.ts` move to `registry/blocks/ai-workspace/`.
- Pending (REQ-SURF-195, `next-fin/f-ci-fragment`): `surf:test:ai-sdk` is
  repointed at the root config and `tests/types/surf`, after which
  `package.json`, `package-pins.json`, `tsconfig.json`, `jest.config.mjs` and
  this README are deleted.

Until then `surf:test:ai-sdk` still installs `package.json` into
`.artifacts/surf/ai-sdk/` and runs `tsc` + Jest over what remains here (the
route and its mocked-Prism test).
