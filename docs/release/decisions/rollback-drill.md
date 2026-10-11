# Rollback drill record (PLAT-207)

- **Status**: blocked — operator action required.
- **What**: quarterly rollback drill per `docs/release-rollback-deprecation.md`
  (steps 1–5 against a scoped test version, `npm deprecate` exercised on a
  scoped prerelease tag, post-incident checklist completed).
- **Gate**: the drill needs the release owner's npm session with 2FA enabled.
  This session runs without npm access tokens or owner credentials by design.
- **Missing**: `npm whoami` (owner 2FA session), `npm dist-tag` write access.
- **Recorded**: 2026-10-08 by lane 1c-REL. The runbook steps and preflight
  checklist are committed; the drill is scheduled for the release owner before
  RC.1 (no later than the `5.0.0-rc.1` cut).
