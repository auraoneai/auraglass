# Manual script — MediaControls (SURF flagship 43, REQ-SURF-196)

Subject: MediaControls Paused / Full stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Tab through the controls; play/pause; move the scrubber with arrows; adjust volume; read the time display

## Pass criteria (every AT row)

- play/pause announces its current action
- the scrubber announces as a slider with elapsed/total time text
- mute and volume states announce; captions control is reachable when tracks exist

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `media-controls-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `media-controls-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `media-controls-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `media-controls-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `media-controls-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `media-controls-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
