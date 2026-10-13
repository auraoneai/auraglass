# Manual script — TreeView (SURF flagship 33, REQ-SURF-196)

Subject: TreeView Basic / Keyboard stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Tab to the tree; descend and ascend; expand/collapse with Right/Left; press *; select an item

## Pass criteria (every AT row)

- one Tab stop for the whole tree
- level, expanded/collapsed and selected state announce per item
- collapsed children are skipped; no label is read twice

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `tree-view-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `tree-view-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `tree-view-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `tree-view-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `tree-view-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `tree-view-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
