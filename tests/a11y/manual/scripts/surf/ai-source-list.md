# Manual script — SourceList (SURF flagship 42, REQ-SURF-196)

Subject: SourceList Three / Twelve stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Read the sources trigger; expand the twelve-source list; follow a citation if present

## Pass criteria (every AT row)

- the trigger announces the source count and expanded/collapsed state
- each source reads as one link with its title; documents read as text
- a citation activation expands the list and focuses the cited source

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `ai-source-list-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `ai-source-list-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `ai-source-list-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `ai-source-list-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `ai-source-list-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `ai-source-list-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
