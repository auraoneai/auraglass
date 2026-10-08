/** PLAT-072: side-effect import gate — green on the current tree, fails when a
    new `import "x";` appears that the baseline does not cover. */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = join(__dirname, "..", "..");
const script = join(root, "scripts/ci/verify-import-side-effects.js");
const baseline = join(root, "scripts/ci/import-side-effects-baseline.json");

describe("verify-import-side-effects", () => {
  it("baseline file exists and is an allowlist", () => {
    const data = JSON.parse(require("fs").readFileSync(baseline, "utf8"));
    expect(Array.isArray(data.sideEffectImports)).toBe(true);
    expect(data.sideEffectImports.length).toBeGreaterThan(0);
  });

  it("exits 0 on the current tree", () => {
    const out = execFileSync("node", [script], { cwd: root, encoding: "utf8" });
    expect(out).toMatch(/OK/);
  });
});
