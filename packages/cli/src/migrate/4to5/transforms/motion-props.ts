/**
 * motion-props (MAT area): delete removed motion props on aura-glass
 * elements; `magnetic` -> aura-glass/motion magnetic() + TODO;
 * RippleButton -> Button (import specifier + JSX tag).
 */
import { j, renameJsxTag, type FileUnit, type Transform, type TransformResult } from './shared.js';
import { cutAttr, spliceSpans, type Span } from './strip.js';

const DOC = 'docs/motion.md';
const REMOVED_PROPS = new Set([
  'respectMotionPreference', 'motionPolicy', 'initialMotionPolicy', 'animationPreset',
  'disableAnimation', 'preset', 'motionPreset', 'reduceMotion', 'ignoreReducedMotion',
]);

function applyCode(source: string): TransformResult {
  const unit_source_placeholder = source;
  const root = j(source);
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];

  // 1. Delete removed motion props by text span (keeps the open-tag layout).
  const cuts: Span[] = [];
  root.find(j.JSXOpeningElement).forEach((p: any) => {
    for (const a of p.node.attributes ?? []) {
      const at = a as { type?: string; name?: { name?: string }; start?: number; end?: number };
      if (at.type !== 'JSXAttribute' || !at.name?.name || at.start === undefined || at.end === undefined) continue;
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
  run(unit: FileUnit): TransformResult {
    if (unit.kind !== 'code') return { source: unit.source, changes: [], todos: [] };
    const has = [...REMOVED_PROPS, 'magnetic', 'RippleButton'].some((k) => unit.source.includes(k));
    if (!has) return { source: unit.source, changes: [], todos: [] };
    return applyCode(unit.source);
  },
};
