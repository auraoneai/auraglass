import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..", "..");
const SCRIPT = path.join(ROOT, "scripts/ci/prune-bridge-exports.mjs");

const runPrune = (repoRoot: string, env: Record<string, string> = {}) => {
  const res = execFileSync("node", [SCRIPT], {
    env: { ...process.env, AURAGLASS_REPO_ROOT: repoRoot, ...env },
    encoding: "utf8",
  });
  return res;
};

describe("4.3 bridge subpaths", () => {
  let sandbox: string;
  beforeEach(() => {
    sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "bridge-exports-"));
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
    delete pkg.exports["./material"];
    delete pkg.exports["./styles/v5.css"];
    delete pkg.exports["./compat/tokens.css"];
    delete pkg.exports["./compat/globals.css"];
    fs.writeFileSync(path.join(sandbox, "package.json"), JSON.stringify(pkg));
    for (const f of [
      "src/material/index.ts",
      "src/styles/v5.css",
      "src/compat/tokens.css",
    ]) {
      const p = path.join(sandbox, f);
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, f.endsWith(".ts") ? "export {};\n" : "/* stub */\n");
    }
  });
  afterEach(() => fs.rmSync(sandbox, { recursive: true, force: true }));

  it("emits every bridge subpath when sources exist (row H absent still emits ./material only when its source exists)", () => {
    runPrune(sandbox);
    const pkg = JSON.parse(fs.readFileSync(path.join(sandbox, "package.json"), "utf8"));
    expect(pkg.exports["./material"]).toBeTruthy();
    expect(pkg.exports["./styles/v5.css"]).toBe("./dist/styles/v5.css");
    expect(pkg.exports["./compat/tokens.css"]).toBe("./dist/compat/tokens.css");
    const record = JSON.parse(
      fs.readFileSync(path.join(sandbox, ".artifacts/bridge-exports.json"), "utf8"),
    );
    expect(record.omitted.map((o: any) => o.key)).toEqual(["./compat/globals.css"]);
  });

  it("omits all bridge subpaths when row-H inputs are absent and still exits 0", () => {
    expect(() => runPrune(sandbox, { AURAGLASS_ROW_H: "absent" })).not.toThrow();
    const pkg = JSON.parse(fs.readFileSync(path.join(sandbox, "package.json"), "utf8"));
    for (const k of ["./material", "./styles/v5.css", "./compat/tokens.css", "./compat/globals.css"]) {
      expect(pkg.exports[k]).toBeUndefined();
    }
    const record = JSON.parse(
      fs.readFileSync(path.join(sandbox, ".artifacts/bridge-exports.json"), "utf8"),
    );
    expect(record.emitted).toHaveLength(0);
    expect(record.omitted).toHaveLength(4);
  });
});

describe("preview='v5' prop", () => {
  it("AuraGlassProvider renders data-ag-preview on the subtree", () => {
    const src = fs.readFileSync(path.join(ROOT, "src/theme/AuraGlassProvider.tsx"), "utf8");
    expect(src).toContain('preview?: "v5"');
    expect(src).toContain('data-ag-preview="v5"');
  });
});
