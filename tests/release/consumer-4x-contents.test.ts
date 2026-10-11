/** REQ-PLAT-63 — consumer-4x contents gate: real App Router app + Vite app,
 * >=30 root exports, 3 aliases, every surviving subpath, CSS vars, props,
 * provider and date-fns usage, flagship-subset.json, wired into the
 * run-{next,vite}-integration scripts. */
import fs from "node:fs";
import path from "node:path";

const FIX = path.resolve(__dirname, "..", "fixtures", "consumer-4x");
const SUBSET = JSON.parse(
  fs.readFileSync(path.join(FIX, "flagship-subset.json"), "utf8")
);
const ROOT = path.resolve(FIX, "..", "..", "..");

const READ = (f: string) => fs.readFileSync(f, "utf8");
const ALL_SRC = (dir: string): string =>
  fs
    .readdirSync(dir, { recursive: true })
    .filter((f) => /\.(tsx?|css)$/.test(String(f)))
    .map((f) => READ(path.join(dir, String(f))))
    .join("\n");

describe("consumer-4x contents", () => {
  it("flagship-subset.json lists every exports subpath", () => {
    const pkg = JSON.parse(READ(path.join(ROOT, "package.json")));
    const expected = Object.keys(pkg.exports).filter(
      (k) => !["./package.json", "./deprecations.json", "."].includes(k)
    );
    expect(SUBSET.subpaths.sort()).toEqual(expected.sort());
    expect(SUBSET.rootExports.length).toBeGreaterThanOrEqual(30);
    expect(SUBSET.aliases.length).toBe(3);
  });

  describe("next15 — real App Router app", () => {
    const dir = path.join(FIX, "next15");
    it("has app/layout.tsx, app/page.tsx, app/providers.tsx, next.config", () => {
      const missing = [
        "app/layout.tsx",
        "app/page.tsx",
        "app/providers.tsx",
        "next.config.js",
        "package.json",
        "tsconfig.json",
      ].filter((f) => !fs.existsSync(path.join(dir, f)));
      expect(missing).toEqual([]);
      const layout = READ(path.join(dir, "app/layout.tsx"));
      expect(layout).toContain("StyledComponentsRegistry");
    });
    it("declares aura-glass from the packed tgz + next15/react19 pair", () => {
      const pkg = JSON.parse(READ(path.join(dir, "package.json")));
      expect(pkg.dependencies["aura-glass"]).toMatch(/^file:.*\.tgz$/);
      expect(pkg.dependencies.next).toMatch(/^15/);
      expect(pkg.dependencies.react).toMatch(/^19/);
      expect(pkg.dependencies["date-fns"]).toBeDefined();
    });
  });

  describe("vite-react18 — real Vite app", () => {
    const dir = path.join(FIX, "vite-react18");
    it("has index.html, src/App.tsx entry, vite.config.ts", () => {
      const missing = ["index.html", "src/App.tsx", "vite.config.ts", "package.json"].filter(
        (f) => !fs.existsSync(path.join(dir, f))
      );
      expect(missing).toEqual([]);
    });
    it("declares aura-glass from the packed tgz + vite/react18 pair", () => {
      const pkg = JSON.parse(READ(path.join(dir, "package.json")));
      expect(pkg.dependencies["aura-glass"]).toMatch(/^file:.*\.tgz$/);
      expect(pkg.dependencies.react).toMatch(/^18\.3/);
      expect(pkg.dependencies["date-fns"]).toBeDefined();
    });
  });

  for (const app of ["next15", "vite-react18"]) {
    const dir = path.join(FIX, app);
    const entry = app === "next15" ? "app/page.tsx" : "src/App.tsx";
    it(`${app} uses every flagship root export + subpath + alias + provider + date-fns`, () => {
      const src = READ(path.join(dir, entry));
      // >=30 root exports from "aura-glass": the import block that closes
      // with `} from "aura-glass"`.
      const block = src.match(/import\s*\{([\s\S]*?)\}\s*from\s*["']aura-glass["']/)!;
      const names = block[1]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      expect(names.length).toBeGreaterThanOrEqual(30);
      const missingRoots = SUBSET.rootExports.filter((r: string) => !names.includes(r));
      expect(missingRoots).toEqual([]);
      // every surviving subpath imported
      const missingSubs = SUBSET.subpaths.filter(
        (sp: string) => !src.includes(`"aura-glass/${sp.slice(2)}"`)
      );
      expect(missingSubs).toEqual([]);
      // 3 aliases used
      const missingAliases = SUBSET.aliases.filter(
        (al: string) => !src.includes(`from "${al.slice(0, -2)}/`)
      );
      expect(missingAliases).toEqual([]);
      // provider + props + date-fns + css var usage
      expect(src).toContain("ThemeProvider");
      expect(src).toContain("GlassProps");
      expect(src).toContain("date-fns");
      expect(src).toContain("--glass-");
      expect(src).toContain("data-mobile-page");
    });
    it(`${app} globals.css reads --glass-* vars with @supports`, () => {
      const cssPath = app === "next15" ? "app/globals.css" : "src/globals.css";
      const css = READ(path.join(dir, cssPath));
      expect(css).toMatch(/--glass-/);
      expect(css).toContain("@supports");
    });
  }

  it("fixture is wired into run-next-integration + run-vite-integration", () => {
    const nextRunner = READ(path.join(ROOT, "scripts/ci/run-next-integration.js"));
    const viteRunner = READ(path.join(ROOT, "scripts/ci/run-vite-integration.js"));
    expect(nextRunner).toContain("consumer-4x");
    expect(viteRunner).toContain("consumer-4x");
  });
  // The visual-4x CI wiring lives in ci/plat.gitlab-ci.yml (FIN-B file); its
  // assertion is in FIN-B's tests/ci/plat-fragment.test.ts (4x-fin/b-wire-plat63).
});
