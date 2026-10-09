/* tests/dx/e2e-setup.mjs — PLAT-97 globalSetup: packs aura-glass,
   @auraglass/cli and @auraglass/registry once for the whole e2e suite.
   Writes .artifacts/e2e/pack-dir.json consumed by the spec. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, '.artifacts/e2e-pack');
export default async function globalSetup() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  execFileSync('node', [join(ROOT, 'scripts/registry/build.mjs')], { cwd: ROOT, stdio: 'inherit' });
  const pack = (dir) => {
    execFileSync('npm', ['pack', '--pack-destination', OUT], { cwd: dir, stdio: 'inherit' });
  };
  pack(ROOT);
  pack(join(ROOT, 'packages/cli'));
  pack(join(ROOT, 'packages/registry'));
  const tarballs = Object.fromEntries(
    readdirSync(OUT).filter((f) => f.endsWith('.tgz')).map((f) => [f.replace(/-\d+\.\d+\.\d+.*\.tgz$/, ''), join(OUT, f)]),
  );
  mkdirSync(join(ROOT, '.artifacts/e2e'), { recursive: true });
  writeFileSync(join(ROOT, '.artifacts/e2e/pack-dir.json'), JSON.stringify({ out: OUT, tarballs }, null, 2));
  console.log(`[e2e-setup] packed: ${Object.keys(tarballs).join(', ')}`);
}
