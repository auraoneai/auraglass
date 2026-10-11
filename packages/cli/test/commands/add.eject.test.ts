/** add --source: ejects aura-glass-src/<slug>, rewrites imports to public
 *  subpaths, refuses T0 + forbidden literals + unresolved specifiers. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { addCommand } from '../../src/commands/add.js';
import { CliError } from '../../src/cli/errors.js';
import { parseArgs } from '../../src/cli/args.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));

/** A project with aura-glass "installed" (minimal exports map + package.json). */
function projectWithAura(): { dir: string; reg: string } {
  const dir = tmp();
  const nm = path.join(dir, 'node_modules', 'aura-glass');
  fs.mkdirSync(nm, { recursive: true });
  fs.writeFileSync(path.join(nm, 'package.json'), JSON.stringify({
    name: 'aura-glass',
    exports: { '.': {}, './components': {}, './theme': {}, './utils': {} },
  }));
  fs.writeFileSync(path.join(dir, 'auraglass.json'), JSON.stringify({ aliases: { components: 'components/aura' } }));
  const reg = fs.mkdtempSync(path.join(os.tmpdir(), 'agreg-'));
  return { dir, reg };
}
const srcItem = (slug: string, files: Array<{ path: string; content: string }>, extra: object = {}) => ({
  name: `aura-glass-src/${slug}`, type: 'registry:component', files, ...extra,
});

describe('add --source', () => {
  it('ejects Button into components/aura/button/ with resolved imports', async () => {
    const { dir, reg } = projectWithAura();
    fs.writeFileSync(path.join(reg, 'aura-glass-src', 'button.json').replace('aura-glass-src', ''), '{}'); /* placeholder cleanup below */
    /* fixture: item file is <reg>/<name>.json — name has a slash, so mkdir */
    fs.mkdirSync(path.join(reg, 'aura-glass-src'), { recursive: true });
    fs.writeFileSync(path.join(reg, 'aura-glass-src', 'button.json'), JSON.stringify(srcItem('button', [
      { path: 'Button.tsx', content: "import { useId } from '../../utils';\nexport const Button = () => null;\n" },
    ])));
    const code = await addCommand(['Button'], { cwd: dir, registry: reg, source: true, 'allow-no-git': true, json: true, silent: true });
    expect(code).toBe(0);
    const out = fs.readFileSync(path.join(dir, 'components', 'aura', 'button', 'Button.tsx'), 'utf8');
    expect(out).toContain("from 'aura-glass/utils'");
    expect(out).toContain('@auraglass/ejected');
  });

  it('refuses T0 surfaces (exit 1)', async () => {
    const { dir, reg } = projectWithAura();
    for (const slug of ['surface', 'surface-group', 'environment']) {
      const code = await addCommand([slug], { cwd: dir, registry: reg, source: true, 'allow-no-git': true, json: true, silent: true })
        .catch((e) => (e as CliError).code);
      expect(code).toBe(1);
    }
  });

  it('refuses forbidden literals (backdrop-filter / rgba( / #hex / blur()', async () => {
    const { dir, reg } = projectWithAura();
    fs.mkdirSync(path.join(reg, 'aura-glass-src'), { recursive: true });
    fs.writeFileSync(path.join(reg, 'aura-glass-src', 'leak.json'), JSON.stringify(srcItem('leak', [
      { path: 'leak.tsx', content: "const s = { backdropFilter: 'blur(8px)', color: '#fff' };\n" },
    ])));
    const code = await addCommand(['leak'], { cwd: dir, registry: reg, source: true, 'allow-no-git': true, json: true, silent: true })
      .catch((e) => (e as CliError).code);
    expect(code).toBe(1);
  });

  it('refuses imports that do not resolve through exports (exit 1)', async () => {
    const { dir, reg } = projectWithAura();
    fs.mkdirSync(path.join(reg, 'aura-glass-src'), { recursive: true });
    fs.writeFileSync(path.join(reg, 'aura-glass-src', 'bad.json'), JSON.stringify(srcItem('bad', [
      { path: 'bad.tsx', content: "import { x } from '../../secret-internal';\n" },
    ])));
    const code = await addCommand(['bad'], { cwd: dir, registry: reg, source: true, 'allow-no-git': true, json: true, silent: true })
      .catch((e) => (e as CliError).code);
    expect(code).toBe(1);
  });

  it('--eject flag still parses', () => {
    expect(parseArgs(['add', 'x', '--eject']).flags.eject).toBe(true);
  });
});
