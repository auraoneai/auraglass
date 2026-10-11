/**
 * REQ-MAT-41 / REQ-FIN-57 (AC-FIN-57, AC-MAT-31): the 4.3 v5 preview on release/4.x.
 *
 * Loads the generated src/material/css/preview-v5.css (== src/styles/preview-v5.css) on
 * fixture markup of the six 4.x glass primitives. The test itself sets
 * data-ag-preview="v5" (the provider prop and the primitives' attribute emission are
 * PLAT's, REQ-FIN-36). A small cascade resolver (cascade layers, specificity, source
 * order, custom-property inheritance, var() substitution) evaluates the sheet against the
 * jsdom tree, because jsdom does not implement @layer or custom-property cascading.
 *
 * Asserts:
 *  - committed bridge outputs equal a fresh `build.mjs --platform bridge-4x` (drift);
 *  - inside the preview, each primitive's ::before backdrop-filter and its fill resolve to
 *    the ladders.css cell for its [variant][thickness] (6/6);
 *  - without the attribute nothing in the preview sheet matches any element or ::before
 *    (the 4.x subtree is untouched);
 *  - v5.css carries the contract durations (200/320/450 ms);
 *  - the compat sheet carries the D-28 dark-text fix from tokens/legacy.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import React from "react";
import { render } from "@testing-library/react";

// postcss@8 and postcss-selector-parser resolve through the lockfile (rollup-plugin-postcss).
// eslint-disable-next-line @typescript-eslint/no-var-requires
const postcss = require("postcss") as typeof import("postcss");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const selectorParser = require("postcss-selector-parser");

const ROOT = path.resolve(__dirname, "..", "..", "..");
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), "utf8");
const PREVIEW = "src/material/css/preview-v5.css";
const LAYERS = ["ag.compat", "ag.reset", "ag.tokens", "ag.material", "ag.components", "ag.a11y"];

/* ------------------------------------------------------------------ cascade */

type Spec = [number, number, number];
type Decl = { prop: string; value: string; layer: number; spec: Spec; order: number; selector: string };
type Rule = { selectors: string[]; decls: { prop: string; value: string }[]; layer: number; order: number };

function specificity(sel: string): Spec {
  let a = 0, b = 0, c = 0;
  const walk = (nodes: any[]) => {
    for (const n of nodes) {
      if (n.type === "id") a++;
      else if (n.type === "class" || n.type === "attribute") b++;
      else if (n.type === "tag" && n.value !== "*") c++;
      else if (n.type === "pseudo") {
        const name = n.value.toLowerCase();
        if (name === ":where") continue;
        if (name === ":is" || name === ":not" || name === ":has") {
          let best: Spec = [0, 0, 0];
          for (const inner of n.nodes) {
            const s = specificity(String(inner));
            if (cmpSpec(s, best) > 0) best = s;
          }
          a += best[0]; b += best[1]; c += best[2];
        } else if (name.startsWith("::")) c++;
        else b++;
      }
    }
  };
  selectorParser((root: any) => root.each((s: any) => walk(s.nodes))).processSync(sel);
  return [a, b, c];
}
const cmpSpec = (x: Spec, y: Spec) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2];

/** Style rules active in the default environment: rules inside @media / @supports are
 *  conditional and are skipped (no media feature is active in this harness). */
function loadRules(css: string): Rule[] {
  const rules: Rule[] = [];
  let order = 0;
  postcss.parse(css).walkRules((rule) => {
    let layer = LAYERS.length; // unlayered wins over every layer
    let p: any = rule.parent;
    while (p && p.type !== "root") {
      if (p.type === "atrule") {
        if (p.name === "media" || p.name === "supports") return;
        if (p.name === "layer") {
          const i = LAYERS.indexOf(p.params.trim());
          if (i < 0) throw new Error(`unknown layer ${p.params}`);
          layer = i;
        }
      }
      p = p.parent;
    }
    const decls: { prop: string; value: string }[] = [];
    rule.each((n: any) => { if (n.type === "decl") decls.push({ prop: n.prop, value: n.value }); });
    rules.push({ selectors: rule.selectors.map((s) => s.trim()), decls, layer, order: order++ });
  });
  return rules;
}

