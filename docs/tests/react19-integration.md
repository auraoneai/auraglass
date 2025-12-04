# React 19 Integration Smoke Tests

This guide explains how to run the React 19 + Next.js smoke tests that back the
`npm run test:integration:next` command. The automation spins up two temporary
Next.js apps from the freshly packed AuraGlass tarball so you can reproduce the
same checks locally that CI uses.

## What the script covers

| Scenario | Stack | Entry points exercised |
| --- | --- | --- |
| React 18 baseline | `next@14.2.x`, `react@18.2` | `import { GlassButton } from 'aura-glass'` |
| React 19 + 3D | `next@15.1.x`, `react@19.x` | `import { GlassShatterEffects } from 'aura-glass/three'` |

Each scenario boots `next dev`, uses Playwright to hit `/`, and fails if the log
contains hook/registry errors (duplicate React instances, styled-components
registry issues, etc.). Logs are copied to:

- `reports/next-integration.log`
- `reports/next-integration-react19.log`

## Prerequisites

1. **Corepack/PNPM** – The script shells out to `pnpm`. If Corepack is available:
   ```bash
   corepack enable
   ```
   or install pnpm globally.
2. **Playwright Chromium deps** – On macOS/Linux CI runners ensure the system
   packages required by Playwright’s Chromium build are installed (GitHub-hosted
   runners already have them).
3. **Node 18+** – Required for Next.js 15, Playwright, and AuraGlass builds.

## Running locally

```bash
npm install
npm run build # optional, see skip flag below
npm run test:integration:next
```

### Useful flags

| Flag | Purpose |
| --- | --- |
| `AURAGLASS_SKIP_BUILD=1` | Reuse existing `dist/` artifacts instead of rebuilding |
| `SKIP_AURAGLASS_BUILD=1` | alias for `AURAGLASS_SKIP_BUILD=1` |
| `AURAGLASS_ASSUME_BUILT=true` | alias for `AURAGLASS_SKIP_BUILD=1` |

Example:

```bash
AURAGLASS_SKIP_BUILD=1 npm run test:integration:next
```

### What to expect

1. AuraGlass is `npm pack`’d into a temp directory.
2. Two Next.js apps (`next-app` and `next-app-react19`) are scaffolded and
   pointed at the tarball via `file:` dependency.
3. Each app installs dependencies via `pnpm install`.
4. Playwright installs Chromium and runs the `tests/smoke.spec.ts`.
5. Logs are copied into `reports/` for inspection. If the log contains any of:
   - `Invalid hook call`
   - `StyledComponentsRegistry was not detected`
   - `Cannot read properties of null (reading 'useState')`

   the script throws with a pointer to the log file.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `pnpm: command not found` | Enable Corepack or install pnpm globally |
| Playwright dependency errors | Run `npx playwright install --with-deps chromium` once outside the script to prime caches |
| Port already in use | Set `PORT_4310/PORT_4311` env vars to change the dev server ports (requires updating `scripts/ci/run-next-integration.js`) |
| Want to keep the temp apps | Set `AURAGLASS_NEXT_DEBUG=1` to stop the script from deleting temp dirs (edit script to respect this flag if desired) |

## CI usage

The GitHub Actions pipeline calls the same npm script:

```yaml
- name: React 19 smoke
  run: npm run test:integration:next
```

Ensure the job has Corepack enabled (or pnpm pre-installed) and the Playwright
Ubuntu dependencies available. The resulting logs are uploaded as job artifacts
so you can compare them against `reports/next-integration-react19.log` in git.
