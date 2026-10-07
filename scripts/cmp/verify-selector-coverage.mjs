#!/usr/bin/env node
/* CMP-056: selector coverage. Parses each owned <Name>.css with an owned parser
   (postcss-selector-parser is not allowlisted) and evaluates every selector —
   pseudo-classes/elements stripped, @media/@container/@supports wrappers ignored —
   against rendered DOM. Fails on (a) selectors matching nothing and (b) classes
   the component never renders. Prints `file:line selector`.

   Modes:
     --css <file.css> --dom <rendered.html>      fixture/local mode (repeatable)
     --storybook <url>                            remote lane: drives storybook-static
                                                 with playwright (remote only per
                                                 machine policy; never run locally)
*/
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const PSEUDO = /:{1,2}[a-zA-Z-]+(?:\([^)]*\))?/g;

/* Owned parser: returns [{line, raw, selector, classes:[], attrs:[]}] for every
   style-rule selector; at-rule headers skipped but their inner rules kept;
   keyframe selectors dropped. */
export function* extractSelectors(css, file = '<css>') {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let line = 1;
  let i = 0;
  const stack = [];
  while (i < noComments.length) {
    const open = noComments.indexOf('{', i);
    if (open === -1) break;
    const pre = noComments.slice(i, open);
    line += (noComments.slice(i, open).match(/\n/g) || []).length;
    let depth = 1;
    let j = open + 1;
    while (j < noComments.length && depth > 0) {
      if (noComments[j] === '{') depth++;
      else if (noComments[j] === '}') depth--;
      j++;
    }
    const body = noComments.slice(open + 1, j - 1);
    const head = pre.slice(pre.lastIndexOf('}') + 1).trim();
    const at = head.match(/^@([\w-]+)/)?.[1];
    if (at === 'keyframes' || at === 'font-face') {
      i = j;
      continue;
    }
    if (at) {
      stack.push(at);
      i = open + 1;
      continue;
    }
    if (!head) {
      i = j;
      continue;
    }
    for (const sel of head.split(',')) {
      const cleaned = sel.trim().replace(PSEUDO, '').trim();
      if (!cleaned) continue;
      const classes = [...cleaned.matchAll(/\.(-?[_a-zA-Z][-_a-zA-Z0-9]*)/g)].map((m) => m[1]);
      const attrs = [...cleaned.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]);
      yield { file, line, raw: sel.trim(), selector: cleaned, classes, attrs };
    }
    i = j;
  }
}

/* A selector is covered when every class token and attribute it uses appears in
   the rendered DOM text. */
export function selectorCovered({ classes, attrs }, dom) {
  for (const c of classes) {
    if (!new RegExp(`class="[^"]*\\b${escapeRe(c)}\\b`).test(dom) && !dom.includes(`class="${c}"`)) {
      return false;
    }
  }
  for (const a of attrs) {
    const name = a.split('=')[0].trim();
    if (!dom.includes(name)) return false;
  }
  return classes.length + attrs.length > 0 || false;
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function checkPair(cssText, domText, file) {
  const misses = [];
  const seenClasses = new Set();
  for (const sel of extractSelectors(cssText, file)) {
    sel.classes.forEach((c) => seenClasses.add(c));
    if (!selectorCovered(sel, domText)) misses.push(`${sel.file}:${sel.line} ${sel.raw}`);
  }
  const orphanClasses = [...seenClasses].filter(
    (c) => !new RegExp(`class="[^"]*\\b${escapeRe(c)}\\b`).test(domText) && !domText.includes(`class="${c}"`),
  );
  for (const c of orphanClasses) misses.push(`${file}:0 class .${c} never rendered`);
  return misses;
}

async function main() {
  const argv = process.argv.slice(2);
  const storybook = argv.indexOf('--storybook');
  if (storybook !== -1) {
    // Remote-only lane: drives storybook-static; never executed locally.
    const require2 = createRequire(import.meta.url);
    let chromium;
    try {
      ({ chromium } = require2('playwright'));
    } catch {
      console.error('playwright unavailable — --storybook mode runs only in the remote lane');
      process.exit(2);
    }
    const url = argv[storybook + 1];
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`${url.replace(/\/$/, '')}/iframe.html?id=index`);
    const dom = await page.content();
    await browser.close();
    let failures = 0;
    for (let i = 0; i < argv.length; i++) {
      if (argv[i] === '--css') {
        const css = readFileSync(argv[i + 1], 'utf8');
        for (const m of checkPair(css, dom, argv[i + 1])) {
          console.log(m);
          failures++;
        }
      }
    }
    process.exit(failures ? 1 : 0);
  }
  let failures = 0;
  const pairs = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--css') pairs.push({ css: argv[i + 1], dom: null });
    if (argv[i] === '--dom' && pairs.length) pairs[pairs.length - 1].dom = argv[i + 1];
  }
  for (const p of pairs) {
    if (!p.dom) {
      console.log(`${p.css}:0 no --dom paired`);
      failures++;
      continue;
    }
    for (const m of checkPair(readFileSync(p.css, 'utf8'), readFileSync(p.dom, 'utf8'), p.css)) {
      console.log(m);
      failures++;
    }
  }
  process.exit(failures ? 1 : 0);
}

if (process.argv[1] && process.argv[1].endsWith('verify-selector-coverage.mjs')) {
  await main();
}
