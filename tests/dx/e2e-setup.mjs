/* tests/dx/e2e-setup.mjs — PLAT-97 globalSetup: packs aura-glass,
   @auraglass/cli and @auraglass/registry once for the whole e2e suite.
   Writes .artifacts/e2e/pack-dir.json consumed by the spec. */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, '.artifacts/e2e-pack');
export default async function globalSetup() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  execFileSync('node', [join(ROOT, 'scripts/registry/build.mjs')], { cwd: ROOT, stdio: 'inherit' });
  // Exercise discovered items locally without marking them release-certified.
  const fixtureRegistry = join(ROOT, '.artifacts/e2e/registry');
  mkdirSync(fixtureRegistry, { recursive: true });
  const index = JSON.parse(readFileSync(join(ROOT, 'registry/registry.json'), 'utf8'));
  for (const item of index.items) writeFileSync(join(fixtureRegistry, `${item.name}.json`), JSON.stringify(item));
  const tarballs = {};
  const pack = (dir) => {
    const result = JSON.parse(execFileSync('npm', ['pack', '--json', '--pack-destination', OUT], { cwd: dir, encoding: 'utf8' }));
    const item = Array.isArray(result) ? result[0] : result.filename ? result : Object.values(result)[0];
    if (!item?.name || !item?.filename) throw new Error('npm pack returned invalid metadata');
    tarballs[item.name] = join(OUT, item.filename);
  };
  pack(ROOT);
  pack(join(ROOT, 'packages/cli'));
  pack(join(ROOT, 'packages/registry'));
  mkdirSync(join(ROOT, '.artifacts/e2e'), { recursive: true });
  writeFileSync(join(ROOT, '.artifacts/e2e/pack-dir.json'), JSON.stringify({ out: OUT, tarballs, fixtureRegistry }, null, 2));
  console.log(`[e2e-setup] packed: ${Object.keys(tarballs).join(', ')}`);
}
