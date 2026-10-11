# NumberField — manual screen-reader script (CMP-384, L13)

Component under test: **NumberField** — spinbutton with step/smallStep/largeStep.
Run each row of the SR matrix below. Record results in `tests/a11y/manual/records/cmp/` using the same file name.

## Matrix

| Assistive tech | Browser | Focus check |
|---|---|---|
| VoiceOver + Safari (macOS) | latest stable | see steps |
| VoiceOver (iOS, touch) | latest stable | see steps |
| NVDA + Chrome (Windows) | latest stable | see steps |
| TalkBack + Chrome (Android) | latest stable | see steps |
| Physical keyboard only (no SR) | latest stable | see steps |

## Steps

| Step | Action | Expected announcement/behavior |
|---|---|---|
| Step | ArrowUp/Down | +-step announced |
| Small step | Alt+ArrowUp/Down | +-smallStep |
| Large step | Shift+Arrow / PageUp/Down | +-largeStep |
| Escape/close | Escape where applicable | state restores; focus returns to trigger |

## Pass criteria

- Every step announces the expected name/role/state in at least VoiceOver+Safari and NVDA+Chrome.
- No focus is ever lost to the document body.
- Record findings even for passes; a fail row links a Linear/GitHub issue id.
