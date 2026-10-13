# Manual script — Table (SURF flagship 32, REQ-SURF-196)

Subject: Table Basic / Selection stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Enter the table; read headers; sort a column; move cell to cell; select a row (Selection story)

## Pass criteria (every AT row)

- column headers announce with their sort state (ascending/descending/none)
- sorting is announced assertively after activation
- row selection state announces; no layout-table announcements

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `table-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `table-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `table-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `table-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `table-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `table-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
