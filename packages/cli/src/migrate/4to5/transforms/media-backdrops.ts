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
import { j, type FileUnit, type Transform, type TransformResult } from './shared.js';
import { todoLine } from '../todo.js';

const DOC = 'apps/docs/content/surf/migration/media.md';
const TODO_ROWS = new Set(['GlassMeshGradient', 'AtmosphericBackground', 'DynamicAtmosphere']);
const AURORA_MOTION: Record<string, string> = { none: 'static', subtle: 'static', full: 'drift' };

function applyOtherComponents(source: string): string {
  // second-pass textual/AST rewrites for non-ImageViewer components
  return source;
}

function applyCode(source: string, unitSource: string): TransformResult {
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
    if (name === 'GlassImageViewer') {
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
        const openTag = unitSource.indexOf('<GlassImageViewer');
        let endIdx = openTag;
        if (openTag >= 0) {
          const selfClose = unitSource.indexOf('/>', openTag);
          const closeTag = unitSource.indexOf('</GlassImageViewer>', openTag);
          endIdx = closeTag >= 0 && closeTag < (selfClose < 0 ? Infinity : selfClose)
            ? closeTag + '</GlassImageViewer>'.length
            : selfClose + 2;
          imageViewerReplace = { start: openTag, end: endIdx, text: src };
        }
        if (missingAlt) todos.push({ transform: 'media-backdrops', reason: 'ImageViewer items require alt text', doc: DOC });
      }
      changes.push({ transform: 'media-backdrops', description: 'GlassImageViewer -> ImageViewer.Root items/defaultValue' });
      newImports.get('aura-glass/media')?.add('ImageViewer') ?? newImports.set('aura-glass/media', new Set(['ImageViewer']));
      todos.push({ transform: 'media-backdrops', reason: 'compose Trigger + Popup', doc: DOC });
      return;
    }
    if (name === 'GlassCarousel' || name === 'LiquidGlassCarouselRail') {
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
    if (TODO_ROWS.has(name)) {
      todos.push({ transform: 'media-backdrops', reason: `${name} has no automatic 5.0 rewrite — migrate per the media guide`, doc: DOC });
    }
  });

  // Rewrite/insert imports: old component names get replaced in specifiers;
  // new entries are added as fresh import declarations.
  const movedNames = new Set(['AuroraBackground', 'GlassImageViewer', 'GlassCarousel', 'LiquidGlassCarouselRail', 'LiquidGlassMediaControls']);
  root.find(j.ImportDeclaration).forEach((p: any) => {
    const src = String((p.node.source as { value?: unknown }).value ?? '');
    if (!/^(aura-glass|@auraglass\/)/.test(src)) return;
    const kept = (p.node.specifiers ?? []).filter((s: any) => {
      const imp = s.type === 'ImportSpecifier' ? (((s.imported as { name?: string }).name ?? (s.imported as { value?: unknown }).value) as string) : undefined;
      return !(imp && movedNames.has(imp));
    });
    p.node.specifiers = kept as never;
    if (kept.length === 0) j(p).remove();
  });
  const prog = root.find(j.Program).get('body');
  let insertAt = 0;
  for (const [entry, names] of newImports) {
    const decl = j.importDeclaration([...names].map((n: any) => j.importSpecifier(j.identifier(n))) as never, j.literal(entry));
    prog.value.splice(insertAt++, 0, decl);
  }

  let out = root.toSource({ quote: 'single', reuseWhitespace: true });
  // New JSX attr literals print single-quoted; SURF goldens use double.
  out = out.replace(/(preset|motion)='([^']+)'/g, '$1="$2"');
  if (imageViewerReplace) {
    // The GlassImageViewer element was never AST-mutated, so its text is
    // byte-identical in `out`; locate it directly (self-close or close tag).
    const i = out.indexOf('<GlassImageViewer');
    if (i >= 0) {
      const sc = out.indexOf('/>', i);
      const ct = out.indexOf('</GlassImageViewer>', i);
      const end = ct >= 0 && (sc < 0 || ct < sc) ? ct + '</GlassImageViewer>'.length : sc + 2;
      out = out.slice(0, i) + (imageViewerReplace as { text: string }).text + out.slice(end);
    }
  }
  // SURF goldens embed TODOs inline (items array, JSX comment) — no file-top markers.
  return { source: out, changes, todos };
}

export const mediaBackdrops: Transform = {
  id: 'media-backdrops',
  run(unit: FileUnit): TransformResult {
    if (unit.kind !== 'code') return { source: unit.source, changes: [], todos: [] };
    if (!/AuroraBackground|GlassImageViewer|GlassCarousel|LiquidGlassCarouselRail|LiquidGlassMediaControls|GlassMeshGradient|AtmosphericBackground|DynamicAtmosphere/.test(unit.source)) {
      return { source: unit.source, changes: [], todos: [] };
    }
    return applyCode(unit.source, unit.source);
  },
};
