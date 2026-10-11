/* @jest-environment node */
/* REQ-QUAL-31 (REQ-FIN-104, FIN-441): vacuous-assertion gate — scripts/qual/lint-tests.mjs.
   Every pattern has at least one invalid fixture producing exactly one diagnostic of that rule, and valid
   fixtures produce zero diagnostics. Fixtures are inline sources linted under a fake path; nothing here runs them. */
import { describe, expect, it } from '@jest/globals';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  RULE_IDS, lintTestSource, loadOwnership, ownerOf, phaseFromEnv, run, severityFor,
} from '../../../scripts/qual/lint-tests.mjs';

type Fixture = { name: string; file: string; code: string };

const INVALID: Record<(typeof RULE_IDS)[number], Fixture[]> = {
  'container-in-document': [
    { name: 'destructured container', file: 'tests/x/a.test.tsx', code: `
      it('renders', () => {
        const { container } = render(<Button />);
        expect(container).toBeInTheDocument();
      });` },
    { name: 'result.container', file: 'tests/x/a.test.tsx', code: `
      it('renders', () => {
        const view = render(<Button />);
        expect(view.container).toBeInTheDocument();
      });` },
  ],
  'expect-in-if': [
    { name: 'if without else', file: 'tests/x/b.test.ts', code: `
      it('maybe asserts', () => {
        const el = document.querySelector('[data-ag-part="root"]');
        if (el) {
          expect(el.getAttribute('data-state')).toBe('open');
        }
      });` },
    { name: 'else that does not fail', file: 'tests/x/b.test.ts', code: `
      it('maybe asserts', () => {
        if (value > 0) expect(value).toBe(1);
        else console.log('skipped');
      });` },
  ],
  'unguarded-query-loop': [
    { name: 'for-of over querySelectorAll', file: 'tests/x/c.test.tsx', code: `
      it('every trigger expanded', () => {
        const { container } = render(<Accordion />);
        for (const t of container.querySelectorAll('[data-ag-part="trigger"]')) {
          expect(t.getAttribute('aria-expanded')).toBe('true');
        }
      });` },
    { name: 'forEach on a bound NodeList', file: 'tests/x/c.test.tsx', code: `
      it('every item labelled', () => {
        const items = document.querySelectorAll('[role="option"]');
        items.forEach((i) => expect(i).toHaveAttribute('aria-label'));
      });` },
    { name: 'expect(list.every(...))', file: 'tests/x/c.test.tsx', code: `
      it('all disabled', () => {
        const items = Array.from(document.querySelectorAll('button'));
        expect(items.every((b) => b.disabled)).toBe(true);
      });` },
  ],
  'jsdom-animation-duration': [
    { name: 'member read', file: 'tests/x/d.test.tsx', code: `
      it('reduced motion', () => {
        const el = screen.getByRole('dialog');
        expect(getComputedStyle(el).animationDuration).toBe('0s');
      });` },
    { name: 'bound style object', file: 'tests/x/d.test.tsx', code: `
      it('reduced motion', () => {
        const style = window.getComputedStyle(el);
        expect(style.animationDuration).toBe('0s');
      });` },
  ],
  'dom-snapshot-under-src': [
    { name: 'container snapshot', file: 'src/components/x/X.test.tsx', code: `
      it('matches', () => {
        const { container } = render(<X />);
        expect(container).toMatchSnapshot();
      });` },
    { name: 'asFragment snapshot', file: 'src/components/x/X.test.tsx', code: `
      it('matches', () => {
        const { asFragment } = render(<X />);
        expect(asFragment()).toMatchSnapshot();
      });` },
  ],
  'jsdom-color-contrast': [
    { name: 'axe rule enabled', file: 'tests/x/e.test.tsx', code: `
      it('contrast', async () => {
        const { container } = render(<X />);
        expect(await axe(container, { rules: { 'color-contrast': { enabled: true } } })).toHaveNoViolations();
      });` },
    { name: 'contrast over computed styles', file: 'tests/x/e.test.tsx', code: `
      it('contrast', () => {
        const s = getComputedStyle(el);
        expect(contrastRatio(s.color, s.backgroundColor)).toBeGreaterThanOrEqual(4.5);
      });` },
    { name: 'runOnly color-contrast', file: 'tests/x/e.test.tsx', code: `
      it('contrast', async () => {
        const results = await axe(document.body, { runOnly: ['color-contrast'] });
        expect(results).toHaveNoViolations();
      });` },
  ],
  'missing-subject-return': [
    { name: 'bare return on missing subject', file: 'tests/x/f.test.ts', code: `
      it('subject renders', () => {
        const subject = findSubject('Dialog');
        if (!subject) return;
        expect(subject.parts).toContain('root');
      });` },
    { name: 'console.warn pending then return', file: 'tests/x/f.test.ts', code: `
      test('seam', async () => {
        if (!existsSync(SEAM)) { console.warn('pending'); return; }
        expect(await load(SEAM)).toBeDefined();
      });` },
    { name: 'it.each body', file: 'tests/x/f.test.ts', code: `
      it.each(SUBJECTS)('%s', (name) => {
        if (!META[name]) return undefined;
        expect(META[name].parts.length).toBeGreaterThan(0);
      });` },
  ],
};

