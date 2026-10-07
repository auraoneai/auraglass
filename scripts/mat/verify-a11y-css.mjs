#!/usr/bin/env node
/* MAT-255 (A11Y-011): PostCSS gate over the a11y rungs. Rules:
     layer-order                      — rung files put all rules inside @layer ag.a11y
     no-important                     — zero !important
     max-specificity                  — (0,2,0) max; pseudo-elements allowed in the element slot
     no-prefers-contrast-high         — 'prefers-contrast: high' never matches (legacy trap)
     no-handwritten-floor             — --_ag-tint-floor takes a numeric literal only in generated floors.css
     no-outline-none-focus            — outline:none/0 on :focus-visible or aria-disabled
     no-global-element-selectors      — no bare element selectors (pseudo-elements and :root allowed)
     no-host-opacity-on-disabled      — no opacity on the disabled surface host
     a11y-selectors-keyed-on-data-ag-surface — every selector inside ag.a11y is keyed on data-ag-* (or :root)
     focus-outline-none-count         — focus:outline-none occurrences vs scripts/ci/a11y-baselines/focus-outline-none.json (decrease-only; --enforce-zero at beta)
   Enforces on src/a11y, src/theme, src/material; ratchets elsewhere.
   Prints `file:line rule message` per violation; exit 1 on any enforced-scope
   violation or a baseline increase. */
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';

const ROOT = process.cwd();
const ENFORCED_DIRS = ['src/a11y', 'src/theme', 'src/material'];
const A11Y_CSS = /(?:^|\/)src\/a11y\/css\/[^/]+\.css$/;
const BASELINE_PATH = 'scripts/ci/a11y-baselines/focus-outline-none.json';
const ENFORCE_ZERO = process.argv.includes('--enforce-zero');
const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
const SRC = arg('src');                    // scan a single dir (fixture tests)
const ALL_ENFORCED = process.argv.includes('--all-enforced');
const WATCH_DIRS = SRC ? [SRC] : [...ENFORCED_DIRS];

const violations = [];
const add = (file, line, rule, msg) => violations.push({ file, line, rule, msg });

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

const main = () => {
  const files = WATCH_DIRS.flatMap((d) => walk(d));
  for (const f of files) {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    const enforced = ALL_ENFORCED
      || ENFORCED_DIRS.some((d) => rel === d || rel.startsWith(d + '/'));
    if (/\.(css|scss)$/.test(f)) scanCss(rel, fs.readFileSync(f, 'utf8'), enforced);
  }

  if (SRC) {
    // per-file focus:outline-none count (fixture-driven; CI uses the baseline below)
    for (const f of files) {
      const rel = path.relative(ROOT, f).replace(/\\/g, '/');
      const hits = fs.readFileSync(f, 'utf8').match(/focus(?::|-visible:)outline-none/g);
      if (hits && hits.length > 0) {
        add(rel, 1, RULE('focus-outline-none-count'), `${hits.length} focus:outline-none occurrence(s)`);
      }
    }
    for (const v of violations) console.log(`${v.file}:${v.line} ${v.rule} ${v.msg}`);
    console.log(`verify-a11y-css: ${violations.length} violation(s), ${files.length} css files scanned`);
    process.exit(violations.length > 0 ? 1 : 0);
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

  const hard = violations.filter((v) => ENFORCED_DIRS.some((d) => v.file.startsWith(d)) || v.file === BASELINE_PATH);
  for (const v of violations) console.log(`${v.file}:${v.line} ${v.rule} ${v.msg}`);
  console.log(`verify-a11y-css: ${violations.length} violation(s), ${files.length} css files scanned`);
  if (hard.length > 0) process.exit(1);
};

main();
