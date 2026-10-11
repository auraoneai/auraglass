/** PLAT-86: init on a fresh Next App Router fixture — exact file contents + idempotence. */
import { describe, expect, it } from '@jest/globals';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initCommand } from '../src/commands/init.js';
import { NEXT_GLOBALS_CSS } from '../src/init/transforms.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'aginit-next-'));
const shaTree = (dir: string): string => {
  const h = createHash('sha256');
  const walk = (d: string): void => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else { h.update(path.relative(dir, p)); h.update(fs.readFileSync(p)); }
    }
  };
  walk(dir);
  return h.digest('hex');
};

function nextFixture(): string {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
    dependencies: { next: '15.0.0', react: '19.0.0', 'react-dom': '19.0.0' },
  }, null, 2));
  fs.mkdirSync(path.join(dir, 'app'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'app', 'globals.css'), '@tailwind base;\n');
  fs.writeFileSync(path.join(dir, 'app', 'layout.tsx'),
    "export default function RootLayout({ children }: { children: React.ReactNode }) {\n" +
    "  return (\n    <html lang=\"en\">\n      <body>{children}</body>\n    </html>\n  );\n}\n");
  return dir;
}

describe('init (next app router)', () => {
  it('produces exact globals.css, layout.tsx, providers.tsx, auraglass.json; second run is no-changes + byte-identical', async () => {
    const t0 = Date.now();
    const dir = nextFixture();
    const code = await initCommand([], { cwd: dir, 'allow-no-git': true, 'no-install': true, silent: true });
    expect(code).toBe(0);

    /* globals.css: layer stmt + @import layer(ag) merged ahead of @tailwind */
    const css = fs.readFileSync(path.join(dir, 'app/globals.css'), 'utf8');
    expect(css.startsWith('@layer theme, base, ag, components, utilities;')).toBe(true);
    expect(css).toContain('@import "aura-glass/styles.css" layer(ag);');
    expect(css).toContain('@tailwind base;');
    expect(css.indexOf('aura-glass/styles.css')).toBeLessThan(css.indexOf('@tailwind base'));

    /* auraglass.json: full shape */
    const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'auraglass.json'), 'utf8'));
    expect(cfg.$schema).toContain('schema/auraglass');
    expect(cfg.registry).toBeTruthy();
    expect(cfg.aliases.components).toBe('@/components');
    expect(cfg.css.global).toBe('app/globals.css');
    expect(cfg.rsc).toBe(true);

    /* providers.tsx scaffold */
    const providers = fs.readFileSync(path.join(dir, 'app/providers.tsx'), 'utf8');
    expect(providers).toContain("'use client'");
    expect(providers).toContain("from 'aura-glass/theme'");
    expect(providers).toContain('AuraGlassProvider');

    /* layout.tsx: imports + <head> with first-child AuraGlassScript + Providers wrap */
    const layout = fs.readFileSync(path.join(dir, 'app/layout.tsx'), 'utf8');
    expect(layout).toMatch(/import \{ AuraGlassScript \} from 'aura-glass\/theme'/);
    expect(layout).toMatch(/import \{ Providers \} from '\.\/providers'/);
    expect(layout.indexOf('<AuraGlassScript')).toBeGreaterThan(-1);
    const headIdx = layout.indexOf('<head>');
    const scriptIdx = layout.indexOf('<AuraGlassScript');
    const bodyIdx = layout.indexOf('<body>');
    expect(headIdx).toBeGreaterThan(-1);
    expect(headIdx).toBeLessThan(scriptIdx);
    expect(scriptIdx).toBeLessThan(bodyIdx);
    expect(layout).toContain('<Providers>');
    expect(layout.indexOf('{children}')).toBeGreaterThan(layout.indexOf('<Providers>'));

    /* second run: 'no changes' + byte-identical tree */
    const before = shaTree(dir);
    const code2 = await initCommand([], { cwd: dir, 'allow-no-git': true, 'no-install': true, silent: true });
    expect(code2).toBe(0);
    expect(shaTree(dir)).toBe(before);

    expect(Date.now() - t0).toBeLessThan(2000);
  });

  it('fresh globals.css (absent file) is exactly the canonical NEXT_GLOBALS_CSS', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { next: '15.0.0', react: '19.0.0' } }));
    fs.mkdirSync(path.join(dir, 'app'), { recursive: true });
    const code = await initCommand([], { cwd: dir, 'allow-no-git': true, 'no-install': true, silent: true });
    expect(code).toBe(0);
    expect(fs.readFileSync(path.join(dir, 'app/globals.css'), 'utf8')).toBe(NEXT_GLOBALS_CSS);
  });

  it('layout with an existing <head> gets AuraGlassScript as first child', async () => {
    const dir = nextFixture();
    fs.writeFileSync(path.join(dir, 'app', 'layout.tsx'),
      "export default function RootLayout({ children }: { children: React.ReactNode }) {\n" +
      "  return (\n    <html lang=\"en\">\n      <head>\n        <meta name=\"x\" />\n      </head>\n      <body>{children}</body>\n    </html>\n  );\n}\n");
    await initCommand([], { cwd: dir, 'allow-no-git': true, 'no-install': true, silent: true });
    const layout = fs.readFileSync(path.join(dir, 'app/layout.tsx'), 'utf8');
    const headIdx = layout.indexOf('<head>');
    const metaIdx = layout.indexOf('<meta name="x"');
    const scriptIdx = layout.indexOf('<AuraGlassScript');
    expect(headIdx).toBeLessThan(scriptIdx);
    expect(scriptIdx).toBeLessThan(metaIdx);
  });
});