const VALID: Fixture[] = [
  { name: 'assert a part, not the container', file: 'tests/x/ok.test.tsx', code: `
    it('renders', () => {
      const { container } = render(<Button />);
      expect(container.querySelector('[data-ag-part="root"]')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });` },
  { name: 'if with a failing else / throw', file: 'tests/x/ok.test.ts', code: `
    it('asserts both ways', () => {
      if (mode === 'a') expect(x).toBe(1);
      else expect(x).toBe(2);
      if (!el) throw new Error('subject missing: Dialog');
      if (ready) { expect(el).toBeTruthy(); } else { throw new Error('not ready'); }
    });` },
  { name: 'conditional test registration is not a conditional assertion', file: 'tests/x/ok.test.ts', code: `
    if (pending.length) {
      it('reports pending', () => { expect(pending.length).toBeGreaterThan(0); });
    }` },
  { name: 'length asserted before the loop', file: 'tests/x/ok.test.tsx', code: `
    it('every trigger expanded', () => {
      const triggers = container.querySelectorAll('[data-ag-part="trigger"]');
      expect(triggers).toHaveLength(2);
      for (const t of triggers) expect(t.getAttribute('aria-expanded')).toBe('true');
      const opts = document.querySelectorAll('[role="option"]');
      expect(opts.length).toBeGreaterThan(0);
      opts.forEach((o) => expect(o).toHaveAttribute('aria-selected'));
      const ids = Array.from(document.querySelectorAll('input')).map((i) => i.id);
      expect(new Set(ids).size).toBe(2);
    });` },
  { name: 'inline style reads and node-env files are fine', file: 'tests/x/ok.test.tsx', code: `
    it('inline style', () => {
      expect(el.style.animationDuration).toBe('0s');
      expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21);
    });` },
  { name: 'snapshot outside src and of data under src', file: 'src/components/x/ok.test.ts', code: `
    it('data snapshot', () => {
      expect(buildTable(rows)).toMatchSnapshot();
      expect(parts).toMatchInlineSnapshot();
    });` },
  { name: 'returns inside helpers and with values are fine', file: 'tests/x/ok.test.ts', code: `
    function pick(x) { if (!x) return; return x.id; }
    it('works', () => {
      const ids = items.map((i) => { if (!i) return null; return i.id; });
      if (!subject) throw new Error('subject missing: Dialog');
      expect(ids).toEqual(['a']);
    });` },
  { name: 'axe in jsdom with colour contrast left off', file: 'tests/x/ok.test.tsx', code: `
    it('axe', async () => {
      expect(await axe(container, { rules: { 'color-contrast': { enabled: false } } })).toHaveNoViolations();
    });` },
];

describe('lint-tests: invalid fixtures (one diagnostic each)', () => {
  it('covers every rule', () => {
    expect(Object.keys(INVALID).sort()).toEqual([...RULE_IDS].sort());
  });
  const cases = Object.entries(INVALID).flatMap(([rule, fixtures]) => fixtures.map((f) => [rule, f.name, f] as const));
  it.each(cases)('%s: %s', (rule, _name, f) => {
    const diags = lintTestSource(f.code, f.file);
    expect(diags.map((d: { rule: string }) => d.rule)).toEqual([rule]);
    expect(diags[0]!.line).toBeGreaterThan(0);
    expect(diags[0]!.message.length).toBeGreaterThan(20);
  });
});

