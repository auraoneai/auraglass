# Manual a11y records (SURF)

Tester-produced SrRecords for SURF subjects, one JSON file per (subject, AT[, motion])
run on the RC SHA's CI-built Storybook (REQ-FIN-110 / REQ-QUAL-72):

- path: `tests/a11y/manual/records/surf/<subject>-<at>.json`
  (reduced-motion pass: `<subject>-<at>-motion.json`); the rows and paths are
  listed in `tests/a11y/manual/sr-matrix.template.json`
- shape: `contracts/schemas/sr-record.schema.json` (the single SrRecord schema)
  plus the L13 binding profile in `scripts/mat/verify-a11y-manual.mjs`
- check: `node scripts/mat/verify-a11y-manual.mjs --sha <rc-sha>`; the release
  pipeline aggregates them with `tests/a11y/manual/aggregate.mjs`

Agents never author records; the directory stays empty until the human pass runs.
