/** PLAT-86: init on a Vite fixture — main.tsx ordering + index.html prepaint. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initCommand } from '../src/commands/init.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'aginit-vite-'));

function viteFixture(): string {
  const dir = tmp();
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
    dependencies: { react: '19.0.0', 'react-dom': '19.0.0' },
    devDependencies: { vite: '^6.0.0' },
  }, null, 2));
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'src', 'main.tsx'),
    "import { StrictMode } from 'react';\n" +
    "import { createRoot } from 'react-dom/client';\n" +
    "import './index.css';\n" +
    "import App from './App';\n\n" +
    "createRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n);\n");
  fs.writeFileSync(path.join(dir, 'src', 'index.css'), '@tailwind base;\n');
  fs.writeFileSync(path.join(dir, 'index.html'),
    '<!doctype html>\n<html lang="en">\n  <head>\n    <title>t</title>\n  </head>\n  <body><div id="root"></div></body>\n</html>\n');
  return dir;
}

describe('init (vite)', () => {
  it('main.tsx has the styles import before ./index.css and wraps <App/>', async () => {
    const dir = viteFixture();
    const code = await initCommand([], { cwd: dir, 'allow-no-git': true, 'no-install': true, silent: true });
    expect(code).toBe(0);
    const main = fs.readFileSync(path.join(dir, 'src/main.tsx'), 'utf8');
    expect(main).toContain("import 'aura-glass/styles.css';");
    expect(main.indexOf('aura-glass/styles.css')).toBeLessThan(main.indexOf("'./index.css'"));
    expect(main).toContain('AuraGlassProvider');
    const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    expect(html).toContain('__agP');
    expect(html.indexOf('__agP')).toBeLessThan(html.indexOf('</head>'));
  });

  it('second run writes nothing (idempotent)', async () => {
    const dir = viteFixture();
    await initCommand([], { cwd: dir, 'allow-no-git': true, 'no-install': true, silent: true });
    const main1 = fs.readFileSync(path.join(dir, 'src/main.tsx'), 'utf8');
    const html1 = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
    await initCommand([], { cwd: dir, 'allow-no-git': true, 'no-install': true, silent: true });
    expect(fs.readFileSync(path.join(dir, 'src/main.tsx'), 'utf8')).toBe(main1);
    expect(fs.readFileSync(path.join(dir, 'index.html'), 'utf8')).toBe(html1);
  });
});
