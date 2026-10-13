# AuraGlass 5.0: Competitive Landscape (React UI and glass libraries)

Accessed 2026-10-06 (all URLs below). Evidence types:

- **[V]** I verified it directly from a primary source: an official doc or changelog, the GitHub REST API, or the npm downloads API.
- **[S]** It comes from a secondary source (an aggregator or blog) and I have not confirmed it.
- **[I]** It is my own inference.

GitHub stars came from `api.github.com/repos/{owner}/{repo}` on 2026-10-06. npm downloads came from `api.npmjs.org/downloads/point/last-week/{pkg}` for the week 2026-09-28 to 2026-10-04.

## 1. Executive summary

1. **The headless layer has consolidated.** Three primitive foundations now matter: Base UI, Radix, and React Aria. shadcn/ui made Base UI the default in July 2026, and React Aria became its third selectable base the same month.
   - Base UI default: https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default [V]
   - React Aria base: https://ui.shadcn.com/docs/changelog/2026-07-react-aria [V]
   - `@base-ui/react` had 19.27M downloads/week, ahead of the `radix-ui` umbrella package at 19.06M. Individual `@radix-ui/react-dialog` is still larger at 91.9M because so many libraries depend on it. [V]
   - A new library that hand-rolls its own focus, dismissal and typeahead logic is now off-consensus. [I]
2. **Distribution has moved to registries, and shadcn sets the standard.** The shadcn CLI v4 can ship an entire design system in one payload (`registry:base`: components, deps, CSS vars, fonts, config). It also supports presets, `apply`, `eject`, public and private GitHub registries, a registry directory, an MCP server, and agent "skills".
   - https://ui.shadcn.com/docs/changelog/2026-03-cli-v4 [V]
   - https://ui.shadcn.com/docs/changelog [V]
   - Motion UI (July 2026) is paid and installs through the shadcn CLI using shadcn tokens. That makes the shadcn token vocabulary a de facto interchange format. https://motion.dev/magazine/introducing-motion-ui [V]
3. **AI product surfaces are now table stakes.**
   - shadcn shipped chat components in June 2026: MessageScroller, Message, Bubble, Attachment, Marker, plus `@shadcn/react` headless scroll logic. https://ui.shadcn.com/docs/changelog/2026-06-chat-components [V]
   - shadcn also shipped Questionnaire (Aug 2026, agent clarification flows) and `@shadcn/helpers` human-in-the-loop mocks for the AI SDK. https://ui.shadcn.com/docs/changelog [V]
   - Vercel AI Elements has 2,476 stars and prompt-kit has 3,110. [V]
   - MUI has `@mui/x-chat` in alpha and a Data Grid AI Assistant. https://mui.com/blog/introducing-mui-v9 [V]
4. **No serious library offers liquid glass.** None of the mainstream libraries ships a refractive "Liquid Glass" material. The glass-specific field is made of single-effect components or small hobby kits.
   - liquid-glass-react (rdev) leads with 6,340 stars and 45,152 downloads/week. Its last push was 2025-06-13, it is a single wrapper component, and Safari/Firefox do not show displacement (per its README). https://github.com/rdev/liquid-glass-react [V]
   - Most glass "kits" sit under 200 stars or under 600 downloads/week. [V]
   - **The closest direct threat is `leefanv/liqui-design`** (161 stars, pushed 2026-10-03). It ships 21 Base UI components as copy-in source through the shadcn CLI, with a shared `@liqui-design/glass` npm kernel (canvas displacement map plus SVG `backdrop-filter`) and an automatic blur fallback in Safari and Firefox. Its README says nothing about `prefers-reduced-transparency` or contrast handling. That is the same architecture recommended for AuraGlass below, so the window is narrowing. https://github.com/leefanv/liqui-design [V]
   - `swiftuijs/ui` (103 stars, pushed 2026-10-06) is an npm package with optional glass materials, per-component glass overrides, opaque a11y fallbacks and packed-consumer CI. https://github.com/swiftuijs/ui [V]
   - shadcn's own Luma style is "Inspired by macOS Tahoe, minus the glass": the market leader chose not to build glass. https://ui.shadcn.com/docs/changelog/2026-03-luma [V]
   - **The category is still open for an accessible, broad (beyond about 20 primitives), production-grade liquid-glass system with product surfaces.** [I]
