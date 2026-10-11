/**
 * REQ-PLAT-54 font hunk (FIN-D, PROMPT-FINAL v2 §3.1 R5) — release/4.x.
 *
 * The default persona is the source of the sans stack. scripts/build-tokens.js
 * emits it into src/tokens/generated.ts (auraTokens) and src/styles/variables.css
 * (--aura-font-sans). These tests pin the ledger stack (system fonts only, no
 * Aeonik) at the source and check both generated outputs carry the same value.
 */
import { readFileSync } from "fs";
import { join } from "path";
import { auraTokens } from "../../src/tokens/generated";

const ROOT = join(__dirname, "..", "..");

// REQ-PLAT-54 remaining_work: the full system stack.
const LEDGER_STACK =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const splitFamilies = (stack: string): string[] =>
  stack.split(",").map((f) => f.trim().replace(/^["']|["']$/g, ""));

const personaJson = JSON.parse(
  readFileSync(join(ROOT, "tokens/personas/default.json"), "utf8"),
);

describe("default persona font stack (REQ-PLAT-54)", () => {
  it("tokens/personas/default.json holds the ledger system stack", () => {
    expect(personaJson.typography.families.sans).toBe(LEDGER_STACK);
  });

  it("no family in the source stack is Aeonik and every family is a system font", () => {
    const families = splitFamilies(personaJson.typography.families.sans);
    expect(families).toEqual([
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ]);
    expect(families.some((f) => /aeonik/i.test(f))).toBe(false);
  });

  it("src/tokens/generated.ts carries the persona stack for the default persona", () => {
    const persona = auraTokens.personas.find(
      (p) => p.metadata.id === personaJson.metadata.id,
    );
    expect(persona).toBeDefined();
    expect(persona!.typography.families.sans).toBe(personaJson.typography.families.sans);
  });

  it("src/styles/variables.css --aura-font-sans equals the persona stack", () => {
    const css = readFileSync(join(ROOT, "src/styles/variables.css"), "utf8");
    const decls = [...css.matchAll(/--aura-font-sans:\s*([^;]+);/g)].map((m) =>
      m[1].replace(/\s+/g, " ").trim(),
    );
    expect(decls.length).toBeGreaterThan(0);
    for (const value of decls) {
      expect(value).toBe(LEDGER_STACK);
    }
  });
});
