#!/usr/bin/env node
/* contract:ownership (§3.1, §3.2, §2.4.1, §2.3 sync exemption; REQ-FIN-30).
   Usage: node scripts/ci/verify-ownership.mjs [--branch <b>] [--files f1,f2] [--base <ref>]
   CI: derives the stream from the branch prefix (AG_STREAM overrides).

   Rules:
   - next-<s>/  : files must resolve to owner <S> on the 5x table.
   - 4x-<s>/, 4x11-<s>/ : release/4.x (and release/4.1.x, OD-13) table — PLAT owns
                  every path except other streams' fragments/{deprecations,codemods}/<s>*
                  and ci/<s>* plus the row-H material bridge (MAT only).
   - next-fin/<wp>-* (wp = a..h) : files must resolve to FIN-<WP> on the PRD-F §6
                  table (scripts/ci/fin-ownership.json, then contracts/ownership.json
                  through streamToWp). package.json is split by key: exports/main/types
                  → FIN-A, every other key → FIN-C.
   - next-fin/<s>-* (s = plat|mat|cmp|surf|qual, existing PR branches): FIN WP of <s>.
   - next-fin/4x-<s>-*, 4x-fin/*, 4x11-fin/* : the 4x zone rule; the stream is <s>,
                  or the FIN WP's stream (d→mat, e→cmp, f→surf, g→qual, else plat).
   - contract/  : any non-NONE owner.
   - sync/fragments-deprecations-* : fragments/deprecations/** + src/internal/deprecations.generated.ts
   - sync/fragments-codemods-*     : fragments/codemods/**
   - main, next, release/4.x, release/4.1.x, or no branch: report only (warn, exit 0).
   - any other branch: fail closed.
   Renames count as the delete+add pair (--no-renames). */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import picomatch from "picomatch";

const args = process.argv.slice(2);
const opt = (n) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : null;
};
// An empty --branch (e.g. "$CI_COMMIT_BRANCH" in an MR pipeline) must not mean "unrestricted".
const branch =
  opt("branch") || process.env.CI_MERGE_REQUEST_SOURCE_BRANCH_NAME || "";
const explicit = opt("files")?.split(",").filter(Boolean);

const rows = JSON.parse(readFileSync("contracts/ownership.json", "utf8")).rows;
const FIN = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "fin-ownership.json"),
    "utf8"
  )
);
const STREAMS = ["plat", "mat", "cmp", "surf", "qual"];
const OTHER = (s) => STREAMS.filter((x) => x !== s);
const is = (glob) => picomatch(glob, { dot: true });

const rowH = rows.filter((r) => /^H\d/.test(r.id));
const rowHGlobs = rowH.map((r) => r.glob);

