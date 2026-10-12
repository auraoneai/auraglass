/* tests/dx/lib/layout-assert.test.ts — REQ-PLAT-97: layout.assert.json
   predicates, landmark sets and the committed layout.assert.json files. */
import { describe, expect, it } from '@jest/globals';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  BLOCK_LANDMARKS, evalPredicate, predicatesFor, referencedBoxes, requiredLandmarks, validateLayoutAssert, type LayoutAssert,
} from './layout-assert';

const sidebar = { x: 0, y: 56, width: 240, height: 800 };
const main = { x: 240, y: 56, width: 1200, height: 800 };

describe('evalPredicate', () => {
  it('app-frame at 1440: sidebar.x + sidebar.width <= main.x and |sidebar.y - main.y| <= 1', () => {
    expect(evalPredicate('sidebar.x + sidebar.width <= main.x', { sidebar, main }).pass).toBe(true);
    expect(evalPredicate('abs(sidebar.y - main.y) <= 1', { sidebar, main }).pass).toBe(true);
  });
  it('fails when the sidebar overlaps main or sits lower', () => {
    expect(evalPredicate('sidebar.x + sidebar.width <= main.x', { sidebar, main: { ...main, x: 200 } }).pass).toBe(false);
    const r = evalPredicate('abs(sidebar.y - main.y) <= 1', { sidebar: { ...sidebar, y: 60 }, main });
    expect(r.pass).toBe(false);
    expect(r.detail).toBe('abs(sidebar.y - main.y) <= 1: 4 <= 1');
  });
  it('supports right/bottom, precedence, parentheses, unary minus, min/max', () => {
    const b = { a: { x: 10, y: 10, width: 20, height: 5 } };
    expect(evalPredicate('a.right == 30', b).pass).toBe(true);
    expect(evalPredicate('a.bottom == a.y + a.height', b).pass).toBe(true);
    expect(evalPredicate('2 + 3 * 4 == 14', {}).pass).toBe(true);
    expect(evalPredicate('(2 + 3) * 4 == 20', {}).pass).toBe(true);
    expect(evalPredicate('-a.x < 0', b).pass).toBe(true);
    expect(evalPredicate('max(a.x, a.width) / 2 >= min(a.y, 9)', b).pass).toBe(true);
  });
  it('a missing box or malformed expression fails, never passes', () => {
    expect(evalPredicate('sidebar.x <= main.x', { sidebar, main: null })).toEqual({ pass: false, detail: "sidebar.x <= main.x: box 'main' not found" });
    expect(evalPredicate('sidebar.x + 1', { sidebar }).pass).toBe(false);
    expect(evalPredicate('sidebar.x <= process.exit(1)', { sidebar }).pass).toBe(false);
    expect(evalPredicate('sidebar.x <= 1; 2', { sidebar }).pass).toBe(false);
    expect(evalPredicate('sidebar.z <= 1', { sidebar }).pass).toBe(false);
  });
});

describe('landmarks and predicate selection', () => {
  it('blocks default to banner/navigation/main + one h1; layout.assert landmarks override the set', () => {
    expect(requiredLandmarks('block', null)).toEqual({ landmarks: [...BLOCK_LANDMARKS], oneH1: true });
    expect(requiredLandmarks('block', { landmarks: ['main', 'form'] })).toEqual({ landmarks: ['main', 'form'], oneH1: true });
    expect(requiredLandmarks('item', null)).toEqual({ landmarks: [], oneH1: false });
    expect(requiredLandmarks('item', { landmarks: ['main', 'region'] })).toEqual({ landmarks: ['main', 'region'], oneH1: false });
  });
  it('filters predicates by viewport width', () => {
    const la: LayoutAssert = { predicates: [{ assert: '1 <= 2', minWidth: 1440 }, { assert: '1 <= 2', maxWidth: 390 }, { assert: '1 <= 2' }] };
    expect(predicatesFor(la, 1440)).toHaveLength(2);
    expect(predicatesFor(la, 390)).toHaveLength(2);
    expect(predicatesFor(la, 800)).toHaveLength(1);
  });
  it('validateLayoutAssert flags unknown boxes and bad expressions', () => {
    expect(referencedBoxes('sidebar.x + sidebar.width <= main.x')).toEqual(['sidebar', 'main']);
    expect(validateLayoutAssert({ boxes: { sidebar: 'x' }, predicates: [{ assert: 'sidebar.x <= main.x' }, { assert: 'sidebar.x +' }] })).toEqual([
      "predicates[0]: box 'main' has no selector in boxes",
      expect.stringMatching(/^predicates\[1\]: /),
    ]);
  });
});

describe('committed layout.assert.json files', () => {
  const ROOT = join(__dirname, '..', '..', '..');
  const files: string[] = [];
  for (const kind of ['blocks', 'items']) {
    const dir = join(ROOT, 'registry', kind);
    for (const id of readdirSync(dir)) if (existsSync(join(dir, id, 'layout.assert.json'))) files.push(join(dir, id, 'layout.assert.json'));
  }
  it.each(files.map((f) => [f.slice(ROOT.length + 1), f]))('%s is valid', (_rel, f) => {
    expect(validateLayoutAssert(JSON.parse(readFileSync(f, 'utf8')))).toEqual([]);
  });
  it('app-frame carries the PRD geometric predicates at 1440', () => {
    const la = JSON.parse(readFileSync(join(ROOT, 'registry/blocks/app-frame/layout.assert.json'), 'utf8')) as LayoutAssert;
    expect(predicatesFor(la, 1440).map((p) => p.assert)).toEqual(['sidebar.x + sidebar.width <= main.x', 'abs(sidebar.y - main.y) <= 1']);
    expect(predicatesFor(la, 390)).toEqual([]);
  });
});
