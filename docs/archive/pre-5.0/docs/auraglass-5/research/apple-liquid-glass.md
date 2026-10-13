# Apple Liquid Glass: material principles brief for AuraGlass 5.0

All sources accessed 2026-10-06. Labels used below:

- **[V]**: verified against the primary source text. Apple developer docs were read from their JSON data endpoints (`developer.apple.com/tutorials/data/...json`); WWDC sessions were read from their transcripts.
- **[S]**: secondary source, such as press or a practitioner blog.
- **[I]**: inference for AuraGlass.

The goal is to pull out the *principles* behind Liquid Glass, not its look.

---

## 1. Timeline

| Date | Event | Source |
|---|---|---|
| 2025-06-09 | Liquid Glass announced at WWDC25 for iOS/iPadOS/macOS/watchOS/tvOS 26. Alan Dye: "our broadest software design update ever" [V] | https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design |
| 2025-06 | WWDC25 sessions 219 "Meet Liquid Glass" and 356 "Get to know the new design system" [V] | https://developer.apple.com/videos/play/wwdc2025/219 , https://developer.apple.com/videos/play/wwdc2025/356 |
| Summer 2025 betas | Apple raised opacity in several places after legibility complaints [S] | https://en.soydemac.com/Liquid-Glass-in-iOS-26.-Apple-redesigns-its-design-after-criticism. |
| 2025-10 (26.1) | New Settings > Display & Brightness > Liquid Glass control: **Clear** (default) or **Tinted**. Apple's wording: "Tinted increases opacity and adds more contrast." Also on macOS 26.1 under Appearance [S, quoting Apple release notes] | https://www.cnet.com/tech/services-and-software/ios-26-1-lets-you-change-the-liquid-glass-on-your-iphone-and-more , https://talk.tidbits.com/t/ios-26-1-to-add-optional-opacity-to-liquid-glass/32182 |
| 2025-09-09 | HIG Materials change log: "Updated guidance for Liquid Glass" [V] | https://developer.apple.com/design/human-interface-guidelines/materials |
| 2025-10-10 | NN/g, "Liquid Glass Is Cracked, and Usability Suffers in iOS 26" (Raluca Budiu) [V] | https://www.nngroup.com/articles/liquid-glass/ |
| 2025-12 (26.2) | Lock Screen clock "Glass" style gets a per-element **transparency slider**; a separate "Solid" option turns glass off for the clock [S] | https://forums.macrumors.com/threads/ios-26-2-lock-screen-gets-liquid-glass-slider.2470476 , https://www.idownloadblog.com/2026/01/09/adjust-iphone-lock-screen-clock-liquid-glass |
| 2025-12-16 | HIG Color change log: "Updated guidance for Liquid Glass" (the Liquid Glass color section quoted in 2.7) [V] | https://developer.apple.com/design/human-interface-guidelines/color |
| 2026-03 (26.4) | New accessibility toggle **Reduce Bright Effects** (renamed from "Reduce Highlighting Effects" in beta). Apple's description, as quoted: "minimizes highlighting and flashing when interacting with onscreen elements, such as buttons or the keyboard." [S] | https://pxlnv.com/linklog/ios-reduce-bright-effects , https://osxdaily.com/2026/04/28/use-reduce-bright-effects-ios-26-iphone-ipad-liquid-glass |
| 2026-06-08 (WWDC26, iOS 27) | The binary toggle becomes a **slider from "ultra-clear to fully tinted"**. Sharper icons. macOS "reincorporate[s] cornerstones of the macOS design", including "a more uniform toolbar across the top of apps, edge-to-edge sidebars, colored sidebar icons" [V] | https://www.apple.com/newsroom/2026/06/apple-unveils-next-generation-of-apple-intelligence-siri-ai-and-more |
| 2026-06 | Changes to the material itself. Apple (WWDC26 "Meet with Apple" recap transcript): "Liquid Glass now diffuses content behind it much more effectively. It also creates a more distinct separation by using a darkened edge with brighter specular [highlights]"; "If you've already done the work to adopt Liquid Glass, your app will pick up these [improvements]." apple.com/os/ios: "more uniform refraction and improved contrast". The keynote adds "a more uniform toolbar across the top of apps". MacRumors adds that the toolbar can be tuned through the existing scroll-edge-effect APIs [V for Apple quotes; S for the API tuning claim] | https://developer.apple.com/videos/play/meet-with-apple/277 , https://www.apple.com/os/ios/ , https://www.youtube.com/watch?v=hF8swzNR1-o , https://www.macrumors.com/2026/06/10/how-liquid-glass-is-changing-in-ios-27 |
| 2026-06 | SwiftUI (iOS 27): "Liquid Glass is now mandatory", per a practitioner summary of "What's new in SwiftUI" [S] | https://useyourloaf.com/blog/wwdc-2026-viewing-guide |
| iOS 27 SDK | The `UIDesignRequiresCompatibility` opt-out stops working: "The system ignores this key when you build for iOS 27 or later…" [V, from the doc snippet] | https://developer.apple.com/documentation/bundleresources/information-property-list/uidesignrequirescompatibility |