5. **AuraGlass's own position (`aura-glass` 4.1.0): 156 downloads/week.** [V] It has a much smaller install base than every mainstream competitor. Its peer dependencies include `openai`, `@google-cloud/vision`, `@sentry/react`, `@react-three/fiber`, `react-chartjs-2` and `framer-motion`, read from the local `package.json`. [V] **A peer surface that heavy runs against the 2026 norm** of tree-shaken headless primitives plus copy-in styling. [I]

## 2. Ecosystem metrics snapshot (2026-10-06)

| Project | GitHub repo | Stars [V] | Primary npm pkg | Weekly downloads [V] |
|---|---|---|---|---|
| shadcn/ui | shadcn-ui/ui | 125,202 | `shadcn` (CLI) | 13,356,686 |
| Radix Primitives | radix-ui/primitives | 19,364 | `radix-ui` / `@radix-ui/react-dialog` | 19,064,097 / 91,859,169 |
| Radix Themes | radix-ui/themes | 8,747 (last push 2026-04-11) | `@radix-ui/themes` | 1,156,016 |
| Base UI | mui/base-ui | 11,077 | `@base-ui/react` | 19,271,066 (+575,284 legacy `@base-ui-components/react`) |
| Material UI | mui/material-ui | 99,137 | `@mui/material` | 12,503,562 |
| React Aria / Spectrum | adobe/react-spectrum | 15,918 | `react-aria-components` / `@react-spectrum/s2` | 5,869,802 / 38,721 |
| HeroUI | heroui-inc/heroui | 30,877 | `@heroui/react` | 770,905 |
| Mantine | mantinedev/mantine | 31,800 | `@mantine/core` | 3,305,015 |
| Chakra UI | chakra-ui/chakra-ui | 40,677 | `@chakra-ui/react` | 2,006,693 |
| Ark UI | chakra-ui/ark | 5,409 | `@ark-ui/react` | 1,229,584 |
| Park UI | chakra-ui/park-ui | 2,369 (last push 2026-04-10) | copy-in | n/a |
| Magic UI | magicuidesign/magicui | 22,478 | copy-in (registry) | n/a |
| Aceternity UI | no public main repo found | ~28k [S, pkgpulse; not verifiable] | copy-in | n/a |
| coss ui (ex-Origin UI) | cosscom/coss | 10,653 | copy-in | n/a |
| Tremor | tremorlabs/tremor (Raw) / tremor-npm | 3,648 (last push 2025-10-10) / 16,484 (last push 2025-01-13) | `@tremor/react` | 670,072 |
| Motion | motiondivision/motion | 33,849 | `motion` / `framer-motion` | 28,260,335 / 58,492,608 |
| Vercel AI Elements | vercel/ai-elements | 2,476 | copy-in | n/a |
| liquid-glass-react | rdev/liquid-glass-react | 6,340 (last push 2025-06-13) | `liquid-glass-react` | 45,152 |
| shuding/liquid-glass | shuding/liquid-glass | 1,194 | demo | n/a |
| archisvaze/liquid-glass | archisvaze/liquid-glass | 791 | demo | n/a |
| liqui-design | leefanv/liqui-design | 161 (pushed 2026-10-03) | shadcn registry + `@liqui-design/glass` | not measured |
| vaso | huozhi/vaso | 368 (pushed 2026-10-06) | `vaso` | not measured |
| ybouane/liquidglass (WebGL) | ybouane/liquidglass | 534 (pushed 2026-09-30) | lib | not measured |
| liquid-glass-studio (WebGL2/WebGPU) | iyinchao/liquid-glass-studio | 737 [V topic page] | demo | n/a |
| swiftuijs/ui | swiftuijs/ui | 103 [V topic page] | `@swiftuijs/ui` | not measured |
| einui | einui/einui | 153 [V topic page] | shadcn registry (Radix) | n/a |
| @crenspire/glass-ui | crenspire/glass-ui | 90 | shadcn registry (not on npm) | n/a |
| glasscn-ui | itsjavi/glasscn-ui | 99 (**archived**) | `glasscn-ui` | 59 |
| @developer-hub/liquid-glass | viraj-perera-dev/liquid-glass | 19 | `@developer-hub/liquid-glass` | 530 |
| shadcn-glass-ui | (repo not found via API) | n/a | `@yhooi2/shadcn-glass-ui` | 38 |
| **AuraGlass** | (this repo) | n/a | `aura-glass` | **156** |

