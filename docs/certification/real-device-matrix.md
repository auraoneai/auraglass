---
status: awaiting-signature
signer:
signedAt:
sha:
---

# Real-device performance matrix (REQ-FIN-112 / REQ-QUAL-48 sign-off)

This file is the sign-off record for real-device frame performance before RC-1.
The agent wrote the skeleton. Every measured cell, every `pass` cell, every
artifact URL and the front matter fields `signer`, `signedAt` and `sha` are
filled in only by the named performance signer (Gurbaksh or a delegate) from
the output of the device-farm job. Nobody else edits them, and no value is
copied from a local run, an estimate or an earlier SHA.

## Prerequisites (all must be true before any cell is filled)

1. OD-5 is recorded: the remote-runner egress CA is renewed
   (`docs/release/decisions/od-5.md`). Until then the device lane preflight
   exits 78 and the lane reports `pending`.
2. OD-11 is recorded: the AWS runner tag is registered for GitLab project
   87152036 and the Device Farm project plus the EC2 `mac1.metal` host are
   available to `qual:certify:devices` (`docs/release/decisions/od-11.md`).
3. FIN-G's device runner (`scripts/qual/devices/device-farm-run.mjs`,
   REQ-QUAL-48 agent part) and the `qual:certify:devices` job are on `next`.
4. The RC SHA exists (the `v5.0.0-rc.1` tag pipeline on `next`).

## How the matrix is filled

1. On the RC SHA's GitLab pipeline, trigger the manual `qual:certify:devices`
   job (it extends `.ag-aws-remote` and runs only on the registered runner).
2. When it finishes, open its results JSON artifact. For each row below copy
   the frame p95 the job measured for that subject and device into
   `p95 frame ms (measured)`, set `pass` to `yes` or `no` against the row's
   budget, and paste the job artifact URL for that session into
   `artifact URL`.
3. Set `sha` to the RC SHA the job ran on, `signer` to your name and
   `signedAt` to the ISO-8601 date, then change `status` to `signed`.
4. Commit only this file, on a `next-fin/h-*` branch, and link the pipeline
   in the PR.

Budget rules (REQ-QUAL-48):

- iPhone 13 (iOS 18 and iOS 26), Pixel 7 and the Intel-Mac proxy: p95
  ≤16.7 ms.
- Mid-tier Android (Moto G Power class): p95 ≤25 ms. One signed exception up
  to ≤33 ms is allowed; record it under "Exceptions" with the row, the
  measured value and the reason. Anything above 33 ms fails.
- A session that records 0 frames is a failure, not an empty cell.
- `Dialog` is measured on open/close and `AppShell` on scroll. The six S1
  scenes are measured with the interaction the device runner drives for each
  scene.

A row whose cells are empty is not signed. The matrix is signed only when
every row has a measured value, an artifact URL and `pass: yes` (or an
exception recorded below), all from the same `sha`.

## Devices

| Device | OS / browser | Source | Budget |
|---|---|---|---|
| iPhone 13 | iOS 18 / Safari 18 | AWS Device Farm | 16.7 ms |
| iPhone 13 | iOS 26 / Safari 26 | AWS Device Farm | 16.7 ms |
| Pixel 7 | Android / Chrome | AWS Device Farm (LoAF via CDP over `adb forward`) | 16.7 ms |
| Moto G Power class (mid-tier Android) | Android / Chrome | AWS Device Farm (LoAF via CDP over `adb forward`) | 25 ms |
| Intel-Mac proxy | macOS / Safari on EC2 `mac1.metal` | EC2 (instance role only) | 16.7 ms |

## Matrix

Subjects: the six S1 showcases (`ai-command-center`, `financial-dashboard`,
`ops-console`, `media-workspace`, `collaborative-workspace`,
`mobile-productivity`), `Dialog` and `AppShell`.

