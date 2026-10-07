# AuraGlass 5.0 — Media & Backdrops PRD

| Field | Value |
|---|---|
| Key | **MED** (SC-01 crosswalk in `prd/_shared-contracts.md`; task ids `MED-NNN` in `tasks/MED.json`) |
| PRD id | Self-id alias **PRD-14** (program-assigned). Architecture anchor: §16 row **PRD-13** (`PRD-13-media-backdrops.md`: flagships 43–44, `./media`, `./backdrops`, library-owned luminance sampling). See "ID note" |
| Owner area | Media & backdrops. Owns `src/media/**` (NEW), `src/backdrops/**` (NEW), the `./media`, `./media.css`, `./backdrops`, `./backdrops.css` entries, the media/backdrop registry items, the owned-pixel luminance sampler, and the **clear-over-media** certification scene |
| Status | Draft |
| Target releases | 4.1.1 (`isStorybookDataMedia` cut, §13.1, C-I; **built by TRUST** REQ-TRUST-17 / TRUST-025, consumed here, SC-36), 4.2 (C-D warnings on every absorbed 4.x media/backdrop name), 4.3 (codemod mapping final), 5.0.0-beta (flagships 43–44 + `Backdrop`), 5.0.0-rc.1 (API freeze), 5.1 (`Waveform`, registry item `media-transcript`; C-E, SC-12/SC-38) |
| Source docs | `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (§2, §3 package map rows `./media` `./backdrops`, §3.6, §4.1 item 1, §4.5–4.7, §7, §8, §9, §11.2 #43–44, §11.3, §12, §13.3–13.4, §14, §15, §16); `AURAGLASS_CURRENT_STATE_AUTOPSY.md`; `AURAGLASS_COMPETITIVE_GAP_ANALYSIS.md` (P3, P6, P16, §4.2); `AURAGLASS_MISSING_CAPABILITY_MAP.md` (§Media, rows Waveform/Scrubber); `autopsy/material-engine.md` (MATERIAL-ENGINE-08); `autopsy/storybook-showcase.md` (STORYBOOK-SHOWCASE-02/-06); `autopsy/motion.md`; `autopsy/performance.md` (PERFORMANCE-08); `autopsy/visual-quality.md`; `autopsy/runtime-remote.md`; `component-inventory.json`; `research/translucent-a11y-perf.md`; `research/apple-liquid-glass.md`; `research/web-glass-techniques.md`; `prd/AURAGLASS_MATERIAL_ENGINE_PRD.md` (REQ-MAT-09 hands owned-pixel sampling to this PRD) |
| Related decisions | D-02, D-04, D-05, D-06, D-08, D-09, D-11, D-12, D-13, D-14, D-15, D-16, D-18, D-24, D-25, D-26, D-27, D-29, D-32 |
| Requirement prefix | `REQ-MED-NN`; acceptance criteria `AC-MED-NN` |

**ID note (resolved by SC-01).** The orchestrator assigned self-id PRD-14 and file name `AURAGLASS_MEDIA_BACKDROPS_PRD.md`; architecture §16 calls this boundary **PRD-13**. The SC-01 crosswalk in `prd/_shared-contracts.md` (owner REL) fixes the key **MED** and maps self-id PRD-14 → §16 PRD-13; the self-id is an alias only. Inside this document, other PRDs are cited by **§16 number plus SC-01 key**: PRD-00 (TRUST), PRD-01 (REL), PRD-02 (PKG), PRD-03 (DS), PRD-04 (MAT), PRD-05 (A11Y), PRD-06 (MOT), PRD-07/14/16 (FND: foundation, T2 core and removal), PRD-08 (CTL), PRD-09 (OVL), PRD-15 (enhanced tier, interim owner MAT, SC-37), PRD-17 (4.2/4.3 bridge, interim owner REL, SC-37), PRD-18/20 (DX), PRD-19 (QA certification infra; SB for Storybook/Lab), PRD-21 (labs, interim owner EXP, SC-37), and the performance policy PRD (PERF, no §16 row). "PRD-CORE" in earlier drafts is FND (§16 PRD-14).

**Scope additions beyond the §3 package-map row (explicit deviation, all C-E, subpath-only, no root exports so D-15 is unaffected; accepted as architecture errata E-04, SC-12).** §3 lists `./media` as `MediaControls`, `NowPlayingBar`, `ImageViewer`, `CarouselRail`, `useMediaElement`. The task scope and `AURAGLASS_MISSING_CAPABILITY_MAP.md` §Media require more public names: `MediaScrubber` (also exposed as `MediaControls.Scrubber`) and `formatMediaTime` ship in 5.0 (E-04); `Waveform` ships in **5.1** (C-E, SC-12/SC-38, following architecture §3.2 and EXP X-42), so `aura-glass/media` exports **7** values at 5.0.0. Gallery behaviour is delivered as `ImageViewer` with an `items` collection (the lightbox) plus a documented registry item (`media-gallery`), not as a separate `Gallery` export. `CompareSlider` (inventory target for `GlassWipeSlider`) is **deferred to 5.1** (C-E) and is out of 5.0 scope here.

**Reconciliation with sibling PRDs (explicit; this PRD is the §16 PRD-13 owner of `./media` and `./backdrops` content; shared contracts follow `prd/_shared-contracts.md`, and remaining cross-PRD items are tracked in §21).**
- `AURAGLASS_COMPONENT_EXPANSION_PRD.md` X-37..X-41 now cite REQ-MED ids (scrubber `chapters`, `items` keyed by `id`, no `GlassGallery` compat, Captions `showing`/`disabled`). X-42 still says `Waveform` 5.0 and must move to 5.1 per SC-12 (EXP fix, §21). X-43 (`media-transcript`, 5.1) is owned here as REQ-MED-95, adopting the REQ-EXP-30 contract.
- `GlassVoiceWaveform`/`GlassMusicVisualizer` carry "no successor until 5.1 (`Waveform`)" in `deprecations.json` at 4.2; the entry's `replacement` is updated when 5.1 ships.
- SC-32 (owner DX): exactly 10 GA `registry:block`s; `media-viewer` is the media one. DX scaffolds and registers it (DX-075, `registry/registry.json` DX-067); **this PRD owns its content**. The media recipes this PRD defines (§8) are `registry:item`s under `registry/items/<id>/`.
- SC-28 (owner QA): scene assets live in `certification/scenes/` (ids `photo`, `saturated-abstract`, `dense-text`, `dark-media`, `flat-white`, `flat-black`, `hf-pattern`, `video-frame` + `video-frame.webm` 2 s loop), mounted at `/scenes`; SC-31 (owner SB): the story decorator is `StoryEnvironment` + `StoryRoot` in `.storybook/preview.tsx` (SB-048); showcases `showcase/music-player/` and `showcase/media-workspace/` are SB files (SB-113, SB-110) with compositions supplied by this PRD. Adopted throughout.
- SC-21 / SC-19 (owners MAT / DS, MOT): `data-ag-media-root`, `data-ag-media-tone`, `data-ag-backdrop-preset` and `data-ag-palette` are ratified attributes; `data-ag-offscreen` is owned by the MOT ticker observer (MOT-040), not PRD-05; `--ag-duration-ambient` (MOT row) and `--ag-scrim-media` (DS row) are accepted additions. The continuous-motion attribute is `data-ag-continuous="on"` (set only when `allowContinuous` is true **and** resolved motion is `full`); REQ-MOT-T08 must also admit `ag-backdrop-drift` (MOT contract item, §21).

**Scope boundary.**
- Owned: flagship **43** `MediaControls` / `NowPlayingBar` (+ `ImageViewer` chrome), flagship **44** `CarouselRail`, the headless `useMediaElement` hook, `MediaScrubber`, `Waveform` (5.1), `ImageViewer`, the `Backdrop` component and its five presets (`aurora`, `mesh`, `photo`, `video`, `grain`), the owned-pixel luminance sampler, the `data-ag-media-tone` attribute it writes, the content of the `media-viewer` registry block (SC-32), the `media-backdrops` codemod transform and fixtures (SC-33), the media/backdrop compat adapters' prop tables (SC-34), and the `music-player` / `media-workspace` showcase compositions (SC-31).
- Consumed, not owned: `Surface`, `SurfaceGroup`, `Environment`, the `clear` scrim rule (D-12), the solved `media` floors and the `data-ag-*` attribute registry (MAT, PRD-04; SC-21/SC-22); `usePreference`, `AuraGlassProvider`, portal root, announcer and `LayerStack` (the only Escape dispatcher) (A11Y, PRD-05; SC-23/SC-25); motion tokens, `allowContinuous`, the ticker and its `data-ag-offscreen` observer (MOT, PRD-06; DS owns the token file, SC-18); Base UI wrapping pattern, `data-ag-part` contract and `<Component>.meta.ts` registry, React 19 ref pattern, `usePortalContainer()` (FND, PRD-07; SC-24/SC-25/SC-27); the `Dialog` shell and `.ag-scrim` (OVL, PRD-09); enhanced-tier lens maps (PRD-15, interim MAT, SC-37); scenes, lanes, workflows, pixel gates and engine lanes (QA, PRD-19; SC-28/SC-29); exports manifest, size-budget file and gates (PKG, PRD-02; SC-12/SC-15); `deprecations.json`, API reports, visual-class gate and codemod id catalogue (REL, PRD-01; SC-02..04/SC-09/SC-33); the 4.1.1 `isStorybookDataMedia` fix (TRUST, PRD-00; SC-36).
- Not owned: `Environment image|video` stays PRD-04 and performs **no** sampling (REQ-MAT-09). Particle fields go to `@auraglass/labs` (§13.4, PRD-21, interim owner EXP). Sound (`GlassSpatialAudio`, `soundDesign`) is deleted or labs (§13.3). Audio *analysis* (FFT) is not shipped: `Waveform` renders consumer-supplied peaks.

---

## 1. Problem

AuraGlass 4.1.0 has about 30 media and backdrop names spread across `src/components/media/`, `interactive/`, `image-list/`, `image/`, `social/`, `data-display/`, `marketing/`, `backgrounds/`, `advanced/`, `atmospheric/`, `immersive/` and `effects/`. The library's own thesis is "glass over real content", yet the media family is mostly simulation and the backdrop family is mostly decorative loops:

1. **There is no honest player core.** `GlassAdvancedAudioPlayer` (1,163 lines, score 2.5) ships a deterministic mock waveform, mock transcripts, a playlist that does not change tracks and a play/pause that cannot pause without hidden provider registration. `GlassMediaProvider` (795 lines, 1.5, REPLACE) provides mock transcription. Two video players exist (`interactive/GlassVideoPlayer.tsx` 621 lines, `media/GlassAdvancedVideoPlayer.tsx` 1,314 lines) with dead PiP/settings and a `div` seek bar. Only `LiquidGlassMediaControls` (145 lines, 5.5) and `LiquidGlassNowPlayingBar` (99 lines, 5.5) are honest, and they are the smallest files.
2. **A Storybook workaround reaches production.** `isStorybookDataMedia` (`GlassAdvancedVideoPlayer.tsx:82`, used at `:986`) forces any consumer `data:video/` source into poster mode. Architecture §13.1 cuts it in 4.1.1.
3. **Page-wide keyboard hijacks.** `GlassVideoPlayer.tsx:271` (`document.addEventListener("keydown")`), `GlassImageViewer.tsx:343` and `GlassCarousel.tsx:388` (`window.addEventListener("keydown")`) take Space/arrow keys from every form on the page.
4. **Waveforms and scrubbers are fake or basic.** `GlassVoiceWaveform` is `sin` plus `Math.random` jitter with a random "speaking" state (`GlassVoiceWaveform.tsx:120-147`). The only real scrubber is a native `type="range"` labelled "Seek" (`LiquidGlassMediaControls.tsx:110-117`) with no buffered range, chapters, hover time or `aria-valuetext`.
5. **Image viewing is split and broken.** `GlassImageViewer` (764 lines, 4.5) has the right features but hijacks the page keyboard and has no Dialog semantics. `GlassGallery` (672 lines, 3.5) has fake masonry, no-op Like/Share and a lightbox that opens the wrong image after filtering. `GlassLazyImage` zoom is a stub. `GlassCarousel` (1,022 lines, REPLACE) is not an APG carousel; its generated Default story renders 1.7% of the frame (STORYBOOK-SHOWCASE-06).
6. **The library cannot see what is behind its glass, and pretends it can.** `LiquidGlassBackdropSampler` / `useLiquidGlassBackdrop` sample DOM colours via `elementsFromPoint` + `getComputedStyle` at 9 points and read transparent wrappers as black (MATERIAL-ENGINE-08, CONFIRMED). `sampleBackdropLuminance` returns `0.5`. No pixel of an image or video is ever measured, so `clear` over media has no real legibility signal.
7. **Backdrops are duplicated, random and expensive.** At least eight ambient-background implementations exist (`AuroraBackground`, `AuroraOrb`, `AtmosphericBackground`, `GlassDynamicAtmosphere`, `ParticleBackground`, `GlassMeshGradient`, `GlassParticles`, `GlassParticleField`, plus REMOVE-class `AuroraPro`, `GlassAuroraDisplay`, `GlassNebulaClouds`, `SeasonalParticles`). They use `Math.random` (`GlassMeshGradient.tsx:120-125`, `GlassParticles.tsx:127-134`, `ParticleBackground.tsx:143-148`), per-frame canvas loops (`ParticleBackground.tsx:263`), a `blur(100px)` filter on a per-frame canvas (GlassMeshGradient, inventory) and 15–32 s ambient keyframe loops (motion autopsy). `AuroraPro` renders a grey fallback card under React 18, so its story is pixel-identical to two unrelated effects (visual-quality §6).
8. **Glass is never shown over media.** 351/356 certification screenshots have mean luminance >200, 0 stories set `previewSurface: 'media'`, and the "media" surface is itself a near-white gradient (`.storybook/StorySurface.tsx:44-49`; STORYBOOK-SHOWCASE-02, CONFIRMED).

The result: architecture §11.2 makes flagship 43 "**the canonical `clear`-over-media demonstration**", and nothing in 4.1.0 can be that demonstration. 5.0 needs one headless media core, glass controls that are certified over real photo and video, a library-owned luminance signal that is honest about what it can measure, and a minimal set of backdrops that give glass real pixels to refract without burning frames.

---

## 2. Evidence from the current codebase

All line references are against HEAD `15b6de6f7` (4.1.0). Verdicts are the autopsy's adversarial-verification verdicts; REFUTED or narrowed findings are honoured as narrowed.

### 2.1 Media

| # | Evidence | Location | Finding / verdict | Consequence for 5.0 |
|---|---|---|---|---|
| E-01 | `LiquidGlassMediaControls`: controlled (`playing`, `currentTime`, `duration`), native `<input type="range">` for seek (`aria-label="Seek"`) and volume (`aria-label="Volume"`), `variant` defaults to `"clear"`, inline `createGlassStyle` button and range styles with `#64748b` track | `src/components/media/LiquidGlassMediaControls.tsx:4,17,22-45,76,104-118,128-136` | inventory 5.5 POLISH: "the only honest media component"; missing `aria-valuetext`, tokenised track, icons | Seed of flagship 43. Keep controlled API shape; replace ranges with Base UI Slider; delete inline optics (REQ-MED-20..27) |
| E-02 | `LiquidGlassNowPlayingBar`: text-word buttons, progress as a styled `div` width (`style={{ width: … progress * 100 }}`), no `role="progressbar"`, no `aria-expanded` on expand | `src/components/media/LiquidGlassNowPlayingBar.tsx:14,43,56-95` (progress at `:79-84`) | inventory 5.5 POLISH | Flagship 43 part. Progressbar semantics, icon glyphs, prev/next slots (REQ-MED-30..34) |
| E-03 | `isStorybookDataMedia` forces consumer `data:video/` sources to poster mode | `src/components/media/GlassAdvancedVideoPlayer.tsx:82-83,985-986` | capability map; architecture §13.1 | Cut in 4.1.1 (C-I); no successor needs it (REQ-MED-90) |
| E-04 | Mock waveform, mock transcript, playlist that does not change tracks, play/pause requires hidden provider, RegExp crash on search | `src/components/media/GlassAdvancedAudioPlayer.tsx:577,774-786,830-844,874-880` | inventory 2.5 REDESIGN → "LiquidGlassMediaControls + headless useMediaElement hook" | Replaced by composition of `useMediaElement` + `MediaControls` (no successor component) |
| E-05 | Mock transcription, built-in "AI" | `src/components/media/GlassMediaProvider.tsx` (795 lines) | inventory 1.5 REPLACE → "headless useMediaElement(ref) hook + optional lightweight MediaSession context; no built-in AI" | `useMediaElement` + `useMediaSession` option (REQ-MED-10..18) |
| E-06 | Document-level `keydown` listener; `div` seek bar; non-interactive volume; dead PiP/settings | `src/components/interactive/GlassVideoPlayer.tsx:235-282` (listener at `:271`), `:524-534`, `:572-577` | inventory 3 CONSOLIDATE | Shortcuts scoped to the focused player root (REQ-MED-26) |
| E-07 | `window` `keydown` hijack; passive-wheel `preventDefault`; dead unprefixed layout classes | `src/components/interactive/GlassImageViewer.tsx:290-299,302-357` (listener `:343`), `:391,439-463,516` | inventory 4.5 POLISH | `ImageViewer` on overlays `Dialog`, pointer events, scoped keys (REQ-MED-40..49) |
| E-08 | Lightbox only inside gallery via `enableLightbox`; opens the wrong image after filtering; fake masonry; no-op Like/Share | `src/components/interactive/GlassGallery.tsx:65,122,124,129-148,342-358,386-400,494-551` | capability map; inventory 3.5 REDESIGN | `ImageViewer items` keyed by stable `id`, not array index (REQ-MED-43) |
| E-09 | Zoom is a stub; hover-only unlabelled action menu; never renders `<img>` during SSR | `src/components/interactive/GlassLazyImage.tsx:136-168,195-199,260-272,340-341,378-436` | inventory 3.5 REDESIGN → `GlassImage` | Architecture §11–12 name no `Image` component, so none is added (D-15). `GlassLazyImage` is C-D with guidance "native `<img loading="lazy" decoding="async">`"; zoom lives in `ImageViewer` only. If PRD-CORE adds an `Image`, `ImageViewer` adopts it (C-I) |
| E-10 | `sin` + `Math.random` jitter waveform with random "speaking" state | `src/components/social/GlassVoiceWaveform.tsx:120-147` | capability map row "Waveform: Fake"; inventory REDESIGN → "GlassWaveform primitive fed by a real level/AnalyserNode prop" | `Waveform` renders consumer `peaks` / `level` only (REQ-MED-35..39) |
| E-11 | Native range scrubber only; no buffered, chapters, hover time, frame step | `LiquidGlassMediaControls.tsx:110-117` | capability map row "Scrubber: Basic" (P2) | `MediaScrubber` (REQ-MED-23..25) |
| E-12 | `GlassCarousel` not APG; global key listener; `ConsciousnessFeatures` mixin on Carousel; generated Default story at 1.7% frame | `src/components/interactive/GlassCarousel.tsx:388`; `interactive/GlassCarousel.stories.tsx:31-48` | inventory REPLACE; API-CONSISTENCY §3 item 3; STORYBOOK-SHOWCASE-06 CONFIRMED | Replaced by flagship 44 `CarouselRail` |
| E-13 | `LiquidGlassCarouselRail` sets an inline `backdropFilter: "blur(16px) saturate(1.4) brightness(1.05) contrast(1.04)"`; prev/next buttons labelled "Scroll left/right" | `src/components/data-display/LiquidGlassCarouselRail.tsx:17,74,83` | inventory POLISH; material-engine table "set inline `backdropFilter:` directly" (11 files) | Seed of flagship 44; inline optics are forbidden by the PRD-04 lint (REQ-MED-55) |
| E-14 | Photo inspector is a 48-line wrapper | `src/components/media/LiquidGlassPhotoInspector.tsx` | inventory CONSOLIDATE → inspector-panel recipe | `ImageViewer.Inspector` slot + registry item (REQ-MED-48) |
| E-15 | Media exports from root, plus alias `GlassMediaControls` | `src/index.ts:721-730` | API-CONSISTENCY alias groups (10) | Moved to `./media`; alias via `aura-glass/compat` only |
| E-16 | 43 colour literals in one player | `media/GlassAdvancedVideoPlayer.tsx` | tokens-theme autopsy, worst-offender list | `src/media/**` literal-free (REQ-MED-80) |