const b = branch.replace(/^refs\/heads\//, "");
const line =
  /^(?:4x|4x11)-/.test(b) ||
  b.startsWith("next-fin/4x-") ||
  process.env.AG_LINE === "4x"
    ? "4x"
    : "5x";

function ownerOf(path) {
  for (const r of rows) {
    if (line === "4x" && !r.lines) continue; // 4x resolves only §2.4.1 rows (H*, 4x-scoped)
    if (r.lines && !r.lines.includes(line)) continue; // row scoped to the other line
    if (is(r.glob)(path)) return r;
  }
  return { id: "Z01", glob: "**", owner: "PLAT" };
}

// PRD-F §6: the FIN work package that owns a path on `next`.
const finMatchers = FIN.rows.map((r) => ({ ...r, test: is(r.glob) }));
function finOwnerOf(path) {
  const c = ownerOf(path);
  const r = finMatchers.find((x) => x.test(path));
  if (r && (c.owner !== "NONE" || r.allowNoneLocation)) {
    return { id: `FIN:${r.id}`, glob: r.glob, owner: r.wp, note: r.note };
  }
  return { ...c, owner: FIN.streamToWp[c.owner] ?? c.owner, stream: c.owner };
}

// package.json key split (PRD-F §6): top-level keys changed between the merge base and HEAD.
function packageJsonKeysChanged(baseRef) {
  const git = (a) =>
    execFileSync("git", a, {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
  let mb;
  try {
    mb = git(["merge-base", baseRef, "HEAD"]).trim();
  } catch {
    return null;
  }
  const read = (ref) => {
    try {
      return JSON.parse(git(["show", `${ref}:${FIN.packageJson.path}`]));
    } catch {
      return {};
    }
  };
  const before = read(mb);
  const after = read("HEAD");
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys].filter(
    (k) => JSON.stringify(before[k]) !== JSON.stringify(after[k])
  );
}

// On 4x, the path zones a non-PLAT stream may touch.
const streamZone = (s, p) =>
  is(
    `{fragments/{deprecations,codemods}/${s}{.ts,.json,/**},ci/${s}.gitlab-ci.yml,ci/${s}/**}`
  )(p);
const matZone = (p) => streamZone("mat", p) || rowHGlobs.some((g) => is(g)(p));
const zone4x = (s) =>
  s === "plat"
    ? (r, p) =>
        r.owner !== "NONE" &&
        !OTHER("plat").some((o) => streamZone(o, p)) &&
        !matZone(p)
    : (r, p) =>
        streamZone(s, p) || (s === "mat" && rowHGlobs.some((g) => is(g)(p)));

const base =
  opt("base") ??
  process.env.AG_BASE ??
  `origin/${process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME ?? "next"}`;

let allowed, label;
let resolve = ownerOf;
let finWp = null;
const m5 = /^next-(plat|mat|cmp|surf|qual)\//.exec(b);
const m4 = /^(?:4x|4x11)-(plat|mat|cmp|surf|qual)\//.exec(b);
const mFin = /^next-fin\/(?:([a-h])|(plat|mat|cmp|surf|qual))-/.exec(b);
const mFin4 = /^next-fin\/4x-(plat|mat|cmp|surf|qual)-/.exec(b);
const mFinX = /^(4x|4x11)-fin\/(?:([a-h])-|(plat|mat|cmp|surf|qual)-)?/.exec(b);
const mSync = /^sync\/fragments-(deprecations|codemods)-/.exec(b);
if (process.env.AG_STREAM) {
  const s = process.env.AG_STREAM.toLowerCase();
  allowed = line === "4x" ? zone4x(s) : (r) => r.owner === s.toUpperCase();
  label = `AG_STREAM=${s}`;
} else if (m5) {
  const s = m5[1].toUpperCase();
  allowed = (r) => r.owner === s;
  label = `stream ${s} (next)`;
} else if (m4) {
  const s = m4[1].toLowerCase();
  allowed = zone4x(s);
  label = `stream ${s.toUpperCase()} (4x bridge)`;
} else if (mFin4) {
  const s = mFin4[1];
  allowed = zone4x(s);
  label = `next-fin/4x-${s} (4x zone ${s.toUpperCase()})`;
} else if (mFinX) {
  const wp = mFinX[2]
    ? FIN.letterToWp[mFinX[2]]
    : mFinX[3]
      ? FIN.streamToWp[mFinX[3].toUpperCase()]
      : null;
  const s = mFinX[3] ?? (wp ? FIN.wpTo4xStream[wp] : "plat");
  allowed = zone4x(s);
  label = `${mFinX[1]}-fin${wp ? ` ${wp}` : ""} (4x zone ${s.toUpperCase()})`;
} else if (mFin) {
  finWp = mFin[1]
    ? FIN.letterToWp[mFin[1]]
    : FIN.streamToWp[mFin[2].toUpperCase()];
  resolve = finOwnerOf;
  allowed = (r) => r.owner === finWp;
  label = `${finWp} (next-fin, PRD-F §6)`;
} else if (b.startsWith("contract/")) {
  allowed = (r) => r.owner !== "NONE";
  label = "contract PR";
} else if (mSync) {
  const kind = mSync[1];
  const extra =
    kind === "deprecations" ? ["src/internal/deprecations.generated.ts"] : [];
  allowed = (r, p) => is(`fragments/${kind}/**`)(p) || extra.includes(p);
  label = `sync/fragments-${kind}`;
} else if (["main", "next", "release/4.x", "release/4.1.x", ""].includes(b)) {
  allowed = () => true;
  label = "unrestricted branch";
} else {
  allowed = () => false;
  label = `unrecognised branch ${b}`;
}

const files =
  explicit ??
  execFileSync(
    "git",
    [
      "diff",
      "--name-only",
      "--no-renames",
      "--diff-filter=ACMRD",
      `${base}...HEAD`,
    ],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
  )
    .trim()
    .split("\n")
    .filter(Boolean);

const bad = [];
for (const f of files) {
  const r = resolve(f);
  if (finWp && f === FIN.packageJson.path) {
    const { keysWp, keys, restWp } = FIN.packageJson;
    if (finWp !== keysWp && finWp !== restWp) {
      bad.push(
        `${f}  -> ${keysWp} (keys ${keys.join("/")}) / ${restWp} (other keys) [PRD-F §6 package.json split]`
      );
      continue;
    }
    const changed = packageJsonKeysChanged(base);
    if (changed === null) {
      bad.push(
        `${f}  -> key split not verifiable: base ${base} does not resolve [PRD-F §6 package.json split]`
      );
      continue;
    }
    const foreign = changed.filter(
      (k) => (keys.includes(k) ? keysWp : restWp) !== finWp
    );
    if (foreign.length) {
      bad.push(
        `${f}  -> keys ${foreign.join(", ")} belong to ${finWp === keysWp ? restWp : keysWp} [PRD-F §6 package.json split]`
      );
    }
    continue;
  }
  if (r.owner === "NONE" || !allowed(r, f)) {
    const note = r.note ? ` [${r.note}]` : "";
    bad.push(`${f}  -> ${r.owner} (${r.id} ${r.glob})${note}`);
  }
}
if (bad.length) {
  console.error(
    `contract:ownership FAIL (${label}; ${files.length} files):\n` +
      bad.join("\n")
  );
  if (label !== "unrestricted branch") process.exit(1);
}
console.log(`contract:ownership OK (${label}; ${files.length} files checked)`);
