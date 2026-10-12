# Manual script — CarouselRail (SURF flagship 44, REQ-SURF-196)

Subject: CarouselRail Tabs / Buttons stories. Run on the RC SHA's CI-built Storybook artifact
(REQ-FIN-110); record one `sr-record` JSON per row in
`tests/a11y/manual/records/surf/` (schema:
`contracts/schemas/sr-record.schema.json`). `result` is `pass`/`fail` only;
nuance goes in `notes`.

## Path to exercise

Tab to the rail; move between slides with arrows and the previous/next buttons; read each slide

## Pass criteria (every AT row)

- the region announces as a carousel with its label
- each slide announces as "n of m"
- arrow keys or tabs move selection and focus together to the chosen slide
- previous/next buttons announce disabled state at the ends

## Matrix

| AT combo | record file | pass when |
| --- | --- | --- |
| VoiceOver macOS + Safari | `carousel-rail-voiceover-macos.json` | every criterion above holds |
| VoiceOver iOS + Safari | `carousel-rail-voiceover-ios.json` | every criterion above holds with swipe navigation |
| NVDA + Chrome | `carousel-rail-nvda-chrome.json` | every criterion above holds |
| TalkBack + Chrome | `carousel-rail-talkback-chrome.json` | every criterion above holds with swipe navigation |
| Physical touch, iOS (no AT) | `carousel-rail-touch-ios.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
| Physical touch, Android (no AT) | `carousel-rail-touch-android.json` | every interactive target is at least 44x44 px at a coarse pointer and reachable without overlap |
