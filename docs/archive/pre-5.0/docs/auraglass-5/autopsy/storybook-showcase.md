# AuraGlass 5.0 Autopsy — Storybook & Showcase

Scope: `.storybook/*`, `src/stories/*` (21 files), 460 `*.stories.tsx`, `storybook-static/index.json` (1,687 entries), `src/components/showcase`, `src/components/demo`, `src/components/templates/showcase`, `examples/`, `reports/storybook-*.md`, the certification run (`reports/glassmorphism-storybook-visual-certification*`), and `.github/workflows/deploy-storybook.yml` / `visual-regression.yml`.

Method note: the image viewer returned empty output for every PNG (and for JPEG conversions), so I couldn't look at the screenshots directly. Instead I measured all 356 desktop certification screenshots with pixels: luminance, colorfulness (Hasler–Süsstrunk), and the bounding box of pixels that differ from the row median. I also ran OCR (`tesseract`) on a sample. The visual conclusions below come from those measurements plus the story source code.

## Summary & score: 3/10

There is a lot of Storybook: 1,598 stories and 89 docs pages across 460 titles, and almost every component file has at least one story. As a showroom for a premium material system, though, it fails. Every component sits on the same near-white gray gradient. Of the 356 certification screenshots, 351 have mean luminance above 200 (median 245/255). 330 are effectively monochrome (colorfulness below 8). None shows a dark, photographic, or saturated backdrop. Glass that refracts and samples its backdrop can't be judged over a blank backdrop, so the stories hide the library's main visual feature.

Story quality is inconsistent:

- 128 titles are machine-generated "Default + Variants" pairs. 132 files carry the boilerplate description "A glass morphism X component."
- The "Category Galleries" render zero components.
- The flagship showcase overrides its own components with 24 `!important` rules.
- The "State Matrix" showcase imports no library component at all.

The "visual certification" that labels all 356 components "passed" can't fail. Its pass checks are met by the global decorator alone, so blank stories pass.

## What exists (counts)

| Item | Count | Evidence |
|---|---:|---|
| Index entries | 1,687 (1,598 story, 89 docs) | `storybook-static/index.json` |
| Story titles (components/pages) | 460 | same |
| `*.stories.tsx` files in `src` | 460 | `rg --files src -g '*.stories.tsx'` |
| Titles with exactly 1 story | 132 | index analysis |
| Titles that are only `Default` + `Variants` | 128 | index analysis |
| Titles that are only `Default` | 50 | index analysis |
| Files with boilerplate "A glass morphism … component." | 132 | `rg -l "A glass morphism" src -g '*.stories.tsx'` |
| Stories with `play` functions | 7 (in 4 files) | `GlassSelect.stories.tsx:71`, `GlassCombobox.stories.tsx:55,67`, `GlassContextualEngine.stories.tsx:63,81`, `GlassPredictiveEngine.stories.tsx:68,80` |
| Story files using any image/photo/video | 17 / 460 | `rg -il "unsplash\|<img \|url\(" …` |
| Story files setting `previewSurface: 'media'` | 0 | `rg` |
| Story files setting `parameters.backgrounds` | 0 | `rg` |
| Inline hex colors in stories | 948 | `rg -o "#[0-9a-fA-F]{6}"` |
| Inline gradients in stories | 275 | `rg -o "linear-gradient\|radial-gradient"` |
| `any` in stories | 104 | `rg -o "as any\|: any"` |
| MDX docs | 0 | — |
| Component files not referenced by any story | 8 (3 `.r3f` effects, 3 chart style helpers, `ARGlassEffects.r3f`, `StorybookVisualShowcase`) | script over `src/components` |

Stories per top-level group (share of 1,598):

| Group | Stories | |
|---|---:|---|
| Effects + Advanced | 436 | 27% |
| Surfaces | 248 | (180 of these are "App Shells + Layout") |
| Workflows | 220 | |
| AI + Intelligence | 185 | |
| Controls | 153 | (Buttons 50, Inputs 90) |
| Data + Visualization | 139 | |
| Foundations | 91 | |
| Reference | 81 | (62 "Legacy Components") |
| Navigation | 71 | |
| Media | 33 | |
| Marketing | 15 | |
| 3.2 / 3.3 | 10 | |
| Showcases | 3 | |
| Start Here / Certification | 1 / 1 | |

