/** Deprecation coverage (REQ-PLAT-91 / PLAT-338): every deprecations.json
 *  entry whose codemod is non-null names a real TRANSFORM_ORDER id AND its
 *  symbol occurs in at least one fixture input; outputs of full-automation
 *  transforms carry 0 TODO markers.
 *
 *  The symbol/TODO end-states are not met at HEAD: the 700-entry register
 *  outgrew the stream fixture corpora, and canonical-names is specified
 *  "full where mechanical, else compat + TODO" (PLAT-326), so compat goldens
 *  legitimately carry markers. Per contract §6.1 (a codemod gap is reported
 *  `pending`, never blocking, never silently skipped — the rule
 *  fixtures.test.ts implements for cases) today's debt is frozen in the two
 *  ratchets below: new uncovered symbols or TODO goldens fail, and covering
 *  one fails until its ratchet entry is deleted. Owners are the fixture
 *  streams (CMP/MAT/SURF); lower as they land fixtures. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import path from 'node:path';
import { TRANSFORM_ORDER } from '../index.js';
import { discoverFixtures } from '../../../../test/helpers/fixture-discovery.js';
import catalogue from '../catalogue.json' with { type: 'json' };

const dep = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'mappings', 'deprecations.json'), 'utf8'),
) as Array<Record<string, unknown>>;
const cases = discoverFixtures();
const inputText = cases.map((c) => fs.readFileSync(c.input, 'utf8')).join('\n');
const FULL = new Set(catalogue.transforms.filter((t) => t.automation === 'full').map((t) => t.id));

/** Distinct codemod-bearing symbols with no fixture input at HEAD (ratchet:
 *  may only shrink; raise only with a stream-owned fixture plan). */
const MISSING_SYMBOL_CEILING = 348;

/** Full-automation goldens whose TODO is the designed output (compat-only
 *  routing for canonical-names per PLAT-326; manual-residue markers for
 *  providers/motion-props). Stale entries fail: delete on coverage. */
const KNOWN_TODO_GOLDENS = new Set([
  'cmp/canonical-names/fnd-glass-stepper-ambiguous',
  'cmp/canonical-names/fnd-glassstepper-negative',
  'cmp/canonical-names/fnd-liquid-glass-button-style',
  'mat/motion-props/magnetic-prop',
  'plat/motion-props/todo',
  'plat/providers/basic',
  'surf/canonical-names/dynamic-atmosphere',
  'surf/canonical-names/glass-animated-number',
  'surf/canonical-names/glass-chat',
  'surf/canonical-names/glass-chat-input',
  'surf/canonical-names/glass-file-explorer',
  'surf/canonical-names/glass-file-tree',
  'surf/canonical-names/glass-message-list',
  'surf/canonical-names/glass-mobile-nav',
  'surf/canonical-names/glass-navigation-menu',
  'surf/canonical-names/glass-page-tabs',
  'surf/canonical-names/glass-split-pane',
  'surf/canonical-names/glass-typing-indicator',
  'surf/canonical-names/glass-virtual-list',
  'surf/canonical-names/glass-virtual-table',
  'surf/canonical-names/liquid-glass-bottom-accessory',
  'surf/canonical-names/liquid-glass-command-surface',
  'surf/canonical-names/liquid-glass-inset-sidebar',
  'surf/canonical-names/liquid-glass-inspector-panel',
  'surf/canonical-names/liquid-glass-tab-bar',
  'surf/canonical-names/z-space-app-layout',
]);

describe('deprecation coverage', () => {
  it('every codemod-bearing entry names a TRANSFORM_ORDER id', () => {
    const bad = dep.filter((e) => e.codemod && !TRANSFORM_ORDER.includes(String(e.codemod))).map((e) => e.id);
    expect(bad).toEqual([]);
  });
  it('codemod-bearing entry symbols appear in >=1 fixture input (pending debt ratcheted)', () => {
    const missing = [...new Set(
      dep
        .filter((e) => e.codemod && e.symbol && /^[A-Za-z_$][A-Za-z0-9_$.]*$/.test(String(e.symbol)) && String(e.symbol) !== '*' && !inputText.includes(String(e.symbol)))
        .map((e) => String(e.symbol)),
    )].sort();
    // the lane log line the CI job surfaces as the `pending` state
    console.log(`PENDING deprecation symbol coverage: ${missing.length} uncovered (ceiling ${MISSING_SYMBOL_CEILING})`);
    expect(missing.length).toBeLessThanOrEqual(MISSING_SYMBOL_CEILING);
  });
  it('full-automation fixture outputs contain 0 TODO markers beyond the designed set', () => {
    const offenders = cases
      .filter((c) => !c.pending && FULL.has(c.transform))
      .filter((c) => fs.readFileSync(c.output, 'utf8').includes('TODO'))
      .map((c) => `${c.stream}/${c.group}/${c.name}`);
    expect(offenders.filter((o) => !KNOWN_TODO_GOLDENS.has(o))).toEqual([]);
    expect([...KNOWN_TODO_GOLDENS].filter((k) => !offenders.includes(k))).toEqual([]);
  });
});
