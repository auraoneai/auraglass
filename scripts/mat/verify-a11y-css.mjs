#!/usr/bin/env node
/* MAT-255 (A11Y-011) + REQ-FIN-05: PostCSS gate over the a11y rungs. Rules:
     layer-order                      — rung files put all rules inside @layer ag.a11y
     no-important                     — zero !important
     max-specificity                  — (0,2,0) max; pseudo-elements allowed in the element slot
     no-prefers-contrast-high         — 'prefers-contrast: high' never matches (legacy trap)
     no-handwritten-floor             — --_ag-tint-floor takes a numeric literal only in generated floors.css
     no-numeric-floor-fallback        — var(--_ag-tint-floor*, <number>) fallbacks are hand-written floors, and the
                                        compiler-emitted floor reads (--_ag-on-surface-max, --_ag-border-strong,
                                        --_ag-fallback-fill) take no var() fallback at all (REQ-FIN-05, MAT-54)
     no-undefined-ag-var              — every var(--_ag-*) has a producer: a declaration or @property in any src css file
                                        (or the scanned set), a token-build cell (src/tokens/generated/manifest.ts),
                                        or a JS write ('--_ag-x': … / setProperty('--_ag-x', …)) under src/ (REQ-FIN-05, MAT-54)
     no-undefined-ag-token            — a fallback-less var(--ag-*) in src/a11y/css must be a token-build cssVar
                                        (e.g. --ag-z-{overlay,transient,toast}, --ag-target-coarse) (REQ-FIN-05)
     no-outline-none-focus            — outline:none/0 on :focus-visible or aria-disabled
     no-global-element-selectors      — no bare element selectors (pseudo-elements and :root allowed)
     no-host-opacity-on-disabled      — no opacity on the disabled surface host
     a11y-selectors-keyed-on-data-ag-surface — every selector inside ag.a11y is keyed on data-ag-* (or :root)
     focus-outline-none-count         — focus:outline-none occurrences vs scripts/mat/a11y-baselines/focus-outline-none.json (decrease-only; --enforce-zero at beta)
   Enforces on src/a11y, src/theme, src/material; ratchets elsewhere.
   Prints `file:line rule message` per violation; exit 1 on any enforced-scope
   violation or a baseline increase. Files carried in
   scripts/integration/baselines/a11y-css.json ({file, owner, reqFin, expires})
   print BASELINED; a stale, malformed or expired row fails (PRD-F §4.3 rule 3). */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { rowProblems } from '../integration/lib/baseline-expiry.mjs';

const ROOT = process.cwd();
const ENFORCED_DIRS = ['src/a11y', 'src/theme', 'src/material'];
const A11Y_CSS = /(?:^|\/)src\/a11y\/css\/[^/]+\.css$/;
const BASELINE_PATH = 'scripts/mat/a11y-baselines/focus-outline-none.json';
const CSS_BASELINE = 'scripts/integration/baselines/a11y-css.json';
const ENFORCE_ZERO = process.argv.includes('--enforce-zero');
const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
const SRC = arg('src');                    // scan a single dir (fixture tests)
const ALL_ENFORCED = process.argv.includes('--all-enforced');
const WATCH_DIRS = SRC ? [SRC] : [...ENFORCED_DIRS];

const violations = [];
const add = (file, line, rule, msg) => violations.push({ file, line, rule, msg });
const declVars = new Set();   // --_ag-* declared (or @property-registered) in scanned css
const varRefs = [];           // { rel, line, name, hasFallback, enforced } for var(--_ag-*|--ag-*)
/* compiler-emitted floors (REQ-FIN-03 emits them); rungs read them bare */
const GENERATED_FLOOR_READS = new Set(['--_ag-on-surface-max', '--_ag-border-strong', '--_ag-fallback-fill']);