The distribution is upside down. Speculative components get the most stories: Glass Deep Dream Glass has 27, Glass GANGenerator 25, Glass Live Filter 25, Glass Music Visualizer 24. Core product primitives get two each: Glass Tabs, Glass Sidebar, Glass Header, Glass Breadcrumb, Glass Context Menu, Glass Toolbar, Glass Segmented Control, Glass Command Bar. Glass Button has 19, fewer than Deep Dream.

## What is excellent (keep)

- **Decorator architecture.** `.storybook/preview.tsx:157-205` wraps every story in the real `AccessibilityProvider`, `AnimationProvider`, `ThemeProvider` and a `StorySurface`. It also exposes persona and preview-mode toolbars (`preview.tsx:61-88`). That is the right skeleton for a Material Lab.
- **Surface-kind abstraction.** `StorySurface.tsx:4,35-56` has `component | app | media | plain`, and 235 stories opt into `previewSurface`. It's the right hook; it just needs real scenes behind it.
- **Sidebar taxonomy and sort order.** `preview.tsx:137-154` groups stories by developer task (Foundations → Controls → Navigation → Surfaces → …). That is better than an alphabetical dump.
- **Hand-written stories that frame components in context.** `navigation/GlassSidebar.stories.tsx:38-58` shows the sidebar with adjacent app content and real collapse state. `modal/GlassModal.stories.tsx` has real density (OCR: "Launch campaign… footer action row"). `media/LiquidGlassPhotoInspector.stories.tsx:21-22` and the media player stories use real media. These are the template for 5.0.
- **`AppChromeVisualBaseline.stories.tsx`.** It composes `GlassTopBar`, `GlassSidebarRail`, menu, select, tabs, command palette and tooltip from the package itself, over a dark, colored backdrop (`:167-168`). It is the only built-in story that resembles a first-party app screenshot.
- **Marketing Launch story.** `AuraGlass33MarketingLaunch.stories.tsx:4-13,47-80` composes real package marketing components into a page.
- **Coverage breadth.** Only 8 component files lack a story reference.

## What is mediocre

- **Generated Default/Variants stories (128 titles).** Example: `interactive/GlassCarousel.stories.tsx:31-48`. `Default` passes no args at all, and `Variants` renders one carousel whose only content is the text "Default". The certification screenshot measures 1.7% content area. `data-display/GlassToast.stories.tsx:13` reads "A glass morphism glasstoast component." The story content is "Sample Toast / This is a sample toast notification." (OCR confirmed).
- **One frame for everything.** `layout: 'centered'` puts a small control at the center of a 1440×900 white field. Median content area across all certification screenshots is **12% of the frame**. 163 of 356 are under 10%. The GlassButton certification shot is a single "Click Me" button covering 0.2% of the frame.
- **Feature stories that don't enable the feature.** `button/GlassButton.stories.tsx:286-304` "WithPredictiveFeatures" and `:306-331` "WithEyeTracking" render a plain `<GlassButton {...args}>` with text claiming the feature. The component accepts `predictive`/`eyeTracking` props (`GlassButton.tsx:264-288`), but the stories never set them. "ConsciousnessShowcase" (`:454-506`) is a bullet list of claims next to an ordinary button.
- **Arg/option mismatch.** `GlassButton.stories.tsx:42` offers elevation options `none|low|medium|high|ultra`, but the default arg is `'level2'` (`:59`), so the control starts in an invalid state.
- **Categorization errors.** Glass Carousel, Avatar Group, File Tree, Inline Edit, Focus Ring and Gradient Picker sit under "Effects + Advanced". Toast, Alert, Accordion and Typography sit under "Data + Visualization". Focus Trap and Screen Reader sit under "Foundations/Liquid Glass Primitives". There is also a lowercase title, `Surfaces/Cards + Panels/glass card link`.
- **Docs.** 89 autodocs pages and zero MDX. There are no usage guidelines, do/don't pages, or material explanation pages.

## What is outdated

