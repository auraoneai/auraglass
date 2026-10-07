# PROMPT-16e (DX): docs app, generated pages, docs gates, generated migration guide

Source PRD: `docs/auraglass-5/prd/AURAGLASS_DEVELOPER_EXPERIENCE_PRD.md` (Key DX; alias PRD-16; contracts in `prd/_shared-contracts.md`: SC-02, SC-04, SC-35, SC-38, SC-40). Requirements: REQ-DX-69..76, REQ-DX-81..83, REQ-DX-72 (4.x docs deletion), plus §11.11 (redirects), §13.2 (story parity), §14.3, §15.4 and the §16 docs budgets. Acceptance: AC-DX-14, AC-DX-15, AC-DX-16, AC-DX-18, AC-DX-21, and the IA half of AC-DX-22. Tasks: `docs/auraglass-5/tasks/DX.json` DX-101..DX-118. Architecture: §15.3 (claims), D-27 (`deprecations.json` single source), D-32. Index and crosswalk: `docs/auraglass-5/prompts/PROMPT_16_DX.md`.

## 0. Common rules (binding)

- Remote-first. You may run locally (node only): the generators `scripts/docs/gen-{props,selectors,redirects}.mjs`; `npx vitest run -c tests/dx/vitest.config.ts` over `tests/dx/{docs-artifact,docs-ia,docs-pages,docs-imports,links,docs-removed,migration-guide,docs-content,compile-snippets}.test.ts` and `docs-components.test.tsx` (jsdom). Run remotely in `.github/workflows/docs.yml` (public repo, hosted runners per `ci-selection.md`) or via the `auraone-remote-run` skill: the `next build` static export of `apps/docs` (≤10 min), `compile-snippets.mjs` over all docs (`docs:snippets`, ≤5 min), `docs-a11y.spec.ts`, `docs-lighthouse.spec.ts`, and the Vercel preview deploy. Never use local Docker. Never launch a local browser.
- Don't fake completion:
  - Docs examples import from the packed tarball installed into `apps/docs`, never from `src/`, a workspace link or `@/`.
  - No inline example strings. Examples are files under `apps/docs/examples/**`.
  - No hand-written props tables, selector tables or deprecation text. Those are generated.
  - Don't approve the IA snapshot with `-u`. The DX owner approves it in the PR.
  - No lowered Lighthouse or axe thresholds, and no `test.skip`.
  - Don't suppress a failing snippet by tagging it `{fragment}` unless it truly is a fragment.
