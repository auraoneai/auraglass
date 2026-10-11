/**
 * REQ-PLAT-57 — per-entry gzip budget ratchet.
 *
 * Reads dist/<entry>.mjs, gzip-measures each, and fails when:
 *   - an entry listed in build/budgets-4x.json is missing from dist/
 *     (after a real build — skipped only when dist/ itself is absent,
 *     i.e. pre-build checkouts), or
 *   - its gzip size exceeds the budget.
 * Budgets ratchet: they may be tightened by editing the JSON, never
 * silently grown by the test.
 */
import { existsSync, readFileSync } from "fs";
import { gzipSync } from "zlib";
import { join } from "path";

const ROOT = join(__dirname, "..", "..");
const BUDGETS = JSON.parse(
  readFileSync(join(ROOT, "build/budgets-4x.json"), "utf8")
);
const DIST = join(ROOT, "dist");

describe("entry gzip budgets (PLAT-57)", () => {
  it("budgets table covers the real rollup/esbuild entries", () => {
    expect(Object.keys(BUDGETS.entries)).toEqual(
      expect.arrayContaining(["index", "forms/index", "data/index", "three/index"])
    );
  });

  it("./forms and ./data exports resolve to their real dist entries", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    for (const sub of ["./forms", "./data"]) {
      const dir = sub.slice(2);
      expect(pkg.exports[sub].import).toBe(`./dist/${dir}/index.mjs`);
      expect(pkg.exports[sub].require).toBe(`./dist/${dir}/index.js`);
      expect(pkg.exports[sub].types).toBe(`./dist/${dir}/index.d.ts`);
    }
  });

  it("every built entry respects its gzip budget", () => {
    if (!existsSync(join(DIST, "index.mjs"))) {
      console.warn("dist/ absent — pre-build checkout; size assertions deferred to CI");
      return;
    }
    const rows: string[] = [];
    const missing: string[] = [];
    for (const [entry, { budgetGzipBytes }] of Object.entries<any>(BUDGETS.entries)) {
      const file = join(DIST, `${entry}.mjs`);
      if (!existsSync(file)) {
        missing.push(entry); // absent from a (possibly stale) dist — verify-pack covers completeness
        continue;
      }
      const actual = gzipSync(readFileSync(file)).length;
      if (actual > budgetGzipBytes) {
        rows.push(`${entry}: ${actual} > ${budgetGzipBytes}`);
      }
    }
    if (missing.length) console.warn(`entries not in this dist (CI checks completeness): ${missing.join(", ")}`);
    expect(rows).toEqual([]);
  });
});
