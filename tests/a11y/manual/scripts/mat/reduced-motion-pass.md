# Reduced-motion manual pass — Button, Dialog, Menu, Sheet, Tabs (REQ-MAT-66, REQ-MAT-44, L13)

Stream: `mat` · Pass: `motion` · SHA: the RC SHA under test.

With the OS motion reduction **on**, confirm on every required AT that each
subject stays visible and operable. Resolved motion is `calm` (REQ-MAT-44):
opacity cross-fades keep their token durations, transforms settle instantly,
and no infinite animation runs. Settled-state invariant: within
`--ag-duration-large` + 100 ms of every state change, every visible part is
fully opaque, unscaled, untranslated and not hidden.

Reach each story through `listSubjects()` (`tests/helpers`, S-40) with
`AG_STORYBOOK_URL` set to the CI-built Storybook artifact for the SHA, and pick
the entry whose `id` is listed below. The artifact URL goes in the record's
`storybookArtifactUrl`.

| Subject | Flagship | Story id |
|---|---|---|
| `button` | 1 | `flagships-controls-button--default` |
| `dialog` | 15 | `flagships-overlays-dialog--playground` |
| `menu` | 22 | `flagships-overlays-menu--playground` |
| `sheet` | 17 | `flagships-overlays-sheet--right-panel` |
| `tabs` | 25 | `surf-tabs--default` |

## OS setting per `at`

| `at` | Setting |
|---|---|
| `voiceover-macos` | System Settings → Accessibility → Display → Reduce motion: on (Safari) |
| `voiceover-ios` | Settings → Accessibility → Motion → Reduce Motion: on (Safari) |
| `nvda-chrome` | Settings → Accessibility → Visual effects → Animation effects: off (Windows) |
| `talkback-chrome` | Settings → Accessibility → Remove animations: on (Android) |

Run with the screen reader on. Before step 1, confirm that the story root
does not carry `data-ag-motion="full"` (the OS setting caps it at calm).

## Steps per subject

| Subject | # | Action | Expected |
|---|---|---|---|
| button | 1 | Activate the button | name and role announced; activation happens; no press scale or spring overshoot is visible; the label stays fully visible |
| button | 2 | Hover/press with pointer or touch | the light response is instant (no fade-in of the highlight) |
| dialog | 1 | Open the dialog | the dialog appears by cross-fade only (no zoom or slide); focus moves inside; title announced |
| dialog | 2 | Close with Escape / close button | it fades out; focus returns to the trigger; nothing stays half-transparent |
| menu | 1 | Open the menu | it appears by cross-fade only (no scale-in); first item focused and announced |
| menu | 2 | Move through items and choose one | each item announced; the menu closes; no lingering ghost |
| sheet | 1 | Open the sheet | it is fully in place when it appears (no slide-in); focus moves inside |
| sheet | 2 | Close it | it fades out; focus returns to the trigger |
| tabs | 1 | Move to another tab and activate it | "selected" announced; the panel switches with no slide; the indicator is in place at once |

Record per step: `action`, `expected`, `announced` (verbatim), `pass`.

## Required records (5 subjects × 4 ATs = 20)

`tests/a11y/manual/records/mat/<subject>-<at>-motion.json` for every subject
above and every `at` in `voiceover-macos`, `voiceover-ios`, `nvda-chrome`,
`talkback-chrome`. For example: `button-voiceover-macos-motion.json`, …,
`tabs-talkback-chrome-motion.json`.

Each record follows `contracts/schemas/sr-record.schema.json` with
`stream: "mat"`, `pass: "motion"`, `subject` set to the subject, `flagship` set
to its number, and `device` for the two mobile `at`s. Validate with
`node scripts/mat/verify-a11y-manual.mjs --sha <sha>`. G-09 counts these with
CMP's and SURF's records. Agents never author records (human-only, issue #16).