Not verified:

- The "darkened edge" and "diffuses" claims are now confirmed by Apple's own WWDC26 recap transcript (meet-with-apple/277). I still have not read a dedicated WWDC26 Liquid Glass design session, and I did not find one in the WWDC26 video listing.
- I did not check whether a developer API exposes the user's position on the iOS 27 slider. As far as I found, Apple exposes no such API (absence only, not confirmed).
- I did not confirm whether WWDC26 sessions changed the regular/clear rules.

---

## 2. Material principles

### 2.1 Lensing, not scattering
- "The primary way Liquid Glass visually defines itself is through something called Lensing." [V, session 219]
- "Where as previous materials scattered light, this new set of materials dynamically bends, shapes, and concentrates light in real time." [V, 219]
- Edges carry the identity of the material: light bends at the rim, while the center stays mostly clear. The SwiftUI doc still describes it as a material that "blurs content behind it, reflects color and light of surrounding content, and reacts to touch and pointer interactions in real time". So blur is present, but it is no longer the defining trait. [V] https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views
- Appearing and disappearing modulate the optics, not opacity: objects "materialize in and out by gradually modulating the light bending and lensing". [V, 219] SwiftUI's `materialize` transition exists for this, and Apple notes that "The system applies more than opacity changes with the available transition types." [V]
- **[I]** In AuraGlass, a glass surface would be modeled as **edge refraction + adaptive tint + specular rim**, not as `backdrop-filter: blur(Npx)` plus alpha. Enter and exit would animate the refraction strength and blur radius, not `opacity` alone.

### 2.2 Adaptive by default
- "unlike previous materials that had a fixed light or dark appearance, each layer continuously adapts based on what's behind it." [V, 219]
- "The amount of tint and the dynamic range shift to always ensure buttons remain legible, while letting as much of the content through as possible." [V, 219]
- Glass has "no inherent color, and instead takes on colors from the content directly behind it." [V, HIG Color] https://developer.apple.com/design/human-interface-guidelines/color
- Small elements such as toolbars and tab bars flip between light and dark with the content underneath. Their symbols and text are monochrome, "becoming darker when the underlying content is light, and lighter when it's dark." [V, HIG Color]
- Large elements such as menus and sidebars "don't flip from light to dark. Their surface area is too big and transitions like these would be distracting." They appear "more opaque … to preserve legibility". [V, 219 + HIG Color]
- Shadows adapt too: the shadow gets more opaque over text and less opaque over solid light backgrounds. [V, 219]
- **[I]** This is the biggest gap a web library has to close. Browsers do not expose the luminance of backdrop pixels to JavaScript. AuraGlass would need either (a) declared hints about the background (`data-backdrop="light|dark|media"`, or a context provider), (b) sampling of known content such as images or canvases the app owns, or (c) a conservative static default that is legible over anything. Small and large surfaces need different adaptation policies.

### 2.3 Thickness scales with size
- On larger elements, "its material characteristics change to simulate a thicker, more substantial material. It casts deeper, richer shadows, has more pronounced lensing and refraction effects, and a softer scattering of light." [V, 219]
- **[I]** Derive a `thickness` from the element's size class, or let the caller set it, and drive refraction depth, shadow depth and opacity floor from it. Avoid one global preset.