Bundle note: Bundlephobia reports whole-package sizes, which mislead for tree-shaken libraries: `@base-ui/react` 1.8.0 is 146.9 kB gzip for everything, and `motion` 14.0.0 is 47.6 kB gzip. Motion's own docs put layout animations at about 12 kB. https://motion.dev/docs/react-layout-animations [V] Per-component sizes for the other libraries were not measured (the Bundlephobia API timed out). **Not verified.**

## 3. Profiles

### shadcn/ui
- **Positioning:** a design system you own, distributed as source through a CLI and registry. It is the reference point for the entire Tailwind ecosystem. 125k stars [V].
- **Primitives:**
  - The user picks the base: Base UI (default since July 2026), Radix (fully supported, not deprecated), or React Aria (`shadcn init --base aria`, July 2026) [V].
  - Every new component ships for every base "unless a component only exists in Base UI" [V].
- **Styles/theming:**
  - Eight named styles: Vega, Nova, Maia, Lyra, Mira, Luma, Rhea, Sera [V, React Aria changelog]. Luma is explicitly "Inspired by macOS Tahoe, minus the glass" ("Rounded geometry. Soft elevation. Breathable layouts."). https://ui.shadcn.com/docs/changelog/2026-03-luma [V] **I did not inspect Sera or Rhea.**
  - Theming uses CSS variables in Tailwind v4 `@theme`, plus `shadcn preset` / `apply` / partial preset apply [V titles].
  - RTL and logical (inline-start/end) styles shipped in Jan 2026 [V titles].
- **Distribution:**
  - CLI v4 with `registry:base` for whole design systems and fonts as a first-class registry type [V].
  - Public GitHub registries (June 2026), private ones via `gh` credentials (Aug 2026), dynamic server-side registry search (July 2026), and a registry directory and health checks [V].
  - Package imports and target aliases (May 2026). `cn` now comes from a standalone package with a `migrate cn` codemod (Sep 2026) [V].
- **AI/product surfaces:** chat components (June 2026), Questionnaire (Aug 2026), `@shadcn/helpers` AI-SDK HITL mocks, Toast (July 2026), charts, data table, MCP server, shadcn/skills for coding agents, and "Open in v0" [V].
- **Ecosystem:** a very large third-party registry economy. For example, Shadcnblocks supports Base UI builds, React Aria (beta), Vue, DESIGN.md theme guidelines and "Copy Prompt". https://www.shadcnblocks.com/changelog [V]
- **Strength:** network effects, ownership model and agent tooling. **Weakness:** no material system, so depth, translucency and motion are left to the user. [I]

### Radix Primitives / Radix Themes (WorkOS)
- Primitives still have very large transitive usage (91.9M/week for `react-dialog`) [V]. The repo is active: last push 2026-10-06, versions labelled 1.2.0-beta.4x on the site [V].
- Radix Themes (45 components and a token system, per the 2023 launch video) has slowed: last push 2026-04-11 [V]. It is still a styled package import with an accent-color system.
- **Implication:** Radix is now the legacy-compatible base. Supporting it is optional if AuraGlass targets Base UI and React Aria. [I]

### Base UI (MUI)
- v1.0 stable shipped in February 2026 with 35 accessible components. The npm package was renamed to `@base-ui/react`. https://www.infoq.com/news/2026/02/baseui-v1-accessible [V-secondary; the rename is confirmed by npm data]
- v1.7.0 shipped 2026-08-04 with per-component bundle-size reductions. https://base-ui.com/react/overview/releases/v1-7-0 [V]. npm `latest` is 1.8.0 (from Bundlephobia).
- It comes from the creators of Radix, Floating UI and MUI. It offers `render`-prop composition, Combobox/Autocomplete, Toast, Meter, NumberField and Toolbar [V releases page]. It ships `llms.txt` and markdown docs for AI [V].
- MUI's 2026 plan names Base UI a "major area of focus". Joy UI, Pigment CSS and Toolpad are on hold or in limited maintenance. https://mui.com/blog/2026-and-beyond [V]