- Prose under `apps/docs/content/**` contains no numeric claims outside `<Claim id>` (16g enforces this; don't create violations now).
- A missing prerequisite owned by another PRD means that task is BLOCKED: report it.
- Evidence is CI artifacts (D-32).

## 1. Prerequisites

1. Packed tarball (TRUST-002 `scripts/ci/lib/npm-pack.js`, PKG-009 build; SC-06): CI produces `.artifacts/aura-glass-<version>.tgz` (`rg -n "\.artifacts" scripts .github` or the PRD-02 pack script). The PKG-005 exports manifest and PKG-092 `build/server-safe-exports.json` exist (the latter is needed by 16f's `rsc.md`).
2. `.meta.ts` schema: `rg --files src | rg "meta\.schema\.ts$"` (owner FND; anchor FND-005 `src/foundation/parts.ts`, SC-27; index deviation 6), plus at least Button, Dialog and Surface `.meta.ts` files. Without them, DX-104..DX-106 are BLOCKED.
3. REL API reports in `etc/api/<slug>.api.md` and `etc/api/<slug>.exports.json` (SC-04, slug `.` → `index`; TRUST-071, REL-003), REL-070 `gen-deprecations.mjs --docs` producing `docs/migration/5.0/deprecations.generated.md`, and REL-100 `docs/release/breaking-changes.json` (B1–B21).
4. 16c fixture tree: `packages/cli/src/migrate/4to5/__fixtures__/<id>/basic/` exists for each of the 8 core transforms (the migration guide embeds them).
5. QA-039 scenes (`scenes.manifest.json`, the 8 SC-28 scenes), MAT-047 `Surface`/`Environment`, plus the A11Y focus token, for `Example.tsx`.
6. Hosting: if the repo has no linked Vercel project (`ls apps/docs/vercel.json .vercel` absent at HEAD), DX-118's deploy step reports an operator blocker: link the project and add `VERCEL_*` repository secrets. Never create tokens and never run `vercel login`. The build and test jobs still run.
7. Before DX-111: the branch is `main` at 5.0.0-beta.1, and FND-142 (the 4.x docs deletion, owned by FND per SC-38) is open or merged.

## 2. File scope

May create: `apps/docs/{package.json,next.config.ts,tsconfig.json,nav.config.ts,redirects.json,vercel.json}`, `apps/docs/app/**` (routes), `apps/docs/components/{Example,Claim,PropsTable,PartsTable,SceneSwitcher,CodeBlock}.tsx`, `apps/docs/content/{introduction,cli}.mdx`, `apps/docs/content/foundations/{accessibility,motion,layers-and-css}.mdx`, `apps/docs/content/migrate/{5,from-mui,from-radix,from-lucide}.mdx`, `apps/docs/examples/**`, `scripts/docs/{gen-props,gen-selectors,gen-redirects,compile-snippets}.mjs`, `tests/dx/{docs-artifact,docs-ia,docs-pages,docs-imports,links,docs-removed,migration-guide,docs-content,compile-snippets}.test.ts`, `tests/dx/docs-components.test.tsx`, `tests/dx/{docs-a11y,docs-lighthouse}.spec.ts`, `.github/workflows/docs.yml`, `.gitignore` (`apps/docs/generated/`, `apps/docs/out/`).
May modify: `scripts/ci/verify-markdown-links.js` (extend only: case-sensitive resolution plus app routes). May delete: nothing under `docs/**`. FND-142 deletes the REQ-DX-72 paths; DX-111 only verifies the deletion and supplies the list (SC-38).
Must not touch: `src/**`, `.meta.ts` files, `scripts/release/**`, the repo-root `deprecations.json`, `docs/release-rollback-deprecation.md`, `docs/auraglass-5/**`, `.storybook/**`, `docs/quickstart/**` and `docs/guides/**` (16f), `README.md` (16f/16g).

## 3. Steps

1. **DX-101.** `apps/docs`: Next 16, React 19, `output: "export"`, every dependency exact-pinned, and `"aura-glass": "file:../../.artifacts/aura-glass-<version>.tgz"`. CI rewrites the version from the pack output. Write `docs-artifact.test.ts`.
2. **DX-102.** `nav.config.ts` with exactly the REQ-DX-70 tree, plus `docs-ia.test.ts`, whose snapshot needs DX owner approval in the PR.
3. **DX-103.** Components:
   - `<Example file>`: inside `<Environment>` with a declared backdrop, plus a `SegmentedControl` scene switcher (radiogroup) over the 8 scenes and a 390 px toggle.
   - `<Claim id>`: an unknown id throws at build. `PropsTable`, `PartsTable`.
   - Layout: skip link, library focus ring, focusable scroll regions (`tabindex=0`, `role=region`, `aria-label`), nav collapsing into a `Sheet` below 768 px. It must work at 320 px.
4. **DX-104, DX-105, DX-106.** `gen-props.mjs` builds component pages from `.meta.ts` plus the API report:
   - Page content: import line, examples, props/parts/state/keyboard tables, RSC status, size and perf `<Claim>`s, "Replaces in 4.x".
   - It fails on a missing TSDoc or a non-exported component.
   - `gen-selectors.mjs` builds tables from `selectorChanges`, failing when the field is missing.
   - Story-parity test.
5. **DX-107, DX-108, DX-109.**
   - `compile-snippets.mjs`: strict, `react-jsx`, `moduleResolution: bundler`, against the packed `.d.ts`. Its first run records the measured baseline (the PRD cites 79/278 failing at 4.1.0; report the number you measure). The gate is 0.
   - `docs-imports.test.ts`.
   - Link checker: `realpathSync.native` case comparison plus `apps/docs/out` routes.
6. **DX-110.** `gen-redirects.mjs` turns the `doc` fields plus the hand list of deleted guides into `redirects.json` and the `vercel.json` `redirects` (301), and adds `/v4` → the 4.x tag docs. Add a `links.test.ts` "redirects" case.
7. **DX-112, DX-117.** Rewrite the three `docs/migration/*` guides into `apps/docs/content/migrate/from-*.mdx` with 5.0 names. Write the Get started and Foundations prose pages (no numbers, no API tables).
8. **DX-113, DX-116.** `migrate/5.mdx` is a thin template rendering `deprecations.generated.md` plus `breaking-changes.json`, with the sections exactly as REQ-DX-81 lists them and one `#dep-NNNN` anchor per entry. Write `migration-guide.test.ts`, and create `docs-content.test.ts` with the no-`Glass*`-in-prose case.
9. **DX-111 (beta.1, consume-only).** Give FND-142 the REQ-DX-72 list, then write `docs-removed.test.ts`. It asserts the paths are absent, the two internal paths are kept, the paths are excluded from the tarball, and every deleted path has a redirect (DX-110). Merge DX-110 before FND-142 lands.
10. **DX-114, DX-115, DX-118.** Remote lanes:
    - axe on every route in Chromium + WebKit (colour contrast on, 0 serious/critical), plus the 390×844 overflow check.
    - Lighthouse mobile on home, `/components/button` and `/migrate/5`: Performance ≥90, Accessibility 100, Best practices ≥95, LCP ≤2.5 s, CLS ≤0.05, TBT ≤200 ms.
    - `docs.yml` builds, gates, the preview deploy, and the production deploy on the GA tag.

## 4. Tests

- Local: `npx vitest run -c tests/dx/vitest.config.ts tests/dx/docs-*.test.ts tests/dx/links.test.ts tests/dx/migration-guide.test.ts tests/dx/compile-snippets.test.ts tests/dx/docs-components.test.tsx`.
- Remote (`docs.yml`): `docs:snippets`, the static build, `docs-a11y.spec.ts`, `docs-lighthouse.spec.ts`, and the redirect 301 check against the preview URL.

## 5. Visual evidence

From the remote lanes, upload screenshots of home, `/components/button`, `/migrate/5`, `/docs/theming` (once 16f lands) and one Surfaces page at 1440×900 and 390×844, light and dark, in Chromium and WebKit, together with axe JSON and Lighthouse HTML reports. Also upload the scene switcher across all 8 scenes on the Button page. A human reviewer checks readability over every scene.

## 6. Exit criteria

- AC-DX-14: `docs:snippets` 0 failures (measured baseline recorded).
- AC-DX-15: import lint has 0 violations, and the link check has 0 broken links (case-sensitive).
- AC-DX-16: axe is 0 serious/critical on every page in both engines, and the Lighthouse budgets are met on the 3 probe pages.
- AC-DX-18: the migration guide has one anchor per entry, and there are 0 hand-written `Glass*` tokens in its prose.
- AC-DX-21: there are 0 component pages for symbols absent from the runtime export snapshot.
- AC-DX-22 (IA half): `docs-ia.test.ts` snapshot approved by the DX owner.
- DoD 6: the REQ-DX-72 paths are absent on `main` after beta.1, and each returns a 301 on the preview.

## 7. Final report format

```
PROMPT-16e report
PR: <url>  SHA: <sha>  Preview: <url|blocked: operator must link Vercel project>
Prereqs: 1 <tarball ok> 2 <meta registry ok|blocked FND-005> 3 <api/--docs/breaking ok|missing> 4 <fixtures ok> 5 <scenes/Environment ok> 6 <hosting> 7 <beta.1 status>
Tasks: DX-101 <done|blocked: reason> … DX-118
Snippets: baseline measured <fail>/<total>; now 0/<total>
Gates: imports 0, links 0, pages-for-unexported 0
a11y: routes <n>, serious/critical 0 (C+W); Lighthouse home/button/migrate: P <n> A <n> BP <n> LCP <s> CLS <n> TBT <ms>
Build: <min>, out/ <MB>
Artifacts: <urls>; reviewer: <name> <verdict>
AC: AC-DX-14/15/16/18/21/22(IA) <pass|fail|blocked each>
Deviations: <list>
```
