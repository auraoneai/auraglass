#!/usr/bin/env node
/* push-gitlab-refs.mjs (REQ-FIN-20 fallback, REQ-PLAT-06, FIN-044/045).

   OD-8 fallback for when the GitLab pull mirror cannot be configured: the
   OWNER runs this from the owner Mac after each merge so GitLab project
   87152036 receives the refs it needs to run pipelines. Agents never run
   --apply (PROMPT_FINAL_COMPLETION_V2 §6 B3-3).

   Usage: node scripts/release/push-gitlab-refs.mjs            # dry-run (default)
          node scripts/release/push-gitlab-refs.mjs --apply    # owner only
            [--gitlab-url <https url>]   default: the project 87152036 repo URL

   Ref set (enumerated from `git ls-remote origin`, GitHub is the source):
     branches  main, next, release/4.x, release/4.1.x,
               next-*\/**, 4x-*\/**, 4x11-*\/**, contract/**, sync/**
     tags      v*
   Each ref is pushed by its GitHub SHA with its own `git push` (no --force,
   no --prune, no --mirror): a ref GitLab holds at a diverged SHA fails and is
   reported instead of being overwritten.

   Dry-run prints the exact `git push` per ref and pushes nothing. It only
   reads (`git ls-remote origin`, `git show origin/main:…`), and reports
   whether --apply would be refused.

   --apply refuses (exit 1) when:
     - CI or GITLAB_CI is set (never from a pipeline),
     - $USER is not the owner account,
     - origin/main:.github/workflows/mirror-to-gitlab.yml still contains
       `--prune` (the org mirror would delete these refs again; OD-8 says to
       remove the prune step first). The workflow is read, never edited.
     - the GitLab URL embeds credentials (userinfo).
   Credentials come only from git's configured credential helper (macOS
   Keychain); this script never reads, prints or passes a token. */
import { execFileSync, spawnSync } from "node:child_process";

const OWNER_USER = "gurbakshchahal";
const DEFAULT_GITLAB_URL =
  "https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass.git";
const MIRROR_WORKFLOW = ".github/workflows/mirror-to-gitlab.yml";
const BRANCH_PATTERNS = [
  "main",
  "next",
  "release/4.x",
  "release/4.1.x",
  "next-*/**",
  "4x-*/**",
  "4x11-*/**",
  "contract/**",
  "sync/**",
];
const TAG_PATTERNS = ["v*"];

/* Pattern semantics: `*` matches within one path segment, a trailing `/**`
   matches one or more further segments; anything else is literal. */
function patternToRegExp(p) {
  let src = "";
  let rest = p;
  let deep = false;
  if (rest.endsWith("/**")) {
    rest = rest.slice(0, -3);
    deep = true;
  }
  for (const ch of rest) {
    if (ch === "*") src += "[^/]*";
    else src += ch.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  }
  if (deep) src += "/.+";
  return new RegExp(`^${src}$`);
}
const BRANCH_RE = BRANCH_PATTERNS.map(patternToRegExp);
const TAG_RE = TAG_PATTERNS.map(patternToRegExp);

function selectRefs(lsRemoteOutput) {
  const refs = [];
  for (const line of lsRemoteOutput.split("\n")) {
    const m = /^([0-9a-f]{40,64})\s+(refs\/(heads|tags)\/(.+))$/.exec(
      line.trim()
    );
    if (!m) continue;
    const [, sha, ref, kind, name] = m;
    if (name.endsWith("^{}")) continue; // peeled tag line; the tag object itself is pushed
    const res = kind === "heads" ? BRANCH_RE : TAG_RE;
    if (res.some((r) => r.test(name))) refs.push({ sha, ref, kind, name });
  }
  return refs.sort((a, b) => a.ref.localeCompare(b.ref));
}

function git(args, opts = {}) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    maxBuffer: 64 * 1024 * 1024,
    ...opts,
  });
}

/* Never echo URL userinfo (a token pasted into --gitlab-url). */
function redact(u) {
  return String(u).replace(
    /^([a-z][a-z0-9+.-]*:\/\/)[^/@]*@/i,
    "$1<redacted>@"
  );
}

/* Guards that need no git access; checked before --apply touches anything. */
function envRefusals(gitlabUrl) {
  const out = [];
  if (process.env.CI || process.env.GITLAB_CI) {
    out.push(
      "CI/GITLAB_CI is set: push-gitlab-refs never runs from a pipeline (owner Mac only)"
    );
  }
  if (process.env.USER !== OWNER_USER) {
    out.push(
      `$USER is "${process.env.USER ?? ""}", not the owner account "${OWNER_USER}"`
    );
  }
  let url;
  try {
    url = new URL(gitlabUrl);
  } catch {
    out.push(`--gitlab-url is not a URL: ${redact(gitlabUrl)}`);
  }
  if (url && (url.username || url.password)) {
    out.push(
      "--gitlab-url embeds credentials; use git's credential helper (Keychain) instead"
    );
  }
  if (url && url.protocol !== "https:") out.push("--gitlab-url must be https");
  return out;
}

