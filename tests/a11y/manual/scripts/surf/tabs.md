# Manual script — Tabs (SURF flagship 25, REQ-SURF-196)

Subject: Tabs Default story. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Tab to the tab list; move with Left/Right (and Home/End); activate a tab; Tab to the panel

## Pass criteria (every AT row)

- one Tab stop for the whole tab list
- the active tab announces as selected with its position (n of m)
- the panel for the newly selected tab is what the next Tab reaches

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `tabs-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `tabs-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `tabs-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `tabs-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `tabs-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `tabs-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
