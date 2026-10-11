# <Component> — screen-reader protocol

Cell: `<SR-1..SR-6>` · Component: `<name>` · Story: `<story id>` · SHA: `<pre-release sha>`

One file per (component, AT) pair. Record every step's announced
name/role/value, state change, open/close announcement, and live-region text.
Touch cells (SR-2, SR-4) also record the gesture and the non-drag alternative.

## Environment
- AT: `<VoiceOver macOS | VoiceOver iOS | NVDA | JAWS | TalkBack>` + version
- Browser: `<name + version>`
- OS: `<name + version>`
- Device (SR-2/SR-4): `<model>`
- Tester: `<name>` · Date: `<YYYY-MM-DD>`

## Steps

| # | Action (exact keystroke / gesture) | Expected announcement | nameRoleValue | stateChange | openClose | liveRegion | Pass | Notes |
|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | ☐ | |
