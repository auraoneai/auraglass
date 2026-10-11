# L14 human visual review records (REQ-FIN-111 / REQ-QUAL-73)

This directory holds the L14 review records written by the named design
reviewer at RC-1. The agent wrote only this README. Every other file here is
reviewer content: it is never generated, back-filled, edited or deleted by an
agent or by anyone other than the reviewer who produced it.

## What gets reviewed

At RC-1, using the review composites from the RC pipeline (FIN-G
`packages/qa/src/evidence/composite.ts`: 8 scenes × light/dark at 1440, the 390
`photo` cell, the previous approved baseline and a diff heat-map), the
reviewer scores, against `certification/review/visual-rubric.md`:

- every flagship subject-state,
- the T0 matrix,
- all six S1 showcases (`ai-command-center`, `financial-dashboard`,
  `ops-console`, `media-workspace`, `collaborative-workspace`,
  `mobile-productivity`),
- every subject changed by a baseline refresh.

Criteria R1–R7 are each scored 1–4 (R7 "reads as one hand" applies to S1
showcases only).

## File naming

One JSON file per reviewed item, directly in this directory:

| Item | File |
|---|---|
| Flagship subject-state | `<subject>-<state>.json` (meta id and `ComponentMeta.states` entry, kebab-case) |
| T0 matrix | `t0-matrix.json` |
| S1 showcase | `showcase-<id>.json` (`<id>` is the showcase id above) |

Each record follows FIN-G's `certification/schemas/review-record.schema.json`
(reviewer, SHA, subject-state, scores, notes, composite sha256). Its `sha` is
the RC SHA whose composites were reviewed.

## Validation

The manual GitLab job `qual:certify:review-record` (FIN-G, REQ-FIN-103)
validates every record here against the schema and the RC SHA. It runs on the
RC-1 pipeline and must pass (not be skipped); it is a release-blocking `needs`
of the verdict job. A record passes only when every criterion is ≥3 and none
is 1.

## Process

1. Records are committed by the reviewer in one PR on
   `next-fin/h-review-records-<rc>`, targeting `next`.
2. Run `qual:certify:review-record` on that RC pipeline and link the job in
   the PR.
3. A score below 3 is filed as a bug against the WP that owns the subject.
   The record is never edited to raise the score. After the fix lands, the
   subject is re-reviewed on a new RC SHA and the new record replaces the old
   one.