const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  const st = fs.statSync(dir);
  if (st.isFile()) { if (/\.(css|scss|tsx?|jsx?)$/.test(dir)) out.push(dir); return out; }
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(css|scss|tsx?|jsx?)$/.test(e.name)) out.push(p);
  }
  return out;
};

/* ---- specificity per CSS spec: :where() contributes 0; :is()/:not()/:has()
   contribute their most specific argument; pseudo-elements land in slot C. ---- */
const specOf = (node) => {
  let a = 0, b = 0, c = 0;
  const bare = [];
  node.each((n) => {
    if (n.type === 'combinator' || n.type === 'comment' || n.type === 'universal') return;
    if (n.type === 'attribute' || n.type === 'class') { b += 1; return; }
    if (n.type === 'id') { a += 1; return; }
    if (n.type === 'tag') { c += 1; bare.push(n.value); return; }
    if (n.type !== 'pseudo') return;
    const v = n.value;
    if (v === ':where') return;
    if (v.startsWith('::')) { c += 1; return; } // pseudo-element -> element slot
    if (/^:(?:is|not|has)$/.test(v)) {
      let best = [0, 0, 0];
      let bestBare = [];
      n.each((selNode) => {
        const [ss, sb] = specOf(selNode);
        if (compareSpec(ss, best) > 0) { best = ss; bestBare = sb; }
        bare.push(...sb);
      });
      a += best[0]; b += best[1]; c += best[2];
      bare.push(...bestBare);
      return;
    }
    b += 1; // pseudo-class (incl. :root)
  });
  return [[a, b, c], bare];
};
const compareSpec = (x, y) => (x[0] - y[0]) || (x[1] - y[1]) || (x[2] - y[2]);

const RULE = (name) => `verify-a11y-css/${name}`;

