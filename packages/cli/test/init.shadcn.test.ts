/** PLAT-86: init reuses components.json aliases + css path; install wiring. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initCommand } from '../src/commands/init.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'aginit-shadcn-'));

describe('init (shadcn reuse)', () => {
  it('auraglass.json reuses components.json aliases and css path', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
      dependencies: { next: '15.0.0', react: '19.0.0' },
    }));
    fs.mkdirSync(path.join(dir, 'app'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'components.json'), JSON.stringify({
      aliases: { components: '@cn/components', utils: '@cn/lib' },
      css: 'app/custom.css',
    }));
    const code = await initCommand([], { cwd: dir, 'allow-no-git': true, 'no-install': true, silent: true });
    expect(code).toBe(0);
    const cfg = JSON.parse(fs.readFileSync(path.join(dir, 'auraglass.json'), 'utf8'));
    expect(cfg.aliases.components).toBe('@cn/components');
    expect(cfg.aliases.utils).toBe('@cn/lib');
    expect(cfg.css.global).toBe('app/custom.css');
  });
});
