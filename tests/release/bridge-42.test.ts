import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "..", "..");
const MOVED = ["express","express-rate-limit","helmet","cors","compression","socket.io","socket.io-client","ioredis","redis","jsonwebtoken","bcryptjs","dotenv","openai","@pinecone-database/pinecone","@google-cloud/vision","@sentry/node","chart.js","react-chartjs-2","date-fns","zod","framer-motion"];

describe("4.2 optional-peer diet", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  it("moved packages sit in peerDependencies with optional meta", () => {
    for (const p of MOVED) {
      expect(pkg.dependencies?.[p]).toBeUndefined();
      expect(pkg.peerDependencies?.[p]).toBeTruthy();
      expect(pkg.peerDependenciesMeta?.[p]?.optional).toBe(true);
    }
  });
  it("lazyPeer throws the exact contract message when a peer is absent", () => {
    const out = execFileSync(
      "npx", ["tsx", "-e",
        "import {lazyPeer} from './src/utils/optionalPeer'; try { const m = lazyPeer('definitely-not-a-real-pkg-xyz'); (m as any).x; } catch (e) { process.stdout.write(String(e)); }"],
      { cwd: ROOT, encoding: "utf8" },
    );
    expect(out).toContain("[aura-glass] definitely-not-a-real-pkg-xyz is now an optional peer; install it: npm i definitely-not-a-real-pkg-xyz");
  });
  it("deprecation fragment carries a dependency entry per moved package (since 4.2.0)", () => {
    const out = execFileSync(
      "npx", ["tsx", "-e", "import f from './fragments/deprecations/plat.ts'; const e=f.default??f; process.stdout.write(JSON.stringify(e))"],
      { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
    const entries = JSON.parse(out);
    for (const p of MOVED) {
      const e = entries.find((x: any) => x.kind === "dependency" && x.symbol === p);
      expect(e).toBeTruthy();
      expect(e.since).toBe("4.2.0");
    }
    const c4 = entries.filter((e: any) => e.since === "4.2.0");
    expect(c4.length).toBeGreaterThanOrEqual(39);
  });
});

describe("warnDeprecated + provider bridge", () => {
  it("warns once in dev, silent under deprecations='silent'", () => {
    const out = execFileSync(
      "npx", ["tsx", "-e",
        "import {warnDeprecated,setDeprecationMode} from './src/utils/warnDeprecated'; const w=console.warn; let n=0; console.warn=()=>{n++}; warnDeprecated('DEP-P0050'); warnDeprecated('DEP-P0050'); const once=n; setDeprecationMode('silent'); warnDeprecated('DEP-P0050'); warnDeprecated('DEP-P0042'); process.stdout.write(JSON.stringify({once,afterSilent:n}));"],
      { cwd: ROOT, encoding: "utf8" },
    );
    const r = JSON.parse(out);
    expect(r.once).toBe(1);
    expect(r.afterSilent).toBe(1);
  });
});

describe("D-28 / leak fixes", () => {
  it("opacity vars are defined", () => {
    const css = fs.readFileSync(path.join(ROOT, "src/styles/variables.css"), "utf8");
    for (const v of ["--glass-opacity-20", "--glass-opacity-24", "--glass-opacity-32", "--glass-opacity-52", "--glass-opacity-72"]) {
      expect(css).toContain(v + ":");
    }
  });
  it("GlassSwitch has no shimmer animation", () => {
    const s = fs.readFileSync(path.join(ROOT, "src/components/input/GlassSwitch.tsx"), "utf8");
    expect(s).not.toContain('"shimmer"');
  });
  it("WorkspaceTabs does not pass value/onValueChange to the canvas", () => {
    const s = fs.readFileSync(path.join(ROOT, "src/components/collaboration/CollaborativeGlassWorkspace.tsx"), "utf8");
    const fn = s.slice(s.indexOf("function WorkspaceTabs"));
    expect(fn).toContain("onValueChange: _onValueChange");
  });
  it("no perpetual rAF loops in the fixed files", () => {
    const a = fs.readFileSync(path.join(ROOT, "src/components/layout/OptimizedGlassContainer.tsx"), "utf8");
    const b = fs.readFileSync(path.join(ROOT, "src/components/advanced/GlassPerformanceOptimization.tsx"), "utf8");
    expect(a.match(/requestAnimationFrame\(measureFps\)/g)!.length).toBe(2);
    expect(b.match(/requestAnimationFrame/g)!.length).toBeLessThanOrEqual(2);
  });
});
