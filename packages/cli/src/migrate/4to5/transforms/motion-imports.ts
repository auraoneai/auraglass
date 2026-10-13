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
    // Side-effect imports have no specifiers to begin with and must survive.
    const hadSpecifiers = (p.node.specifiers ?? []).length > 0;
    p.node.specifiers = kept as never;
    if (hadSpecifiers && kept.length === 0) j(p).remove();
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
  /* The unwrap itself is textual (after printing): an AST node swap
     reprints the enclosing return and collapses its formatting. Here we
     only record that a provider is present; tags are stripped line-wise
     in step 4. */
  let sawReducedProvider = false;
  root.find(j.JSXElement).forEach((p: any) => {
    if (isReducedProvider(p.node.openingElement?.name)) sawReducedProvider = true;
  });
  if (sawReducedProvider) {
    changes.push({ transform: 'motion-imports', description: 'unwrap ReducedMotionProvider' });
  }

{}
  // 3. <Motion preset="x"> -> <div> with TODO comment (verbatim spec wording).
  root.find(j.JSXElement).forEach((p: any) => {
    const n = p.node.openingElement?.name as { name?: string } | undefined;
    if (n?.name !== 'Motion') return;
    const preset = (p.node.openingElement?.attributes ?? []).find((a: any) => (a as { name?: { name?: string } }).name?.name === 'preset') as { value?: { value?: unknown } } | undefined;
    const presetName = String(preset?.value?.value ?? '');
    const kids = (p.node.children ?? []).filter((c: any) => (c as { type?: string }).type !== 'JSXText' || ((c as { value?: string }).value ?? '').trim() !== '');
    const keptAttrs = ((p.node.openingElement?.attributes ?? []) as Array<{ name?: { name?: string } }>)
      .filter((a) => a.name?.name !== 'preset');
    const el = j.jsxElement(
      j.jsxOpeningElement(j.jsxIdentifier('div'), keptAttrs as never, (p.node.openingElement?.selfClosing ?? false) as never),
      j.jsxClosingElement(j.jsxIdentifier('div')),
      kids as never,
    );
    /* Spec TODO as leading comments on the enclosing statement (recast
       prints them above `return`, and after `export` for declarations). */
    let stmt = p as unknown as { parent?: { node?: { type?: string } }; node?: { type?: string } } | null;
    while (stmt && !/^(ReturnStatement|ExpressionStatement|VariableDeclaration)$/.test(String(stmt.node?.type ?? ''))) {
      stmt = (stmt as { parent?: typeof stmt }).parent ?? null;
    }
    if (stmt?.node) {
      (stmt.node as { comments?: unknown[] }).comments = [
        ...(((stmt.node as { comments?: unknown[] }).comments) ?? []),
        { type: 'CommentLine', value: ` TODO(aura-glass 5): Motion preset="${presetName}" has no 5.x equivalent — attach a`, leading: true },
        { type: 'CommentLine', value: ' Shared/motionTokens-driven transition, see docs/motion.md', leading: true },
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
  /* Removing the import a file-leading comment was attached to can drop it
     in reprint; restore a lost leading line comment verbatim. */
  const lead = source.split('\n')[0] ?? '';
  if (lead.startsWith('//') && !out.startsWith(lead)) out = `${lead}\n${out}`;

  if (sawReducedProvider) {
    /* Strip the provider's two tag lines and dedent its children one level. */
    for (let round = 0; round < 20; round += 1) {
      const lines = out.split('\n');
      const openAt = lines.findIndex((l) => /<ReducedMotionProvider[\s>]/.test(l));
      if (openAt < 0) break;
      const closeAt = lines.findIndex((l, i) => i > openAt && /<\/ReducedMotionProvider>/.test(l));
      if (closeAt < 0) break;
      const openIndent = /^(\s*)/.exec(lines[openAt]!)?.[1] ?? '';
      const inner = lines.slice(openAt + 1, closeAt).map((l) => {
        const m = /^(\s*)/.exec(l);
        return m && m[1].startsWith(`${openIndent}  `) ? l.slice(2) : l;
      });
      out = [...lines.slice(0, openAt), ...inner, ...lines.slice(closeAt + 1)].join('\n');
    }
  }

  let tokenRewrites = 0;
  out = out.replace(/\bANIMATION\.DURATION\.(\w+)/g, (m: any, k: string) => {
    const to = DURATION_MAP[k];
    if (to) {
      tokenRewrites += 1;
      changes.push({ transform: 'motion-imports', description: `ANIMATION.DURATION.${k} -> motionTokens.duration.${to}` });
      return `motionTokens.duration.${to}`;
    }
    todos.push({ transform: 'motion-imports', reason: `unmapped ANIMATION.DURATION.${k}`, doc: DOC });
    return m;
  });

  /* bounce/elastic easings: rewrite and leave the guidance as comment lines
     directly above the line that used them. */
  {
    const lines = out.split('\n');
    const next: string[] = [];
    for (const line of lines) {
      const names = [...line.matchAll(/\b(?:ANIMATION\.EAS(?:E|ING)|easing)\.(bounce|elastic|spring|springy)\b/g)].map((m) => m[1]!);
      if (names.length) {
        const indent = /^[ \t]*/.exec(line)?.[0] ?? '';
        for (const name of [...new Set(names)]) {
          next.push(`${indent}// TODO(aura-glass 5): ${name} easing has no 5.x token — mapped to ease.standard,`);
          next.push(`${indent}// re-time against motionTokens, see ${DOC}`);
          changes.push({ transform: 'motion-imports', description: `${name} easing -> motionTokens.ease.standard` });
          todos.push({ transform: 'motion-imports', reason: `${name} easing has no 5.x equivalent — using ease.standard`, doc: DOC });
        }
        tokenRewrites += names.length;
        next.push(line.replace(/\b(?:ANIMATION\.EAS(?:E|ING)|easing)\.(?:bounce|elastic|spring|springy)\b/g, 'motionTokens.ease.standard'));
      } else {
        next.push(line);
      }
    }
    out = next.join('\n');
  }
  out = out.replace(/\bANIMATION\.EAS(?:E|ING)\.(\w+)/g, (m: any, k: string) => {
    if (EASE_TODOS.has(k)) return m;
    tokenRewrites += 1;
    changes.push({ transform: 'motion-imports', description: `ANIMATION.EASING.${k} -> motionTokens.ease.${k}` });
    return `motionTokens.ease.${k}`;
  });

  /* Token rewrites moved the values under motionTokens: retarget the import
     when no ANIMATION.* reference remains. */
  if (tokenRewrites > 0 && !/\bANIMATION\./.test(out)) {
    out = out.replace(
      /import \{ ANIMATION \} from (["'])aura-glass\/tokens\1;/,
      (_m: string, q: string) => `import { motionTokens } from ${q}aura-glass/motion/tokens${q};`,
    );
  }

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
