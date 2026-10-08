/**
 * motion-imports (MAT area, REQ-MOT-T21):
 *  - useReducedMotion / useEnhancedReducedMotion hook calls ->
 *    usePreference('motion') !== 'full' (import specifier becomes usePreference)
 *  - unwrap <ReducedMotionProvider> (NOT MotionPreferenceProvider — core providers)
 *  - <Motion preset="…"> -> plain <div> + TODO marker (multi-line, spec wording)
 *  - ANIMATION.DURATION.normal -> motionTokens.duration.small;
 *    bounce/elastic easings -> ease.standard + TODO
 */
import { j, type FileUnit, type Transform, type TransformResult } from './shared.js';

const HOOKS = new Set(['useReducedMotion', 'useEnhancedReducedMotion']);
const DOC = 'docs/motion.md';

const DURATION_MAP: Record<string, string> = {
  instant: 'instant', fast: 'fast', normal: 'small', slow: 'large', slower: 'xlarge',
};
const EASE_TODOS = new Set(['bounce', 'elastic', 'spring', 'springy']);

function applyCode(source: string): TransformResult {
  const root = j(source);
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];

  // 1. Hook calls -> usePreference('motion') !== 'full'
  const hookLocals = new Set<string>();
  root.find(j.ImportDeclaration).forEach((p: any) => {
    const src = String((p.node.source as { value?: unknown }).value ?? '');
    if (!/^(aura-glass|@auraglass\/)/.test(src)) return;
    const kept: typeof p.node.specifiers = [];
    let needPreference = false;
    for (const s of p.node.specifiers ?? []) {
      const imp = s.type === 'ImportSpecifier' ? (((s.imported as { name?: string }).name ?? (s.imported as { value?: unknown }).value) as string) : undefined;
      const local = (s.local as { name?: string })?.name;
      if (imp && HOOKS.has(imp) && local) {
        hookLocals.add(local);
        needPreference = true;
        changes.push({ transform: 'motion-imports', description: `${imp} -> usePreference('motion')` });
        continue;
      }
      if (imp === 'ReducedMotionProvider' && local) {
        hookLocals.add(`provider:${local}`);
        needPreference = needPreference || false;
        changes.push({ transform: 'motion-imports', description: 'drop ReducedMotionProvider import' });
        continue;
      }
      kept.push(s);
    }
    if (needPreference && !kept.some((s: any) => (((s as { imported?: { name?: string } }).imported?.name) === 'usePreference'))) {
      kept.push(j.importSpecifier(j.identifier('usePreference')) as never);
    }
    p.node.specifiers = kept as never;
    if (kept.length === 0) j(p).remove();
  });

  for (const name of hookLocals) {
    if (name.startsWith('provider:')) continue;
    root.find(j.CallExpression, { callee: { type: 'Identifier', name } }).forEach((p: any) => {
      const call = j.binaryExpression(
        '!==',
        j.callExpression(j.identifier('usePreference'), [j.literal('motion')] as never),
        j.literal('full'),
      );
      j(p).replaceWith(call as never);
    });
  }

  // 2. Unwrap <ReducedMotionProvider>…</…> (innermost first).
  const isReducedProvider = (n: unknown): boolean => {
    const t = n as { type?: string; name?: string; property?: { name?: string } };
    const nm = t.type === 'JSXIdentifier' ? t.name : t.property?.name;
    return nm === 'ReducedMotionProvider' || hookLocals.has(`provider:${nm}`);
  };
  let guard = 0;
  for (;;) {
    let did = false;
    root.find(j.JSXElement).forEach((p: any) => {
      if (!isReducedProvider(p.node.openingElement?.name)) return;
      const kids = (p.node.children ?? []).filter((c: any) => (c as { type?: string }).type !== 'JSXText' || ((c as { value?: string }).value ?? '').trim() !== '');
      j(p).replaceWith((kids.length === 1 ? kids[0]! : j.jsxFragment(j.jsxOpeningFragment(), j.jsxClosingFragment(), p.node.children ?? [])) as never);
      did = true;
      changes.push({ transform: 'motion-imports', description: 'unwrap ReducedMotionProvider' });
    });
    if (!did || guard++ > 20) break;
  }

  const pendingComments: string[] = [];
  // 3. <Motion preset="x"> -> <div> with TODO comment (verbatim spec wording).
  root.find(j.JSXElement).forEach((p: any) => {
    const n = p.node.openingElement?.name as { name?: string } | undefined;
    if (n?.name !== 'Motion') return;
    const preset = (p.node.openingElement?.attributes ?? []).find((a: any) => (a as { name?: { name?: string } }).name?.name === 'preset') as { value?: { value?: unknown } } | undefined;
    const presetName = String(preset?.value?.value ?? '');
    const kids = (p.node.children ?? []).filter((c: any) => (c as { type?: string }).type !== 'JSXText' || ((c as { value?: string }).value ?? '').trim() !== '');
    const el = j.jsxElement(
      j.jsxOpeningElement(j.jsxIdentifier('div'), [] as never),
      j.jsxClosingElement(j.jsxIdentifier('div')),
      kids as never,
    );
    // Attach the spec TODO as leading // comments on the enclosing statement.
    let stmt = p as unknown as { parent?: { node?: { type?: string } }; node?: { type?: string } } | null;
    while (stmt && !/^(ReturnStatement|ExpressionStatement|VariableDeclaration)$/.test(String(stmt.node?.type ?? ''))) {
      stmt = (stmt as { parent?: typeof stmt }).parent ?? null;
    }
    if (stmt?.node) {
      (stmt.node as { comments?: unknown[] }).comments = [
        ...( ((stmt.node as { comments?: unknown[] }).comments) ?? []),
        { type: 'CommentLine', value: ` TODO(aura-glass 5): Motion preset="${presetName}" has no 5.x equivalent — attach a` },
        { type: 'CommentLine', value: ' Shared/motionTokens-driven transition, see docs/motion.md' },
      ];
    }
    j(p).replaceWith(el as never);
    changes.push({ transform: 'motion-imports', description: `Motion preset="${presetName}" -> div` });
    todos.push({
      transform: 'motion-imports',
      reason: `Motion preset="${presetName}" has no 5.x equivalent — attach a Shared/motionTokens-driven transition`,
      doc: DOC,
    });
  });
  // Drop Motion import specifiers.
  root.find(j.ImportDeclaration).forEach((p: any) => {
    const src = String((p.node.source as { value?: unknown }).value ?? '');
    if (!/^(aura-glass|@auraglass\/)/.test(src)) return;
    const kept = (p.node.specifiers ?? []).filter((s: any) => (((s as { imported?: { name?: string } }).imported?.name) !== 'Motion'));
    if (kept.length !== (p.node.specifiers?.length ?? 0)) {
      p.node.specifiers = kept as never;
      if (kept.length === 0) j(p).remove();
    }
  });

  // 4. Token rewrites: ANIMATION.DURATION.x -> motionTokens.duration.y; ease bounce/elastic -> ease.standard + TODO.
  let out = root.toSource({ quote: 'single', reuseWhitespace: true });
  for (const c of pendingComments) {
    out = out.replace(/^([ \t]*)return /m, `$1// ${c}\n$1// Shared/motionTokens-driven transition, see docs/motion.md\n$1return `);
  }
  out = out.replace(/\bANIMATION\.DURATION\.(\w+)/g, (m: any, k: string) => {
    const to = DURATION_MAP[k];
    if (to) {
      changes.push({ transform: 'motion-imports', description: `ANIMATION.DURATION.${k} -> motionTokens.duration.${to}` });
      return `motionTokens.duration.${to}`;
    }
    todos.push({ transform: 'motion-imports', reason: `unmapped ANIMATION.DURATION.${k}`, doc: DOC });
    return m;
  }).replace(/\b(ANIMATION\.EASE|easing)\.(bounce|elastic|spring|springy)\b/g, () => {
    changes.push({ transform: 'motion-imports', description: 'bounce/elastic easing -> ease.standard' });
    todos.push({ transform: 'motion-imports', reason: 'bounce/elastic easing has no 5.x equivalent — using ease.standard', doc: DOC });
    return 'ease.standard';
  }).replace(/\bANIMATION\.EASE\.(\w+)/g, (m: any, k: string) => {
    if (EASE_TODOS.has(k)) return m;
    changes.push({ transform: 'motion-imports', description: `ANIMATION.EASE.${k} -> ease.${k}` });
    return `ease.${k}`;
  });

  return { source: out, changes, todos };
}

export const motionImports: Transform = {
  id: 'motion-imports',
  run(unit: FileUnit): TransformResult {
    if (unit.kind !== 'code') return { source: unit.source, changes: [], todos: [] };
    if (!/useReducedMotion|useEnhancedReducedMotion|ReducedMotionProvider|Motion|ANIMATION\./.test(unit.source)) {
      return { source: unit.source, changes: [], todos: [] };
    }
    return applyCode(unit.source);
  },
};
