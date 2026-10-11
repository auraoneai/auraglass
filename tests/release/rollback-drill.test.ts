/* @jest-environment node */
// REQ-PLAT-33 / AC-PLAT-19 (FIN-C.2 item 4): the rollback drill tooling.
// The drill itself runs only in the manual GitLab job against the job's
// ephemeral registry; these tests cover the S2 dist-tag guard it exercises,
// the local-invocation refusal, and the record verifier that every committed
// docs/release/drills/<date>.json must pass. (The 4.x jest transform cannot
// import .mjs, so scripts are driven through node.)
import { describe, expect, it } from "@jest/globals";
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const node = (args: string[], env: Record<string, string | undefined> = {}) => {
  const childEnv: Record<string, string | undefined> = {
    ...process.env,
    ...env,
  };
  for (const k of Object.keys(env))
    if (env[k] === undefined) delete childEnv[k];
  const r = spawnSync("node", args, {
    encoding: "utf8",
    env: childEnv as NodeJS.ProcessEnv,
  });
  return { code: r.status, out: `${r.stdout}${r.stderr}` };
};

const DRILL = "scripts/release/rollback-drill.mjs";
const DIST_TAG = "scripts/release/dist-tag.mjs";
const STEPS = [
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

// Seals a record with the script's own digest (as the job does when writing it).
const seal = (record: Record<string, unknown>) => {
  const r = spawnSync(
    "node",
    [
      "--input-type=module",
      "-e",
      `import { digestOf } from './${DRILL}';
       const r = JSON.parse(process.argv[1]); r.digest = digestOf(r);
       process.stdout.write(JSON.stringify(r));`,
      JSON.stringify(record),
    ],
    { encoding: "utf8" }
  );
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(r.stdout);
};

const base = () => ({
  $schema: "ag-rollback-drill/1",
  req: "REQ-PLAT-33",
  ac: "AC-PLAT-19",
  runbook: "docs/release-rollback-deprecation.md",
  date: "2026-10-10T12:00:00.000Z",
  ref: "release/4.1.x",
  line: "4x",
  sha: "d2f90a892f1856f8b908e978b88bd453ec469df5",
  pipelineUrl:
    "https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/pipelines/1",
  jobUrl:
    "https://gitlab.com/chahal-foundation-group/github-auraoneai/auraglass/-/jobs/2",
  registry: { url: "http://verdaccio:4873", kind: "ephemeral (CI service)" },
  package: "@ag-drill/aura-glass",
  tool: { node: "v20.19.0", npm: "10.9.4" },
  steps: STEPS.map((id) => ({
    id,
    scenario: id.split("-")[0].toUpperCase(),
    argv: ["npm", "x"],
    expectExit: id === "s2-guard-refuses" ? 1 : 0,
    exit: id === "s2-guard-refuses" ? 1 : 0,
    ok: true,
    output: "",
  })),
  final: {
    distTags: { latest: "4.9.9", "v4-lts": "4.9.9" },
    versions: ["4.9.9", "5.0.0"],
    deprecated: "Pulled: rollback drill",
  },
  result: "pass",
});

const verify = (record: unknown) => {
  const dir = mkdtempSync(join(tmpdir(), "ag-drill-test-"));
  const f = join(dir, "record.json");
  writeFileSync(f, JSON.stringify(record));
  return node([DRILL, "--verify", f]);
};

describe("dist-tag.mjs --move (runbook S2 guard)", () => {
  const move = [
    "--move",
    "latest",
    "--version",
    "4.9.9",
    "--current",
    "5.0.0",
    "--dry-run",
  ];

  it("refuses a backward latest move without AG_ROLLBACK_LATEST_TO_4X", () => {
    const r = node([DIST_TAG, ...move], {
      AG_ROLLBACK_LATEST_TO_4X: undefined,
    });
    expect(r.code).toBe(1);
    expect(r.out).toContain(
      "refusing to move 'latest' from 5.0.0 back to 4.9.9"
    );
    expect(r.out).toContain("AG_ROLLBACK_LATEST_TO_4X=true");
  });

  it('refuses when the variable is set to anything but "true"', () => {
    expect(
      node([DIST_TAG, ...move], { AG_ROLLBACK_LATEST_TO_4X: "1" }).code
    ).toBe(1);
  });

  it("moves latest back to 4.x with AG_ROLLBACK_LATEST_TO_4X=true", () => {
    const r = node([DIST_TAG, ...move, "--package", "@ag-drill/aura-glass"], {
      AG_ROLLBACK_LATEST_TO_4X: "true",
    });
    expect(r.code).toBe(0);
    expect(r.out).toContain(
      "npm dist-tag add @ag-drill/aura-glass@4.9.9 latest"
    );
  });

  it("allows forward latest moves and non-latest tags without the variable", () => {
    const env = { AG_ROLLBACK_LATEST_TO_4X: undefined };
    expect(
      node(
        [
          DIST_TAG,
          "--move",
          "latest",
          "--version",
          "5.0.1",
          "--current",
          "5.0.0",
          "--dry-run",
        ],
        env
      ).code
    ).toBe(0);
    expect(
      node(
        [
          DIST_TAG,
          "--move",
          "v4-lts",
          "--version",
          "4.9.9",
          "--current",
          "5.0.0",
          "--dry-run",
        ],
        env
      ).code
    ).toBe(0);
  });

  it("rejects a non-semver --version", () => {
    expect(
      node([DIST_TAG, "--move", "latest", "--version", "nope", "--dry-run"])
        .code
    ).toBe(2);
  });
});

describe("rollback-drill.mjs", () => {
  it("exits 2 with the remote job name when invoked outside CI", () => {
    const r = node([DRILL, "--registry", "http://localhost:4873"], {
      CI: undefined,
      CI_PIPELINE_URL: undefined,
      CI_JOB_URL: undefined,
      CI_COMMIT_SHA: undefined,
    });
    expect(r.code).toBe(2);
    expect(r.out).toContain("plat:release:rollback-drill");
  });

  it("accepts a sealed passing record", () => {
    const r = verify(seal(base()));
    expect(r.out).toContain("--verify OK");
    expect(r.code).toBe(0);
  });

  it("rejects a record edited after the job sealed it", () => {
    const rec = seal(base());
    rec.final.distTags.latest = "5.0.0";
    const r = verify(rec);
    expect(r.code).toBe(1);
    expect(r.out).toContain("digest mismatch");
  });

  it("rejects a hand-typed / pending pipeline URL even when re-sealed", () => {
    const r = verify(seal({ ...base(), pipelineUrl: "pending (OD-8)" }));
    expect(r.code).toBe(1);
    expect(r.out).toContain("pipelineUrl is not a GitLab pipeline URL");
  });

  it("rejects a record missing a scenario step", () => {
    const rec = base();
    rec.steps = rec.steps.filter((s) => s.id !== "s3-deprecate");
    const r = verify(seal(rec));
    expect(r.code).toBe(1);
    expect(r.out).toContain("step s3-deprecate missing");
  });

  it("rejects a record whose guard step did not refuse", () => {
    const rec = base();
    const guard = rec.steps.find((s) => s.id === "s2-guard-refuses")!;
    guard.exit = 0;
    const r = verify(seal(rec));
    expect(r.code).toBe(1);
    expect(r.out).toContain("step s2-guard-refuses: exit 0, expected 1");
  });

  it("rejects npm unpublish anywhere in the drill", () => {
    const rec = base();
    rec.steps[0].argv = ["npm", "unpublish", "@ag-drill/aura-glass@5.0.0"];
    const r = verify(seal(rec));
    expect(r.code).toBe(1);
    expect(r.out).toContain("npm unpublish is never a rollback step");
  });

  it("rejects a final state where latest still points at the bad version or a version vanished", () => {
    const rec = base();
    rec.final = {
      ...rec.final,
      distTags: { latest: "5.0.0", "v4-lts": "4.9.9" },
      versions: ["4.9.9"],
    };
    const r = verify(seal(rec));
    expect(r.code).toBe(1);
    expect(r.out).toContain("final latest is 5.0.0");
    expect(r.out).toContain("no unpublish");
  });

  it("rejects a failed result", () => {
    const r = verify(seal({ ...base(), result: "fail" }));
    expect(r.code).toBe(1);
    expect(r.out).toContain("result is fail");
  });
});
