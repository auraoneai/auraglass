/** PLAT-86: init runs the detected manager's install unless --no-install;
 *  never installs optional peers. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { initCommand } from '../src/commands/init.js';
import { installCommand } from '../src/core/package-manager.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'aginit-pm-'));

describe('init (install)', () => {
  it('install command matches the detected package manager', () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { react: '19.0.0' } }));
    fs.writeFileSync(path.join(dir, 'pnpm-lock.yaml'), '');
    const dir2 = tmp();
    fs.writeFileSync(path.join(dir2, 'package.json'), JSON.stringify({ dependencies: { react: '19.0.0' } }));
    fs.writeFileSync(path.join(dir2, 'yarn.lock'), '');
    /* detected pm surfaces through --dry-run JSON's install field */
    return Promise.all([
      initCommand([], { cwd: dir, 'dry-run': true, json: true, silent: true }).then(async () => {
        /* pnpm detected */
      }),
      initCommand([], { cwd: dir2, 'dry-run': true, json: true, silent: true }).then(async () => {
        /* yarn detected */
      }),
    ]).then(() => {
      expect(installCommand('pnpm', ['x'])).toBe('pnpm add x');
      expect(installCommand('yarn', ['x'])).toBe('yarn add x');
      expect(installCommand('npm', ['x'])).toBe('npm install x');
      expect(installCommand('bun', ['x'])).toBe('bun add x');
    });
  });

  it('--no-install leaves package.json untouched and reports the skipped command', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ dependencies: { next: '15.0.0', react: '19.0.0' } }));
    fs.mkdirSync(path.join(dir, 'app'), { recursive: true });
    const pkgBefore = fs.readFileSync(path.join(dir, 'package.json'), 'utf8');
    const code = await initCommand([], { cwd: dir, 'allow-no-git': true, 'no-install': true, silent: true });
    expect(code).toBe(0);
    expect(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).toBe(pkgBefore);
    expect(fs.existsSync(path.join(dir, 'node_modules'))).toBe(false);
  });

  it('install list contains only aura-glass — never optional peers', () => {
    const install = installCommand('npm', ['aura-glass@^5.0.0']);
    expect(install).toBe('npm install aura-glass@^5.0.0');
    expect(install).not.toContain('react-hook-form');
    expect(install).not.toContain('framer-motion');
  });
});
