---
id: OP-6
title: Close stale stacked PRs #77 and #97 and confirm none remain before RC-1
req: REQ-FIN-113
relatedReqs: [REQ-PLAT-08]
status: awaiting-operator
performedBy:
performedAt:
evidence:
---

# OP-6: Close #77 and #97, then confirm no stale stacked PR remains before RC-1

The FIN-H agent (H3-6) drafted this runbook and did not close anything. Closing PRs is an
operator action. The operator runs the steps, fills in the front matter and the Evidence
section, and sets `status: done`.

A *stale stacked PR* is an open PR whose head commit is already an ancestor of `origin/next`,
`origin/release/4.x` or `origin/release/4.1.x`. Its content is already merged, so its diff
against its stacked base is misleading. REQ-FIN-113 requires that none remain before RC-1.

## Prerequisites

- `gh` is already logged in with write access on `auraoneai/auraglass`. Use that login only,
  with no login or refresh.
- Run from any up-to-date checkout of `auraoneai/auraglass`, for example a PLAT worktree.

## Commands

1. Re-verify. Both commands must exit 0:
   ```sh
   git fetch origin
   git merge-base --is-ancestor bfc216d0a origin/next && echo "#77 contained in next"
   git merge-base --is-ancestor d5d950b59 origin/release/4.x && echo "#97 contained in release/4.x"
   ```
2. Close both PRs with the exact comments:
   ```sh
   gh pr close 77 -R auraoneai/auraglass --comment "Superseded: head bfc216d0a is an ancestor of origin/next (contained via 366ff2023). Closing per REQ-FIN-113."
   gh pr close 97 -R auraoneai/auraglass --comment "Superseded: head d5d950b59 is an ancestor of origin/release/4.x (contained via 645735fce). Closing per REQ-FIN-113."
   ```
   Containing merges: `366ff2023` "Merge pull request #77 from auraoneai/next-plat/rel-removal-tooling"
   and `645735fce` "Merge pull request #112 from auraoneai/4x-plat/4x-bridge-43".
3. Final check before RC-1: list every open PR whose head is an ancestor of a release line.
   ```sh
   git fetch origin
   gh pr list -R auraoneai/auraglass --state open --limit 500 --json number,headRefOid,headRefName \
     | node -e '
       const { execFileSync } = require("child_process");
       const prs = JSON.parse(require("fs").readFileSync(0, "utf8"));
       const isAnc = (sha, ref) => { try { execFileSync("git", ["merge-base", "--is-ancestor", sha, ref], { stdio: "ignore" }); return true; } catch { return false; } };
       const stale = [];
       for (const p of prs) {
         try { execFileSync("git", ["cat-file", "-e", p.headRefOid + "^{commit}"], { stdio: "ignore" }); }
         catch { execFileSync("git", ["fetch", "origin", p.headRefOid], { stdio: "ignore" }); }
         const lines = ["origin/next", "origin/release/4.x", "origin/release/4.1.x"].filter((r) => isAnc(p.headRefOid, r));
         if (lines.length) stale.push({ number: p.number, head: p.headRefOid.slice(0, 9), branch: p.headRefName, containedIn: lines });
       }
       console.log(JSON.stringify({ open: prs.length, stale }, null, 2));
       process.exit(stale.length ? 1 : 0);'
   ```

## Expected output

- Step 1 prints both `contained in` lines.
- Step 2 prints `✓ Closed pull request auraoneai/auraglass#77` and the same for `#97`.
- Step 3 prints `"stale": []` and exits 0. Any entry it lists is triaged before RC-1. If the
  owning WP's PR is superseded, the owner or that WP closes it with the same kind of comment,
  naming the containing commit. That entry is then added to this file.

## Pre-computed list (agent, 2026-10-10T18:53Z)

The FIN-H agent computed this list by running step 3's logic. It ran
`gh pr list --state open --limit 500 --json number,headRefOid,headRefName,baseRefName` and then
`git merge-base --is-ancestor <head> <line>` for each line. It used these refs:
`origin/next` `55f444423`, `origin/release/4.x` `645735fce`, `origin/release/4.1.x` `a19f4bbe1`.

Results: 241 open PRs, none from a fork, and every head SHA was available locally. Two are stale:

| PR | Head | Head branch → base | Ancestor of | Containing commit |
|---|---|---|---|---|
| #77 | `bfc216d0a` | `next-plat/rel-removal-tooling` → `next-plat/rel-ledger` | `origin/next` | `366ff2023` (merge of #77) |
| #97 | `d5d950b59` | `4x-plat/4x-tree-hygiene` → `4x-plat/4x-lint-gate` | `origin/release/4.x`, `origin/release/4.1.x` | `645735fce` (merge of #112) |

A few minutes later the agent ran step 3 exactly as written. By then 243 PRs were open, and
the result was the same two stale PRs. None of the other open PR heads is an ancestor of `origin/next`, `origin/release/4.x` or
`origin/release/4.1.x`. The PR list changes as merges land, so the operator re-runs step 3
right before RC-1. This table is input to that check, not a substitute for it.

## Evidence to paste (operator)

- Date:
- Step 1 output:
- Close URLs / `gh` output for #77 and #97:
- Step 3 output before RC-1 (JSON, with the `origin/next` SHA it ran on):
