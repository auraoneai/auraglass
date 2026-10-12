# Manual script — Thread (SURF flagship 38, REQ-SURF-196)

Subject: Thread Short / Streaming stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Enter the conversation log; read messages in order; while streaming, wait for new content; use jump-to-latest if shown

## Pass criteria (every AT row)

- the log is announced once as a log/conversation region
- new streamed text does not steal focus or restart reading
- message order and authors are unambiguous

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `ai-thread-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `ai-thread-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `ai-thread-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `ai-thread-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `ai-thread-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `ai-thread-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
