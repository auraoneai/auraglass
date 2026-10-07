# Web techniques for realistic glass and refraction (AuraGlass 5.0 research brief)

Access date for all sources: 2026-10-06. Labels: **[V]** verified against the cited primary or near-primary source; **[R]** reported by a secondary source and not independently checked; **[I]** my inference.

## TL;DR

1. **The only platform-native primitive that works everywhere is still `backdrop-filter` with built-in functions** (`blur`, `saturate`, `brightness`, `contrast`). That includes Chrome 76+, Firefox 103+, and Safari 9+. Safari 18 added the unprefixed property [V]. Real-backdrop refraction through `backdrop-filter: url(#svg)` works **only in Chromium** [V]. WebKit has open PRs but nothing has merged [V]. Firefox parses the value and renders nothing [R].
2. **Refraction that is truly cross-browser has three options:** (a) apply the SVG `filter` to a *copy* of the content inside the lens rather than the backdrop (PallavAg/liquid-glass-web-react); (b) rasterize the DOM into WebGL (ybouane/liquidglass); (c) HTML-in-Canvas, which is Chromium origin-trial only and whose trial expires 2026-10-20 [V]. Each has hard constraints. None is a drop-in replacement for a real backdrop.
3. **The physically based displacement-map method (kube.io) is the quality reference.** Precompute a Snell's-law displacement map once per shape and size, feed it to `feImage` and `feDisplacementMap`, and animate only `scale`. A size change means rebuilding the map [V].
4. **Published *measured* performance data for `backdrop-filter` is almost nonexistent.** What exists is qualitative: cost scales with blur radius and pixel area, and nested backdrop filters are capped by the spec's "Backdrop Root" rule because the cost would grow exponentially [V]. AuraGlass needs its own benchmark harness. That is a gap, not a reason to skip the work.
5. **Adaptive-color primitives are now Baseline:** `contrast-color()` (April 2026), relative color syntax, `color-mix()`, and `@property` [V]. So are anchor positioning (January 2026) and same-document View Transitions (October 2025) [V]. **`prefers-reduced-transparency` is not:** it works in Chromium 118+ only, is behind a flag in Firefox, and is absent in Safari through 27.2 [V].

---

## 1. SVG displacement-map refraction

### 1.1 kube.io: "Liquid Glass in the browser" (the physical reference)
Source: https://kube.io/blog/liquid-glass-css-svg/ [V]

- **Model:** Snell's law (n1·sinθ1 = n2·sinθ2), with air at n=1 and glass at about 1.5. It assumes a single refraction and rays hitting the background head-on.
- **Surface:** a bezel height function, with the normal taken from a numerical derivative. Four profiles are compared: convex circle, convex squircle, concave, and "lip" (a smootherstep blend). The article prefers convex, because concave "push[es] rays outside the glass". The squircle gives softer transitions.
- **Map generation:** for circular or rounded shapes, displacement depends only on distance to the edge. The article computes 127 rays along one radius and rotates them around the shape. Vectors are normalized by the maximum displacement, which then becomes `feDisplacementMap scale`. Encoding is R=128+x·127 and G=128+y·127. With 8-bit channels, displacement is limited to -128 to 127 px per axis.
- **Pipeline:** `feImage` (the map) → `feDisplacementMap` (R→x, G→y) on `SourceGraphic`. A specular rim is a second `feImage`, with intensity set by the angle between the normal and a fixed light direction, composited with `feBlend`.
- **Cost model:** "nearly every tweak (besides animating `<filter/>` props, like `scale`) forces a full displacement map rebuild". The backdrop-filter region "does not adjust automatically to the element size", so maps must be sized per element.
- **Limitations:** only circular shapes; rounded rectangles are made by stretching the middle. No exit refraction, no perspective, demo quality only.
- **Support:** "Only Chrome currently supports using SVG filters as backdrop-filter". On Safari and Firefox it works only as a regular `filter`.

### 1.2 Implementations surveyed

