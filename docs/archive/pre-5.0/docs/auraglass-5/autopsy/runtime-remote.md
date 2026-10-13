# Runtime (remote browser) autopsy — AuraGlass 4.1.0 @ 15b6de6f7

Fresh evidence from headless Chromium 141.0.7390.37 (`chrome-headless-shell`, software raster, no GPU) on ephemeral
gated EC2 workers (launch template `lt-001ac3e8c702c66d7`, r7i.8xlarge, no ingress, no public IP, no egress; data via
S3 gateway endpoint). Input: the prebuilt `storybook-static/` at HEAD `15b6de6f74e66bcaa4e09f6bc2c8e0b5bdaeae07`.
Nothing ran in a local browser.

## Bottom line

AuraGlass glass is not background-adaptive. Its surfaces are close to fully transparent, and the ink colour comes from
a declared ancestor tone class rather than from what is actually behind the glass. Every Storybook story paints its own
opaque light stage, and that stage hides the problem.

- When the story stage is removed and the glass sits on black, 266 of 342 sampled text runs fail WCAG contrast. The median ratio is 1.92:1.
- On white the same set has 2/342 failures; on the stock stages, 17/342.
- In 0 of 84 story×viewport pairs did a glass surface's computed tint change between white, black and busy backgrounds.

Three more problems:
- The two flagship "3.2 App Shell" stories fail contrast even on their own default stage: ink is rgba(0,0,0,.9) on a dark navy surface (1.1–2.1:1).
- `prefers-contrast: more` changes nothing: 0.0% pixel difference on all 12 tested stories.
- Modal, dialog and app-shell stories run 4 infinite animations under 12–29 backdrop-filters. They drop to 12–23 fps under scripted hover and scroll, while simple stories hold 60 fps.

## Runs

| run | attempt-id | instance | result |
|---|---|---|---|
| 1 | `auraglass5-autopsy-15b6de6f74e6-20261007T005345Z` | i-0213de9c189277c79 | Aborted. The runner's egress-proxy CA expired (`notAfter=Sep 27 17:34:57 2026 GMT`), so the run was redone with no egress. Terminated. |
| 2 | `auraglass5-autopsy-15b6de6f74e6-20261007T005723Z` | i-01e2b5030a3d4a3df | 372 captures in 296 s, exit 0. Terminated itself. |
| 3 | `auraglass5-autopsy-15b6de6f74e6-20261007T010739Z-bg` | i-0addd0544243417b8 | 252 background captures with the story stage removed, exit 0. Terminated itself. |

Coverage:
- 42 stories: core and liquid primitives, buttons, card, input/textarea/checkbox/switch/select/combobox, modal/dialog/liquid modal/drawer/bottom-sheet/tooltip/popover, navigation/sidebar/tabs/tab-bar, data table/grid, bar and line chart, chat and chat input, app shell plus the two 3.2 shells, collaborative workspace, dashboard, and the liquid-glass showcase and state matrix.
- Viewports: 1440×900 and 390×844.
- Backgrounds: default, white, black, and busy (a conic plus stripe gradient).
- On 12 stories (desktop): `reducedMotion: reduce`, `contrast: more` and `forcedColors: active`.

Captured per run:
- screenshots, plus a text-hidden twin of each, used to sample what is behind the text;
- console and page errors;
- backdrop-filter element counts, nesting depth and maximum blur;
- running and infinite animations;
- PerformanceObserver long tasks, FCP and LCP;
- rAF FPS over 2 s of scripted hover and wheel input;
- JS heap.

Evidence (`docs/auraglass-5/autopsy/remote-evidence/`):
- `metrics.json`: merged run 2 default/modes plus run 3 backgrounds; 372 records.
- `analysis.json`: per-capture contrast samples, adaptation, perf.
- `pixel-diff.json`: share of pixels changed across backgrounds and modes, for the whole page and inside the largest glass surface.
- `screenshots/`: PNG for default and modes, JPEG q88 for backgrounds. Names follow `<story>__<viewport>__<bg>__<mode>`.
- `pass-main/` and `pass-forced-background/`: the raw worker outputs and logs for runs 2 and 3.

