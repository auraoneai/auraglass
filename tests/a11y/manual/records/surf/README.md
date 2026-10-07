# SURF manual a11y records

Screen-reader and touch records for SURF surfaces, one JSON file per
`(flagship, at)` run, conforming to `contracts/schemas/sr-record.schema.json`:

```json
{ "flagship": "23", "at": "voiceover-macos", "result": "pass",
  "date": "2026-…", "tester": "…", "sha": "<merge sha>", "notes": "optional" }
```

Records are produced by remote-device runs (VoiceOver macOS/iOS,
NVDA+Chrome, TalkBack+Chrome, physical touch) — they land here only after
a run, never authored in advance. Scopes per the lane prompt:

- SURF-527: the six AppShell shells + flagships 22–31 (scripts under
  `tests/a11y/manual/scripts/surf/`).
- SURF-536: flagships 38–42 on the ai-workspace block, including "a streamed
  answer is announced once" and "approval request is announced".

Naming: `<flagship>-<at>.json` (e.g. `23-voiceover-ios.json`). A flagship
with no records is pending, not absent — absence in this directory is the
expected state until the first device run.