- **Version-named sidebar groups in a 4.1.0 package.** `3.2/App Shell`, `3.2/AuraGlass Icons`, `3.2/Production Workflow Components`, `3.3/Marketing Launch Kit`, `3.3/Theme Preset Showcase` (`src/stories/AppShell.stories.tsx:5`, `AuraGlassIcons.stories.tsx:5`, `ProductionWorkflowComponents.stories.tsx:22`, `AuraGlass33MarketingLaunch.stories.tsx:218`, `AuraGlass33ThemeShowcase.stories.tsx:243`). There is also `Reference/3.2/App Chrome Visual Baseline` (`AppChromeVisualBaseline.stories.tsx:237`). "3.2"/"3.3" aren't in `storySort.order` (`preview.tsx:139-153`), so they float unsorted.
- **Start Here guide is stale.** `CuratedComponentGuide.stories.tsx:83-85` says "3.0 Release Scope: Major". Two hard-coded counts never update: `liquidGlassModuleCount = 29` and `liquidGlassExportCount = 65` (`:18-19`). The Component Gallery hard-codes "412 component stories" (`ComponentGallery.stories.tsx:54`), but the index has 460 titles.
- **Mixed Storybook test packages.** `package.json:433-437` pins `@storybook/jest ^0.2.3`, `@storybook/testing-library ^0.2.2` and `@storybook/test 9.0.0-alpha.2` alongside `storybook 9.1.20`. 53 story files import `@storybook/test` and 3 import the correct SB9 `storybook/test`.
- **Committed `storybook-static/` build.** It is dated 2026-09-05 and gitignored (`.gitignore:87`), but all tooling and reports read it as truth. It isn't regenerated with source changes.
- **Hand-written `process.env` shim and server-only externals** in `main.ts:35-67`, covering `openai`, `redis`, `bcryptjs`, `jsonwebtoken`, `@pinecone-database/pinecone` and `@google-cloud/vision`. A UI library's Storybook having to externalize these is a sign the component graph imports backend SDKs.

## Duplication

- **The CategoryGallery component is copy-pasted** with an identical `styles` object across `ButtonGallery`, `BackgroundsGallery`, `FocusGallery`, `DataDisplayGallery` (renamed `Catalog`), `InteractiveGallery`, `WidgetsGallery`, `NavigationGallery`, `ChartsGallery` and `CoreGallery` (e.g. `ButtonGallery.stories.tsx:13-41`, `FocusGallery.stories.tsx:13-35`).
- **Alias stories.** `3.2/App Shell` defines 6 stories (Native, SaaS Dashboard, AI Command Center, Media Workspace, Ecommerce Admin, Collaboration Workspace). All 6 are `{...FullSurface}` with only a new name, so they are pixel-identical (`AppShell.stories.tsx:8-33`). `3.2/AuraGlass Icons` re-exports `IconsGallery.Gallery` (`AuraGlassIcons.stories.tsx:1-8`).
- **Same component, two titles.** Glass File Upload, Glass Stepper, Glass Data Table, Glass Toast, Glass Card Link and Glass Collaborative Cursor each appear under two different sidebar groups. `GlassErrorBoundary` has two story files (`src/components/GlassErrorBoundary.stories.tsx`, `src/utils/errorBoundary.stories.tsx`).
- **Overlapping families are each storied separately.**
  - Tabs: Glass Tabs, Enhanced Glass Tabs, Glass Tab Bar, Liquid Glass Tab Bar, Glass Tab Item, Tab Item, Glass Page Tabs.
  - Skeletons: Glass Skeleton, Glass Skeleton Loader, Glass Loading Skeleton.
  - Search: Glass Search Field, Liquid Glass Search Field, Spotlight, Intelligent, Advanced, Facet, Search Interface.
  - Buttons: Glass, Enhanced, Magnetic, Liquid Style, Ripple.
  - Data grids/tables: Data Grid, Data Grid Pro, Data Table ×2, Virtual Table.
  - Video players: Glass Video Player, Glass Advanced Video Player.
- **Showcases.** Four separate "showcase" implementations: `showcase/LiquidGlassShowcase.tsx`, `showcase/LiquidGlassStateMatrix.stories.tsx`, `templates/showcase/ComprehensiveShowcase.stories.tsx`, `demo/EnhancementShowcase.tsx` (741 lines). A fifth, `advanced/StorybookVisualShowcase.tsx` (416 lines), isn't referenced anywhere.

## Fake complexity

