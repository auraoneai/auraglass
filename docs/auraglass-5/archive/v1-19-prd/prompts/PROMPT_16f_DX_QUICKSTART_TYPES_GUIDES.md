# PROMPT-16f (DX): quickstarts, install-to-beautiful lane, guides, TypeScript DX

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` (Key DX; alias PRD-16; contracts in `prd/_shared-contracts.md`: SC-23, SC-24, SC-40). Requirements: REQ-DX-54..68, plus §20 step 5 (alpha-smoke) and the §16 quickstart budgets. Acceptance: AC-DX-04, AC-DX-12, AC-DX-13, AC-DX-22 (guides half). Tasks: `docs/auraglass-5/tasks/DX.json` DX-119..DX-133. Architecture: §4.2 (literal-union material roles), §5.4 (modes, zero-JS mirrors), §5.5 (Tailwind v4 bridge), §10 (layers), D-06 (`solid` is transparency only). Index and crosswalk: `docs/auraglass-5/prompts/PROMPT_16_DX.md`.

## 0. Common rules (binding)

- Remote-first. You may run locally: `npx vitest run -c tests/dx/vitest.config.ts tests/dx/{quickstart-shape,readme-generated,tsdoc-coverage,docs-content}.test.ts`, `tsd` on `tests/types/autocomplete.test-d.ts`, `tests/types/completions.test.ts` (the TS language service is node-only), and `node scripts/docs/gen-readme.mjs`. Run remotely in GitHub Actions (public repo, hosted runners) or via the `auraone-remote-run` skill:
  - `quickstart.spec.ts` (clean container, verdaccio, `create-next-app`/`create-vite`, builds, Playwright);
  - `plain-css.spec.ts`;
  - `compile-snippets` over the guides.
  Timings count only from the remote runner. Never use local Docker, never start verdaccio locally, never launch a local browser.
- Don't fake completion:
  - Quickstart `{step}` blocks are executed literally by the spec. Never let the spec run commands the document doesn't contain.
  - Don't raise the 300 s / 240 s / 6-command / 2-edit budgets.
  - Don't measure a warm AuraGlass cache. Only third-party packages may be warmed.
  - TSDoc thresholds are constants (T0/T1 100%, T2 ≥95% at beta, 100% at RC). Don't add `string & {}` or widen unions to make completions pass.
  - No `@ts-ignore` where `@ts-expect-error` is required. No `test.skip`.
- Guides name exactly one provider pair. They don't document Tailwind v3 or forced preferences. Numbers come only from `<Claim>`.
- A missing prerequisite owned by another PRD means that task is BLOCKED: report it.
- Evidence is CI artifacts (D-32).

## 1. Prerequisites

1. 16b is merged (`init`, `add` green). 16d `registry/base/auraglass` and `registry/blocks/app-frame` exist, and `app-frame` passes the render gate. Until it does, run the quickstart lane against `tests/dx/fixtures/alpha-smoke/` (DX-121) and report AC-DX-04 as "alpha calibration only".
2. 16e is merged: `scripts/docs/compile-snippets.mjs`, `scripts/docs/gen-props.mjs`, `apps/docs/components/Example.tsx` and `tests/dx/docs-content.test.ts` exist.
3. `packages/registry` packs (DX-093), so verdaccio can be seeded with `aura-glass`, the CLI and the registry package.
4. DS (DS-090 tailwind bridge): `aura-glass/tailwind.css` exports `glass-regular|clear|thin|thick` and `content-raised` utilities and the `ag-dark|ag-tinted|ag-solid` variants. Check the packed CSS in CI with `rg -n "glass-regular|@custom-variant ag-dark" <pkg>/dist/**/*.css`.
5. MAT-001/MAT-047 and CTL-055/CTL-057: `aura-glass/material` exports `MaterialVariant`, `Thickness`, `Layer`, `ContentMaterial`, `Shape`, `Tier`, `Transparency` and `Backdrop`. Button follows SC-24: `variant: regular|clear|identity`, `prominent`, `intent` for status, and no `material` prop. If CTL still ships `material` or `variant: primary|…`, DX-131/132 are BLOCKED on CTL (SC-24, PRD §21 OI-DX-01). `.meta.ts` files carry `variants`/`parts`.
6. PKG-092: `build/server-safe-exports.json` exists (for `rsc.md`).
7. A11Y `auraGlassPrepaintScript` status (accepted by SC-23; A11Y-032/A11Y-034), which decides the Vite quickstart wording (DX-024 fallback).

## 2. File scope

May create: `docs/quickstart/{next,vite}.md`, `docs/guides/{theming,tailwind,plain-css,choosing-a-material,shadcn,nextjs,vite,react-router,rsc,testing}.md`, `apps/docs/examples/material/*.tsx`, `tests/dx/fixtures/alpha-smoke/**`, `tests/dx/{quickstart,plain-css}.spec.ts`, `tests/dx/fixtures/plain-css-app/**`, `tests/dx/{quickstart-shape,readme-generated,tsdoc-coverage}.test.ts`, `tests/types/{autocomplete.test-d.ts,completions.test.ts}`, `scripts/docs/gen-readme.mjs`.
May modify: `README.md` (only the region between `<!-- generated:quickstart -->` markers, written by `gen-readme.mjs`), `tests/dx/docs-content.test.ts` (add the theming and rsc cases), `scripts/docs/gen-props.mjs` (add the `--rsc` and `--presets` table modes only), root `package.json` devDependencies (`tsd` exact pin), `.github/workflows/{docs,registry}.yml` (add the `quickstart` and `plain-css` jobs).
Must not touch: `src/**`, `packages/cli/src/**` (file CLI bugs against 16b), `registry/**`, `apps/docs/components/**`, the README outside the markers (16g owns the template).

## 3. Steps

1. **DX-119, DX-120.** Write the quickstarts.
   - Next: `npx create-next-app@latest …`, then `npx <PACKAGE_NAME> init`, `npx <PACKAGE_NAME> add app-frame`, then build and start.
   - Vite: `npm create vite@latest -- --template react-ts`, then the same.
   - Every runnable step is a fenced block tagged `{step}`. Allowed: ≤6 shell commands and ≤2 manual edits (target 0).
   - Forbidden: optional peers, `@source`, `tsconfig.json` edits.
   - Package names come from the docs-build variable bound to `PACKAGE_NAME`.
   Write `quickstart-shape.test.ts`.
2. **DX-121.** `alpha-smoke`: a local registry item rendering `Surface`, `Button` and `Dialog`. It is never published to `/r/`, and you remove it from the lane once `app-frame` certifies.
3. **DX-122.** `quickstart.spec.ts`:
   - Setup: a clean container on the remote runner with verdaccio seeded with the packed packages and only the third-party cache warmed.
   - Matrix: {next-tailwind, next-plain, vite-plain, vite-tailwind}.
   - Timing: excludes the scaffolder download and includes install, `init`, `add`, build and first render. Budgets: ≤300 s Next, ≤240 s Vite.
   - First render: the first screenshot after `load` + 2 rAF, at 1440 and 390, must contain `[data-ag-surface][data-ag-layer="chrome"]` passing the QA material-presence gate.
   - Errors: 0 console errors, and no `"use client"` boundary error in `next build` output.
   - Tailwind parity (next-tailwind): an element styled only with `glass-regular` has the same `backdrop-filter` as `[data-ag-variant=regular]`.
   - Output: `quickstart-timing.json`.
4. **DX-123.** `gen-readme.mjs` quickstart region, plus `readme-generated.test.ts` "quickstart".
5. **DX-124..DX-130.** Write the guides exactly as specified:
   - `theming.md`: one provider pair, `createGlassTheme`/`createBrandTheme`, a generated preset table, the five `data-ag-*` axes, nesting, the OS floors, and a "Coming from 4.x" table covering the 5 providers and both `createGlassTheme`s.
   - `tailwind.md`: v4 only.
   - `plain-css.md` + `plain-css.spec.ts`: an unlayered `.cta[data-ag-part="root"] { border-radius: 0 }` yields computed `0px`, with 0 `!important`.
   - `choosing-a-material.md`: one live example file per table cell, and contrast minima as `<Claim>`s.
   - `rsc.md`: a generated table that equals `build/server-safe-exports.json`.
   - `nextjs.md`, `vite.md`, `react-router.md`, `testing.md`: `testing.md` covers the `data-ag-part`/`data-state` contract and the Jest ESM setup.
   - `shadcn.md`.
6. **DX-131, DX-132.**
   - `autocomplete.test-d.ts`: the exact unions from REQ-DX-58, `@ts-expect-error` for `<Button variant="primary">`, `<Button variant="solid">` and `<Surface variant="solid">`, no `material`/`elevation` key on Button, and the `<Component>Part` unions.
   - `completions.test.ts`: the 5 probe positions (`<Button variant="|"`, `<Button intent="|"`, `<Surface thickness="|"`, `<Dialog.|`, `import { | } from "aura-glass/data"`), with expected sets read from `.meta.ts`, plus the "compat strike-through" check (`kindModifiers` includes `deprecated`).
7. **DX-133.** `tsdoc-coverage.test.ts`, with the stage taken from the `package.json` prerelease id.

## 4. Tests

- Local: `npx vitest run -c tests/dx/vitest.config.ts tests/dx/quickstart-shape.test.ts tests/dx/readme-generated.test.ts tests/dx/tsdoc-coverage.test.ts tests/dx/docs-content.test.ts tests/types/completions.test.ts`, and `npx tsd --files tests/types/autocomplete.test-d.ts`.
- Remote: `quickstart.spec.ts` (4 cells), `plain-css.spec.ts`, `docs:snippets` (guides and quickstarts included), `docs-a11y.spec.ts` (new guide routes).

## 5. Visual evidence

Upload each quickstart cell's first-render screenshot at 1440×900 and 390×844, light and dark, from the remote lane, together with `quickstart-timing.json` and the build logs. Also upload the plain-CSS override screenshot, and remote captures of `/docs/theming`, `/docs/tailwind` and `/docs/choosing-a-material` across the 8 scenes. A human reviewer confirms the first render is a certified glass app frame over a declared backdrop, with no unstyled flash.

## 6. Exit criteria

- AC-DX-04: all 4 cells pass material presence with 0 console errors, within ≤300 s (Next) / ≤240 s (Vite), on the GA SHA, using `app-frame` (alpha-smoke runs count only as calibration).
- AC-DX-12: completion sets at the 5 probe positions match exactly, and every `@ts-expect-error` case errors.
- AC-DX-13: TSDoc coverage is 100% on T0/T1 public props at RC.
- AC-DX-22 (guides half): all 10 guides exist, are linked from `nav.config.ts`, and compile.
- REQ-DX-56: 0 forbidden steps. REQ-DX-57: the README quickstart region equals the generated output.

## 7. Final report format

```
PROMPT-16f report
PR: <url>  SHA: <sha>
Prereqs: 1 <app-frame certified|alpha-smoke> 2 <ok> 3 <ok> 4 <utilities/variants present|missing> 5 <ok|missing types> 6 <ok> 7 <prepaint const present|fallback>
Tasks: DX-119 <done|blocked: reason> … DX-133
Quickstart (remote, runner <class>): next-tailwind <s>, next-plain <s>, vite-plain <s>, vite-tailwind <s>; console errors 0; material presence pass 4/4
Steps: next <cmds>/<edits>, vite <cmds>/<edits>
Types: completions 5/5 exact; ts-expect-error <n>/<n>; TSDoc T0/T1 <%> T2 <%>
Artifacts: <urls>; reviewer: <name> <verdict>
AC: AC-DX-04 <pass|calibration|fail>, AC-DX-12 <pass|fail>, AC-DX-13 <pass|pending RC>, AC-DX-22(guides) <pass|fail>
Deviations: <list>
```
