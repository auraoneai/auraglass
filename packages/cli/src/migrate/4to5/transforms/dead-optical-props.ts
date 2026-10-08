/**
 * dead-optical-props (B20): remove 4.x optical props with no 5.0 pixel
 * equivalent — ior, caustics, 4.x `refraction`, chromatic, quality, tier —
 * from JSX and option objects. `refraction="v5"`/new-style values are kept.
 */
import { j, type FileUnit, type Transform, type TransformCtx, type TransformResult } from './shared.js';

const DEAD = new Set(['ior', 'caustics', 'chromatic', 'quality', 'tier']);

function literalValue(v: unknown): string | undefined {
  const n = v as { type?: string; value?: unknown; expression?: { type?: string; value?: unknown } } | null | undefined;
  if (!n) return undefined;
  if (n.type === 'Literal' || n.type === 'StringLiteral') return String(n.value);
  if (n.type === 'JSXExpressionContainer' && n.expression) {
    const e = n.expression;
    if (e.type === 'Literal' || e.type === 'StringLiteral') return String(e.value);
  }
  return undefined;
}

function isDeadRefraction(attr: { name?: { name?: string }; value?: unknown }): boolean {
  const v = literalValue(attr.value);
  // new-style refraction values are part of 5.0 material, keep them.
  if (v === undefined) return true; // dynamic 4.x refraction: remove (4.x had numeric/degree values)
  return !['none', 'subtle', 'standard', 'strong', 'v5', 'glass', 'poly', 'vector'].includes(v);
}

function applyCode(source: string): TransformResult {
  const root = j(source);
  const changes: TransformResult['changes'] = [];
  root.find(j.JSXOpeningElement).forEach((p: any) => {
    const before = (p.node.attributes ?? []).length;
    p.node.attributes = (p.node.attributes ?? []).filter((a: any) => {
      const attr = a as { type?: string; name?: { name?: string }; value?: unknown };
      if (attr.type !== 'JSXAttribute' || !attr.name?.name) return true;
      const n = attr.name.name;
      if (DEAD.has(n)) {
        changes.push({ transform: 'dead-optical-props', description: `remove ${n}` });
        return false;
      }
      if (n === 'refraction' && isDeadRefraction(attr)) {
        changes.push({ transform: 'dead-optical-props', description: 'remove 4.x refraction' });
        return false;
      }
      return true;
    }) as never;
    void before;
  });
  // object literals: { ior: 1.5, chromatic: true, ... }
  root.find(j.ObjectExpression).forEach((p: any) => {
    p.node.properties = (p.node.properties ?? []).filter((prop: any) => {
      const pr = prop as { type?: string; key?: { name?: string; value?: unknown }; value?: { type?: string; value?: unknown } };
      if (pr.type !== 'ObjectProperty' && pr.type !== 'Property') return true;
      const key = (pr.key?.name ?? pr.key?.value) as string | undefined;
      if (key && DEAD.has(key)) {
        changes.push({ transform: 'dead-optical-props', description: `remove option ${key}` });
        return false;
      }
      if (key === 'refraction') {
        const v = pr.value;
        if (v && (v.type === 'Literal' || v.type === 'StringLiteral')) {
          const val = String((v as { value?: unknown }).value);
          if (!['none', 'subtle', 'standard', 'strong', 'v5', 'glass', 'poly', 'vector'].includes(val)) {
            changes.push({ transform: 'dead-optical-props', description: 'remove 4.x refraction option' });
            return false;
          }
        }
      }
      return true;
    }) as never;
  });
  const out = changes.length ? root.toSource({ quote: 'single', reuseWhitespace: true }) : source;
  return { source: out, changes, todos: [] };
}

export const deadOpticalProps: Transform = {
  id: 'dead-optical-props',
  run(unit: FileUnit): TransformResult {
    if (unit.kind !== 'code' || !/\b(ior|caustics|chromatic|quality|tier|refraction)\b/.test(unit.source)) {
      return { source: unit.source, changes: [], todos: [] };
    }
    return applyCode(unit.source);
  },
};
