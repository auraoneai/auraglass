# Button — screen-reader protocol (MAT-317)

Cell: SR-1 (desktop SR) / SR-3 (mobile SR) · Component: Button · Story: `cmp-button--playground` (or current flagship).

## VoiceOver macOS (⌘+F5)
| # | Action | Expected announcement | nameRoleValue | stateChange | openClose | liveRegion | Pass | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | VO+Right to the button | "Button, <label>" | `<label>` / button / — | — | — | — | ☐ | |
| 2 | VO+Space (press) | activation confirmed; downstream change announced | — | pressed→not pressed | — | result text | ☐ | |
| 3 | VO+Right to the disabled button | "dimmed, <label>, button" | `<label>` / button / dimmed | — | — | — | ☐ | |
| 4 | VO+Space on disabled button | nothing activates | — | — | — | — | ☐ | |
| 5 | VO+Right to loading button | "busy" state announced (aria-busy) | `<label>` / button / busy | — | — | — | ☐ | |

## VoiceOver iOS (touch; SR-3 — record gesture + nonDragAlternative)
| # | Action | Expected announcement | Gesture | nonDragAlternative | Pass | Notes |
|---|---|---|---|---|---|---|
| 1 | One-finger flick right to the button | "Button, <label>" | flick right | rotor item list | ☐ | |
| 2 | Double-tap | activation | double-tap | VO+Space on paired keyboard | ☐ | |
| 3 | Flick to disabled button | "dimmed" | flick right | — | ☐ | |

## NVDA (Windows)
| # | Action | Expected announcement | nameRoleValue | stateChange | openClose | liveRegion | Pass | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | ↓ to the button | "<label> button" | `<label>` / button / — | — | — | — | ☐ | |
| 2 | Enter | action occurs | — | — | — | result text | ☐ | |
| 3 | ↓ to disabled button | "<label> button unavailable" | `<label>` / button / unavailable | — | — | — | ☐ | |

## TalkBack (Android; SR-3 — record gesture + nonDragAlternative)
| # | Action | Expected announcement | Gesture | nonDragAlternative | Pass | Notes |
|---|---|---|---|---|---|---|
| 1 | Swipe right to the button | "<label>. Button. Double-tap to activate." | swipe right | TalkBack menu → reading controls | ☐ | |
| 2 | Double-tap | activation | double-tap | external keyboard Enter | ☐ | |
| 3 | Swipe to disabled button | "Disabled" announced | swipe right | — | ☐ | |

Record to `tests/a11y/manual/records/mat/button-<cell>-<sha>.json` per
`tests/a11y/manual/sr-record.schema.json`; the record is validated by
`scripts/mat/verify-a11y-manual.mjs` and uploaded as `a11y-manual-<sha>.json`
via the manual GitLab job. Agents never author records (MAT-318/324).
