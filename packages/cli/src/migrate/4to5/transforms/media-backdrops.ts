/**
 * media-backdrops (SURF area): prop rewrites for the media/backdrop family —
 * LiquidGlassMediaControls onPlayPause->onPlayingChange, compact->compose TODO;
 * GlassImageViewer images->items (ids img-<n>, TODO+alt:"" on missing alt,
 * initialIndex->defaultValue, wrap in .Root); GlassCarousel/
 * LiquidGlassCarouselRail infinite->loop, slidesToShow->slidesPerView,
 * autoPlay(+Interval)->autoplay={{interval}} (+TODO without provider);
 * AuroraBackground motion none|subtle->static, full->drift (->
 * aura-glass/backdrops preset="aurora"); GlassMeshGradient /
 * AtmosphericBackground / DynamicAtmosphere -> TODO rows.
 */
import { j, specNames, type FileUnit, type Transform, type TransformCtx, type TransformResult } from './shared.js';
import type { CompiledMappings } from '../mappings.js';
import { todoLine } from '../todo.js';

const DOC = 'apps/docs/content/surf/migration/media.md';
const TODO_ROWS_UNPREFIXED = ['AtmosphericBackground', 'DynamicAtmosphere'];
const AURORA_MOTION: Record<string, string> = { none: 'static', subtle: 'static', full: 'drift' };

/** 4.x Glass* names this transform handles, read from its spec (REQ-PLAT-90). */
interface MediaNames { mesh: string; imageViewer: string; carousel: string; todoRows: Set<string> }
function mediaNames(m: CompiledMappings): MediaNames {
  const [imageViewer] = specNames(m, 'media-backdrops', /images -> items/);
  const [carousel] = specNames(m, 'media-backdrops', /infinite -> loop/);
  const mesh = specNames(m, 'media-backdrops', /-> TODO rows/);
  return { mesh: specNames(m, 'media-backdrops', /colors\[\]/)[0]!, imageViewer: imageViewer!, carousel: carousel!, todoRows: new Set([...mesh, ...TODO_ROWS_UNPREFIXED]) };
}

function applyOtherComponents(source: string): string {
  // second-pass textual/AST rewrites for non-ImageViewer components
  return source;
}

