# PROMPT-14c (MED): Headless media core: `mediaStore`, `useMediaElement`, progress loop, Media Session, `sampleTone`

You are implementing part of the Media & Backdrops PRD (key **MED**, self-id PRD-14, architecture §16 PRD-13) for `aura-glass` at `/Users/gurbakshchahal/platforms/AuraGlass` (baseline 4.1.0, HEAD `15b6de6f7`). This prompt is self-contained. Other PRDs are cited by SC-01 key (TRUST, REL, PKG, DS, MAT, A11Y, MOT, FND, OVL, DX, QA, SB, PERF, EXP); shared contracts by `SC-NN` from `docs/auraglass-5/prd/_shared-contracts.md`.

## 1. Sources (read before editing)
- PRD: `docs/auraglass-5/prd/AURAGLASS_MEDIA_BACKDROPS_PRD.md`. Read:
  - §2.1 E-04, E-05, E-06
  - §3 item 3
  - §4.3 (event list, ≤4 Hz snapshots, `--ag-media-progress` loop)
  - §4.4 rule (a)
  - §5.2 (REQ-MED-10..18), REQ-MED-67
  - §10 API-MED-09
  - §11 item 1
  - §12.1 `useMediaElement.*` and `tests/types/media.tsx` rows
  - §16 (`{ useMediaElement }` ≤2.5 KB, ≤4 commits/s)
- Motion PRD `docs/auraglass-5/prd/AURAGLASS_MOTION_PRD.md` REQ-MOT-128 (shared ticker `src/motion/ticker.ts`, MOT-040, with the single shared IntersectionObserver that also writes `data-ag-offscreen`, SC-21; lint `auraglass/motion-raf-via-ticker`, SC-16).
- Accessibility PRD: `usePreference` (A11Y-027, SC-23).
- Performance PRD REQ-PERF-28 (`auraglass/raf-requires-cancel`, `auraglass/raf-requires-visibility-gate`; PERF-028/029).
- Tasks: `docs/auraglass-5/tasks/MED.json` MED-040..MED-049.

Requirements: REQ-MED-10..18, REQ-MED-67 (types and the binding half). Acceptance: AC-MED-06 (the unit half: one `getImageData` per source) and AC-MED-07 (the unit half: ≤4 commits/s). 14h does the remote verification.

## 2. Scope
May create or modify:
- NEW `src/media/mediaStore.ts`
- NEW `src/media/useMediaElement.ts`
- NEW `src/media/types.ts` (`MediaState`, `MediaHandle`, `UseMediaElementOptions`)
- NEW `src/media/__tests__/useMediaElement{,.throttle,.raf,.ssr,.session}.test.tsx`
- NEW `src/media/__tests__/helpers/mediaElementStub.ts`: a test helper that drives a real jsdom `HTMLVideoElement` with dispatched events and defined `readyState`/`buffered`/`textTracks`. It is not a library mock.
- NEW `tests/types/media.tsx`
- `src/media/index.ts`: append `export { useMediaElement } from './useMediaElement'` and the type exports

Must NOT touch:
- `src/motion/**` (MOT)
- `src/media/sampling/**` internals. Consume `getOrSampleTone` only.
- `src/components/media/**` (4.x)
- `src/index.ts`
- dependencies

## 3. Prerequisites
- 14b is merged: `test -f src/media/index.ts && test -f src/media/sampling/toneCache.ts && test -f scripts/ci/verify-media-purity.mjs`.
- MOT-040 ticker (soft dependency; PROMPT_06_MOT): `test -f src/motion/ticker.ts`, and open item OI-MED-04 (ticker importable from `src/media/**`) is accepted. If either is missing, use the fallback in step 4. It is a rAF loop that satisfies REQ-PERF-28. Record which path you used.
- Remote build for the type tests: `tests/types/tsconfig.json` maps `aura-glass/*` to `dist/*`, so MED-048 runs after a remote `npm run build`.