### 2.2 Luminance sampling

| # | Evidence | Location | Finding / verdict | Consequence |
|---|---|---|---|---|
| E-20 | DOM colour sniffer at 9 fixed points via `elementsFromPoint` + `getComputedStyle().backgroundColor`; cannot see gradients, images, video, canvas or text | `src/hooks/useLiquidGlassBackdrop.ts:62-115` (grid at `:88-99`) | material-engine §"backdrop sampler is a DOM colour sniffer" | DOM-behind sampling forbidden (architecture §4.1 item 1) |
| E-21 | `rgba(0,0,0,0)` accepted, `luminanceFor` ignores alpha, average ignores `a` → transparent wrappers read as black | `useLiquidGlassBackdrop.ts:35-60,80-86,134-145` | **MATERIAL-ENGINE-08 CONFIRMED** | The 5.0 sampler never reads DOM; it reads pixels of an element it rendered or was handed |
| E-22 | Always-on scroll listener, `ResizeObserver`, subtree `MutationObserver` re-sampling | `useLiquidGlassBackdrop.ts:202-235` | PERFORMANCE-04 CONFIRMED | Sample **once per source**, never on scroll/resize/mutation (REQ-MED-63) |
| E-23 | `sampleBackdropLuminance` returns `0.5` | `src/tokens/glass.ts:1521-1527` | material-engine fake-complexity table | Deleted (§13.3 contrast theatre) |
| E-24 | `LiquidGlassBackdropSampler` writes `data-contrast-hint`, `data-requires-dimming`, inline `boxShadow: inset 0 0 8px rgba(255,255,255,0.12)`; its test only asserts text matches `/mixed|light|dark/` | `src/primitives/LiquidGlassBackdropSampler.tsx:40-47`; `src/primitives/LiquidGlassBackdropSampler.test.tsx`; runtime-local §tests | runtime-local autopsy | C-D in 4.2, deleted in 5.0 (owner PRD-04 per its §9 table); successor here |
| E-25 | Tint identical over white/black/busy in 84/84 story×viewport pairs; fill ≈ `rgba(255,255,255,0.02)`; white/black luminance delta median 0.881 | `autopsy/runtime-remote.md:65` and §2 | remote Chromium 141 measurement | A sampler alone cannot fix legibility; the solved `media` floor (PRD-04) is the guarantee, sampling only refines glyph tone |
| E-26 | Text over black fails in 266/342 runs (median 1.92:1) | `autopsy/runtime-remote.md:14` | remote measurement | clear-over-dark-video scene is a release gate (AC-MED-03) |

### 2.3 Backdrops

| # | Evidence | Location | Finding / verdict | Consequence |
|---|---|---|---|---|
| E-30 | `AuroraBackground`: seeded deterministic PRNG (`hashSeed`, `seededRandom`), tokenised, correct reduced-motion and forced-colours handling, `data-ag-palette`, `data-intensity`, `data-motion`; but `"use client"` and DOM particles (`data-testid="aurora-particle"`) | `src/components/marketing/AuroraBackground.tsx:1,21-66,76-125`; `marketing.css:372-396,888-963` | inventory **7.0 POLISH** (highest-scoring backdrop): "should become THE canonical atmospheric backdrop" | Base of `Backdrop preset="aurora"`; drop `"use client"` and particles (REQ-MED-70) |
| E-31 | `GlassMeshGradient`: colourless by default, blank under reduced motion, per-frame canvas with `filter: blur(100px)`, `Math.random` blobs | `src/components/advanced/GlassMeshGradient.tsx:72-77,120-125,149-169,233-239` | inventory 3 REDESIGN. PERFORMANCE-08 **narrowed**: `:133-145` only reads a rect and writes a ref (no setState) | `preset="mesh"` is static CSS gradients, no canvas (REQ-MED-71) |
| E-32 | `Math.random` particles + rAF loop; SSR comment acknowledges mismatch risk | `src/components/backgrounds/ParticleBackground.tsx:96,143-148,263`; `advanced/GlassParticles.tsx:127-134,413-417,513-517`; `immersive/GlassParticleField.tsx:238` | inventory CONSOLIDATE ×3; motion autopsy (`Math.random` motion in 68 files) | No particle preset in core; particle field → labs (§13.4) |
| E-33 | `AuroraPro` renders a plain `<div>` fallback unless React 19; story pixel-identical to GlassShatterEffects (3.9% diff) | `src/components/effects/AuroraPro.tsx:20-56`; visual-quality §6 | inventory REMOVE | Deleted (PRD-16); codemod → `Backdrop preset="aurora"` |
| E-34 | `AtmosphericBackground`, `GlassDynamicAtmosphere` (528 lines, "best base") both target "single `<GlassBackdrop preset=…>`" | `src/components/backgrounds/AtmosphericBackground.tsx`, `GlassDynamicAtmosphere.tsx` (+ `.module.css`) | inventory CONSOLIDATE | Folded into `Backdrop` presets (`aurora`/`mesh`) |
| E-35 | 44 of 106 distinct keyframe names are decorative (aurora/drift/orbit…), loops of 15–32 s | `autopsy/motion.md:31,88` | MOTION findings | One optional drift per backdrop, gated by `allowContinuous` (REQ-MED-74) |
| E-36 | Storybook "media" surface is `#ffffff → #f4f4f4 → #e9e9e9`; 0 stories use `previewSurface: 'media'` | `.storybook/StorySurface.tsx:44-50`; `.storybook/preview.tsx:127-129` | **STORYBOOK-SHOWCASE-02 CONFIRMED** (worse than reported) | `photo`/`video` presets use the PRD-19 licensed scene assets (§13) |

---

## 3. Desired end state

At 5.0.0 GA:

