# Manual script — DateField (SURF flagship 14, REQ-SURF-196)

Subject: DateField, TimeField, DatePicker, Calendar stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Tab to the field; step segments with Up/Down; type digits; open the picker; navigate the grid; Escape

## Pass criteria (every AT row)

- each segment announces its role (spinbutton) and value text
- the picker dialog is announced with the field label
- grid movement announces the full date; the selected date announces as selected
- Escape closes the popup and focus returns to the trigger

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `date-field-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `date-field-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `date-field-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `date-field-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `date-field-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `date-field-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