| Project | Technique | Browser support | Notes |
|---|---|---|---|
| rdev/liquid-glass-react (https://github.com/rdev/liquid-glass-react) | Displacement plus blur, with chromatic aberration and elastic hover. Modes: standard, polar, prominent, shader | README: Safari and Firefox are "partial" and displacement is not visible there [V] | MIT, about 6.3k stars. Props include `displacementScale`, `blurAmount`, `saturation`, `aberrationIntensity`, `elasticity`, `overLight`. The README calls shader mode "not the most stable" [V] |
| shuding/liquid-glass (https://github.com/shuding/liquid-glass) | Canvas-generated map from a "fragment" function (rounded-rect SDF plus smoothStep) via `putImageData` → `toDataURL` → `feImage` → `feDisplacementMap`, applied through `backdrop-filter: url(#id) blur() contrast() brightness() saturate()` | Chromium only, because it uses backdrop url() [V; I for the support status] | The cleanest minimal recipe, about 1.1k stars. The map is regenerated only when the fragment reads the mouse position (Proxy-tracked) [V] |
| archisvaze/liquid-glass (https://github.com/archisvaze/liquid-glass) | SVG version: `feDisplacementMap` plus `backdrop-filter`, with IOR, thickness, and bezel controls. WebGL version: three.js fullscreen GLSL ray refraction | SVG: "Chrome / Chromium only". WebGL: all browsers [V] | The WebGL version appears to refract a chosen *image* background, not live DOM [I] |
| PallavAg/liquid-glass-web-react (https://github.com/PallavAg/liquid-glass-web-react) | **No backdrop-filter.** The SVG filter runs on the wrapper's own painted pixels. A PNG map holds R/G displacement, B baked specular, and A lens mask, with only one quadrant computed thanks to 4-fold symmetry. Three displacement passes at different scales produce chromatic fringing | Claims Chrome, Safari, and Firefox on desktop and mobile [R] | About 5 kB gzip. Documented caveats: Safari caps filter source size (large containers degrade); iOS misplaces `objectBoundingBox` subregions, so `userSpaceOnUse` is used; `<video>` never reaches the SVG filter pipeline in Safari; Safari caches filter output by ID, so each update gets a fresh ID [V] |
| ybouane/liquidglass (https://github.com/ybouane/liquidglass) | Rasterizes DOM through `html-to-image` (SVG foreignObject) to canvas, then a WebGL shader adds refraction, CA, Fresnel, specular, and shadow. Glass stacks refract lower glass | WebGL1 + Canvas2D + foreignObject, so effectively all browsers [V] | `init()` takes 100–500 ms. Each instance opens one WebGL context, and browsers cap these at about 16. Nested glass is not allowed. Cross-origin assets taint the canvas. Web fonts need CORS. Resize recaptures everything [V] |
| "Atlas Pages" | I could not find a project with this name. The closest match is the "Pup Atlas" tutorial referenced by Master.dev (https://blog.master.dev/liquid-glass-on-the-web): it explains `backdrop-filter`, then adds SVG filters for distortion [R] | — | **Unverified.** I did not access the original tutorial |
| iyinchao/liquid-glass-studio (topic listing https://github.com/topics/liquidglass) | WebGL2/WebGPU shader studio | WebGL2 everywhere; WebGPU where available | Listing data only [R] |

### 1.3 feTurbulence noise displacement
The common "poor man's" liquid look feeds blurred `feTurbulence` noise into `feDisplacementMap` (https://dev.to/fabiosleal/how-to-create-the-apple-liquid-glass-effect-with-css-and-svg-2o06, https://theplusaddons.com/blog/liquid-glass-ui) [R].
- It is cheap to author, but the result is organic wobble, not lens-like refraction.
- On a regular `filter` it works in every engine. On a backdrop it needs the Chromium-only `url()` path.
- Animating `baseFrequency` or `seed` regenerates noise every frame, which makes it expensive. Animating `scale` is much cheaper [I, consistent with kube.io's cost model].
- The cost is a full-surface rasterization pass on top of the blur (https://theplusaddons.com/blog/liquid-glass-ui) [R].

### 1.4 `backdrop-filter: url(#svg)` support status (decision-critical)
- **Chromium:** works. It is non-standard in the sense that the spec allows `url()`, but cross-browser behavior is not interoperable (kube.io; MDN syntax lists `url("filters.svg#filter")`, https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) [V].
- **WebKit:** bug 245510 (https://bugs.webkit.org/show_bug.cgi?id=245510) is **NEW, unassigned, P2**. It was filed 2022-09-21 and last modified 2026-09-05. PRs 68613 (an accelerated-path prerequisite that also fixes a GPU-process crash loop on the testcase), 68614 (`url()` support via a software path during RenderLayer painting, plus 6 WPT ref tests), and 69566 are posted with green EWS but are **not merged**. It depends on bug 317059 (WPT tests). There is no Safari release target [V]. Even if it lands, the first implementation is a **software path** [V], which suggests worse performance than Chromium's GPU path [I].
- **Firefox:** MDN BCD issue #24110 (https://github.com/mdn/browser-compat-data/issues/24110) documents that SVG filters in `backdrop-filter` do not work in Firefox or Safari [V]. A secondary source says Firefox parses `url()` as valid, passes `@supports`, and renders nothing, so `@supports` cannot detect it (https://www.buildmvpfast.com/blog/liquid-glass-css-backdrop-filter-recipes-2026) [R]. **Implication:** detection has to use UA/engine sniffing or a runtime pixel probe [I].
- **Standards:** svgwg issue #1142, "Filter Effects: define interoperable backdrop displacement/refraction for 'liquid glass' UI", was filed 2026-06-25 (mailing-list record: https://lists.w3.org/Archives/Public/public-svg-issues/2026Jun/0110.html) [V]. A secondary source says it is unassigned (buildmvpfast) [R]. Filter Effects 2 itself still "does not yet have Working Group consensus", specifically on the definition of Backdrop Root (https://drafts.csswg.org/filter-effects-2) [V]. Patrick Brosset's June 2026 SVG survey lists "Improve filter support for backdrop-filter" as a top developer ask (https://patrickbrosset.com/articles/2026-06-22-whats-missing-from-svg) [V].

---

## 2. Base `backdrop-filter`

### Support
Per caniuse (https://caniuse.com/css-backdrop-filter) [V]:
- Chrome 76+, Edge 17+/79+
- Firefox 103+ (disabled by default in 70–102)
- Safari 9+

Safari 18 release notes: "Added support for the unprefixed `backdrop-filter`" (https://developer.apple.com/documentation/safari-release-notes/safari-18-release-notes) [V]. However, an MDN BCD report (https://github.com/mdn/browser-compat-data/issues/25914, February 2025) claims that in Safari 18 the unprefixed form was ineffective in practice, and that `-webkit-backdrop-filter` does not resolve **CSS custom properties** [R]. A second 2026 source repeats the custom-property claim (buildmvpfast) [R]. **I have not verified whether this still holds in Safari 26.x.** It is directly relevant: AuraGlass drives blur through `--glass-backdrop-blur` (`src/styles/glass.css`).

### Semantics that drive cost and design
- **Backdrop Root** (Filter Effects 2, https://drafts.csswg.org/filter-effects-2) [V]. An element with `filter`, `opacity < 1`, `mask`, `clip-path`, `backdrop-filter`, `mix-blend-mode`, or `will-change` on those properties becomes a backdrop root. Descendant backdrop filters see only content between that root and themselves. The spec states the reason: without this, cost would be "exponentially worse if backdrop-filters are nested". MDN gives the example that a parent with `opacity: 0.9` restricts a child's blur (https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) [V].
  - **Consequence for AuraGlass:** glass-in-glass (a menu inside a glass header, a glass button on a glass card) will not blur the page behind the parent. The fix is to put the blur on a sibling or `::before` layer rather than on the ancestor (https://havn.blog/2024/03/14/chromium-and-nested.html, https://github.com/tailwindlabs/tailwindcss/discussions/15103) [V/R].
- **Sampling extent:** the blur considers only pixels directly behind the element. Off-screen content never contributes, which causes color "pops" during scroll. Josh Comeau's workaround extends the blurred layer (`height: 200%`) and masks it with `mask-image` (https://www.joshwcomeau.com/css/backdrop-filter) [V].
- **Chrome flicker:** blur edges flicker in Chrome during animation and scroll (https://jameshfisher.com/2024/04/23/backdrop-blur-without-the-flickering) [R].

### Performance data (what exists)
- **No rigorous published benchmark was found.** I searched for frame-time and fps measurements by blur radius, layer count, and mobile GPU and found none from a browser vendor or a reproducible lab. Everything below is qualitative or anecdotal.
- **Scaling claims** [R; consistent with GPU blur theory, I]:
  - Cost scales with blur radius and pixel area. One source cites O(r²) for a naive Gaussian (https://www.mironsoft.de/en/blog/css-backdrop-filter-frosted-glass-effects).
  - "A 12px blur on a 300×200 card is negligible; a 40px blur on a full-viewport panel is doing real work" (https://empire-ui.com/blog/backdrop-filter-css).
  - In practice, compositors use separable or downsampled (Kawase-style) blurs, so cost grows sub-quadratically with radius but linearly with area and layer count [I; I did not verify against Chromium or Skia source].
- **Field reports** [V/R]:
  - shadcn/ui #327: `backdrop-blur-sm` on modals and sheets caused severe slowdowns on weaker GPUs in Chromium, while Firefox was smoother (https://github.com/shadcn-ui/ui/issues/327).
  - Tailwind discussion #5023: a full-screen dialog overlay blur caused about 0.5 s of hover lag on large screens (https://github.com/tailwindlabs/tailwindcss/discussions/5023).
  - Heuristics: about 3–5 simultaneous blurs on mobile (https://blog.openreplay.com/creating-blurred-backgrounds-css-backdrop-filter), or 2–3 per viewport (https://zudo-css-wisdom.takazudomodular.com/docs/effects/backdrop-filter-and-glassmorphism). These are unsourced rules of thumb.
- **Frame budgets** (Android docs, https://developer.android.com/topic/performance/issues/render) [V]: 16 ms at 60 fps, 11 ms at 90 fps, 8 ms at 120 fps. On ProMotion and 120 Hz phones, each blur layer competes for an 8 ms budget [I].
- **The WebGL analogue is also costly.** three.js `MeshTransmissionMaterial` runs an extra scene render pass per transmissive object. Drei recommends low `samples` and `resolution` (even 32×32 when roughness is set) and a shared `transmissionSampler`, at the cost of not seeing other transmissives (https://drei.docs.pmnd.rs/shaders/mesh-transmission-material, https://tympanus.net/codrops/2025/03/13/warping-3d-text-inside-a-glass-torus) [V]. Lesson: a shared low-resolution backdrop texture is the main performance lever in every approach [I].

---

## 3. GPU and shader approaches

| Approach | Support (2026) | Can it see live DOM behind it? | Cost | Fit for AuraGlass |
|---|---|---|---|---|
| WebGL2 shader over an image or canvas background | Universal | No, except your own canvas or video content | Low–medium; one context per instance, about 16-context cap [V via ybouane] | Hero and background scenes, "glass over media" components |
| DOM → canvas rasterization (html-to-image) + WebGL | Universal | Approximately; it is a snapshot with dirty tracking [V] | Initialization takes 100–500 ms; rasterization is the main cost; `data-dynamic` defeats caching [V] | Only for contained, mostly static sections. Not general UI |
| HTML-in-Canvas (`layoutsubtree`, `drawElementImage`, `texElementImage2D`, `copyElementImageToTexture`) | Chromium origin trial, Chrome 148–150 [R]; trial **expires 2026-10-20** (https://developer.microsoft.com/microsoft-edge/origin-trials/trials/a297467e-0030-4c4c-8739-48e130026c03) [V]; flag `chrome://flags/#canvas-draw-element` (https://developer.chrome.com/blog/html-in-canvas-origin-trial) [V] | Yes, for children of the canvas, with accessibility and hit-testing preserved [V] | Unknown | Track it. It is the most promising long-term path to true refraction of DOM, but not shippable |
| WebGPU | Chrome/Edge 113+ (Android 12+ from 121 on Qualcomm/ARM); Firefox 141 Windows and 145 macOS Apple Silicon (Linux, Android, and Intel Mac in progress); Safari 26 on macOS, iOS, iPadOS, visionOS (https://web.dev/blog/webgpu-supported-major-browsers) [V] | Same as WebGL | Lower driver overhead [I] | Optional renderer behind feature detection. WebGL2 stays the baseline |
| three.js `MeshTransmissionMaterial` / ogl | Universal (WebGL) | Only the 3D scene | An extra render pass per object [V] | Only for 3D showcase components such as Glass3DEngine |
| Canvas2D | Universal | No | CPU-bound per frame [I] | Map generation only, as kube.io and shuding do |

---

## 4. CSS Houdini Paint API
- **Support:** Chromium only. web.dev calls Safari "partial" and Firefox "under consideration" (https://web.dev/articles/houdini-how) [V].
- The GoogleChromeLabs css-paint-polyfill was **archived on 2026-04-19** (https://github.com/GoogleChromeLabs/css-paint-polyfill) [V].
- **Verdict [I]:** do not build core visuals on `paint()`. Rim lights, noise, and specular gradients can be done with gradients, masks, `@property`, and static or generated images.

## 5. Fresnel rim, specular, and noise without shaders
- **Rim and specular:** layered `inset` box-shadows for the top highlight and bottom shade, a `border-image` or masked pseudo-element with a `conic-gradient` or `linear-gradient` for the rim, and `mask-composite` to keep the highlight to the border ring. kube.io's specular term is the same idea in SVG: highlight ∝ the normal angle relative to a fixed light vector [V]. An html-in-canvas.dev recipe shows the inset-shadow version (https://html-in-canvas.dev/liquid-glass-effect) [R].
- **Animated light angle:** register `--light-angle` as `<angle>` with `@property` so it interpolates. `@property` is Baseline since Firefox 128, July 2024 (https://web.dev/blog/web-platform-07-2024) [V].
- **Noise and grain:** a tiny tiled PNG or AVIF (64–128 px) or an inline SVG `feTurbulence` *as a static background image*, blended with `mix-blend-mode: overlay` or `soft-light` at 2–6% opacity. It costs roughly one paint, provided the noise is not animated and does not sit under a backdrop filter that repaints [I].
  - **Caution:** `mix-blend-mode` makes the element a backdrop root (Filter Effects 2) [V]. Put grain on a child layer, not on the glass element itself.

## 6. Morphing: anchor positioning and View Transitions
- **Anchor positioning:** Baseline Newly available since Firefox 147 (2026-01-13). Chrome 125+, Safari 26+ (https://web.dev/blog/web-platform-01-2026) [V]. Known interop bugs remain: anchored fixed-position elements in Safari, `position-try` edge cases, overflow placement in Chromium (https://github.com/web-platform-dx/web-features/issues/3558) [V]. Good for glass popovers and tooltips that track triggers without JS.
- **Same-document View Transitions:** Baseline since Firefox 144 (October 2025), including `view-transition-class` and `match-element` (https://web.dev/blog/same-document-view-transitions-are-now-baseline-newly-available) [V]. Cross-document transitions work in Chromium 126+ and Safari 18.2+; Firefox has them in progress or behind a flag (https://css-tricks.com/cross-document-view-transitions-part-1) [R].
- **Glass caveat [I]:** View Transitions animate *snapshots*. A backdrop-filtered element's blur is captured as a flat image, so the glass will not re-sample the live backdrop mid-morph. Elements with `backdrop-filter` and SVG refraction should either (a) cross-fade the blur in after the transition (`:active-view-transition` lets you drop the blur during the transition), or (b) morph with FLIP/WAAPI on the live element. This needs testing in each engine; I could not verify per-engine snapshot behavior for backdrop filters.

## 7. Adaptive tint and contrast
- **`color-mix()`, relative color syntax (`oklch(from var(--c) l c h)`), `light-dark()`:** RCS works in Chrome 119+, Safari 16.4+ (Safari 18 added `currentColor` and system colors), and Firefox 128+ (https://csscolor.monster/relative-colors, Safari 18 notes) [V/R]. Use them to derive tint, border, and rim tokens from one surface color per theme.
- **`contrast-color()`:** Baseline Newly available April 2026 with Chrome 147, Safari 26, and Firefox 146 (https://web.dev/blog/web-platform-04-2026, https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/contrast-color) [V]. It returns black or white only. **Limitation:** it knows the *declared* color, not the blurred pixels behind glass. On translucent glass it guarantees contrast only against the tint, not the actual composite [I]. Una Kravets describes tricks for going beyond black and white (https://una.im/advanced-contrast-color) [R].
- **Real background-adaptive legibility** (Apple's approach) requires sampling luminance under the element, through canvas readback of known media or a JS luminance probe, and is impossible for arbitrary cross-origin DOM [I]. The practical web answer is a guaranteed floor: tint opacity high enough that a worst-case backdrop still passes WCAG contrast [I].

## 8. `prefers-reduced-transparency`
- **Chrome and Edge 118+** support it (https://developer.chrome.com/blog/css-prefers-reduced-transparency) [V].
- **Firefox:** implemented but **disabled by default**, versions 113–160 (pref `layout.css.prefers-reduced-transparency.enabled`) [V; caniuse https://caniuse.com/mdn-css_at-rules_media_prefers-reduced-transparency and the Mozilla intent https://groups.google.com/a/mozilla.org/g/dev-platform/c/l410J8odZjA].
- **Safari (macOS and iOS):** not supported through 27.2 [V caniuse]. This is notable because Apple's own OS has the setting.
- MDN marks it "Limited availability", not Baseline (https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency) [V].
- **Implication:** AuraGlass already honors it (`src/styles/glass.css` and `src/core/mixins/glassMixins.ts`), but on Safari and Firefox it will **never fire**. A first-class, user-controllable "reduced transparency" or "contrast" mode is required (component prop, provider setting, or `data-` attribute). `prefers-contrast: more` should map to the same mode as a secondary signal. Safari also supports `prefers-contrast: custom` (Safari 18 notes) [V].

## 9. Readability evidence
- NN/g, "Liquid Glass Is Cracked": transparency makes iOS 26 "less legible", and the interface is "restless" and "constantly pulling focus" (https://www.nngroup.com/articles/liquid-glass) [V].
- Apple added a "Tinted" option in iOS 26.1 beta after legibility complaints (https://www.linkedin.com/posts/alexismangin_apple-finally-admitted-it-liquid-glass-isn-activity-7386301740738043904-6npa) [R].
- **Design rule [I]:** refraction belongs at the *bezel* (edge band), never under text. Keep the content area as a blurred, tinted plate with a contrast floor.

---

## 10. Cost/benefit matrix

| Technique | Chrome | Safari | Firefox | Perf cost | Readability impact | Verdict |
|---|---|---|---|---|---|---|
| `backdrop-filter: blur()+saturate()` | ✅ | ✅ (also ship `-webkit-`, hard-coded values) | ✅ 103+ | Medium; scales with radius × area × layers | Positive when tinted | **Baseline tier** |
| `backdrop-filter: url(#svg)` refraction | ✅ | ❌ (PRs unmerged) | ❌ (silent) | High; map rebuild on resize | Negative if under text | **Chromium enhancement tier**, edge band only |
| SVG `filter` on inner content copy (PallavAg pattern) | ✅ | ✅ (size cap, no video) | ✅ [R] | Medium–high | Neutral | Option for small lenses (toggles, sliders, pills) |
| feTurbulence wobble | ✅ backdrop / all as `filter` | filter only | filter only | Medium; high if animated | Negative | Decorative only |
| WebGL/WebGPU shader over media | ✅ | ✅ | ✅ (WebGPU partial) | Medium; context cap | Neutral | "Glass over media/hero" components |
| DOM-raster + WebGL | ✅ | ✅ | ✅ | High init, fragile | Neutral | Not for a component library |
| HTML-in-Canvas | OT only | ❌ | ❌ | Unknown | — | Watch |
| Houdini `paint()` | ✅ | partial | ❌; polyfill archived | Low | — | Avoid |
| Gradient/mask rim, `@property` light | ✅ | ✅ | ✅ | Low | Positive (edge definition) | **Adopt** |
| Static grain texture | ✅ | ✅ | ✅ | Low | Slightly positive (banding) | **Adopt**, on a child layer |
| `contrast-color()`, RCS, `color-mix()` | ✅ | ✅ | ✅ | ~0 | Positive | **Adopt**, with an older-browser fallback |
| Anchor positioning, same-doc VT | ✅ | ✅ | ✅ | Low | — | Adopt; test glass under VT |
| `prefers-reduced-transparency` | ✅ | ❌ | flag | — | — | Honor it, plus an explicit app-level mode |

## 11. Not verified or open questions
- Whether Safari 26.x still ignores custom properties inside `-webkit-backdrop-filter` (reports are from 2025 and 2026 secondary sources).
- Firefox's "valid-but-invisible" behavior for `backdrop-filter: url()` and its exact `@supports` result (secondary source only).
- The current assignment and status of svgwg #1142 (the filing was verified through the lists.w3.org archive, but the GitHub issue page was not opened).
- HTML-in-Canvas status. html-in-canvas.dev (accessed 2026-10-06) describes a flag-gated Chromium 147+ dev trial (Canary or Brave) and does not mention an origin trial. Chrome and Edge origin-trial pages report an OT that expires 2026-10-20. Either way, it cannot ship in stable cross-browser builds.
- Any reproducible fps or frame-time benchmark for backdrop blur across radius, layer count, and device. None found.
- Identity of "Atlas Pages". Not found. The closest match is the "Pup Atlas" tutorial cited by Master.dev.
- How each engine renders `backdrop-filter` elements inside View Transition snapshots.
- PallavAg's cross-browser claims (from the README, not tested).
