# Manual script — Pagination (SURF flagship 28, REQ-SURF-196)

Subject: Pagination Default / Buttons stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Enter the pagination navigation; move Next then Previous; jump to a numbered page

## Pass criteria (every AT row)

- the navigation landmark is labelled
- exactly one page announces as current and it changes after Next/Previous
- unavailable Previous/Next announce as disabled at the ends

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `pagination-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `pagination-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `pagination-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `pagination-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `pagination-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `pagination-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
