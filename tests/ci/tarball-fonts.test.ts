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

  it("fixture: a poisoned css string still trips the pattern", () => {
    const poisoned = '--aura-font-sans: "Aeonik", system-ui, sans-serif;';
    expect(AEONIK.test(poisoned)).toBe(true);
    expect(/font-family[^;\n]*aeonik|'Aeonik'|"Aeonik"/i.test(poisoned)).toBe(true);
  });
});
