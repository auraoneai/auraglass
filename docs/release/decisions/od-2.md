---
id: OD-2
title: npm scope @auraglass ownership; publish unscoped fallback names
status: decided
default: "Unscoped `aura-glass-cli`, `aura-glass-labs`"
blocks: [REQ-FIN-31, REQ-FIN-87]
decidedBy: Gurbaksh Chahal (owner, live session; recorded by the agent)
decidedAt: 2026-10-12
evidence: "owner answer 2026-10-12: \"u dont need another organization just fucking upload it the way its been uploaded\" (https://www.npmjs.com/package/aura-glass)"
---

## Decision (2026-10-12)

No `@auraglass` npm org. Every AuraGlass package publishes unscoped from the
npm account `veeronecorp`, exactly the way `aura-glass` has always been
published (https://www.npmjs.com/package/aura-glass). The side packages ship
under the fallback names already recorded in `contracts/packages.json`:

| Former scoped name | Published name |
|---|---|
| `@auraglass/cli` | `aura-glass-cli` |
| `@auraglass/registry` | `aura-glass-registry` |
| `@auraglass/mcp` | `aura-glass-mcp` |
| `@auraglass/labs` | `aura-glass-labs` |
| `@auraglass/qa` (private, never published) | `aura-glass-qa` |

The `@auraglass` org is not created. `contracts/packages.json` keys are the
unscoped names (fallback = same name), so the pack/publish scripts publish the
unscoped names. At decision time `npm view` returned E404 for all four
published names (free). Supersedes the earlier same-day record "Create
@auraglass org".


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

None remaining: the unscoped names publish from `veeronecorp`; the
trusted-publisher setup for each name follows OD-10 ([od-10.md](./od-10.md)).

## Related records (FIN-C, not edited here)

- [`npm-scope.md`](./npm-scope.md): published names, fallback names and status rows.
- [`npm-trusted-publishing.md`](./npm-trusted-publishing.md): OIDC trusted-publisher configuration (OD-10).

## How to record (owner only)

Set `status: decided` (org created, or fallback chosen) or `status: defaulted`
(fallback names), then fill in `decidedBy`, `decidedAt` (ISO date) and
`evidence`. Agents never edit these fields.