- **Galleries that show no components.** All `Reference/Category Galleries/*` stories render text cards listing component names. `ButtonGallery.stories.tsx:4-9` has a `[name, description]` array rendered as `<h2>`/`<p>`, with no `GlassButton` import. `ComponentGallery.stories.tsx:4-41` lists paths such as `Curated/Start Here`, `Components/Layout/*`, `Primitives/LiquidGlass*`. None of those exist in the current sidebar, and they are plain `<code>` text.
- **"State Matrix" doesn't use the library.** `showcase/LiquidGlassStateMatrix.stories.tsx:1-2` imports only `CSSProperties` and Storybook types. Its "glass" is a hand-rolled `backdropFilter: blur(24px) saturate(1.35)` style object (`:102-117`). Its "Media Clear" tone is a CSS gradient, not media (`:89-99`). It is listed in the Start Here guide as a Liquid Glass reference (`CuratedComponentGuide.stories.tsx:120`).
- **The flagship showcase restyles its own components.** `showcase/LiquidGlassShowcase.tsx:33-140` injects a `<style>` block with 24 `!important` overrides. It forces `.liquid-glass-material` background, border and shadow (`:45-56`), slider thumbs (`:58-66`), and the badge-cluster `backdrop-filter` (`:68-71`). So the showcase doesn't show what a consumer gets from the package defaults. Its backdrop is a `#eeeeee → #fafafa` gradient (`:29-30`). Its only test asserts one text string (`LiquidGlassShowcase.test.tsx:5-8`).
- **Refraction demos with nothing to refract.** `primitives/LiquidGlassMaterial.stories.tsx:107-108` puts the IOR/thickness/"physically accurate refraction" stories (`:118-198`) on an 82%-white panel over a white surface. "HighIOR" (`ior: 1.8`) and "UltraClear" can't be told apart from Default, because there is no content behind the glass.
- **"Media" and "Liquid" preview modes contain no media.** `StorySurface.tsx:44-50` defines the `media` surface as `#ffffff → #f4f4f4 → #e9e9e9`. The `liquid` mode (`:24-27`) is the same gray ramp plus a white radial highlight (`:58-71`). `preview.tsx:127-129` defines a "media" background that is also a gray gradient. Because `StorySurface` paints its own background over the full canvas, the Storybook backgrounds addon has no visible effect.
- **Stories advertise features they don't turn on.** See GlassButton Predictive, EyeTracking and Consciousness above (`GlassButton.stories.tsx:286-331,454-536`).
- **Story-only props leak into shipped components.** `GlassCollaborativeCursor.tsx:14,66` adds `previewUsers`, and `CookieConsent.tsx:91-119` adds `forceVisible`. Both were added so certification screenshots render (`reports/component-screenshot-manual-qa/manual-qa-report.md`, Fixes Applied).

## Critical findings