1. **`aura-glass/media`** exports exactly 7 values at 5.0.0: `useMediaElement`, `MediaControls` (compound), `MediaScrubber`, `NowPlayingBar` (compound), `ImageViewer` (compound), `CarouselRail` (compound), `formatMediaTime`. `Waveform` is added in 5.1 (C-E, 8 values; SC-12). Nothing media-related is exported from the root.
2. **`aura-glass/backdrops`** exports exactly 1 value: `Backdrop` (plus types `BackdropProps`, `BackdropPreset`, `MediaTone`). Its internal `"use client"` island `BackdropTone` is imported by `Backdrop` and is not exported. Five presets: `aurora`, `mesh`, `photo`, `video`, `grain`. No particles, no canvas loops, no WebGL in core.
3. One **headless media core**: every player UI in the library and in the registry is `useMediaElement(ref)` + `MediaControls` parts over the consumer's own native `<video>`/`<audio>`. The library never fetches, decodes, transcodes or analyses media.
4. **Flagship 43 is the canonical `clear`-over-media demonstration.** `MediaControls` defaults to `variant="clear"`; `NowPlayingBar` defaults to `variant="regular"` (it usually docks over page chrome) and is set to `variant="clear"` in every over-media story and certification cell. Over a `Backdrop preset="photo|video"` (or any ancestor declaring `data-ag-backdrop="media"`) `clear` gets the PRD-04 35% scrim automatically, and both pass the OCR contrast gate (≥4.5:1 text, ≥3:1 glyphs) in all 8 certification scenes, both schemes, all three engines.
5. **Library-owned luminance sampling is honest and bounded.** The sampler reads pixels only from an `<img>`/`<video>` element the library rendered (`Backdrop`) or the consumer explicitly handed to it (`useMediaElement`'s ref, opt-in), once per source, on a 32×32 canvas, off the scroll path. It writes only `data-ag-media-tone="light|dark"` and `--ag-media-luma`. It never lowers a contrast floor: tone selects the glyph/ink polarity for small chrome; the solved `media` floor always applies. Cross-origin (tainted) sources and failures leave the tone absent, which is the conservative state.
6. **Scrubber, waveform and image viewer are real.** `MediaScrubber` shows buffered ranges, chapter markers, hover time and keyboard frame/second steps with `aria-valuetext` like "1 minute 32 seconds of 4 minutes 10 seconds". `Waveform` (5.1) renders consumer peaks (or a live `level`) as one static SVG path; no randomness. `ImageViewer` is a Base UI Dialog lightbox with zoom/pan/pinch, keyed item navigation and glass chrome.
7. **Flagship 44 `CarouselRail`** implements the APG carousel pattern on CSS scroll-snap: controlled `index`, scoped keyboard, `aria-roledescription="carousel"`/`"slide"`, autoplay off by default and treated as a loop (SC-38): it runs only with the consumer `autoplay` prop **and** `allowContinuous` **and** resolved motion `full`, paused on hover, focus and offscreen.
8. **Budgets hold**: per-import gzip budgets (§16), ≤1 `backdrop-filter` per media control bar, 0 continuous animations unless `allowContinuous`, 0 long tasks >50 ms during scripted playback/scrub in QA lane L10 Performance (remote).
9. Every absorbed 4.x name (§9) has a root `deprecations.json` entry (SC-02/SC-03), a 4.2/4.3 dev warning through `warnDeprecated(id)` (REL-072), a `migrate 4to5` mapping (transform id `media-backdrops`, SC-33) and an `aura-glass/compat` adapter under `src/compat/{media,backdrops}/` (SC-34) or an explicit "no successor" note.

---

## 4. Architecture

### 4.1 Module layout (all NEW)

```
src/media/
  index.ts                     # ./media entry ("use client" per file, not per entry)
  useMediaElement.ts           # headless store over HTMLMediaElement
  mediaStore.ts                # external store (useSyncExternalStore), event wiring
  formatMediaTime.ts           # server-safe pure fn
  MediaControls/               # Root, PlayButton, Scrubber, Time, Volume, Mute, Captions, PictureInPicture, Fullscreen, Rate, Spacer
  MediaScrubber/               # Base UI Slider wrapper + buffered/chapters/hover layers
  NowPlayingBar/               # Root, Artwork, Title, Subtitle, Progress, Actions, Expand
  Waveform/                    # 5.1 (C-E): SVG path renderer, peaks downsampler
  ImageViewer/                 # Root, Trigger, Popup, Stage, Toolbar, Caption, Inspector, Prev, Next, Counter
  CarouselRail/                # Root, Viewport, Slide, Prev, Next, Indicators, AutoplayToggle
  sampling/
    sampleOwnedPixels.ts       # 32x32 canvas readback, luma stats
    classifyTone.ts            # pure: stats -> 'light' | 'dark' | undefined
    toneCache.ts               # Map<sourceKey, ToneResult>, max 64 entries LRU
  media.css                    # ./media.css (layer ag.components)
src/backdrops/
  index.ts                     # ./backdrops entry (server-safe)
  Backdrop.tsx                 # server component
  BackdropTone.tsx             # "use client" island for photo/video tone
  presets/aurora.css, mesh.css, grain.css, media.css
  assets/grain-112.avif        # static grain tile
  backdrops.css                # ./backdrops.css
```

### 4.2 Layer and material roles (consumed from PRD-04)

| Component | Layer | Variant default | Thickness | Notes |
|---|---|---|---|---|
| `MediaControls.Root` | `chrome` | `clear` | `thin` (size class `bar`) | Renders as `SurfaceGroup`: one `backdrop-filter`; child buttons are inner (no own blur). `refraction` opt-in (enhanced eligible, PRD-15) |
| `NowPlayingBar.Root` | `chrome` | `regular` (prop `variant="clear"` opt-in over media; no automatic switch, because variant is a role the engine reads, not something CSS may flip) | `regular` | One `backdrop-filter` |
| `ImageViewer.Toolbar`, `.Caption` | `chrome` inside `overlay` | `clear` | `thin` | Toolbar (top) and Caption (bottom) are two separate surfaces (≤2 `backdrop-filter`; one group would put a viewport-sized pane over the image). The stage itself has no material; the modal scrim behind it is OVL's `.ag-scrim` (OVL-023) with the `media` scrim variant (opaque tint, blur 0, REQ-MED-46; open item OI-MED-03) |
| `ImageViewer.Inspector` | `overlay` | `regular` | `regular` | Side panel; collapses inner glass |
| `CarouselRail.Prev/Next/Indicators` | `chrome` | `clear` over media slides, else `regular` | `thin` | Slides are content (`content-raised`) |
| `MediaScrubber` thumb | `transient` | glass only while dragged | control | |
| `Backdrop` | none (it is the environment) | n/a | n/a | Self-declares `data-ag-backdrop` |

### 4.3 Headless media core

`useMediaElement(ref, options?)` subscribes to one `HTMLMediaElement` through a per-element external store (`mediaStore.ts`) and returns a stable snapshot plus commands. Events wired: `play`, `pause`, `ended`, `durationchange`, `loadedmetadata`, `progress`, `seeking`, `seeked`, `waiting`, `canplay`, `volumechange`, `ratechange`, `error`, `enterpictureinpicture`, `leavepictureinpicture`, and `timeupdate`. `currentTime` is **not** pushed through React state on every `timeupdate`: the store publishes React snapshots at ≤4 Hz, and during playback the scrubber fill is driven by writing `--ag-media-progress` (0–1) on `MediaControls.Root` from one frame subscription on the MOT (PRD-06) shared ticker (`src/motion/ticker.ts`, MOT-040, REQ-MOT-128 hidden/offscreen pause; `auraglass/motion-raf-via-ticker`, SC-16) or, if the ticker is not available to `src/media/**`, a rAF loop that satisfies PERF's `auraglass/raf-requires-cancel` and `auraglass/raf-requires-visibility-gate` rules (REQ-PERF-28, PERF-028/029). It runs only while `!paused && document.visibilityState === 'visible'` and the root intersects the viewport (one `IntersectionObserver` per root). This is user-started playback, not a decorative loop, so it is not gated by `allowContinuous`. Server snapshot: all-default state (`paused: true`, `duration: NaN`, `ready: false`).

`MediaControls.Root` accepts either `media={snapshotFromUseMediaElement}` (headless mode) or fully controlled props (`playing`, `currentTime`, `duration`, `onPlayingChange`, `onSeek`, `volume`, `onVolumeChange`) matching the 4.x `LiquidGlassMediaControls` shape so the codemod is mostly mechanical.

### 4.4 Owned-pixel luminance sampling

```
source (img decoded | video 'loadeddata' or poster)
  └─ sampleOwnedPixels(el, region)  → draw to 32×32 canvas (OffscreenCanvas when available)
       └─ getImageData → per-pixel relative luminance (sRGB→linear, BT.709; src/theme/color.ts)
            └─ stats { mean, p10, p90, stdev } over region (default: full frame; bar presets: bottom 25% / top 25%)
                 └─ classifyTone: mean ≥ 0.6 && p10 ≥ 0.35 → 'light'; mean ≤ 0.3 && p90 ≤ 0.55 → 'dark'; else undefined ('busy')
                      └─ write data-ag-media-tone + --ag-media-luma on the owning root; cache by source key
```

Rules: (a) the element must be rendered by `Backdrop` or passed explicitly (`useMediaElement(ref, { sampleTone: true })`); there is no API that accepts an arbitrary DOM node or point. Interpretation note: architecture §4.1 item 1 permits `/media` to sample "its own" pixels; a media element the consumer explicitly binds to `useMediaElement` is treated as owned by the media core, because the sampler reads that element's decoded frame, never the composited DOM behind a surface. (b) `getImageData` throwing `SecurityError` (tainted canvas) or any decode error → tone absent, one dev warning naming the source and the fix (`crossOrigin="anonymous"` + CORS header). (c) Video is sampled once at first `loadeddata` (or from `poster` if provided, preferred), never per frame; tone is stable per `src`. (d) Precomputed `tone` prop (from `@auraglass/cli sample-media`, a DX command request, PRD-18; not yet in the DX PRD, §21) skips the client island entirely. (e) CSS consumption: PRD-04's glyph-flip rule (architecture §7, item 3) keys on `[data-ag-backdrop=media][data-ag-media-tone=light|dark]` for small chrome only; floors stay the `media` floors. `data-ag-media-tone` is ratified in the SC-21 attribute registry (owner MAT); the glyph-flip selector is a MAT (PRD-04) task, and this PRD must not edit `src/material/**`. (f) The sampler's `getImageData` read is owned-pixel classification, not runtime contrast: A11Y's `auraglass/no-runtime-contrast` (A11Y-012, flags `getImageData`) needs a scoped allowance for `src/media/sampling/**` (§21).

### 4.5 Backdrop

`<Backdrop preset="aurora|mesh|photo|video|grain" …>{children}</Backdrop>` is a server component that renders `<div class="ag-backdrop" data-ag-backdrop-preset=… data-ag-palette=… data-ag-backdrop=…>` (all SC-21 ratified attributes; `data-ag-palette` only for `aurora`/`mesh`) with an `aria-hidden` decorative layer (`data-ag-part="backdrop-layer"`, `position:absolute; inset:0; z-index:0`) and a content slot (`data-ag-part="backdrop-content"`, `position:relative; z-index:1`). Declared backdrop: `aurora`/`mesh` → `dark` or `light` from `scheme` prop / color scheme (`auto`); `photo`/`video` → `media`; `grain` → inherits (it overlays another preset or flat canvas). `photo`/`video` render `<BackdropTone>` only when `tone` is not given. Children (glass) sit above the layer and inherit the declaration through CSS.

### 4.6 Base UI foundation (PRD-07 pattern)

| Part | Base UI | Why |
|---|---|---|
| `MediaScrubber`, `MediaControls.Volume`, `.Rate` | `Slider` (Root, Control, Track, Indicator, Thumb) | Real slider semantics, keyboard, pointer capture |
| `MediaControls.Root` | `Toolbar` | Roving focus across transport buttons, one tab stop |
| `PlayButton`, `Mute`, `Captions`, `PictureInPicture`, `Fullscreen` | `Toggle` | `aria-pressed` state |
| `ImageViewer.Root/Popup` | OVL `Dialog` (Base UI Dialog, OVL-040), portalled via `usePortalContainer()` (FND-007) | Focus trap, inert background; Escape, `inert` and scroll lock dispatched only by A11Y `LayerStack` (A11Y-049, SC-25) |
| `ImageViewer.Toolbar` | `Toolbar` | |
| `CarouselRail` | own (APG carousel on scroll-snap, §11.2 #44) | Base UI has no carousel |
| `Waveform` | own (SVG) | presentational |

---

## 5. Exact implementation requirements

### 5.1 Entries and exports

- **REQ-MED-01** `aura-glass/media` value exports at 5.0.0 are exactly `useMediaElement`, `MediaControls`, `MediaScrubber`, `NowPlayingBar`, `ImageViewer`, `CarouselRail`, `formatMediaTime` (7; `Waveform` joins in 5.1 as the 8th, C-E, SC-12). `aura-glass/backdrops` value exports are exactly `Backdrop` (1). The four entries are rows in PKG's `build/exports.manifest.json` (PKG-005; this PRD adds rows by MODIFY, SC-12). Test: REL API reports `etc/api/media.api.md`, `etc/api/media.exports.json`, `etc/api/backdrops.api.md`, `etc/api/backdrops.exports.json` (slugs per SC-04, generated by `scripts/release/api-report.mjs` / `export-snapshot.mjs`) and `tests/exports/media-backdrops-subpath.spec.mjs` export-list snapshot.
- **REQ-MED-02** The 5.0 root entry (`aura-glass`, API report slug `index`) exports none of the names in §9 or REQ-MED-01. Test: `tests/exports/root-no-media.spec.mjs` (NEW) reads `etc/api/index.exports.json`.
- **REQ-MED-03** `./media.css` and `./backdrops.css` are separate entries in `build/exports.manifest.json` (generated into `package.json#exports` by PKG's `scripts/build/generate-exports.mjs`), start with the SC-20 layer statement and emit rules in `@layer ag.components`, contain zero `!important`, zero `backdrop-filter` literals and zero colour literals outside `var(--ag-*)` fallbacks. Test: PKG CSS layering gates (`tests/css/per-subpath-ownership.test.ts`; this PRD adds the two entries) and DS's `auraglass/no-raw-design-values` rule (ESLint + stylelint, gate `scripts/tokens/gates/literals.mjs`, SC-17; stylelint is added as a pinned devDependency by DS, REQ-DS-33; not installed at HEAD).
- **REQ-MED-04** `src/backdrops/index.ts`, `Backdrop.tsx`, `src/media/index.ts` (pure re-export barrel), `formatMediaTime.ts`, `Waveform/Waveform.tsx`, `Waveform/downsample.ts` (5.1) and `sampling/classifyTone.ts` contain no `"use client"`, no hooks, no context; `renderToString(<Backdrop preset="aurora"/>)` and (5.1) `renderToString(<Waveform peaks={[0.2,0.8]} label="Memo"/>)` succeed in Node with no DOM globals. Every other `src/media/**` and `src/backdrops/**` component module (incl. `BackdropTone.tsx`, `WaveformLevel.tsx`) starts with `"use client"`. Test: PKG directive lint (`auraglass/use-client-required` / `use-client-needless`, SC-16; `tests/build/directives-preserved.test.ts`, PKG-023) + `src/backdrops/__tests__/Backdrop.ssr.test.tsx` (per-file `/** @jest-environment node */` docblock; the repo default is `jsdom`, `jest.config.js:8`).
- **REQ-MED-05** Importing `aura-glass/media` or `aura-glass/backdrops` registers no listener, timer, observer, `<style>` or `<html>` attribute. Test: PKG side-effect gate `scripts/ci/verify-side-effects.mjs` (PKG-042) run against both entries.

### 5.2 `useMediaElement`

- **REQ-MED-10** Signature: `useMediaElement(ref: React.RefObject<HTMLMediaElement | null>, options?: { sampleTone?: boolean; mediaSession?: MediaSessionMetadataInit | false; snapshotHz?: number }): MediaHandle` where `MediaHandle = { state: MediaState; play(): Promise<void>; pause(): void; toggle(): void; seek(seconds: number): void; seekBy(delta: number): void; setVolume(v: number): void; setMuted(m: boolean): void; setRate(r: number): void; requestPictureInPicture(): Promise<void>; requestFullscreen(target?: HTMLElement): Promise<void> }`. Test: `tests/types/media.tsx` (NEW), type-checked by the existing `tests/types/tsconfig.json` harness (`tsc -p tests/types --noEmit`; `tsd` is not a dependency and is not added), with `// @ts-expect-error` lines for negative cases.
- **REQ-MED-11** `MediaState` fields: `paused`, `ended`, `waiting`, `seeking`, `ready` (readyState ≥ 2), `currentTime`, `duration`, `buffered: Array<[start: number, end: number]>`, `volume`, `muted`, `playbackRate`, `pictureInPicture`, `textTracks: Array<{ id: string; label: string; language: string; kind: TextTrackKind; mode: TextTrackMode }>`, `error: { code: number; message: string } | null`, `tone: 'light' | 'dark' | undefined`. Test: `useMediaElement.test.tsx` dispatches each wired event (list in §4.3) on a jsdom `HTMLVideoElement` stub and asserts the snapshot field.
- **REQ-MED-12** React snapshots are published at most `snapshotHz` times per second (default 4, clamp 1–15) during `timeupdate`; discrete events (`play`, `pause`, `seeked`, `ended`, `error`, `volumechange`) publish immediately. Test: fake timers, 60 `timeupdate` events in 1 s → ≤4 renders of a counting consumer.
- **REQ-MED-13** `--ag-media-progress` (0–1, 4 decimals) is written on the nearest `[data-ag-media-root]` from a single frame subscription (PRD-06 ticker or a REQ-PERF-28-compliant rAF loop, §4.3) that runs only when playing, `document.visibilityState === 'visible'` and the root is intersecting; it stops within 1 frame of any of those becoming false. Test: `useMediaElement.raf.test.tsx` with mocked rAF/IntersectionObserver asserts 0 rAF callbacks when paused, hidden or offscreen.
- **REQ-MED-14** `play()` resolves or rejects with the native promise; a rejected autoplay (`NotAllowedError`) sets `state.error = { code: 0, message: 'autoplay-blocked' }` and does not throw. Test: stub `play` rejecting.
- **REQ-MED-15** When `mediaSession` is an object and `navigator.mediaSession` exists, the hook sets `metadata` and action handlers `play`, `pause`, `seekbackward`, `seekforward`, `seekto` while mounted and clears them on unmount. `false` (default) touches nothing. Test: stubbed `navigator.mediaSession`.
- **REQ-MED-16** The hook never sets `src`, never calls `load()`, never creates `AudioContext`, and never calls `fetch`. Test: AST gate `scripts/ci/verify-media-purity.mjs` (NEW) over `src/media/**` forbids `fetch`, `XMLHttpRequest`, `AudioContext`, `webkitAudioContext`, `MediaRecorder`, `Math.random`, `.src =` on media elements.
- **REQ-MED-17** Server render returns `{ paused: true, ended: false, ready: false, currentTime: 0, duration: NaN, buffered: [], volume: 1, muted: false, playbackRate: 1, … tone: undefined }` and no hydration warning occurs. Test: `useMediaElement.ssr.test.tsx` (`renderToString` + `hydrateRoot`, console.error spy = 0).
- **REQ-MED-18** Listeners are attached with one `AbortController` per element and removed on unmount or ref change. Test: wrap the stub element's `addEventListener`/`removeEventListener` with jest spies; after unmount (and after swapping the ref to a second element) every listener added to the first element was registered with an `AbortSignal` whose `aborted === true`, and the count of live (non-aborted) registrations is 0.

### 5.3 `MediaControls` and `MediaScrubber`

- **REQ-MED-20** `MediaControls` parts: `Root`, `PlayButton`, `Scrubber` (= `MediaScrubber`), `Time`, `Volume`, `Mute`, `Rate`, `Captions`, `PictureInPicture`, `Fullscreen`, `Spacer`. Each renders `data-ag-part="media-<part>"`. Test: `MediaControls.parts.test.tsx` asserts every part attribute.
- **REQ-MED-21** `Root` props: `media?: MediaHandle` **or** controlled `playing`, `currentTime`, `duration`, `buffered?`, `volume?`, `muted?`, `onPlayingChange`, `onSeek(seconds)`, `onVolumeChange`, `onMutedChange`; plus `variant?: 'regular' | 'clear'` (default `'clear'`), `refraction?: boolean`, `label?: string` (default `"Media controls"`), `shortcuts?: boolean` (default `true`). Passing both `media` and `playing` logs a dev error once. Test: controlled and headless stories render identically (DOM snapshot minus `data-ag-media-root` id).
- **REQ-MED-22** `Root` renders `role="toolbar"` (Base UI Toolbar) with `aria-label`, one tab stop, Left/Right/Home/End roving among buttons; the Scrubber and Volume sliders are separate toolbar items that keep their own Arrow semantics (Arrow keys adjust the slider while it is focused; Tab exits). Test: `tests/a11y/apg/media-controls.apg.spec.ts` (NEW, owned here per SC-30; uses the A11Y APG harness `tests/a11y/apg/harness.ts`, A11Y-073; run in QA lane L5 Behaviour, `certification/lanes/behaviour.spec.ts`, QA-082).
- **REQ-MED-23** `MediaScrubber` props: `value` (seconds), `max` (duration), `onValueChange`, `onValueCommit`, `buffered?: Array<[number, number]>`, `chapters?: Array<{ start: number; title: string }>`, `step?` (default 1 s), `largeStep?` (default 10 s), `frameRate?` (enables `,`/`.` frame step when paused), `formatHoverTime?`. It renders Base UI Slider with `aria-label="Seek"`, `aria-valuetext` from `formatMediaTime(value, { spoken: true })` + " of " + spoken duration (e.g. "1 minute 32 seconds of 4 minutes 10 seconds"). Test: `MediaScrubber.test.tsx` asserts valuetext for 0, 92, 3725 s and `NaN` duration ("unknown duration").
- **REQ-MED-24** Buffered ranges render as `<div data-ag-part="media-scrubber-buffered" style="--ag-start:…;--ag-end:…">` inside the track (custom properties are the only inline style allowed, and only on this layer and chapter markers); chapter markers render `data-ag-part="media-scrubber-chapter"` with `title`; pointer hover shows a time tooltip (`data-ag-part="media-scrubber-hover"`, `aria-hidden="true"`). Test: DOM assertions + `MediaScrubber.stories.tsx` "Buffered and chapters" baseline.
- **REQ-MED-25** While dragging, the Scrubber does not call `onSeek`/`seek` more than once per animation frame, and calls `onValueCommit` exactly once on release. The thumb is `transient` glass (`data-ag-layer="transient"`) only while `data-dragging`. Test: Playwright pointer drag of 300 px over 30 frames → ≤30 seek calls, 1 commit.
- **REQ-MED-26** When `shortcuts` is true, keyboard shortcuts are handled on `Root` (and on an element passed via `MediaControls.Root shortcutTarget` ref) only when focus is inside it: Space/K toggle, J/L −10/+10 s, M mute, F fullscreen, C captions, `<`/`>` rate. No listener is attached to `window` or `document`. Test: `MediaControls.shortcuts.test.tsx` asserts Space in an `<input>` outside the root does not toggle, and static gate REQ-MED-16 extended with `window.addEventListener('keydown'` / `document.addEventListener('keydown'` bans in `src/media/**`.
- **REQ-MED-27** `PlayButton` is a toggle (`aria-pressed` reflects playing, label stays "Play"), icon glyphs come from the 5.0 per-glyph icon modules (`aura-glass/icons/<name>`, source `src/icons/glyphs/**`, NEW, PKG (PRD-02) exports manifest; the 4.x category subpath `aura-glass/icons/media` / `src/icons/media/index.ts` is removed in 5.0 per the packaging PRD and is only the glyph lineage), and every button hit target is ≥44×44 CSS px at coarse pointer (`--ag-target-coarse`) and ≥32×32 at fine pointer (a media-chrome size above the 24 px `--ag-target-min` floor, expressed with `--ag-space-*` tokens, no px literal) (DS target tokens; A11Y `src/a11y/css/targets.css`, A11Y-065). Test: `MediaControls.a11y.test.tsx` (axe) + computed-size assertion via A11Y `tests/a11y/browser/target-size.spec.ts` (A11Y-067) in L5 Behaviour.
- **REQ-MED-28** `Time` renders `<time>` elements with `datetime` in ISO-8601 duration (`PT1M32S`), uses `font-variant-numeric: tabular-nums`, and is `aria-hidden="true"` when a Scrubber is present (the slider valuetext carries the information). Test: DOM assertion.
- **REQ-MED-29** `Captions` is a toggle (`aria-pressed`) that switches the selected `kind="captions"|"subtitles"` track's `mode` between `showing` and `disabled`; when >1 such track exists the track is chosen via a `MediaControls.Captions` menu (Base UI Menu); when the media has 0 such tracks the part renders nothing (aligned with REQ-EXP-29). Test: jsdom `TextTrack` stub: 0 tracks → no `[data-ag-part="media-captions"]` node; 1 track → toggle flips `mode`; 2 tracks → menu lists both labels.

### 5.4 `NowPlayingBar` and `Waveform`

`Waveform` (REQ-MED-35..39) ships in **5.1** (C-E, SC-12/SC-38). The requirements below are frozen now so the 5.1 work is mechanical; none of them gates 5.0.0, and `Waveform` is not in the 5.0 `./media` export list, API report or size gate.

- **REQ-MED-30** `NowPlayingBar` parts: `Root`, `Artwork`, `Title`, `Subtitle`, `Progress`, `Actions`, `Expand`. `Root` accepts `media?: MediaHandle` or controlled `playing`/`progress` (0–1)/`onPlayingChange`, plus `onPrevious?`, `onNext?`, `expanded?`, `onExpandedChange?`, `variant?: 'regular' | 'clear'` (default `'regular'`), `sampleTone?: boolean` (default `false`). Test: `NowPlayingBar.test.tsx`.
- **REQ-MED-31** `Progress` renders `role="progressbar"` with `aria-valuemin=0`, `aria-valuemax=100`, `aria-valuenow` (integer) and `aria-valuetext` (spoken elapsed of total) and draws its fill from `--ag-media-progress` (no inline `width`). Test: DOM + no `style.width` assertion (regression for `LiquidGlassNowPlayingBar.tsx:79-84`).
- **REQ-MED-32** `Expand` is a button with `aria-expanded` and `aria-controls` pointing at the consumer's expanded player id (`expandedId` prop, required when `Expand` is rendered; dev error otherwise). Test: unit.
- **REQ-MED-33** `Artwork` renders `<img alt="">` by default (decorative, title carries the name) and accepts `alt` override; when `src` changes, and `sampleTone` is set on `Root`, the artwork image is sampled (it is library-rendered) and `data-ag-media-tone` is written on `Root`. Test: sampler mock asserts one sample per distinct `src`.
- **REQ-MED-34** Layout: `Root` is a single row at ≥360 px container width (`@container ag-now-playing (min-width: 360px)`); below it `Subtitle` and `Actions` except play are hidden and `Title` truncates with ellipsis; the bar never wraps to two lines. Test: Playwright container-width fixtures 320/360/600 px.
- **REQ-MED-35** (5.1) `Waveform` props: `peaks?: Float32Array | number[]` (0–1, any length), `level?: number` (0–1, live single-bar meter mode), `progress?: number` (0–1), `bars?: number` (default 64, clamp 8–256), `label: string` (required). It renders exactly one `<svg role="img" aria-label={label}>` containing ≤2 `<path>` elements (played/unplayed, split by a `clipPath` at `progress`), no per-bar DOM nodes. Test: `Waveform.test.tsx` asserts path count and that 10,000 input peaks produce `bars` columns.
- **REQ-MED-36** (5.1) Peak downsampling is max-abs per bucket, deterministic, and pure (`downsamplePeaks(peaks, bars)` in `src/media/Waveform/downsample.ts`); same input → byte-identical `d` attribute. No `Math.random`, no time-based animation. Test: snapshot of `d` for a fixture; REQ-MED-16 gate.
- **REQ-MED-37** (5.1) `level` mode animates bar height via a CSS transform transition of `--ag-duration-micro` (DS token file `tokens/sys/motion.tokens.json`, values MOT, SC-18/SC-19; 120 ms) and drops the transition under `motion="calm"|"none"`. Test: computed `transition-duration: 0s` under `[data-ag-motion=none]` and `[data-ag-motion=calm]`.
- **REQ-MED-38** (5.1) `Waveform` is server-renderable when `level` is undefined (no hooks in that path; the `level` path lives in a separate `"use client"` `WaveformLevel` internal component). Test: `renderToString` with `peaks`.
- **REQ-MED-39** (5.1) `Waveform` colours come from `--ag-on-surface` (played) and `--ag-on-surface-muted` (unplayed) (PRD-03 `sys.color.on-surface[-muted]`); under `forced-colors: active` they become `CanvasText`/`GrayText`. Test: computed fill under forced colors in QA lane L6 Environment visual (forced-colors axis) (5.1).

### 5.5 `ImageViewer` (lightbox, gallery navigation, viewer chrome)

- **REQ-MED-40** `ImageViewer` parts: `Root`, `Trigger`, `Popup`, `Stage`, `Toolbar`, `Caption`, `Inspector`, `Prev`, `Next`, `Counter`, `ZoomIn`, `ZoomOut`, `ZoomReset`, `Close`. `Root` props: `items: Array<{ id: string; src: string; srcSet?: string; alt: string; caption?: React.ReactNode; width?: number; height?: number }>`, `value?: string` / `defaultValue?` / `onValueChange?(id)` (selected item **id**), `open?`/`defaultOpen?`/`onOpenChange?`, `loop?` (default `false`). Test: `ImageViewer.test.tsx`.
- **REQ-MED-41** `Popup` is the overlays-PRD `Dialog` popup: `role="dialog"`, `aria-modal="true"`, labelled by the current item's `alt` via `aria-label` (or `Caption` id when present), focus moves to `Close` on open and returns to the invoking `Trigger` on close, background is `inert`. Test: `tests/a11y/apg/image-viewer.apg.spec.ts` (NEW, SC-30; A11Y APG harness, L5 Behaviour).
- **REQ-MED-42** Keyboard inside the popup only: Left/Right previous/next, Home/End first/last, `+`/`=` zoom in, `-` zoom out, `0` reset, Escape closes (dispatched by A11Y `LayerStack`, top of stack only; the popup registers no Escape handler itself, SC-25). No `window`/`document` keydown listeners. Test: same spec + REQ-MED-16 gate.
- **REQ-MED-43** Navigation and `Trigger` resolve items by `id`; filtering or reordering `items` while closed never opens a different image than the trigger's `itemId`. Test: regression for `GlassGallery.tsx` lightbox-after-filter (E-08): filter to 3 of 10 items, click trigger for item `"p7"`, assert stage `alt` = item p7's.
- **REQ-MED-44** Zoom range 1–8×, step 1.25× for buttons/keys; wheel zoom uses a non-passive listener on `Stage` only and only when `ctrlKey || metaKey` or when already zoomed; pan with pointer events (`setPointerCapture`), pinch with two active pointers; transforms are `translate3d()/scale()` on the `<img>` only. Test: Playwright pointer and wheel scripts assert scale/translate and that page scroll is not prevented at 1×.
- **REQ-MED-45** `Counter` renders "3 of 12" with `aria-live="polite"` on the popup's single live region (PRD-05 announcer), announced once per navigation. Test: announcer spy.
- **REQ-MED-46** `Toolbar` and `Caption` are `clear` chrome; the stage behind them declares `data-ag-backdrop="media"` and the current image is sampled (library-rendered `<img>`) so `data-ag-media-tone` follows each image. The `Popup` uses the overlays-PRD `.ag-scrim` (the one modal scrim, REQ-MAT-28) with a `media` scrim variant requested from OVL (PRD-09, `.ag-scrim` in `src/components/overlays/_shared/overlays.css`, OVL-023) (C-E): tint from token `--ag-scrim-media` (accepted DS addition, SC-19; row in `tokens/sys/environment.tokens.json`, DS-028; value `oklch(0% 0 0 / 0.72)`) and `--_ag-scrim-blur: 0` so its computed `backdrop-filter` is `none` (blur radius 0 is in the REQ-PERF-12 scale; an opaque 72% scrim makes blur invisible, and removing it saves the full-viewport filter). If OVL rejects the variant, the standard ≤12 px scrim is used and the §16 `ImageViewer` filter budget becomes ≤3. Test: computed style assertions (scrim `backdrop-filter: none`, background resolves to the token); Lab baseline over the 8 scenes.
- **REQ-MED-47** Adjacent images are preloaded by rendering the previous and next items as hidden `<img loading="eager" decoding="async" fetchpriority="low">` inside `Stage`; at most 3 `<img>` elements exist in the stage at once, and no `new Image()` or `fetch` is used. Test: DOM count.
- **REQ-MED-48** `Inspector` is an optional side panel (`overlay`, `regular`) for metadata (the `LiquidGlassPhotoInspector` successor); at viewport width <768 px it renders as a bottom sheet region inside the popup, not a second dialog. Test: viewport fixtures 390/1440.
- **REQ-MED-49** Under `prefers-reduced-motion: reduce` open/close and slide transitions are opacity-only (≤`--ag-duration-micro`), and zoom changes apply without transition. Test: QA lane L9 Motion.

### 5.6 `CarouselRail` (flagship 44)

- **REQ-MED-50** Parts: `Root`, `Viewport`, `Slide`, `Prev`, `Next`, `Indicators`, `AutoplayToggle`. `Root` props: `index?`/`defaultIndex?`/`onIndexChange?`, `label: string` (required), `slidesPerView?: number | 'auto'` (default `'auto'`), `loop?` (default `false`), `autoplay?: { interval: number } | false` (default `false`, interval clamp ≥5000 ms). Test: `CarouselRail.test.tsx`.
- **REQ-MED-51** ARIA per APG carousel: `Root` is `<section aria-roledescription="carousel" aria-label={label}>`; `Viewport` has `aria-live="off"` while autoplaying and `"polite"` otherwise. `Indicators` prop `as?: 'tabs' | 'buttons'` (default `'tabs'`) selects the APG variant: **tabs** → `Indicators` is `role="tablist"` of `role="tab"` buttons with `aria-selected`, `aria-controls` and roving tabindex, and each `Slide` is `role="tabpanel" aria-roledescription="slide" aria-label="N of M"`; **buttons** (or no `Indicators` rendered) → each `Slide` is `role="group" aria-roledescription="slide" aria-label="N of M"` and indicators are `<button aria-label="Slide N">` with `aria-current="true"` on the active one. Test: `tests/a11y/apg/carousel-rail.apg.spec.ts` (NEW, SC-30; A11Y APG harness, both variants, axe 0 violations via `tests/a11y/browser/axe.spec.ts`, L5 Behaviour).
- **REQ-MED-52** `Viewport` uses `scroll-snap-type: x mandatory`, `overscroll-behavior-x: contain`, native touch/trackpad scrolling, and `scrollTo({ left, behavior })` for Prev/Next/indicator (`behavior: 'auto'` under reduced motion). The active index is derived from an `IntersectionObserver` (threshold 0.6) on slides, not from scroll events. Test: Playwright swipe + `onIndexChange` sequence.
- **REQ-MED-53** Keyboard: Prev/Next are buttons with `aria-label="Previous slide"`/`"Next slide"` (replacing "Scroll left/right", E-13), disabled with `aria-disabled` at the ends when `loop=false`; Left/Right move between indicator tabs only when an indicator has focus. No global key listener. Test: APG lane.
- **REQ-MED-54** Autoplay: off by default. Timer-driven slide rotation **counts as a loop** (SC-38, owner MOT): it starts only when the consumer `autoplay` prop is set **and** `data-ag-continuous="on"` is resolved on an ancestor (i.e. `allowContinuous` is true **and** resolved motion is `full`, A11Y `usePreference`). When `autoplay` is set it renders `AutoplayToggle` as the first focusable element (`aria-label="Stop automatic slide show"`/`"Start …"`), pauses on hover, on focus within, when offscreen (`[data-ag-offscreen]`, MOT-040 observer) and when `document.hidden`; without `allowContinuous`, under `prefers-reduced-motion: reduce` or with resolved motion `calm|none`, autoplay never starts and the toggle shows the stopped state. Test: unit with fake timers and preference mock (prop only → no rotation; prop + `allowContinuous` + `full` → rotation); QA lane L9 Motion.
- **REQ-MED-55** Slides are `content` (`content-raised`) by default; `Prev`/`Next`/`Indicators` are `chrome` `thin`, `clear` when the rail declares `data-ag-backdrop="media"` (prop `overMedia`) else `regular`; `src/media/CarouselRail/**` contains no `backdrop-filter`/`backdropFilter` (E-13). Test: MAT `auraglass/no-optics-outside-material` (MAT-004, SC-16) scoped to `src/media/**`.

### 5.7 Owned-pixel luminance sampling

- **REQ-MED-60** `sampleOwnedPixels(el: HTMLImageElement | HTMLVideoElement, region?: { x: number; y: number; w: number; h: number }): ToneStats | null` (internal, `src/media/sampling/sampleOwnedPixels.ts`) draws `el` (or its region, fractions 0–1) into a 32×32 canvas (`OffscreenCanvas` when `typeof OffscreenCanvas !== 'undefined'`, else a detached `<canvas>` never attached to the document), reads `getImageData` once, and returns `{ mean, p10, p90, stdev }` of BT.709 relative luminance on linearised sRGB using the single helper in `src/theme/color.ts`. The statistics are computed by a pure exported-internal function `computeLumaStats(data: Uint8ClampedArray, width: number, height: number): ToneStats` in the same module, so the maths is testable without a canvas. Test: `sampleOwnedPixels.test.ts` feeds synthetic RGBA buffers to `computeLumaStats` (no `canvas`/`jest-canvas-mock` dependency is added; neither is installed at HEAD): pure white → mean 1.000±0.001, pure black → 0.000±0.001, 50/50 split → p10 0, p90 1; the real canvas draw/readback path is asserted remotely in QA lane L8 Engine-specific (`tests/media/media-sampling.spec.ts`, 3 engines) against the `flat-white`/`flat-black` scene assets with the same tolerances.
- **REQ-MED-61** `classifyTone(stats)` is pure: `mean ≥ 0.60 && p10 ≥ 0.35` → `'light'`; `mean ≤ 0.30 && p90 ≤ 0.55` → `'dark'`; otherwise `undefined` (busy). Thresholds are constants `TONE_LIGHT_MEAN`, `TONE_LIGHT_P10`, `TONE_DARK_MEAN`, `TONE_DARK_P90` exported from `classifyTone.ts` (module-internal; not exported from `aura-glass/media`) and calibrated once against the 8 PRD-19 scenes at alpha: the calibration run emits `media-tone-calibration.json` (per-scene stats + chosen thresholds) as a CI artifact (D-32; evidence dir via `scripts/ci/lib/evidence-dir.js`, SC-07), the per-scene stats are committed only as the test fixture `src/media/sampling/__fixtures__/scene-stats.json`, and later changes are allowed only in a C-I visual-fix PR. Test: `classifyTone.test.ts` table over the 8 scene thumbnails' recorded stats: photo→light, dark-media→dark, flat-white→light, flat-black→dark, hf-pattern→undefined, saturated-abstract→undefined, dense-text→undefined, video-frame→per recorded fixture (SC-28 scene ids).
- **REQ-MED-62** The only writes are `data-ag-media-tone` (`light|dark`, attribute removed when `undefined`) and `--ag-media-luma` (mean, 3 decimals) on the owning root (`.ag-backdrop`, `[data-ag-media-root]`, `NowPlayingBar.Root`, `ImageViewer.Stage`). The sampler never writes `data-ag-backdrop`, never writes any `--ag-` floor, tint or alpha variable, and never removes the `media` declaration. Test: MutationObserver in `BackdropTone.test.tsx` records only those two names.
- **REQ-MED-63** Each source is sampled at most once per `(currentSrc, region)` key: images after `decode()` resolves; video at the first `loadeddata`, or from `poster` (sampled as an image) when present, which takes precedence. No sampling on `timeupdate`, `seeked`, scroll, resize or mutation. Results are cached in an LRU of 64 entries (`toneCache.ts`). Test: dispatch 100 `timeupdate` + 10 `seeked` → `getImageData` called once.
- **REQ-MED-64** Sampling runs inside `requestIdleCallback` (timeout 500 ms; `setTimeout(0)` fallback) and its main-thread cost is ≤4 ms per sample at 4× CPU throttle in remote Chromium (L10 Performance). Test: `tests/perf/browser/media-sampling.spec.ts` (NEW, SC-30 naming; PERF harness `tests/perf/harness/run-perf.mjs`, PERF-039; QA lane L10 Performance) records `performance.measure('ag:sample')`.
- **REQ-MED-65** A tainted canvas (`SecurityError`), decode failure, zero-size source or `naturalWidth === 0` yields no tone, no throw, and exactly one dev-only `console.warn` per source: `[aura-glass] Cannot sample <src>: add crossOrigin="anonymous" and CORS headers, or pass tone="light|dark" to Backdrop.` Production logs nothing. Test: cross-origin fixture served without CORS in the Playwright lane; jest for the message.
- **REQ-MED-66** Tone never lowers legibility: with `data-ag-media-tone` present, the computed `on-surface` ink and the tint alpha on every media/chrome surface are ≥ those with the attribute absent (PRD-04 consumes the attribute for **glyph polarity on small chrome only**, architecture §7 item 3). Test: QA (PRD-19) three-composite check (SC-28 "composites") run twice per scene (tone on/off), OCR contrast worst case must not decrease.
- **REQ-MED-67** No public API accepts an arbitrary element, point or selector for sampling; `useMediaElement`'s `sampleTone` samples only the element bound to its `ref`, which must be an `HTMLMediaElement`. Test: `@ts-expect-error` negative cases in `tests/types/media.tsx`; grep gate forbids `elementsFromPoint`, `elementFromPoint`, `html2canvas`, `foreignObject`, `getComputedStyle(` in `src/media/sampling/**` and `src/backdrops/**`.

### 5.8 `Backdrop` and presets

- **REQ-MED-70** `Backdrop` props: `preset: 'aurora' | 'mesh' | 'photo' | 'video' | 'grain'`; `scheme?: 'light' | 'dark' | 'auto'` (default `'auto'`, aurora/mesh only); `palette?: 'aurora' | 'prism' | 'ocean' | 'ember' | 'mono'` (default `'aurora'`; the 4.x `MarketingPalette` values from `src/components/marketing/types.ts:1`, mapped to `--ag-ref-*` tokens); `src?`, `srcSet?`, `sizes?`, `poster?`, `crossOrigin?` (photo/video; `src` required for those presets: TS discriminated union); `tone?: 'light' | 'dark'`; `grain?: boolean` (overlay grain on any preset, default `false`); `motion?: 'static' | 'drift'` (default `'static'`); `fixed?: boolean`; `className`, `children`, `ref`. Test: discriminated-union cases in `tests/types/backdrops.tsx` (NEW, same `tsc -p tests/types` harness).
- **REQ-MED-71** `aurora` derives from `AuroraBackground` (E-30): 3–4 stacked `radial-gradient()` layers from palette tokens on the decorative layer's `background-image`, **no particle DOM**, no `"use client"`. `mesh` is 4 positioned `radial-gradient()` blobs over a `linear-gradient()` base, no canvas, no `filter: blur()`. Both emit exactly 1 DOM element for the decorative layer. Test: `Backdrop.test.tsx` DOM count; stylelint forbids `filter:` in `src/backdrops/presets/*.css`.
- **REQ-MED-72** `photo` renders `<img aria-hidden="true" alt="" decoding="async" fetchpriority="high|auto">` with `object-fit: cover`. `video` renders `<video aria-hidden="true" muted playsinline loop disablepictureinpicture preload="metadata" poster>` **without** the `autoplay` attribute; `BackdropTone` (always rendered for `video`, with sampling skipped when `tone` is given) calls `play()` only while `data-ag-continuous="on"` is resolved on an ancestor (MOT, PRD-06; SC-21: `allowContinuous` true **and** motion `full`; so never under `prefers-reduced-motion: reduce`, `calm` or `none`), the element is intersecting and `document.hidden` is false; otherwise the poster is shown and the video is paused. A looping background video is continuous motion, so it follows the same `allowContinuous` gate as `drift` (architecture §8 "`allowContinuous` … gates every loop"). While playing it also renders one `<button data-ag-part="backdrop-pause" aria-pressed>` labelled "Pause background video" (visible on focus and hover, `chrome` `thin`), satisfying WCAG 2.2.2 independently of the preferences panel. The same autoplay/pause policy applies to PRD-04 `Environment video` (REQ-MAT-09 delegates it here); PRD-04 consumes it, this PRD specifies it. Test (L9 Motion): Playwright offscreen scroll → `video.paused === true` within 250 ms; default props (no `allowContinuous`) → `video.paused === true` and poster visible after 2 s; reduced-motion lane → poster frame; pause button toggles `paused`.
- **REQ-MED-73** Declaration: `photo`/`video` set `data-ag-backdrop="media"` server-side; `aurora`/`mesh` set `light|dark` from `scheme` (`auto` → `light-dark()` CSS plus `data-ag-backdrop="auto"`); `grain` alone sets nothing. Test: `renderToString` attribute assertions.
- **REQ-MED-74** `motion="drift"` animates one decorative layer via the CSS keyframe `ag-backdrop-drift` whose duration is the token `--ag-duration-ambient` (accepted addition, SC-19: MOT adds the `ambient` = 40 s value row, MOT-020, to DS's `tokens/sys/motion.tokens.json`, DS-026; no literal duration is allowed in `src/backdrops/**`, REQ-MED-80) and whose property is chosen per this PRD's §16 "Backdrop `drift`" row. The rule is nested under `[data-ag-continuous="on"]` (PRD-06 attribute, written only when `allowContinuous` is true and resolved motion is `full`; satisfies REQ-MOT-66), and is paused with `animation-play-state: paused` under `[data-ag-offscreen]` (SC-21: written by the MOT ticker's single shared IntersectionObserver, MOT-040; not a PRD-05 provider observer) and when `document.hidden`. Default output has 0 running animations. Test: `document.getAnimations().length === 0` for every preset at default props; with `data-ag-continuous="on"` exactly 1 animation named `ag-backdrop-drift`.
- **REQ-MED-75** `grain` is a static 112×112 AVIF tile (`src/backdrops/assets/grain-112.avif`, ≤8 KB, PNG fallback ≤16 KB via `image-set()`) at opacity 0.03 (`--_ag-grain-opacity`, PRD-04 `@property`), on the decorative layer only, never with `mix-blend-mode` on the host (architecture §4.5 row 2). Test: asset-size gate; computed style.
- **REQ-MED-76** Under `forced-colors: active` every preset's decorative layer is `display: none` and the root gets `background: Canvas`; under `prefers-reduced-transparency: reduce` / transparency `solid`, `photo`/`video` remain visible (content, not chrome) but glass above them resolves per PRD-05 rungs. Test: forced-colors and reduced-transparency lanes.
- **REQ-MED-77** `photo` and `video` presets ship no media assets: stories and docs use the QA licensed scenes from `certification/scenes/` (SC-28, QA-038/039, mounted in Storybook at `/scenes` via `staticDirs`), never in the npm tarball, and `src/backdrops/**` never imports from `.storybook/` or `certification/`. Test: PKG tarball file-list gate (`tests/pack/tarball-contents.test.ts`, PKG-068); import-boundary grep in `verify-media-purity.mjs`.

### 5.9 Cross-cutting

- **REQ-MED-80** `src/media/**` and `src/backdrops/**` contain no colour, blur, radius or duration literals outside token fallbacks, no `!important`, no inline `style` except custom properties listed in REQ-MED-24/31 and `--ag-media-progress`, and no `backdrop-filter`. Test: MAT `auraglass/no-optics-outside-material` + DS `auraglass/no-raw-design-values` (SC-16/SC-17) + `scripts/ci/verify-media-purity.mjs`.
- **REQ-MED-81** Every flagship (43, 44) ships the §11.3 deliverables: `<Component>.meta.ts` typed variant metadata with `migration` table (SC-27, FND-005 parts registry), `data-ag-part`/`data-state` table, selector-change table vs 4.x, registry block usage (the `media-viewer` block, SC-32: content owned here, scaffold/registration DX-075) plus this PRD's registry items, an APG keyboard script, a budget line, perf grade ≥C, environment-matrix baselines, codemod fixtures for every absorbed name. Test: `scripts/ci/verify-flagship-deliverables.mjs` (QA, PRD-19; implements its release-checklist item 4 "every flagship: §11.3 deliverables present"; created by QA-127) with entries `media-controls`, `carousel-rail`.
- **REQ-MED-82** `data-state` values: `MediaControls.Root` `playing|paused|waiting|ended|error`; `CarouselRail.Root` `autoplaying|stopped`; `ImageViewer.Stage` `zoomed|fit`; Scrubber thumb `dragging` (Base UI). Test: unit.
- **REQ-MED-83** All components accept `ref` as a prop (React 19) and forward it to the part's DOM node; no `forwardRef`. Test: FND `auraglass/no-forward-ref` (SC-16).

### 5.10 Migration

- **REQ-MED-90** (consumer of TRUST, SC-36) 4.1.1 removes `isStorybookDataMedia` and its call site (`GlassAdvancedVideoPlayer.tsx:82-83,985-986`) so `data:video/` sources play. TRUST is the only owner of 4.1.1 contents: the change is TRUST REQ-TRUST-17, built by TRUST-025 with its test `src/components/media/GlassAdvancedVideoPlayer.datasrc.test.tsx`, and released as a C-I release-note line (no `deprecations.json` entry). This PRD does not re-implement it; it only depends on it for the 4.2 C-D wiring of the same file and for AC-MED-16. 4.1.1 is published from `main` (`release/4.x` is cut from `v4.2.0`, REL §4.5). Test: TRUST's `GlassAdvancedVideoPlayer.datasrc.test.tsx` green on the 4.1.1 commit; the 4.x visual-unchanged check runs through REL's `scripts/release/visual-class.mjs` (SC-09) on QA's `certify-pr.yml` `regression` job.
- **REQ-MED-91** Every name in §9 has an entry in the repo-root `deprecations.json` (SC-02: `version: 1`, schema `docs/schemas/deprecations.schema.json`, REL-010; instance seeded by TRUST-075; this PRD adds entries by MODIFY) with the SC-03 required fields (`id` `DEP-\d{4}`, `kind`, `status`, `entry`, `symbol`, `since` 4.2.0 or 4.3.0, `removeIn` 5.0.0, `replacement`, `codemod` = `media-backdrops` or `imports-subpaths` or null, `automation`, `breaking`, `message`, `doc`) and a dev-only once-per-symbol warning at call time via `warnDeprecated(id)` from `src/internal/warnDeprecated.ts` (REL-072). Test: REL gate `scripts/release/verify-deprecations.mjs`.
- **REQ-MED-92** `npx @auraglass/cli migrate 4to5 --transform media-backdrops` (SC-33: area id `media-backdrops` registered by REL in the §11.2 catalogue and schema enum; engine `packages/cli/src/migrate/4to5/` by DX, DX-041/042) rewrites imports and props per §10 and leaves `// TODO(aura-glass 5): <reason>, see <doc>` for manual cases. This PRD supplies: the transform `packages/cli/src/migrate/4to5/transforms/media-backdrops.ts`; the mapping data as `migration` fields in each `<Component>.meta.ts` (SC-27), from which REL's `scripts/release/gen-deprecations.mjs --codemods` generates `packages/cli/src/migrate/4to5/mappings/media-backdrops.json` (no hand-written mapping file); and fixtures `packages/cli/src/migrate/4to5/__fixtures__/media-backdrops/<case>/{input,output}.tsx`. Test: fixture input/output pairs, one per absorbed name, run by the DX engine tests (`packages/cli/src/migrate/4to5/__tests__/`).
- **REQ-MED-93** `aura-glass/compat` (SC-34, owner DX: adapters at `src/compat/media/<OldName>.tsx` and `src/compat/backdrops/<OldName>.tsx`, re-exported from `src/compat/index.ts`, DX-065, each calling `warnDeprecated(id)`, REL-072; this PRD supplies the prop-mapping tables and adapter bodies) exports prop adapters over the 5.0 components for every name in the two architecture §12 media/backdrop rows: `LiquidGlassMediaControls`, `GlassMediaControls`, `LiquidGlassNowPlayingBar`, `LiquidGlassPhotoInspector` (renders a standalone `Surface layer="overlay" variant="regular"` panel with the same section markup as `ImageViewer.Inspector`), `GlassImageViewer`, `GlassCarousel`, `LiquidGlassCarouselRail`, `AuroraBackground`, `AuroraOrb`, `AtmosphericBackground`, `GlassDynamicAtmosphere`/`DynamicAtmosphere`, `GlassMeshGradient` (the "AmbientBackground variants"). **Deviation (explicit):** §12's "every losing name is re-exported from compat" is not applied to names with no 5.0 *component* successor (`GlassGallery`, `ImageList*`, `GlassLazyImage`, the three players, `GlassMediaProvider`, `GlassVoiceWaveform`, `GlassMusicVisualizer`, particle components), because §14.3 defines compat as "maps to its 5.0 component" and there is none; these get codemod TODOs and registry-item pointers instead. Test: `tests/compat/media-backdrops.compat.test.tsx` renders each of the 13 adapters with 4.x props and asserts one dev warning.

### 5.11 5.1 additions (C-E)

- **REQ-MED-95** (5.1, EXP X-43, adopts the REQ-EXP-30 contract) Registry item `media-transcript` at `registry/items/media-transcript/` (SC-32; DX registers it in `registry/registry.json`, DX-067) renders consumer-supplied cues `{ start: number; end: number; text: string; speaker?: string }[]` (or the cues of a `TextTrack` from `useMediaElement` `state.textTracks`) as an `<ol>`; the cue containing `media.currentTime` gets `aria-current="true"`; activating a cue calls `media.seek(start)`. Auto-scroll follows the active cue only while the list is not hovered or focused, and never unless resolved motion is `full`. No transcription, no network (REQ-MED-16 bans apply). Test: `registry/items/media-transcript/media-transcript.test.tsx` "click cue seeks", "aria-current follows currentTime"; DX registry render harness.

---

## 6. Files/directories affected (existing paths)

All paths verified with `rg --files` at HEAD `15b6de6f7`. "Edit" = touched by this PRD; "Delete (5.0)" = removed on `main` for 5.0 via FND's (§16 PRD-16) per-family removal PR (`scripts/removal/consumer-grep.mjs`, FND-103; `removal-gate.yml`, FND-102), after C-D in 4.2/4.3.

| Path | Action | Release |
|---|---|---|
| `src/components/media/GlassAdvancedVideoPlayer.tsx` | 4.1.1 `isStorybookDataMedia` removal is **TRUST-025** (REQ-TRUST-17; consumed here, SC-36); this PRD: C-D warning (4.2); delete (5.0) | 4.1.1 (TRUST) / 4.2 / 5.0 |
| `src/components/media/GlassAdvancedVideoPlayer.test.tsx`, `.stories.tsx`, `__snapshots__/GlassAdvancedVideoPlayer.test.tsx.snap` | 4.1.1 `data:video/` test is TRUST's `GlassAdvancedVideoPlayer.datasrc.test.tsx`; delete (5.0) | 5.0 |
| `src/components/media/LiquidGlassMediaControls.tsx` (+ `.test.tsx`, `.stories.tsx`) | C-D warning; replaced by compat adapter; delete (5.0) | 4.2 / 5.0 |
| `src/components/media/LiquidGlassNowPlayingBar.tsx` (+ `.test.tsx`, `.stories.tsx`) | as above | 4.2 / 5.0 |
| `src/components/media/LiquidGlassPhotoInspector.tsx` (+ `.test.tsx`, `.stories.tsx`) | C-D → `ImageViewer.Inspector`; delete (5.0) | 4.2 / 5.0 |
| `src/components/media/GlassAdvancedAudioPlayer.tsx` (+ test, stories, snapshot) | C-D, no direct successor (recipe); delete (5.0) | 4.2 / 5.0 |
| `src/components/media/GlassMediaProvider.tsx` (+ test, stories, snapshot) | C-D → `useMediaElement`; delete (5.0) | 4.2 / 5.0 |
| `src/components/media/GlassAdvancedMediaPlayer.stories.tsx` | delete (5.0) | 5.0 |
| `src/components/media/index.ts` | Edit (deprecation re-exports); delete (5.0) | 4.2 / 5.0 |
| `src/components/interactive/GlassVideoPlayer.tsx` (+ test, stories, snapshot) | C-D; delete (5.0) | 4.2 / 5.0 |
| `src/components/interactive/GlassImageViewer.tsx` (+ test, stories, snapshot) | C-D → `ImageViewer`; delete (5.0) | 4.2 / 5.0 |
| `src/components/interactive/GlassGallery.tsx` (+ test, stories, snapshot) | C-D → `ImageViewer` + registry item `media-gallery`; delete (5.0) | 4.2 / 5.0 |
| `src/components/interactive/GlassLazyImage.tsx` (+ test, stories, snapshot) | C-D → native `<img>`; delete (5.0) | 4.2 / 5.0 |
| `src/components/interactive/GlassCarousel.tsx` (+ test, stories, snapshot) | C-D → `CarouselRail`; delete (5.0) | 4.2 / 5.0 |
| `src/components/interactive/index.ts` | Edit (warnings) | 4.2 |
| `src/components/data-display/LiquidGlassCarouselRail.tsx` (+ test, stories) | C-D → `CarouselRail`; delete (5.0) | 4.2 / 5.0 |
| `src/components/data-display/index.ts` | Edit (warnings) | 4.2 |
| `src/components/image-list/ImageList.tsx`, `ImageListItem.tsx`, `ImageListItemBar.tsx` (+ `.module.css`, `types.ts`, tests, stories, snapshots) | C-D → T2 `Grid` + `ImageViewer.Trigger` (registry item `media-gallery`); delete (5.0) | 4.3 / 5.0 |
| `src/components/social/GlassVoiceWaveform.tsx` (+ test, stories, snapshot) | C-D → `Waveform level`; delete (5.0) | 4.2 / 5.0 |
| `src/components/ai/GlassMusicVisualizer.tsx` (+ test, stories, snapshot) | C-D → `Waveform` (consumer-supplied peaks); delete (5.0) | 4.2 / 5.0 |
| `src/components/marketing/AuroraBackground.tsx` (+ `.test.tsx`, `.stories.tsx`), `AuroraOrb.tsx` (+ test, stories) | C-D → `Backdrop preset="aurora"`; compat adapters for both (REQ-MED-93) | 4.2 / 5.0 |
| `src/components/marketing/marketing.css` (`:372-396`, `:888-963` aurora rules) | Source for `src/backdrops/presets/aurora.css`; aurora rules deleted (5.0) | 5.0 |
| `src/components/marketing/index.ts`, `src/marketing/index.ts` | Edit (warnings) | 4.2 |
| `src/components/backgrounds/AtmosphericBackground.tsx`, `GlassDynamicAtmosphere.tsx`, `ParticleBackground.tsx`, `types.ts`, `*.module.css`, tests, stories, snapshots | C-D; delete (5.0) | 4.2 / 5.0 |
| `src/components/advanced/GlassMeshGradient.tsx`, `GlassParticles.tsx` (+ tests, stories, snapshots) | C-D; delete (5.0) | 4.2 / 5.0 |
| `src/components/immersive/GlassParticleField.tsx` (+ test, stories, snapshot) | C-D → labs `ParticleField` (§13.4); delete (5.0) | 4.2 / 5.0 |
| `src/primitives/LiquidGlassBackdropSampler.tsx` (+ test), `src/hooks/useLiquidGlassBackdrop.ts` (+ test), `src/components/primitives/LiquidGlassBackdropSampler.stories.tsx` | **Owned by PRD-04** (its §9 row). This PRD supplies the successor and the migration text only | — |
| `src/index.ts` (`:20-22`, `:57-61`, `:275` `export * from "./components/marketing"`, `:331-333`, `:404`, `:434`, `:451`, `:504`, `:721-730`) | Edit (4.2 warnings via `deprecations.json`); remove (5.0) | 4.2 / 5.0 |
| `src/icons/media/index.ts` | Glyph lineage only; the 5.0 controls import per-glyph modules from `src/icons/glyphs/**` (NEW, PRD-02); the `./icons/media` category subpath is removed in 5.0 by the packaging PRD | — |
| `src/theme/color.ts` | Consumed (single luminance helper, architecture §7) | — |
| `.storybook/StorySurface.tsx`, `.storybook/preview.tsx` | Replaced by SB's `StoryEnvironment`/`StoryRoot` decorator and `environment` global in `.storybook/preview.tsx` (SB-048, SC-31; reading QA `certification/scenes/`, SC-28); this PRD edits neither file and adds no surface | — |
| `build/exports.manifest.json` (NEW, PKG-005; generates `package.json#exports`, SC-12) | MODIFY: add rows `./media`, `./media.css`, `./backdrops`, `./backdrops.css` | 5.0 |
| `deprecations.json` (repo root; seeded by TRUST-075 in 4.1.1 with `version: 1`, schema `docs/schemas/deprecations.schema.json` REL-010, SC-02; absent at HEAD) | MODIFY: add entries listed in §9 | 4.2 / 4.3 |
| `docs/size-budgets.json` (NEW, PKG-048; gate `scripts/ci/verify-size-budgets.mjs` PKG-049, SC-15) | MODIFY: add the §16 byte rows | 5.0 |
| `tests/perf/harness/budgets.json` (NEW, PERF-044, SC-15) | MODIFY: add the §16 runtime rows (fps, long tasks, sampling) for flagships 43/44 | 5.0 |
| `.github/workflows/glass-pipeline.yml` (PKG, SC-10) | MODIFY: one step in the existing `Glass Quality Gates` job running `verify:media-purity` (no new required check name) | 5.0 |
| `tests/types/tsconfig.json` (existing harness) | Consumed by `tests/types/media.tsx`, `tests/types/backdrops.tsx` (NEW) | 5.0 |
| `tests/exports/` (existing directory) | Add `media-backdrops-subpath.spec.mjs`, `root-no-media.spec.mjs` (NEW) | 5.0 |

REMOVE-class names with no successor (`AuroraPro` + `AuroraPro.r3f.tsx`, `SeasonalParticles`, `GlassAuroraDisplay`, `GlassNebulaClouds`, `GlassImageProcessingProvider`, `GlassIntelligentImageUploader`, `GlassSpatialAudio`) are deleted by **FND** (§16 PRD-16); this PRD only supplies the codemod pointer to `Backdrop preset="aurora"` where one exists. The §12 row "AmbientBackground variants" has no file named `AmbientBackground*` in `src/` (verified); it refers to the `backgrounds/` and `advanced/` families above.

---

## 7. Components affected

| 4.x component | Inventory score / disposition | 5.0 outcome |
|---|---|---|
| `LiquidGlassMediaControls` (+ alias `GlassMediaControls`) | 5.5 POLISH | → `MediaControls` (flagship 43); compat adapter |
| `LiquidGlassNowPlayingBar` | 5.5 POLISH | → `NowPlayingBar` (flagship 43); compat adapter |
| `LiquidGlassPhotoInspector` | 5 CONSOLIDATE | → `ImageViewer.Inspector` |
| `GlassImageViewer` | 4.5 POLISH | → `ImageViewer`; compat adapter |
| `GlassGallery` | 3.5 REDESIGN | → `ImageViewer items` + registry item `media-gallery` |
| `ImageList`, `ImageListItem`, `ImageListItemBar` | 5 POLISH | → registry item `media-gallery` (T2 `Grid` + `ImageViewer.Trigger`) |
| `GlassLazyImage` | 3.5 REDESIGN | → native `<img>` (no component) |
| `GlassCarousel` | 2.5 REPLACE | → `CarouselRail` (flagship 44) |
| `LiquidGlassCarouselRail` | POLISH | → `CarouselRail` (flagship 44); compat adapter |
| `GlassVideoPlayer` | 3 CONSOLIDATE | → `useMediaElement` + `MediaControls` over native `<video>` (registry item `media-video-player`) |
| `GlassAdvancedVideoPlayer` | 2.5 REDESIGN | as above |
| `GlassAdvancedAudioPlayer` | 2.5 REDESIGN | → registry item `media-audio-player` (`useMediaElement` + `MediaControls` + `Waveform`) |
| `GlassMediaProvider` | 1.5 REPLACE | → `useMediaElement` (+ `mediaSession` option) |
| `GlassVoiceWaveform` | 3.4 REDESIGN | → `Waveform level` |
| `GlassMusicVisualizer` | 3 CONSOLIDATE | → `Waveform peaks` (no analyser in library) |
| `AuroraBackground` | **7 POLISH** | → `Backdrop preset="aurora"`; compat adapter |
| `AuroraOrb` | POLISH | → `Backdrop preset="aurora"` (single-blob `palette`) |
| `AtmosphericBackground`, `GlassDynamicAtmosphere` | CONSOLIDATE | → `Backdrop preset="aurora"|"mesh"` |
| `GlassMeshGradient` | 3 REDESIGN | → `Backdrop preset="mesh"` |
| `ParticleBackground`, `GlassParticles`, `GlassParticleField` | CONSOLIDATE | → labs `ParticleField` (rebuilt, §13.4); no core successor |
| `LiquidGlassBackdropSampler`, `useLiquidGlassBackdrop` | POLISH (PRD-04 row) | → `Backdrop` / `useMediaElement({ sampleTone })` for owned media; `data-ag-backdrop` for DOM |

---

## 8. New components/files

| Path (all NEW) | Content |
|---|---|
| `src/media/index.ts` | `./media` entry (REQ-MED-01) |
| `src/media/useMediaElement.ts`, `src/media/mediaStore.ts` | Headless core (§5.2) |
| `src/media/formatMediaTime.ts` | `formatMediaTime(seconds, { spoken?: boolean; hours?: 'auto' | 'always' })` → `"1:32"` / `"1 minute 32 seconds"`; `NaN` → `"--:--"` / `"unknown duration"`; uses `Intl.NumberFormat` only |
| `src/media/MediaControls/{MediaControls.tsx,parts/*.tsx,MediaControls.meta.ts}` | Flagship 43 controls (`*.meta.ts` per SC-27, incl. `migration` table) |
| `src/media/MediaScrubber/{MediaScrubber.tsx,BufferedLayer.tsx,ChapterMarkers.tsx}` | §5.3 |
| `src/media/NowPlayingBar/{NowPlayingBar.tsx,parts/*.tsx,NowPlayingBar.meta.ts}` | Flagship 43 bar |
| `src/media/Waveform/{Waveform.tsx,WaveformLevel.tsx,downsample.ts,Waveform.meta.ts}` | §5.4 (5.1) |
| `src/media/ImageViewer/{ImageViewer.tsx,parts/*.tsx,useZoomPan.ts,ImageViewer.meta.ts}` | §5.5 |
| `src/media/CarouselRail/{CarouselRail.tsx,parts/*.tsx,useCarouselIndex.ts,CarouselRail.meta.ts}` | Flagship 44 |
| `src/media/sampling/{sampleOwnedPixels.ts,classifyTone.ts,toneCache.ts}` | §5.7 |
| `src/media/media.css` | `./media.css` |
| `src/media/__tests__/*` | §12 |
| `packages/cli/src/migrate/4to5/transforms/media-backdrops.ts`, `packages/cli/src/migrate/4to5/__fixtures__/media-backdrops/<case>/{input,output}.tsx` | §10 transform and fixtures (SC-33; engine DX-041, catalogue DX-042, id registered by REL). Mapping data lives in the `migration` fields of each `*.meta.ts`; `mappings/media-backdrops.json` is generated by `gen-deprecations.mjs --codemods` (REL-070) |
| `src/backdrops/index.ts`, `Backdrop.tsx`, `BackdropTone.tsx` | §5.8 |
| `src/backdrops/presets/{aurora.css,mesh.css,grain.css,media.css}`, `src/backdrops/backdrops.css` | Preset CSS |
| `src/backdrops/assets/grain-112.avif`, `grain-112.png` | Grain tile (REQ-MED-75) |
| `src/backdrops/__tests__/*` | §12 |
| `src/media/*.stories.tsx`, `src/backdrops/Backdrop.stories.tsx` | §13 (component stories owned here; SB story contract, SC-31) |
| `registry/items/{media-video-player,media-audio-player,media-gallery,media-now-playing,backdrop-hero}/` | `registry:item`s (SC-32 layout `registry/{base,blocks,items}/<id>/`; not blocks, since SC-32 fixes exactly 10 GA blocks). DX owns the schema, `registry/registry.json` (DX-067), build `scripts/registry/build.mjs`, lint and render harness; this PRD supplies the item sources and render-gate fixtures. `media-transcript` (REQ-MED-95) follows in 5.1 |
| `registry/blocks/media-viewer/` (scaffolded by DX-075) | Block **content** owned here (SC-32): MediaControls, ImageViewer and CarouselRail composition |
| `showcase/music-player/`, `showcase/media-workspace/` (files owned by SB: SB-113, SB-110) | Compositions and fixtures supplied here (SC-31) |
| `src/media/sampling/__fixtures__/scene-stats.json`, `src/media/__fixtures__/peaks-voice.json` | Test fixtures (REQ-MED-61, §13) |
| `tests/types/media.tsx`, `tests/types/backdrops.tsx` | Type tests (REQ-MED-10, -67, -70) |
| `tests/a11y/apg/{media-controls,image-viewer,carousel-rail}.apg.spec.ts`, `tests/media/*.spec.ts`, `tests/backdrops/*.spec.ts`, `tests/visual/media/*.spec.ts`, `tests/perf/browser/{media-playback,media-sampling,backdrops-presets}.spec.ts` | Remote lanes (§12.2; naming per SC-30) |
| `etc/api/{media,backdrops}.api.md`, `etc/api/{media,backdrops}.exports.json` | REL API reports and export snapshots (SC-04; generated, never hand-edited) |
| `scripts/ci/verify-media-purity.mjs` | AST gate (REQ-MED-16/26/67/80) |
| `src/compat/media/<OldName>.tsx`, `src/compat/backdrops/<OldName>.tsx` | 13 compat adapters (SC-34; re-exported from `src/compat/index.ts`, DX-065) |
| `tests/compat/media-backdrops.compat.test.tsx`, `tests/exports/media-backdrops-subpath.spec.mjs`, `tests/exports/root-no-media.spec.mjs` | Gates |

---

## 9. Components/files to remove or deprecate

| Name | 4.x C-D | 5.0 | Successor | Compat export |
|---|---|---|---|---|
| `isStorybookDataMedia` (internal) | — | removed in **4.1.1** (§13.1) by TRUST-025 (REQ-TRUST-17; release-note line, no entry) | none | — |
| `LiquidGlassMediaControls`, `GlassMediaControls` | 4.2 | C-B removed from root | `MediaControls` | yes |
| `LiquidGlassNowPlayingBar` | 4.2 | removed | `NowPlayingBar` | yes |
| `LiquidGlassPhotoInspector` | 4.2 | removed | `ImageViewer.Inspector` | yes |
| `GlassImageViewer` | 4.2 | removed | `ImageViewer` | yes |
| `GlassGallery` | 4.2 | removed | `ImageViewer` + item `media-gallery` | no |
| `ImageList`, `ImageListItem`, `ImageListItemBar` (+ `Glass*` aliases) | 4.3 | removed | item `media-gallery` | no |
| `GlassLazyImage` | 4.2 | removed | native `<img>` | no |
| `GlassCarousel` | 4.2 | removed | `CarouselRail` | yes |
| `LiquidGlassCarouselRail` | 4.2 | removed | `CarouselRail` | yes |
| `GlassVideoPlayer`, `GlassAdvancedVideoPlayer`, `GlassAdvancedAudioPlayer` | 4.2 | removed | `useMediaElement` + `MediaControls` items | no |
| `GlassMediaProvider` (+ `useMedia*` context hooks it exports) | 4.2 | removed | `useMediaElement` | no |
| `GlassVoiceWaveform`, `GlassMusicVisualizer` | 4.2 | removed | `Waveform` (5.1; "no successor until 5.1" in the 4.2 entry) | no |
| `AuroraBackground` | 4.2 | removed from root | `Backdrop preset="aurora"` | yes |
| `AuroraOrb`, `AtmosphericBackground`, `DynamicAtmosphere`/`GlassDynamicAtmosphere`, `GlassMeshGradient` | 4.2 | removed | `Backdrop` | yes |
| `ParticleBackground`, `GlassParticles`, `GlassParticleField` | 4.2 | removed | labs `ParticleField` | no |
| `AuroraPro`, `SeasonalParticles`, `GlassAuroraDisplay`, `GlassNebulaClouds` | 4.2 (FND, §16 PRD-16) | deleted (REMOVE) | codemod hint `Backdrop preset="aurora"` | no |
| `LiquidGlassBackdropSampler`, `useLiquidGlassBackdrop` | 4.2 (MAT, PRD-04) | deleted | `data-ag-backdrop`, `Backdrop`, `useMediaElement({ sampleTone })` | no |

---

## 10. API changes

Compatibility classes per D-27: **C-I** internal, **C-E** additive, **C-D** deprecation, **C-B** breaking (5.0 only, after a 4.x C-D).

| # | Change | Class | Codemod (`migrate 4to5 media-backdrops`) |
|---|---|---|---|
| API-MED-01 | New entries `aura-glass/media`, `aura-glass/media.css`, `aura-glass/backdrops`, `aura-glass/backdrops.css` | C-E (5.0) | — |
| API-MED-02 | `isStorybookDataMedia` behaviour removed: `data:video/` sources play (built by TRUST-025, SC-36) | C-I (4.1.1, bug fix) | — |
| API-MED-03 | `LiquidGlassMediaControls` / `GlassMediaControls` → `MediaControls.Root` with parts. Props kept: `playing`, `currentTime`, `duration`, `volume`, `variant`, `onSeek(value)`, `onVolumeChange(value)`. Renamed: `onPlayPause()` → `onPlayingChange(next)`. Removed: `localDimming` (the PRD-04 `clear` scrim is automatic over `media`), `compact` (compose fewer parts) | C-D 4.2 → C-B 5.0 | mostly: import + name + `onPlayPause` → `onPlayingChange={() => onPlayPause()}`; `compact` → children `<PlayButton/><Scrubber/>`; default children reproduce the 4.x layout `<PlayButton/><Scrubber/><Time/><Volume/>` |
| API-MED-04 | `LiquidGlassNowPlayingBar` → `NowPlayingBar` parts; `title`, `subtitle`, `artwork` (ReactNode → `Artwork` child or `src`), `progress`, `playing` map to parts/props; `onPlayPause` → `onPlayingChange`; `onExpand` → `onExpandedChange` + required `expandedId`; text-word buttons replaced by icon buttons with the same accessible names | C-D → C-B | mostly |
| API-MED-05 | `GlassImageViewer` → `ImageViewer`; `images: ImageViewerImage[]` (`src`, `alt?`, `title?`, `description?`, `width?`, `height?`; `GlassImageViewer.tsx:24-37`) → `items: {id, src, alt, caption?, width?, height?}[]`; `initialIndex` → `defaultValue: id`; `alt` becomes **required** (a11y); `title`/`description` → `caption`; `enableRotation`, `showDownloadButton`, `autoPlay`/`autoPlayInterval`, `zoomLevels` dropped; `minZoom`/`maxZoom` fixed 1–8× | C-D → C-B | partial: generates ids `img-<index>`, maps `alt` (inserts `alt: '' /* TODO */` when absent) |
| API-MED-06 | `GlassGallery enableLightbox` → `ImageViewer` + registry item `media-gallery` | C-D → C-B | manual (TODO comment) |
| API-MED-07 | `GlassCarousel`, `LiquidGlassCarouselRail` → `CarouselRail`; `items: CarouselItem[]` → `<CarouselRail.Slide>` children; `initialIndex` → `defaultIndex`; `infinite` → `loop`; `slidesToShow` → `slidesPerView`; `autoPlay` + `autoPlayInterval` → `autoplay={{ interval }}` (default now off, interval ≥5000, and it rotates only with `AuraGlassProvider allowContinuous` + resolved motion `full`, SC-38; the codemod adds a TODO when no provider opt-in is found); `showArrows` → `<Prev/><Next/>`; `showDots`/`showIndicators` → `<Indicators/>`; `enableKeyboard`, `enableSwipe`, `animationDuration`, `slidesToScroll` dropped (always on / tokenised / native snap); `pauseOnHover` always on; required `label` | C-D → C-B | mostly |
| API-MED-08 | Players (`GlassVideoPlayer`, `GlassAdvancedVideoPlayer`, `GlassAdvancedAudioPlayer`) → native element + `useMediaElement` + `MediaControls`; no successor component | C-D → C-B | manual: replaced with registry item pointer (`media-video-player` / `media-audio-player`) |
| API-MED-09 | `GlassMediaProvider` context → `useMediaElement(ref)`; transcription/AI props have no successor (D-30) | C-D → C-B | manual |
| API-MED-10 | `GlassVoiceWaveform`, `GlassMusicVisualizer` → `Waveform` (5.1, C-E) with required `label` and consumer `peaks`/`level`; at 5.0.0 there is no successor export | C-D → C-B | manual |
| API-MED-11 | `AuroraBackground` → `Backdrop preset="aurora"`; kept: `palette`, `grain`, `fixed`; `motion` `"none"|"subtle"` → `"static"`, `"full"` → `"drift"` (which now also needs `AuraGlassProvider allowContinuous`; the codemod adds a TODO when no provider opt-in is found); dropped: `intensity` (fixed per preset), `particles` and `seed` (no particles), `vignette`, `reducedMotion` (the OS/user preference store decides, PRD-05) | C-D → C-B | full |
| API-MED-12 | `GlassMeshGradient`, `AtmosphericBackground`, `GlassDynamicAtmosphere`, `AuroraOrb` → `Backdrop preset="mesh"|"aurora"` | C-D → C-B | mostly (preset chosen per mapping table). **Deviation:** architecture §12 rates this row "full"; `GlassMeshGradient` `colors[]` (`GlassMeshGradient.tsx:72-77`), `AtmosphericBackground` `variant`/`weather`/`colorScheme` (`backgrounds/types.ts:4-12`) and `DynamicAtmosphere` `type`/`primaryColor`/`secondaryColor` (`GlassDynamicAtmosphere.tsx:53-67`) are free-form colours or weather modes with no 1:1 mapping onto the 5 tokenised `palette` values, so the codemod emits TODOs for those props and the compat adapters (REQ-MED-93) cover runtime |
| API-MED-13 | Particle components removed from core (labs) | C-D → C-B | manual (TODO with labs import) |
| API-MED-14 | New attribute `data-ag-media-tone` and custom properties `--ag-media-luma`, `--ag-media-progress` | C-E | — |
| API-MED-15 | New tokens `--ag-scrim-media` (DS row) and `--ag-duration-ambient` (MOT value row in DS's motion token file), accepted in SC-19 | C-E | — |
| API-MED-16 | `LiquidGlassBackdropSampler` render-prop `sample.contrastHint`/`requiresDimming` → none; the declaration is static and dimming is the PRD-04 automatic `clear` scrim | C-D → C-B | manual |
| API-MED-17 | Root no longer exports any media/backdrop name (moved to subpaths) | C-B | `imports-subpaths` (full) |
| API-MED-18 | Visible pixel change on every absorbed component (new material) | C-B (5.0 only, D-27 visual rule) | — |

---

## 11. Migration concerns

1. **Media behaviour moves to the consumer's element.** 4.x players rendered their own `<video>`/`<audio>` and owned `src`; 5.0 never sets `src`. The codemod cannot safely synthesise the element for `GlassAdvancedVideoPlayer`; it inserts the `media-video-player` registry item pointer and a TODO. Docs show a 12-line before/after.
2. **Default variant over non-media.** `MediaControls` defaults to `clear`. With no `media` backdrop declared ancestor, D-12 renders it as `regular` and logs a dev warning. Apps that placed media controls over a page background will see `regular` glass, not clear: intended.
3. **Autoplay defaults flip.** `GlassCarousel` autoplay, ambient backdrop animation and background-video playback are now off by default and all three are loops gated by `allowContinuous` + resolved motion `full` (SC-38) (`autoplay=false`, `motion="static"`, `allowContinuous=false`; `Backdrop preset="video"` shows its poster until `data-ag-continuous="on"` resolves, REQ-MED-72). Marketing pages that relied on motion must opt in explicitly (`AuraGlassProvider allowContinuous` + `motion="drift"` or `autoplay`); reduced-motion users can never be opted in (PRD-06).
4. **Cross-origin images lose tone, not legibility.** Apps serving photos from a CDN without CORS get no `data-ag-media-tone`; the solved `media` floor still applies. Remedy: `crossOrigin="anonymous"` + `Access-Control-Allow-Origin`, or `tone` precomputed with `@auraglass/cli sample-media` (DX request, §21).
5. **Keyboard shortcuts are scoped.** Apps that relied on Space anywhere on the page to toggle the 4.x video player lose that (by design, E-06). `shortcutTarget` lets an app extend the scope to a larger container it owns.
6. **`ImageViewer` requires `alt` per item.** TypeScript will flag missing `alt`; the codemod inserts empty strings with TODO comments, which the PRD-19 a11y lane flags as decorative-in-a-dialog warnings until filled.
7. **Particles leave core.** `@auraglass/labs` is 0.x outside semver (D-16); apps using particle backgrounds take a labs dependency or drop them.
8. **4.x sampler consumers.** Components that read `sample.contrastHint` to switch text colour must declare `data-ag-backdrop` instead; the migration guide (DX, §16 PRD-20) generates this section from `deprecations.json`.
9. **Snapshot churn.** Every absorbed name has visible pixel changes (API-MED-18); consumers' visual baselines must be re-recorded on the 5.0 upgrade, never on 4.x maintenance branches (D-27).
10. **Bundle shape.** `AuroraBackground` is re-exported from root via `export * from "./components/marketing"` (`src/index.ts:275`), and the 4.x `aura-glass/marketing` subpath resolves to the same root bundle (`package.json:159-162` maps `import` to `./dist/index.mjs`), so consumers pull the 5.76 MB root file, which tree-shakes to only about 1.98 MB minified for a single import (PERFORMANCE-01). `aura-glass/backdrops` is ≤1.5 KB gz server JS plus ≤2 KB for the `BackdropTone` island (photo/video only, §16). No action needed beyond the import path codemod.

---

## 12. Tests required

Unit/component tests run in jest (`npm test`, QA's `jest.config.js`, QA-003; QA lane L12 Unit); browser, APG, visual, perf and engine lanes run **remotely** in the QA harness (`certification/playwright.cert.config.ts`, QA-018; workflows `certify-pr.yml` / `certify-main.yml` / `certify-release.yml`, SC-29; never local Docker or local browser farms). Lane names follow SC-29 (L5 Behaviour, L6 Environment visual, L7 Pixel regression, L8 Engine-specific, L9 Motion, L10 Performance). File naming follows SC-30. All files NEW unless noted.

### 12.1 Unit and component (jest)

| File | Asserts |
|---|---|
| `src/media/__tests__/useMediaElement.test.tsx` | Every wired event updates the matching `MediaState` field (REQ-MED-11); commands call native methods; `NotAllowedError` → `autoplay-blocked` (REQ-MED-14); listeners removed on unmount/ref change (REQ-MED-18) |
| `src/media/__tests__/useMediaElement.throttle.test.tsx` | 60 `timeupdate`/s → ≤4 consumer renders; `snapshotHz` clamp 1–15; discrete events publish immediately (REQ-MED-12) |
| `src/media/__tests__/useMediaElement.raf.test.tsx` | 0 rAF callbacks when paused, hidden or offscreen; loop stops within 1 frame (REQ-MED-13) |
| `src/media/__tests__/useMediaElement.ssr.test.tsx` | Server snapshot values; `hydrateRoot` with 0 `console.error` (REQ-MED-17) |
| `src/media/__tests__/useMediaElement.session.test.tsx` | `navigator.mediaSession` metadata + 5 action handlers set/cleared; untouched when `false` (REQ-MED-15) |
| `tests/types/media.tsx`, `tests/types/backdrops.tsx` (`tsc -p tests/types --noEmit`) | Signature and negative cases (non-media ref rejected; `photo`/`video` without `src` rejected) (REQ-MED-10, -67, -70) |
| `src/media/__tests__/formatMediaTime.test.ts` | `0`→`"0:00"`, `92`→`"1:32"`, `3725`→`"1:02:05"`, spoken forms, `NaN`→`"--:--"`/`"unknown duration"` |
| `src/media/__tests__/MediaControls.parts.test.tsx` | Every part's `data-ag-part`; `data-state` values (REQ-MED-20, -82) |
| `src/media/__tests__/MediaControls.controlled.test.tsx` | Controlled vs headless DOM equivalence; dev error when both supplied (REQ-MED-21) |
| `src/media/__tests__/MediaControls.shortcuts.test.tsx` | Shortcuts only with focus inside root; Space in external `<input>` does not toggle; `shortcutTarget` extends scope (REQ-MED-26) |
| `src/media/__tests__/MediaControls.a11y.test.tsx` | jest-axe 0 violations for default, clear, captions-menu states; `aria-pressed` on toggles (REQ-MED-27, -29) |
| `src/media/__tests__/MediaScrubber.test.tsx` | `aria-valuetext` for 0/92/3725/NaN; buffered and chapter layers; one `onValueCommit` per drag (REQ-MED-23..25) |
| `src/media/__tests__/NowPlayingBar.test.tsx` | `role="progressbar"` values; no inline `width`; `aria-expanded`/`aria-controls`; dev error without `expandedId`; one tone sample per artwork `src` (REQ-MED-30..33) |
| `src/media/__tests__/Waveform.test.tsx` (5.1) | 1 `<svg role="img">`, ≤2 paths; 10,000 peaks → `bars` columns; deterministic `d` snapshot; SSR with `peaks` (REQ-MED-35..38) |
| `src/media/__tests__/ImageViewer.test.tsx` | Id-keyed navigation; filter-then-open regression (REQ-MED-43); ≤3 stage `<img>` (REQ-MED-47); counter announcement once per navigation (REQ-MED-45) |
| `src/media/__tests__/CarouselRail.test.tsx` | ARIA roles/roledescriptions/labels; Prev/Next disabled at ends; autoplay never starts under reduced motion or `motion!=='full'`; pauses on hover/focus/hidden (REQ-MED-50, -51, -53, -54) |
| `src/media/sampling/__tests__/sampleOwnedPixels.test.ts` | `computeLumaStats` on synthetic RGBA buffers: white/black/split within ±0.001 (REQ-MED-60) |
| `src/media/sampling/__tests__/classifyTone.test.ts` | 8-scene stats table → expected tone (REQ-MED-61) |
| `src/media/sampling/__tests__/toneCache.test.ts` | Once-per-key; LRU eviction at 65th entry; 100 `timeupdate` + 10 `seeked` → 1 `getImageData` (REQ-MED-63) |
| `src/media/sampling/__tests__/sampleErrors.test.ts` | `SecurityError`, decode failure, zero-size → `null`, one dev warn with exact message, silent in production (REQ-MED-65) |
| `src/backdrops/__tests__/Backdrop.ssr.test.tsx` | `renderToString` per preset in node env; declared `data-ag-backdrop` per REQ-MED-73; no `"use client"` in server modules (REQ-MED-04) |
| `src/backdrops/__tests__/Backdrop.test.tsx` | 1 decorative element for aurora/mesh; no particle nodes; `getAnimations().length === 0` at defaults (REQ-MED-71, -74) |
| `src/backdrops/__tests__/BackdropTone.test.tsx` | Only `data-ag-media-tone` and `--ag-media-luma` mutated; skipped when `tone` given; video `play()` not called without `data-ag-continuous="on"`; paused when offscreen/hidden; pause button toggles (REQ-MED-62, -72) |
| `tests/exports/media-backdrops-subpath.spec.mjs`, `tests/exports/root-no-media.spec.mjs` | Export lists (REQ-MED-01, -02) |
| `tests/compat/media-backdrops.compat.test.tsx` | 13 adapters render with 4.x props, warn once (REQ-MED-93) |
| `src/components/media/GlassAdvancedVideoPlayer.datasrc.test.tsx` (TRUST-025, consumed; 4.1.1 commit on `main`) | "plays data:video/ source" (REQ-MED-90; owned by TRUST REQ-TRUST-17) |

### 12.2 Remote browser lanes (PRD-19 harness)

APG specs live at `tests/a11y/apg/<kebab-component>.apg.spec.ts` (SC-30, one file per widget, owned here) and run through the A11Y harness `tests/a11y/apg/harness.ts` (A11Y-073) in L5 Behaviour (`certification/lanes/behaviour.spec.ts`, QA-082); perf specs live at `tests/perf/browser/<area>-<name>.spec.ts` and run through the PERF harness `tests/perf/harness/run-perf.mjs` (PERF-039) in L10 Performance; visual pixel specs live in `tests/visual/media/`.

| File | Lane | Asserts |
|---|---|---|
| `tests/a11y/apg/media-controls.apg.spec.ts` | L5 Behaviour, Chromium/WebKit/Gecko | Toolbar roving; slider arrow semantics; Tab exits (REQ-MED-22) |
| `tests/media/MediaScrubber.drag.spec.ts` | L5 Behaviour | ≤30 seeks over 30 frames, 1 commit (REQ-MED-25) |
| `tests/a11y/apg/image-viewer.apg.spec.ts` | L5 Behaviour | Dialog focus in/out, `inert`, Escape stack, keys, zoom/pan/pinch, page scroll not prevented at 1× (REQ-MED-41, -42, -44) |
| `tests/a11y/apg/carousel-rail.apg.spec.ts` | L5 Behaviour | APG carousel script (tabs and buttons variants), axe 0, swipe → `onIndexChange` (REQ-MED-51..53) |
| `tests/media/NowPlayingBar.container.spec.ts` | L5 Behaviour (responsive fixtures) | 320/360/600 px container behaviour (REQ-MED-34) |
| `tests/media/media-sampling.spec.ts` | L8 Engine-specific | Real canvas readback on `flat-white`/`flat-black` within ±0.001; CORS-less image → no tone + warn; CORS image → tone (REQ-MED-60, -65) |
| `tests/backdrops/Backdrop.motion.spec.ts` | L9 Motion | 0 animations and paused `video` at default; drift and video playback only with `data-ag-continuous="on"`; paused offscreen; reduced-motion → poster for video (REQ-MED-72, -74) |
| `tests/backdrops/Backdrop.modes.spec.ts` | L6 Environment visual (forced-colors, reduced-transparency axes) | Decorative layer hidden, `Canvas` root (REQ-MED-76) |
| `tests/visual/media/clear-over-media.spec.ts` | L6 Environment visual + L7 Pixel regression (tolerance from REL `visual-class.mjs`, SC-09) | The **clear-over-media scene** (§15): `MediaControls` and `NowPlayingBar variant="clear"` over 8 scenes × {light, dark} × {glass, tinted, solid} × {default, contrast more, forced colors, reduced motion} × tier {lightweight, standard, enhanced (Chromium only)} × {1440, 390}; pixel gates + OCR contrast; tone on/off comparison (REQ-MED-66) |
| `tests/visual/media/flagships.spec.ts` | L6 Environment visual + L7 Pixel regression | `ImageViewer` chrome, `CarouselRail` over media and over flat scenes |
| `tests/perf/browser/media-playback.spec.ts` | L10 Performance | Scripted 30 s playback + 3 scrubs: FPS, long tasks, React commits (§16) |
| `tests/perf/browser/media-sampling.spec.ts` | L10 Performance | `ag:sample` ≤4 ms at 4× throttle (REQ-MED-64) |
| `tests/perf/browser/backdrops-presets.spec.ts` | L10 Performance | Static and drift presets: 0 main-thread work per frame at rest |

### 12.3 Static gates

All run in QA lane L1 Static or L2 Artifact. `scripts/ci/verify-media-purity.mjs` (REQ-MED-16, -26, -67, -77, -80; a step in the PKG-owned `glass-pipeline.yml` `Glass Quality Gates` job, SC-10), MAT `auraglass/no-optics-outside-material` scoped to `src/media/**` and `src/backdrops/**`, DS `auraglass/no-raw-design-values` (ESLint + stylelint; `!important`, `filter:`, colour and duration literals; gate `scripts/tokens/gates/literals.mjs`, SC-17), MOT `auraglass/motion-*` continuous-gating rule (REQ-MOT-66, MOT-071), PERF `auraglass/raf-requires-cancel` / `raf-requires-visibility-gate` (REQ-PERF-28), PKG `auraglass/use-client-required` directive lint, side-effect gate (PKG-042), size budget gate `scripts/ci/verify-size-budgets.mjs` (PKG-049, §16), tarball gate (PKG-068, REQ-MED-77), QA `verify-flagship-deliverables.mjs` (REQ-MED-81).

---

## 13. Storybook requirements

All stories render inside SB's single decorator (`AuraGlassProvider` + `StoryEnvironment` + `StoryRoot`, `.storybook/preview.tsx`, SB-048, SC-31) with its `environment` global over the 8 QA scenes (`certification/scenes/scenes.manifest.json`, QA-039, SC-28), plus scheme and preference toolbars. Component story files `src/**/<Name>.stories.tsx` are owned here and follow SB's story contract (tags, `Keyboard` story, generated matrices via `.storybook/contract/defineComponentStories.tsx`, SB-071); this PRD never edits `.storybook/preview.tsx`. No story uses `previewSurface`, hand-rolled `backdropFilter` style objects, `!important`, Storybook-only component props, or generated "Default/Variants" stubs (STORYBOOK-SHOWCASE-02/-06). Copy is product-realistic (track titles, photo captions), never self-referential.

| Story file (NEW) | Stories (exact names) |
|---|---|
| `src/media/MediaControls.stories.tsx` | `Over Video (Clear)`, `Over Photo (Clear)`, `Over Flat Canvas (falls back to Regular)` (shows the D-12 behaviour), `Headless with useMediaElement` (real `<video>` from scene asset), `Captions and Rate`, `Compact (Play + Scrubber)`, `Enhanced Refraction (Chromium)` (PRD-15 flag) |
| `src/media/MediaScrubber.stories.tsx` | `Buffered and Chapters`, `Frame Step (paused, 24 fps)`, `Unknown Duration (live)` |
| `src/media/NowPlayingBar.stories.tsx` | `Over Album Art`, `Collapsed at 320px`, `With Expanded Player` |
| `src/media/Waveform.stories.tsx` (5.1) | `Voice Memo Peaks` (recorded fixture `src/media/__fixtures__/peaks-voice.json`), `Live Level Meter` (fixture-driven, Storybook clock), `Played Progress` |
| `src/media/ImageViewer.stories.tsx` | `Lightbox from Grid`, `Zoom and Pan`, `With Inspector`, `Mobile (390) Inspector Sheet`, `Filtered Gallery (id-keyed)` |
| `src/media/CarouselRail.stories.tsx` | `Product Rail`, `Media Slides with Clear Controls`, `Autoplay (opt-in, stops under reduced motion)`, `Loop` |
| `src/backdrops/Backdrop.stories.tsx` | `Aurora (each palette)`, `Mesh Light / Dark`, `Photo with Sampled Tone`, `Photo with Precomputed Tone`, `Video (poster by default; plays with allowContinuous)`, `Grain Overlay`, `Glass Over Each Preset` (a `Surface` `clear` and `regular` side by side) |
| `showcase/music-player/` (SB file, SB-113; SC-31 id `music-player`; this PRD supplies composition and fixtures) | `Music Player over Album Art`, built only from package exports |
| `showcase/media-workspace/` (SB file, SB-110; SC-31 id `media-workspace`; this PRD supplies composition and fixtures) | `Photos Viewer` (`ImageViewer` + `CarouselRail` + `MediaControls` over scenes), built only from package exports |

Requirements: every story has a `play` function for its interactive claim (e.g. scrub, open lightbox); each flagship story set has one environment-matrix baseline per scene (PRD-19); video stories use the QA `video-frame` still and its 2 s `video-frame.webm` loop (SC-28, QA-038; served at `/scenes` via `staticDirs`, no media asset is added by this PRD); Storybook docs page per component lists the `data-ag-part`/`data-state` table generated from `*.meta.ts`.

---

## 14. Responsive requirements

Breakpoints are container queries where the component is embeddable (bars, rails), viewport where it is a full-screen overlay. Certification viewports: 1440×900 and 390×844 (§15 axes).

| Component | Rule |
|---|---|
| `MediaControls.Root` | `@container ag-media (min-width: 480px)`: full row Play · Scrubber · Time · Volume · trailing toggles. 320–479 px: Volume collapses to `Mute` only, `Rate`/`PictureInPicture` move into a Base UI Menu (`More`), Time shows elapsed only. <320 px: Play + Scrubber. Never wraps (`flex-wrap: nowrap`, the 4.x `flexWrap: "wrap"` at `LiquidGlassMediaControls.tsx:100` is removed) |
| Hit targets | ≥44×44 CSS px at `(pointer: coarse)`, ≥32×32 at fine pointer; Scrubber thumb hit area ≥44 px tall at coarse pointer via `::before` expansion without changing visual size |
| `MediaScrubber` | Hover-time tooltip only at `(hover: hover)`; at coarse pointer the time appears above the thumb while dragging |
| `NowPlayingBar` | REQ-MED-34; height 56 px (coarse) / 48 px (fine); respects `env(safe-area-inset-bottom)` when `fixed` |
| `ImageViewer` | Popup full-viewport at all sizes; ≥768 px: Inspector side panel 320 px; <768 px: Inspector bottom region max 50% `dvh`; toolbar top, caption bottom, both inset by `env(safe-area-inset-*)`; pinch-zoom only via pointer events (`touch-action: none` on `Stage` while zoomed, `pan-y` at 1×) |
| `CarouselRail` | `slidesPerView='auto'` uses intrinsic slide width; numeric values become `calc((100% - gaps) / n)` with `n` reduced to 1 below 480 px container width; Prev/Next hidden at `(pointer: coarse)` (swipe), Indicators always shown |
| `Backdrop` | `photo` uses `srcSet`/`sizes`; `fixed` uses `position: fixed` not `background-attachment: fixed` (iOS); mesh/aurora gradients use `%` positions so no reflow at resize |
| Mobile containment | No component causes horizontal overflow at 390 px (PRD-19 mobile-containment gate) |

---

## 15. Accessibility requirements

Floors from architecture §7 and PRD-05 apply; this section lists the media-specific obligations.

1. **Contrast over media.** `on-surface` text on `MediaControls`, `NowPlayingBar`, `ImageViewer.Toolbar/Caption` and `CarouselRail` controls reaches ≥4.5:1, glyphs and slider tracks ≥3:1, `contrast=more` ≥7:1, measured by OCR on rendered pixels, worst case over all 8 scenes (including dark media, flat white and high-frequency pattern), both schemes, all engines. The `clear` scrim (35%, PRD-04) is mandatory over `light`/`media`.
2. **Sampling is never a contrast mechanism.** Absent or wrong tone must still pass item 1 (REQ-MED-66).
3. **Keyboard.** APG patterns: Toolbar (MediaControls), Slider (Scrubber, Volume, Rate), Dialog (ImageViewer), Carousel (CarouselRail, including the rotation-control rule that the autoplay toggle is first in tab order). No global key listeners anywhere in `src/media/**`.
4. **Names and values.** Every button has an accessible name; toggles use `aria-pressed`; sliders use `aria-valuetext` with spoken time; NowPlaying progress is `role="progressbar"`; `Waveform` is `role="img"` with required `label`; decorative backdrop media is `aria-hidden` with `alt=""`.
5. **Captions.** `MediaControls.Captions` exposes every `textTracks` entry of kind `captions`/`subtitles`; docs and the `media-video-player` registry item include a `<track kind="captions">` example. The library does not generate captions or transcripts (no simulation).
6. **Motion.** Under `prefers-reduced-motion: reduce` or `motion` ≠ `full`: no carousel autoplay, no backdrop drift, background `video` presets show the poster, viewer transitions are opacity-only, `Waveform level` has no transition. Backdrop drift and background-video playback additionally require `data-ag-continuous="on"` (`allowContinuous`), so at default props neither runs. No API raises motion above the OS floor (architecture §8). WCAG 2.2.2: any auto-moving content >5 s has a visible pause control: the `CarouselRail` `AutoplayToggle`, the `Backdrop` video `backdrop-pause` button (REQ-MED-72), and for drift the `GlassPreferencesPanel` `allowContinuous` switch (REQ-MOT-111).
7. **Forced colors.** Backdrop decorative layers hidden; chrome uses `Canvas`/`CanvasText`/`ButtonText`; slider track/fill use `CanvasText`/`Highlight`; focus ring visible (PRD-05 token).
8. **Reduced transparency / `solid`.** Media chrome becomes the PRD-05 solid rung (opaque `fallbackFill`), media remains visible.
9. **Live regions.** Only `ImageViewer.Counter` and `CarouselRail` (when not autoplaying) announce, via the PRD-05 announcer; `timeupdate` never announces.
10. **Targets.** WCAG 2.5.8 target size (≥24 px minimum, library floor 32 fine / 44 coarse).

Test gates: jest-axe in unit tests; remote APG, forced-colors, contrast-more, reduced-motion and reduced-transparency lanes (§12.2); OCR contrast in the clear-over-media scene.

---

## 16. Performance requirements (numeric budgets)

Byte budgets are min+gzip, peers external (React, `@base-ui/react` counted when the import pulls a Base UI part, per architecture §3.6), set before measuring and ratchet down only (D-26). Per SC-15 the byte rows are submitted to PKG's single file `docs/size-budgets.json` (PKG-048) and gated by `scripts/ci/verify-size-budgets.mjs` (PKG-049, esbuild; no `size-limit`); runtime rows (fps, long tasks, INP, sampling cost) go to PERF's `tests/perf/harness/budgets.json` (PERF-044). PERF's default ceilings (REQ-PERF-01, e.g. 8 KB gz per subpath CSS) apply; the rows below are stricter, which SC-15 allows (never looser). Calibrated once by QA L10 at 5.0.0-alpha.1.

| Import / metric | Budget |
|---|---|
| `{ useMediaElement, MediaControls }` from `aura-glass/media` | ≤14 KB (incl. Base UI Slider + Toolbar + Toggle) |
| `{ useMediaElement }` alone | ≤2.5 KB |
| `{ MediaScrubber }` alone | ≤7 KB (incl. Base UI Slider) |
| `{ formatMediaTime }` alone | ≤0.6 KB |
| `{ NowPlayingBar }` | ≤6 KB |
| `{ Waveform }` (5.1; row added with the 5.1 export) | ≤2 KB |
| `{ ImageViewer }` | ≤24 KB (incl. Dialog: the architecture §3.6 `{ Dialog }` ceiling of 20 KB plus ≤4 KB for stage, zoom/pan and parts) |
| `{ CarouselRail }` | ≤5 KB (no Base UI part) |
| `{ Backdrop }` server JS | ≤1.5 KB; client island `BackdropTone` + sampler ≤2 KB |
| `aura-glass/media.css` | ≤6 KB gz |
| `aura-glass/backdrops.css` | ≤3 KB gz (excluding grain asset) |
| Grain asset | AVIF ≤8 KB, PNG fallback ≤16 KB |
| `backdrop-filter` elements | `MediaControls`: 1 (one `SurfaceGroup` bar); `NowPlayingBar`: 1; `ImageViewer` open: ≤2 (toolbar, caption; the `media` scrim variant has blur 0; ≤3 if PRD-09 rejects that variant, REQ-MED-46); `CarouselRail`: ≤3 per rail at fine pointer (Prev, Next, Indicators are separate surfaces because a group pane would span the slides), ≤1 at coarse pointer (Prev/Next hidden, §14). All within the performance PRD's ≤6 fine / ≤3 coarse scene budget when one media flagship is on screen |
| React commits during playback | ≤4 per second per `MediaControls` instance (REQ-MED-12) |
| Main thread during 30 s scripted playback + 3 scrubs (remote Chromium, 4× CPU throttle) | 0 long tasks >50 ms; total blocking ≤100 ms; median FPS ≥55 during scrub; ≥58 at rest |
| Luminance sample | ≤4 ms per source at 4× throttle; ≤1 sample per source per page load |
| Backdrop at rest (any preset, default props) | 0 running animations; 0 rAF callbacks; 0 main-thread work per frame after load |
| Backdrop `drift` | Exactly 1 animation. Preferred implementation: `transform: translate3d()` on an oversized (120%) decorative layer (compositor-only). `background-position` (paint) is allowed only if L10 Performance measures ≤2 ms paint per frame at 1440; the choice is recorded at alpha |
| `video` preset | `preload="metadata"`, no `autoplay` attribute; 0 bytes of video data requested beyond metadata and 0 playback at default props (no `data-ag-continuous="on"`); when playing, paused within 250 ms of leaving the viewport or `document.hidden` |
| `ImageViewer` | ≤3 decoded images in stage; INP ≤100 ms for next/prev at 4× throttle |
| `CarouselRail` | INP ≤100 ms for Prev/Next; 0 scroll listeners (IntersectionObserver only) |
| Perf grade (§15 cost gate) | ≥C for flagships 43 and 44; target B |
| CLS | 0 for all components (artwork/slides reserve size via `width`/`height` or `aspect-ratio`) |

---

## 17. Acceptance criteria

Each criterion is measured in CI artifacts (D-32), never committed reports.

- **AC-MED-01** `aura-glass/media` exports exactly the 7 values at 5.0.0 (8 with `Waveform` at 5.1) and `aura-glass/backdrops` exactly 1 (REQ-MED-01); root exports 0 media/backdrop names. Evidence: `etc/api/{media,backdrops,index}.exports.json` diff = 0 against the approved list (SC-04).
- **AC-MED-02** The **clear-over-media scene** is certified: `MediaControls` (`clear`) and `NowPlayingBar variant="clear"` over all 8 scenes × {light, dark} × {glass, tinted, solid} × {default, contrast more, forced colors, reduced motion} × tier {lightweight, standard, enhanced (Chromium only, only if PRD-15 (interim owner MAT, SC-37) certifies by RC-1, D-05)} × {1440, 390} × {Chromium, WebKit, Gecko} pass every architecture §15 pixel gate, with 0 failures. This is the architecture §16 PRD-13 exit criterion.
- **AC-MED-03** OCR text contrast worst case in AC-MED-02 is ≥4.5:1 (text), ≥3:1 (glyphs, tracks), ≥7:1 under contrast more, including the dark-media and flat-black scenes where 4.1.0 fails 266/342 runs (E-26).
- **AC-MED-04** With `data-ag-media-tone` forced on vs off for every scene, the worst-case OCR contrast does not decrease (REQ-MED-66).
- **AC-MED-05** `classifyTone` returns the expected value for all 8 scene fixtures (REQ-MED-61); a CORS-less image yields no tone and exactly one dev warning in all 3 engines (REQ-MED-65).
- **AC-MED-06** `getImageData` is called exactly once per source across 30 s of playback with 10 seeks (REQ-MED-63); sampling cost ≤4 ms at 4× throttle (REQ-MED-64).
- **AC-MED-07** L10 Performance (remote), 30 s playback + 3 scrubs: 0 long tasks >50 ms, median FPS ≥55 during scrub, ≤4 React commits/s per `MediaControls` (§16).
- **AC-MED-08** Every per-import budget in §16 passes in PKG's `scripts/ci/verify-size-budgets.mjs` against `docs/size-budgets.json` at RC-1 (SC-15).
- **AC-MED-09** Every `Backdrop` preset at default props: `document.getAnimations().length === 0`, 0 rAF callbacks over 5 s, and server render succeeds without a DOM.
- **AC-MED-10** APG lanes green in 3 engines for Toolbar/Slider (MediaControls), Dialog (ImageViewer) and Carousel (CarouselRail) scripts; jest-axe and Playwright axe report 0 violations on every story in §13.
- **AC-MED-11** Static gate: 0 occurrences in `src/media/**` and `src/backdrops/**` of `window.addEventListener('keydown'`, `document.addEventListener('keydown'`, `Math.random`, `fetch`, `AudioContext`, `elementsFromPoint`, `backdrop-filter`/`backdropFilter`, `!important`, colour literals outside token fallbacks.
- **AC-MED-12** L9 Motion under reduced motion: carousel autoplay never starts, `video` preset shows poster with `video.paused === true`, 0 running animations in every media/backdrop story; all content visible in final state. Default preferences without `allowContinuous`: same `video` and animation assertions, and `CarouselRail autoplay` set by the consumer does not rotate (SC-38).
- **AC-MED-13** L6 Environment visual, forced-colors axis: 0 visible `backdrop-filter` elements and 0 visible decorative backdrop layers in every media/backdrop story.
- **AC-MED-14** Flagships 43 and 44 pass `verify-flagship-deliverables.mjs` (all §11.3 items) with perf grade ≥C.
- **AC-MED-15** Every §9 name has a `deprecations.json` entry, a 4.2/4.3 dev warning and either a codemod fixture pair or an explicit manual TODO fixture; `migrate 4to5` runs on the DX codemod canary (`tests/dx/codemod-canary.spec.ts`, DX-060, over REL's frozen fixture `tests/fixtures/consumer-4x/`, REL-115, SC-08) for its media/backdrop usages and, after the canaries' manual TODOs are resolved by the recorded fixture outputs, the canaries type-check with 0 TS errors.
- **AC-MED-16** 4.1.1 (TRUST release, published from `main`, before the `release/4.x` cut at `v4.2.0`): `GlassAdvancedVideoPlayer` plays a `data:video/` source (REQ-MED-90, TRUST-025); visual baselines of all other 4.x components unchanged per REL `visual-class.mjs` (D-27, SC-09). Evidence is TRUST's; this PRD verifies it.
- **AC-MED-17** `ImageViewer` filter-then-open regression passes (opens the triggered item 10/10 runs) and stage never holds >3 images.
- **AC-MED-18** 0 horizontal overflow at 390 px and correct container-query states at 320/360/480/600 px for `MediaControls` and `NowPlayingBar`.

---

## 18. Definition of done

1. All 75 REQ-MED requirements (blocks REQ-MED-01..05, 10..18, 20..29, 30..39, 40..49, 50..55, 60..67, 70..77, 80..83, 90..93, 95) implemented, each with its named test green in CI (jest and remote lanes). The 5.0.0 gate covers the 69 non-5.1 requirements; REQ-MED-35..39 (`Waveform`) and REQ-MED-95 (`media-transcript`) gate 5.1. REQ-MED-90 is satisfied by TRUST-025 (consumed).
2. AC-MED-01..18 met on the RC-1 build, artifacts retained per QA's retention policy (SC-07).
3. §11.3 deliverables for flagships 43 and 44 merged: `<Component>.meta.ts` (SC-27), part/state table, selector-change table vs 4.x, registry block content (`media-viewer`, SC-32) plus this PRD's registry items (`media-video-player`, `media-audio-player`, `media-now-playing`, `media-gallery`, `backdrop-hero`), APG script (`tests/a11y/apg/*.apg.spec.ts`), budget line, perf grade, environment baselines, codemod fixtures.
4. REL API reports `etc/api/{media,backdrops}.api.md` and `.exports.json` (SC-04 slugs) approved; `deprecations.json` 4.2 entries merged on `main` before the `release/4.x` cut (`v4.2.0`), 4.3 entries merged on `release/4.x` and forward-ported to `main` (REL bridge scope, §16 PRD-17 interim owner REL, SC-37).
5. Contract items settled by `prd/_shared-contracts.md` (no longer open requests): `data-ag-media-tone`, `data-ag-media-root`, `data-ag-backdrop-preset`, `data-ag-palette` ratified (SC-21, MAT); `--ag-scrim-media` (DS) and `--ag-duration-ambient` (MOT row) accepted (SC-19); `data-ag-offscreen` observer owned by the MOT ticker (SC-21, MOT-040); CarouselRail autoplay counts as a loop (SC-38); `Waveform` is 5.1 (SC-12). Still open and tracked in §21 with fallbacks: (a) MAT glyph-flip selector consuming `data-ag-media-tone`; (b) OVL `media` scrim variant with blur 0 (REQ-MED-46); (c) MOT REQ-MOT-T08 admitting `ag-backdrop-drift` and the ticker being importable from `src/media/**`; (d) DX `@auraglass/cli sample-media`; (e) A11Y `no-runtime-contrast` allowance for `src/media/sampling/**`; (f) QA task creating `verify-flagship-deliverables.mjs`. Fallbacks if rejected, each recorded as a C-I amendment before beta: (a) tone is still written and tested, but no CSS consumes it (glyph polarity follows `data-ag-backdrop` only); (b) ≤3 filter budget per REQ-MED-46; (c) drift removed from 5.0 (`motion` accepts `'static'` only, C-E later), and §4.3 uses the REQ-PERF-28-compliant rAF loop; (d) only the `tone` prop path remains; (e) the sampler is moved behind an explicit, documented lint suppression reviewed by A11Y; (f) the flagship checklist is verified by a MED-local test until QA ships the script.
6. Storybook stories in §13 published in the docs build with `play` functions passing; no story in `src/media`/`src/backdrops` uses `previewSurface` or inline optics.
7. 4.x sources listed in §6 deleted on `main` through FND (§16 PRD-16) family PRs, with the consumer grep (`scripts/removal/consumer-grep.mjs`, FND-103) recorded in each PR.
8. Migration guide section generated from `deprecations.json` (DX, §16 PRD-20) and reviewed.
9. No open P0/P1 defects against `./media` or `./backdrops`.

---

## 19. Dependencies

Cross-PRD task dependencies in `tasks/MED.json` cite the owner's anchor task ids from SC-40 (never `PRD-xx` strings).

| PRD (§16 number, key) | What this PRD needs | Anchor tasks | Blocking for |
|---|---|---|---|
| PRD-00 (TRUST) | 4.1.1 release vehicle and the `isStorybookDataMedia` fix (REQ-TRUST-17); `deprecations.json` seed | TRUST-025, TRUST-075 | REQ-MED-90, -91 |
| PRD-01 (REL) | `deprecations.json` schema and gate, `gen-deprecations.mjs`, `warnDeprecated`, API reports and export snapshots, visual-class gate, codemod id catalogue (`media-backdrops`), frozen 4.x fixture, 4.2/4.3 bridge scope (interim §16 PRD-17) | REL-010, REL-070, REL-072, REL-003, REL-040, REL-115 | §9, §10, REQ-MED-01/02, AC-MED-15/16 |
| PRD-02 (PKG) | Exports manifest rows, directive lint, side-effect gate, size-budget file and gate, tarball gate, `glass-pipeline.yml` | PKG-005, PKG-015, PKG-023, PKG-038, PKG-042, PKG-048, PKG-049, PKG-068 | REQ-MED-01..05, -77, §16 |
| PRD-03 (DS) | Token compiler and tree: palette `--ag-ref-*`, `--ag-on-surface[-muted]`, motion token file (`ambient` row by MOT), `--ag-scrim-media`, target tokens; `auraglass/no-raw-design-values` | DS-016, DS-026, DS-028, DS-071 | Backdrop presets, ImageViewer, Waveform, static gates |
| PRD-04 (MAT) | `Surface`, `SurfaceGroup`, `Environment`, `clear` scrim, solved `media` floors, attribute registry (SC-21), glyph-flip selector, `no-optics-outside-material`; interim owner of PRD-15 enhanced tier (lens maps for `refraction`) | MAT-015, MAT-047, MAT-049, MAT-004, MAT-035 | All components; AC-MED-02/03; story `Enhanced Refraction` |
| PRD-05 (A11Y) | `usePreference`, provider, portal root, announcer, `LayerStack` (only Escape dispatcher), APG harness, target CSS, rungs | A11Y-027, A11Y-029, A11Y-049, A11Y-054, A11Y-065, A11Y-073 | Autoplay, live regions, ImageViewer, APG specs |
| PRD-06 (MOT) | `allowContinuous` → `data-ag-continuous="on"`, ticker + `data-ag-offscreen` observer, continuous-gating lint, motion values incl. `ambient` | MOT-040, MOT-035, MOT-020, MOT-071 | Drift, background video, carousel autoplay, progress loop |
| PRD-07/14/16 (FND) | Base UI pin and wrapping pattern (Slider, Toolbar, Toggle, Menu), parts registry and meta, `usePortalContainer()`, `no-forward-ref`; per-family removal PRs | FND-001, FND-005, FND-007, FND-103 | MediaControls, Scrubber, ImageViewer; §6 deletions |
| PRD-08 (CTL) | Button pattern proof (alpha gate, with OVL-040) | CTL-055 | Execution step 4 |
| PRD-09 (OVL) | `Dialog` popup, `.ag-scrim` and the `media` scrim variant request | OVL-040, OVL-023 | ImageViewer |
| PRD-18/20 (DX) | Codemod engine and catalogue, compat index, `registry/registry.json`, `media-viewer` block scaffold, codemod canary, migration guide, `sample-media` (request) | DX-041, DX-042, DX-065, DX-067, DX-075, DX-060 | REQ-MED-81/92/93/95 |
| PRD-19 (QA) | Jest and cert Playwright configs, `certify-pr.yml` (`regression` job), 8 scenes + manifest, lanes L5–L10, OCR and pixel gates, `verify-flagship-deliverables.mjs` (no task yet, §21) | QA-003, QA-018, QA-031, QA-038, QA-039, QA-056, QA-066, QA-075, QA-076, QA-082 | AC-MED-02..14 |
| PRD-19 (SB) | `.storybook/preview.tsx` decorator and globals, story contract, showcase files `music-player`, `media-workspace` | SB-048, SB-071, SB-113, SB-110 | §13 |
| PERF (no §16 row) | `run-perf.mjs`, grade function, runtime `budgets.json`, rAF rules | PERF-039, PERF-042, PERF-044, PERF-028, PERF-029 | §16, AC-MED-07 |
| EXP (interim §16 PRD-21) | `@auraglass/labs` `ParticleField` home; X-37..X-43 ledger rows citing REQ-MED ids | none (not blocking) | Migration note for particles; REQ-MED-95 |

---

## 20. Execution order

1. **4.1.1 (TRUST):** TRUST-025 removes `isStorybookDataMedia` and adds the `data:video/` test on `main` (REQ-MED-90 consumed; `release/4.x` does not exist until `v4.2.0`).
2. **Pre-alpha design freeze:** land `src/media/sampling/*` (pure, no UI) with `classifyTone` fixtures from the QA scene thumbnails; file the open items in §21 with their owners.
3. **4.2 (REL bridge, interim §16 PRD-17):** `deprecations.json` entries and `warnDeprecated` wiring for all §9 names except `ImageList*` (4.3); `*.meta.ts` `migration` fields v1.
4. **After MAT emits and FND/CTL/OVL prove Button + Dialog (alpha gate, CTL-055 + OVL-040):** `useMediaElement` + `mediaStore` + `formatMediaTime` with full unit tests.
5. `Backdrop` (server) with `aurora`, `mesh`, `grain`, then `photo`/`video` + `BackdropTone`; SSR and motion tests; this unblocks the clear-over-media scene for every other PRD.
6. `MediaScrubber`, then `MediaControls` parts, then `NowPlayingBar`; keyboard and a11y tests; clear-over-media scene baselines (AC-MED-02/03/04).
7. `ImageViewer` on the OVL `Dialog`; zoom/pan/pinch; id-keyed navigation.
8. `CarouselRail` (flagship 44) APG implementation and tests.
9. Stories (§13), registry items and `media-viewer` block content, showcase compositions, `*.meta.ts`, flagship deliverables gate.
10. **4.3:** `ImageList*` C-D; final `media-backdrops` transform and fixtures; compat adapters (REQ-MED-93).
11. **Beta:** remote perf calibration of §16 budgets (ratchet only), full environment matrix in 3 engines, fix to green.
12. **RC-1:** API freeze; AC-MED-01..18 verified on the RC build; FND deletes §6 sources on `main`; migration guide generated.
13. **5.1:** `Waveform` (REQ-MED-35..39, export + API report + size row) and registry item `media-transcript` (REQ-MED-95).

---

## 21. Open items

Reconciled on 2026-10-06 against `prd/_shared-contracts.md` (SC-01, SC-09, SC-10, SC-12, SC-30, SC-33, SC-38, SC-40 plus the consumer rows SC-02..04, SC-15, SC-19, SC-21, SC-25, SC-27..29, SC-31, SC-32, SC-34, SC-36, SC-37) and the MED section of `prd/_verification-remaining-concerns.md`.

Resolved by the registry (no action left in this PRD):
- Waveform release and `./media` export count: 5.1, 7 values at 5.0.0 (SC-12, SC-38).
- Numbering mismatch (self-id PRD-14 vs §16 PRD-13): SC-01 crosswalk, key `MED`.
- CarouselRail autoplay vs `allowContinuous`: counts as a loop (SC-38); REQ-MED-54 updated.
- Token requests `--ag-scrim-media` and `--ag-duration-ambient`: accepted (SC-19).
- `data-ag-media-tone` (and `data-ag-media-root`, `data-ag-backdrop-preset`, `data-ag-palette`): ratified (SC-21).
- `data-ag-offscreen` observer: owned by the MOT ticker (SC-21, MOT-040), not PRD-05.
- Per-subpath CSS ceiling 8 KB (PERF default) vs 6 KB / 3 KB here: stricter rows are allowed (SC-15).
- Scene paths and the `.storybook/assets/scenes/` conflict: `certification/scenes/` (SC-28).
- 4.1.1 `isStorybookDataMedia`: TRUST-025 owns it (SC-36); MED-001/002 no longer build it.
- §16 budget lines for MediaScrubber (verification concern): `{ MediaScrubber }` and `{ formatMediaTime }` rows added; `Waveform` row deferred to 5.1.
- Architecture §3.2 missing MediaScrubber / formatMediaTime: errata E-04 (architecture owner).
- EXP X-43 transcript gap: owned here as REQ-MED-95 (5.1).

Still open:

| # | Item | Owner | How to close |
|---|---|---|---|
| OI-MED-01 | EXP X-42 still lists `Waveform` as 5.0 (`AURAGLASS_COMPONENT_EXPANSION_PRD.md:236`), contradicting SC-12 | EXP | Change X-42 release to 5.1 and regenerate the ledger totals (REQ-EXP-04) |
| OI-MED-02 | Glyph-flip selector `[data-ag-backdrop=media][data-ag-media-tone=light\|dark]` for small chrome has no MAT task | MAT | Add a MAT task modifying `src/material/css/material.css` (after MAT-015); fallback DoD 5(a) |
| OI-MED-03 | OVL `media` scrim variant (tint `--ag-scrim-media`, `--_ag-scrim-blur: 0`) is not in OVL-023 | OVL | Add a variant to `src/components/overlays/_shared/overlays.css` or reject; fallback ≤3 filters (REQ-MED-46) |
| OI-MED-04 | REQ-MOT-T08 admits only `ag-sweep` under `data-ag-continuous="on"`; `ag-backdrop-drift` needs admission, and `src/motion/ticker.ts` must be importable from `src/media/**` | MOT | Amend REQ-MOT-T08 / MOT-098 and the `motion` importer allowlist in `docs/dependency-allowlist.json` (SC-14); fallback DoD 5(c) |
| OI-MED-05 | `@auraglass/cli sample-media` is absent from the DX CLI list | DX | Add a DX REQ and task, or reject; fallback: only the `tone` prop path |
| OI-MED-06 | A11Y `auraglass/no-runtime-contrast` (A11Y-012) flags canvas `getImageData`, which the owned-pixel sampler uses | A11Y | Scope an allowance to `src/media/sampling/**` (owned-pixel tone classification never feeds contrast, REQ-MED-66); fallback DoD 5(e) |
| OI-MED-07 | Closed 2026-10-06: QA-127 creates `scripts/ci/verify-flagship-deliverables.mjs` and `certification/flagship-deliverables.json`; MED-156 depends on QA-127 | QA | none |
| OI-MED-08 | Assumed, not verified: the A11Y announcer API shape, the REQ-MOT-111 `GlassPreferencesPanel` `allowContinuous` switch, and Base UI Toolbar hosting Slider items with their own Arrow semantics (Base UI is not installed at HEAD, so Toggle/Toolbar/Slider part names were not checked locally) | MED (with FND-001) | Verify after FND-001 pins `@base-ui/react`; record results in MED-084/085 acceptance |
| OI-MED-09 | §16 byte and runtime budgets (including the new MediaScrubber and formatMediaTime rows) are provisional design targets, not measurements | MED, calibrated by QA L10 | Calibrate at 5.0.0-alpha.1 (D-26); ratchet down only |
| OI-MED-10 | `deprecations.json` entries for `GlassVoiceWaveform` / `GlassMusicVisualizer` must carry "no successor until 5.1" at 4.2 and be updated when `Waveform` ships | MED (entries), REL (gate) | MED-004 at 4.2; a 5.1 MODIFY of the same entries |
| OI-MED-11 | Three human-confirmation decisions in the registry do not change this PRD but are recorded: SC-24 Button break, SC-36 4.1.1 split, SC-38 press-scale rejection | Program (REL) | Confirm in `docs/release/decisions/` |
