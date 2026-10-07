# PROMPT-14 (MED): Media & Backdrops (`aura-glass/media`, `aura-glass/backdrops`, flagships 43–44): index

Source PRD: `docs/auraglass-5/prd/AURAGLASS_MEDIA_BACKDROPS_PRD.md`. The program id is **PRD-14**. Architecture §16 calls the same boundary "PRD-13 `PRD-13-media-backdrops.md`" (see the PRD's "ID note"). The PRD covers REQ-MED-01..05, 10..18, 20..29, 30..39, 40..49, 50..55, 60..67, 70..77, 80..83, 90..93 and 95 (75 requirements; REQ-MED-35..39 `Waveform` and REQ-MED-95 `media-transcript` are **5.1**, C-E, SC-12/SC-38), AC-MED-01..18, API-MED-01..18 and the open items in PRD §21 (OI-MED-01..11). Canonical decisions live in `docs/auraglass-5/AURAGLASS_5_TARGET_ARCHITECTURE.md` (D-02, D-04, D-05, D-06, D-08, D-09, D-11..D-16, D-18, D-24..D-27, D-29, D-32; §3 rows `./media` and `./backdrops`, §3.6, §4.1 item 1, §4.5–4.7, §7, §8, §11.2 #43–44, §11.3, §12, §13.1, §13.3–13.4, §14, §15). The task fragment is `docs/auraglass-5/tasks/MED.json` (MED-001..MED-167, 134 tasks; MED-002 was merged into MED-001 when the 4.1.1 fix moved to TRUST-025).

**Numbering note (SC-01).** The SC-01 crosswalk in `docs/auraglass-5/prd/_shared-contracts.md` fixes this PRD's key as **MED** (self-id alias PRD-14, architecture §16 PRD-13). Prompts cite other PRDs by key, with the §16 number where useful: TRUST (PRD-00), REL (PRD-01; interim owner of §16 PRD-17), PKG (PRD-02), DS (PRD-03), MAT (PRD-04; interim owner of §16 PRD-15 enhanced tier), A11Y (PRD-05), MOT (PRD-06), FND (PRD-07/14/16: foundation, T2 core, removal), CTL (PRD-08), OVL (PRD-09), DX (PRD-18/20), QA (PRD-19 certification), SB (Storybook/Lab half of PRD-19), PERF (no §16 row), EXP (expansion ledger; interim owner of §16 PRD-21 labs). Shared contracts are cited as `SC-NN`.

**Dependencies (SC-40).** `depends_on` in `MED.json` holds only real task ids from `docs/auraglass-5/tasks/*.json`, and cross-PRD entries point at the owner's anchor task (for example TRUST-025, REL-010, PKG-005, DS-016, MAT-047, A11Y-073, MOT-040, FND-001, OVL-040, DX-041, QA-082, SB-048, PERF-039). No `PRD-xx` string appears in `depends_on`. Only the `prd` field carries the self-id `PRD-14`. A prompt's "prerequisites" name the owner task id, and the owner's prompt where one exists.

## Why it is split

There are 75 requirements across:
- a 4.x line (4.1.1 cut, 4.2/4.3 deprecations)
- a pure sampling core and its static gate
- a headless media hook
- a server-component backdrop system
- three client compound families
- an APG carousel
- a certification, registry, compat and codemod tail

That is more than one session can hold. The work is split into eight prompts. Each one can be executed on its own and restates the common rules.

| Prompt | Scope | REQ-MED | AC-MED | Tasks | Branch | Hard prerequisites |
|---|---|---|---|---|---|---|
| `PROMPT_14a_MED_4X_LINE.md` | Verify TRUST's 4.1.1 `isStorybookDataMedia` cut (no MED edit); 4.2/4.3 root `deprecations.json` entries and `warnDeprecated` wiring; coverage test | 90 (consumer), 91 | 15 (deprecation half), 16 | MED-001, MED-003..012 | 4.1.1 from `main` (TRUST); 4.2 entries on `main` before the `release/4.x` cut; 4.3 on `release/4.x` | TRUST-025 (PROMPT_00_TRUST), TRUST-075, REL-010, REL-070, REL-072, REL-040 |
| `PROMPT_14b_MED_ENTRIES_SAMPLING.md` | `./media`/`./media.css`/`./backdrops`/`./backdrops.css` manifest rows; `src/media/index.ts`; `media.css` skeleton; `formatMediaTime`; `verify-media-purity.mjs` + `Glass Quality Gates` step; `sampleOwnedPixels`/`computeLumaStats`/`classifyTone`/`toneCache`; tone calibration; filing the §21 open items | 01 (wiring), 03, 04 (server modules), 16, 26 (static half), 60, 61, 63, 64 (scheduling), 65, 67 (gate), 77 (gate), 80 (gate) | 05 (unit half), 11 | MED-020..037 | `main` (5.0) | PKG-005, PKG-038; QA-038/039 (calibration only) |
| `PROMPT_14c_MED_CORE_HOOK.md` | `mediaStore`, `useMediaElement`, progress loop, `mediaSession`, `sampleTone` option, type tests | 10–18, 67 (types) | 06 (unit half), 07 (commit half) | MED-040..049 | `main` | 14b merged; MOT-040 ticker (soft, fallback defined); A11Y-027 |
| `PROMPT_14d_MED_BACKDROPS.md` | `Backdrop` server component, 5 presets, grain asset, `BackdropTone` island, drift, background-video policy, SSR/motion/modes/sampling specs, stories | 01 (backdrops), 03, 04, 62, 63, 65, 70–77 | 05, 09, 12 (backdrop half), 13 (backdrop half) | MED-060..076 | `main` | 14b merged; DS-016/026/028; MAT-015/047; A11Y-029; MOT-040/020; SB-048/071; QA-056/075/076 |
| `PROMPT_14e_MED_CONTROLS_NOWPLAYING.md` | `MediaScrubber`, `MediaControls` (11 parts, shortcuts, captions), `NowPlayingBar` (7 parts), CSS, meta, unit + APG + container specs, stories | 20–34, 80 (these), 82, 83 | 10 (controls), 18 | MED-080..101 | `main` | 14c merged; FND-001/005; MAT-047; A11Y-065/073; PKG-005 (glyphs); QA-082; SB-048/071 |
| `PROMPT_14f_MED_WAVEFORM_VIEWER.md` | `ImageViewer` on OVL `Dialog`, zoom/pan/pinch, inspector, stories (5.0); `Waveform` (+ `WaveformLevel`, `downsample`) built behind the 5.1 gate | 40–49, 82 (stage), 83; 35–39 (5.1) | 10 (dialog), 17 | MED-110..125 | `main` (Waveform lands but is not exported until 5.1, MED-167) | 14b merged (sampling); 14c for tone wiring; OVL-040/023; FND-007; A11Y-049/054/073; DS-028 |
| `PROMPT_14g_MED_CAROUSEL.md` | `CarouselRail` flagship 44 (APG, scroll-snap, autoplay as a loop per SC-38), meta, specs, stories | 50–55, 82 (rail), 83 | 10 (carousel), 12 (autoplay) | MED-130..139 | `main` | 14b merged; A11Y-027/029/054/073; MOT-040; MAT-047; QA-082 |
| `PROMPT_14h_MED_CERT_MIGRATION.md` | exports/API reports, size and runtime budgets, perf lanes, clear-over-media scene and flagship visuals, registry items + `media-viewer` block content, §11.3 deliverables gate, meta `migration` fields + `media-backdrops` transform + fixtures, compat adapters, showcases, side-effect/directive gates, final AC table, 5.1 tail | 01, 02, 05, 66, 81, 92, 93, 95 (5.1) + lane verification of all others | 01–04, 06–15, 18 (final verification of all) | MED-013, MED-014, MED-140..167 | `main` | 14b–14g merged; QA-056/066/082; PERF-039/044; PKG-042/048/049; REL-003/070/115; DX-041/042/060/065/067/075; SB-110/113; FND-096/103 |

## Order

1. 14a, step 1 (4.1.1).
2. 14b, which can start in parallel with 14a.
3. 14c and 14d in parallel.
4. 14e and 14g in parallel, after 14c.
5. 14f, after 14b and 14c.
6. 14h.

Exceptions: 14a's 4.2 deprecation work lands before the `release/4.x` cut, and its 4.3 `ImageList*` work lands on `release/4.x`. 14h's codemod/compat tasks need DX-041/042/065 (beta). The RC-1 freeze (MED-142 final, MED-163) comes last. MED-166/167 (5.1) run after 5.0.0 GA.

## Explicit deviations

These are inherited from the PRD, not new. Prompts must not add others without stating them with evidence in their report.

1. Self-id PRD-14 vs §16 PRD-13 (resolved by the SC-01 crosswalk; key MED).
2. `MediaScrubber` and `formatMediaTime` are extra `./media` exports beyond the §3 row (errata E-04), which makes **7** values at 5.0.0; `Waveform` is the 8th in 5.1 (SC-12).
3. `CompareSlider` is deferred to 5.1.
4. Compat skips names with no 5.0 component successor (REQ-MED-93).
5. API-MED-12 is "mostly" rather than the "full" codemod in §12.
6. The ImageViewer `media` scrim variant has blur 0 (REQ-MED-46; OVL decision pending, OI-MED-03).

## Upstream-owned items are inputs, not work

The following belong to other PRDs. Every prompt verifies the ones it needs with a concrete check and stops with a blocker report if one is missing. It never stubs or re-implements them.

- The 4.1.1 `isStorybookDataMedia` fix and its test (TRUST-025), the `deprecations.json` seed (TRUST-075) and the npm-pack helper (TRUST-002) (TRUST)
- `docs/schemas/deprecations.schema.json`, `scripts/release/verify-deprecations.mjs`, `gen-deprecations.mjs`, `src/internal/warnDeprecated.ts`, `scripts/release/api-report.mjs` / `export-snapshot.mjs`, `scripts/release/visual-class.mjs`, the codemod id catalogue and `tests/fixtures/consumer-4x/` (REL)
- `build/exports.manifest.json`, `scripts/ci/verify-side-effects.mjs`, `scripts/ci/verify-size-budgets.mjs`, `docs/size-budgets.json`, the directive lint, the tarball gate, `.github/workflows/glass-pipeline.yml` and `tests/css/per-subpath-ownership.test.ts` (PKG)
- tokens (`tokens/sys/*.tokens.json`, compiler) and `auraglass/no-raw-design-values` (DS)
- `src/material/Surface.tsx`, `SurfaceGroup.tsx`, `Environment.tsx`, the `clear` scrim, `media` floors, the attribute registry and `auraglass/no-optics-outside-material` (MAT)
- `usePreference`, the provider, the announcer, `LayerStack`, `tests/a11y/apg/harness.ts` and `src/a11y/css/targets.css` (A11Y)
- `src/motion/ticker.ts` (with the `data-ag-offscreen` observer) and the `data-ag-continuous` semantics (MOT)
- `src/foundation/*` (parts registry, `usePortalContainer()`), the pinned `@base-ui/react` and the removal tooling (FND)
- `src/components/dialog/Dialog.client.tsx` and `.ag-scrim` (OVL)
- `registry/registry.json`, the `media-viewer` scaffold, `src/compat/index.ts`, the `migrate 4to5` engine and the codemod canary (DX)
- `certification/scenes/`, lanes L1–L14, workflows `certify-*.yml`, OCR, pixel gates and `verify-flagship-deliverables.mjs` (QA)
- `.storybook/preview.tsx` (`StoryEnvironment` + `StoryRoot`), the story contract and the `showcase/` files (SB)
- `tests/perf/harness/run-perf.mjs` and `tests/perf/harness/budgets.json` (PERF)

At HEAD `15b6de6f7`, all of these are absent. So is `@base-ui/react` (it is not in `package.json`).

## Common rules

Each sub-prompt restates these in full.

- **Repo.** `/Users/gurbakshchahal/platforms/AuraGlass`, baseline 4.1.0 at HEAD `15b6de6f7`. jest's default environment is `jsdom` (`jest.config.js:8`). `tests/types/tsconfig.json` maps `aura-glass/*` to `dist/*`, so type tests run after a build.
- **What runs remotely.** These run in GitHub Actions or on an ephemeral EC2 runner via the `auraone-remote-run` skill:
  - Playwright (QA lanes L5 Behaviour, L6 Environment visual, L7 Pixel regression, L8 Engine-specific, L9 Motion, L10 Performance)
  - Storybook builds
  - the full `npm run build`
  - size budgets
  - canaries

  For GitHub Actions, choose public or private handling per `/Users/gurbakshchahal/.config/agent-policy/reference/ci-selection.md`. Never use local Docker. Never run a local Playwright browser. jsdom jest, `tsc` on narrow configs and Node scripts may run locally.
- **No fake completion.** None of the following:
  - no mock, placeholder or simulated media behaviour in `src/media/**` or `src/backdrops/**` (no random peaks, no fake transcripts, no `setInterval` progress)
  - no `.skip`/`.only`/`.todo`/`test.fixme`/`xit`/`expect(true)`
  - no lowered thresholds or budgets (budgets ratchet down only, D-26)
  - no `--update-snapshots`/`-u` to reach green
  - no new allowlist or exemption entries beyond those the PRD names
  - no hand edits to generated files
- **GitHub writes.** Use the existing authenticated `gh` per `/Users/gurbakshchahal/.config/agent-policy/reference/github-npm.md`. Never log in, refresh tokens or set `GH_TOKEN`.
- **Evidence.** Evidence is CI artifacts keyed to the SHA (D-32) and is never committed. The only exceptions are the fixtures the PRD names (`scene-stats.json`, `peaks-voice.json`). The agent cannot view screenshots. A human reviews the remote capture artifacts.

## Final report

Each sub-prompt defines its own. The orchestrator merges them into one AC-MED-01..18 table with CI artifact links. That table also records:
- the status of each PRD §21 open item (OI-MED-01..07), with its accepted or fallback resolution
- the alpha choice for the drift property (§16)
- the 5.1 tail status (`Waveform` export MED-167, `media-transcript` MED-166)