### React Aria / React Spectrum (Adobe)
- 50+ unstyled components with the deepest interaction model available: press/long-press, drag-off-to-cancel, touch, virtualization, drag and drop, and i18n for 30+ languages including RTL. https://react-aria.adobe.com, https://github.com/adobe/react-spectrum [V]
- Spectrum 2 (`@react-spectrum/s2`) is stable as of RAC 1.14. Both `@react-aria/mcp` and `@react-spectrum/mcp` exist at 1.0.0. https://react-aria.adobe.com/releases/v1-14-0 [V]
- It is the a11y foundation for HeroUI v3 and is now a shadcn base [V].
- **Strength:** best-in-class accessibility and adaptive input. **Weakness:** verbose APIs and little visual material. [I]

### HeroUI v3 (ex-NextUI)
- v3 shipped in March 2026: a ground-up rewrite with 75+ web components and 37 React Native components. https://heroui.com/en/docs/react/releases/v3-0-0 [V]
- Built on React Aria Components plus Tailwind v4. Theming is CSS-first with OKLCH tokens. Styles live in a standalone `@heroui/styles` package. It has compound components, `data-reduce-motion`, all animations moved to CSS, and no Provider required. [V]
- Latest is v3.2.6. React Aria was upgraded to 1.20.0 and a behavioral test suite was added in 3.2.4 (Aug 2026). https://heroui.com/en/docs/react/releases [V]
- AI tooling: MCP servers, agent skills and llms.txt. HeroUI Pro is a paid product with components, templates and AI tooling. [V]
- Its positioning ("A living library, not copy-paste") explicitly rejects the shadcn model. https://heroui.com/en/docs/react/getting-started [V]
- **This is the closest "polished defaults + a11y + package" analogue to AuraGlass.** [I]

### Mantine 9
- 9.0 shipped on 2026-03-31, with monthly minors since (9.6.0 on 2026-09-01). https://mantine.dev/changelog/all-releases [V]
- Ships `@mantine/mcp-server` and `@mantine/schedule` (calendar views). https://mantine.dev/changelog/9-0-0 [V]
- Migration to oxc in 9.5 [V].
- It still has no official data table: the maintainer plans one "later in 9.x or 10.0". https://github.com/orgs/mantinedev/discussions/8678 [V]
- **Strength:** breadth (100+ components and hooks [S]) and its own a11y implementation. **Weakness:** no shadcn/Tailwind-native story. [I]

### Chakra UI v3 / Ark UI / Park UI
- Chakra v3 is built on Ark UI (headless, Zag.js state machines, framework-agnostic) plus Emotion-based recipes. Park UI is Ark plus Panda CSS. Chakra uses a snippet CLI (`@chakra-ui/cli snippets add`), a hybrid copy-in model. https://chakra-ui.com/blog/announcing-v3, https://github.com/chakra-ui/chakra-ui/discussions/10517 [V]
- Park UI's last push was 2026-04-10 [V], so momentum is weak. [I]

### MUI (Material UI v9)
- v9 (April 2026) jumped from v7 straight to v9 to align with MUI X. It still uses Emotion. Themes use CSS variables and `color-mix()`. New NumberField and Menubar (some built on Base UI). `@mui/x-chat` and Scheduler are in alpha, plus a Data Grid AI Assistant. Commercial licensing moved to per-application. https://mui.com/blog/introducing-mui-v9 [V]
- **Liquid glass:** I found no MUI liquid-glass or translucency work in the v9 post or blog index. https://mui.com/blog [V-absence; I can't rule out community themes]

### coss ui (ex-Origin UI, Cal.com)
- Copy-in components built on Base UI "from the ground up". It has three layers: Primitives, Particles (patterns) and Atoms (API-connected). It ships llms.txt. Origin UI's 600+ Radix components remain as a legacy snapshot. https://coss.com/ui/docs, https://coss.com/ui/docs/roadmap [V]
- Repo cosscom/coss has 10,653 stars [V].
- **The primitives → particles → atoms layering is a useful model for AuraGlass product surfaces.** [I]

