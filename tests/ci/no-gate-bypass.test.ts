/**
 * PLAT-068 — no gate bypass on release/4.x CI plumbing.
 *
 * Parses ci/plat.gitlab-ci.yml and package.json and fails when:
 *  - '|| true' or '--no-verify' appears anywhere in the PLAT CI file or the
 *    gate scripts,
 *  - allow_failure: true is set on the release gates (plat:gate:glass-quality,
 *    plat:integration:*, plat:gate:change-class) — including tag scope,
 *  - plat:gate:glass-quality does not run `npm run lint:check`,
 *  - package.json `lint` mutates (--fix belongs to `lint:fix` only),
 *  - the no-inline-glass baseline is missing, unsorted, or duplicated.
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..", "..");
const CI_FILE = join(ROOT, "ci", "plat.gitlab-ci.yml");

const GATED_JOBS = [
  "plat:gate:glass-quality",
  "plat:gate:change-class",
  "plat:integration:next",
  "plat:integration:vite",
];

// Minimal job-block scanner: returns the indented body of `name:` at column 0.
function jobBlock(text: string, name: string): string {
  const re = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}:$`, "m");
  const start = text.search(re);
  if (start < 0) return "";
  const lines = text.slice(start).split("\n").slice(1);
  const body: string[] = [];
  for (const line of lines) {
    if (/^\S/.test(line) && line.trim() !== "") break;
    body.push(line);
  }
  return body.join("\n");
}

describe("no gate bypass (PLAT-068)", () => {
  const ciText = readFileSync(CI_FILE, "utf8");
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));

  it("contains no '|| true' or '--no-verify' anywhere in the CI file", () => {
    expect(ciText).not.toMatch(/\|\|\s*true/);
    expect(ciText).not.toContain("--no-verify");
  });

  it("package.json scripts contain no '|| true' or '--no-verify'", () => {
    for (const [name, cmd] of Object.entries(pkg.scripts) as [string, string][]) {
      expect(cmd).not.toMatch(/\|\|\s*true/); // script: ${name}
      expect(cmd).not.toContain("--no-verify"); // script: ${name}
    }
  });

  it("release gates cannot fail open (no allow_failure: true)", () => {
    for (const job of GATED_JOBS) {
      const block = jobBlock(ciText, job);
      expect(block).not.toBe(""); // missing: ${job}
      expect(block).not.toMatch(/allow_failure:\s*true/); // ${job}
    }
  });

  it("plat:gate:glass-quality runs npm run lint:check", () => {
    const script = jobBlock(ciText, "plat:gate:glass-quality");
    expect(script).toContain("npm run lint:check");
  });

  it("package.json lint is non-mutating (no --fix)", () => {
    expect(pkg.scripts.lint).toBe("eslint src");
    expect(pkg.scripts.lint).not.toContain("--fix");
    expect(pkg.scripts["lint:fix"]).toBe("eslint src --fix");
  });

  it("no-inline-glass baseline exists and is sorted + de-duplicated", () => {
    const p = join(ROOT, "eslint", "no-inline-glass-baseline.json");
    expect(existsSync(p)).toBe(true);
    const list: string[] = JSON.parse(readFileSync(p, "utf8"));
    expect(list).toEqual([...list].sort());
    expect(new Set(list).size).toBe(list.length);
  });
});
