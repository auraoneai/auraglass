# Manual script — Timeline (SURF flagship 37, REQ-SURF-196)

Subject: Timeline stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Read down the timeline items in order

## Pass criteria (every AT row)

- items read in chronological order with their timestamps in words
- decorative markers/rails are silent (no stray stops or graphics)

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `timeline-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `timeline-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `timeline-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `timeline-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `timeline-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `timeline-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