function matchingDecls(rules: Rule[], el: Element, pseudo: "::before" | null): Decl[] {
  const out: Decl[] = [];
  for (const r of rules) {
    let best: Spec | null = null;
    let bestSel = "";
    for (const sel of r.selectors) {
      const hasPseudo = sel.endsWith("::before");
      if (pseudo ? !hasPseudo : sel.includes("::")) continue;
      const host = pseudo ? sel.slice(0, -"::before".length) : sel;
      if (!el.matches(host)) continue;
      const s = specificity(sel);
      if (!best || cmpSpec(s, best) > 0) { best = s; bestSel = sel; }
    }
    if (best) for (const d of r.decls) out.push({ ...d, layer: r.layer, spec: best, order: r.order, selector: bestSel });
  }
  return out;
}

const wins = (x: Decl, y: Decl) => x.layer - y.layer || cmpSpec(x.spec, y.spec) || x.order - y.order;

function cascaded(rules: Rule[], el: Element, pseudo: "::before" | null): Map<string, Decl> {
  const won = new Map<string, Decl>();
  for (const d of matchingDecls(rules, el, pseudo)) {
    const cur = won.get(d.prop);
    if (!cur || wins(d, cur) > 0) won.set(d.prop, d);
  }
  return won;
}

/** Computed custom properties (inherited) for el, or for its ::before (inherits el). */
function customProps(rules: Rule[], el: Element, pseudo: "::before" | null = null): Map<string, string> {
  const parent = pseudo ? customProps(rules, el) : el.parentElement ? customProps(rules, el.parentElement) : new Map<string, string>();
  const own = cascaded(rules, el, pseudo);
  const env = new Map(parent);
  for (const [p, d] of own) {
    if (!p.startsWith("--")) continue;
    const v = d.value.trim();
    if (v === "inherit" || v === "unset") {
      if (parent.has(p)) env.set(p, parent.get(p)!);
      else env.delete(p);
    } else env.set(p, d.value);
  }
  return env;
}

function substitute(value: string, env: Map<string, string>, depth = 0): string {
  if (depth > 50) throw new Error(`var() cycle while resolving ${value}`);
  let out = "";
  let i = 0;
  while (i < value.length) {
    const at = value.indexOf("var(", i);
    if (at < 0) { out += value.slice(i); break; }
    out += value.slice(i, at);
    let depthP = 0, j = at + 3, comma = -1;
    for (; j < value.length; j++) {
      if (value[j] === "(") depthP++;
      else if (value[j] === ")") { depthP--; if (depthP === 0) break; }
      else if (value[j] === "," && depthP === 1 && comma < 0) comma = j;
    }
    const name = value.slice(at + 4, comma > 0 ? comma : j).trim();
    const fallback = comma > 0 ? value.slice(comma + 1, j).trim() : undefined;
    const v = env.get(name);
    if (v !== undefined) out += substitute(v, env, depth + 1);
    else if (fallback !== undefined) out += substitute(fallback, env, depth + 1);
    else throw new Error(`unresolved var(${name}) in "${value}"`);
    i = j + 1;
  }
  return out.replace(/\s+/g, " ").trim();
}

function computed(rules: Rule[], el: Element, prop: string, pseudo: "::before" | null = null): string | undefined {
  const d = cascaded(rules, el, pseudo).get(prop);
  return d ? substitute(d.value, customProps(rules, el, pseudo)) : undefined;
}

/* ------------------------------------------------------------------ ladders */

function ladderCell(variant: string, thickness: string): Record<string, string> {
  const cell: Record<string, string> = {};
  const want = `[data-ag-variant="${variant}"][data-ag-thickness="${thickness}"]`;
  postcss.parse(read("src/material/css/ladders.css")).walkRules((r) => {
    if (r.selectors.map((s) => s.trim()).includes(want) && r.selectors.length === 1)
      r.walkDecls((d) => { cell[d.prop] = d.value.replace(/\s+/g, " ").trim(); });
  });
  if (!cell["--_ag-mat-blur"]) throw new Error(`ladders.css has no cell ${want}`);
  return cell;
}

/* ------------------------------------------------------------------ fixture */

/* The six 4.x glass primitives (PRD-2 §8 compat table; each becomes `Surface`). The markup
   is what the 4.3 primitives emit under the preview: the S-01 data-ag-* role attributes on
   the host. Variants/thicknesses differ per primitive so each ladder row is exercised. */