### Tremor (Vercel)
- Acquired by Vercel in January 2025. All blocks are MIT-licensed (35 components and 300 blocks for dashboards), built on React, Tailwind and Radix. https://vercel.com/blog/vercel-acquires-tremor [V]
- Repos have gone quiet (last pushes 2025-10 and 2025-01), but `@tremor/react` still gets 670k downloads/week [V]. **The dashboard/charts niche is under-served by an active, design-forward library.** [I]

### Aceternity UI / Magic UI
- Both are copy-in effects and animation catalogs on Tailwind and Motion, aimed at marketing and landing pages. Magic UI has 22,478 stars [V]. Aceternity is about 28k [S]. I found no public main repo, so **I could not verify Aceternity's star count.**
- Aceternity sells templates and a Pro tier (site footer "Aceternity Labs LLC") [V site]. https://ui.aceternity.com
- **Accessibility is not their focus.** [S, pkgpulse; I]

### Motion (ex-Framer Motion)
- The animation substrate for most of this field: `motion` gets 28.3M/week and `framer-motion` 58.5M/week [V]. v14 is current (Bundlephobia).
- 2026 launches [V]:
  - Motion UI (July): paid via Motion+, installed with the shadcn CLI on shadcn tokens. Every section is graded S–F by "MotionScore" for render-pipeline cost, and nothing below C ships. A shared `motion.theme.ts` defines five named transitions (snap, ui, gentle, lively, ambient). `reducedMotion: "calm"` keeps opacity fades but drops transforms.
  - Motion Studio (Sep 2026): a visual and agentic animation editor.
  - Sources: https://motion.dev/magazine/introducing-motion-ui, https://motion.dev/magazine
- **Implication: Motion has set a public bar for animation-performance grading and motion tokens.** AuraGlass should meet or exceed it, and should not depend on `framer-motion` as an open-range peer. [I]

### Glass-specific libraries

| Library | Approach | Breadth | a11y | Status |
|---|---|---|---|---|
| liquid-glass-react (rdev) | SVG displacement and chromatic aberration; modes standard/polar/prominent/shader; elasticity; mouse tracking | 1 wrapper component | none claimed | 6.3k stars, 45k downloads/week, no push since 2025-06; no displacement in Safari/Firefox [V] https://github.com/rdev/liquid-glass-react |
| @developer-hub/liquid-glass | SVG blob/displacement wrapper | 1 component | none claimed | 530 downloads/week, 19 stars [V] https://www.npmjs.com/package/@developer-hub/liquid-glass |
| @crenspire/glass-ui | shadcn registry, Radix-based, backdrop-blur variants plus glow/shimmer/ripple | 40+ | Radix | 90 stars; submitted to the shadcn registry directory [V] https://github.com/shadcn-ui/ui/issues/8788 |
| glasscn-ui | shadcn fork adding `variant="glass"` and a `blur` prop | ~shadcn set | Radix | **archived**, 99 stars [V] https://github.com/itsjavi/glasscn-ui |
| @yhooi2/shadcn-glass-ui | npm package; 3 themes (Glass/Light/Aurora); claims WCAG 2.1 AA and 44px targets | 48 | claims AA | 38 downloads/week [V] https://npmjs.com/package/@yhooi2/shadcn-glass-ui |
| liqui-design (leefanv) | Canvas-generated displacement map + SVG filter via `backdrop-filter`; shared document-wide filter registry; automatic frosted fallback in Safari (WebKit bug 245510) and Firefox; 12 `--lq-*` color vars + `LiquiThemeProvider` optics (frost, specular, dispersion) | 21 Base UI primitives + Media Player template | inherits Base UI; README warns `frost: 0` "can end up unreadable"; no reduced-transparency or contrast handling mentioned | 161 stars, active; shadcn registry, React 18/19, Tailwind v4, MIT [V] https://github.com/leefanv/liqui-design |
| @swiftuijs/ui | SwiftUI-inspired; optional "Liquid Glass-inspired" materials via `UIProvider` with intensity, per-component overrides and "opaque accessibility fallbacks" | not stated | native form controls; Chromium acceptance tests at 320–1440px for focus and a11y; cross-browser visual acceptance "remains a release requirement" | 103 stars; npm with per-component subpaths, SSR/client boundaries, packed-consumer CI [V] https://github.com/swiftuijs/ui |
| einui | frosted glass (technique not documented) on Tailwind v4 + Radix | not stated | claims "accessible" via Radix | 153 stars, v0.1.0, shadcn registry; license inconsistent (ISC badge vs MIT) [V] https://github.com/einui/einui |
| vaso (huozhi) | liquid glass effect component | 1 effect | none claimed | 368 stars, pushed 2026-10-06 [V] https://github.com/huozhi/vaso |
| ybouane/liquidglass, iyinchao/liquid-glass-studio, jeantimex/glass-effect-webgpu | WebGL / WebGL2 / WebGPU shaders: refraction, chromatic aberration, lighting | effect libraries / demos | none | 534 / 737 / 65 stars [V] https://github.com/ybouane/liquidglass |
| react-glass-ui, liquid-glass-component-kit, react-liquid-glass-ui | SVG filter pipelines with progressive enhancement (kit) | small | minimal | low activity [S] https://libraries.io/npm/react-glass-ui, https://www.jsdelivr.com/package/npm/liquid-glass-component-kit |

