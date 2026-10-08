/**
 * PLAT-065 — shrink-only ratchet for eslint/no-inline-glass-baseline.json
 *
 * The baseline lists files grandfathered out of `auraglass/no-inline-glass`
 * at error severity (they lint at warn). This test fails when:
 *  - an entry is added for a file that does NOT currently violate the rule
 *    (baseline entries must correspond to real violations), or
 *  - a listed file no longer violates (it must leave the baseline), or
 *  - the list is not sorted/deduped.
 * New violations in unlisted files still fail `npm run lint:check` at error.
 */
import { execFileSync, execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..", "..");
const BASELINE = join(ROOT, "eslint", "no-inline-glass-baseline.json");

type LintMessage = { ruleId?: string; severity?: number };
type LintResult = { filePath: string; messages: LintMessage[] };

function violationCountByFile(files: string[]): Map<string, number> {
  // --rule forces the rule back to error for every file, defeating the
  // baseline demotion in eslint.config.js.
  let out: string;
  try {
    out = execFileSync(
      "npx",
      [
        "eslint",
        "--format",
        "json",
        "--rule",
        JSON.stringify({ "auraglass/no-inline-glass": "error" }),
        ...files,
      ],
      { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] }
    );
  } catch (err: any) {
    // eslint exits 1 when violations exist — stdout still carries the JSON.
    if (err.stdout) out = err.stdout.toString();
    else throw err;
  }
  // eslint may prefix the JSON with ignore/deprecation warnings — take the
  // first top-level array.
  const start = out.indexOf("[");
  const results = JSON.parse(out.slice(start)) as LintResult[];
  const counts = new Map<string, number>();
  for (const r of results) {
    const n = r.messages.filter(
      (m) => m.ruleId === "auraglass/no-inline-glass"
    ).length;
    counts.set(r.filePath, n);
  }
  return counts;
}

describe("eslint/no-inline-glass-baseline.json", () => {
  const baseline: string[] = JSON.parse(readFileSync(BASELINE, "utf8"));

  it("is a sorted, de-duplicated list of existing files", () => {
    expect(baseline).toEqual([...baseline].sort());
    expect(new Set(baseline).size).toBe(baseline.length);
    for (const f of baseline) {
      expect(existsSync(join(ROOT, f))).toBe(true);
    }
  });

  it("every listed file still violates auraglass/no-inline-glass", () => {
    const counts = violationCountByFile(baseline);
    const stale = baseline.filter(
      (f) => (counts.get(join(ROOT, f)) ?? 0) === 0
    );
    // stale entries must leave the baseline (they no longer violate)
    expect(stale).toEqual([]);
  });

  it("is shrink-only: current list is a subset of the HEAD version", () => {
    let head: string[];
    try {
      head = JSON.parse(
        execSync("git show HEAD:eslint/no-inline-glass-baseline.json", {
          cwd: ROOT,
          encoding: "utf8",
        })
      );
    } catch {
      return; // baseline being introduced in this commit — nothing to shrink from
    }
    const added = baseline.filter((f) => !head.includes(f));
    // new baseline entries are not allowed — fix the violations instead
    expect(added).toEqual([]);
  });
});
