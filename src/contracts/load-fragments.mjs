// src/contracts/load-fragments.mjs  (CONTRACT, verbatim; S-50). Node >= 20.19, esbuild from devDependencies.
import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join, basename, extname } from 'node:path';
import { build } from 'esbuild';
const STREAMS = ['plat', 'mat', 'cmp', 'surf', 'qual'];
/** @returns {Promise<Array<{ stream: string, file: string, value: unknown }>>} sorted by stream order, then file name */
export async function loadFragments(kind, root = process.cwd()) {
  const dir = join(root, 'fragments', kind);
  if (!existsSync(dir)) return [];
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    const stream = basename(name, extname(name));
    if (!STREAMS.includes(stream) || !['.ts', '.json'].includes(extname(name))) continue;
    const file = join(dir, name);
    if (extname(name) === '.json') { out.push({ stream, file, value: JSON.parse(readFileSync(file, 'utf8')) }); continue; }
    const res = await build({ entryPoints: [file], bundle: true, write: false, format: 'esm', platform: 'node', logLevel: 'silent' });
    const url = 'data:text/javascript;base64,' + Buffer.from(res.outputFiles[0].text).toString('base64');
    out.push({ stream, file, value: (await import(url)).default ?? [] });
  }
  return out.sort((a, b) => STREAMS.indexOf(a.stream) - STREAMS.indexOf(b.stream));
}