| ID | Severity | Claim | Evidence |
|---|---|---|---|
| STORYBOOK-SHOWCASE-01 | critical | The visual certification can't fail on visual grounds. Every story trivially meets the pass criteria because the global decorator renders a `glass`-classed `<main>` (`ContrastGuard className="glass-contrast-guard"`) and SkipLinks. 15 components whose rendered text is only the skip links (ChartRenderer, GlassAvatar, GlassLoadingSkeleton, GlassSparkline, Typography, ClearIcon, GlassStepIcon, ContextAwareGlass, GlassChatInput, GlassColorWheel, GlassDrawingCanvas, GlassPresets, ThemedGlassComponents, GlassQuantumField, HeatGlass) are marked "passed". GlassNeuroSync's screenshot is blank (luminance range 233–255, no OCR text) and also passed. | `scripts/audit/storybook-visual-certification.mjs:171,296-310,351`; `.storybook/preview.tsx:185-197`; `reports/glassmorphism-storybook-visual-certification.json` entries |
| STORYBOOK-SHOWCASE-02 | critical | Every component is shown over a near-white monochrome surface, so glass, refraction and backdrop sampling are invisible. 351/356 certification screenshots have mean luminance >200, 330/356 have colorfulness <8, and 0 are dark. No story sets `previewSurface: 'media'` or `parameters.backgrounds`. 17/460 story files use any imagery. | `.storybook/StorySurface.tsx:13-56`; `.storybook/preview.tsx:116-136`; pixel analysis of `reports/glassmorphism-storybook-visual-certification/screenshots/*/desktop.png` |
| STORYBOOK-SHOWCASE-03 | high | Certification metadata misstates what was tested. Every entry claims `themesInspected: ["storybook-default-dark"]`, but the value is hard-coded and the actual default mode is light. Only 1 story per component is checked (`storyIds.length == 1` for all 356), yet the report says "all inventory components were visually inspected". | `scripts/audit/storybook-visual-certification.mjs:344`; `.storybook/preview.tsx:77,160`; `reports/glassmorphism-storybook-visual-certification.md:3` |
| STORYBOOK-SHOWCASE-04 | high | The flagship "Liquid Glass Showcase" overrides its own components' material with 24 `!important` rules, so it doesn't represent shipped defaults. | `src/components/showcase/LiquidGlassShowcase.tsx:33-140` (e.g. `:45-56`, `:68-71`) |
| STORYBOOK-SHOWCASE-05 | high | The "Liquid Glass State Matrix" showcase imports zero AuraGlass components. It is hand-rolled CSS presented as a library reference. | `src/components/showcase/LiquidGlassStateMatrix.stories.tsx:1-2,102-117`; referenced at `src/stories/CuratedComponentGuide.stories.tsx:120` |
| STORYBOOK-SHOWCASE-06 | high | 128 titles are generated Default/Variants stubs, and 132 files carry boilerplate descriptions. Some render empty or placeholder content: the GlassCarousel Default has no args and its content measures 1.7% of the frame. | `src/components/interactive/GlassCarousel.stories.tsx:13,31-48`; `src/components/data-display/GlassToast.stories.tsx:13` |
| STORYBOOK-SHOWCASE-07 | high | All `Reference/Category Galleries/*` stories render no components, only text cards. They are copy-pasted across 9 files and reference sidebar paths that don't exist. | `src/stories/ButtonGallery.stories.tsx:4-41`; `src/stories/ComponentGallery.stories.tsx:4-41,54` |
| STORYBOOK-SHOWCASE-08 | medium | Reduced motion is forced on for every story. The Liquid Glass motion system and the "Animation" stories (Fast/Slow Animation, Real Time Mode, …) are always previewed with instant durations unless the user changes accessibility settings. | `.storybook/preview.tsx:168-174`; `src/components/accessibility/AccessibilityProvider.tsx:164-172` |
| STORYBOOK-SHOWCASE-09 | medium | Stories claim features they don't enable (predictive, eye tracking, "consciousness"). | `src/components/button/GlassButton.stories.tsx:286-331,454-536` vs `GlassButton.tsx:264-288` |
| STORYBOOK-SHOWCASE-10 | medium | The 6 "3.2/App Shell" stories are aliases of one story, presented as distinct domain shells. | `src/stories/AppShell.stories.tsx:1-33` |
| STORYBOOK-SHOWCASE-11 | medium | The Start Here guide shows "links" as non-clickable `<code>`. 4 of 11 point to titles that don't exist (`Navigation/LiquidGlassToolbar`, `…InsetSidebar`, `…TabBar`, `Certification/Glass Missing Inventory Certification`). The stats are hard-coded and stale ("3.0 Release Scope"). | `src/stories/CuratedComponentGuide.stories.tsx:18-19,76-87,95-137,286-295` |
| STORYBOOK-SHOWCASE-12 | medium | The deploy workflow posts a PR preview URL that is never published: deploy only runs on `main`. It also grants `contents: write` on every PR build. | `.github/workflows/deploy-storybook.yml:9-12,34-52` |
| STORYBOOK-SHOWCASE-13 | medium | There is essentially no interaction testing in Storybook: 7 `play` functions across 1,598 stories, and no test-runner script. The Storybook test dependencies are a mix of deprecated and alpha packages. | `package.json:326-328,433-437`; `rg "^\s*play\s*:"` |
| STORYBOOK-SHOWCASE-14 | medium | Story budget is inverted. Effects + Advanced holds 27% of stories and Deep Dream alone has 27, while core navigation primitives (Tabs, Sidebar, Header, Breadcrumb, Context Menu, Toolbar, Segmented Control, Command Bar) have 2 each. There are no Storybook stories for states (hover, focus, pressed, disabled, error) on most controls. | `storybook-static/index.json`; `src/components/ai/GlassDeepDreamGlass.stories.tsx:250-760` |
| STORYBOOK-SHOWCASE-15 | low | Miscategorized and duplicated titles: the same component appears under two groups, there is a lowercase title, and Carousel and File Tree sit under "Effects + Advanced". | index titles; e.g. `src/components/interactive/GlassCarousel.stories.tsx:7` |
| STORYBOOK-SHOWCASE-16 | low | Story-only props (`previewUsers`, `forceVisible`) were added to shipped components so screenshots render. | `src/components/collaboration/GlassCollaborativeCursor.tsx:14,66`; `src/components/cookie-consent/CookieConsent.tsx:91-119` |

