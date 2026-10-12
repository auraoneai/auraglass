# Surface (Material Lab) — screen-reader and touch protocol (REQ-MAT-66, L13)

Subject: `surface-material-lab` · Stream: `mat` · Flagship: none ·
Story: `material-lab-examples--overview` (plus `--tiers`, `--nesting-and-groups`,
`--shape-and-concentricity` in the same lab) · SHA: the RC SHA under test.

Reach the story through `listSubjects()` (`tests/helpers`, S-40) with
`AG_STORYBOOK_URL` set to the CI-built Storybook artifact for the SHA, and pick
the entry whose `id` is the story id above. Never test a locally built
Storybook, and never type the story URL by hand. The artifact URL you opened
goes in the record's `storybookArtifactUrl`.

What is under test: `Surface` is presentational material. It must add **no**
role, name, state or tab stop of its own, the content inside it must read in
DOM order, decorative optics (`::before`/`::after`, `LensDefs` SVG) must be
silent, and nothing may become invisible or unreachable under any tier.

## Required passes

| Pass | `at` | Record file |
|---|---|---|
| sr | `voiceover-macos` (Safari) | `tests/a11y/manual/records/mat/surface-material-lab-voiceover-macos.json` |
| sr | `voiceover-ios` (Safari) | `tests/a11y/manual/records/mat/surface-material-lab-voiceover-ios.json` |
| sr | `nvda-chrome` (Windows) | `tests/a11y/manual/records/mat/surface-material-lab-nvda-chrome.json` |
| sr | `talkback-chrome` (Android) | `tests/a11y/manual/records/mat/surface-material-lab-talkback-chrome.json` |
| touch | `touch-ios` (physical device, no SR) | `tests/a11y/manual/records/mat/surface-material-lab-touch-ios.json` |
| touch | `touch-android` (physical device, no SR) | `tests/a11y/manual/records/mat/surface-material-lab-touch-android.json` |

## Screen-reader steps (sr pass, every SR `at`)

Use the AT's linear reading command (VO+Right, NVDA ↓, one-finger flick right).

| # | Story | Action | Expected announcement | nameRoleValue | stateChange | openClose | liveRegion |
|---|---|---|---|---|---|---|---|
| 1 | overview | Read from the top of the story | "Regular chrome, heading level 3", then the paragraph | heading / level 3 | — | — | — |
| 2 | overview | Continue reading past the surface | no "group", "region", "image" or empty item is announced for the surface or its optics | — | — | — | — |
| 3 | tiers | Read all three rungs | "lightweight rung …", "standard", "enhanced + refraction …" in DOM order; the lens SVG is never announced | — | — | — | — |
| 4 | nesting-and-groups | Read nested surfaces | "outer", "nested …", "allowNested …" in order; no extra container announced | — | — | — | — |
| 5 | nesting-and-groups | Move through the five interactive group items | each item's text is read; the group adds no role | per item | — | — | — |
| 6 | nesting-and-groups | Read the disabled surface | its text is read at full legibility (host opacity stays 1) | — | — | — | — |
| 7 | shape-and-concentricity | Read the concentric frame | "concentric …", "inner concentric" in order | — | — | — | — |
| 8 | any | Tab (desktop) / next-control gesture (mobile) through the story | no tab stop lands on a non-interactive surface | — | — | — | — |

## Touch steps (touch pass, `touch-ios` and `touch-android`)

Record `gesture` and `nonDragAlternative` on every step (schema requirement).

| # | Story | Gesture | Expected | nonDragAlternative |
|---|---|---|---|---|
| 1 | overview | vertical scroll over the surface | the page scrolls; the surface never captures the pan | scroll the page outside the surface |
| 2 | nesting-and-groups | tap each group item | each item reacts with no 300 ms delay and no accidental neighbour hit (≥ 44 × 44 px target) | keyboard Tab + Enter on a paired keyboard |
| 3 | nesting-and-groups | press-and-hold an item, then drag off and release | no activation fires after the finger leaves the item | tap |
| 4 | tiers | pinch-zoom to 200 % | text inside every rung reflows and stays legible; no clipped content | browser text-size setting |
| 5 | any | rotate portrait ↔ landscape | surfaces keep their content visible; no blank fill | — |

## Recording

One `SrRecord` per row of "Required passes", schema
`contracts/schemas/sr-record.schema.json`, `stream: "mat"`,
`subject: "surface-material-lab"`, `flagship: null`, `pass: "sr" | "touch"`.
Mobile and touch records require `device`. `steps[]` carries every row above
with `action`, `expected`, `announced` (verbatim) and `pass`. Validate with
`node scripts/mat/verify-a11y-manual.mjs --sha <sha>`. Agents never author
records (human-only, issue #16).