## Findings

### 1. Background adaptation: none (critical)

Run 2 forced the background on `html, body, #storybook-root`. It changed 0–4.9% of page pixels and 0.000 of the pixels
inside the largest glass surface, for every story (`pixel-diff.json`). The cause is `.storybook/StorySurface.tsx:88-96`:
it wraps every story in an opaque `glass-on-light` stage with a white to #f4f4f4 gradient. The default screenshots
therefore never show the glass over arbitrary content.

Run 3 removed backgrounds from non-glass elements covering at least 35% of the viewport. The stage element keeps its
`glass-on-light` class; only its paint is removed, which models a light-themed app placed over a dark hero or photo.

- The glass is almost perfectly transparent. Mean pixel inside the top glass surface: white 255, black 19–26, busy follows the gradient. The white/black luminance delta has median 0.881 and max 0.993, measured across the 84 story×viewport pairs. The typical computed fill is `rgba(255,255,255,0.02)` plus a 0.106→0.02 white gradient, for example `GlassCard` (`optimized-glass-surface glass-neutral-level2`) and `LiquidGlassMaterial`. Only the showcase uses 0.24.
- Tint never adapts: `tintAdapts` is false for all 84 pairs.
- Ink never adapts. Text stays `rgba(0,0,0,.9)` because `.glass-on-light .glass` pins `--glass-text-primary` to black-90 (`src/styles/glass.css:78-100`). `src/styles/premium-typography.css:113-118` also forces `[class*="glass-"] { color: var(--glass-text-primary) !important }`.
- Contrast results with the stage removed (`analysis.json` → `contrastRows`):

  | background | failing / sampled | median ratio |
  |---|---|---|
  | white | 2 / 342 | 16.97 |
  | black | 266 / 342 | 1.92 |
  | busy | 20 / 342 | 9.68 |

  Every one of the 42 stories fails on black. On busy, the failures are in the modal, dialog, drawer, chat and app-shell stories.

There is no backdrop luminance sampling and no vibrancy or ink-flip layer: "adaptation" is a CSS class the consumer must
set correctly. A first-party material (Apple Liquid Glass, Windows Mica/Acrylic) guarantees legibility over any content
through a tint floor and vibrancy. This library does not.

### 2. Shipped 3.2 App Shell stories fail contrast on their own stage (high)

On the default stage, at desktop and mobile, `3-2-app-shell--saa-s-app-shell` and `--ai-command-center-shell` fail on
4–5 of 5 sampled text runs. Examples:
- "Native app chrome" h1: ink rgba(0,0,0,.9) on rgb(13,31,43), 1.23:1.
- "Search": 2.14:1.
- "Project" (mobile): 1.12:1.

The brand label is light (rgb 248,250,252), but the content ink is dark on a dark surface, so the shell mixes light and
dark tones. The prior certification run did not catch this.

### 3. `prefers-contrast` support is dead code (high)

All 16 media queries in `src` use the invalid value `prefers-contrast: high`; there are 0 uses of `more`. Valid values
are `more`, `less`, `custom` and `no-preference`, and Chromium does not match `high`. Examples:
`src/styles/glass.css:4055`, `src/styles/animations.css:550`, `src/styles/premium-typography.css:237`,
`src/components/accessibility/GlassFocusIndicators.css:55`, `src/hooks/useAccessibilitySettings.ts:173`,
`src/utils/a11y.ts:301,973`, `src/core/productionCore.ts:230,393`. The same invalid value appears in the
`storybook-static` bundles.

`src/styles/theme-transitions.css:52-53` nests `forced-colors: active;` as a declaration, which is not valid CSS.

Runtime confirmation: with `contrast: more`, pixel diff against the baseline is 0.000 on 12/12 stories, and the
contrast failure count is unchanged (4/46, the app-shell samples).

### 4. Forced colors: partial (medium)

`src/styles/glass.css:4073` correctly removes backdrop-filter and swaps to Canvas/CanvasText on listed classes. Visible
backdrop filters drop to 0 on core, button, card, input, select and navigation, with 0/46 contrast failures. Coverage
is still incomplete:

