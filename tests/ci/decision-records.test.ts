/* @jest-environment node */
// REQ-FIN-23 / REQ-PLAT-08 (FIN-052..054, AC-FIN-23): GitLab decision records.
// gitlab-ci-verification.md carries the four contract-v1.1 §7 facts × {next, release/4.x}
// with evidence URLs; gitlab-project-settings.md carries one row per OD-11 setting with
// status | appliedBy | date | evidence, and no row may stay `missing` once tag v4.1.1 exists.
import { describe, expect, it } from "@jest/globals";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const VERIFICATION = "docs/release/decisions/gitlab-ci-verification.md";
const SETTINGS = "docs/release/decisions/gitlab-project-settings.md";
const OD8 = "docs/release/decisions/od-8.md";
const GITLAB_URL =
  /https:\/\/gitlab\.com\/chahal-foundation-group\/github-auraoneai\/auraglass\/-\/(jobs|pipelines)\/\d+/;

const FACTS = [
  { key: "multi-ref push", match: /multi-ref push creates a pipeline/i },
  { key: "saas runner tags", match: /saas runner tags on the group tier/i },
  { key: "playwright image", match: /playwright image .* exists/i },
  { key: "provenance", match: /--provenance.*SIGSTORE_ID_TOKEN/ },
] as const;
const LINES = ["next", "release/4.x"];
const RESULTS = ["verified", "failed", "partial", "unverified"];

const cells = (row: string) =>
  row
    .split("|")
    .slice(1, -1)
    .map((c) => c.trim());

/** Table rows of the section that starts at `heading` (until the next `## `). */
function sectionRows(text: string, heading: string): string[][] {
  const start = text.indexOf(heading);
  if (start < 0) return [];
  const rest = text.slice(start + heading.length);
  const end = rest.search(/\n## /);
  const body = end < 0 ? rest : rest.slice(0, end);
  return body
    .split("\n")
    .filter((l) => l.startsWith("|"))
    .slice(2) // header + separator
    .map(cells);
}

function factRows(text: string) {
  return text
    .split("\n")
    .filter((l) => /^\|\s*\d+\s*\|/.test(l))
    .map(cells)
    .map(([n = "", fact = "", line = "", result = "", evidence = ""]) => ({
      n: Number(n),
      fact,
      line: line.replace(/`/g, ""),
      result: result.replace(/\*/g, "").toLowerCase(),
      evidence,
    }));
}

const OD11_SETTINGS = [
  /^CI config path$/,
  /^Protected tags$/,
  /^Nightly schedule `next`$/,
  /^Nightly schedule `release\/4\.x`$/,
  /^Nightly schedule `release\/4\.1\.x`/,
  /^Pages visibility$/,
  /^Keep latest artifacts$/,
  /^AWS remote runner tag$/,
];

type SettingRow = {
  setting: string;
  status: string;
  appliedBy: string;
  date: string;
  evidence: string;
};

function od11Rows(text: string): SettingRow[] {
  return sectionRows(text, "## OD-11 settings").map(
    ([, setting = "", , status = "", appliedBy = "", date = "", evidence = ""]) => ({
      setting,
      status: status.toLowerCase(),
      appliedBy,
      date,
      evidence,
    })
  );
}

/** Problems with the OD-11 rows; `releaseTagExists` turns every `missing` into a problem. */
function settingsProblems(
  rows: SettingRow[],
  releaseTagExists: boolean
): string[] {
  const out: string[] = [];
  for (const r of rows) {
    if (!["missing", "applied"].includes(r.status))
      out.push(`${r.setting}: status '${r.status}'`);
    if (r.status === "applied") {
      if (!r.appliedBy) out.push(`${r.setting}: applied without appliedBy`);
      if (!/^\d{4}-\d{2}-\d{2}/.test(r.date))
        out.push(`${r.setting}: applied without ISO date`);
      if (!r.evidence) out.push(`${r.setting}: applied without evidence`);
    }
    if (r.status === "missing" && releaseTagExists)
      out.push(`${r.setting}: still missing after v4.1.1`);
  }
  return out;
}

function tagExists(tag: string): boolean {
  if (process.env.CI_COMMIT_TAG === tag) return true;
  try {
    return (
      execFileSync("git", ["tag", "--list", tag], {
        encoding: "utf8",
      }).trim() === tag
    );
  } catch {
    return false;
  }
}

function od8Applied(): boolean {
  if (!existsSync(OD8)) return false;
  const m = /^status:\s*(\S+)/m.exec(readFileSync(OD8, "utf8"));
  return !!m && ["decided", "defaulted", "done", "applied"].includes(m[1] ?? "");
}

describe("gitlab-ci-verification.md (REQ-FIN-23, AC-FIN-23)", () => {
  const text = readFileSync(VERIFICATION, "utf8");
  const rows = factRows(text);

  it("has exactly 8 fact rows: the 4 contract facts × next, release/4.x", () => {
    expect(rows).toHaveLength(8);
    for (const fact of FACTS) {
      for (const line of LINES) {
        const hits = rows.filter(
          (r) => fact.match.test(r.fact) && r.line === line
        );
        expect({ fact: fact.key, line, count: hits.length }).toEqual({
          fact: fact.key,
          line,
          count: 1,
        });
      }
    }
  });

  it("every row has a known result; verified/partial/failed rows cite a GitLab job or pipeline URL", () => {
    for (const r of rows) {
      expect(RESULTS).toContain(r.result);
      const needsUrl = r.result !== "unverified";
      expect({
        n: r.n,
        hasUrl: GITLAB_URL.test(r.evidence) || !needsUrl,
      }).toEqual({ n: r.n, hasUrl: true });
    }
  });

  it("unverified rows name their blocker", () => {
    for (const r of rows.filter((x) => x.result === "unverified")) {
      expect(r.evidence).toMatch(/Blocked on/);
    }
  });

  it("multi-ref push stays failed until OD-8 is applied", () => {
    const multi = rows.filter((r) => FACTS[0].match.test(r.fact));
    expect(multi).toHaveLength(2);
    const allowed = od8Applied() ? RESULTS : ["failed"];
    for (const r of multi) expect(allowed).toContain(r.result);
  });

  it('records a first-green-pipeline entry per line (URL or "none yet")', () => {
    const start = text.indexOf("## First green pipelines");
    expect(start).toBeGreaterThan(-1);
    const section = text.slice(start, text.indexOf("\n## ", start + 1));
    for (const line of ["next", "release/4.x", "release/4.1.x"]) {
      const entry = section
        .split("\n")
        .find((l) => l.startsWith(`- \`${line}\`:`));
      expect(entry).toBeDefined();
      expect(
        GITLAB_URL.test(entry as string) || /none yet/.test(entry as string)
      ).toBe(true);
    }
  });

  it("carries a contract amendment draft for every failed fact", () => {
    // fact index → amendment draft id; provenance/Playwright failures would add A-3/A-4.
    const draftIds = ["A-1", "A-2", "A-3", "A-4"] as const;
    const needed = FACTS.map((f, i) =>
      rows.some((r) => f.match.test(r.fact) && r.result === "failed")
        ? (draftIds[i] ?? null)
        : null
    ).filter((x) => x !== null);
    const drafts = text.includes("## Contract amendment drafts")
      ? text.slice(text.indexOf("## Contract amendment drafts"))
      : "";
    const present = draftIds.filter((id) => drafts.includes(`**${id} — §`));
    expect(present).toEqual(expect.arrayContaining(needed));
  });
});