function applyCode(source: string, unitSource: string, N: MediaNames): TransformResult {
  const IV_OPEN = `<${N.imageViewer}`;
  const IV_CLOSE = `</${N.imageViewer}>`;
  const root = j(source);
  const changes: TransformResult['changes'] = [];
  const todos: TransformResult['todos'] = [];
  const newImports = new Map<string, Set<string>>(); // entry -> names
  let imageViewerReplace: { start: number; end: number; text: string } | null = null;

  const tag = (n: unknown): string | undefined => {
    const t = n as { type?: string; name?: string };
    return t?.type === 'JSXIdentifier' ? t.name : undefined;
  };

  root.find(j.JSXElement).forEach((p: any) => {
    const open = p.node.openingElement;
    const name = tag(open?.name);
    if (!name) return;
    const attrs = (open?.attributes ?? []) as Array<{
      type?: string; name?: { name?: string };
      value?: { type?: string; value?: unknown; expression?: unknown };
    }>;
    const get = (n: string) => attrs.find((a: any) => a.name?.name === n);
    const lit = (a: (typeof attrs)[number] | undefined): string | undefined => {
      const v = a?.value;
      if (!v) return undefined;
      if (v.type === 'Literal' || v.type === 'StringLiteral') return String(v.value);
      const e = v.expression as { type?: string; value?: unknown } | undefined;
      if (e && (e.type === 'Literal' || e.type === 'StringLiteral')) return String(e.value);
      return undefined;
    };

    if (name === N.mesh) {
      (open!.name as { name: string }).name = 'Backdrop';
      if (p.node.closingElement) p.node.closingElement.name.name = 'Backdrop';
      open.attributes = [j.jsxAttribute(j.jsxIdentifier('preset'), j.stringLiteral('mesh')), ...attrs.filter(a => a.name?.name !== 'colors')];
      if (get('colors')) todos.push({ transform: 'media-backdrops', reason: `${N.mesh} colors[] has no 5.0 prop; mesh palettes come from S-03 colours`, doc: DOC });
      newImports.set('aura-glass/backdrops', new Set(['Backdrop']));
      changes.push({ transform: 'media-backdrops', description: `${N.mesh} -> Backdrop preset=mesh` });
      return;
    }
    if (name === 'AuroraBackground') {
      const m = lit(get('motion'));
      const mapped = m !== undefined ? AURORA_MOTION[m] : undefined;
      (open!.name as { name: string }).name = 'Backdrop';
      open!.attributes = [
        { type: 'JSXAttribute', name: { type: 'JSXIdentifier', name: 'preset' }, value: { type: 'Literal', value: 'aurora', extra: { raw: '"aurora"' } } },
        ...(m !== undefined
          ? [{ type: 'JSXAttribute', name: { type: 'JSXIdentifier', name: 'motion' }, value: { type: 'Literal', value: mapped ?? m, extra: { raw: `"${mapped ?? m}"` } } }]
          : []),
      ] as never;
      changes.push({ transform: 'media-backdrops', description: 'AuroraBackground -> Backdrop preset="aurora"' });
      if (m !== undefined && mapped === undefined) {
        todos.push({ transform: 'media-backdrops', reason: `AuroraBackground motion="${m}" unmapped`, doc: DOC });
      }
      const close = p.node.closingElement?.name as { name?: string } | undefined;
      if (close) close.name = 'Backdrop';
      newImports.get('aura-glass/backdrops')?.add('Backdrop') ?? newImports.set('aura-glass/backdrops', new Set(['Backdrop']));
      return;
    }
    if (name === N.imageViewer) {
      const images = get('images');
      const initIdx = get('initialIndex');
      const expr = images?.value?.expression as { type?: string; elements?: unknown[] } | undefined;
      if (expr?.type === 'ArrayExpression') {
        const parts: string[] = [];
        let missingAlt = false;
        for (let i = 0; i < (expr.elements ?? []).length; i += 1) {
          const el = expr.elements![i] as { properties?: Array<{ type?: string; key?: { name?: string; value?: unknown }; value?: unknown }> };
          const props = (el?.properties ?? []).filter((pr) => pr.type === 'ObjectProperty' || pr.type === 'Property');
          const hasAlt = props.some((pr) => (pr.key?.name ?? pr.key?.value) === 'alt');
          if (!hasAlt) missingAlt = true;
          const propSrcs = props.map((pr) => j(pr as never).toSource({ quote: 'single' }).trim());
          const itemProps = [`id: 'img-${i}'`, ...propSrcs, ...(hasAlt ? [] : ["alt: ''"])].join(', ');
          parts.push(`{ ${itemProps} }`);
        }
        const inner = parts.map((pp, i) => `        ${missingAlt && i === 0 ? '// TODO(aura-glass 5): ImageViewer items require alt text\n        ' : ''}${pp}`).join(',\n');
        const iv = `items={[\n${inner},\n      ]}`;
        void initIdx;
        if (initIdx) {
          const e = initIdx.value?.expression as { value?: unknown } | undefined;
          const n = typeof e?.value === 'number' ? e.value : e?.value;
          (initIdx as { rawAttr?: string }).rawAttr = `defaultValue="img-${n}"`;
        }
        const src = `(\n    <ImageViewer.Root\n      ${iv}${initIdx ? '\n      defaultValue="img-' + String((initIdx.value?.expression as { value?: unknown } | undefined)?.value ?? '') + '"' : ''}\n    >\n      {/* compose Trigger + Popup */}\n    </ImageViewer.Root>\n  )`;
        const openTag = unitSource.indexOf(IV_OPEN);
        let endIdx = openTag;
        if (openTag >= 0) {
          const selfClose = unitSource.indexOf('/>', openTag);
          const closeTag = unitSource.indexOf(IV_CLOSE, openTag);
          endIdx = closeTag >= 0 && closeTag < (selfClose < 0 ? Infinity : selfClose)
            ? closeTag + IV_CLOSE.length
            : selfClose + 2;
          imageViewerReplace = { start: openTag, end: endIdx, text: src };
        }
        if (missingAlt) todos.push({ transform: 'media-backdrops', reason: 'ImageViewer items require alt text', doc: DOC });
      }
      changes.push({ transform: 'media-backdrops', description: `${N.imageViewer} -> ImageViewer.Root items/defaultValue` });
      newImports.get('aura-glass/media')?.add('ImageViewer') ?? newImports.set('aura-glass/media', new Set(['ImageViewer']));
      todos.push({ transform: 'media-backdrops', reason: 'compose Trigger + Popup', doc: DOC });
      return;
    }
    if (name === N.carousel || name === 'LiquidGlassCarouselRail') {
      for (const a of attrs) {
        const n = a.name?.name;
        if (n === 'infinite') { a.name!.name = 'loop'; changes.push({ transform: 'media-backdrops', description: 'infinite -> loop' }); }
        else if (n === 'slidesToShow') { a.name!.name = 'slidesPerView'; changes.push({ transform: 'media-backdrops', description: 'slidesToShow -> slidesPerView' }); }
      }
      const autoPlay = get('autoPlay');
      const interval = get('autoPlayInterval');
      if (autoPlay || interval) {
        todos.push({ transform: 'media-backdrops', reason: 'autoplay requires an allowContinuous provider in 5.0', doc: DOC });
        changes.push({ transform: 'media-backdrops', description: 'autoPlay(+Interval) -> autoplay={{interval}}' });
      }
      (open!.name as { name: string }).name = 'Carousel';
      const close = p.node.closingElement;
      if (close) (close.name as { name?: string }).name = 'Carousel';
      newImports.get('aura-glass/media')?.add('Carousel') ?? newImports.set('aura-glass/media', new Set(['Carousel']));
      return;
    }
    if (name === 'LiquidGlassMediaControls') {
      const pp = get('onPlayPause');
      if (pp) { (pp.name as { name: string }).name = 'onPlayingChange'; changes.push({ transform: 'media-backdrops', description: 'onPlayPause -> onPlayingChange' }); }
      if (get('compact')) {
        todos.push({ transform: 'media-backdrops', reason: 'compose <MediaControls.PlayButton/><MediaControls.Scrubber/>', doc: DOC });
      }
      (open!.name as { name: string }).name = 'MediaControls';
      const close = p.node.closingElement;
      if (close) (close.name as { name?: string }).name = 'MediaControls';
      newImports.get('aura-glass/media')?.add('MediaControls') ?? newImports.set('aura-glass/media', new Set(['MediaControls']));
      return;
    }
    if (N.todoRows.has(name)) {
      todos.push({ transform: 'media-backdrops', reason: `${name} has no automatic 5.0 rewrite — migrate per the media guide`, doc: DOC });
    }
  });

  // Rewrite/insert imports: old component names get replaced in specifiers;
  // new entries are added as fresh import declarations.
  const movedNames = new Set([N.mesh, 'AuroraBackground', N.imageViewer, N.carousel, 'LiquidGlassCarouselRail', 'LiquidGlassMediaControls']);
  root.find(j.ImportDeclaration).forEach((p: any) => {
    const src = String((p.node.source as { value?: unknown }).value ?? '');
    if (!/^(aura-glass|@auraglass\/)/.test(src)) return;
    const kept = (p.node.specifiers ?? []).filter((s: any) => {
      const imp = s.type === 'ImportSpecifier' ? (((s.imported as { name?: string }).name ?? (s.imported as { value?: unknown }).value) as string) : undefined;
      return !(imp && movedNames.has(imp));
    });
    // Side-effect imports have no specifiers to begin with and must survive.
    const hadSpecifiers = (p.node.specifiers ?? []).length > 0;
    p.node.specifiers = kept as never;
    if (hadSpecifiers && kept.length === 0) {
      const comments = p.node.comments;
      if (comments?.length) {
        const first = root.find(j.Program).get('body').value.find((n: any) => n !== p.node);
        if (first) first.comments = [...comments, ...(first.comments ?? [])];
      }
      j(p).remove();
    }
  });
  const prog = root.find(j.Program).get('body');
  let insertAt = 0;
  const leadingComments = prog.value[0]?.comments;
  if (newImports.size && leadingComments) prog.value[0].comments = [];
  for (const [entry, names] of newImports) {
    const decl = j.importDeclaration([...names].map((n: any) => j.importSpecifier(j.identifier(n))) as never, j.literal(entry));
    if (insertAt === 0 && leadingComments) decl.comments = leadingComments;
    prog.value.splice(insertAt++, 0, decl);
  }

  let out = root.toSource({ quote: 'single', reuseWhitespace: true });
  // New JSX attr literals print single-quoted; SURF goldens use double.
  out = out.replace(/(preset|motion)='([^']+)'/g, '$1="$2"');
  if (imageViewerReplace) {
    // The image viewer element was never AST-mutated, so its text is
    // byte-identical in `out`; locate it directly (self-close or close tag).
    const i = out.indexOf(IV_OPEN);
    if (i >= 0) {
      const sc = out.indexOf('/>', i);
      const ct = out.indexOf(IV_CLOSE, i);
      const end = ct >= 0 && (sc < 0 || ct < sc) ? ct + IV_CLOSE.length : sc + 2;
      out = out.slice(0, i) + (imageViewerReplace as { text: string }).text + out.slice(end);
    }
  }
  if (todos.some(t => t.reason.startsWith(`${N.mesh} colors`))) {
    const marker = todoLine(`${N.mesh} colors[] has no 5.0 prop; mesh palettes come from S-03 colours`, DOC);
    out = out.replace(/^(import .*backdrops.*)$/m, `${marker}\n$1`);
  }
  // SURF goldens embed TODOs inline (items array, JSX comment) — no file-top markers.
  return { source: out, changes, todos };
}

export const mediaBackdrops: Transform = {
  id: 'media-backdrops',
  run(unit: FileUnit, ctx: TransformCtx): TransformResult {
    if (unit.kind !== 'code') return { source: unit.source, changes: [], todos: [] };
    const N = mediaNames(ctx.mappings);
    const handled = [N.mesh, 'AuroraBackground', N.imageViewer, N.carousel, 'LiquidGlassCarouselRail', 'LiquidGlassMediaControls', ...N.todoRows];
    if (!handled.some((n) => unit.source.includes(n))) {
      return { source: unit.source, changes: [], todos: [] };
    }
    return applyCode(unit.source, unit.source, N);
  },
};
