# AuraGlass 5.0 research brief: translucent UI accessibility and React 19 library authoring

All sources accessed 2026-10-06. Labels: **[V]** verified from the cited primary or near-primary source, **[I]** inference or recommendation, **[U]** could not verify.

## 1. Executive summary

- WCAG 2.2 AA is still the only enforceable contrast bar. WCAG 3 is a Working Draft (latest update was 10 Sep 2026), and its contrast algorithm is "yet to be determined". APCA is not in the draft. Use APCA only as a secondary design aid, never as a substitute for 4.5:1 / 3:1. **[V]**
- WCAG never says where to sample a varying background. F83 makes text over background images a failure when contrast is insufficient. For glass, the practical rule is worst-case contrast against whatever can appear behind the surface. **[V for F83; I for the method]**
- `prefers-reduced-transparency` works in Chromium only. Safari (including 27.x TP) and Firefox do not support it. Apple users with Reduce Transparency enabled therefore get no signal on the web, so AuraGlass needs a user-controlled fallback (prop, context, or `data-` attribute) as well as the media query. **[V]**
- `prefers-contrast` (Chrome 96+, Firefox 101+, Safari 14.1+) and `forced-colors` are broadly usable. Forced colors sets `box-shadow` and `text-shadow` to `none`, so any glass edge or focus ring built from shadows disappears. **[V]**
- `contrast-color()` became Baseline Newly Available in April 2026 (Chrome 147, Firefox 146, Safari 26). It only picks black or white from a single input color. It cannot sample a blurred backdrop. **[V]**
- SVG-filter refraction through `backdrop-filter: url()` renders only in Chromium. Firefox passes `@supports` but renders nothing (silent failure). **[V, secondary sources plus an open WebKit bug]**
- Apple's own system answers the readability problem with a frostier surface under Reduce Transparency, black/white plus a contrasting border under Increase Contrast, removal of elasticity under Reduce Motion, light/dark flipping of glyphs, and (from iOS 26.1) a user "Tinted" option. That set is the most credible pattern to copy. NN/g (Budiu, 10 Oct 2025) documents real legibility failures in iOS 26. **[V]**
- React 19: `forwardRef` is "no longer necessary" and will be deprecated, and `element.ref` access warns. AuraGlass has 285 files using `forwardRef` and a peer range of `react >=18 <20`, so a dual-support strategy is needed. **[V for React docs; V for repo counts]**
- The repo puts `"use client"` at the top of the root `dist/index.mjs` bundle. That marks the whole barrel as one client boundary, which defeats RSC for any server-safe exports (tokens, types, pure layout). 866 `src` files already carry their own directive, so per-file output only needs a build change. **[V that the directive is present (re-checked 2026-10-06); I for the impact]**
- React 19.3 (9 Sep 2026) is now current. It makes View Transitions and Fragment Refs stable, and adds `browser()` for browser-only rendering. These are relevant to glass morph transitions and to measuring and sampling groups of children. **[V] https://react.dev/blog/2026/09/09/react-19-3**
- Backdrop roots are a constraint on composition. Any ancestor with `opacity < 1`, `filter`, `backdrop-filter`, `mask`, or `mix-blend-mode` stops a descendant's `backdrop-filter` from seeing past it. Chromium effectively disallows nested backdrop blur (glass inside glass). **[V] https://drafts.csswg.org/filter-effects-2 ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter**

## 2. Contrast on non-uniform (translucent) backgrounds

### 2.1 What WCAG 2.2 actually says [V]
Source: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

- Contrast is "measured with respect to the specified background over which the text is rendered in normal usage."
- The ratio is (L1+0.05)/(L2+0.05), with no rounding (4.499 fails 4.5).
- F83 covers "background images that do not provide sufficient contrast with foreground text", so text on photos is in scope.
- Setting a foreground color without a background color (or the reverse) is a failure.
- A narrow letter outline counts as part of the glyph. A wide border that fills letter detail "acts as a halo and would be considered background". This matters for text-shadow/halo techniques, because a halo becomes the measured background.
- There is no specified sampling method for gradients or blurred backdrops. **[V that it is absent]**

