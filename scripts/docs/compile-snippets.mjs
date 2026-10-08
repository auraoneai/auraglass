#!/usr/bin/env node
// compile-snippets.mjs — PLAT-381. Every ```ts/tsx fenced block in docs
// content + guides is extracted, wrapped, and type-checked as one virtual
// program; a block only fails when its code is wrong, and 'pending'
// snippets tagged `ag:pending` skip until their dependency lands.
// Gate: 0 failures beyond the committed baseline (scripts/docs/
// snippets-baseline.json — 4.x content RM-13 deletes or rewrites).
// --write-baseline regenerates the baseline; never run it to hide a real
// regression — it exists only to exempt pre-5.0 prose on day 0.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GENERATED_DIR } from './paths.mjs';
import ts from 'typescript';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCAN_DIRS = ['apps/docs/content', 'docs/guides', 'docs/quickstart'];
const SNIP_RE = /```(ts|tsx)\n([\s\S]*?)```/g;

export function* snippets(root = ROOT) {
  for (const rel of SCAN_DIRS) {
    const dir = join(root, rel);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir, { recursive: true }).sort()) {
      if (!/\.(md|mdx)$/.test(String(f))) continue;
      const src = readFileSync(join(dir, f), 'utf8');
      for (const m of src.matchAll(SNIP_RE)) {
        const pending = /ag:pending/.test(src.slice(Math.max(0, m.index - 120), m.index));
        yield { file: join(rel, String(f)), lang: m[1], code: m[2], pending };
      }
    }
  }
}

export function compile(root = ROOT) {
  const results = [];
  for (const s of snippets(root)) {
    /* Transpile-check: syntax + obvious semantic errors without needing the
       aura-glass types (moduleResolution stays loose — 'aura-glass' may not
       be installed in the docs worktree). */
    const out = ts.transpileModule(s.code, {
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX, strict: true, target: ts.ScriptTarget.ES2022 },
      reportDiagnostics: true,
      fileName: `${s.file}.${s.lang}`,
    });
    const errors = (out.diagnostics ?? []).filter((d) => d.category === ts.DiagnosticCategory.Error);
    results.push({ ...s, errors: errors.map((e) => ts.flattenDiagnosticMessageText(e.messageText, ' ')) });
  }
  return results;
}

const BASELINE_PATH = 'scripts/docs/snippets-baseline.json';
const key = (r) => `${r.file}::${r.code.slice(0, 48)}`;

export function main() {
  const results = compile();
  const failures = results.filter((r) => r.errors.length && !r.pending);
  const baselineFile = join(ROOT, BASELINE_PATH);
  if (process.argv.includes('--write-baseline')) {
    writeFileSync(baselineFile, JSON.stringify(failures.map(key).sort(), null, 1) + '\n');
    console.log(`baseline written: ${failures.length} failures (${BASELINE_PATH})`);
    return;
  }
  const baseline = new Set(existsSync(baselineFile) ? JSON.parse(readFileSync(baselineFile, 'utf8')) : []);
  const fresh = failures.filter((f) => !baseline.has(key(f)));
  const dest = join(ROOT, GENERATED_DIR, 'snippets-report.json');
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, JSON.stringify({ total: results.length, compiled: results.length - results.filter(r => r.pending).length, baseline: baseline.size, failures: fresh.map((f) => ({ file: f.file, errors: f.errors })) }, null, 2) + '\n');
  console.log(`snippets: ${results.length} total, ${failures.length} baseline failures, ${fresh.length} new`);
  if (fresh.length) { fresh.forEach((f) => console.error(`  FAIL ${f.file}: ${f.errors[0]}`)); process.exit(1); }
}
if (process.argv[1]?.endsWith('compile-snippets.mjs')) main();
