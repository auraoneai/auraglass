# L14 visual review rubric (REQ-QUAL-73 / REQ-FIN-111)

Used by the named design reviewer at RC-1 to score each review composite (`packages/qa/src/evidence/composite.ts`):
the 8 scenes × light/dark at 1440 px, the 390 px `photo` cell, the previous approved baseline, the current capture and
a diff heat-map. One record per item in `certification/review/records/` (format:
`certification/schemas/review-record.schema.json`; process: `certification/review/records/README.md`).

Required items at RC-1: every flagship subject-state, the T0 matrix, the six S1 showcases, and every subject changed
by a baseline refresh (REQ-QUAL-25). Review prompts contributed by streams (`fragments/review/*`, `ReviewItem`, S-45)
are read alongside the composite for the subject they name.

## Scores

Each criterion is scored 1–4. **An item passes only when every criterion is ≥3** (so no criterion is 1 or 2). A score
below 3 is filed as a bug against the owning stream; the record is never edited to raise it — the subject is
re-reviewed on a new RC SHA after the fix.

| Score | Meaning |
|---|---|
| 4 | Exemplary: no change wanted. |
| 3 | Ships: minor notes only, none visible at normal viewing distance. |
| 2 | Visible defect a user would notice in at least one scene or mode. Fails. |
| 1 | Broken: the criterion is not met in most scenes or modes. Fails. |

## Criteria

| Id | Criterion | Applies to | 4 looks like | 1 looks like |
|---|---|---|---|---|
| R1 | Material reads as glass over every scene | all items | over all 8 scenes (incl. `flat-white`, `flat-black`, `hf-pattern`) the surface is legible as a translucent layer: backdrop visibly softened, edge defined, content readable | reads as a flat grey card, a smudge, or disappears on light or busy scenes |
| R2 | Optical hierarchy | all items | chrome, overlay, transient and content layers separate by thickness and elevation; the eye lands on the primary element first | layers indistinguishable; overlays look like the page beneath |
| R3 | Specular quality | all items | highlights and bezel follow the shape, are subtle, consistent in direction and absent where the tier disables them | blown-out, banded, misaligned or noisy highlights; specular on solid/forced-colors |
| R4 | Radius and spacing rhythm | all items | radii nest (inner = outer − padding), spacing follows the scale, parts align on a shared grid at 1440 and 390 | mismatched radii, cramped or uneven gaps, clipped parts at 390 |
| R5 | Typography on glass | all items | text crisp and comfortably above contrast floors in every scene; weights and sizes consistent | text washed out over media or dense text, halos, wrong weights |
| R6 | Preference modes look designed | all items | light/dark, more contrast, reduced transparency and forced colors each look intentional, not like a fallback | a mode loses structure, colour clashes, or looks unstyled |
| R7 | Reads as one hand | S1 showcases only | every block in the showcase shares material, spacing, type and motion language; it looks like one product | blocks look assembled from different libraries |

## Record checklist for the reviewer

1. Open the composite from the RC pipeline's `qual:certify:review-record` artifact and note its sha256
   (`composites/index.json`).
2. Score R1–R6 (and R7 for an S1 showcase) using the table above; write notes for any score below 4.
3. Save `<subject>-<state>.json`, `t0-matrix.json` or `showcase-<id>.json` with your name, the RC SHA, the scores,
   notes, `compositeSha256` and `reviewedAt`.
4. Commit the records in one PR on `next-fin/h-review-records-<rc>` and run `qual:certify:review-record` on it.