const scanCss = (rel, css, enforced) => {
  const root = postcss.parse(css, { from: rel });
  const isRungFile = SRC ? /\.css$/.test(rel) : (A11Y_CSS.test(rel) && !rel.endsWith('/index.css'));

  if (isRungFile) {
    const topRules = root.nodes.filter((n) => n.type === 'rule' || (n.type === 'atrule' && n.name !== 'import'));
    const inLayer = topRules.every((n) => {
      if (n.type === 'atrule' && n.name === 'layer' && n.params === 'ag.a11y') return true;
      // line-1 LAYER_ORDER_STATEMENT (params list several layers) is allowed
      if (n.type === 'atrule' && n.name === 'layer' && n.params.includes(',')) return true;
      if (n.type === 'atrule' && ['media', 'supports'].includes(n.name)) {
        return (n.nodes ?? []).every((c) => c.type === 'atrule' && c.name === 'layer' && c.params === 'ag.a11y'
          || (c.nodes ?? []).every((cc) => cc.type === 'rule' || cc.type === 'atrule'));
      }
      return false;
    });
    if (!inLayer) add(rel, 1, RULE('layer-order'), 'rung rules must live inside @layer ag.a11y');
  }

  root.walkComments((c) => { /* comments carry no declarations */ });
  root.walkDecls((decl) => {
    if (decl.important) {
      add(rel, decl.source?.start?.line ?? 1, RULE('no-important'), `!important on ${decl.prop}`);
    }
    if (decl.prop === '--_ag-tint-floor' && !/generated[\\/]floors\.css$/.test(rel)) {
      if (/^\s*\d+(?:\.\d+)?\s*$/.test(decl.value)) {
        add(rel, decl.source?.start?.line ?? 1, RULE('no-handwritten-floor'), `literal --_ag-tint-floor: ${decl.value}`);
      }
    }
    // REQ-FIN-05: --_ag-tint-floor may never take a numeric var() fallback, on
    // any prop — tint floors come from generated floors.css only
    if (!/generated[\\/]floors\.css$/.test(rel)
        && /var\(\s*--_ag-tint-floor[a-zA-Z0-9-]*[^)]*,\s*\d/.test(decl.value)) {
      add(rel, decl.source?.start?.line ?? 1, RULE('no-numeric-floor-fallback'), `numeric var() fallback for --_ag-tint-floor* in ${decl.prop}: ${decl.value}`);
    }
    // collect var() refs for the undefined --_ag-* / --ag-* checks
    for (const m of decl.value.matchAll(/var\(\s*(--_?ag-[a-zA-Z0-9-]+)\s*(,)?/g)) {
      varRefs.push({ rel, line: decl.source?.start?.line ?? 1, name: m[1], hasFallback: Boolean(m[2]), enforced });
      if (m[2] && GENERATED_FLOOR_READS.has(m[1]) && !/[\\/]generated[\\/]/.test(rel)) {
        add(rel, decl.source?.start?.line ?? 1, RULE('no-numeric-floor-fallback'), `var(${m[1]}, …) — the compiler emits ${m[1]}; read it without a fallback`);
      }
    }
    if (decl.prop.startsWith('--_ag-')) declVars.add(decl.prop);
  });
  root.walkAtRules('property', (at) => {
    if (at.params.trim().startsWith('--_ag-')) declVars.add(at.params.trim());
  });

  root.walkAtRules((at) => {
    if (/prefers-contrast\s*:\s*high/i.test(at.params)) {
      add(rel, at.source?.start?.line ?? 1, RULE('no-prefers-contrast-high'), "'prefers-contrast: high' never matches — use 'more'");
    }
  });

  root.walkRules((rule) => {
    const line = rule.source?.start?.line ?? 1;
    const sel = rule.selector ?? '';
    const insideA11yLayer = isRungFile || ancestorsInLayer(rule, 'ag.a11y');

    selectorParser((sp) => {
      sp.each((complexSel) => {
        const selText = complexSel.toString();
        const [spec, bare] = specOf(complexSel);
        // (0,2,0) max; element slot may only carry pseudo-elements
        if (enforced && (spec[0] > 0 || spec[1] > 2 || bare.length > 0)) {
          add(rel, line, RULE('max-specificity'), `selector '${selText.slice(0, 80)}' exceeds (0,2,0) (${spec.join(',')})`);
        }
        if (enforced) {
          for (const el of bare) {
            add(rel, line, RULE('no-global-element-selectors'), `bare element '${el}' in '${selText.slice(0, 80)}'`);
          }
        }
        if (insideA11yLayer && enforced) {
          const hasDataAg = /\[data-ag-/.test(selText);
          const isRoot = /^\s*:root\b/.test(selText);
          const isHtmlLocked = /^html\[data-ag-/.test(selText);
          if (!hasDataAg && !isRoot && !isHtmlLocked) {
            add(rel, line, RULE('a11y-selectors-keyed-on-data-ag-surface'), `selector '${selText.slice(0, 80)}' not keyed on data-ag-*`);
          }
        }
      });
    }).processSync(sel);

    // declaration-context rules
    if (/focus-visible|aria-disabled|\[data-disabled\]/.test(sel)) {
      rule.walkDecls((decl) => {
        if (/^outline(-style|-width|-color)?$/.test(decl.prop) && /^(none|0\b)/.test(decl.value)) {
          add(rel, line, RULE('no-outline-none-focus'), `${decl.prop}: ${decl.value} inside '${sel.slice(0, 60)}'`);
        }
      });
    }
    if (/\[aria-disabled|\[data-disabled\]|:disabled/.test(sel)) {
      rule.walkDecls((decl) => {
        if (decl.prop === 'opacity') {
          add(rel, line, RULE('no-host-opacity-on-disabled'), `opacity on disabled host '${sel.slice(0, 60)}'`);
        }
      });
    }
  });
};

const ancestorsInLayer = (node, layer) => {
  let p = node.parent;
  while (p) {
    if (p.type === 'atrule' && p.name === 'layer' && p.params === layer) return true;
    p = p.parent;
  }
  return false;
};

/* ---------- focus-outline-none count ---------- */
const countFocusOutlineNone = () => {
  let n = 0;
  const scanDir = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) scanDir(p);
      else if (/\.(tsx?|jsx?|css)$/.test(e.name)) {
        const hits = fs.readFileSync(p, 'utf8').match(/focus(?::|-visible:)outline-none/g);
        if (hits) n += hits.length;
      }
    }
  };
  scanDir('src');
  return n;
};

/* ---------- producers for the undefined-var checks ---------- */
const TOKEN_MANIFEST = 'src/tokens/generated/manifest.ts';
const tokenBuildVars = () => {
  const p = path.join(ROOT, TOKEN_MANIFEST);
  if (!fs.existsSync(p)) return new Set();
  return new Set([...fs.readFileSync(p, 'utf8').matchAll(/"cssVar":\s*"(--[a-zA-Z0-9_-]+)"/g)].map((m) => m[1]));
};
/* every --_ag-* that src/ produces: css declarations / @property anywhere under
   src (not just the enforced dirs), plus JS writes as an object key
   ('--_ag-x': …) or setProperty('--_ag-x', …). src/contracts (name lists) and
   tests are not producers. */
const srcProducers = () => {
  const out = new Set();
  const visit = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      const rel = path.relative(ROOT, p).replace(/\\/g, '/');
      if (e.isDirectory()) {
        if (e.name === '__tests__' || e.name === 'node_modules' || rel === 'src/contracts') continue;
        visit(p);
        continue;
      }
      if (/\.(test|spec|stories)\.[jt]sx?$/.test(e.name)) continue;
      const text = /\.(css|scss|[jt]sx?)$/.test(e.name) ? fs.readFileSync(p, 'utf8') : null;
      if (text == null) continue;
      if (/\.(css|scss)$/.test(e.name)) {
        const body = text.replace(/\/\*[\s\S]*?\*\//g, '');
        for (const m of body.matchAll(/(?:^|[;{\s])(--_ag-[a-zA-Z0-9-]+)\s*:/g)) out.add(m[1]);
        for (const m of body.matchAll(/@property\s+(--_ag-[a-zA-Z0-9-]+)/g)) out.add(m[1]);
      } else {
        for (const m of text.matchAll(/['"`](--_ag-[a-zA-Z0-9-]+)['"`]\s*:/g)) out.add(m[1]);
        for (const m of text.matchAll(/setProperty\(\s*['"`](--_ag-[a-zA-Z0-9-]+)['"`]/g)) out.add(m[1]);
      }
    }
  };
  visit(path.join(ROOT, 'src'));
  return out;
};

const undefinedVarChecks = () => {
  const tokens = tokenBuildVars();
  const produced = srcProducers();
  for (const r of varRefs) {
    if (!r.enforced) continue;
    if (r.name.startsWith('--_ag-')) {
      if (!declVars.has(r.name) && !produced.has(r.name) && !tokens.has(r.name)) {
        add(r.rel, r.line, RULE('no-undefined-ag-var'), `var(${r.name}) has no producer (no css declaration/@property under src, no token-build cell in ${TOKEN_MANIFEST}, no JS write)`);
      }
    } else if (!r.hasFallback && (SRC || A11Y_CSS.test(r.rel)) && !tokens.has(r.name)) {
      add(r.rel, r.line, RULE('no-undefined-ag-token'), `var(${r.name}) has no fallback and is not emitted by the token build (${TOKEN_MANIFEST})`);
    }
  }
};

const loadCssBaseline = () => {
  const rows = fs.existsSync(CSS_BASELINE) ? JSON.parse(fs.readFileSync(CSS_BASELINE, 'utf8')) : [];
  return { rows, problems: rowProblems(rows, { gate: 'verify-a11y-css' }) };
};

const main = () => {
  const files = WATCH_DIRS.flatMap((d) => walk(d));
  const scanned = new Set();
  for (const f of files) {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    const enforced = ALL_ENFORCED
      || ENFORCED_DIRS.some((d) => rel === d || rel.startsWith(d + '/'));
    if (/\.(css|scss)$/.test(f)) { scanCss(rel, fs.readFileSync(f, 'utf8'), enforced); scanned.add(rel); }
  }
  // REQ-FIN-05: undefined --_ag-* refs and fallback-less undefined --ag-* refs
  undefinedVarChecks();

  const { rows: cssBaseline, problems } = loadCssBaseline();
  const baselinedFiles = new Set(cssBaseline.map((b) => b.file));

  if (SRC) {
    // per-file focus:outline-none count (fixture-driven; CI uses the baseline below)
    for (const f of files) {
      const rel = path.relative(ROOT, f).replace(/\\/g, '/');
      const hits = fs.readFileSync(f, 'utf8').match(/focus(?::|-visible:)outline-none/g);
      if (hits && hits.length > 0) {
        add(rel, 1, RULE('focus-outline-none-count'), `${hits.length} focus:outline-none occurrence(s)`);
      }
    }
    // the integration baseline applies to the real files it names; rows for
    // files outside this --src scan are neither applied nor checked for staleness
    const hard = violations.filter((v) => !baselinedFiles.has(v.file));
    for (const v of violations) console.log(`${baselinedFiles.has(v.file) ? 'BASELINED ' : ''}${v.file}:${v.line} ${v.rule} ${v.msg}`);
    const staleRows = cssBaseline.filter((b) => scanned.has(b.file) && !violations.some((v) => v.file === b.file));
    for (const s of staleRows) console.log(`FAIL stale baseline row: ${s.file} no longer offends — delete the row (owner ${s.owner})`);
    for (const m of problems) console.log(`FAIL ${m}`);
    console.log(`verify-a11y-css: ${violations.length} violation(s), ${files.length} css files scanned`);
    process.exit(hard.length > 0 || staleRows.length > 0 || problems.length > 0 ? 1 : 0);
  }
  const count = countFocusOutlineNone();
  let baseline = { count: 0 };
  if (fs.existsSync(BASELINE_PATH)) baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
  if (ENFORCE_ZERO && count > 0) {
    add(BASELINE_PATH, 1, RULE('focus-outline-none-count'), `--enforce-zero: ${count} occurrences in src`);
  } else if (count > (baseline.count ?? 0)) {
    add(BASELINE_PATH, 1, RULE('focus-outline-none-count'), `count ${count} exceeds baseline ${baseline.count} (decrease-only)`);
  } else {
    console.log(`verify-a11y-css: focus:outline-none count ${count} <= baseline ${baseline.count ?? 0}`);
  }

  // REQ-FIN-05/§4.3: violations on files carried in the integration baseline
  // ({file, owner, reqFin, expires}) pass with a BASELINED marker; a stale,
  // malformed or expired row fails — owners delete their rows in the same PR
  // that fixes the file.
  const hard = violations.filter((v) =>
    (ENFORCED_DIRS.some((d) => v.file.startsWith(d)) || v.file === BASELINE_PATH)
    && !baselinedFiles.has(v.file));
  for (const v of violations) {
    console.log(`${baselinedFiles.has(v.file) ? 'BASELINED ' : ''}${v.file}:${v.line} ${v.rule} ${v.msg}`);
  }
  const staleRows = cssBaseline.filter((b) => !violations.some((v) => v.file === b.file));
  for (const s of staleRows) {
    console.log(`FAIL stale baseline row: ${s.file} no longer offends — delete the row (owner ${s.owner})`);
  }
  for (const m of problems) console.log(`FAIL ${m}`);
  console.log(`verify-a11y-css: ${violations.length} violation(s), ${files.length} css files scanned, ${cssBaseline.length} baseline rows`);
  if (hard.length > 0 || staleRows.length > 0 || problems.length > 0) process.exit(1);
};

main();
