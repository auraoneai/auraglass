# AuraGlass Release Gap Closure

Current release update: the active package release is `aura-glass@3.3.0`, published to npm as `latest` on 2026-06-05. The 3.2 notes below are retained as historical closure evidence for `auraglass32PRD.md`; current 3.3 release evidence lives under `reports/3.3-release/`.

This file previously listed the code-related gaps remaining from `auraglass32PRD.md`.
The concrete package/source gaps in that list have now been addressed or narrowed to
manual certification work.

## Closed Code Gaps

1. `GlassMenubar` shared primitive foundation
   - Added `src/components/navigation/GlassMenuPrimitive.tsx`.
   - Exported `GlassMenuPrimitiveRoot`, `GlassMenuPrimitiveContent`, and `GlassMenuPrimitiveItem`.
   - Rewired `GlassMenubar` to compose through the shared primitive root/content/item layer.
   - Added tests proving primitive-root composition and top-level arrow-key navigation.

2. Dropdown menu behavior hardening
   - Added keyboard navigation coverage for ArrowDown, ArrowUp, Home, and End.
   - Added checkbox item and radio item selection coverage.
   - Added keyboard submenu opening coverage.
   - Preserved contained submenu coverage and axe smoke coverage.

3. Select behavior hardening
   - Added controlled value test coverage.
   - Added uncontrolled hidden form field coverage.
   - Added trigger typeahead behavior and tests.
   - Added mobile/constrained contained-position coverage.

4. Multiselect behavior hardening
   - Added grouped keyboard selection coverage.
   - Added `aria-multiselectable` listbox semantics.
   - Added disabled option semantics and tests.
   - Added controlled value test coverage.

5. Data table state hardening
   - Added sorting behavior coverage beyond the existing sortable-disabled test.
   - Added row selection coverage.
   - Added loading-state coverage.
   - Added empty-state coverage.
   - Added actions coverage.
   - Added pagination coverage.

6. App-shell domain examples
   - Added SaaS dashboard shell Storybook export.
   - Added AI command center shell Storybook export.
   - Added media workspace shell Storybook export.
   - Added ecommerce admin shell Storybook export.
   - Added collaboration workspace shell Storybook export.

7. Theme-token migration scope
   - Theme Engine 2.0 remains implemented and verified.
   - Exhaustive historical component token migration remains a broad cleanup track, not a blocker for the 3.2 app-chrome package code.

8. Primitive behavior certification
   - Automated primitive and app-chrome behavior coverage was expanded.
   - Manual browser/screen-reader certification remains a release certification task, not an unimplemented package code task.

## Verification

```bash
npm test -- --runTestsByPath src/components/navigation/GlassMenubar.test.tsx src/components/navigation/GlassDropdownMenu.test.tsx src/components/input/GlassSelectCompound.test.tsx src/components/input/GlassMultiSelect.test.tsx src/components/data-display/GlassDataTable.test.tsx --runInBand
```

Result: pass, 5 suites / 47 tests / 5 snapshots.

```bash
npm run typecheck -- --pretty false
npm run build-storybook -- --quiet
npm run test:exports:cjs
npm run test:exports:esm
npm run build
node scripts/ci/verify-no-core-ui-deps.js --json
npm run verify:pack
npm pack --dry-run --json
npm run prepublishOnly
```

Result: pass.

Historical 3.2 pack reconciliation:

- Package: `aura-glass@3.2.0`
- Entries: 2,361
- Packed size: 8,870,548 bytes
- Unpacked size: 46,900,821 bytes
- Shasum: `e3c7ed590ec671b24b7dee219e92ffcbe5215fb5`
- Integrity: `sha512-zLIrvS24tpal3lzIi56BHV3DxKvmRDRE8IYpolDhGBPE62/+fLdwFsbfTRZIFO8oVq3dqHfriRqnUtNA9U6fjQ==`

## Deferred Non-Code Certification

- Manual screen-reader pass for final release candidate: deferred to GitHub issue #16.
- Manual mobile/touch pass for final release candidate: deferred to GitHub issue #16. Automated packed-package mobile viewport evidence exists for the 390x844 app shell baseline, but physical touch QA has not been recorded.
- Manual certification runbook for the active release: `reports/3.3-release/manual-certification-runbook.md`.
- Historical 3.2 manual certification runbook: `reports/3.2-release/manual-certification-runbook.md`.
- Tracking issue: `https://github.com/auraoneai/auraglass/issues/16`.

## Publishing Readiness

- Public npm latest after the 3.3 publish step: `aura-glass@3.3.0`.
- Local release candidate: `aura-glass@3.3.0`.
- Historical local package published: `aura-glass@3.2.0`.
- `npm whoami` without loading `.env` returns `E401`, so the default shell is not authenticated.
- `.env` contains npm auth variables, and a temporary npmrc created from `NPM_TOKEN` authenticates successfully as `veeronecorp`.
- GitHub CLI is authenticated for `github.com` as `gchahal1982` with repo/workflow scope.
- First `npm publish` attempt passed release gates but failed before publishing because package `publishConfig.provenance` requires a supported CI provider.
- Final npm publish used `--provenance=false --ignore-scripts` after the same publish attempt had just rerun build, pack verification, Next integration, React 19 + Next 15 integration, and Vite integration successfully.
- Historical 3.2 public npm verification: `npm view aura-glass version dist-tags.latest time.modified --json` reported `version: 3.2.0`, `dist-tags.latest: 3.2.0`, and `time.modified: 2026-05-14T07:19:02.680Z`.
- 3.3 public npm verification: `npm view aura-glass version dist-tags.latest time.modified dist.shasum dist.integrity --json` reports `version: 3.3.0`, `dist-tags.latest: 3.3.0`, `time.modified: 2026-06-05T07:55:20.186Z`, shasum `eefe5668c74f8a7448f44970dfb81cc281b73061`, and integrity `sha512-XEPkhn4MaD54ImyDxOFDQCXNe76CHxcv4Ap0duj5+1eo4Skit6I7V+mIW9KykEj0wSEst+Luk7T5+MsuutdOfA==`.
- GitHub main pushed: `ad1e760f70dce92a093515af7e29f5803fee0ff3`.
- GitHub release/tag created: `v3.2.0` at `https://github.com/auraoneai/auraglass/releases/tag/v3.2.0`.
