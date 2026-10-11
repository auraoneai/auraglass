# Security policy — aura-glass 5.x

## Supported versions

| Version | Status |
| --- | --- |
| 5.x (latest minor) | Supported — fixes and security patches |
| 4.x | LTS for 12 months after 5.0.0 GA — C-I + security fixes only (see `docs/release/lts-policy.md`) |
| < 4.x | Not supported |

## Reporting a vulnerability

Report privately; do not open a public issue.

- GitHub private vulnerability reporting:
  <https://github.com/auraoneai/auraglass/security/advisories/new>, or
- email the security contact listed in `package.json` (`author`/`maintainers`
  block) when private reporting is unavailable.

Include:

- affected aura-glass version(s)
- package entrypoint or file path involved
- minimal reproduction or proof of concept
- impact assessment (browser-only code, SSR helpers, workers, docs, supply chain)
- known mitigations, if any
- whether the issue needs a registry-side action (deprecate, unpublish window)

We acknowledge within 3 business days and aim to ship a fix or a documented
mitigation inside 30 days for confirmed reports.

## What counts as a security exception

Deprecation entries that must land inside a minor (instead of the removal
train) may carry an `exception: 'security'` field **only with committed
evidence** (advisory link or incident record under `docs/release/decisions/`).
The same applies to privacy, crash, legal and honesty exceptions — the
exception allowlist in `docs/release/exception-allowlist.json` governs them.

## Scope notes

- `aura-glass` is a client-side component library; server-side surfaces were
  removed for 5.0.0 (see breaking register `docs/release/breaking-changes.json`,
  B-id for removed server exports). Vulnerabilities in the removed surface are
  handled by upgrading to 5.x.
- Supply-chain questions (provenance, dist-tags, npm deprecations) follow the
  rollback runbook `docs/release-rollback-deprecation.md`.
