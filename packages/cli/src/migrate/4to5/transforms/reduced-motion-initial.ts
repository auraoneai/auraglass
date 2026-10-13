/**
 * reduced-motion-initial (MAT area, REQ-MOT-27): rewrite
 *   animate={c ? A : B} where one of A/B is "empty" ({}, undefined, false)
 * to unconditional animate=<nonempty>, and fold the gate into `initial`:
 *   empty-on-true  -> initial={c ? false : I}   (I = original initial)
 *   empty-on-false -> initial={c ? I : false}
 * The gate folds verbatim (negations kept). When no `initial` existed and the
 * branch was empty on true, one is inserted (`c ? false : undefined`).
 * Edits are source-text spans so surrounding formatting is preserved.
 */
import { j, type FileUnit, type Transform, type TransformResult } from './shared.js';

interface Edit { start: number; end: number; text: string }

/** Replace spans with text (sorted by offset desc; spans must not overlap). */
function applyEdits(source: string, edits: Edit[]): string {
  let out = source;
  for (const e of [...edits].sort((a, b) => b.start - a.start)) {
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
  }
  return out;
}

type Expr = {
  type?: string; properties?: unknown[]; name?: string; value?: unknown;
  start?: number; end?: number;
};

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
  const spans: Edit[] = [];
  const slice = (e: Expr): string => source.slice(e.start!, e.end!);

  root.find(j.JSXOpeningElement).forEach((p: any) => {
    const attrs = (p.node.attributes ?? []) as Array<{
      type?: string; name?: { name?: string }; start?: number; end?: number;
      value?: { type?: string; expression?: Expr; start?: number; end?: number };
    }>;
    const animate = attrs.find((a) => a.name?.name === 'animate');
    const expr = animate?.value?.expression;
    if (!expr || expr.type !== 'ConditionalExpression') return;
    if (animate?.value?.start === undefined || animate?.value?.end === undefined) return;
    const c = expr as unknown as { test: Expr; consequent: Expr; alternate: Expr };
    const cEmpty = isEmpty(c.consequent);
    const aEmpty = isEmpty(c.alternate);
    if (cEmpty === aEmpty) return; // both or neither empty — not our pattern
    const emptyOnTrue = cEmpty;
    const nonempty = emptyOnTrue ? c.alternate : c.consequent;
    if (nonempty.start === undefined || nonempty.end === undefined) return;
    if (c.test.start === undefined || c.test.end === undefined) return;
    const gateSrc = slice(c.test);

    spans.push({ start: animate.value.start, end: animate.value.end, text: `{${slice(nonempty)}}` });

    const initial = attrs.find((a) => a.name?.name === 'initial');
    if (initial?.value?.start !== undefined && initial?.value?.end !== undefined) {
      const inner = initial.value.expression;
      const initSrc = inner && inner.start !== undefined && inner.end !== undefined ? slice(inner) : 'false';
      const text = emptyOnTrue ? `{${gateSrc} ? false : ${initSrc}}` : `{${gateSrc} ? ${initSrc} : false}`;
      spans.push({ start: initial.value.start, end: initial.value.end, text });
    } else if (!initial && emptyOnTrue && animate.start !== undefined) {
      // Insert `initial={gate ? false : undefined}` before animate, keeping
      // the attribute layout: newline + animate's own indentation when the
      // tag is multiline, a single space when inline.
      const lineStart = source.lastIndexOf('\n', animate.start) + 1;
      const before = source.slice(lineStart, animate.start);
      const multiline = /^\s*$/.test(before);
      const text = multiline
        ? `initial={${gateSrc} ? false : undefined}\n${before}`
        : `initial={${gateSrc} ? false : undefined} `;
      spans.push({ start: animate.start, end: animate.start, text });
    }
    changes.push({ transform: 'reduced-motion-initial', description: 'fold reduced-motion gate into initial' });
  });

  return { source: spans.length ? applyEdits(source, spans) : source, changes, todos };
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
