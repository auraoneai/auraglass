/**
 * motion-props (MAT area): delete removed motion props on aura-glass
 * elements; `magnetic` -> aura-glass/motion magnetic() + TODO;
 * RippleButton -> Button (import specifier + JSX tag).
 *
 * Only 4.x elements lose these props: the element's tag must be bound by an
 * aura-glass import, and a 5.0 component (a rename target in the compiled
 * mappings) is left alone unless canonical-names renamed a 4.x name onto it in
 * this run. 5.0 components own some of these names as real props (TreeView
 * and Backdrop `preset`, Sheet `preset`), so migrated or native 5.0 code is
 * never rewritten and a second run changes nothing (REQ-PLAT-92).
 */
import { j, renameJsxTag, type FileUnit, type Transform, type TransformCtx, type TransformResult } from './shared.js';
import { cutAttr, spliceSpans, type Span } from './strip.js';

const DOC = 'docs/motion.md';
const REMOVED_PROPS = new Set([
  'respectMotionPreference', 'motionPolicy', 'initialMotionPolicy', 'animationPreset',
  'disableAnimation', 'preset', 'motionPreset', 'reduceMotion', 'ignoreReducedMotion',
]);

/** local name -> imported name, for every binding of an aura-glass import. */
function auraBindings(root: ReturnType<typeof j>): Map<string, { imported: string; namespace: boolean }> {
  const out = new Map<string, { imported: string; namespace: boolean }>();
  root.find(j.ImportDeclaration).forEach((p: any) => {
    const src = String((p.node.source as { value?: unknown }).value ?? '');
    if (!/^(?:aura-glass(?:\/|$)|@auraglass\/)/.test(src)) return;
    for (const s of p.node.specifiers ?? []) {
      const sAny = s as { type?: string; imported?: { name?: string; value?: unknown }; local?: { name?: string } };
      if (sAny.type === 'ImportSpecifier') {
        const imp = String(sAny.imported?.name ?? sAny.imported?.value ?? '');
        out.set(sAny.local?.name ?? imp, { imported: imp, namespace: false });
      } else if (sAny.type === 'ImportNamespaceSpecifier' && sAny.local?.name) {
        out.set(sAny.local.name, { imported: '', namespace: true });
      }
    }
  });
  return out;
}

function applyCode(source: string, ctx: TransformCtx | undefined): TransformResult {
  const unit_source_placeholder = source;
  const root = j(source);
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];
  const bound = auraBindings(root);
  const fiveNames = new Set(Object.values(ctx?.mappings.components ?? {})
    .map((c) => c.to?.split('.')[0]).filter((n): n is string => typeof n === 'string'));
  type JsxName = { type?: string; name?: string; object?: JsxName; property?: JsxName };
  const partsOf = (node: JsxName): string[] => node.type === 'JSXIdentifier'
    ? [node.name ?? '']
    : node.type === 'JSXMemberExpression' && node.object && node.property
      ? [...partsOf(node.object), ...partsOf(node.property)] : [];
  const elementInfo = (node: JsxName): { imported: string; legacy: boolean } | undefined => {
    const parts = partsOf(node);
    const binding = bound.get(parts[0] ?? '');
    if (!binding) return undefined;
    const imported = binding.namespace ? parts[1] : binding.imported;
    if (!imported) return undefined;
    const renamed = ctx?.renamedFrom?.get(parts.join('.'))?.size
      || ctx?.renamedFrom?.get(parts[0]!)?.size;
    return { imported, legacy: Boolean(renamed) || !fiveNames.has(imported) };
  };
  // These are current component props, including props produced earlier in
  // this migration (for example GlassActionSheet.actions -> Sheet.preset).
  const presetOwners = new Set(['TreeView', 'Backdrop', 'Sheet']);

  // 1. Delete removed motion props by text span (keeps the open-tag layout).
  const cuts: Span[] = [];
  root.find(j.JSXOpeningElement).forEach((p: any) => {
    const element = elementInfo(p.node.name);
    if (!element?.legacy) return;
    for (const a of p.node.attributes ?? []) {
      const at = a as { type?: string; name?: { name?: string }; start?: number; end?: number };
      if (at.type !== 'JSXAttribute' || !at.name?.name || at.start === undefined || at.end === undefined) continue;
      if (at.name.name === 'preset' && presetOwners.has(element.imported)) continue;
      if (REMOVED_PROPS.has(at.name.name)) {
        changes.push({ transform: 'motion-props', description: `remove ${at.name.name}` });
        cuts.push(cutAttr(unit_source_placeholder, { start: at.start, end: at.end }));
      } else if (at.name.name === 'magnetic') {
        changes.push({ transform: 'motion-props', description: 'magnetic -> magnetic()' });
        todos.push({ transform: 'motion-props', reason: 'magnetic prop is now aura-glass/motion magnetic() — attach it via render or ref', doc: DOC });
        cuts.push(cutAttr(unit_source_placeholder, { start: at.start, end: at.end }));
      }
    }
  });

  // 2. RippleButton -> Button (on the span-edited source).
  void root;
  let out = spliceSpans(source, cuts);
  if (/\bRippleButton\b/.test(out)) {
    const tag = renameJsxTag(out, 'RippleButton', 'Button');
    if (tag.count) {
      out = tag.source;
      changes.push({ transform: 'motion-props', description: 'RippleButton -> Button (JSX)' });
    }
    out = out.replace(/\bRippleButton\b/g, 'Button');
  }
  if (todos.length) {
    const t = todos[0]!;
    const marker = `// TODO(aura-glass 5): ${t.reason}, see ${t.doc}`;
    if (!out.includes(marker)) out = `${marker}\n${out}`;
  }
  return { source: out, changes, todos };
}

export const motionProps: Transform = {
  id: 'motion-props',
  run(unit: FileUnit, ctx?: TransformCtx): TransformResult {
    if (unit.kind !== 'code') return { source: unit.source, changes: [], todos: [] };
    const has = [...REMOVED_PROPS, 'magnetic', 'RippleButton'].some((k) => unit.source.includes(k));
    if (!has) return { source: unit.source, changes: [], todos: [] };
    return applyCode(unit.source, ctx);
  },
};