### 2.4 Light and specular highlights
- "Light sources inside of this environment shine on the material producing highlights that respond to geometry"; and "the lighting responds to device motion." [V, 219]
- Interaction gives feedback: "the material illuminates from within"; the glow "spreads to nearby glass elements". SwiftUI exposes this as `Glass.interactive()`. [V, 219, plus Glass docs https://developer.apple.com/documentation/swiftui/glass]
- iOS 27 brightened the specular highlights and added a darkened edge. [V, Apple WWDC26 recap https://developer.apple.com/videos/play/meet-with-apple/277]
- The counterweight: iOS 26.4 added **Reduce Bright Effects**, which "minimizes highlighting and flashing when interacting with onscreen elements". [S, quoting Apple] So the interaction glow has its own user opt-out, separate from Reduce Motion.
- **[I]** On the web, "device motion" maps to pointer position or `DeviceOrientationEvent`, which needs permission on iOS Safari. Both must be optional, throttled, and turned off under `prefers-reduced-motion`. The highlight follows geometry (a rim light based on the edge normal), not a gradient pasted over the element.

### 2.5 Layering rules (the core of the system)
- **Glass is the navigation and control layer only.** "Don't use Liquid Glass in the content layer." Content uses standard materials. The exception is a transient control in content, such as a slider or toggle knob, which turns into glass *only while being manipulated*. [V, HIG Materials] https://developer.apple.com/design/human-interface-guidelines/materials
- "You may be tempted to use Liquid Glass everywhere but it is best reserved for the navigation layer that floats above the content of your app." Making a table view glass "would make it compete with other elements and muddy the hierarchy." [V, 219]
- **No glass on glass:** "always avoid glass on glass". Elements on top of glass should use "fills, transparency, and vibrancy … a thin overlay that is part of the material." [V, 219]
- **Use it sparingly:** "Limit these effects to the most important functional elements in your app." [V, Adopting Liquid Glass] https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass
- **Apply glass to the control, not to its parts:** "apply the material directly to the control, not its inner views." [V, 356]
- **Separation at rest:** "avoid intersections between content and glass. Instead, reposition or scale the content to maintain separation." [V, 219] The resting state, such as the top of a scroll view, must be legible. [V, HIG Color]
- **Hierarchy comes from layout and grouping, not decoration:** remove custom bar backgrounds and borders; grouped items share one glass background; don't mix icons and text in a shared group. [V, 356 + Adopting]
- **[I]** This calls for an API that enforces layers: `GlassLayerProvider` context, a dev-mode warning when a glass surface renders inside another glass surface, and separate component families for "navigation glass" and "content material". This is a policy change for a library whose current catalog applies glass to cards, tables and content.

### 2.6 Two variants, never mixed
- Regular is "the most versatile. It works in any size, over any content and anything can be placed on top of it." It "blurs and adjusts the luminosity of background content." Use it when there is "a significant amount of text, such as alerts, sidebars, or popovers." [V, 219 + HIG Materials]
- Clear "does not have adaptive behaviors. It is permanently more transparent." It is allowed only when **all three** hold: it sits over media-rich content, the content layer tolerates a dimming layer, and the content above it is bold and bright. [V, 219]
- Dimming rule: "If the underlying content is bright, consider adding a dark dimming layer of **35% opacity**." No dimming is needed over dark content or AVKit controls, which bring their own. [V, HIG Materials]
- The SwiftUI `Glass.clear` doc gives a different number in its example: "ensure content remains legible by adding a dimming layer or other treatment beneath the glass", with `.background(.black.opacity(0.3))`. [V] https://developer.apple.com/documentation/swiftui/glass/clear So the HIG says 35% and the code sample says 30%. Treat the value as roughly 0.3 to 0.35, not exact.
- "They should never be mixed." [V, 219]
- There is also an `identity` variant: no effect at all, for conditional toggling. [V, Glass docs]
- **[I]** Ship exactly `regular | clear | identity` as a typed union, not a free-form preset zoo. `clear` should require or auto-insert a dimming scrim, defaulting to `rgba(0,0,0,0.35)` when the backdrop is declared bright.

### 2.7 Tint is stained glass, not paint
- A tint "generates a range of tones that are mapped to content brightness underneath the tinted element." A solid fill "is completely opaque and breaks the visual character of Liquid Glass." [V, 219]
- "Tinting should only be used to bring emphasis to primary elements and actions"; "When every element is tinted, nothing stands out." "If you want to imbue color into your app, do it in the content layer instead." [V, 219]
- To emphasize primary actions, "apply color to the background rather than to symbols or text"; "Refrain from adding color to the background of multiple controls." [V, HIG Color]
- Custom colors need light and dark variants, each with an increased-contrast version. [V, HIG Color + Adopting]
- **[I]** Implement tint as a luminance-mapped blend, for example `mix-blend-mode`/`color` or an `feColorMatrix` on the backdrop, not as `background: rgba(brand, .6)`. Provide a single `prominent` tone. Dev mode could warn when more than N tinted glass controls are visible.

### 2.8 Concentricity (shape system)
- "By aligning radii and margins around a shared center, shapes can comfortably nest within each other." There are three shape types: **fixed** (constant radius), **capsule** (radius = height / 2), and **concentric** (radius = parent radius − padding). Components used both nested and standalone get a "concentric shape with a fallback radius." [V, 356]
- The curvature of the hardware drives the radii of nested elements. Avoid corners that look "too pinched— or flared." [V, 356 + Adopting]
- In SwiftUI the default glass shape is a capsule (`DefaultGlassEffectShape`). [V]
- **[I]** This maps directly to CSS: `--ag-radius-inner: max(0px, calc(var(--ag-radius-outer) - var(--ag-padding)))` exposed through a `ConcentricProvider`, with `shape="fixed|capsule|concentric"` and `fallbackRadius`. Cheap to build and high value. It also benefits from `corner-shape: squircle` where Chromium supports it (support not verified here).

### 2.9 Scroll edge effects replace dividers
- They replace "hard dividers with subtle blur". They are "not decorative. They don't block or darken like overlays." Use them only where floating UI overlaps scrolling content. Use one per view; "avoid mixing or stacking them." [V, 356]
- There are two styles. **Soft** ("gently dissolves the content into the background"; switches to subtle dimming over dark content) is the default on iOS. **Hard** (uniform across the bar plus the pinned accessory) is for macOS, pinned headers, and interactive text. [V, 219 + 356]
- iOS 27 strengthened this into a "uniform toolbar" behind floating bars. [S, MacRumors]
- **[I]** Implement as a `ScrollEdgeEffect` with `soft|hard`, using a `mask-image` gradient on a backdrop-blurred strip, plus a dim fallback. Make it automatic in AuraGlass navbar and toolbar components.

### 2.10 Morphing and grouping
- `GlassEffectContainer(spacing:)` renders sibling glass shapes together. The larger the spacing, "the sooner the Liquid Glass effects behind views blend together". `glassEffectUnion` merges shapes at rest. `glassEffectID` plus a namespace drives morph transitions (`matchedGeometry` within the spacing, `materialize` beyond it). [V] https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views
- Performance: "Creating too many Liquid Glass effect containers and applying too many effects to views outside of containers can degrade performance. Limit the use of Liquid Glass effects onscreen at the same time." [V]
- Menus and action sheets spring from their source control instead of the screen edge. Controls morph between contexts so there is "a singular floating plane". [V, 219 + 356 + Adopting]
- **[I]** On the web, a `GlassGroup` should render **one shared backdrop layer**, a single `backdrop-filter`, for all its children. Children would be cut out with an SVG/CSS mask or a metaball-style goo filter, instead of N independent `backdrop-filter`s. This both raises performance and enables blending. Morphing can use the View Transitions API (`view-transition-name`) or FLIP.

### 2.11 Focus and state
- Half sheets inset from the edges let content peek through. Expanded to full height, they become "more opaque to help maintain focus on the task." [V, Adopting]
- A modal uses glass plus a dimming layer, while a parallel task uses glass alone. [V, 356]
- When a window loses focus, the glass "visually recedes". [V, 219]
- **[I]** Opacity is a *state* variable, tied to modality, expansion and focus, not a fixed style constant.

---

## 3. Accessibility contract

Under system settings, Apple adapts glass automatically [V, 219]:

| Setting | Apple behavior | Web equivalent [I] |
|---|---|---|
| Reduce Transparency | "makes Liquid Glass frostier and obscures more of the content behind it" | `@media (prefers-reduced-transparency: reduce)`: higher opacity floor, stronger blur, no refraction. Browser support is partial; offer a JS/user override |
| Increase Contrast | "elements predominantly black or white and highlights them with a contrasting border" | `@media (prefers-contrast: more)` and `(forced-colors: active)`: near-opaque black/white surface plus a 1px+ contrasting border |
| Reduce Motion | "decreases the intensity of some effects and disables any elastic properties" | `@media (prefers-reduced-motion: reduce)`: no elastic springs, no pointer-tracked highlights, crossfades instead of morphs. The HIG also says to avoid "animating into and out of blurs" |
| Reduce Bright Effects (26.4) | "minimizes highlighting and flashing when interacting with onscreen elements" [S, quoting Apple] | No media query exists. Add a separate `reduceHighlights` preference that disables press glows and specular sweeps, independent of reduced motion |
| User preference, 26.1 "Tinted", 26.2 clock slider, 27 slider | Opacity dial chosen by the user, from clear to fully tinted. Apps that adopted glass get it "right away" | A first-class **`glassOpacity` (0 to 1) user preference** in the AuraGlass provider, persisted and exposed to end users. Components must read it rather than hard-coding alpha |

Other requirements:

- Apple's Adopting guide tells developers to test custom elements under "different configurations of these settings". [V]
- Every icon-only control needs an accessibility label. [V, Adopting]
- 356 adds: "Elements using Liquid Glass require clear separation from content to maintain legibility." [V]

Reduce-motion source: https://developer.apple.com/design/human-interface-guidelines/accessibility [V]

---

## 4. Criticism and the readability debate

- NN/g (2025-10-10) [V, https://www.nngroup.com/articles/liquid-glass/]:
  - "Text on top of images is a bad idea."
  - Cases of "text on top of text" in Mail.
  - Controls that appear, disappear and change shape (Safari, Health).
  - "Motion for motion's sake is not usability."
  - Tap targets shrank below its 1 cm × 1 cm guideline with 0.4 cm spacing.
  - Verdict: "prioritizing spectacle over usability".
  - Caveat: this is an expert critique, not a controlled study.
- Apple's own course corrections show that the criticism landed [V/S]:
  - Opacity was raised during the betas [S].
  - A Tinted option arrived in 26.1 [S, quoting Apple notes].
  - iOS 27 replaced the toggle with a slider [V].
  - iOS 26.2 adds a transparency slider for the Lock Screen clock [S].
  - iOS 26.4 adds Reduce Bright Effects [S].
  - iOS 27 adds a darker edge, stronger diffusion and a uniform top toolbar [V, Apple WWDC26 recap].
  - macOS 27 restores a "more uniform toolbar" and edge-to-edge sidebars [V].
- Inference [I]:
  - The default that ships matters less than the existence of a dial controlled by the user.
  - Apple moved toward **more separation (edges, diffusion, opacity), not more transparency**.
  - A 2026 library that defaults to maximum clarity and refraction is building against the direction Apple is now taking.

---

## 5. Web feasibility (relevant to AuraGlass)

- True refraction on the web means SVG `feDisplacementMap` used through `backdrop-filter: url(#filter)`. **That works only in Chromium.** WebKit Bug 245510: SVG filters in `backdrop-filter` don't work in Safari. [S, https://kube.io/blog/liquid-glass-css-svg ; https://github.com/w3c/svgwg/issues/1142, opened 2026-06-25, still open with no vendor response as of the access date]
- kube.io's model [S]:
  - Snell's law with n ≈ 1.5.
  - A convex "squircle" bezel profile `y = (1-(1-x)^4)^(1/4)`.
  - Displacement magnitudes from 127 ray samples along the radius, encoded in R/G channels around 128.
  - Max displacement capped at about ±128 px by 8-bit channels.
  - A separate rim-light specular composited with `feBlend`.
  - Animating `scale` is cheap; changes to shape or size force a rebuild of the map.
- **[I]** AuraGlass 5 needs a tiered renderer, chosen by feature detection and tied to the element's size class:
  1. Chromium: refraction plus specular through an SVG backdrop filter.
  2. Safari and Firefox: blur, saturation and luminance plus a CSS rim-light and inner shadow, with no displacement.
  3. Reduced transparency, increased contrast, or a low-power device: frosted or near-opaque surface.

  Displacement maps must be cached per shape and size, and rebuilt only when the size class changes, not on every resize. This tiering is an inference; I did not benchmark it.

---

## 6. What not to copy

Liquid Glass is a *system-level* material. Apple sees the composited backdrop, knows its luminance, and uses device lighting. Copying the visuals (blobby capsules, heavy distortion, rainbow rims) without the adaptive legibility logic produces exactly the failures NN/g documented. The things worth porting are the **rules**:

- Layer separation
- No glass on glass
- Variant discipline
- 35% dimming for clear glass
- Tint mapped to luminance and used sparingly
- Concentric radii
- Scroll edge effects
- Opacity tied to state
- Grouped rendering
- A full accessibility fallback contract

---

## 7. Gaps and unverified items

- No dedicated WWDC26 Liquid Glass design session was reviewed. iOS 27 material changes come from the Apple WWDC26 recap transcript, apple.com/os/ios and the keynote [V], plus MacRumors [S].
- Reduce Bright Effects is documented here only through press quoting Apple. I did not find an Apple support page for it.
- The 26.2 Lock Screen slider rests on press and forum sources only.
- Earlier-pass items not re-checked in this pass: the 2026 newsroom URL in section 1, WebKit bug 245510, and svgwg issue 1142.
- The HIG "Liquid Glass" component pages and the HIG Motion page were not separately fetched. Materials, Color and Accessibility were fetched.
- I did not verify current browser support for `prefers-reduced-transparency` or CSS `corner-shape`.
- I did not verify NN/g's statement that "Apple has reduced the transparency" in specific betas against Apple release notes.
- The macOS 26.1 Tinted option appears to have a subtle effect according to TidBITS commenters [S]. I did not check this myself.
