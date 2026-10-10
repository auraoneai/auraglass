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
    // Remote-only lane (PRD-F §12 rule 6): outside the remote runner, exit 2 with
    // the command that runs it remotely instead of driving a browser on the host.
    if (process.env.AG_REMOTE_RUNNER !== '1') {
      console.error(
        'verify-selector-coverage --storybook runs only on the remote runner (AG_REMOTE_RUNNER=1).\n' +
          'Remote: GitLab job cmp:test:selectors (ci/cmp.gitlab-ci.yml), which runs\n' +
          '  node scripts/cmp/verify-selector-coverage.mjs --storybook storybook-static --out .artifacts/cmp/test-selectors/',
      );
      process.exit(2);
    }
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
          if (p !== rootDir && !p.startsWith(rootDir + sep)) { res.writeHead(403); res.end(); return; }
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
    const base = url.replace(/\/$/, '');
    const report = (lines, summary, code) => {
      for (const l of lines) console.log(l);
      console.log(
        `selector-coverage: ${summary.cssFiles} css files, ${summary.stories} stories, ` +
          `${summary.renderErrors} render errors, ${summary.misses} misses`,
      );
      if (outDir) {
        mkdirSync(outDir, { recursive: true });
        writeFileSync(join(outDir, 'report.txt'), lines.join('\n') + '\n');
        writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
      }
      server?.close();
      process.exit(code);
    };
    // Story ids come from storybook's index.json; an unreadable or empty index
    // fails closed (no fallback story list).
    let storyIds;
    try {
      const res = await fetch(`${base}/index.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const index = await res.json();
      const entries = index.entries ?? index.stories ?? {};
      storyIds = Object.keys(entries).filter((id) => (entries[id]?.type ?? 'story') === 'story');
    } catch (err) {
      report([`index.json unreadable at ${base}/index.json: ${err.message}`], { cssFiles: 0, stories: 0, renderErrors: 1, misses: 0 }, 1);
    }
    if (storyIds.length === 0) {
      report([`index.json at ${base}/index.json lists 0 stories`], { cssFiles: 0, stories: 0, renderErrors: 1, misses: 0 }, 1);
    }
    const browser = await chromium.launch();
    const page = await browser.newPage();
    // Every story iframe's DOM, unioned — coverage is "renders somewhere". A
    // story that never mounts into #storybook-root is a render error, not skipped.
    let dom = '';
    const renderErrors = [];
    for (const id of storyIds) {
      try {
        await page.goto(`${base}/iframe.html?id=${encodeURIComponent(id)}&viewMode=story`, { waitUntil: 'load' });
        await page.waitForSelector('#storybook-root > *, #root > *', { state: 'attached', timeout: 15000 });
        dom += await page.content();
      } catch (err) {
        renderErrors.push(`story ${id}: did not render (${String(err.message).split('\n')[0]})`);
      }
    }
    await browser.close();
    const cssArgs = [];
    for (let i = 0; i < argv.length; i++) if (argv[i] === '--css') cssArgs.push(argv[i + 1]);
    // CMP-owned css only: the SURF dirs under src/components (PRD-F §6) are
    // covered by SURF's own lane, not this one.
    const SURF_DIRS = ['tabs', 'tab-bar', 'breadcrumbs', 'pagination', 'command-palette', 'source-transition', 'timeline'];
    const cssFiles = cssArgs.length
      ? cssArgs
      : [...walk('src/components')]
          .filter((f) => f.endsWith('.css'))
          .filter((f) => !SURF_DIRS.includes(f.split(sep)[2]))
          .sort();
    const misses = [];
    for (const f of cssFiles) misses.push(...checkPair(readFileSync(f, 'utf8'), dom, f));
    report(
      [...renderErrors, ...misses],
      { cssFiles: cssFiles.length, stories: storyIds.length, renderErrors: renderErrors.length, misses: misses.length },
      renderErrors.length || misses.length ? 1 : 0,
    );
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
