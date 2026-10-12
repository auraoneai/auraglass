# Manual script — ResizablePanels (SURF flagship 30, REQ-SURF-196)

Subject: ResizablePanels Default story. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Tab to the splitter; resize with Left/Right arrows; try Home/End limits

## Pass criteria (every AT row)

- the splitter announces as a separator/splitter with its orientation and value
- arrow keys change the announced value in consistent steps
- minimum/maximum sizes stop at the announced limits

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `resizable-panels-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `resizable-panels-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `resizable-panels-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `resizable-panels-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `resizable-panels-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `resizable-panels-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
