# Manual script — Sidebar (SURF flagship 23, REQ-SURF-196)

Subject: Sidebar Anatomy story. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Tab through the item links; expand and collapse the collapsible group with Enter/Space

## Pass criteria (every AT row)

- the navigation landmark name is announced once
- the current item announces as current page
- the group toggle announces expanded/collapsed; hidden items leave the swipe/Tab order

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `sidebar-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `sidebar-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `sidebar-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `sidebar-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `sidebar-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `sidebar-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