## 4. Steps
1. **MED-040 `mediaStore.ts`.**
   - Keeps one store per `HTMLMediaElement` in a `WeakMap`. Each store exposes `subscribe`, `getSnapshot` and `getServerSnapshot` for `useSyncExternalStore`.
   - Listens for `play`, `pause`, `ended`, `durationchange`, `loadedmetadata`, `progress`, `seeking`, `seeked`, `waiting`, `canplay`, `volumechange`, `ratechange`, `error`, `enterpictureinpicture`, `leavepictureinpicture` and `timeupdate`. Attach every listener with `{ signal }` from one `AbortController` per element. Abort it when the last subscriber leaves or when the ref changes.
   - The snapshot is an immutable `MediaState` built to REQ-MED-11:
     - `ready` = `readyState >= 2`
     - `buffered` = `TimeRanges` → `Array<[start, end]>`
     - `textTracks` comes from `el.textTracks`. `id` = `track.id || \`track-${index}\``.
     - `error` = `{ code, message }` taken from `MediaError`.
   - Publish discrete events (`play`, `pause`, `seeked`, `ended`, `error`, `volumechange`) immediately.
   - Coalesce `timeupdate` so it publishes at most `snapshotHz` per second. `snapshotHz` defaults to 4 and is clamped to 1–15. Use a trailing-edge timer, and clear that timer on abort.
   - The server snapshot is a frozen constant: `{ paused: true, ended: false, waiting: false, seeking: false, ready: false, currentTime: 0, duration: NaN, buffered: [], volume: 1, muted: false, playbackRate: 1, pictureInPicture: false, textTracks: [], error: null, tone: undefined }`.
2. **MED-041 `useMediaElement.ts`** (`"use client"`).
   - Signature exactly per REQ-MED-10. The `ref` type is `React.RefObject<HTMLMediaElement | null>`.
   - Commands:
     - `play()` returns the native promise. On a `NotAllowedError` rejection it sets `state.error = { code: 0, message: 'autoplay-blocked' }`. It never throws.
     - `seek` clamps to `[0, duration]`.
     - `seekBy(delta)`.
     - `setVolume` clamps to 0–1.
     - `setMuted`, `setRate`.
     - `requestPictureInPicture()` calls the native method only when `document.pictureInPictureEnabled` is true.
     - `requestFullscreen(target?)` targets `target ?? el.parentElement`.
   - The hook never assigns `src`, never calls `load()`, never creates an `AudioContext` and never calls `fetch`.
   - **Progress loop (REQ-MED-13).** One frame subscription per handle writes `--ag-media-progress` (`(currentTime / duration)` with 4 decimals, or `0` when the duration is not finite) on `el.closest('[data-ag-media-root]')`. If there is no such root, it writes on any root that registered through the internal `registerMediaRoot(handle, node)` API, which `MediaControls.Root` and `NowPlayingBar.Root` use in 14e.
     - It runs only while all three hold: `!paused`, `document.visibilityState === 'visible'`, and the root is intersecting (one `IntersectionObserver` per root).
     - It stops within one frame when any of them becomes false.
     - Prefer the MOT ticker (MOT-040, `subscribe(cb, { element })` → unsubscribe). Otherwise use `requestAnimationFrame` with `cancelAnimationFrame` on stop, plus a `visibilitychange` listener under the same `AbortController`.
     - It is not gated by `allowContinuous`, because playback is user-started.
   - **Media Session (REQ-MED-15).** When `mediaSession` is an object and `'mediaSession' in navigator`, set `navigator.mediaSession.metadata = new MediaMetadata(opts)` and the handlers `play`, `pause`, `seekbackward` (−10 s), `seekforward` (+10 s) and `seekto`. On unmount, set metadata to `null` and every handler to `null`. When it is `false` (the default), touch nothing.
3. **MED-042 `sampleTone` (REQ-MED-67).**
   - Applies only to the element bound to `ref`. There is no element, selector or point parameter anywhere.
   - When `sampleTone` is true, call `getOrSampleTone(el, undefined, …)`:
     - from `el.poster` loaded as an `Image` (with `crossOrigin` copied from `el`) when a poster exists, or
     - otherwise at the first `loadeddata`.
   - Never sample on `timeupdate`, `seeked`, scroll, resize or mutation.
   - Store `tone` in the snapshot. Write `data-ag-media-tone` (`light|dark`; remove it when `undefined`) and `--ag-media-luma` (3 decimals) on the registered or closest `[data-ag-media-root]`. Write nothing else.