## Recommendations for AuraGlass 5.0

1. **Build a Material Lab as the first sidebar section.** Have one `MaterialStage` decorator with a backdrop toolbar: photo (bright), photo (dark), saturated gradient, dense text/UI, video, flat light, flat dark, high-contrast. Ship the backdrops as local assets so CI is deterministic. Put every material primitive (Material, Surface Layer, Concentric Frame, Scroll Edge, Effect Group) on a side-by-side grid across all backdrops. Show IOR, thickness and tint as before/after strips over text and photographic content. Delete the gray-gradient `media`/`liquid` modes (`StorySurface.tsx:24-27,44-50`).
2. **Build a Component Lab: one canonical page per component** with a fixed story contract:
   - Playground (args)
   - States grid: rest, hover, focus-visible, pressed, disabled, loading, error, selected
   - Sizes/density
   - The component over 4 backdrops
   - In context: an app fragment
   - RTL
   - Dark/high contrast

   Generate the states grid from a shared helper instead of hand-writing it. Remove all 128 Default/Variants stubs, then rebuild them using this contract or delete them.
3. **Use 3–5 premium application showcases as the hero.** Examples: Music/Media player over album art, Maps/Navigation over a map tile, Productivity/Inbox, AI chat/command center, Photos inspector. Build each strictly from package exports, with no `!important` overrides and no inline glass styles; add a lint rule that rejects `backdropFilter` and `!important` in `*.stories.tsx` outside the lab harness. Expand `AppChromeVisualBaseline` into the first of these, and give the 6 App Shell aliases real, distinct content or delete them.
4. **Replace the certification with a real visual gate.**
   - Run per-story pixel baselines (Chromatic or Playwright snapshots run remotely) across Lab backdrops × light/dark × desktop/mobile.
   - Fail a story if the decorator-excluded root has no meaningful text or ink. Concretely: measure inside `#storybook-root [data-story-content]`, not the decorator.
   - Report actual themes and states, not hard-coded labels.
   - Treat the current "356 passed" as void.
5. **Fix the story budget and curation.**
   - Tag stories `public` / `reference` / `internal` and build the public Storybook from `public` only.
   - Move speculative AI/quantum/"consciousness" components to a separate `Labs` Storybook or delete them.
   - Cap per-title stories unless they show distinct states.
   - Fix the taxonomy: no version-named groups (`3.2`, `3.3`), no duplicates across groups, and families merged into one canonical component each (Tabs, Search, Skeleton, Data Table).
6. **Make the Start Here page a real entry point.** Use clickable `linkTo` links validated against the index at build time, and derive all counts from the index or inventory. Render each Category Gallery with live thumbnails of the real components, or delete the galleries.
7. **Default motion to on.** Keep a motion toolbar (full / reduced) and run reduced-motion as its own snapshot axis.
8. **Clean up testing and CI.**
   - Move to `storybook/test` only and add `@storybook/addon-vitest` or the test-runner with `play` interaction tests for every overlay, menu, select, combobox, dialog and tabs.
   - Run the a11y addon in CI with `a11y.test: 'error'`.
   - Implement or drop the PR preview comment, and scope `contents: write` to the deploy job on `main`.
   - Stop treating the checked-in `storybook-static` as a source of truth.
9. **Strip story-only props from shipped components.** Use MSW, a mock provider or decorators instead of `previewUsers` and `forceVisible`. Remove the backend SDK externals from `main.ts` by cutting the import edges from UI components.
10. **Consolidate the showcases** (LiquidGlassShowcase, StateMatrix, ComprehensiveShowcase, EnhancementShowcase, the orphaned StorybookVisualShowcase, and `examples/*`) into the 3–5 application showcases above. Give each a snapshot and an interaction test.

