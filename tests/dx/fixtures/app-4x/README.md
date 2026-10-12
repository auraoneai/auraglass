# app-4x canary fixture (REQ-PLAT-92)

A frozen Next.js 16 app written against the aura-glass 4.x API (`GlassButton`,
`GlassCard`, `aura-glass/styles`, `aura-glass` pinned at `4.1.0`). It is never
built in place (the root `tsconfig.json` excludes it); `tests/dx/codemod-canary.spec.ts`
copies it into `.artifacts/plat/codemod-canary/app/` and adds one page per
flagship recipe:

- `components/recipes/<id>.tsx` — the frozen `tests/dx/fixtures/recipes-4x/<id>/input.tsx`;
- `app/recipes/<id>/page.tsx` — a client page rendering that recipe's export;
- `components/recipes.ts` — the list of ids (`flagship-subset.json`).

The spec then runs the packed `@auraglass/cli` (`migrate 4to5`), swaps in the
packed `aura-glass` 5 tarball, and requires `tsc --noEmit` exit 0, `next build`
exit 0, 0 TODOs in the flagship files, a second migrate with 0 changes, each
migrate within 15 s, and a smoke render in Chromium, WebKit and Firefox.
