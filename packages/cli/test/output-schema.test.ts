/* output-schema.test.ts — REQ-PLAT-84: every command's real --json payload
   validates against schema/output/<command>.json. Commands run against tmp
   fixtures; stdout is captured around printJson. */
import { describe, expect, it, jest } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateJsonSchema } from './helpers/json-schema.js';
import { initCommand } from '../src/commands/init.js';
import { addCommand } from '../src/commands/add.js';
import { diffCommand } from '../src/commands/diff.js';
import { updateCommand } from '../src/commands/update.js';
import { doctorCommand } from '../src/commands/doctor.js';
import { auditCommand } from '../src/commands/audit.js';
import { migrateCommand } from '../src/commands/migrate.js';
import { listCommand, infoCommand } from '../src/commands/list-info.js';

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), 'agschema-'));
const schema = (name: string) =>
  JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'schema', 'output', `${name}.json`), 'utf8'));

const captureJson = async (fn: () => Promise<unknown>) => {
  const buf: string[] = [];
  const spy = jest.spyOn(process.stdout, 'write').mockImplementation(((s: unknown) => { buf.push(String(s)); return true; }) as never);
  try { await fn(); } finally { spy.mockRestore(); }
  const text = buf.join('').trim();
  expect(text.startsWith('{')).toBe(true);
  return JSON.parse(text);
};

const registryDir = (root: string) => {
  const dir = path.join(root, 'reg');
  fs.mkdirSync(dir, { recursive: true });
  const item = {
    name: 'button', type: 'components', title: 'Button', description: 'Glass button',
    dependencies: [], registryDependencies: [],
    files: [{ path: 'button.tsx', content: "export const B = 1;\n" }],
    cssVars: { ':root': { '--ag-btn-radius': '8px' } },
    meta: { auraglass: { certified: true, client: false } },
  };
  fs.writeFileSync(path.join(dir, 'button.json'), JSON.stringify(item));
  return dir;
};

describe('schema/output schemas exist', () => {
  for (const c of ['init', 'add', 'diff', 'update', 'doctor', 'audit', 'migrate', 'list', 'info'])
    it(`${c}.json exists`, () => expect(fs.existsSync(path.join(__dirname, '..', 'schema', 'output', `${c}.json`))).toBe(true));
});

describe('--json payloads validate', () => {
  it('init --dry-run --json', async () => {
    const dir = tmp();
    const payload = await captureJson(() =>
      initCommand([], { cwd: dir, 'dry-run': true, json: true, silent: true }));
    expect(validateJsonSchema(payload, schema('init'))).toEqual([]);
  });

  it('add <name> --dry-run --json', async () => {
    const dir = tmp(); const reg = registryDir(dir);
    const payload = await captureJson(() =>
      addCommand(['button'], { cwd: dir, registry: reg, 'dry-run': true, 'allow-no-git': true, json: true, silent: true }));
    expect(validateJsonSchema(payload, schema('add'))).toEqual([]);
  });

  it('diff <name> --json', async () => {
    const dir = tmp(); const reg = registryDir(dir);
    fs.writeFileSync(path.join(dir, 'auraglass.json'), JSON.stringify({ components: 'components/aura' }));
    /* an installed, stamped copy so diff produces states, not an error */
    const code = await addCommand(['button'], { cwd: dir, registry: reg, 'allow-no-git': true, json: false, silent: true });
    expect(code).toBe(0);
    const payload = await captureJson(() =>
      diffCommand(['button'], { cwd: dir, registry: reg, json: true, silent: true }));
    expect(validateJsonSchema(payload, schema('diff'))).toEqual([]);
  });

  it('update <name> --json', async () => {
    const dir = tmp(); const reg = registryDir(dir);
    fs.writeFileSync(path.join(dir, 'auraglass.json'), JSON.stringify({ components: 'components/aura' }));
    await addCommand(['button'], { cwd: dir, registry: reg, 'allow-no-git': true, silent: true });
    const payload = await captureJson(() =>
      updateCommand(['button'], { cwd: dir, registry: reg, 'allow-no-git': true, json: true, silent: true }));
    expect(validateJsonSchema(payload, schema('update'))).toEqual([]);
  });

  it('doctor --json', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), '{}');
    const payload = await captureJson(() =>
      doctorCommand([], { cwd: dir, json: true, silent: true }));
    expect(validateJsonSchema(payload, schema('doctor'))).toEqual([]);
  });

  it('audit deps|imports --json', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'package.json'), '{"dependencies":{"aura-glass":"4.9.0"}}');
    fs.writeFileSync(path.join(dir, 'a.ts'), "import { GlassButton } from 'aura-glass';\n");
    const deps = await captureJson(() =>
      auditCommand(['deps'], { cwd: dir, json: true, silent: true }));
    expect(validateJsonSchema(deps, schema('audit'))).toEqual([]);
    const imports = await captureJson(() =>
      auditCommand(['imports'], { cwd: dir, json: true, silent: true }));
    expect(validateJsonSchema(imports, schema('audit'))).toEqual([]);
  });

  it('migrate 4to5 --dry-run --json', async () => {
    const dir = tmp();
    fs.writeFileSync(path.join(dir, 'f.tsx'), "import { GlassProvider } from 'aura-glass';\nexport const x = 1;\n");
    fs.writeFileSync(path.join(dir, 'package.json'), '{"dependencies":{"aura-glass":"4.9.0"}}');
    const payload = await captureJson(() =>
      migrateCommand(['4to5'], { cwd: dir, 'dry-run': true, 'allow-no-git': true, json: true, silent: true }));
    expect(validateJsonSchema(payload, schema('migrate'))).toEqual([]);
  });

  it('list --registry --json and info --registry --json', async () => {
    const dir = tmp(); const reg = registryDir(dir);
    const list = await captureJson(() =>
      listCommand([], { cwd: dir, registry: reg, json: true, silent: true }));
    expect(validateJsonSchema(list, schema('list'))).toEqual([]);
    const info = await captureJson(() =>
      infoCommand(['button'], { cwd: dir, registry: reg, json: true, silent: true }));
    expect(validateJsonSchema(info, schema('info'))).toEqual([]);
  });
});
