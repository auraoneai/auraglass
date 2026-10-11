# AuraGlass 4.2.0 — release notes (draft)

## Moved dependencies (install them yourself)

These packages moved from `dependencies` to **optional peer dependencies**.
The library no longer installs them for you: import the matching feature
without the package installed and the lazy loader throws
`[aura-glass] <name> is now an optional peer; install it: npm i <name>`
at feature call time — importing the package itself stays safe.

| Package | Feature that needs it |
| --- | --- |
| `react-hook-form` | `GlassForm` components |
| `zod` | validation helpers |
| `framer-motion` | motion components |
| `chart.js` | `GlassDataChart` |
| `react-chartjs-2` | `GlassDataChart` |
| `date-fns` | date formatting utilities |
| `express` | example hosted runtime (`server/`) |
| `express-rate-limit` | example hosted runtime |
| `helmet` | example hosted runtime |
| `cors` | example hosted runtime |
| `compression` | example hosted runtime |
| `socket.io` | example hosted runtime |
| `socket.io-client` | collaboration example |
| `ioredis` | example cache service |
| `redis` | example cache service |
| `jsonwebtoken` | example auth service |
| `bcryptjs` | example auth service |
| `dotenv` | example runtime config |
| `openai` | AI service examples |
| `@pinecone-database/pinecone` | vector example |
| `@google-cloud/vision` | vision example |
| `@sentry/node` | example telemetry |

Deprecation entries: DEP-P0021…DEP-P0041, DEP-P0072
(`fragments/deprecations/plat.ts`), all `removeIn: 5.0.0`.

## Highlights

- 4.1.1 trust patch folded forward: hydration-safe init, optional-peer
  motion, reduced-motion conversions, claims retractions, tree hygiene.
- React 19 legs run in CI (allow_failure until the first green).

## Breaking

Nothing removed in 4.2.0 — removals land in 5.0.0 per the deprecation
ledger. The dependency moves above are install-level (C-D-IL): your lockfile
loses the transitive packages; install the ones you use.
