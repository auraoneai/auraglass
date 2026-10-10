/* REQ-FIN-02 (REQ-MAT-29): the tint formula on the surface host is
   --_ag-alpha = min(1, max(floor, floor + (1 - floor) * --ag-glass-opacity)).
   The expression is taken from material.css with postcss (not a retyped
   copy), the var() references are substituted (floor 0.6 and each of the six
   --ag-glass-opacity inputs) and the resulting CSS math is evaluated: alpha
   stays in [floor, 1] and is non-decreasing. */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import postcss, { type Rule } from 'postcss';

const CSS_PATH = resolve(__dirname, '../../src/material/css/material.css');
const ast = postcss.parse(readFileSync(CSS_PATH, 'utf8'));

const HOST = ':where([data-ag-surface])';
const FLOOR = 0.6;
const INPUTS = [-1, 0, 0.3, 0.7, 1, 2];

/** The --_ag-alpha declaration on the surface host baseline rule. */
function hostAlphaExpression(): string {
  let value: string | undefined;
  ast.walkDecls('--_ag-alpha', (d) => {
    const parent = d.parent as Rule | undefined;
    if (value === undefined && parent?.type === 'rule' && parent.selector.trim() === HOST) value = d.value;
  });
  if (value === undefined) throw new Error(`no --_ag-alpha declaration on ${HOST} in material.css`);
  return value.replace(/\s+/g, ' ').trim();
}

/** Substitute the var() inputs, then evaluate the CSS math (min/max/calc, + - * /). */
function evaluate(expr: string, floor: number, glassOpacity: number): number {
  const substituted = expr
    .replace(/var\(--_ag-tint-floor\)/g, String(floor))
    .replace(/var\(--ag-glass-opacity(?:,\s*[^)]*)?\)/g, `(${glassOpacity})`);
  if (/var\(/.test(substituted)) throw new Error(`unsubstituted var() in ${substituted}`);
  const js = substituted.replace(/\bcalc\(/g, '(').replace(/\bmin\(/g, 'Math.min(').replace(/\bmax\(/g, 'Math.max(');
  // only numbers, operators, parens, commas and the two Math calls may remain
  if (!/^(?:[\d.\s+\-*/(),]|Math\.min|Math\.max)+$/.test(js)) throw new Error(`unexpected token in ${js}`);
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${js});`)() as number;
}

describe('REQ-MAT-29 tint formula (evaluated from material.css)', () => {
  const expr = hostAlphaExpression();

  it('the host formula is the REQ-MAT-29 formula', () => {
    expect(expr).toBe(
      'min(1, max(var(--_ag-tint-floor), calc(var(--_ag-tint-floor) + (1 - var(--_ag-tint-floor)) * var(--ag-glass-opacity, 0))))',
    );
  });

  it.each([
    [-1, 0.6],
    [0, 0.6],
    [0.3, 0.72],
    [0.7, 0.88],
    [1, 1],
    [2, 1],
  ])('--ag-glass-opacity %p at floor 0.6 -> alpha %p', (opacity, expected) => {
    expect(evaluate(expr, FLOOR, opacity)).toBeCloseTo(expected, 10);
  });

  it('alpha stays inside [floor, 1] and is non-decreasing over the 6 inputs', () => {
    const values = INPUTS.map((o) => evaluate(expr, FLOOR, o));
    for (const a of values) {
      expect(a).toBeGreaterThanOrEqual(FLOOR);
      expect(a).toBeLessThanOrEqual(1);
    }
    for (let i = 1; i < values.length; i += 1) expect(values[i]!).toBeGreaterThanOrEqual(values[i - 1]!);
  });

  it('the evaluator rejects a formula that drops the floor clamp (failing fixture)', () => {
    const broken = 'calc(var(--_ag-tint-floor) + (1 - var(--_ag-tint-floor)) * var(--ag-glass-opacity, 0))';
    expect(evaluate(broken, FLOOR, -1)).toBeLessThan(FLOOR);
  });
});
