# GlassPreferencesPanel — screen-reader and touch protocol (REQ-MAT-66, REQ-MAT-60, L13)

Subject: `glass-preferences-panel` · Stream: `mat` · Flagship: none ·
Story: `theme-glasspreferencespanel--default` (plus `--floor-locked`, `--rtl`)
· SHA: the RC SHA under test.

Reach the story through `listSubjects()` (`tests/helpers`, S-40) with
`AG_STORYBOOK_URL` set to the CI-built Storybook artifact for the SHA, and pick
the entry whose `id` is the story id above. The artifact URL goes in the
record's `storybookArtifactUrl`.

What is under test: a native `fieldset`/`legend` form. Each preference is a
named group (radio group, a `role="switch"` checkbox or a range input).
Floor-locked options stay focusable with `aria-disabled="true"` and are
described by the floor note. Every change is announced politely as
"<Title> set to <Label>".

## Required passes

| Pass | `at` | Record file |
|---|---|---|
| sr | `voiceover-macos` (Safari) | `tests/a11y/manual/records/mat/glass-preferences-panel-voiceover-macos.json` |
| sr | `voiceover-ios` (Safari) | `tests/a11y/manual/records/mat/glass-preferences-panel-voiceover-ios.json` |
| sr | `nvda-chrome` (Windows) | `tests/a11y/manual/records/mat/glass-preferences-panel-nvda-chrome.json` |
| sr | `talkback-chrome` (Android) | `tests/a11y/manual/records/mat/glass-preferences-panel-talkback-chrome.json` |
| touch | `touch-ios` (physical device, no SR) | `tests/a11y/manual/records/mat/glass-preferences-panel-touch-ios.json` |
| touch | `touch-android` (physical device, no SR) | `tests/a11y/manual/records/mat/glass-preferences-panel-touch-android.json` |

## Screen-reader steps (sr pass, every SR `at`)

| # | Story | Action | Expected announcement | nameRoleValue | stateChange | openClose | liveRegion |
|---|---|---|---|---|---|---|---|
| 1 | default | Move into the panel | "Preferences, group" | Preferences / group | — | — | — |
| 2 | default | Move to the Transparency group, then its first radio | "Transparency, group"; "System, radio button, 1 of 4" (checked state read) | System / radio / checked or not | — | — | — |
| 3 | default | Select "Tinted" (arrow keys on desktop; double-tap on mobile) | "Tinted, radio button, checked" | Tinted / radio / checked | not checked → checked | — | "Transparency set to Tinted" |
| 4 | default | Move to the Glass opacity slider and raise it one step | "Glass opacity, slider, 5% more opaque" | Glass opacity / slider / 5% more opaque | value changes | — | "Glass opacity set to 0.05" |
| 5 | default | Move to Motion, select "Calm" | "Calm, radio button, checked" | Calm / radio / checked | checked | — | "Motion set to Calm" |
| 6 | default | Move to "Allow continuous animation" and toggle it | "Allow continuous animation, switch, on/off" | Allow continuous animation / switch / on | off → on | — | "Allow continuous animation set to true" |
| 7 | default | Move to Density, select "Spacious" | "Spacious, radio button, checked" | Spacious / radio / checked | checked | — | "Density set to Spacious" |
| 8 | floor-locked | Move to a floor-locked option | read as dimmed / unavailable, **and** the floor note is read as its description (e.g. "Your system's Reduce Transparency setting requires at least Tinted") | <label> / radio / dimmed | — | — | — |
| 9 | floor-locked | Try to select the locked option | selection does not change; no "set to" announcement | — | none | — | none |
| 10 | rtl | Read the panel in RTL | groups and options read in logical order; arrow keys follow the visual direction | — | — | — | — |

## Touch steps (touch pass, `touch-ios` and `touch-android`)

Record `gesture` and `nonDragAlternative` on every step (schema requirement).

| # | Story | Gesture | Expected | nonDragAlternative |
|---|---|---|---|---|
| 1 | default | tap an option label | the radio selects; the target is ≥ 44 × 44 px; layout is single-column at coarse pointer | — |
| 2 | default | drag the Glass opacity thumb | value follows in 5 % steps; the output shows the percentage | tap the track, or a paired keyboard's arrow keys |
| 3 | default | tap the continuous-animation switch | toggles on the first tap | — |
| 4 | floor-locked | tap a locked option | nothing changes; the floor note stays visible | — |
| 5 | rtl | tap through options | hit areas match the mirrored layout | — |

## Recording

One `SrRecord` per row of "Required passes", schema
`contracts/schemas/sr-record.schema.json`, `stream: "mat"`,
`subject: "glass-preferences-panel"`, `flagship: null`,
`pass: "sr" | "touch"`. Mobile and touch records require `device`. Validate
with `node scripts/mat/verify-a11y-manual.mjs --sha <sha>`. Agents never
author records (human-only, issue #16).
