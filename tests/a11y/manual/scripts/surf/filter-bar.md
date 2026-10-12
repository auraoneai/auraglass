# Manual script — FilterBar (SURF flagship 34, REQ-SURF-196)

Subject: FilterBar Default story. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Tab through the filter chips; open a chip editor; change a value; remove a chip; clear all

## Pass criteria (every AT row)

- each chip announces its field, operator and value
- the editor opens as a dialog with focus on its first field
- Escape returns focus to the chip
- the result count announces after a change

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `filter-bar-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `filter-bar-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `filter-bar-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `filter-bar-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `filter-bar-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `filter-bar-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
