/**
 * PLAT-114 — fixture-index for scripts/ci/verify-tree-hygiene.js and
 * scripts/ensure-component-inventory.js.
 *
 * A fake tracked index is staged in a temp git repo for the negative cases;
 * the clean case runs against this repo itself.
 */
import { execFileSync, execSync } from "child_process";
import { mkdtempSync, writeFileSync, mkdirSync, rmSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const ROOT = join(__dirname, "..", "..");
const SCRIPT = join(ROOT, "scripts", "ci", "verify-tree-hygiene.js");
const INVENTORY = join(ROOT, "scripts", "ensure-component-inventory.js");

function gitRepo(files: Record<string, string | Buffer>): string {
  const dir = mkdtempSync(join(tmpdir(), "tree-hygiene-"));
  execSync("git init -q && git config user.email t@t && git config user.name t", { cwd: dir });
  for (const [rel, content] of Object.entries(files)) {
    const p = join(dir, rel);
    mkdirSync(join(p, ".."), { recursive: true });
    writeFileSync(p, content);
  }
  execSync("git add -A", { cwd: dir });
  return dir;
}

function run(cwd: string): { code: number; out: string } {
  try {
    const out = execFileSync("node", [SCRIPT], { cwd, encoding: "utf8", env: { ...process.env, AURAGLASS_REPO_ROOT: cwd }, stdio: ["ignore", "pipe", "pipe"] });
    return { code: 0, out };
  } catch (e: any) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ""}${e.stderr ?? ""}` };
  }
}

describe("verify-tree-hygiene fixture index", () => {
  let dirs: string[] = [];
  afterEach(() => dirs.forEach((d) => rmSync(d, { recursive: true, force: true })));

  it("fails when reports/ is tracked", () => {
    const d = gitRepo({ "reports/evidence.json": "{}" });
    dirs.push(d);
    const r = run(d);
    expect(r.code).toBe(1);
    expect(r.out).toContain("tracked reports/");
    expect(r.out).toContain("1 files");
  });

  it("fails on a tracked root probe script", () => {
    const d = gitRepo({ "probe-dom.mjs": "// probe" });
    dirs.push(d);
    const r = run(d);
    expect(r.code).toBe(1);
    expect(r.out).toContain("probe");
  });

  it("fails on a tracked file over 5 MB outside the allowances", () => {
    const d = gitRepo({ "assets/big.bin": Buffer.alloc(6 * 1024 * 1024, 1) });
    dirs.push(d);
    const r = run(d);
    expect(r.code).toBe(1);
    expect(r.out).toContain("5 MB");
  });

  it("passes on the clean repo index", () => {
    const r = run(ROOT);
    expect(r.code).toBe(0);
    expect(r.out).toContain("clean");
  });

  it("ensure-component-inventory exits 1 when the inventory is missing", () => {
    // run in a sandbox where the docs/ tree is absent
    const d = mkdtempSync(join(tmpdir(), "inventory-missing-"));
    dirs.push(d);
    const script = join(d, "ensure.js");
    writeFileSync(script, require("fs").readFileSync(INVENTORY, "utf8").replace(
      'path.join(__dirname, "..", rel)',
      'path.join(process.env.SANDBOX || __dirname, "..", rel)'
    ));
    let code = 0;
    let out = "";
    try {
      out = execFileSync("node", [script], {
        encoding: "utf8",
        env: { ...process.env, SANDBOX: d },
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (e: any) {
      code = e.status ?? 1;
      out = `${e.stdout ?? ""}${e.stderr ?? ""}`;
    }
    expect(code).toBe(1);
    expect(out).toContain("component inventory missing: docs/inventory/component_inventory.json");
    expect(existsSync(join(d, "..", "docs"))).toBe(false);
  });
});