| Subject | Interaction | Device | p95 frame ms (measured) | budget | pass | artifact URL |
|---|---|---|---|---|---|---|
| ai-command-center | S1 scene | iPhone 13, iOS 18 Safari |  | 16.7 ms |  |  |
| ai-command-center | S1 scene | iPhone 13, iOS 26 Safari |  | 16.7 ms |  |  |
| ai-command-center | S1 scene | Pixel 7, Chrome |  | 16.7 ms |  |  |
| ai-command-center | S1 scene | Moto G Power class, Chrome |  | 25 ms |  |  |
| ai-command-center | S1 scene | Intel-Mac proxy, Safari (mac1.metal) |  | 16.7 ms |  |  |
| financial-dashboard | S1 scene | iPhone 13, iOS 18 Safari |  | 16.7 ms |  |  |
| financial-dashboard | S1 scene | iPhone 13, iOS 26 Safari |  | 16.7 ms |  |  |
| financial-dashboard | S1 scene | Pixel 7, Chrome |  | 16.7 ms |  |  |
| financial-dashboard | S1 scene | Moto G Power class, Chrome |  | 25 ms |  |  |
| financial-dashboard | S1 scene | Intel-Mac proxy, Safari (mac1.metal) |  | 16.7 ms |  |  |
| ops-console | S1 scene | iPhone 13, iOS 18 Safari |  | 16.7 ms |  |  |
| ops-console | S1 scene | iPhone 13, iOS 26 Safari |  | 16.7 ms |  |  |
| ops-console | S1 scene | Pixel 7, Chrome |  | 16.7 ms |  |  |
| ops-console | S1 scene | Moto G Power class, Chrome |  | 25 ms |  |  |
| ops-console | S1 scene | Intel-Mac proxy, Safari (mac1.metal) |  | 16.7 ms |  |  |
| media-workspace | S1 scene | iPhone 13, iOS 18 Safari |  | 16.7 ms |  |  |
| media-workspace | S1 scene | iPhone 13, iOS 26 Safari |  | 16.7 ms |  |  |
| media-workspace | S1 scene | Pixel 7, Chrome |  | 16.7 ms |  |  |
| media-workspace | S1 scene | Moto G Power class, Chrome |  | 25 ms |  |  |
| media-workspace | S1 scene | Intel-Mac proxy, Safari (mac1.metal) |  | 16.7 ms |  |  |
| collaborative-workspace | S1 scene | iPhone 13, iOS 18 Safari |  | 16.7 ms |  |  |
| collaborative-workspace | S1 scene | iPhone 13, iOS 26 Safari |  | 16.7 ms |  |  |
| collaborative-workspace | S1 scene | Pixel 7, Chrome |  | 16.7 ms |  |  |
| collaborative-workspace | S1 scene | Moto G Power class, Chrome |  | 25 ms |  |  |
| collaborative-workspace | S1 scene | Intel-Mac proxy, Safari (mac1.metal) |  | 16.7 ms |  |  |
| mobile-productivity | S1 scene | iPhone 13, iOS 18 Safari |  | 16.7 ms |  |  |
| mobile-productivity | S1 scene | iPhone 13, iOS 26 Safari |  | 16.7 ms |  |  |
| mobile-productivity | S1 scene | Pixel 7, Chrome |  | 16.7 ms |  |  |
| mobile-productivity | S1 scene | Moto G Power class, Chrome |  | 25 ms |  |  |
| mobile-productivity | S1 scene | Intel-Mac proxy, Safari (mac1.metal) |  | 16.7 ms |  |  |
| Dialog | open/close | iPhone 13, iOS 18 Safari |  | 16.7 ms |  |  |
| Dialog | open/close | iPhone 13, iOS 26 Safari |  | 16.7 ms |  |  |
| Dialog | open/close | Pixel 7, Chrome |  | 16.7 ms |  |  |
| Dialog | open/close | Moto G Power class, Chrome |  | 25 ms |  |  |
| Dialog | open/close | Intel-Mac proxy, Safari (mac1.metal) |  | 16.7 ms |  |  |
| AppShell | scroll | iPhone 13, iOS 18 Safari |  | 16.7 ms |  |  |
| AppShell | scroll | iPhone 13, iOS 26 Safari |  | 16.7 ms |  |  |
| AppShell | scroll | Pixel 7, Chrome |  | 16.7 ms |  |  |
| AppShell | scroll | Moto G Power class, Chrome |  | 25 ms |  |  |
| AppShell | scroll | Intel-Mac proxy, Safari (mac1.metal) |  | 16.7 ms |  |  |

## Exceptions

At most one, mid-tier Android only, ≤33 ms, signed by the signer above.

| Subject | Device | p95 frame ms (measured) | Reason | artifact URL |
|---|---|---|---|---|

## References

- PRD-F (AuraGlass 5 final completion PRD) REQ-FIN-112, AC-FIN-112.
- REQ-QUAL-48 (`docs/auraglass-5/prd/AURAGLASS_QUALITY_SHOWCASE_PRD.md`).
- Showcase ids: REQ-QUAL-58, same PRD, §5.9.
