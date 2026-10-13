# Manual script — CommandPalette (SURF flagship 29, REQ-SURF-196)

Subject: CommandPalette Default story. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Open the palette; type a query; arrow through results; run one; reopen and Escape

## Pass criteria (every AT row)

- the dialog and its search field are announced on open; focus starts in the field
- the highlighted result is announced as it changes with arrow keys
- Escape closes and focus returns to where it was before opening

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `command-palette-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `command-palette-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `command-palette-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `command-palette-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `command-palette-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `command-palette-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
