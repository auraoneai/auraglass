---
id: OD-2
title: npm scope @auraglass ownership; create the org
status: awaiting-owner
default: "Unscoped `aura-glass-cli`, `aura-glass-labs`"
blocks: [REQ-FIN-31, REQ-FIN-87]
decidedBy:
decidedAt:
evidence:
---

# OD-2 — npm scope `@auraglass`

Draft prepared by the FIN-H agent (H3-5, task FIN-466). The agent has not made
this decision and does not fill in `decidedBy`, `decidedAt` or `evidence`.

## Question

Does AuraOne own the `@auraglass` npm scope? If so, create the `@auraglass` npm
org so `@auraglass/cli`, `@auraglass/registry`, `@auraglass/mcp` and
`@auraglass/labs` can publish under it.

## Options

1. **Create or confirm the `@auraglass` org** and add the publishing identity.
   The scoped names in `contracts/packages.json` are then used.
2. **Scope unavailable (default).** Publish unscoped as `aura-glass-cli`,
   `aura-glass-labs` (and the other fallback names in `npm-scope.md`). The
   pack/publish scripts read names from `contracts/packages.json`.

## Default (PRD-F §5.9)

Unscoped `aura-glass-cli`, `aura-glass-labs`.

## Blocks

- REQ-FIN-31: CLI publish.
- REQ-FIN-87: labs package name.

## Owner action

1. On npmjs.com, create or confirm the org **`@auraglass`** (Profile → Add
   Organization), or confirm it is taken.
2. If it is created, the trusted-publisher setup for each scoped package
   follows OD-10 ([od-10.md](./od-10.md)).

## Related records (FIN-C, not edited here)

- [`npm-scope.md`](./npm-scope.md): published names, fallback names and status rows.
- [`npm-trusted-publishing.md`](./npm-trusted-publishing.md): OIDC trusted-publisher configuration (OD-10).

## How to record (owner only)

Set `status: decided` (org created, or fallback chosen) or `status: defaulted`
(fallback names), then fill in `decidedBy`, `decidedAt` (ISO date) and
`evidence` (the npm org URL, e.g. `https://www.npmjs.com/org/auraglass`).
Agents never edit these fields.
