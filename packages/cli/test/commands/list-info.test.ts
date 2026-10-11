/* list-info — REQ-PLAT-84 item 7: fixture registry index covering type,
   files, dependencies, registryDependencies, cssVars keys, certified flag. */
import { describe, expect, it, jest } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { registryItemSchema } from '../../src/registry/schema.js';
import { listCommand, infoCommand } from '../../src/commands/list-info.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agt-'));

const CERT_SHA = 'a1b2c3d4e5f6';

const registryFixture = (root: string) => {
  const dir = path.join(root, 'reg');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.json'), JSON.stringify({ items: [
    { name: 'button', type: 'components', title: 'Button', description: 'Glass button' },
    { name: 'card', type: 'components', title: 'Card', description: 'Glass card' },
    { name: 'hero', type: 'blocks', title: 'Hero', description: 'Landing hero block' },
  ] }));
  fs.writeFileSync(path.join(dir, 'button.json'), JSON.stringify({
    name: 'button', type: 'components', title: 'Button', description: 'Glass button',
    dependencies: ['clsx'],
    registryDependencies: [],
    files: [{ path: 'button.tsx', content: "export const Button = 1;\n" }],
    cssVars: { ':root': { '--ag-btn-radius': '8px', '--ag-btn-bg': 'glass' } },
    meta: { auraglass: { certified: true, sha: CERT_SHA, client: false } },
  }));
  fs.writeFileSync(path.join(dir, 'card.json'), JSON.stringify({
    name: 'card', type: 'components', title: 'Card', description: 'Glass card',
    dependencies: [], registryDependencies: ['button'],
    files: [{ path: 'card.tsx', content: "export const Card = 1;\n" }],
    cssVars: { ':root': { '--ag-card-pad': '16px' } },
    meta: { auraglass: { certified: true, sha: CERT_SHA } },
  }));
  fs.writeFileSync(path.join(dir, 'hero.json'), JSON.stringify({
    name: 'hero', type: 'blocks', title: 'Hero',
    dependencies: ['framer-motion'], registryDependencies: ['button', 'card'],
    files: [
      { path: 'hero.tsx', content: "export const Hero = 1;\n" },
      { path: 'hero.css', content: '.hero{}\n' },
    ],
    cssVars: { ':root': { '--ag-hero-h': '480px' }, '.dark': { '--ag-hero-h': '560px' } },
    meta: { auraglass: { certified: true, sha: CERT_SHA, client: true } },
  }));
  return dir;
};

describe('list/info', () => {
  it('registryItemSchema parses a minimal item', () => {
    const r = registryItemSchema.safeParse({ name: 'button', type: 'components', files: [] });
    expect(r.success).toBe(true);
  });

  it('list command returns a code', async () => {
    const dir = tmp();
    const code = await listCommand([], { cwd: dir, json: true, silent: true }).catch((e) => e.code);
    expect([0, 1, 2, 4]).toContain(code);
  });

  it('listCommand reads the fixture registry (name + type + description)', async () => {
    const dir = tmp(); const reg = registryFixture(dir);
    const buf: string[] = [];
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation(((s: unknown) => { buf.push(String(s)); return true; }) as never);
    let code: number | undefined;
    try { code = await listCommand([], { cwd: dir, registry: reg, json: true, silent: true }); }
    finally { spy.mockRestore(); }
    expect(code).toBe(0);
    const { items } = JSON.parse(buf.join(''));
    const names = items.map((i: { name: string }) => i.name).sort();
    expect(names).toEqual(['button', 'card', 'hero']);
    expect(items.find((i: { name: string }) => i.name === 'hero').type).toBe('blocks');
  });

  it('listCommand filter narrows by name substring', async () => {
    const dir = tmp(); const reg = registryFixture(dir);
    const buf: string[] = [];
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation(((s: unknown) => { buf.push(String(s)); return true; }) as never);
    try { await listCommand(['hero'], { cwd: dir, registry: reg, json: true, silent: true }); }
    finally { spy.mockRestore(); }
    const { items } = JSON.parse(buf.join(''));
    expect(items.map((i: { name: string }) => i.name)).toEqual(['hero']);
  });

  it('infoCommand returns the full item: deps, registryDeps, files, cssVars keys, certified meta', async () => {
    const dir = tmp(); const reg = registryFixture(dir);
    const buf: string[] = [];
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation(((s: unknown) => { buf.push(String(s)); return true; }) as never);
    try { await infoCommand(['hero'], { cwd: dir, registry: reg, json: true, silent: true }); }
    finally { spy.mockRestore(); }
    const item = JSON.parse(buf.join(''));
    expect(item.name).toBe('hero');
    expect(item.type).toBe('blocks');
    expect(item.dependencies).toEqual(['framer-motion']);
    expect(item.registryDependencies).toEqual(['button', 'card']);
    expect(item.files.map((f: { path: string }) => f.path)).toEqual(['hero.tsx', 'hero.css']);
    expect(Object.keys(item.cssVars)).toEqual([':root', '.dark']);
    expect(item.meta.auraglass.certified).toBe(true);
    expect(item.meta.auraglass.sha).toBe(CERT_SHA);
    expect(item.meta.auraglass.client).toBe(true);
  });

  it('add --dry-run plans registryDependencies before the item itself', async () => {
    const dir = tmp(); const reg = registryFixture(dir);
    const { addCommand } = await import('../../src/commands/add.js');
    const buf: string[] = [];
    const spy = jest.spyOn(process.stdout, 'write').mockImplementation(((s: unknown) => { buf.push(String(s)); return true; }) as never);
    try {
      await addCommand(['hero'], { cwd: dir, registry: reg, 'dry-run': true, 'allow-no-git': true, json: true, silent: true });
    } finally { spy.mockRestore(); }
    const payload = JSON.parse(buf.join(''));
    /* dep files (button/card) are planned before hero's own files */
    const files: string[] = payload.files;
    expect(files.findIndex((f) => f.includes('button'))).toBeLessThan(files.findIndex((f) => f.includes('hero')));
    expect(files.findIndex((f) => f.includes('card'))).toBeLessThan(files.findIndex((f) => f.includes('hero')));
    /* cssVars fixture blocks planned too */
    expect(files.some((f) => f.includes('auraglass-registry.css'))).toBe(true);
  });
});