describe('lint-tests: valid fixtures (zero diagnostics)', () => {
  it.each(VALID.map((f) => [f.name, f] as const))('%s', (_name, f) => {
    expect(lintTestSource(f.code, f.file)).toEqual([]);
  });
  it('snapshot rule is scoped to src/** only', () => {
    const code = `it('m', () => { const { container } = render(<X />); expect(container).toMatchSnapshot(); });`;
    expect(lintTestSource(code, 'tests/x/a.test.tsx')).toEqual([]);
    expect(lintTestSource(code, 'src/x/a.test.tsx').map((d: { rule: string }) => d.rule)).toEqual(['dom-snapshot-under-src']);
  });
  it('jsdom-only rules are off under @jest-environment node', () => {
    const code = `/* @jest-environment node */\nit('m', () => { expect(getComputedStyle(el).animationDuration).toBe('0s'); });`;
    expect(lintTestSource(code, 'tests/x/a.test.ts')).toEqual([]);
  });
  it('an unparseable test file is a diagnostic, never silently skipped', () => {
    expect(lintTestSource('it("x", () => { expect(', 'tests/x/a.test.ts').map((d: { rule: string }) => d.rule)).toEqual(['parse-error']);
  });
});

describe('lint-tests: severity and ownership', () => {
  const rows = loadOwnership();
  it('resolves owners from contracts/ownership.json (first match wins)', () => {
    expect(ownerOf('tests/lint/qual/no-vacuous-assertions.test.ts', rows)).toBe('QUAL');
    expect(ownerOf('packages/qa/test/deliverables.test.ts', rows)).toBe('QUAL');
    expect(ownerOf('src/components/button/Button.test.tsx', rows)).toBe('CMP');
    expect(ownerOf('src/data/table/Table.test.tsx', rows)).toBe('SURF');
  });
  it('error on QUAL paths, report-only elsewhere before RC-1, error everywhere from RC-1', () => {
    expect(severityFor('QUAL', 'pre-rc')).toBe('error');
    expect(severityFor('CMP', 'pre-rc')).toBe('report');
    expect(severityFor('SURF', 'rc')).toBe('error');
  });
  it('derives the phase from the release tag', () => {
    expect(phaseFromEnv({})).toBe('pre-rc');
    expect(phaseFromEnv({ CI_COMMIT_TAG: 'v5.0.0-beta.2' })).toBe('pre-rc');
    expect(phaseFromEnv({ CI_COMMIT_TAG: 'v5.0.0-rc.1' })).toBe('rc');
    expect(phaseFromEnv({ CI_COMMIT_TAG: 'v5.1.0' })).toBe('rc');
  });
  it('running over src/** lists current violations grouped by owner', () => {
    const result = run({ prefixes: ['src'], phase: 'pre-rc' });
    expect(result.filesScanned).toBeGreaterThan(0);
    let total = 0;
    for (const d of result.diagnostics) {
      expect(d.file.startsWith('src/')).toBe(true);
      expect(d.owner).toBe(ownerOf(d.file, rows));
      expect(d.severity).toBe(severityFor(d.owner, 'pre-rc'));
    }
    for (const o of Object.values(result.byOwner) as Array<{ error: number; report: number }>) total += o.error + o.report;
    expect(total).toBe(result.diagnostics.length);
  });
  it('QUAL-owned test files carry no violations (the gate is an error there)', () => {
    const result = run({ phase: 'pre-rc' });
    expect(result.diagnostics.filter((d: { owner: string }) => d.owner === 'QUAL')).toEqual([]);
    expect(result.errors).toBe(0);
  });
});

describe('lint-tests: CLI', () => {
  const script = join(__dirname, '..', '..', '..', 'scripts', 'qual', 'lint-tests.mjs');
  it('exits 2 on a bad option, writes a JSON report by owner, exits 0 on QUAL paths (tests/contract)', () => {
    expect(spawnSync(process.execPath, [script, '--phase', 'later'], { encoding: 'utf8' }).status).toBe(2);
    const dir = mkdtempSync(join(tmpdir(), 'ag-lint-tests-'));
    try {
      const out = join(dir, 'report.json');
      const res = spawnSync(process.execPath, [script, '--quiet', '--json', out, 'tests/contract'], { encoding: 'utf8' });
      expect(res.status).toBe(0);
      const report = JSON.parse(readFileSync(out, 'utf8'));
      expect(report.gate).toBe('REQ-QUAL-31');
      expect(report.filesScanned).toBeGreaterThan(0);
      expect(report.errors).toBe(0);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
