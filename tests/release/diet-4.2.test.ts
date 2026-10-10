/**
 * REQ-PLAT-56 — 4.2 dependency diet.
 *
 * For every package moved from dependencies to an optional peer, a sandbox
 * without the package must yield the exact contract error at feature call
 * time, the package must have exactly one role (peer + optional), and the
 * release notes' first list must name it.
 */
import { execFileSync, spawnSync } from "child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

const ROOT = join(__dirname, "..", "..");
const PKG = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const PLAT = readFileSync(join(ROOT, "fragments/deprecations/plat.ts"), "utf8");
// ts-node resolved from this checkout (no machine-specific absolute path).
const TS_NODE = require.resolve("ts-node", { paths: [ROOT] });

const MOVED = [...PLAT.matchAll(
  /kind:\s*'dependency'[\s\S]*?symbol:\s*'([^']+)'[\s\S]*?since:\s*'4\.2\.0'/g
)].map((m) => m[1]);

const ERROR = (pkg: string) =>
  `[aura-glass] ${pkg} is now an optional peer; install it: npm i ${pkg}`;

/** Runs optionalPeer(pkg) in a sandbox with no node_modules → require fails. */
function callOptionalPeer(pkg: string) {
  const dir = mkdtempSync(join(tmpdir(), "diet-"));
  mkdirSync(join(dir, "src"), { recursive: true });
  // load optionalPeer.ts via ts-node in-process equivalent: compile-free path
  // is to require the file through ts-node from the real repo but run the
  // require(name) in the sandbox by shadowing module paths.
  const script = `
    const Module = require('module');
    const orig = Module._resolveFilename;
    Module._resolveFilename = function (request, ...rest) {
      if (request === ${JSON.stringify(pkg)}) {
        const e = new Error("Cannot find module '" + request + "'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
      }
      return orig.call(this, request, ...rest);
    };
    require(${JSON.stringify(TS_NODE)}).register({ transpileOnly: true, compilerOptions: { module: 'commonjs', moduleResolution: 'node', esModuleInterop: true } });
    const { optionalPeer } = require(${JSON.stringify(join(ROOT, "src/utils/optionalPeer.ts"))});
    try {
      optionalPeer(${JSON.stringify(pkg)});
      console.log('RESOLVED');
    } catch (e) {
      console.log(e.message);
    }
  `;
  const r = spawnSync(process.execPath, ["-e", script], {
    cwd: dir, encoding: "utf8", timeout: 60_000,
  });
  return (r.stdout ?? "") + (r.stderr ?? "");
}

describe("diet-4.2 (PLAT-56)", () => {
  it("every moved dep lives in exactly one role: peer + optional", () => {
    expect(MOVED.length).toBeGreaterThanOrEqual(20);
    const offenders = MOVED.filter(
      (pkg) =>
        PKG.dependencies?.[pkg] !== undefined ||
        PKG.peerDependencies?.[pkg] === undefined ||
        PKG.peerDependenciesMeta?.[pkg]?.optional !== true
    );
    expect(offenders).toEqual([]);
  });

  it("a dependency-kind entry exists per moved dep since 4.2.0", () => {
    for (const pkg of ["react-hook-form", "zod", "framer-motion", "date-fns", "chart.js", "express"]) {
      expect(MOVED).toContain(pkg);
    }
  });

  it("sandbox: the contract error is exact for representative moved peers", () => {
    for (const pkg of ["react-hook-form", "zod", "framer-motion"]) {
      expect(callOptionalPeer(pkg)).toContain(ERROR(pkg));
    }
  }, 120_000);

  it("release notes' first section names every moved dep", () => {
    const notes = readFileSync(join(ROOT, "RELEASE_NOTES_4.2.0.md"), "utf8");
    const heads = [...notes.matchAll(/^## /gm)];
    const firstSection =
      heads.length >= 2 ? notes.slice(heads[0].index, heads[1].index) : notes;
    for (const pkg of MOVED) {
      expect(firstSection).toContain(`\`${pkg}\``);
    }
  });
});
