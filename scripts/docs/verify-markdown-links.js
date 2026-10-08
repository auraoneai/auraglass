#!/usr/bin/env node
// verify-markdown-links.js — PLAT-382. Every relative link/image target in
// docs markdown must resolve on disk; matching is CASE-SENSITIVE via
// fs.realpathSync.native so links that only work on macOS fail here.
import { readdirSync, readFileSync, existsSync, realpathSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SCAN_DIRS = ['apps/docs/content', 'docs/guides', 'docs/quickstart', 'docs/release'];
const LINK_RE = /!?\[[^\]]*\]\(([^)\s#]+)(#[^)]*)?\)/g;

function* mdFiles(dir) {
  if (!existsSync(dir)) return;
  for (const f of readdirSync(dir, { recursive: true })) {
    if (/\.(md|mdx)$/.test(String(f))) yield join(dir, String(f));
  }
}
/* true when the path exists AND its real casing matches what was written. */
function realCase(path) {
  try { return realpathSync.native(path) === resolve(path); } catch { return false; }
}

export function main() {
  const bad = [];
  for (const rel of SCAN_DIRS) {
    for (const file of mdFiles(join(ROOT, rel))) {
      const src = readFileSync(file, 'utf8');
      for (const m of src.matchAll(LINK_RE)) {
        const target = m[1];
        if (/^(https?:|mailto:|#|\/)/.test(target)) continue;
        const p = resolve(dirname(file), target.replace(/%20/g, ' '));
        if (!existsSync(p) || !realCase(p)) bad.push(`${file}: ${target}`);
      }
    }
  }
  if (bad.length) { bad.forEach((b) => console.error(`  FAIL ${b}`)); console.error(`markdown links: ${bad.length} broken`); process.exitCode = 1; return bad; }
  console.log('markdown links: all resolve (case-sensitive)');
  return bad;
}
main();
