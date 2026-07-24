# AuraGlass 3.4.8 Release Candidate

Date: 2026-07-23

## Scope

AuraGlass 3.4.8 is a package-security and deterministic-test patch. It does not expand the supported hosted-product scope.

## Verified

- Package version and lockfile: `3.4.8`.
- `concurrently` moved from runtime dependencies to development dependencies.
- Patched dependency overrides and lockfile updates applied.
- `npm audit`: 0 known vulnerabilities across the complete dependency graph.
- `npm audit --omit=dev`: 0 known production vulnerabilities.
- `npm run typecheck`: passed.
- `npm run lint:ci`: passed with the existing warning baseline and 0 errors.
- `npm run build`: passed.
- `npm run verify:pack`: passed clean-install, registry-recipe, CLI, and styles-export smoke.
- `npm pack --dry-run --json --ignore-scripts`: passed for `aura-glass@3.4.8`.
  - Package size: 8,929,323 bytes.
  - Unpacked size: 47,305,369 bytes.
  - Entry count: 2,379.
  - SHA-1: `a048de0f2e9de7775a1802a8988201997e06c7b0`.
  - Integrity: `sha512-XYVA7N8bNlSrEz4qeV5UVk8MD4y1sd5QyyNxAXqytb+AAaSnR0tZyz+VZlT1oERk6cSl7R/XPmUfGDvGD+x1iw==`.
- The complete Jest run executed all 432 suites / 2,373 tests. It reached 431 suites / 2,371 tests passing; the only two failures were quote-specific source assertions after formatting `server/index.ts`. The corrected contract suite then passed 7/7. The three affected AI/runtime suites also passed 34/34 with deterministic injected clients.

## Public Surface

- Public npm `latest` remains `aura-glass@3.4.7`.
- npm publication is blocked because `npm whoami` returns `E401 Unauthorized`.
- GitHub authentication is available, but no `v3.4.8` tag or release should be created before npm publication succeeds.
- `https://auraglass.auraone.ai` is live on Ready Vercel deployment `dpl_6d2FCzcktjA7UfGT5pMvcgs5Tpyp`.
- The deployment was initiated from a clean worktree at website source commit `e4cccd6ed2c6989f42a5692462965e0d2984b833`.
- Nine critical routes return HTTP 200, the sitemap contains 517 URLs, and production layout, contrast, and targeted runtime browser checks pass.
- The live website still consumes public `aura-glass@3.4.7` and therefore cannot prove the 3.4.8 dependency cleanup until npm publication and a follow-up package upgrade/redeploy.
- Detailed production proof: `reports/3.4.8-release/website-production-evidence.md` and `website-production-evidence.json`.

## Remaining Release Steps

1. Restore npm authentication and publish `aura-glass@3.4.8`.
2. Verify registry version, integrity, provenance, and install from the public registry.
3. Upgrade `/Users/gurbakshchahal/websites/auraglasswebsite` from public 3.4.7 to public 3.4.8.
4. Re-run the website verification gate and deploy the exact upgraded website commit.
5. Create and push `v3.4.8`, then publish the matching GitHub release.

Manual screen-reader and physical phone/tablet certification remain human/device certification work and are not represented as completed by the automated gates above.
