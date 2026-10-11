/**
 * REQ-PLAT-58 — providers-wrap: deprecated providers wrap children and warn
 * exactly once per deprecation id; the new ledger rows (keyframes, mixins,
 * interactiveGlass, v2 block, getPersona*, recipe cli rows, registry exports)
 * exist in the generated table.
 */
import { readFileSync } from "fs";
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
    useReducedMotion: () => false,
  };
});

import { DEPRECATIONS_4X } from "../../src/utils/deprecations.generated";
import { warnDeprecated, setDeprecationMode } from "../../src/utils/warnDeprecated";

const ROOT = join(__dirname, "..", "..");

describe("PLAT-58 ledger coverage", () => {
  it("every new DEP-P row lands in the generated table", () => {
    const ids = DEPRECATIONS_4X.map((e: any) => e.id);
    const expected: string[] = [
      "DEP-P0073", "DEP-P0074", "DEP-P0075", "DEP-P0076", "DEP-P0077", "DEP-P0078",
    ];
    for (let n = 79; n <= 106; n++) expected.push(`DEP-P${String(n).padStart(4, "0")}`);
    const missing = expected.filter((id) => !ids.includes(id));
    expect(missing).toEqual([]);
  });

  it("the 28 recipe cli rows carry recipe:<id> symbols", () => {
    const recipes = DEPRECATIONS_4X.filter(
      (e: any) => e.kind === "cli" && String(e.symbol).startsWith("recipe:")
    );
    expect(recipes).toHaveLength(28);
  });
});

describe("warnDeprecated callsites", () => {
  it("fires once per id and formats the REQ-PLAT-26 message", () => {
    const spy = jest.spyOn(console, "warn").mockImplementation(() => {});
    setDeprecationMode("warn");
    warnDeprecated("DEP-P0056");
    warnDeprecated("DEP-P0056"); // second call swallowed by the once-set
    const calls = spy.mock.calls.filter((c) => String(c[0]).includes("DEP-P0056"));
    expect(calls).toHaveLength(1);
    expect(String(calls[0][0])).toMatch(/\[aura-glass\] DEP-P0056/);
    expect(String(calls[0][0])).toMatch(/deprecated since 4\.2\.0/);
    spy.mockRestore();
  });

  it("callsites exist in services, useGlassProbes, alias barrels, interactiveGlass", () => {
    const offenders: string[] = [];
    const must = [
      "src/services/ai/openai-service.ts",
      "src/services/websocket/collaboration-service.ts",
      "src/hooks/useGlassProbes.ts",
      "src/client/index.ts",
      "src/ssr/index.ts",
      "src/server/index.ts",
      "src/registry/index.ts",
      "src/core/mixins/interactiveGlass.ts",
    ];
    for (const f of must) {
      const src = readFileSync(join(ROOT, f), "utf8");
      if (!/warnDeprecated\("DEP-P/.test(src)) offenders.push(f);
    }
    expect(offenders).toEqual([]);
  });
});
