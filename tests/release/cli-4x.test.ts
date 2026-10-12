/** @jest-environment node */
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..", "..");
const BIN = path.join(ROOT, "bin/aura-glass.cjs");
const FIXTURE = path.join(ROOT, "tests/release/fixtures/undeclared-deps");
const MOVED_NOTICE = "aura-glass CLI moved: use npx @auraglass/cli <command>";

describe("4.x cli bridge", () => {
  it("doctor --v5 reports undeclared imports on the fixture", () => {
    const res = spawnSync("node", [BIN, "doctor", "--v5", "--cwd", FIXTURE, "--json"], { encoding: "utf8" });
    expect(res.status).toBe(0);
    const report = JSON.parse(res.stdout);
    const check = report.checks.find((c: any) => c.id === "undeclared-imports");
    expect(check.status).toBe("fail");
    expect(check.message).toContain("axios");
    expect(check.message).toContain("lodash");
    expect(check.message).toContain("react");
  });
  it("MOVED_NOTICE prints exactly once to stderr per invocation", () => {
    const res = spawnSync("node", [BIN, "list", "--json"], { encoding: "utf8" });
    const occurrences = res.stderr.split(MOVED_NOTICE).length - 1;
    expect(occurrences).toBe(1);
  });
  it("MOVED_NOTICE is byte-equal to the canonical string", () => {
    const src = require("fs").readFileSync(BIN, "utf8");
    expect(src).toContain(`"${MOVED_NOTICE}"`);
  });

  it("add <recipe> prints the replacement command exactly once", () => {
    /* The bin loads ../dist/registry when built, else aura-glass/registry from the
       caller's cwd. Inside this checkout the latter self-resolves to the unbuilt
       package, so a byte-identical copy of the bin runs outside it against a stub
       registry package (the replacement line does not depend on recipe content). */
    const app = fs.mkdtempSync(path.join(os.tmpdir(), "ag-add-"));
    const bin = path.join(app, "tool/aura-glass.cjs");
    fs.mkdirSync(path.dirname(bin));
    fs.copyFileSync(BIN, bin);
    try {
      const pkgDir = path.join(app, "node_modules/aura-glass");
      fs.mkdirSync(path.join(pkgDir, "registry"), { recursive: true });
      fs.writeFileSync(path.join(pkgDir, "package.json"), JSON.stringify({ name: "aura-glass", version: "4.3.0", exports: { "./registry": "./registry/index.js" } }));
      fs.writeFileSync(path.join(pkgDir, "registry/index.js"), [
        'const r = { id: "stub-recipe", title: "Stub", category: "test", imports: [], peerDependencies: [], files: [{ path: "Stub.tsx", content: "export {};\\n" }] };',
        "exports.auraGlassRecipes = [r];",
        "exports.getAuraGlassRecipe = (id) => (id === r.id ? r : undefined);",
      ].join("\n"));
      const run = (args: string[]) => spawnSync("node", [bin, ...args], { cwd: app, encoding: "utf8" });
      const listed = run(["list", "--json"]);
      expect(listed.status).toBe(0);
      const id: string = JSON.parse(listed.stdout)[0].id;
      for (const target of [id, "all"]) {
        const res = run(["add", target, "--dry-run"]);
        expect(res.status).toBe(0);
        const line = `Replacement: npx @auraglass/cli add ${target}`;
        expect(`${res.stdout}\n${res.stderr}`.split(line).length - 1).toBe(1);
        expect(res.stderr.split("\n")).toContain(line);
      }
      // an unknown recipe fails before printing a replacement for it
      const bad = run(["add", "no-such-recipe", "--dry-run"]);
      expect(bad.status).toBe(1);
      expect(bad.stderr).not.toContain("Replacement:");
    } finally {
      fs.rmSync(app, { recursive: true, force: true });
    }
  });
});

/* REQ-PLAT-61: `aura-glass doctor --v5` is @auraglass/cli's doctor --v5 unchanged.
   The @auraglass/cli side is the real command (packages/cli/src/commands/doctor.ts)
   bundled for this test with the repo's esbuild and fed its own compiled mappings;
   the 4.x side is the shipped bin. Both run on the same fixtures and their JSON is
   compared field by field; the bin's only addition is the trailing
   `undeclared-imports` check (REQ-PLAT-63). */
