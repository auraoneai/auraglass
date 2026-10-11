#!/usr/bin/env node
/* rollback-drill.mjs (REQ-PLAT-33 / AC-PLAT-19, FIN-C.2 item 4).

   Executes the runbook's publish-side rollback scenarios S2 and S3
   (docs/release-rollback-deprecation.md) against an ephemeral npm registry
   (the CI job's verdaccio service) and writes the drill record from what
   actually ran: argv, exit code and output of every step, the final registry
   state, and the CI pipeline/job URLs. The record is never hand-typed; it is
   committed byte-identical from the job artifact.

   Run (CI only — the manual job plat:release:rollback-drill):
     node scripts/release/rollback-drill.mjs --registry http://verdaccio:4873 \
       [--package @ag-drill/aura-glass] [--out-dir docs/release/drills]
   Verify a record (any machine):
     node scripts/release/rollback-drill.mjs --verify <record.json> [...]

   Exit: 0 pass; 1 drill or verification failed; 2 invoked outside CI. */
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const SCHEMA = "ag-rollback-drill/1";
const GOOD = "4.9.9";
const BAD = "5.0.0";
export const REQUIRED_STEPS = [
  "setup-publish-good",
  "setup-publish-bad",
  "setup-verify",
  "s2-guard-refuses",
  "s2-move-latest",
  "s2-verify",
  "s3-reset-latest",
  "s3-deprecate",
  "s3-dist-tag-add",
  "s3-verify",
];

const PIPELINE_URL = /^https:\/\/gitlab\.com\/[^\s]+\/-\/pipelines\/\d+$/;
const JOB_URL = /^https:\/\/gitlab\.com\/[^\s]+\/-\/jobs\/\d+$/;

