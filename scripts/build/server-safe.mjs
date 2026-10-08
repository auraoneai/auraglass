/* server-safe.mjs — emits the server-safe exports record (PLAT-261).
   An export is server-safe when its module does not transitively import a file that
   starts with 'use client' or references DOM globals at module top level. */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, manifestEntries, importClosure } from './lib/graph.mjs';

const DOM_RE = /(^|\s)(document|window|navigator|HTMLElement|customElements|localStorage|sessionStorage)\s*[.(\[=]/;

export function generateServerSafeExports(root = ROOT) {
  const { js } = manifestEntries(root);
  const entries = [];
  for (const e of js) {
    const src = join(root, e.source);
    if (!existsSync(src)) { entries.push({ subpath: e.subpath, safe: false, reason: 'missing' }); continue; }
    let safe = true; let reason = '';
    for (const f of importClosure(src)) {
      const head = readFileSync(f, 'utf8').slice(0, 400);
      if (/^['"]use client['"]/.test(head.trimStart())) { safe = false; reason = f; break; }
      if (DOM_RE.test(head)) { safe = false; reason = f; break; }
    }
    entries.push({ subpath: e.subpath, safe, ...(reason ? { reason } : {}) });
  }
  return { version: 1, entries };
}