/* The org mirror workflow on origin/main must no longer prune (OD-8). */
function workflowRefusals() {
  const out = [];
  let workflow = null;
  try {
    workflow = git(["show", `origin/main:${MIRROR_WORKFLOW}`]);
  } catch (e) {
    const msg = `${e?.stderr ?? e?.message ?? e}`.split("\n")[0];
    if (!/does not exist|exists on disk, but not in/.test(msg)) {
      out.push(
        `cannot read origin/main:${MIRROR_WORKFLOW} (${msg}); refusing rather than guessing`
      );
    }
  }
  if (workflow !== null && /--prune\b/.test(workflow)) {
    out.push(
      `origin/main:${MIRROR_WORKFLOW} still contains --prune; OD-8 fallback requires the owner to ` +
        "remove the prune step from mirror-to-gitlab for this repo first (it would delete these refs on GitLab)"
    );
  }
  return out;
}

function main() {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");
  const i = argv.indexOf("--gitlab-url");
  const gitlabUrl = i >= 0 ? argv[i + 1] : DEFAULT_GITLAB_URL;
  const known = new Set(["--apply", "--gitlab-url"]);
  for (const [k, a] of argv.entries()) {
    if (a.startsWith("--") && !known.has(a)) {
      console.error(`push-gitlab-refs: unknown option ${a}`);
      process.exit(2);
    }
    if (a === "--gitlab-url" && !argv[k + 1]) {
      console.error("push-gitlab-refs: --gitlab-url needs a value");
      process.exit(2);
    }
  }

  console.log(
    `push-gitlab-refs: ${apply ? "APPLY" : "dry-run (no push)"} -> ${redact(gitlabUrl)}`
  );
  console.log(`branch patterns: ${BRANCH_PATTERNS.join(", ")}`);
  console.log(`tag patterns:    ${TAG_PATTERNS.join(", ")}`);

  const refuse = (list) => {
    for (const r of list) console.error(`refused: ${r}`);
    console.error(
      "push-gitlab-refs: --apply refused (see OD-8 owner action in docs/release/decisions/gitlab-ci-verification.md)"
    );
    process.exit(1);
  };
  const envRefused = envRefusals(gitlabUrl);
  if (apply && envRefused.length) refuse(envRefused);
  if (apply) {
    // Refresh origin/main before the --prune check so a stale checkout cannot pass it.
    try {
      git([
        "fetch",
        "--quiet",
        "origin",
        "+refs/heads/main:refs/remotes/origin/main",
      ]);
    } catch (e) {
      console.error(
        `push-gitlab-refs: git fetch origin main failed: ${`${e?.stderr ?? e}`.split("\n")[0]}`
      );
      process.exit(1);
    }
  }
  const refused = [...envRefused, ...workflowRefusals()];
  if (apply && refused.length) refuse(refused);

  let ls;
  try {
    ls = git(["ls-remote", "--heads", "--tags", "origin"]);
  } catch (e) {
    console.error(
      `push-gitlab-refs: git ls-remote origin failed: ${`${e?.stderr ?? e}`.split("\n")[0]}`
    );
    process.exit(1);
  }
  const refs = selectRefs(ls);
  if (!refs.length) {
    console.error(
      "push-gitlab-refs: no matching refs on origin (expected at least main/next)"
    );
    process.exit(1);
  }

  if (apply) {
    // Objects for every selected SHA must exist locally before pushing by SHA.
    try {
      git([
        "fetch",
        "--quiet",
        "--tags",
        "origin",
        "+refs/heads/*:refs/remotes/origin/*",
      ]);
    } catch (e) {
      console.error(
        `push-gitlab-refs: git fetch origin failed: ${`${e?.stderr ?? e}`.split("\n")[0]}`
      );
      process.exit(1);
    }
  }

  const failed = [];
  for (const r of refs) {
    const args = ["push", gitlabUrl, `${r.sha}:${r.ref}`];
    console.log(`git ${args.map(redact).join(" ")}`);
    if (!apply) continue;
    const res = spawnSync("git", args, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    });
    if (res.status !== 0) {
      failed.push(r.ref);
      console.error(
        `  FAILED ${r.ref}: ${`${res.stderr ?? ""}`.trim().split("\n").pop()}`
      );
    }
  }

  console.log(
    `${refs.length} ref(s) ${apply ? "processed" : "would be pushed"}`
  );
  if (!apply) {
    if (refused.length) {
      console.log("--apply would currently be refused:");
      for (const r of refused) console.log(`  - ${r}`);
    } else {
      console.log("--apply guards: all clear");
    }
    return;
  }
  if (failed.length) {
    console.error(
      `push-gitlab-refs: ${failed.length} ref(s) failed (diverged on GitLab or rejected); never force-pushed:`
    );
    for (const f of failed) console.error(`  ${f}`);
    process.exit(1);
  }
}

main();