## Verification (adversarial)

Independent re-check against source, `reports/glassmorphism-storybook-visual-certification.json` (356 entries), `storybook-static/index.json` (1,687 entries, 1,598 stories, 460 titles; built 2025-09-05, may lag `src`), and a PIL pixel pass over all 356 `desktop.png` files.

| id | verdict | note |
|---|---|---|
| STORYBOOK-SHOWCASE-01 | CONFIRMED | The pass checks are only `visibleElementCount>0`, root ≥10px, and `glassElementCount>0 \|\| canvas \|\| svg` (`scripts/audit/storybook-visual-certification.mjs:296-310`). The root `#storybook-root` contains the decorator's `glass-on-light` StorySurface (`.storybook/StorySurface.tsx:90`) and the `glass-contrast-guard` main (`.storybook/preview.tsx:185-197`), so the glass check always passes. There are exactly 15 entries whose `bodyTextSample` is only the skip-link text. Typography reports `visibleElementCount: 2`. The GlassNeuroSync screenshot has luminance stddev 6.4, the same as the empty Typography shot (6.6), even though its DOM reports 70 elements and 260 chars of text. Caveat: some of the 15 (Avatar, Sparkline, ColorWheel, DrawingCanvas, Skeleton) have legitimately no text, so the skip-link-only text alone doesn't prove they failed. The point that the checks can't fail still holds. |
| STORYBOOK-SHOWCASE-02 | CONFIRMED | Pixel pass: 351/356 have mean luminance >200 and 330/356 have colorfulness <8. The darkest shots are CursorGlow (94) and GlassDataTable (99), which are mid-tone, not dark scenes. 0 stories set `previewSurface: 'media'` and 0 set `backgrounds:`. Worse than reported: the "media" options are themselves near-white gradients (`StorySurface.tsx:44-49`, `preview.tsx:127-129`), so opting in would not help. The imagery count depends on the regex: 7 files with strict `<img>`/image-extension matches, 22 with a broad regex. 17 is within that range. |
| STORYBOOK-SHOWCASE-03 | CONFIRMED | `themesInspected: ["storybook-default-dark"]` is a literal (`:344`). All 356 entries have it. The run URL is `iframe.html?id=…&viewMode=story` with no `globals` (`:256`), so `previewMode` falls back to `'light'` (`preview.tsx:77,160`). Every entry has `storyIds.length === 1` (`:223,342`). |
| STORYBOOK-SHOWCASE-04 | CONFIRMED | `rg -c '!important'` returns 24 in `LiquidGlassShowcase.tsx`. `.liquid-glass-material` (a shipped class from `src/styles/glass.css`) has its background, border and shadow overridden at lines 45-56, and backdrop-filter is overridden at 68-71. |
| STORYBOOK-SHOWCASE-05 | CONFIRMED | The only imports are `CSSProperties` and the Storybook types (`LiquidGlassStateMatrix.stories.tsx:1-2`). `glassPanel()` is inline `backdropFilter` CSS. The `media` tone is a `linear-gradient` (lines 89-91, labelled "Media Clear" at :37). It is linked from the Start Here guide (`CuratedComponentGuide.stories.tsx:120`). |
| STORYBOOK-SHOWCASE-06 | CONFIRMED | Index: 128 titles whose story set is exactly {Default, Variants}. 130 story files match `A glass morphism .* component.` (vs 132 reported, an immaterial difference). GlassCarousel `Default` passes no items, and the certification text is "No items to display". Other blank or placeholder certification renders include GlassFormWizardSteps "Step NaN of 0", GlassFormTemplate "No form sections configured" and GlassListView "No items found". |
| STORYBOOK-SHOWCASE-07 | PARTIAL | Most Category Galleries are text-only (Button, Component and others import only React and Storybook). But `IconsGallery.stories.tsx:3,100` imports and renders real AuraGlass icons, so "All … render no components" is wrong for 1 of 13. The "412" hard-code is confirmed (`ComponentGallery.stories.tsx:54`), and stale against 460 titles / 1,598 stories. The paths `Curated/*` and `Components/Layout/*` don't exist in the index. |
| STORYBOOK-SHOWCASE-08 | PARTIAL | `reducedMotion: true` is hard-set in `initialSettings` (`preview.tsx:168-174`), and the provider only sets `--animation-duration`/`--animation-delay` CSS vars (`AccessibilityProvider.tsx:160-172`). But only 2 files consume `var(--animation-duration)` and 6 call `useAccessibility()`. The dominant `useReducedMotion` hook (`src/hooks/useReducedMotion.tsx:20-40`, imported by ~209 files) reads the OS media query and ignores the provider. So "motion stories always preview with instant durations" is overstated. The certification run, however, separately emulates `reducedMotion: "reduce"` (`certification.mjs:233`). |
| STORYBOOK-SHOWCASE-09 | CONFIRMED | No story in `GlassButton.stories.tsx` sets `predictive`, `eyeTracking`, `adaptive`, `spatialAudio` or `trackAchievements` (rg finds no occurrences). The only related prop is `biometricResponsive={false}` (:367,374). The component defaults them all to `false` (`GlassButton.tsx:264-275`), so "All consciousness features enabled" (:459) is false. |
| STORYBOOK-SHOWCASE-10 | CONFIRMED | All 6 exports are `FullSurface` or `{...FullSurface, name}` (`AppShell.stories.tsx:8-33`). |
| STORYBOOK-SHOWCASE-11 | PARTIAL | Links are `<code>` with no `linkTo`/`href` (`:286-298`). "3.0 Release Scope: Major" (`:83-85`), the 29/65 Liquid Glass counts (`:18-19`) and "1,600+" are hard-coded. However, I count 20 links (not 11). 16 resolve as exact titles or group prefixes, and 4 are broken: `Navigation/LiquidGlassToolbar`, `…InsetSidebar`, `…TabBar` (the real titles have spaces) and `Certification/Glass Missing Inventory Certification`. The headline component count is derived from the inventory (`:15-16`), not hard-coded. |
| STORYBOOK-SHOWCASE-12 | CONFIRMED | Workflow-level `contents/issues/pull-requests: write` (`deploy-storybook.yml:9-12`) applies to `pull_request` runs. Deploy is gated `if: github.ref == 'refs/heads/main'` (:35), yet PRs get a comment pointing to `…github.io/<repo>/pull/<n>/` (:42-52), which is never published. That URL also ignores the configured `cname` (:40). |
| STORYBOOK-SHOWCASE-13 | CONFIRMED | There are exactly 7 `play:` functions in `src/**/*.stories.*`. No `@storybook/test-runner` or `addon-vitest` is configured. `package.json:433-437` mixes `@storybook/jest ^0.2.3`, `@storybook/testing-library ^0.2.2` and `@storybook/test 9.0.0-alpha.2` with SB 9.1.20. `test:visual` is a custom script, not Storybook interaction testing. |
| STORYBOOK-SHOWCASE-14 | PARTIAL | The figures for Deep Dream (27 stories) and for Tabs, Sidebar, Header, Breadcrumb, Context Menu and Toolbar (2 each) are confirmed. The 27% figure mixes denominators: 436 Effects + Advanced entries includes docs entries, but it is divided by 1,598 stories. The actual share is 390/1,598 = 24.4% of stories, or 436/1,687 = 25.8% of entries. It is still the largest group. Enhanced Glass Tabs has 4. |
| STORYBOOK-SHOWCASE-15 | CONFIRMED | Normalized leaf names show 6 cross-group duplicates: File Upload, Stepper, Glass Card Link, Data Table, Toast and Collaborative Cursor. There are 5 lowercase titles (e.g. `Surfaces/Cards + Panels/div`, `…/glass card link`). The `3.2`, `3.3` and `Marketing` top-level groups are all missing from `storySort` (`preview.tsx:139-153`). |
| STORYBOOK-SHOWCASE-16 | PARTIAL | `previewUsers` (`GlassCollaborativeCursor.tsx:14,66`) and `forceVisible` (`CookieConsent.tsx:91-108`) exist, both added in commit 7f6688d09 ("Release AuraGlass 3.0.2"). The claim that they were added *for certification* is inferred, not evidenced. `forceVisible` is threaded through `types.ts`, `GlobalCookieConsent` and `CompactCookieNotice` as public API, and a controlled-visibility prop is a defensible pattern. The real problem is that `previewUsers` bypasses the collaboration context. |
