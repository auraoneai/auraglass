# Manual script — StatCard (SURF flagship 35, REQ-SURF-196)

Subject: StatCard Basic story. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Read each card; Tab to the linked card

## Pass criteria (every AT row)

- label, value and delta are read as one coherent text run
- delta direction is spoken (not colour-only)
- the linked card is a single link stop with a meaningful name

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `stat-card-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `stat-card-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `stat-card-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `stat-card-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `stat-card-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `stat-card-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
