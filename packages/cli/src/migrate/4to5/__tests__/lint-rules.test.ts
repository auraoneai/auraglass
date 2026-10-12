/** REQ-PLAT-90: the transforms/** lint ban applies to every transform (core and
 *  area): Glass* string literals, Glass* template chunks and --glass-* tokens in
 *  string literals or template chunks are errors; the shipped transforms are clean. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { Linter } from 'eslint';
import config from '../../../../eslint.config.js';

const PKG = path.join(__dirname, '..', '..', '..', '..');
const TRANSFORMS = path.join(PKG, 'src', 'migrate', '4to5', 'transforms');
const linter = new Linter({ configType: 'flat', cwd: PKG });
const lint = (code: string, file: string) =>
  linter.verify(code, config as never, { filename: path.join(PKG, file) }).filter((m) => m.ruleId === 'no-restricted-syntax');

describe('transform lint restrictions (REQ-PLAT-90)', () => {
  const files = fs.readdirSync(TRANSFORMS).filter((f) => f.endsWith('.ts'));

  it.each(files)('%s: every banned literal form is an error there', (f) => {
    const file = `src/migrate/4to5/transforms/${f}`;
    const cases = [
      "export const a = 'GlassButton';",
      'export const b = `<GlassCard ${1}>`;',
      "export const c = '--glass-blur-md';",
      'export const d = `var(--glass-radius-${1})`;',
    ];
    for (const code of cases) expect([code, lint(code, file).length]).toEqual([code, 1]);
    // names read from the compiled mappings are fine
    expect(lint('export const ok = (m: { names: Set<string> }) => [...m.names];', file)).toEqual([]);
  });

  it('the restrictions do not reach non-transform sources', () => {
    expect(lint("export const a = 'GlassButton';", 'src/migrate/4to5/mappings.ts')).toEqual([]);
  });

  it.each(files)('%s: shipped source passes the restrictions', (f) => {
    const file = `src/migrate/4to5/transforms/${f}`;
    expect(lint(fs.readFileSync(path.join(PKG, file), 'utf8'), file).map((m) => `${m.line}: ${m.message}`)).toEqual([]);
  });
});
