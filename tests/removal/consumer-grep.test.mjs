/* @jest-environment node */
/* REQ-PLAT-81 (PLAT-223): consumer-grep unit + fixture-tree tests — row
   parsing, family matching, verifyRecord error paths, and the bare --verify
   loop over a synthetic repo root. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  dispositionsRows, familyNames, verifyRecord, FAMILY_PATHS,
} from '../../scripts/removal/consumer-grep.mjs';

const ROW = '| 1 | GlassAiChat | `src/components/ai/GlassAiChat.tsx` | CLASS | yes | removed | - | plat | removed | PRD-03 | rm-02 ai/voice family |';
const ROW2 = '| 2 | GlassWidget | `src/components/widgets/GlassWidget.tsx` | CLASS | yes | removed | - | plat | removed | PRD-03 | rm-11 catch-all |';
const DOC = `# dispositions fixture\n\n| # | Component | File | Disp | Pub | Destination | Target | Owner | Codemod | Owning PRD | Reconciliation note |\n|---|---|---|---|---|---|---|---|---|---|---|\n${ROW}\n${ROW2}\n`;

describe('consumer-grep units', () => {
  it('parses the 11-column dispositions table', () => {
    const rows = dispositionsRows(DOC);
    expect(rows.length).toBe(2);
    expect(rows[0].name).toBe('GlassAiChat');
    expect(rows[0].owner).toBe('plat');
    expect(rows[0].codemod).toBe('removed');
  });

  it('still parses the earlier 9-column table (no Owner/Codemod)', () => {
    const doc9 = '| 7 | GlassVoice | `src/components/voice/GlassVoice.tsx` | CLASS | yes | removed | - | PRD-03 | rm-02 |\n';
    const rows = dispositionsRows(doc9 + DOC);
    expect(rows.map((r) => r.name)).toEqual(['GlassAiChat', 'GlassWidget', 'GlassVoice']);
    expect(rows[2]).toMatchObject({ prd: 'PRD-03', owner: '', codemod: '' });
  });

  it('familyNames matches prefixes; RM-11 is the src/components catch-all', () => {
    const rows = dispositionsRows(DOC);
    expect(familyNames('RM-02', rows).map((r) => r.name)).toEqual(['GlassAiChat']);
    expect(familyNames('RM-11', rows).map((r) => r.name)).toEqual(['GlassWidget']);
    expect(familyNames('RM-99', rows)).toBeNull();
  });

  it('verifyRecord reports missing, stale, and unacknowledged records', () => {
    expect(verifyRecord('RM-02', null, ['GlassAiChat'])[0]).toContain('no consumer-grep record');
    const stale = verifyRecord('RM-02', { family: 'RM-02', names: [], gh: { status: 'ok' }, status: 'ok', acknowledged: true }, ['GlassAiChat']);
    expect(stale.join(' ')).toContain('stale');
    const ghMiss = verifyRecord('RM-02', { family: 'RM-02', names: ['GlassAiChat'], gh: { status: 'missing' }, status: 'ok', acknowledged: false }, ['GlassAiChat']);
    expect(ghMiss.join(' ')).toContain('gh search missing');
    const ok = verifyRecord('RM-02', { family: 'RM-02', names: ['GlassAiChat'], gh: { status: 'missing' }, status: 'missing', acknowledged: true }, ['GlassAiChat']);
    expect(ok).toEqual([]);
  });
});

describe('consumer-grep fixture tree (--verify loop)', () => {
  const makeRoot = () => {
    const root = mkdtempSync(join(tmpdir(), 'cg-'));
    mkdirSync(join(root, 'scripts/removal'), { recursive: true });
    mkdirSync(join(root, 'docs/inventory'), { recursive: true });
    mkdirSync(join(root, 'docs/release/decisions/removals'), { recursive: true });
    cpSync(new URL('../../scripts/removal/consumer-grep.mjs', import.meta.url).pathname,
      join(root, 'scripts/removal/consumer-grep.mjs'));
    writeFileSync(join(root, 'docs/inventory/component-dispositions.md'), DOC);
    return root;
  };

  it('bare --verify passes with a good record and fails without one', () => {
    const root = makeRoot();
    try {
      /* --verify loops every known family + on-disk record, so the fixture
         needs an acknowledged record per FAMILY_PATHS key. */
      for (const fam of Object.keys(FAMILY_PATHS)) {
        writeFileSync(join(root, `docs/release/decisions/removals/${fam}.json`), JSON.stringify({
          family: fam,
          names: fam === 'RM-02' ? ['GlassAiChat'] : fam === 'RM-11' ? ['GlassWidget'] : [],
          status: 'missing',
          acknowledged: true, gh: { status: 'missing' }, scans: [],
        }));
      }
      const out = execFileSync('node', ['scripts/removal/consumer-grep.mjs', '--verify'],
        { cwd: root, encoding: 'utf8' });
      expect(out).toContain('RM-02: record current');
      rmSync(join(root, 'docs/release/decisions/removals/RM-02.json'));
      expect(() => execFileSync('node', ['scripts/removal/consumer-grep.mjs', '--verify'],
        { cwd: root, encoding: 'utf8', stdio: 'pipe' })).toThrow();
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});
