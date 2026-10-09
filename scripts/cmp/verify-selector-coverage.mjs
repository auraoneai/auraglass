#!/usr/bin/env node
/* CMP-056: selector coverage. Parses each owned <Name>.css with an owned parser
   (postcss-selector-parser is not allowlisted) and evaluates every selector —
   pseudo-classes/elements stripped, @media/@container/@supports wrappers ignored —
   against rendered DOM. Fails on (a) selectors matching nothing and (b) classes
   the component never renders. Prints `file:line selector`.

   Modes:
     --css <file.css> --dom <rendered.html>      fixture/local mode (repeatable)
     --storybook <url|dir>                        remote lane: drives storybook-static
                                                 with playwright (remote only per
                                                 machine policy; never run locally).
                                                 A directory is served in-process.
                                                 With no --css args, every css file
                                                 under src/components is checked
                                                 against the union of all story
                                                 iframe DOMs.
     --out <dir>                                  also write report.txt + summary.json
*/
import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { extname, join, resolve, sep } from 'node:path';

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

function* walk(dir) {
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, d.name);
    if (d.isDirectory()) yield* walk(p);
    else yield p;
  }
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
    const target = argv[storybook + 1];
    const outIdx = argv.indexOf('--out');
    const outDir = outIdx !== -1 ? argv[outIdx + 1] : null;
    let server = null;
    let url = target;
    if (existsSync(target) && statSync(target).isDirectory()) {
      // Serve storybook-static in-process — zero-dependency static file server.
      const rootDir = resolve(target);
      const MIME = {
        '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
        '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
        '.png': 'image/png', '.woff2': 'font/woff2', '.map': 'application/json',
      };
      server = createServer((req, res) => {
        try {
          const p = join(rootDir, decodeURIComponent(new URL(req.url, 'http://x').pathname));
          if (!p.startsWith(rootDir + sep)) { res.writeHead(403); res.end(); return; }
          const file = statSync(p).isDirectory() ? join(p, 'index.html') : p;
          res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
          res.end(readFileSync(file));
        } catch {
          res.writeHead(404); res.end();
        }
      });
      await new Promise((r) => server.listen(0, '127.0.0.1', r));
      url = `http://127.0.0.1:${server.address().port}`;
    }
    const browser = await chromium.launch();
    const page = await browser.newPage();
    // Every story iframe's DOM, unioned — coverage is "renders somewhere".
    await page.goto(`${url.replace(/\/$/, '')}/index.json`);
    let storyIds = [];
    try {
      const index = await page.evaluate(() => document.body ? JSON.parse(document.body.innerText) : null);
      storyIds = Object.keys(index?.entries ?? index?.stories ?? {})
        .filter((id) => (index.entries?.[id]?.type ?? 'story') === 'story');
    } catch {
      storyIds = ['index'];
    }
    let dom = '';
    for (const id of storyIds) {
      await page.goto(`${url.replace(/\/$/, '')}/iframe.html?id=${id}`);
      dom += await page.content();
    }
    await browser.close();
    server?.close();
    const cssArgs = [];
    for (let i = 0; i < argv.length; i++) if (argv[i] === '--css') cssArgs.push(argv[i + 1]);
    const cssFiles = cssArgs.length ? cssArgs : walk('src/components').filter((f) => f.endsWith('.css'));
    let failures = 0;
    const misses = [];
    for (const f of cssFiles) {
      for (const m of checkPair(readFileSync(f, 'utf8'), dom, f)) {
        misses.push(m);
        failures++;
      }
    }
    for (const m of misses) console.log(m);
    console.log(`selector-coverage: ${cssFiles.length} css files, ${storyIds.length} stories, ${failures} misses`);
    if (outDir) {
      mkdirSync(outDir, { recursive: true });
      writeFileSync(join(outDir, 'report.txt'), misses.join('\n') + '\n');
      writeFileSync(join(outDir, 'summary.json'), JSON.stringify({ cssFiles: cssFiles.length, stories: storyIds.length, misses: failures }, null, 2));
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
