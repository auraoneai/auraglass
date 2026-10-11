---
id: OP-3
title: consumer-grep --write for RM-01..RM-13 and acknowledgements
req: REQ-FIN-113
relatedReqs: [REQ-PLAT-81, REQ-PLAT-08, REQ-PLAT-82]
status: awaiting-operator
performedBy:
performedAt:
evidence:
---

# OP-3: `consumer-grep --write` for RM-01..RM-13, plus acknowledgements

This runbook was drafted by the FIN-H agent (H3-6), which did not run any of it. The operator
runs the scan, reviews every hit, and sets the acknowledgements. After that the operator fills
in the front matter and the Evidence section and sets `status: done`.

## Prerequisites (all must hold, in this order)

1. PR #182 (`next-fin/plat-81-consumer-grep`, FIN-C) has merged on `next`. That PR adds
   `scripts/removal/consumer-grep.mjs` with the record shape `{family, sha, hits[], acknowledged[]}`.
   Today only the older `scripts/release/consumer-grep.mjs` exists. Do not run OP-3 with the old
   script.
2. The FIN-H.1 (b) RM sub-order has fully merged on `next`:
   #303 → #279/#282/#288 → #283 → #285 → #298 → #180 → #184
   (the R7 re-files `next-fin/h-rm11-<source-pr>` included). OP-3 regenerates RM-01..13, so if it
   ran before these merged it would overwrite them.
3. `next` is clean after the last merge:
   ```sh
   node scripts/release/gen-component-dispositions.mjs --check
   node -e 'for (const f of require("fs").readdirSync("docs/release/decisions/removals")) JSON.parse(require("fs").readFileSync("docs/release/decisions/removals/"+f))'
   ```
4. Both downstream roots exist on the owner Mac: `/Users/gurbakshchahal/AuraOne` and
   `/Users/gurbakshchahal/platforms`.
5. `gh` is already logged in, which the script's `gh search code` part needs. Use the existing
   login only (no `gh auth login|refresh`). If `gh search` is unavailable, the script records
   that. Never write "gh search unavailable" as an operator result.

## Commands

```sh
git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin
git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add /Users/gurbakshchahal/platforms/AuraGlass.wt/op3-consumer-grep -b next-fin/h-rm-consumer-grep origin/next
cd /Users/gurbakshchahal/platforms/AuraGlass.wt/op3-consumer-grep

# 1. scan and write every family record
for f in 01 02 03 04 05 06 07 08 09 10 11 12 13; do
  node scripts/removal/consumer-grep.mjs --family RM-$f \
    --roots /Users/gurbakshchahal/AuraOne,/Users/gurbakshchahal/platforms --write
done

# 2. review: list hits per family
for f in docs/release/decisions/removals/RM-??.json; do
  node -e 'const r=require("./"+process.argv[1]);console.log(r.family, "hits:", (r.hits||[]).length, "acknowledged:", JSON.stringify(r.acknowledged))' "$f"
done
```

3. Review each hit. For every hit that is acceptable (for example, the consumer already has a
   migration issue, or the hit is in a fixture or archive), add its entry to that record's
   `acknowledged[]` along with your name and the date. A hit that is a real live consumer of a
   removed name is **not** acknowledged. File it as a bug or issue against the consumer, and it
   blocks that RM family until resolved.
4. Verify every family:
   ```sh
   for f in 01 02 03 04 05 06 07 08 09 10 11 12 13; do
     node scripts/removal/consumer-grep.mjs --family RM-$f --verify || echo "RM-$f FAILED"
   done
   ```
5. Commit and open the PR, which merges in its §3 slot on green:
   ```sh
   git add docs/release/decisions/removals/RM-??.json
   git commit -m "chore(removal): consumer-grep records RM-01..13 with operator acknowledgements (REQ-FIN-113, REQ-PLAT-81)"
   git push -u origin next-fin/h-rm-consumer-grep
   gh pr create -R auraoneai/auraglass --base next --head next-fin/h-rm-consumer-grep \
     --title "chore(removal): consumer-grep RM-01..13 (OP-3)" \
     --body "Operator run of OP-3 (REQ-FIN-113 / REQ-PLAT-81). Hits reviewed and acknowledged by the operator."
   ```

Do not touch `RM-01.json` `gate.ghsa` / `gate.archive`. The owner fills those in under OD-21.

## Expected output

- Step 1 writes 13 records, one per family. Each record's `sha` is the `origin/next` SHA the
  worktree was cut from.
- Step 4 prints `consumer-grep --verify RM-NN: record current (<n> names)` for all 13 families
  and exits 0. Any `FAIL consumer-grep --verify` line means the run is not done.
- After the PR merges, `plat:gate:removal` (FIN-C) is green on the `next` pipeline for RM-01..13.

## Evidence to paste (operator)

- Date and the `origin/next` SHA scanned:
- Per-family hit count and acknowledged count (output of step 2 after the review):
- Output of step 4:
- PR URL (`next-fin/h-rm-consumer-grep`):
- `plat:gate:removal` job URL on `next` after the merge:
- Consumer issues filed for unacknowledged hits (URLs), if any:
