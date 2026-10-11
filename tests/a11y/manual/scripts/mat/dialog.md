# Dialog — screen-reader protocol (MAT-317)

Cell: SR-1 (desktop SR) / SR-3 (mobile SR) · Component: Dialog · Story: `cmp-dialog--playground` (or current flagship).

## VoiceOver macOS
| # | Action | Expected announcement | nameRoleValue | stateChange | openClose | liveRegion | Pass | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | VO+Space on "Open dialog" | "dialog, <title>" or "<title>, web dialog" + focus moves in | `<title>` / dialog / — | — | opened | dialog title | ☐ | |
| 2 | VO+Right inside | content read in order | per control | — | — | — | ☐ | |
| 3 | Tab through all focusables | focus stays inside the dialog | — | — | — | — | ☐ | wrap on last |
| 4 | Escape | dialog closes; focus returns to trigger | — | — | closed | — | ☐ | |
| 5 | VO+Right after close | reading resumes at trigger | trigger / button / — | — | — | — | ☐ | |

## VoiceOver iOS (SR-3 — gesture + nonDragAlternative required)
| # | Action | Expected announcement | Gesture | nonDragAlternative | Pass | Notes |
|---|---|---|---|---|---|---|
| 1 | Double-tap "Open dialog" | "<title>, dialog" | double-tap | — | ☐ | |
| 2 | One-finger flick right | content read | flick right | rotor items | ☐ | |
| 3 | Two-finger scrub (Z) on close button or swipe to Close + double-tap | closes, focus restored | scrub / double-tap | on-screen Close | ☐ | |

## NVDA
| # | Action | Expected announcement | nameRoleValue | stateChange | openClose | liveRegion | Pass | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | Enter on "Open dialog" | "<title> dialog" | `<title>` / dialog / — | — | opened | — | ☐ | |
| 2 | Escape | closes, focus on trigger | — | — | closed | — | ☐ | |
| 3 | Shift+Tab from first control | wraps or stays inside (no background read) | — | — | — | — | ☐ | |

## TalkBack (SR-3)
| # | Action | Expected announcement | Gesture | nonDragAlternative | Pass | Notes |
|---|---|---|---|---|---|---|
| 1 | Double-tap "Open dialog" | "<title>, dialog" | double-tap | — | ☐ | |
| 2 | Swipe right | content read | swipe right | reading controls | ☐ | |
| 3 | Back or Close button | closes; focus returns | back gesture / double-tap | Close button | ☐ | |

Records: `tests/a11y/manual/records/mat/dialog-<cell>-<sha>.json`, validated by
`scripts/mat/verify-a11y-manual.mjs`, uploaded via the manual GitLab job as
`a11y-manual-<sha>.json`. Agents never author records (MAT-318/324).
