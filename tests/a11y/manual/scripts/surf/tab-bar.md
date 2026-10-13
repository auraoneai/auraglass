# Manual script — TabBar (SURF flagship 26, REQ-SURF-196)

Subject: TabBar Default / Anatomy stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Swipe or Tab through the bar items; activate the non-current item

## Pass criteria (every AT row)

- the bar is a labelled navigation landmark
- the current item announces as current; icon-only parts add no extra stops
- badge text is part of the item name

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `tab-bar-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `tab-bar-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `tab-bar-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `tab-bar-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `tab-bar-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `tab-bar-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