describe("gitlab-project-settings.md (OD-11)", () => {
  const rows = od11Rows(readFileSync(SETTINGS, "utf8"));

  it("has one row per OD-11 setting with status | appliedBy | date | evidence", () => {
    const header = readFileSync(SETTINGS, "utf8")
      .split("\n")
      .find((l) =>
        /\|\s*status\s*\|\s*appliedBy\s*\|\s*date\s*\|\s*evidence\s*\|/.test(l)
      );
    expect(header).toBeDefined();
    expect(rows).toHaveLength(OD11_SETTINGS.length);
    for (const want of OD11_SETTINGS) {
      expect({
        want: String(want),
        count: rows.filter((r) => want.test(r.setting)).length,
      }).toEqual({
        want: String(want),
        count: 1,
      });
    }
  });

  it("rows are valid now, and none is missing once tag v4.1.1 exists", () => {
    expect(settingsProblems(rows, tagExists("v4.1.1"))).toEqual([]);
  });

  it("settingsProblems flags missing rows after the release tag and incomplete applied rows", () => {
    const base = { appliedBy: "", date: "", evidence: "" };
    const missing = { setting: "Protected tags", status: "missing", ...base };
    const applied = {
      setting: "Pages visibility",
      status: "applied",
      appliedBy: "operator",
      date: "2026-10-12",
      evidence: "glab api projects/87152036",
    };
    const bare = {
      setting: "Keep latest artifacts",
      status: "applied",
      ...base,
    };
    expect(settingsProblems([missing, applied], false)).toEqual([]);
    expect(settingsProblems([missing, applied], true)).toEqual([
      "Protected tags: still missing after v4.1.1",
    ]);
    expect(settingsProblems([bare], false)).toEqual([
      "Keep latest artifacts: applied without appliedBy",
      "Keep latest artifacts: applied without ISO date",
      "Keep latest artifacts: applied without evidence",
    ]);
  });
});

describe("npm decision records", () => {
  it("exist with status rows", () => {
    for (const f of [
      "docs/release/decisions/npm-trusted-publishing.md",
      "docs/release/decisions/npm-scope.md",
    ]) {
      expect(readFileSync(f, "utf8")).toMatch(
        /applied|missing|verified|failed|pending|unverified/i
      );
    }
  });
});