4. **MED-043 `useMediaElement.test.tsx`.**
   - Dispatch each of the 16 events on the stub element and assert the matching `MediaState` field.
   - Commands call the native methods.
   - A `NotAllowedError` produces `autoplay-blocked` and no throw.
   - REQ-MED-18: wrap `addEventListener`/`removeEventListener` in jest spies. After unmount, and after swapping the ref to a second element, every listener added to element 1 carried a signal with `aborted === true`, and the live registration count is 0.
   - Rendering never sets `src` (spy on the `src` setter).
5. **MED-044 `.throttle.test.tsx`.**
   - Fake timers. 60 `timeupdate` events over 1 s produce ≤4 renders of a counting consumer.
   - `snapshotHz: 0` clamps to 1. `snapshotHz: 99` clamps to 15.
   - `pause` and `seeked` re-render synchronously.
6. **MED-045 `.raf.test.tsx`.** Mock `requestAnimationFrame`, `cancelAnimationFrame` and `IntersectionObserver`. Assert:
   - 0 callbacks while paused, while `visibilityState='hidden'` and while not intersecting
   - one cancel within one frame of each transition
   - `--ag-media-progress` gets the 4-decimal value
7. **MED-046 `.ssr.test.tsx`.** Under `/** @jest-environment node */`, `renderToString` produces exactly the server snapshot fields (render them into `data-*`). Then run a jsdom `hydrateRoot` pass with a `console.error` spy and assert 0 calls.
8. **MED-047 `.session.test.tsx`.** With `navigator.mediaSession` and `MediaMetadata` stubbed, metadata and the 5 handlers are set on mount and nulled on unmount. With `false`, there are 0 property writes.
9. **MED-048 `tests/types/media.tsx`.**
   - Positive cases: the full `MediaHandle`, and the `MediaState` field types.
   - `// @ts-expect-error` cases:
     - a `RefObject<HTMLDivElement>` passed to `useMediaElement`
     - `sampleTone: 'auto'`
     - any extra `target`/`element`/`selector` option
     - assigning to `state.currentTime`
   - Run with `tsc -p tests/types --noEmit` after the remote build.
10. **MED-049.** Append the exports to `src/media/index.ts`.

## 5. Tests to run
- Local (light): `./node_modules/.bin/jest src/media/__tests__/useMediaElement`, `node scripts/ci/verify-media-purity.mjs`, `./node_modules/.bin/tsc --noEmit -p tsconfig.json`, and `./node_modules/.bin/eslint src/media`. The REQ-PERF-28 rules apply once PERF-028/029 have landed.
- Remote: `npm run build`, then `tsc -p tests/types --noEmit`, plus PKG's directive lint (`auraglass/use-client-required`, PKG-023) (`useMediaElement.ts` and `mediaStore.ts` must start with `"use client"`; `index.ts` must not).

## 6. Visual evidence
None. The hook is headless. 14e/14h produce the remote playback evidence.

## 7. Integrity rules (binding)
- Never use local Docker or a local browser.
- The library hook is real: no simulated time, no `setInterval` progress.
- The stub helper is a test fixture over a real jsdom element. It must not replace `useMediaElement`.
- No `.skip`/`.only`/`.todo`. No `-u`.
- Do not raise `snapshotHz` defaults to pass a test.
- No window or document `keydown` listeners.
- Do not commit evidence.

## 8. Exit criteria
- REQ-MED-10..18 each have a green named test (MED-043..048).
- REQ-MED-67: the type negatives fail compilation, and the purity gate is green.
- AC-MED-07 (unit half): ≤4 renders/s.
- AC-MED-06 (unit half): a single sample per source via `toneCache`.

## 9. Final report format
```
PROMPT-14c REPORT
Branch/SHA:
Tasks: MED-040..049 -> done|blocked (reason) each
Progress loop path: MOT-040 ticker | REQ-PERF-28 rAF fallback (why)
Renders per 60 timeupdate/s: N
Listener leak check: live registrations after unmount = 0
Tests: name -> pass/fail (local|remote URL)
Deviations (with evidence) or none
Files changed:
```
