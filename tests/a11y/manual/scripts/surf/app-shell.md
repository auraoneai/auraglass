# Manual script — AppShell (SURF flagship 22, REQ-SURF-196)

Subject: AppShell Default / SkipLink stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Tab from the top of the page; activate the skip link; list landmarks; toggle the sidebar

## Pass criteria (every AT row)

- the first Tab stop is "Skip to content" and activating it lands in the main content
- banner, navigation, main and contentinfo landmarks are each listed once
- the sidebar toggle announces its action and expanded/collapsed effect on the navigation

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `app-shell-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `app-shell-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `app-shell-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `app-shell-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `app-shell-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `app-shell-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
