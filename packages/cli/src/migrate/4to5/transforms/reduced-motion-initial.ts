/**
 * reduced-motion-initial (MAT area, REQ-MOT-27): rewrite
 *   animate={c ? A : B} where one of A/B is "empty" ({}, undefined, false)
 * to unconditional animate=<nonempty>, and fold the gate into `initial`:
 *   empty-on-true  -> initial={c ? false : I}   (I = original initial)
 *   empty-on-false -> initial={c ? I : false}
 * Leaves `initial` absent when none existed. Text edits preserve formatting.
 */
import { j, type FileUnit, type Transform, type TransformResult } from './shared.js';

type Expr = { type?: string; properties?: unknown[]; name?: string; value?: unknown; operator?: string; argument?: unknown };

function isEmpty(e: Expr | undefined): boolean {
  if (!e) return false;
  if (e.type === 'ObjectExpression') return (e.properties ?? []).length === 0;
  if (e.type === 'Identifier') return e.name === 'undefined';
  if (e.type === 'Literal' || e.type === 'BooleanLiteral') return e.value === false || e.value === null;
  return false;
}

function applyCode(source: string): TransformResult {
  const root = j(source);
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];

  root.find(j.JSXOpeningElement).forEach((p: any) => {
    const attrs = (p.node.attributes ?? []) as Array<{
      type?: string; name?: { name?: string };
      value?: { type?: string; expression?: Expr };
    }>;
    const animate = attrs.find((a: any) => a.name?.name === 'animate');
    const expr = animate?.value?.expression;
    if (!expr || expr.type !== 'ConditionalExpression') return;
    const c = expr as unknown as { test: Expr; consequent: Expr; alternate: Expr };
    const test = c.test;
    // Determine which branch is empty (and normalize negated tests).
    let emptyOnTrue: boolean;
    let gate: Expr = test;
    const testIsNegated = test.type === 'UnaryExpression' && test.operator === '!';
    const cEmpty = isEmpty(c.consequent);
    const aEmpty = isEmpty(c.alternate);
    if (cEmpty && !aEmpty) {
      emptyOnTrue = !testIsNegated;
      if (testIsNegated) gate = test.argument as Expr;
      const nonempty = c.alternate;
      animate!.value!.expression = nonempty as never;
    } else if (aEmpty && !cEmpty) {
      emptyOnTrue = false;
      if (testIsNegated) {
        // !c ? X : {}  ->  c ? {} : X  i.e. empty-on-true under positive gate
        emptyOnTrue = true;
        gate = test.argument as Expr;
        animate!.value!.expression = c.consequent as never;
      } else {
        animate!.value!.expression = c.consequent as never;
      }
    } else {
      return; // neither branch empty — leave (dynamic, not our pattern)
    }
    const nameEl = (p.node.name as { name?: string }).name ?? 'element';
    void nameEl;

    const initial = attrs.find((a: any) => a.name?.name === 'initial');
    if (initial) {
      const inner = initial.value?.expression;
      const initExpr = (inner ?? j.literal(false)) as never;
      const cond = j.conditionalExpression(
        gate as never,
        (emptyOnTrue ? j.literal(false) : initExpr) as never,
        (emptyOnTrue ? initExpr : j.literal(false)) as never,
      );
      initial.value = { type: 'JSXExpressionContainer', expression: cond } as never;
    }
    // Spec: "leaves initial absent if none existed" — nothing to add otherwise.
    changes.push({ transform: 'reduced-motion-initial', description: 'fold reduced-motion gate into initial' });
    void todos;
  });

  const out = changes.length ? root.toSource({ quote: 'single', reuseWhitespace: true }) : source;
  return { source: out, changes, todos };
}

export const reducedMotionInitial: Transform = {
  id: 'reduced-motion-initial',
  run(unit: FileUnit): TransformResult {
    if (unit.kind !== 'code' || !/animate=\{[^}]*\?/.test(unit.source)) {
      return { source: unit.source, changes: [], todos: [] };
    }
    return applyCode(unit.source);
  },
};
