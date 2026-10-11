/** REQ-PLAT-93: extract the packed aura-glass tarball to
 * tests/types/plat/vendor/aura-glass so tsconfig paths resolve its d.ts.
 * Exits 2 with 'pending' when no .artifacts/pack/aura-glass-5*.tgz exists
 * or when the pack has no dist/ (current alpha stub). */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..');
const PACK = path.join(REPO, '.artifacts', 'pack');
const DEST = path.join(HERE, 'vendor');
const tgz = fs.existsSync(PACK) ? fs.readdirSync(PACK).filter((f) => /^aura-glass-5.*\.tgz$/.test(f)).sort((a, b) => fs.statSync(path.join(PACK, b)).mtimeMs - fs.statSync(path.join(PACK, a)).mtimeMs)[0] : undefined;
if (!tgz) { console.log('ERROR: no .artifacts/pack/aura-glass-5*.tgz'); process.exit(1); }
fs.rmSync(DEST, { recursive: true, force: true });
fs.mkdirSync(DEST, { recursive: true });
execFileSync('tar', ['-xzf', path.join(PACK, tgz), '-C', DEST]);
fs.renameSync(path.join(DEST, 'package'), path.join(DEST, 'aura-glass'));
if (!fs.existsSync(path.join(DEST, 'aura-glass', 'dist', 'index.d.ts'))) {
  console.log('ERROR: packed tarball has no dist/index.d.ts');
  process.exit(1);
}
console.log('packed aura-glass extracted ->', path.join(DEST, 'aura-glass'));
