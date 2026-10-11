#!/usr/bin/env node
/* SURF-owned api-report wrapper (PROMPT-4e / SURF-645).
   scripts/build/api-report.mjs only maps manifest subpaths ('.','./material',...);
   the per-stream aggregate reports etc/api/{root,compat}.surf.* are generated
   here by bundling src/root/surf.ts and src/compat/surf/index.ts directly —
   the same esbuild pipeline the PLAT tool uses, pointed at our lane files.
   Usage: node scripts/surf/api-report.mjs [--entry root.surf|compat.surf|all] */
import { build } from 'esbuild';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

const arg = (n) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : null; };
const which = arg('entry') ?? 'all';

const TARGETS = {
  'root.surf': { source: 'src/root/surf.ts', label: 'aura-glass (root — SURF exports)' },
  'compat.surf': { source: 'src/compat/surf/index.ts', label: 'aura-glass/compat (SURF adapters)' },
  // lane W3: SURF-365 — the ./ai subpath report.
  'ai': { source: 'src/ai/index.ts', label: 'aura-glass ./ai' },
  // lane W4: SURF-513 — the ./media and ./backdrops subpath reports.
  'media': { source: 'src/media/index.ts', label: 'aura-glass ./media' },
  'backdrops': { source: 'src/backdrops/index.ts', label: 'aura-glass ./backdrops' },
};

for (const [entry, { source, label }] of Object.entries(TARGETS)) {
  if (which !== 'all' && which !== entry) continue;
  if (!existsSync(source)) {
    console.warn(`api-report.surf: ${source} absent — skipping ${entry}`);
    continue;
  }
  const res = await build({
    entryPoints: [source], bundle: true, write: false, format: 'esm', platform: 'node',
    external: ['react', 'react-dom', 'react-dom/*', 'react/*', 'clsx', '@base-ui/react', '@tanstack/*', 'aura-glass', 'aura-glass/*'],
    logLevel: 'silent',
  });
  const text = res.outputFiles[0].text;
  const m = /export\s*\{([^}]*)\}\s*;?\s*$/m.exec(text);
  const names = m?.[1]
    // `local as exported` → the exported name (esbuild renames colliding locals, e.g. TreeView2).
    ? m[1].split(',').map((s) => s.trim().replace(/^[\w$]+\s+as\s+/, '')).filter(Boolean).sort()
    : [];
  mkdirSync('etc/api', { recursive: true });
  writeFileSync(`etc/api/${entry}.exports.json`, JSON.stringify({ entry, exports: names }, null, 1) + '\n');
  writeFileSync(`etc/api/${entry}.api.md`,
    [`## API Report — ${label}`, '', ...names.map((n) => `- \`${n}\``), ''].join('\n'));
  console.log(`api-report.surf: wrote etc/api/${entry}.{exports.json,api.md} (${names.length} exports)`);
}
