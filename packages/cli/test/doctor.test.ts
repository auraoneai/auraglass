/** doctor date-peers (REQ-SURF-98): an app importing aura-glass/date must
    resolve react-aria-components and @internationalized/date; doctor names
    both packages when either is missing. */
import { afterEach, describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runChecks } from '../src/doctor/checks.js';

const dirs: string[] = [];
afterEach(() => { for (const d of dirs.splice(0)) fs.rmSync(d, { recursive: true, force: true }); });

function app(files: Record<string, string>, installed: string[] = []): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agt-date-'));
  dirs.push(dir);
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: 'app', dependencies: { 'aura-glass': '5.0.0' } }));
  for (const [rel, src] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), src);
  }
  for (const name of installed) {
    const pkgDir = path.join(dir, 'node_modules', ...name.split('/'));
    fs.mkdirSync(pkgDir, { recursive: true });
    fs.writeFileSync(path.join(pkgDir, 'package.json'), JSON.stringify({ name, version: '1.0.0', main: 'index.js' }));
    fs.writeFileSync(path.join(pkgDir, 'index.js'), 'module.exports = {};');
  }
  return dir;
}
const datePeers = (dir: string) => runChecks(dir).filter((r) => r.id === 'date-peers');
const PICKER = "import { DatePicker } from 'aura-glass/date';\nexport const P = DatePicker;\n";

describe('doctor date-peers (REQ-SURF-98)', () => {
  it('fails and names both packages when neither peer resolves', () => {
    const [r] = datePeers(app({ 'src/Picker.tsx': PICKER }));
    expect(r).toBeDefined();
    expect(r!.status).toBe('fail');
    expect(r!.message).toContain('react-aria-components');
    expect(r!.message).toContain('@internationalized/date');
    expect(r!.message).toMatch(/missing: react-aria-components, @internationalized\/date$/);
    expect(r!.detail).toBe('npm install react-aria-components@^1.21.1 @internationalized/date@^3.12.4');
  });

  it('fails naming both packages and the missing one when only one peer resolves', () => {
    const [r] = datePeers(app({ 'src/Picker.tsx': PICKER }, ['react-aria-components']));
    expect(r!.status).toBe('fail');
    expect(r!.message).toContain('react-aria-components and @internationalized/date');
    expect(r!.message).toMatch(/missing: @internationalized\/date$/);
  });

  it('passes when both peers resolve', () => {
    const [r] = datePeers(app({ 'src/Picker.tsx': PICKER }, ['react-aria-components', '@internationalized/date']));
    expect(r!.status).toBe('pass');
  });

  it('is silent when the app does not import aura-glass/date (date.css alone does not count)', () => {
    expect(datePeers(app({ 'src/App.tsx': "import 'aura-glass/date.css';\nimport { Button } from 'aura-glass';\n" }))).toEqual([]);
  });
});
