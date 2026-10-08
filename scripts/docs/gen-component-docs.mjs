#!/usr/bin/env node
// gen-component-docs.mjs — PLAT-380. One generated doc page per exported
// component: name, subpath, props table, parts table. Only symbols present
// in build/exports.manifest.json get pages — never internal helpers.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GENERATED_DIR } from './paths.mjs';
import { collect } from './gen-props.mjs';
import { collectParts } from './gen-selectors.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const MANIFEST = join(ROOT, 'build/exports.manifest.json');

export function main() {
  if (!existsSync(MANIFEST)) { console.warn('exports.manifest.json missing — run npm run build first; pages pending'); return; }
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const props = collect(); const parts = collectParts();
  const dir = join(ROOT, GENERATED_DIR, 'components');
  mkdirSync(dir, { recursive: true });
  let n = 0;
  const EXPORT_RE = /export\s*\{([^}]+)\}|export\s+(?:const|class|function|interface|type)\s+(\w+)/g;
  for (const entry of [...manifest.entries].sort((a, b) => a.subpath.localeCompare(b.subpath))) {
    const srcPath = join(ROOT, entry.source ?? '');
    if (!entry.source || !existsSync(srcPath)) continue;
    const src = readFileSync(srcPath, 'utf8');
    const names = new Set();
    for (const m of src.matchAll(EXPORT_RE)) {
      if (m[2]) names.add(m[2]);
      else for (const part of m[1].split(',')) {
        const seg = part.trim().split(/\s+as\s+/).pop()?.trim();
        if (seg && /^[A-Z]/.test(seg)) names.add(seg); // components only — helpers/types get no page
      }
    }
    for (const name of names) {
      const slug = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      const propRows = props[`${name}Props`] ?? [];
      const partRows = parts[`cmp:${slug}`] ?? [];
      writeFileSync(join(dir, `${slug}.mdx`),
        `# ${name}\n\nImport: \`import { ${name} } from 'aura-glass${entry.subpath === '.' ? '' : entry.subpath}'\`\n\n` +
        (propRows.length ? `## Props\n\n| Prop | Type | Required |\n| --- | --- | --- |\n${propRows.map((r) => `| \`${r.name}\` | \`${r.type}\` | ${r.required ? 'yes' : 'no'} |`).join('\n')}\n` : '') +
        (partRows.length ? `## Parts\n\n${partRows.map((p) => `- \`${p}\``).join('\n')}\n` : ''));
      n++;
    }
  }
  console.log(`component docs: ${n} pages`);
}
if (process.argv[1]?.endsWith('gen-component-docs.mjs')) main();