const PRIMITIVES = [
  { name: "OptimizedGlass", variant: "regular", thickness: "regular", layer: "chrome" },
  { name: "OptimizedGlassCore", variant: "regular", thickness: "thin", layer: "chrome" },
  { name: "GlassCore", variant: "regular", thickness: "thick", layer: "chrome" },
  { name: "GlassAdvanced", variant: "clear", thickness: "regular", layer: "overlay" },
  { name: "OptimizedGlassAdvanced", variant: "clear", thickness: "thin", layer: "overlay" },
  { name: "LiquidGlassMaterial", variant: "clear", thickness: "thick", layer: "chrome" },
] as const;

function Fixture({ preview }: { preview: boolean }) {
  const surfaces = PRIMITIVES.map((p) => (
    <div
      key={p.name}
      data-testid={p.name}
      className="ag-surface"
      data-ag-surface={p.layer}
      data-ag-layer={p.layer}
      data-ag-variant={p.variant}
      data-ag-thickness={p.thickness}
    >
      <span>{p.name}</span>
    </div>
  ));
  return (
    <div data-testid="app">
      {/* 4.x consumer surface, never inside the preview */}
      <div data-testid="four-x" className="glass glass-neutral-level2" style={{ padding: 24 }}>
        <p>4.x card</p>
      </div>
      {preview ? <div data-ag-preview="v5" data-testid="preview">{surfaces}</div> : <div data-testid="no-preview">{surfaces}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ tests */

describe("bridge-4x outputs are the build.mjs output (mat:build:bridge drift)", () => {
  it("a fresh compile equals every committed bridge file", () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "bridge-4x-"));
    try {
      execFileSync("node", [path.join(ROOT, "scripts/tokens/build.mjs"), "--platform", "bridge-4x", "--out", out], {
        cwd: ROOT,
        encoding: "utf8",
      });
      const files = [
        "src/material/css/ladders.css",
        "src/material/css/floors.css",
        "src/material/css/properties.css",
        "src/styles/v5.css",
        "src/styles/preview-v5.css",
        "src/material/css/preview-v5.css",
        "src/material/compat/tokens.css",
      ];
      for (const f of files) expect({ f, same: fs.readFileSync(path.join(out, f), "utf8") === read(f) }).toEqual({ f, same: true });
    } finally {
      fs.rmSync(out, { recursive: true, force: true });
    }
  });

  it("refuses any platform other than bridge-4x", () => {
    expect(() =>
      execFileSync("node", [path.join(ROOT, "scripts/tokens/build.mjs"), "--platform", "web"], { cwd: ROOT, stdio: "pipe" }),
    ).toThrow(/only --platform bridge-4x/);
  });
});