Technique references (not libraries): kube.io's physics-based refraction write-up https://kube.io/blog/liquid-glass-css-svg, LogRocket https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg, and ekino's CSS Houdini notes https://medium.com/ekino-france/liquid-glass-in-css-and-svg-839985fcb88d. They agree that `backdrop-filter: url(#svg)` displacement works reliably only in Chromium. The liquid-glass-component-kit approach is to detect SVG-filter support and fall back to blur and saturation. [V/S]

### Apple-style web kits
I found no official Apple web or React component kit; Apple's HIG Materials page covers native platforms. https://developer.apple.com/design/human-interface-guidelines/materials [V for the HIG; the absence of a web kit is **not exhaustively verified**]. React Native has native Liquid Glass bindings (Callstack guide) https://www.callstack.com/blog/how-to-use-liquid-glass-in-react-native [S], but that path does not exist on the web.

## 4. Competitive matrix

Scores run from 1 (weak) to 5 (best in class). They are my judgement [I], based on the sourced facts above. AuraGlass 4.1 is scored from the repo state as I know it (498 certified visual targets per the latest commit, heavy peer dependencies) and is shown for contrast. The other scores have not been validated against the AuraGlass 5 autopsy.

| Dimension | shadcn/ui | Base UI | React Aria/S2 | HeroUI v3 | Mantine 9 | Chakra v3/Ark | MUI v9 | coss ui | Tremor | Aceternity/Magic | Motion (+UI) | liquid-glass-react | glass kits | AuraGlass 4.1 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Material realism (glass/refraction) | 1 | 1 | 1 | 2 | 1 | 1 | 1 | 1 | 1 | 3 | 2 | 4 | 2–3 | 3–4 |
| a11y foundation | 4–5 (via base) | 5 | 5 | 5 | 4 | 4 | 4 | 5 | 3 | 1–2 | n/a | 1 | 2–3 | ? (to audit) |
| Component breadth | 5 | 3 | 4 | 4 | 5 | 4 | 5 | 4 | 2 | 3 (effects) | 2 | 1 | 2–3 | 4–5 (claimed) |
| Product surfaces (AI/data/dashboard) | 5 | 1 | 2 | 3 | 4 | 2 | 5 (X grid/charts/chat) | 3 | 4 (dashboards) | 1 | 2 | 0 | 1 | 3 |
| Motion | 2 | 2 (CSS hooks) | 2 | 4 | 2 | 3 | 2 | 2 | 1 | 5 | 5 | 3 | 2–3 | 3 |
| DX (CLI, types, agents/MCP) | 5 | 4 | 4 | 5 | 5 | 4 | 4 | 4 | 3 | 3 | 5 | 2 | 2 | 2 |
| Theming/tokens | 5 (CSS vars + presets) | n/a (unstyled) | 4 (S2 macros) | 5 (OKLCH) | 5 | 5 | 4 | 4 | 3 | 2 | 4 (motion tokens) | 1 | 2 | 3 |
| Perf (tree-shaking, runtime cost) | 5 | 5 | 4 | 4 | 4 | 3 | 3 | 5 | 3 | 2 | 5 (MotionScore) | 2 | 2 | 2 |
| Docs/showcase | 5 | 4 | 5 | 5 | 5 | 4 | 5 | 4 | 4 | 5 (visual) | 5 | 3 | 2 | 3 |
| Ecosystem/adoption | 5 | 5 | 4 | 4 | 4 | 4 | 5 | 3 | 3 | 4 | 5 | 3 | 1 | 1 |