| story | visible backdrop-filters, normal → forced-colors |
|---|---|
| glass-modal | 12 → 10 |
| 3.2 app shell | 21 → 3 |
| liquid-glass showcase | 12 → 12 |
| liquid-glass material | 1 → 1 |

`liquid-glass-material` is not in the forced-colors selector list.

### 5. Motion and performance (medium)

- Reduced motion works where measured: infinite animations go from 4 to 0 on modal and app-shell.
- FPS (rAF during hover and scroll): median 60, but there is a severe cluster:

  | story | fps | visible backdrop-filters | infinite animations | nesting / max blur |
  |---|---|---|---|---|
  | glass-modal | 12 (desktop and mobile) | 12 | 4 | — |
  | glass-dialog | 13–14 | — | — | — |
  | 3.2 AI command center shell | 19 | 21 | 4 | depth 4, 40 px |
  | 3.2 SaaS shell | 21–23 | — | — | — |

  These are software-raster numbers, so absolute values are pessimistic. The 5× gap to simple stories is the signal: stacked full-viewport `glass-backdrop-blur-md` overlays at 1440×1008 plus nested 40 px blurs plus infinite animations.
- Long tasks: median total 222 ms per page. The outlier is glass-modal desktop: 49 long tasks totalling 4,056 ms, max 151 ms.
- Every page has about 2 long tasks of 116–151 ms. This looks like the Storybook bundle boot cost rather than the components.
- FCP/LCP: 244–604 ms. Heap: 16–30 MB.
- Backdrop-filter density:
  - median 3 visible filters per story;
  - state matrix: 51 visible on desktop (54 total);
  - app shells: 21–29;
  - collaborative workspace: 18;
  - maximum nesting depth 4, max blur 40 px.

  This is well beyond the 1–3 live blur layers a premium system budgets for.

### 6. Hygiene (pass)

- 0 console errors and 0 page errors across 624 page loads.
- 0 empty roots, 0 navigation failures.
- 0 horizontal overflow at 390 px.

## What would move this to "first-party"

1. Add a material-level legibility contract: a tint floor that scales with sampled or declared backdrop luminance, and vibrancy or ink auto-flip. Ship it with a CI gate that renders every surface over white, black and a photo **without** the Storybook stage. Run 3's method is a ready-made harness for this.
2. Replace `prefers-contrast: high` with `more`, and test it.
3. Add `liquid-glass-material`, modal overlays and app-shell layers to the forced-colors selectors.
4. Budget live backdrop-filters to 3 or fewer per viewport. Collapse full-screen overlay blur to a single layer, and stop infinite animations when nothing is interacting.
5. Fix the 3.2 App Shell ink/tone mismatch.

## Operational notes

- Remote resources: all three workers are terminated. Inputs and outputs remain under `human-ei/sources/15b6de6f…/<attempt>` and `human-ei/evidence/<attempt>` in the bucket `auraone-human-ei-test-605199373751-us-west-2`, which is the designated runner data path. They were not deleted; the runner policy uses Object Lock.
- Unrelated leak, not touched: `i-0804c4ff59713abd6`, `Name=prism-budget-build` with attempt-id `prism-budget-1cb20f1`, an r7i.8xlarge that has been running since 2026-09-12. It is not registered with SSM.
- Runner infrastructure defects:
  - The egress-proxy CA expired on 2026-09-27, so any runner job that needs package egress will fail.
  - The runner VPC has no SSM interface endpoints and no NAT (agent log: `dial tcp …:443 i/o timeout` to `ssm.us-west-2.amazonaws.com`), so Session Manager cannot reach workers. Only user-data plus S3 works.
- Method limits:
  - Contrast sampling covers up to 5 text runs per capture.
  - The colour behind the text is the median of a text-hidden screenshot inside the text box.
  - Stage removal (run 3) is a heuristic and kept the `glass-on-light` tone class.
  - FPS is rAF cadence under software raster, not compositor frame timing.