### 2.2 WCAG 3 / APCA status [V]
- WCAG 3 Working Drafts were published in March 2026 (https://www.w3.org/WAI/news/2026-03-03/wcag3) and September 2026 (https://www.w3.org/WAI/news/2026-09-10/wcag3).
- Adrian Roselli (Apr 2026) quotes the 8 Apr 2026 Editor's Draft: "The contrast algorithm used in WCAG 3 is yet to be determined." APCA was pulled from the draft in July 2023. He estimates WCAG 3 lands "perhaps 2030 at the soonest". His advice is to choose colors that also pass WCAG 2. http://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html
- Andrew Somers (APCA author), in the comments: "APCA is draft guidance… no one should be calling it 'WCAG 3'." He points to BridgePCA (passes WCAG 2 while adding APCA-based improvements). Same URL.
- Eric Eggert's post carries an AGWG co-chair note: no final schedule yet. https://yatil.net/blog/wcag-3-is-not-ready-yet
- **[U]** I did not read the September 2026 draft text itself to confirm the contrast section is unchanged since April.

### 2.3 Techniques for readable text over blur

| Technique | How it works | Strengths | Weaknesses | Status |
|---|---|---|---|---|
| Tint/scrim layer (opaque-ish fill under content) | `background: color-mix(in oklab, var(--surface) X%, transparent)` on top of `backdrop-filter` | Deterministic. Gives a lower bound on contrast no matter what is behind. | Reduces the "glass" look | [I] the most reliable approach. Apple's "Tinted" mode and Reduce Transparency both work this way. |
| Blur + saturate/brightness | `backdrop-filter: blur() saturate() brightness(0.8)` | Flattens high-frequency detail and pulls luminance toward a band | No guarantee for a white backdrop under white text | [V] web.dev shows backdrop-filter used to keep contrast: https://web.dev/articles/backdrop-filter |
| Text shadow / halo | Dark shadow behind light text | Cheap, and shown as a fallback in the Smashing `contrast-color()` example | Under WCAG a wide halo becomes the background. Removed in forced colors. | [V] Understanding 1.4.3; MDN/oidaisdes forced colors |
| `contrast-color()` | Picks black or white for a given color | Native, and Baseline since Apr 2026 | Takes one color. It cannot see the actual backdrop. Useful against the tint color only. | [V] https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/contrast-color ; https://www.smashingmagazine.com/2026/05/building-self-correcting-color-systems-contrast-color |
| Luminance sampling (JS) | Sample the backdrop (canvas or an image's known average color), set `data-tone=light/dark` | Can flip glyphs the way Apple does | Cross-origin pixels can't be read. Costs per frame on scroll. DOM-behind-element sampling isn't possible without html-to-canvas. | [I] No primary web API exists for sampling the backdrop. Viable only when the library knows the background (its own image or gradient components). |
| Vibrancy / glyph flipping | Apple flips symbols light/dark with the glass, and small elements flip while large ones don't | Matches Liquid Glass semantics | Needs a tone signal (sampling or author-declared) | [V] WWDC25 "Meet Liquid Glass": https://developer.apple.com/videos/play/wwdc2025/219 |

**[V] Apple's own scrim number.** The HIG Materials page (updated 9 Sep 2025) says that for the *clear* Liquid Glass variant over bright content, you should "consider adding a dark dimming layer of 35% opacity". The *regular* variant is the default for most chrome. https://developer.apple.com/design/human-interface-guidelines/materials . **[I]** For AuraGlass, a 35% dark scrim is a reasonable starting value for the `clear` variant, but the contrast gate below still decides the actual value.

**[I] Recommended AuraGlass contract.** Every text-bearing glass surface has a minimum tint opacity. The token pipeline computes contrast for text against the tint composited over both a pure-white and a pure-black backdrop. That bounds the worst case, and both results must pass 4.5:1 (or 3:1 for large text). This "two-extreme composite test" is a defensible, automatable proxy for "the background in normal usage". Blur alone must never be counted toward contrast.

## 3. User preference media features

| Feature | Support (caniuse/MDN, Oct 2026) | Implication |
|---|---|---|
| `prefers-reduced-transparency` | Chrome/Edge 119+ (Chrome blog says 118), Opera 105+, Samsung 25+. **No Safari (through 27.x TP), no Firefox.** | [V] https://caniuse.com/wf-prefers-reduced-transparency ; https://developer.chrome.com/blog/css-prefers-reduced-transparency . Apple users toggle Reduce Transparency on macOS/iOS and the web never sees it. Ship a manual override. |
| `prefers-contrast` (`more`/`less`/`custom`) | Chrome 96+, Firefox 101+, Safari 14.1+ / iOS 14.5+, about 96% global | [V] https://caniuse.com/mdn-css_at-rules_media_prefers-contrast . Safe to rely on. Map `more` to an opaque surface plus a 1px solid border (Apple's Increase Contrast behavior). |
| `forced-colors: active` | Chromium and Firefox (Windows High Contrast); MDN | [V] https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors . `box-shadow`/`text-shadow` become `none` and colors become system colors. Use `outline`/`border` with `transparent` color so they become visible, use `CanvasText`/`ButtonText`/`Highlight`, and avoid `forced-color-adjust: none` except on swatches. https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors |
| `prefers-reduced-motion` | Universal | Disable specular/elastic/morph animation (Apple: "disables any elastic properties"). |

**[U]** Whether `backdrop-filter` itself is suppressed in forced colors mode is not documented in the sources I read. Assume it may persist and add an explicit `backdrop-filter: none` plus `background: Canvas` under `forced-colors: active`.

## 4. Apple Liquid Glass readability: evidence and critique

- **Apple's built-in adaptations [V].** Reduce Transparency "makes Liquid Glass frostier and obscures more of the content behind it". Increase Contrast "makes elements predominantly black or white and highlights them with a contrasting border". Reduce Motion "decreases the intensity of some effects and disables any elastic properties". Small elements flip light/dark based on what's beneath. Large surfaces (menus, sidebars) adapt but don't flip. Use tinting selectively, not on all elements. Source: https://developer.apple.com/videos/play/wwdc2025/219 . Apple tells developers to test custom elements under these settings: https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
- **iOS 26.1 user option [V, secondary].** Settings > Display & Brightness > Liquid Glass offers Clear and Tinted. Tinted "increase[s] opacity and add[s] more contrast systemwide". https://9to5mac.com/2026/02/13/ios-26-recently-added-five-new-ways-to-customize-your-iphone ; https://talk.tidbits.com/t/ios-26-1-to-add-optional-opacity-to-liquid-glass/32182 (TidBITS documents the passcode text becoming invisible on a bright wallpaper in Clear). **[U]** The device list in some secondary sources ("iPhone 17 only") looks wrong and is unverified.
- **NN/g critique [V].** Raluca Budiu, "Liquid Glass Is Cracked, and Usability Suffers in iOS 26", 10 Oct 2025. https://www.nngroup.com/articles/liquid-glass . Findings: translucent controls over busy backgrounds are harder to see ("a very old usability finding"); Messages backgrounds camouflage text; Maps icons blend despite blur; the Mail search bar overlaps previews into illegible text; pale floating search goes unnoticed; constant motion pulls focus ("Motion for motion's sake is not usability"); smaller, crowded targets; and lost labels (back button). "Text on top of images is a bad idea."
- **[I] Implications.** (1) Ship a "tinted" or solid mode as a first-class theme axis, not an afterthought. (2) Never place glass on the content layer (body text); use it for chrome only. (3) Default motion should be calm, with specular and elastic effects opt-in. (4) Overlapping translucent layers (glass over glass) make legibility unpredictable. Lint against or collapse nested glass.

## 5. Focus indicators on glass

- **2.4.7 Focus Visible (AA)** applies. **1.4.11 Non-text Contrast (AA)** requires 3:1 for the indicator against adjacent colors. **[V]**
- **2.4.11 Focus Not Obscured (Minimum), AA [V]:** the focused component must not be "entirely hidden due to author-created content". A sticky header or footer that fully covers it fails (F110). The fix is `scroll-padding` (C43). A semi-transparent, blurred, or dimming overlay doesn't fully hide the item, so it can pass 2.4.11, **but may still fail 1.4.11**: the indicator must meet contrast *as seen through the overlay*. https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html . 2.4.12 (AAA) requires no obscuring at all.
- **2.4.13 Focus Appearance, AAA [V]:** the indicator area must be at least a 2 CSS px perimeter of the unfocused component, with at least 3:1 contrast between the same pixels in focused and unfocused states. A solid outline of 2px or more is the simplest way to pass. https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- **2.4.13 on varied backgrounds [V]**, from the same Understanding doc:
  - On a gradient, only the portion of the indicator that reaches 3:1 counts toward the minimum area.
  - Non-solid or parallax backgrounds produce "a near-infinite number of color combinations". If you have to check each combination separately, the design probably fails some low-vision users.
  - The suggested remedy is technique **C40, a two-color focus indicator**.
  - Placing a component over an image or gradient voids the user-agent exception, so the author owns the focus indicator.
  - That describes glass exactly: AuraGlass cannot rely on browser-default focus rings.
- **[I] Glass-specific guidance:**
  - Use `outline` (it survives forced colors as a system color), not `box-shadow` rings (removed in forced colors).
  - Use a two-tone ring (for example, 2px light inner and 2px dark outer via `outline` + `outline-offset` plus a border or pseudo-element) so it reaches 3:1 against both light and dark backdrops seen through the glass.
  - Apply `scroll-padding-top/bottom` equal to sticky glass header/footer heights. Expose a hook or CSS variable for it.
  - Target 2.4.13 (AAA) as the AuraGlass default. It is cheap with a 2px two-tone outline and differentiates the library.

## 6. Rendering and performance constraints relevant to a11y

- `backdrop-filter` blur is GPU-heavy, and cost grows with radius and area. A shadcn/ui issue documents dialog jank from `backdrop-blur-sm` in Chromium on weak GPUs: https://github.com/shadcn-ui/ui/issues/327 . A "3–5 simultaneous blurs on mobile" figure appears in secondary blogs only. **[U]** It is not benchmarked.
- SVG refraction via `backdrop-filter: url(#filter)` is Chromium-only. WebKit bug 245510 is open (test case updated June 2026): https://bugs.webkit.org/show_bug.cgi?id=245510 . Firefox reportedly parses it (so `@supports` passes) but renders nothing: https://www.buildmvpfast.com/blog/liquid-glass-css-backdrop-filter-recipes-2026 , https://kube.io/blog/liquid-glass-css-svg . **[V for the WebKit bug; secondary for the Firefox silent failure; I did not test it]**
- **Backdrop root rule [V].** Filter Effects 2 defines a Backdrop Root. Elements with `filter`, `opacity < 1`, `mask`, `clip-path`, `backdrop-filter`, `mix-blend-mode`, or `will-change` of those properties all qualify. A descendant's `backdrop-filter` only sees content up to that root. The spec's stated reason is to avoid an "exponential performance degradation" from nested backdrop filters. https://drafts.csswg.org/filter-effects-2 . In practice:
  - A glass card inside a glass panel, or inside a fading (`opacity`) animated wrapper, blurs only the parent's pixels or nothing at all.
  - Chromium behaves differently from Gecko and WebKit here: https://havn.blog/2024/03/14/chromium-and-nested.html
  - The common workaround is to put the blur on a `::before` pseudo-element, which avoids making the element itself the root: https://github.com/tailwindlabs/tailwindcss/discussions/15103
  - **[I]** AuraGlass entrance and exit animations should animate `transform` or a child layer, not `opacity` on the glass ancestor. Nested glass should collapse to a tint-only surface.
- **[I]** Refraction must be detected by engine or user agent, or kept behind an explicit opt-in. It must never be the only thing providing contrast. Every component needs a blur-plus-tint fallback rung and a solid rung.

## 7. React 19 / Next.js 15–16 library authoring (2026)

### 7.1 Platform facts [V]
- **Next.js 16** (Oct 2025): Turbopack is the default for dev and build; React Compiler support is stable but opt-in; it ships React 19.2 features (View Transitions, `useEffectEvent`, `<Activity>`); `"use cache"` / Cache Components; `proxy.ts` replaces middleware. Requirements are Node 20.9+, TS 5.1+, and browsers Chrome/Edge/Firefox 111+ and Safari 16.4+. https://nextjs.org/blog/next-16 ; https://nextjs.org/docs/app/guides/upgrading/version-16
- **`forwardRef`:** "In React 19, forwardRef is no longer necessary. Pass ref as a prop instead… will be deprecated in a future release." https://react.dev/reference/react/forwardRef . React 19 warns on `element.ref` (use `element.props.ref`) and adds ref callback cleanup functions. https://react.dev/blog/2024/12/05/react-19
- **React 19.3** (9 Sep 2026): View Transitions (`<ViewTransition>`) and Fragment Refs are stable, and it adds `browser()` for browser-only rendering plus Trusted Types support. React's own documentation now lists react@19.3. https://react.dev/blog/2026/09/09/react-19-3 . **[I]** Fragment Refs allow a glass group or `GlassContainer` to observe and measure children without wrapper divs, and wrapper divs are exactly what would create extra backdrop roots. `<ViewTransition>` is the native path for glass morphing between states. Gate both behind `react >=19.3` feature detection if the peer range stays wider. A secondary source notes that RSC bundler-facing APIs don't follow semver across 19.x minors, which matters only if AuraGlass ships bundler integrations: https://scrimba.com/articles/react-19-whats-new-for-developers
- **Next.js `'use client'` guidance:** add the directive "only at the topmost component in a subtree requiring client features". It cascades to everything that file imports. https://nextjs.org/docs/app/api-reference/directives/use-client
- **`'use client'`:** libraries updated for RSC "will already include 'use client' markers of their own". Props crossing the boundary must be serializable (no functions except Server Functions). https://react.dev/reference/rsc/use-client . Dan Abramov: `'use client'` effectively means "export to server", and a file under it commits to serializable props as public API. https://github.com/vercel/next.js/discussions/46795

### 7.2 Best practices [I unless noted]
1. **Directive placement.** Put `'use client'` per interactive leaf module, not on the barrel. Build with `preserveModules` (Rollup/Vite lib mode, tsup `bundle:false`, or tsdown) so directives survive per file. `rollup-plugin-preserve-directives` exists for this [V: https://www.npmjs.com/package/rollup-plugin-preserve-directives]. Bundling everything into one file forces the directive onto the whole bundle. That is what AuraGlass 4.1 does today (the first line of `dist/index.mjs` is `"use client";`), so tokens, types, `cn()` and pure presentational glass all become client references.
2. **Split entry points by environment.** Use `aura-glass/server` (or keep `./tokens`, `./theme` directive-free) and `aura-glass/client`. Add an `exports` `"react-server"` condition for server-safe variants where needed. **[U]** I did not re-verify the current Next.js docs on `react-server` condition handling.
3. **Serializable public props.** Components exported across the boundary should accept data props (variants, tokens) rather than render functions. Keep callback props on client-only compositions.
4. **Ref as prop with React 18 support.** The peer range is `>=18 <20`, so use either (a) a small `ref`-aware helper that uses `forwardRef` only on 18 (detect `React.version`), or (b) bump the 5.0 peer to `react >=19` and codemod the 285 `forwardRef` files to ref-as-prop. **[I]** Option (b) is cleaner for a major version and removes deprecation exposure. Also adopt ref-callback cleanup for ResizeObserver/IntersectionObserver usage.
5. **React Compiler compatibility.** Next 16 makes it stable and opt-in. Library code should follow the Rules of React (no mutation during render, stable hooks). Consider shipping precompiled output or at least testing under `babel-plugin-react-compiler`. **[U]** I did not verify a recommended library-side compiler publishing guide.
6. **Package exports.** Use an explicit `exports` map with `types` first, ESM `import` plus `require` only if CJS is truly needed, and CSS as explicit subpaths (`./styles.css`). 5.0 is a chance to drop CJS. Next 16 and modern bundlers are ESM-first. **[I]**
7. **`sideEffects`.** Per webpack, CSS imported only for side effects must be listed or it is silently dropped in production [V: https://webpack.js.org/guides/tree-shaking/]. The current `["*.css","src/styles/**/*"]` is correct for CSS. The `src/` glob does not match `dist/` paths, so verify that no JS module in `dist` registers globals (polyfills, custom elements, Sentry init) or it will be pruned. **[I]**

### 7.3 CSS distribution (Tailwind v4, cascade layers)
- Tailwind v4 is CSS-first (`@theme`, `@plugin`, `@custom-variant`, `@source`) and emits `@layer theme, base, components, utilities`. https://tailwindcss.com/blog/tailwindcss-v4 [V]
- Tailwind v4 **does not scan `node_modules`**. Consumers must add `@source "../node_modules/aura-glass";` (or the library documents it), and `@source inline()` handles safelisting. https://tailwindcss.com/docs/detecting-classes-in-source-files [V]. A version mismatch (an app on v3 with a library on v4) causes purged classes: https://github.com/tailwindlabs/tailwindcss/discussions/18545 [V]
- Unlayered author CSS beats every layered rule regardless of specificity, so a library shipping unlayered CSS overrides app utilities. https://support.uniform.dev/articles/6708776258-tailwind-v4-patterns [V, secondary, consistent with the CSS Cascade spec]
- **[I] Recommendations:**
  - Ship precompiled CSS wrapped in a named layer (`@layer auraglass.base, auraglass.components;`) so apps can order it, for example `@layer theme, base, auraglass, components, utilities;`.
  - Ship a separate `aura-glass/tailwind.css` exposing tokens through `@theme` (aliasing CSS custom properties, `@theme inline` where values reference vars) for Tailwind v4 users.
  - Keep the zero-Tailwind path (plain CSS variables) working.
  - Put the a11y media query overrides (reduced transparency, contrast, forced colors) in the same layer as the base surface so app utilities can still override them intentionally.

## 8. Recommendations for AuraGlass 5.0 (consolidated, all [I])

1. Add a "transparency mode" axis to the theme (`glass | tinted | solid`) controlled by `prefers-reduced-transparency`, `prefers-contrast: more` (forces at least tinted plus a border), `forced-colors` (forces solid system colors), **and** a provider prop or `data-aura-transparency` attribute, because Safari and Firefox don't expose reduced transparency.
2. Define a token-level contrast gate: text tokens over a surface tint composited on white and on black must pass WCAG 2.2 at 4.5:1 / 3:1, enforced in CI. Report APCA Lc as advisory only.
3. Use `contrast-color()` (with `@supports` fallback) for text on tinted chips and buttons where the tint is known. Don't market it as solving backdrop contrast.
4. Provide an optional `tone="auto"` luminance sampler only for library-owned backgrounds (image or gradient components), flipping glyph color in the Apple style. Make it off by default and throttle it.
5. Default focus ring: a 2px two-tone `outline`, meeting 2.4.13 AAA. Never box-shadow-only. Provide `scroll-padding` integration for sticky glass bars (2.4.11).
6. Treat refraction (SVG displacement) as Chromium-only progressive enhancement behind explicit opt-in, with a guaranteed blur-plus-tint fallback. Never rely on `@supports` for it.
7. Budget `backdrop-filter`: cap simultaneous blurred layers, avoid animating blur radius, collapse nested glass, and degrade on `(hover:none)` or low-power heuristics.
8. Calm motion by default: under `prefers-reduced-motion`, specular and elastic effects are disabled. Even without it, keep idle animation off, in line with the NN/g findings.
9. Fix the RSC boundary: per-file `'use client'` with `preserveModules`, directive-free server-safe entry points (tokens, theme, types, static glass shells).
10. Consider `react >=19` as the 5.0 peer and codemod `forwardRef` to ref-as-prop. If 18 must stay, isolate the shim in one helper.
11. Ship layered CSS plus a Tailwind v4 `@theme` entry, and document the required `@source` line.
12. Design the component tree around backdrop roots. Put the blur on a dedicated layer (pseudo-element or child), never use `opacity` on glass ancestors for animation, and use Fragment Refs (React 19.3) instead of measurement wrappers.
13. Use a 35% dark dimming scrim as the starting default for the `clear` variant over bright media (Apple HIG), then validate it with the contrast gate.
14. Outside this brief's scope but noticed: the peer dependencies include `openai`, `redis`, and `@google-cloud/vision`, which are unusual for a UI library and work against RSC/edge consumers. They deserve a separate audit. **[V that they are listed in package.json]**

## 9. Not verified

- The exact text of the WCAG 3 September 2026 draft contrast section.
- Whether `backdrop-filter` is neutralized in forced colors mode.
- Next.js docs on the `react-server` export condition for third-party packages in Next 16.
- Quantified mobile blur budgets (only secondary blog claims).
- Firefox behavior for `backdrop-filter: url()` (secondary sources only; not tested).
- The iOS 26.1 Tinted option's device eligibility.
