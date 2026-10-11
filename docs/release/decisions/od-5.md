---
id: OD-5
title: Renew the remote-runner egress CA
status: awaiting-owner
default: "Device lanes stay `pending` (manual jobs); every other lane runs on GitLab SaaS runners"
blocks: [REQ-FIN-112, REQ-QUAL-67]
decidedBy:
decidedAt:
evidence:
---

# OD-5 — Remote-runner egress CA renewal

Draft prepared by the FIN-H agent (H3-5, task FIN-467). The agent has not made
this decision and does not fill in `decidedBy`, `decidedAt` or `evidence`.

## Question

The egress proxy CA of the gated AWS remote runner expired on 2026-09-27
(master PRD §13.1 OD-5, `autopsy/runtime-remote.md:166`). Do you renew it, and
register the Device Farm project and the mac1.metal runner for
`qual:certify:devices`?

## Options

1. **Renew the CA and register the device runners.** The device lanes
   (REQ-QUAL-67) and the real-device performance sign-off (REQ-FIN-112) can then run.
2. **Defer (default).** Device and macOS/iOS Safari cells stay `pending` as
   manual jobs. AC-FIN-112 cannot close, so GA checklist line 9 stays open.

## Default (PRD-F §5.9)

Device lanes `pending`.

## Blocks

- REQ-FIN-112: real-device matrix sign-off (`docs/certification/real-device-matrix.md`).
- REQ-QUAL-67: the device-farm lane. REQ-QUAL-48's sign-off part depends on it too.

## Owner action

1. Renew the remote-runner egress CA bundle. This is a credential/infra action,
   outside the agent perimeter.
2. Register the AWS Device Farm project and the mac1.metal runner under the
   runner tag recorded by OD-11 ([od-11.md](./od-11.md)).
3. Ask an agent to run FIN-G's `qual:certify:devices --self-check` (G-25) in CI
   and attach the job URL as evidence.

## How to record (owner only)

Set `status: decided` (renewed) or `status: defaulted` (deferred), then fill in
`decidedBy`, `decidedAt` (ISO date) and `evidence` (the self-check job URL).
Agents never edit these fields.
