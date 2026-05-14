# 3.2 Completion Audit

This audit answers whether `auraglass32PRD.md` is truly complete in the current working tree.

## Summary

Result: not complete in full.

Substantial package work is implemented and verified, but the PRD remains broader than the completed evidence. The current state is a strong 3.2 package candidate for dependency-sovereign app chrome, not a fully closed PRD.

## Completed With Evidence

| Area | Status | Evidence |
| --- | --- | --- |
| Package version | Done | `package.json` reports `3.2.0`. |
| First-party icons | Done for package surface | `src/icons`, `aura-glass/icons` export tests, tree-shaking gate, full Jest snapshots. |
| Lucide removal from core package | Done | `node scripts/ci/verify-no-core-ui-deps.js --json` passed. |
| First-party primitives | Done for initial primitive layer | `src/primitives`, primitive subpath exports, focused primitive tests. |
| Package a11y script | Done | `npm run test:a11y` passed, 3 suites / 14 tests / 2 snapshots. |
| App-chrome axe checks | Done for focused component fixtures | `npm run test:a11y:app-chrome` passed, 8 tests covering dropdown menu, select, dialog, drawer, popover, tooltip, tabs, and command palette. |
| Radix removal from core package metadata/source | Done for current source | `verify-no-core-ui-deps` passed; touched Radix-backed components use AuraGlass primitives. |
| MUI package elimination | Done for package dependency contract | MUI is absent from package metadata and source imports. |
| App shell/workspace entrypoints | Done | `src/app-shell`, `src/workspace`, package exports, export tests, focused tests. |
| Theme Engine 2.0 | Done for implemented API | `src/theme`, `aura-glass/theme`, focused tests, export tests. |
| CLI audit/migration commands | Done for smoke-tested commands | `npm run test:cli` passed. |
| CLI migration fixtures | Done for first-pass coverage | `scripts/ci/verify-cli.js` now creates fixture apps for Lucide, Radix, and MUI detection plus Lucide rewrite. |
| Recipe registry expansion | Done | 20 recipes in `aura-glass/registry`; CLI dry-run exercises every recipe. |
| Recipe render and screenshot evidence | Done | `npm run test:recipes:render` passed; 20 recipe screenshots are checked in under `reports/3.2-release/recipe-screenshots`. |
| App-chrome visual and keyboard baselines | Done for automated packed-package evidence | `npm run test:visual:app-chrome` passed; screenshots were captured for icons, dropdown menu, select, dialog, drawer, popover, tooltip, tabs, command palette, mobile shell, and reduced motion under `reports/3.2-release/app-chrome-visuals`; the same fixture passed 7 browser keyboard/interaction checks. |
| Storybook gallery/build evidence | Done for 3.2 icon and app-chrome stories | Real first-party icon gallery and app-chrome visual baseline stories were added; `npm run build-storybook -- --quiet` passed. |
| Shared menu primitive and menubar wiring | Done | Added `GlassMenuPrimitiveRoot`, `GlassMenuPrimitiveContent`, and `GlassMenuPrimitiveItem`; `GlassMenubar` now composes through the shared primitive layer and focused tests verify the primitive root and arrow-key navigation. |
| App-chrome behavior hardening | Done for code-related PRD gaps called out in `PROMPT.md` | Focused tests now cover dropdown keyboard navigation, checkbox/radio items, keyboard submenu opening, select controlled/uncontrolled/form/typeahead/mobile-contained behavior, multiselect grouped keyboard selection/disabled/controlled behavior, and data-table sorting/selection/loading/empty/actions/pagination states. |
| Production workflow layer | Improved with focused evidence | Added package-owned empty/error/loading states, filter bar, search field, form field wrappers, validation message, date/time fields, combobox, page tabs, and toast provider re-export; focused workflow and component hardening tests passed. |
| Vite smoke test | Done | `npm run test:integration:vite` passed and wrote `reports/3.2-release/vite-integration.json`. |
| Build/type/test/pack gates | Done for rerun gates listed in reports | `npm run build`, `typecheck`, `test`, `test:exports:*`, `verify:pack`, `prepublishOnly`, and `npm pack --dry-run --json` have passing evidence. |
| Publish readiness | npm published; GitHub release pending | `npm run prepublishOnly` passed after rebuilding. npm auth works when `.env` `NPM_TOKEN` is supplied through a temporary npmrc. `aura-glass@3.2.0` was published to npm and public `latest` verifies as `3.2.0`; the matching GitHub release/tag is still pending. |
| Core docs added | Done | README, installation guide, migration docs, icon docs, primitive docs, app-shell docs, theme docs, workflow docs, CLI docs, and release reports exist. |

## Not Complete Or Not Yet Proven

| PRD area | Current status | Why it is not complete |
| --- | --- | --- |
| PRD checkboxes | Open | `auraglass32PRD.md` still has 399 unchecked boxes and no checked-box evidence trail. |
| Full app-chrome certification | Partial | Automated tests, axe checks, screenshot baselines, and browser keyboard/interaction checks exist, but manual screen-reader certification is explicitly pending. |
| Primitive behavioral depth | Improved, still partial | Tests now cover nested content, outside focus, prevented dismissal, Home/End/disabled/RTL, collision, focus restoration, dropdown keyboard navigation, select typeahead, and shared menu primitive composition. More complete browser/SR evidence still needs the manual certification pass. |
| Workflow hardening | Partial only for manual route certification | Phase 12 now has code, docs, Storybook, exports, focused workflow coverage, multiselect keyboard/controlled tests, and data-table state hardening tests. Route-level screen-reader/mobile certification remains open. |
| Public release | Partially complete | npm latest is now `aura-glass@3.2.0`; a matching GitHub release/tag has not been created yet. |
| Changelog/docs sweep | Improved, not exhaustive | Core related docs are updated in this pass, but the repository has hundreds of historical Markdown files. Historical 3.0/3.1 reports intentionally retain old version/count language. |

## Markdown Status

Updated or added for 3.2:

- `README.md`
- `INSTALLATION.md`
- `CHANGELOG.md`
- `docs/readme.md`
- `docs/icons/readme.md`
- `docs/primitives/readme.md`
- `docs/app-shell/readme.md`
- `docs/theme/theme-engine.md`
- `docs/workflows/readme.md`
- `docs/cli/migration.md`
- `docs/migration/lucide-to-auraglass-icons.md`
- `docs/migration/radix-to-auraglass.md`
- `docs/migration/mui-to-auraglass.md`
- `reports/README.md`
- `reports/3.2-release/*.md`

Historical docs and release reports for 3.0 and 3.1 still mention old versions, Radix/Lucide peers, and 356-count evidence where they are documenting those older releases.

## Honest Release Position

Accurate statement:

> AuraGlass 3.2 has substantial package implementation completed: first-party icons, first-party primitives, shared menu primitive composition, app shell/workspace entrypoints, Theme Engine 2.0, 20 recipes, dependency-elimination gates, package export tests, pack verification, full Jest, Next integration, Vite integration, CLI migration fixtures, recipe screenshot evidence, packed-package app-chrome visual and keyboard baselines, focused app-chrome axe checks, Storybook icon/app-chrome gallery evidence, and focused behavioral hardening for dropdown, select, multiselect, and data-table surfaces. It is not yet fully complete against every PRD acceptance item because manual screen-reader/mobile certification remains open.

Do not mark `auraglass32PRD.md` fully complete until the missing items above are either implemented and evidenced or explicitly descoped from the PRD.