const canonical = (v) =>
  Array.isArray(v)
    ? `[${v.map(canonical).join(",")}]`
    : v && typeof v === "object"
      ? `{${Object.keys(v)
          .sort()
          .map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`)
          .join(",")}}`
      : JSON.stringify(v);

export function digestOf(record) {
  const { digest, ...rest } = record;
  return "sha256-" + createHash("sha256").update(canonical(rest)).digest("hex");
}

/** Returns a list of problems; empty = valid job-written passing record. */
export function verifyRecord(r) {
  const errs = [];
  if (!r || typeof r !== "object") return ["record is not an object"];
  if (r.$schema !== SCHEMA) errs.push(`$schema must be ${SCHEMA}`);
  if (r.req !== "REQ-PLAT-33") errs.push("req must be REQ-PLAT-33");
  if (!PIPELINE_URL.test(r.pipelineUrl ?? ""))
    errs.push(`pipelineUrl is not a GitLab pipeline URL: ${r.pipelineUrl}`);
  if (!JOB_URL.test(r.jobUrl ?? ""))
    errs.push(`jobUrl is not a GitLab job URL: ${r.jobUrl}`);
  if (!/^[0-9a-f]{40}$/.test(r.sha ?? ""))
    errs.push("sha must be a 40-hex commit SHA");
  if (!r.ref) errs.push("ref missing");
  if (Number.isNaN(Date.parse(r.date ?? ""))) errs.push("date is not ISO-8601");
  const steps = Array.isArray(r.steps) ? r.steps : [];
  const ids = steps.map((s) => s.id);
  for (const id of REQUIRED_STEPS)
    if (!ids.includes(id)) errs.push(`step ${id} missing`);
  for (const s of steps) {
    if (!Array.isArray(s.argv) || !s.argv.length)
      errs.push(`step ${s.id}: argv missing`);
    if (typeof s.exit !== "number" || s.exit !== s.expectExit || s.ok !== true)
      errs.push(`step ${s.id}: exit ${s.exit}, expected ${s.expectExit}`);
    if ((s.argv ?? []).some((a) => a === "unpublish"))
      errs.push(`step ${s.id}: npm unpublish is never a rollback step`);
  }
  const f = r.final ?? {};
  if (f.distTags?.latest !== GOOD)
    errs.push(`final latest is ${f.distTags?.latest}, expected ${GOOD}`);
  if (!f.versions?.includes?.(GOOD) || !f.versions?.includes?.(BAD))
    errs.push("final versions must still hold both versions (no unpublish)");
  if (!f.deprecated) errs.push(`final: ${BAD} is not deprecated`);
  if (r.result !== "pass") errs.push(`result is ${r.result}`);
  if (r.digest !== digestOf(r))
    errs.push("digest mismatch: record was edited after the job wrote it");
  return errs;
}

const arg = (n) => {
  const i = process.argv.indexOf(`--${n}`);
  return i >= 0 ? process.argv[i + 1] : null;
};

function verifyCli(files) {
  let bad = 0;
  for (const f of files) {
    let errs;
    try {
      errs = verifyRecord(JSON.parse(readFileSync(f, "utf8")));
    } catch (e) {
      errs = [`unreadable: ${e.message}`];
    }
    if (errs.length) {
      bad++;
      console.error(
        `rollback-drill --verify FAIL ${f}:\n  - ${errs.join("\n  - ")}`
      );
    } else console.log(`rollback-drill --verify OK ${f}`);
  }
  process.exit(bad ? 1 : 0);
}

async function drill() {
  const env = process.env;
  const missing = ["CI_PIPELINE_URL", "CI_JOB_URL", "CI_COMMIT_SHA"].filter(
    (k) => !env[k]
  );
  if (env.CI !== "true" || missing.length) {
    console.error(
      "rollback-drill: remote only (PRD-F §12 rule 6). Run the manual GitLab job " +
        "`plat:release:rollback-drill` on a green release/4.1.x pipeline" +
        (missing.length ? ` (missing ${missing.join(", ")})` : "")
    );
    process.exit(2);
  }
  const registry = (arg("registry") ?? "").replace(/\/$/, "");
  if (!/^https?:\/\//.test(registry)) {
    console.error(
      "rollback-drill: --registry <url> of the ephemeral registry is required"
    );
    process.exit(2);
  }
  const pkg = arg("package") ?? "@ag-drill/aura-glass";
  const outDir = arg("out-dir") ?? "docs/release/drills";

  // Ephemeral registry user + a temp userconfig (never the runner's own npmrc).
  const work = mkdtempSync(join(tmpdir(), "ag-rollback-drill-"));
  const user = `drill${Date.now()}`;
  const res = await fetch(`${registry}/-/user/org.couchdb.user:${user}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: user,
      password: createHash("sha256").update(work).digest("hex"),
      type: "user",
    }),
  });
  const token = (await res.json().catch(() => ({}))).token;
  if (!res.ok || !token) {
    console.error(
      `rollback-drill: could not create a user on ${registry} (HTTP ${res.status})`
    );
    process.exit(1);
  }
  const host = registry.replace(/^https?:/, "");
  const userconfig = join(work, "npmrc");
  writeFileSync(
    userconfig,
    `registry=${registry}/\n${host}/:_authToken=${token}\n`,
    { mode: 0o600 }
  );
  const reg = ["--registry", `${registry}/`, "--userconfig", userconfig];
  const redact = (s) =>
    String(s ?? "")
      .split(token)
      .join("<redacted>");

  // Two scratch versions of the drill package, as the runbook's 4.9.9 / 5.0.0.
  const packDir = (version) => {
    const d = join(work, `pkg-${version}`);
    mkdirSync(d);
    writeFileSync(
      join(d, "package.json"),
      JSON.stringify(
        {
          name: pkg,
          version,
          description: "AuraGlass rollback drill scratch package",
          license: "MIT",
        },
        null,
        2
      )
    );
    writeFileSync(
      join(d, "index.js"),
      `module.exports = ${JSON.stringify(version)};\n`
    );
    return d;
  };

  const steps = [];
  const run = (
    id,
    scenario,
    cmd,
    argv,
    { expectExit = 0, extraEnv = {}, cwd } = {}
  ) => {
    const childEnv = { ...env, ...extraEnv };
    if (!("AG_ROLLBACK_LATEST_TO_4X" in extraEnv))
      delete childEnv.AG_ROLLBACK_LATEST_TO_4X;
    const r = spawnSync(cmd, argv, { encoding: "utf8", cwd, env: childEnv });
    const exit = r.status ?? -1;
    const step = {
      id,
      scenario,
      argv: [cmd, ...argv].map((a) => (a === userconfig ? "<tmp>/npmrc" : a)),
      ...(Object.keys(extraEnv).length ? { env: extraEnv } : {}),
      expectExit,
      exit,
      ok: exit === expectExit,
      output: redact(`${r.stdout ?? ""}${r.stderr ?? ""}`).slice(-2000),
    };
    steps.push(step);
    console.log(
      `[${step.ok ? "ok" : "FAIL"}] ${id}: ${step.argv.join(" ")} -> ${exit}`
    );
    return { ...step, stdout: r.stdout ?? "" };
  };
  const view = (what) => {
    try {
      return JSON.parse(
        execFileSync("npm", ["view", ...what, "--json", ...reg], {
          encoding: "utf8",
        }) || "null"
      );
    } catch {
      return null;
    }
  };
  const expectState = (id, scenario, want) => {
    const tags = view([pkg, "dist-tags"]) ?? {};
    const ok = Object.entries(want).every(([k, v]) => tags[k] === v);
    steps.push({
      id,
      scenario,
      argv: [
        "npm",
        "view",
        pkg,
        "dist-tags",
        "--json",
        "--registry",
        `${registry}/`,
      ],
      expectExit: 0,
      exit: ok ? 0 : 1,
      ok,
      output: JSON.stringify({ observed: tags, expected: want }),
    });
    console.log(
      `[${ok ? "ok" : "FAIL"}] ${id}: dist-tags ${JSON.stringify(tags)}`
    );
  };

  const dtag = [
    "scripts/release/dist-tag.mjs",
    "--move",
    "latest",
    "--version",
    GOOD,
    "--package",
    pkg,
    ...reg,
  ];
  const msg = `Pulled: rollback drill ${env.CI_PIPELINE_URL}. Pin ${pkg}@v4-lts instead.`;

  run(
    "setup-publish-good",
    "setup",
    "npm",
    ["publish", "--tag", "v4-lts", ...reg],
    { cwd: packDir(GOOD) }
  );
  run(
    "setup-publish-bad",
    "setup",
    "npm",
    ["publish", "--tag", "latest", ...reg],
    { cwd: packDir(BAD) }
  );
  expectState("setup-verify", "setup", { latest: BAD, "v4-lts": GOOD });
  // S2: the backward move is refused without the recorded intent, then made with it.
  run("s2-guard-refuses", "S2", "node", dtag, { expectExit: 1 });
  run("s2-move-latest", "S2", "node", dtag, {
    extraEnv: { AG_ROLLBACK_LATEST_TO_4X: "true" },
  });
  expectState("s2-verify", "S2", { latest: GOOD, "v4-lts": GOOD });
  // S3 from the same bad state: deprecate the bad version, then move latest.
  run("s3-reset-latest", "S3", "npm", [
    "dist-tag",
    "add",
    `${pkg}@${BAD}`,
    "latest",
    ...reg,
  ]);
  run("s3-deprecate", "S3", "npm", ["deprecate", `${pkg}@${BAD}`, msg, ...reg]);
  run("s3-dist-tag-add", "S3", "npm", [
    "dist-tag",
    "add",
    `${pkg}@${GOOD}`,
    "latest",
    ...reg,
  ]);
  expectState("s3-verify", "S3", { latest: GOOD, "v4-lts": GOOD });

  const versions = view([pkg, "versions"]) ?? [];
  const deprecated = view([`${pkg}@${BAD}`, "deprecated"]);
  const npmVersion = execFileSync("npm", ["--version"], {
    encoding: "utf8",
  }).trim();
  rmSync(work, { recursive: true, force: true });

  const record = {
    $schema: SCHEMA,
    req: "REQ-PLAT-33",
    ac: "AC-PLAT-19",
    runbook: "docs/release-rollback-deprecation.md",
    date: new Date().toISOString(),
    ref: env.CI_COMMIT_REF_NAME ?? env.CI_COMMIT_BRANCH ?? null,
    line: env.AG_LINE ?? null,
    sha: env.CI_COMMIT_SHA,
    pipelineUrl: env.CI_PIPELINE_URL,
    jobUrl: env.CI_JOB_URL,
    registry: { url: registry, kind: "ephemeral (CI service)" },
    package: pkg,
    tool: { node: process.version, npm: npmVersion },
    steps,
    final: {
      distTags: view([pkg, "dist-tags"]) ?? {},
      versions: Array.isArray(versions) ? versions : [versions],
      deprecated,
    },
  };
  // The result is 'pass' only if the record would verify as a passing record.
  const asPass = { ...record, result: "pass" };
  record.result = verifyRecord({ ...asPass, digest: digestOf(asPass) }).length
    ? "fail"
    : "pass";
  record.digest = digestOf(record);

  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, `${record.date.slice(0, 10)}.json`);
  writeFileSync(file, JSON.stringify(record, null, 2) + "\n");
  mkdirSync(".artifacts/plat", { recursive: true });
  writeFileSync(
    ".artifacts/plat/rollback-drill.json",
    JSON.stringify(record, null, 2) + "\n"
  );
  console.log(`rollback-drill: ${record.result} -> ${file}`);
  const errs = verifyRecord(record);
  if (errs.length) console.error(`  - ${errs.join("\n  - ")}`);
  process.exit(record.result === "pass" ? 0 : 1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const i = process.argv.indexOf("--verify");
  if (i >= 0)
    verifyCli(process.argv.slice(i + 1).filter((a) => !a.startsWith("--")));
  else await drill();
}