describe("preview-v5.css on the six 4.x primitives", () => {
  const rules = loadRules(read(PREVIEW));

  it("the two preview paths carry the same generated sheet", () => {
    expect(read("src/styles/preview-v5.css")).toBe(read(PREVIEW));
  });

  it.each(PRIMITIVES.map((p) => [p.name, p] as const))(
    "%s: ::before filter and fill equal the ladders.css cell with data-ag-preview=\"v5\"",
    (_name, p) => {
      const { getByTestId } = render(<Fixture preview />);
      const el = getByTestId(p.name);
      const cell = ladderCell(p.variant, p.thickness);

      const before = computed(rules, el, "backdrop-filter", "::before");
      expect(before).toBeDefined();
      const m = /^blur\(([^)]+)\) saturate\(([^)]+)\) brightness\((.+)\)$/.exec(before!);
      expect(m).not.toBeNull();
      expect(m![1]).toBe(cell["--_ag-mat-blur"]);
      expect(m![2]).toBe(cell["--_ag-mat-saturation"]);
      expect(computed(rules, el, "-webkit-backdrop-filter", "::before")).toBe(before);

      // blur sits on ::before only; the host-level ladder literal is cleared
      expect(computed(rules, el, "backdrop-filter")).toBe("none");

      // fill: the recipe's background resolves to the ladder cell's --ag-surface-fill
      const env = customProps(rules, el);
      expect(computed(rules, el, "background")).toBe(substitute(cell["--ag-surface-fill"], env));
      expect(env.get("--_ag-surface-alpha")).toBe(cell["--_ag-surface-alpha"]);
    },
  );

  it("without the attribute no preview rule matches any element or ::before", () => {
    const { getByTestId } = render(<Fixture preview={false} />);
    const all = [getByTestId("app"), ...Array.from(getByTestId("app").querySelectorAll("*"))];
    expect(all.length).toBeGreaterThan(PRIMITIVES.length);
    const hits = all.flatMap((el) => [
      ...matchingDecls(rules, el, null).map((d) => `${el.getAttribute("data-testid") ?? el.tagName}: ${d.selector}`),
      ...matchingDecls(rules, el, "::before").map((d) => `${el.getAttribute("data-testid") ?? el.tagName}::before: ${d.selector}`),
    ]);
    expect(hits).toEqual([]);
    // also with <html>/<body> in the chain: document-level selectors are never emitted
    for (const el of [document.documentElement, document.body]) expect(matchingDecls(rules, el, null)).toEqual([]);
  });

  it("the 4.x surface next to an active preview stays untouched", () => {
    const { getByTestId } = render(<Fixture preview />);
    const fourX = getByTestId("four-x");
    expect(matchingDecls(rules, fourX, null)).toEqual([]);
    expect(matchingDecls(rules, fourX, "::before")).toEqual([]);
    expect(matchingDecls(rules, fourX.querySelector("p")!, null)).toEqual([]);
  });

  it("every style rule of the sheet is scoped under [data-ag-preview=\"v5\"]", () => {
    const unscoped: string[] = [];
    postcss.parse(read(PREVIEW)).walkRules((r) => {
      for (const s of r.selectors) if (!s.includes('[data-ag-preview="v5"]')) unscoped.push(s);
    });
    expect(unscoped).toEqual([]);
    let atProperty = 0;
    postcss.parse(read(PREVIEW)).walkAtRules("property", () => { atProperty++; });
    expect(atProperty).toBe(0);
  });
});

describe("v5.css and the compat sheet", () => {
  const rootDecls = (css: string) => {
    const out = new Map<string, string>();
    postcss.parse(css).walkRules((r) => {
      if (r.selector.trim() !== ":root" || (r.parent as any)?.type !== "atrule" || (r.parent as any).name !== "layer") return;
      r.walkDecls((d) => { out.set(d.prop, d.value); });
    });
    return out;
  };

  it("v5.css carries the contract durations (DURATIONS_MS 200/320/450)", () => {
    const v = rootDecls(read("src/styles/v5.css"));
    expect(v.get("--ag-duration-small")).toBe("200ms");
    expect(v.get("--ag-duration-medium")).toBe("320ms");
    expect(v.get("--ag-duration-large")).toBe("450ms");
  });

  it("the D-28 dark-text fix is emitted from tokens/legacy into the dark compat block", () => {
    const legacy = JSON.parse(read("tokens/legacy/d28-dark-text.tokens.json")).legacy["d28-dark"];
    const names = Object.values<any>(legacy).map((r) => r.$extensions["ag.legacyVar"]).sort();
    expect(names).toEqual(["--glass-theme-text", "--glass-theme-text-secondary", "--glass-theme-text-tertiary"]);

    const dark = new Map<string, string>();
    postcss.parse(read("src/material/compat/tokens.css")).walkRules((r) => {
      if (r.selector.includes('[data-theme="dark"]')) r.walkDecls((d) => { dark.set(d.prop, d.value); });
    });
    for (const n of names) expect(dark.get(n)).toMatch(/^oklch\(/);
    // dark on-surface: L >= 0.92, C <= 0.02 (REQ-MAT-05)
    const [l, c] = dark.get("--glass-theme-text")!.slice(6, -1).split(/\s+/).map(Number);
    expect(l).toBeGreaterThanOrEqual(0.92);
    expect(c).toBeLessThanOrEqual(0.02);
  });

  it("the compat sheet resolves every alias-map entry: no 'review' placeholders remain", () => {
    const css = read("src/material/compat/tokens.css");
    expect(css).not.toMatch(/review/);
    const map = JSON.parse(read("tokens/compat-alias-map.json"));
    const declared = new Set<string>();
    postcss.parse(css).walkDecls((d) => { declared.add(d.prop); });
    for (const [name, e] of Object.entries<any>(map.entries)) {
      if (e.successor || e.frozenValue !== null) expect({ name, declared: declared.has(name) }).toEqual({ name, declared: true });
      else expect({ name, declared: declared.has(name) }).toEqual({ name, declared: false });
    }
  });
});
