/**
 * REQ-PLAT-54 — tarball font fixtures.
 *
 * Aeonik was removed (licence unconfirmed, decision record
 * docs/release/decisions/4.1.1-font-licence.md). These tests pin:
 *  1. no live font-family declaration in src/ or tokens/ names Aeonik,
 *  2. personas and the generated token module stay consistent,
 *  3. scripts/ci/verify-pack.js actually contains the pack-time check,
 *  4. the detection pattern still fires on a poisoned fixture.
 */
import { execFileSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = join(__dirname, "..", "..");
const AEONIK = /aeonik/i;

const listAeonikRefs = (): string[] => {
  try {
    return execFileSync(
      "rg",
      ["-ln", "Aeonik", "src", "tokens"],
      { cwd: ROOT, encoding: "utf8" }
    )
      .split("\n")
      .filter(Boolean);
  } catch {
    return []; // rg exits 1 when there are no matches at all
  }
};

describe("tarball fonts (PLAT-54)", () => {
  it("no live font-family declaration names Aeonik", () => {
    const hits = listAeonikRefs().filter(
      (f) => !/deprecations\.generated\.ts$/.test(f)
    );
    // deprecation migration notes may still reference the removed family
    for (const f of hits) {
      const text = readFileSync(join(ROOT, f), "utf8");
      expect(/font-family[^;\n]*aeonik|'Aeonik'|"Aeonik"/i.test(text)).toBe(false);
    }
  });

  it("personas/default.json and src/tokens/generated.ts hold the same sans stack", () => {
    const personas = JSON.parse(
      readFileSync(join(ROOT, "tokens/personas/default.json"), "utf8")
    );
    const sans = personas.typography?.families?.sans;
    expect(sans).toMatch(/^system-ui,/);
    expect(sans).not.toMatch(AEONIK);
    const generated = readFileSync(join(ROOT, "src/tokens/generated.ts"), "utf8");
    const gm = generated.match(/sans:\s*'([^']+)'/);
    expect(gm?.[1]).toEqual(sans);
  });

  it("designConstants fontFamily.sans has no stray quote and no Aeonik", () => {
    const src = readFileSync(join(ROOT, "src/tokens/designConstants.ts"), "utf8");
    const m = src.match(/sans:\s*'([^']+)'/);
    expect(m).not.toBeNull();
    expect(m![1]).toMatch(/^system-ui,/);
    expect(m![1]).not.toMatch(AEONIK);
    expect(m![1]).not.toMatch(/^"/);
  });

  it("verify-pack.js contains the Aeonik pack-time check", () => {
    const vp = readFileSync(join(ROOT, "scripts/ci/verify-pack.js"), "utf8");
    expect(vp).toMatch(/aeonik/i);
    expect(vp).toContain("still references the removed Aeonik family");
    expect(existsSync(join(ROOT, "docs/release/decisions/4.1.1-font-licence.md"))).toBe(true);
  });

  it("every font-family site named by REQ-PLAT-54 carries the full system stack", () => {
    const STACK = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    const SVG_STACK = STACK.replace(/"/g, "'");
    const read = (f: string) => readFileSync(join(ROOT, f), "utf8");
    const personas = JSON.parse(read("tokens/personas/default.json"));
    expect(personas.typography.families.sans).toBe(STACK);
    expect(read("src/styles/variables.css").replace(/\s+/g, " ")).toContain(`--aura-font-sans: ${STACK};`);
    expect(read("src/tokens/designConstants.ts")).toContain(`sans: '${STACK}',`);
    expect(read("src/theme/tokens.ts")).toContain(`'${STACK}'`);
    const chart = read("src/components/charts/GlassDataChart.tsx");
    expect(chart).toContain(`'${STACK}';`);
    expect(chart.split(`px ${STACK}\``).length - 1).toBe(2);
    const modular = read("src/components/charts/ModularGlassDataChart.tsx");
    expect(modular).toContain(`ctx.font = 'bold 16px ${STACK}';`);
    expect(modular).toContain(`ctx.font = '12px ${STACK}';`);
    expect(read("src/components/media/GlassAdvancedAudioPlayer.tsx").split(`font-family="${SVG_STACK}"`).length - 1).toBe(1);
    expect(read("src/components/media/GlassAdvancedVideoPlayer.tsx").split(`font-family="${SVG_STACK}"`).length - 1).toBe(2);
    // No short stack (the pre-fix 'Roboto, sans-serif' tail) is left at these sites.
    for (const f of ["src/tokens/designConstants.ts", "src/theme/tokens.ts", "src/components/charts/GlassDataChart.tsx"]) {
      expect([f, /Roboto, sans-serif/.test(read(f))]).toEqual([f, false]);
    }
  });

  it("one font decision record: the duplicate 4.1.1-font-aeonik.md is gone", () => {
    expect(existsSync(join(ROOT, "docs/release/decisions/4.1.1-font-aeonik.md"))).toBe(false);
    const rec = readFileSync(join(ROOT, "docs/release/decisions/4.1.1-font-licence.md"), "utf8");
    expect(rec).toContain("`--aura-font-sans`");
  });

  it("fixture: a poisoned css string still trips the pattern", () => {
    const poisoned = '--aura-font-sans: "Aeonik", system-ui, sans-serif;';
    expect(AEONIK.test(poisoned)).toBe(true);
    expect(/font-family[^;\n]*aeonik|'Aeonik'|"Aeonik"/i.test(poisoned)).toBe(true);
  });
});
