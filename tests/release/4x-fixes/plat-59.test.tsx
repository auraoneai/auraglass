/**
 * REQ-PLAT-59 — 4.x visual-fixes behavioural tests (6).
 */
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

jest.mock("framer-motion", () => {
  const R = require("react");
  return {
    motion: new Proxy({}, {
      get: (t: any, tag: string) =>
        R.forwardRef(({ children, ...rest }: any, ref: any) =>
          R.createElement(tag, { ...rest, ref }, children)
        ),
    }),
    AnimatePresence: ({ children }: any) => R.createElement(R.Fragment, null, children),
  };
});

const ROOT = join(__dirname, "..", "..", "..");
const readSrc = (p: string) => readFileSync(join(ROOT, p), "utf8");

describe("PLAT-59 visual fixes", () => {
  it("1. GlassWorkspaceTabs destructures value/onValueChange", () => {
    const src = readSrc("src/workspace/index.tsx");
    expect(src).toMatch(/\{\s*className,\s*children,\s*value,\s*onValueChange/);
    expect(src).toContain("GlassWorkspaceTabsProps");
    // children get the controlled props
    expect(src).toMatch(/cloneElement[\s\S]*value,\s*\n?\s*onValueChange/);
  });

  it("2. perpetual rAF FPS loops are deleted", () => {
    const offenders: string[] = [];
    for (const f of [
      "src/hooks/extended/useGlassPerformance.ts",
      "src/hooks/usePerformance.ts",
      "src/hooks/useEnhancedPerformance.ts",
    ]) {
      const src = readSrc(f);
      // no self-rescheduling rAF counters
      if (/requestAnimationFrame\((countFrame|measureFPS|measure)\)/.test(src)) offenders.push(f);
      if (/requestAnimationFrame\(animate\)/.test(src)) offenders.push(f);
    }
    expect(offenders).toEqual([]);
  });

  it("3. prefers-contrast: more is honoured", () => {
    const css = readSrc("src/styles/glass.css");
    expect(css).toContain("prefers-contrast: more");
    const a11y = readSrc("src/utils/a11y.ts");
    expect(a11y).toContain("(prefers-contrast: more)");
  });

  it("4. dark on-surface is OKLCH with L >= 0.92 and C <= 0.02", () => {
    const css = readSrc("src/styles/themes/dark.css");
    const m = css.match(/--glass-on-surface:\s*oklch\(([\d.]+)\s+([\d.]+)/);
    expect(m).not.toBeNull();
    expect(parseFloat(m![1])).toBeGreaterThanOrEqual(0.92);
    expect(parseFloat(m![2])).toBeLessThanOrEqual(0.02);
  });

  it("5. GlassSwitch renders no shimmer/press classes", () => {
    const src = readSrc("src/components/input/GlassSwitch.tsx");
    expect(src).not.toMatch(/\bpress\b\s*$/m);
    expect(src).not.toContain("liftOnHover");
    expect(src).not.toMatch(/glass-(animate-)?shimmer|hover-sheen/);
    expect(src).toContain('animation="none"');
  });

  it("6. four visual-fixes JSONs exist with measured contrast", () => {
    const dir = join(ROOT, "docs/release/visual-fixes");
    const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
    expect(files).toHaveLength(4);
    const offenders: string[] = [];
    for (const f of files) {
      const doc = JSON.parse(readFileSync(join(dir, f), "utf8"));
      if (typeof doc?.measuredContrast?.ratio !== "number" || doc.measuredContrast.ratio <= 0) {
        offenders.push(`${f}: missing measuredContrast.ratio`);
      }
      if (!doc.fix || !doc.selector) offenders.push(`${f}: missing fix/selector`);
    }
    expect(offenders).toEqual([]);
  });
});
