/**
 * REQ-PLAT-48 (#199, FIN-C.1) — useGalileoStateSpring / useAuraStateSpring stay
 * exported on 4.x and warn through DEP-P0107 instead of being removed in a
 * 4.x minor.
 *   - the root barrel still re-exports both names from the hook module (AST);
 *   - the hook keeps its 4.x behaviour (immediate set, isAnimating false);
 *   - it warns once per load with the DEP-P0107 id;
 *   - the DEP-P0107 fragment row is an active `export` entry removed in 5.0.0.
 */
import fs from "fs";
import path from "path";
import ts from "typescript";
import { renderHook, act } from "@testing-library/react";
import { useGalileoStateSpring } from "../useGalileoStateSpring";
import platDeprecations from "../../../fragments/deprecations/plat";

const ROOT = path.resolve(__dirname, "../../..");

function rootReExports(moduleSpecifier: string): Map<string, string> {
  const file = path.join(ROOT, "src/index.ts");
  const sf = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
  const out = new Map<string, string>();
  for (const stmt of sf.statements) {
    if (!ts.isExportDeclaration(stmt) || !stmt.moduleSpecifier) continue;
    if (!ts.isStringLiteral(stmt.moduleSpecifier) || stmt.moduleSpecifier.text !== moduleSpecifier) continue;
    if (!stmt.exportClause || !ts.isNamedExports(stmt.exportClause)) continue;
    for (const el of stmt.exportClause.elements) {
      out.set(el.name.text, (el.propertyName ?? el.name).text);
    }
  }
  return out;
}

describe("useGalileoStateSpring 4.x deprecation (DEP-P0107)", () => {
  // warnDeprecated keeps a module-level once-per-load set, so one recorder
  // covers every render in this file and the "once" assertion counts all of
  // them. The recorder keeps its own list because testSetup's afterEach runs
  // jest.clearAllMocks(), which empties mock.calls between tests.
  const warned: unknown[][] = [];
  let warn: jest.SpyInstance;
  beforeAll(() => {
    warn = jest.spyOn(console, "warn").mockImplementation((...args: unknown[]) => {
      warned.push(args);
    });
  });
  afterAll(() => warn.mockRestore());
  const depWarnings = () => warned.filter((c) => String(c[0]).includes("DEP-P0107"));

  it("root barrel still exports useGalileoStateSpring and its useAuraStateSpring alias", () => {
    const exported = rootReExports("./hooks/useGalileoStateSpring");
    expect(exported.get("useGalileoStateSpring")).toBe("useGalileoStateSpring");
    expect(exported.get("useAuraStateSpring")).toBe("useGalileoStateSpring");
  });

  it("keeps the 4.x behaviour: value set immediately, never animating", () => {
    const { result } = renderHook(() => useGalileoStateSpring(1));
    expect(result.current.value).toBe(1);
    expect(result.current.isAnimating).toBe(false);
    act(() => result.current.setValue(5));
    expect(result.current.value).toBe(5);
    expect(result.current.isAnimating).toBe(false);
  });

  it("warns exactly once per load with the DEP-P0107 id across renders and instances", () => {
    const a = renderHook(() => useGalileoStateSpring("a"));
    a.rerender();
    renderHook(() => useGalileoStateSpring("b"));
    const calls = depWarnings();
    expect(calls).toHaveLength(1);
    expect(String(calls[0][0])).toMatch(/^\[aura-glass\] DEP-P0107 .*deprecated since 4\.2\.0, removed in 5\.0\.0/);
  });

  it("has an active DEP-P0107 export row removed in 5.0.0", () => {
    const row = (platDeprecations as ReadonlyArray<Record<string, unknown>>).find((r) => r.id === "DEP-P0107");
    expect(row).toMatchObject({
      kind: "export",
      status: "active",
      entry: ".",
      symbol: "useGalileoStateSpring",
      since: "4.2.0",
      removeIn: "5.0.0",
    });
  });
});