Distribution models:

| Model | Who uses it |
|---|---|
| Copy-in source via registry | shadcn, coss ui, Magic UI, Aceternity, Park UI, Tremor Raw, AI Elements, Motion UI (via shadcn CLI) |
| Package import | MUI, Mantine, HeroUI (plus standalone styles), Radix Themes, Base UI, React Aria, liquid-glass-react, AuraGlass |
| Hybrid | Chakra (snippets CLI plus package), HeroUI (styles package usable without components) |

## 5. Implications for AuraGlass 5.0 [I]
1. **Build on established primitives instead of bespoke behavior.** Target Base UI first (it is shadcn's default and has the highest download momentum). Add React Aria as a second adapter where touch and drag-and-drop matter. Treat Radix as compatibility only.
2. **Ship through a shadcn-compatible registry as well as the npm package.** Use `registry:base` for the whole material system, alongside a tree-shaken package. Adopt shadcn token names (`--background`, `--primary`, …) as the base layer so AuraGlass drops into existing apps and into registries like Motion UI.
3. **Make the material itself the product.** Build a tokenized, tiered glass material: a blur/saturation baseline everywhere, SVG displacement in Chromium, and an optional WebGL/shader tier. It must degrade gracefully, honor `prefers-reduced-transparency`, `prefers-reduced-motion` and `prefers-contrast`, and enforce contrast. No competitor combines these.
4. **Publish a perf grade per component,** like Motion's MotionScore: compositor-only vs paint vs filter cost, plus a budget for simultaneous backdrop filters per viewport.
5. **Compete on AI and data surfaces.** Glass versions of chat (message scroller, bubbles, attachments, tool/approval cards), command palette, questionnaire flows, and dashboard/chart shells. Tremor's stagnation leaves room in dashboards.
6. **Shrink the peer surface.** Move `openai`, `@google-cloud/vision`, `@sentry/react`, three.js and chart libraries to optional sub-entry points or registry items. Pin `motion` instead of open-range `framer-motion`.
7. **Agent DX is now expected:** an MCP server, llms.txt, markdown docs and agent skills, as HeroUI, Mantine, shadcn, React Aria and Base UI all now ship.
8. **Prove accessibility publicly,** with automated axe/contrast tests over glass on varied backdrops. Glass kits make AA claims without evidence, and that gap is where AuraGlass can stand out.
9. **Differentiate from liqui-design on purpose.** Its architecture (Base UI, shadcn registry, a shared npm glass kernel, SVG displacement with a blur fallback) is close to the target. AuraGlass has to win on five things. First, breadth: more than 21 primitives, plus AI, data and dashboard surfaces. Second, user-preference handling: reduced transparency, contrast and motion. Third, a legibility guarantee, so content stays readable even at `frost: 0`. Fourth, a WebGL/WebGPU tier. Fifth, published perf and a11y evidence.

## 6. Unverified / open items
- Aceternity UI's star count and whether its source is public.
- Per-component gzip sizes for HeroUI, Mantine and Chakra (the Bundlephobia API timed out).
- Visual specifics of shadcn's Sera and Rhea styles. Luma is confirmed as "minus the glass".
- npm download counts for `vaso`, `@liqui-design/glass` and `@swiftuijs/ui` were not measured. Component counts for einui and swiftuijs/ui are not stated in their READMEs.
- Whether liqui-design honors `prefers-reduced-transparency` or `prefers-contrast` in its source (the README is silent).
- Whether any MUI community theme ships liquid glass. The official blog shows none.
- Repo and star data for `@yhooi2/shadcn-glass-ui` (the GitHub API returned 404 for the guessed path).
- HeroUI Pro and Motion+ pricing amounts (not captured).