describe("4.x doctor --v5 parity with @auraglass/cli", () => {
  const CLI = path.join(ROOT, "packages/cli");
  let work: string;
  let cliDoctor: (args: string[], flags: Record<string, unknown>) => Promise<number>;

  beforeAll(async () => {
    work = fs.mkdtempSync(path.join(os.tmpdir(), "ag-v5-parity-"));
    execFileSync("node", [path.join(CLI, "scripts/gen-mappings.mjs")], { cwd: CLI, stdio: "ignore" });
    const { build } = await import("esbuild");
    const outfile = path.join(work, "bundle", "doctor.cjs");
    await build({
      entryPoints: [path.join(CLI, "src/commands/doctor.ts")],
      bundle: true, platform: "node", format: "cjs", target: "node18", outfile, logLevel: "silent",
    });
    // the bundled loadCompiledMappings() resolves <bundle dir>/mappings
    fs.cpSync(path.join(CLI, "src/migrate/4to5/mappings"), path.join(work, "bundle", "mappings"), { recursive: true });
    cliDoctor = require(outfile).doctorCommand;
  }, 120_000);

  afterAll(() => fs.rmSync(work, { recursive: true, force: true }));

  const runCli = async (cwd: string) => {
    const orig = process.stdout.write.bind(process.stdout);
    let buf = "";
    (process.stdout as any).write = (s: string) => { buf += s; return true; };
    try {
      await cliDoctor([], { v5: true, json: true, cwd, silent: true });
    } finally {
      (process.stdout as any).write = orig;
    }
    return JSON.parse(buf);
  };
  const runBin = (cwd: string) => {
    const res = spawnSync("node", [BIN, "doctor", "--v5", "--cwd", cwd, "--json"], { encoding: "utf8" });
    expect(res.status).toBe(0);
    return JSON.parse(res.stdout);
  };

  const deprecatedUsage = () => {
    const dir = path.join(work, "usage");
    fs.mkdirSync(path.join(dir, "src"), { recursive: true });
    fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ name: "usage", dependencies: { react: "^18.3.1", "aura-glass": "4.3.0", "framer-motion": "^11.0.0" } }));
    const dep = JSON.parse(fs.readFileSync(path.join(ROOT, "deprecations.json"), "utf8"));
    const rows = (Array.isArray(dep) ? dep : dep.entries).filter((e: any) => e.removeIn === "5.0.0" && (e.entry === "." || !e.entry) && /^[A-Z]\w+$/.test(e.symbol ?? ""));
    const picks = rows.slice(0, 5).map((e: any) => e.symbol);
    fs.writeFileSync(path.join(dir, "src/app.tsx"), `import { ${picks.join(", ")} } from "aura-glass";\nimport { motion } from "framer-motion";\nexport const x = [${picks.join(", ")}, motion];\n`);
    return { dir, picks };
  };

  it.each([
    ["undeclared-deps fixture", () => FIXTURE],
    ["usage of removeIn 5.0.0 symbols", () => deprecatedUsage().dir],
  ])("%s: bin --v5 JSON equals npx @auraglass/cli doctor --v5 --json", async (_name, cwdOf) => {
    const cwd = cwdOf();
    const cli = await runCli(cwd);
    const bin = runBin(cwd);
    expect(bin.version).toBe(cli.version);
    expect(bin.findings).toEqual(cli.findings);
    expect(bin.byCodemod).toEqual(cli.byCodemod);
    const extra = bin.checks.slice(cli.checks.length);
    expect(bin.checks.slice(0, cli.checks.length)).toEqual(cli.checks);
    expect(extra.map((c: any) => c.id)).toEqual(["undeclared-imports"]);
  });

  it("finds the removeIn 5.0.0 usages, so the parity above is not vacuous", async () => {
    const { dir, picks } = deprecatedUsage();
    const bin = runBin(dir);
    expect(picks.length).toBeGreaterThan(0);
    for (const sym of picks) expect(bin.findings.some((f: any) => f.symbol === sym)).toBe(true);
  });

  it("finds textual CSS and subpath deprecations without requiring the entry import", () => {
    const dir = path.join(work, "textual-deprecations");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "theme.css"), ".card { color: var(--glass-old); }\n");
    fs.writeFileSync(path.join(dir, "app.ts"), 'import "aura-glass/old-entry";\nconst LocalOnly = 1;\n');
    const { runV5WithEntries } = require(path.join(ROOT, "bin/doctor-v5.generated.cjs"));
    const { findings } = runV5WithEntries(dir, [
      { kind: "css-var", symbol: "--glass-old", entry: "./styles", removeIn: "5.0.0" },
      { kind: "subpath", symbol: "aura-glass/old-entry", entry: "./old-entry", removeIn: "5.0.0" },
      { kind: "component", symbol: "LocalOnly", entry: "./widgets", removeIn: "5.0.0" },
    ]);
    expect(findings.map((f: any) => f.symbol).sort()).toEqual(["--glass-old", "aura-glass/old-entry"]);
  });

  it("bin/doctor-v5.generated.cjs is the current bundle of the @auraglass/cli sources", () => {
    const res = spawnSync("node", [path.join(ROOT, "scripts/ci/gen-doctor-v5.mjs"), "--check"], { encoding: "utf8" });
    expect(res.stderr).toBe("");
    expect(res.status).toBe(0);
  });

  it("the bin carries no doctor --v5 reimplementation of its own", () => {
    const src = fs.readFileSync(BIN, "utf8");
    expect(src).toContain('require("./doctor-v5.generated.cjs")');
    expect(src).not.toMatch(/options\.v5/);
  });
});
