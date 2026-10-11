# AuraGlass 4.1.1

Trust patch: documentation retractions, hosted-runtime hardening, and the Aeonik font removal.

### Security and privacy

- GHSA draft handed to the repository owner for publication before the v4.1.1 tag: hosted example runtime default JWT secret, missing authorization, and open WebSocket rooms (docs/security/GHSA-4.1.1-draft.md).
- `assertJwtSecret` exits 1 at startup when `JWT_SECRET` is unset, the `.env.example` default, or shorter than 32 characters; the Dockerfile no longer copies `.env.example` over `.env`.
- `enableAdaptiveAI` is opt-in; GlassCanvas dispatches `onComponentAction` instead of executing string code (DEP-P0012, DEP-P0013).
- `validateTextContrast`/`ContrastGuard` report `unverified` when a ratio cannot be computed (DEP-P0014).
- D-31: Aeonik (licence unconfirmed) removed; `--glass-font-sans` falls back to the system stack (DEP-P0015).

### Fixes

- Conditional-hook violations hoisted (`rules-of-hooks` count 137 → 0).
- Reduced-motion `animate={{}}` sites rewritten to `prefersReducedMotion ? FINAL : X`; the 35-component visible-under-reduced-motion suite is green.
- reports/ is untracked; certification and audit evidence lives in CI artifacts (`.artifacts/`).
- Hydration fallbacks: `useOptional*` readers avoid SSR/client mismatch.
- Command palette fuzzy search escapes regex metacharacters per query
  character — a query like `(` can no longer throw or widen the match.

### Docs

- README/llms.txt/CHANGELOG retract the "498 certified", "SSR-safe", and "optional backend" claims; ledger corrections are recorded in docs/release/ledger-corrections.json. `scripts/ci/verify-docs-claims.js` keeps the retractions out.
