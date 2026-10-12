# Manual script — Breadcrumbs (SURF flagship 27, REQ-SURF-196)

Subject: Breadcrumbs Default / Overflow stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Read the trail; open the overflow ("Show n more") menu; Escape

## Pass criteria (every AT row)

- the trail is a labelled navigation landmark; the last item announces as current page and is not a link
- the overflow trigger announces how many items it holds
- Escape closes the menu and returns focus to the trigger

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `breadcrumbs-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `breadcrumbs-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `breadcrumbs-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `breadcrumbs-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `breadcrumbs-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `breadcrumbs-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
