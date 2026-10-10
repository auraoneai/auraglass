---
id: OP-2
title: Downstream grep at the 4.2 cut and the AuraOne follow-up issue
req: REQ-FIN-113
relatedReqs: [REQ-PLAT-35]
status: awaiting-operator
performedBy:
performedAt:
evidence:
---

# OP-2: Downstream grep at the 4.2 cut, plus the AuraOne follow-up issue

The FIN-H agent drafted this runbook (H3-6) and has run none of it. The operator runs the steps,
fills in the front-matter fields and the Evidence section, and sets `status: done`.

## Prerequisites

- FIN-C's PLAT-35 fixes have merged on the line being cut. These are: build/lock dirs excluded,
  structured hits, removed symbols derived from fragments, and the report path
  `docs/release/decisions/downstream-<version>.json`. If `scripts/release/downstream-grep.mjs`
  still writes the old shape (`{root, pins, imports, servicesImports, removedSymbolHits}` with a
  hard-coded `REMOVED_SYMBOLS` list), stop and record `blocked: PLAT-35 not merged`.
- The run happens at the `v4.2.0` cut, from a clean PLAT worktree of the commit being tagged on
  `release/4.x`:
  ```sh
  git -C /Users/gurbakshchahal/platforms/AuraGlass fetch origin
  git -C /Users/gurbakshchahal/platforms/AuraGlass worktree add /Users/gurbakshchahal/platforms/AuraGlass.wt/op2-downstream-4.2 -b 4x-fin/h-downstream-4.2 origin/release/4.x
  cd /Users/gurbakshchahal/platforms/AuraGlass.wt/op2-downstream-4.2
  ```
- `rg` is on `PATH`. The script refuses to scan `$HOME` or `/` and caps each root at 60 s.
- `gh` is already logged in with issue-write access on the AuraOne repository. The
  `/Users/gurbakshchahal/AuraOne` checkout's `origin` is `https://github.com/auraoneai/AuraFoundry.git`.
  Use the existing login only. Never run `gh auth login|refresh`. If `gh api user` fails, record
  the exact error.

## Commands

1. Run the scan. Both roots are on the owner Mac:
   ```sh
   node scripts/release/downstream-grep.mjs \
     --roots /Users/gurbakshchahal/AuraOne,/Users/gurbakshchahal/platforms \
     --out docs/release/decisions/downstream-4.2.0.json
   ```
2. Review the report. A root with `status` `missing`, `refused` or `partial-timeout` is not
   clean. Re-run that root with `--timeout-secs 120`, or record why it is incomplete.
3. Commit the report on the worktree branch and open a PR to `release/4.x`. The `v4.2.0`
   GitHub release (OP-5) attaches this file.
   ```sh
   git add docs/release/decisions/downstream-4.2.0.json
   git commit -m "chore(release): downstream grep report at the 4.2 cut (REQ-FIN-113, REQ-PLAT-35)"
   git push -u origin 4x-fin/h-downstream-4.2
   gh pr create -R auraoneai/auraglass --base release/4.x --head 4x-fin/h-downstream-4.2 \
     --title "chore(release): downstream-4.2.0.json (OP-2)" --body "Operator run of OP-2. REQ-FIN-113 / REQ-PLAT-35."
   ```
4. File the AuraOne follow-up issue for the two templates pinned at `aura-glass@3.1.1`. A
   bounded read-only `rg` over `package.json` files on 2026-10-10 found them here, but the
   step 1 report is authoritative:
   - `opensource/open-studio-platform/docs-template/package.json` (`"aura-glass": "3.1.1"`)
   - `opensource/open-studio-platform/templates/tauri-app/package.json` (`"aura-glass": "3.1.1"`)

   Write the excerpt from the report, then file the issue:
   ```sh
   node -e '
     const r = require("./docs/release/decisions/downstream-4.2.0.json");
     const lines = ["Downstream grep at the aura-glass 4.2.0 cut (REQ-FIN-113 OP-2).", "", "Pinned at 3.1.1:"];
     for (const root of r.roots) for (const h of (root.pins || [])) if (JSON.stringify(h).includes("3.1.1")) lines.push("- " + (typeof h === "string" ? h : JSON.stringify(h)));
     lines.push("", "Upgrade to aura-glass ^4.2.0 (the 4.x LTS line); see the 4.2.0 release notes for deprecations.");
     require("fs").writeFileSync("/tmp/op2-issue-body.md", lines.join("\n") + "\n");'
   gh issue create -R auraoneai/AuraFoundry \
     --title "Upgrade aura-glass from 3.1.1 in opensource/open-studio-platform/docs-template and templates/tauri-app" \
     --body-file /tmp/op2-issue-body.md
   rm /tmp/op2-issue-body.md
   ```

## Expected output

- Step 1 prints one line per root,
  `downstream <root>: ok pins=<n> imports=<n> removedHits=<n>`, then
  `report -> …/docs/release/decisions/downstream-4.2.0.json`, and exits 0. Exit 2 means every
  root was missing, which is not a pass.
- The report lists at least the two 3.1.1 pins above under the AuraOne root.
- `gh issue create` prints the new issue URL.

## Evidence to paste (operator)

- Date of the run and the `release/4.x` SHA it ran on:
- Console output of step 1:
- PR URL for `downstream-4.2.0.json`:
- AuraOne issue URL:
