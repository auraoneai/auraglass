# Toolbar — manual screen-reader script (CMP-384, L13)

Component under test: **Toolbar** — role="toolbar" with roving tabindex.
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
| Tab into toolbar | Tab | one tab stop; focus lands on an item |
| Move between items | ArrowRight/Left, Home/End | focus moves with loop; disabled skipped |
| Escape/close | Escape where applicable | state restores; focus returns to trigger |

## Pass criteria

- Every step announces the expected name/role/state in at least VoiceOver+Safari and NVDA+Chrome.
- No focus is ever lost to the document body.
- Record findings even for passes; a fail row links a Linear/GitHub issue id.
