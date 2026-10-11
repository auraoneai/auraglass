/* Pure §6.3 checks shared by the conformance tests and the mutation self-test
   (tests/contract/__selftest__). Each returns Violations; the caller applies the
   failure policy through conform(). */
import { AG_ATTRIBUTES, BANNED_ATTRIBUTES } from '../../src/contracts/material';
import { LAYER_ORDER_STATEMENT, CSS_LAYERS, PUBLIC_CSS_VARS } from '../../src/contracts/tokens';
import { MOTION_CSS_VARS } from '../../src/contracts/motion';
import type { Violation } from './_conformance';

// ---------------------------------------------------------------- S-01 attributes
const REGISTRY = AG_ATTRIBUTES as Record<string, { setter: string; values: unknown }>;
/** Story-only attributes (setter QUAL, never in dist/) plus the seed marker (§1.2 R5). */
export const STORY_ONLY_ATTRIBUTES = [
  ...Object.entries(REGISTRY).filter(([, v]) => v.setter === 'QUAL').map(([k]) => k),
  'data-ag-seed',
] as const;
const BANNED = new Set<string>(BANNED_ATTRIBUTES);
const NEVER_SHIPS = new Set<string>(STORY_ONLY_ATTRIBUTES);

const TOKEN_RE = /data-ag-[a-z0-9]+(?:-[a-z0-9]+)*/g;
/** Distinct data-ag-* tokens in a text, in first-seen order. Template fragments such as
    `data-ag-${x}` are not tokens (the registry check covers their resolved values at render). */
export function attributeTokens(text: string): string[] {
  return [...new Set(text.match(TOKEN_RE) ?? [])];
}

/** data-ag-* attributes a JS/TS source *emits* (writes onto elements): JSX attributes,
    object keys spread onto elements, setAttribute/toggleAttribute calls. Selector reads
    (`[data-ag-x=...]`, getAttribute, hasAttribute, closest) are not emissions. */
export function attributeEmissions(text: string): string[] {
  const out = new Set<string>();
  const patterns = [
    /(?<![[\w-])(data-ag-[a-z0-9]+(?:-[a-z0-9]+)*)=[{"']/g,                 // JSX attribute
    /['"](data-ag-[a-z0-9]+(?:-[a-z0-9]+)*)['"]\s*:/g,                         // object key
    /(?:setAttribute|toggleAttribute)\(\s*['"](data-ag-[a-z0-9]+(?:-[a-z0-9]+)*)['"]/g,
  ];
  for (const re of patterns) for (const m of text.matchAll(re)) out.add(m[1]!);
  return [...out];
}

/** S-01 over shipped files (source closure or dist/). */
export function checkShippedAttributes(files: ReadonlyArray<{ file: string; text: string }>): Violation[] {
  const v: Violation[] = [];
  for (const { file, text } of files) {
    for (const attr of attributeTokens(text)) {
      if (BANNED.has(attr)) v.push({ seam: 'S-01', file, detail: `banned attribute ${attr} (BANNED_ATTRIBUTES)` });
      else if (NEVER_SHIPS.has(attr)) v.push({ seam: 'S-01', file, detail: `${attr} is story-only/seed-only and must never ship in dist/` });
      else if (!(attr in REGISTRY)) v.push({ seam: 'S-01', file, detail: `unregistered attribute ${attr} (not in AG_ATTRIBUTES)` });
    }
  }
  return v;
}

/** S-01 over a rendered DOM tree. Stories may render the story-only attributes (setter QUAL);
    data-ag-seed is never allowed once rendered from a real component. */
export function checkRenderedAttributes(root: Element, file: string, subject: string, opts: { story?: boolean } = {}): Violation[] {
  const v: Violation[] = [];
  const seen = new Set<string>();
  for (const el of [root, ...Array.from(root.querySelectorAll('*'))]) {
    for (const name of el.getAttributeNames()) {
      if (!name.startsWith('data-ag-') || seen.has(name)) continue;
      seen.add(name);
      if (BANNED.has(name)) v.push({ seam: 'S-01', file, detail: `${subject} renders banned attribute ${name}` });
      else if (NEVER_SHIPS.has(name) && !(opts.story && name !== 'data-ag-seed')) v.push({ seam: 'S-01', file, detail: `${subject} renders story-only/seed attribute ${name}` });
      else if (!(name in REGISTRY)) v.push({ seam: 'S-01', file, detail: `${subject} renders unregistered attribute ${name}` });
    }
  }
  return v;
}

// ---------------------------------------------------------------- S-04 layers
/** Strips block comments so a commented-out rule cannot satisfy or break the checks. */
export const stripCssComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Top-level `@layer <name> {` blocks of a stylesheet (names only, in order). */
export function topLevelLayerBlocks(css: string): { blocks: string[]; outside: string } {
  const text = stripCssComments(css);
  const blocks: string[] = [];
  let outside = '';
  let depth = 0;
  let i = 0;
  while (i < text.length) {
    if (depth === 0) {
      const m = /^@layer\s+([\w.-]+)\s*\{/.exec(text.slice(i));
      if (m) {
        blocks.push(m[1]!);
        depth = 1;
        i += m[0].length;
        continue;
      }
    }
    const ch = text[i]!;
    if (ch === '{') depth += 1;
    else if (ch === '}') depth -= 1;
    else if (depth === 0) outside += ch;
    i += 1;
  }
  return { blocks, outside };
}

/** S-04: line 1 is LAYER_ORDER_STATEMENT, zero !important, all rules inside exactly one
    `@layer <declared> { … }` block whose name equals the file's fragments/css declaration. */
export function checkLayerFile(file: string, css: string, declared: string | undefined, opts: { shipped?: boolean } = {}): Violation[] {
  const v: Violation[] = [];
  const firstStatement = stripCssComments(css).trimStart().split(';')[0]!.trim().replace(/\s+/g, ' ');
  if (`${firstStatement};` !== LAYER_ORDER_STATEMENT) {
    v.push({ seam: 'S-04', file, detail: `does not start with LAYER_ORDER_STATEMENT (first statement: ${JSON.stringify(firstStatement.slice(0, 80))})` });
  }
  const important = (stripCssComments(css).match(/!\s*important/gi) ?? []).length;
  if (important > 0) v.push({ seam: 'S-04', file, detail: `${important} !important declaration(s)` });
  if (opts.shipped) return v;
  if (declared === undefined) {
    v.push({ seam: 'S-45', file, detail: 'source CSS file has no fragments/css row (no layer declaration)' });
    return v;
  }
  if (!(CSS_LAYERS as readonly string[]).includes(declared)) v.push({ seam: 'S-04', file, detail: `fragments/css declares unknown layer ${declared}` });
  const body = stripCssComments(css).trimStart();
  const afterStatement = body.startsWith(LAYER_ORDER_STATEMENT) ? body.slice(LAYER_ORDER_STATEMENT.length) : body;
  const { blocks, outside } = topLevelLayerBlocks(afterStatement);
  const stray = outside.replace(/@(import|charset)[^;]*;/g, '').replace(/@layer\s+[\w.,\s-]+;/g, '').trim();
  if (blocks.length !== 1) v.push({ seam: 'S-04', file, detail: `expected exactly one top-level @layer ${declared} block, found ${blocks.length} (${blocks.join(', ') || 'none'})` });
  else if (blocks[0] !== declared) v.push({ seam: 'S-04', file, detail: `top-level layer ${blocks[0]} != fragments/css declaration ${declared}` });
  if (stray) v.push({ seam: 'S-04', file, detail: `rules outside the @layer block: ${JSON.stringify(stray.slice(0, 60))}` });
  return v;
}

// ---------------------------------------------------------------- S-03 / S-12 css vars
const flatPublic = Object.values(PUBLIC_CSS_VARS).flat() as string[];
/** The frozen public set: S-03 PUBLIC_CSS_VARS (--ag-* members) plus S-12 MOTION_CSS_VARS. */
export const PUBLIC_AG_VARS = new Set<string>([...flatPublic.filter((n) => n.startsWith('--ag-')), ...MOTION_CSS_VARS]);
/** Contract readouts in the MAT-private namespace (--_ag-*), listed in PUBLIC_CSS_VARS. */
export const PUBLIC_PRIVATE_READOUTS = new Set<string>(flatPublic.filter((n) => n.startsWith('--_ag-')));

/** Custom properties a stylesheet *defines* (declarations `--x: …` and `@property --x`). */
export function definedCustomProperties(css: string): Set<string> {
  const text = stripCssComments(css);
  const out = new Set<string>();
  for (const m of text.matchAll(/(?:^|[;{\s])(--[A-Za-z0-9_-]+)\s*:/g)) out.add(m[1]!);
  for (const m of text.matchAll(/@property\s+(--[A-Za-z0-9_-]+)/g)) out.add(m[1]!);
  return out;
}

/** S-03: every --ag-* defined is public; every public var is defined somewhere. */
export function checkCssVars(defs: ReadonlyMap<string, readonly string[]>, publicVars: ReadonlySet<string> = PUBLIC_AG_VARS): Violation[] {
  const v: Violation[] = [];
  for (const [name, files] of defs) {
    if (name.startsWith('--ag-') && !publicVars.has(name)) {
      for (const file of files) v.push({ seam: 'S-03', file, detail: `defines ${name}, which is not in PUBLIC_CSS_VARS or MOTION_CSS_VARS (dead/undeclared public var)` });
    }
  }
  return v;
}

export function undefinedPublicVars(defs: ReadonlyMap<string, readonly string[]>, publicVars: ReadonlySet<string> = PUBLIC_AG_VARS): string[] {
  return [...publicVars].filter((n) => !defs.has(n)).sort();
}

// ---------------------------------------------------------------- S-31 meta shape
const TIERS = ['T0', 'T1', 'T2', 'preview'];
const RSC = ['server', 'client', 'mixed'];
const AUTOMATION = ['full', 'mostly', 'partial', 'manual', 'none'];
const META_LAYERS = ['chrome', 'overlay', 'transient', 'content'];
const META_KEYS = new Set(['name', 'owner', 'entry', 'tier', 'flagship', 'rsc', 'parts', 'states', 'variants', 'material', 'apg', 'budgetKb', 'migration']);
const isStrArr = (x: unknown): x is string[] => Array.isArray(x) && x.every((s) => typeof s === 'string');

/** Runtime form of `meta satisfies ComponentMeta` (S-31), field by field. */
export function checkMetaShape(file: string, m: Record<string, unknown>, ctx: { subpaths: ReadonlySet<string>; partRe: RegExp }): Violation[] {
  const v: Violation[] = [];
  const name = typeof m.name === 'string' ? m.name : '?';
  const bad = (detail: string, seam = 'S-31') => v.push({ seam, file, detail: `${name}: ${detail}` });
  if (typeof m.name !== 'string' || !/^[A-Z][A-Za-z0-9]*$/.test(m.name)) bad(`name ${JSON.stringify(m.name)} is not a PascalCase export name`);
  for (const k of Object.keys(m)) if (!META_KEYS.has(k)) bad(`unknown key ${k} (not in ComponentMeta)`);
  if (!['CMP', 'SURF', 'MAT'].includes(m.owner as string)) bad(`owner ${JSON.stringify(m.owner)} not in CMP|SURF|MAT`);
  if (typeof m.entry !== 'string' || !ctx.subpaths.has(m.entry)) bad(`entry ${JSON.stringify(m.entry)} is not an ENTRIES subpath`, 'S-35');
  if (!TIERS.includes(m.tier as string)) bad(`tier ${JSON.stringify(m.tier)} not in ${TIERS.join('|')}`);
  if (m.flagship !== undefined && !(Number.isInteger(m.flagship) && (m.flagship as number) >= 1 && (m.flagship as number) <= 44)) bad(`flagship ${JSON.stringify(m.flagship)} not an integer 1..44`);
  if (!RSC.includes(m.rsc as string)) bad(`rsc ${JSON.stringify(m.rsc)} not in ${RSC.join('|')}`);
  if (!isStrArr(m.parts)) bad('parts is not a string array');
  else {
    for (const p of m.parts) if (!ctx.partRe.test(p)) bad(`part ${JSON.stringify(p)} violates PART_NAME_RE`, 'S-33');
    if (new Set(m.parts).size !== m.parts.length) bad('parts has duplicates', 'S-33');
  }
  if (!isStrArr(m.states)) bad('states is not a string array');
  if (!m.variants || typeof m.variants !== 'object' || Array.isArray(m.variants) || !Object.values(m.variants).every(isStrArr)) bad('variants is not a Record<string, string[]>');
  if (m.material !== undefined) {
    const mat = m.material as { layer?: unknown; refractionEligible?: unknown };
    if (!META_LAYERS.includes(mat.layer as string)) bad(`material.layer ${JSON.stringify(mat.layer)} not in ${META_LAYERS.join('|')}`);
    if (mat.refractionEligible !== undefined && typeof mat.refractionEligible !== 'boolean') bad('material.refractionEligible is not boolean');
  }
  if (m.apg !== undefined && typeof m.apg !== 'string') bad('apg is not a string');
  if (m.budgetKb !== undefined && !(typeof m.budgetKb === 'number' && m.budgetKb > 0)) bad(`budgetKb ${JSON.stringify(m.budgetKb)} is not a positive number`);
  if (!Array.isArray(m.migration)) bad('migration is not an array');
  else {
    for (const [i, r] of (m.migration as Array<Record<string, unknown>>).entries()) {
      if (typeof r.from !== 'string') bad(`migration[${i}].from is not a string`);
      if (!AUTOMATION.includes(r.automation as string)) bad(`migration[${i}].automation ${JSON.stringify(r.automation)} not in ${AUTOMATION.join('|')}`);
      if (typeof r.compat !== 'boolean') bad(`migration[${i}].compat is not boolean`);
      for (const [p, val] of Object.entries((r.props as Record<string, unknown>) ?? {})) {
        const ok = val === null || typeof val === 'string' || (typeof val === 'object' && typeof (val as { to?: unknown }).to === 'string');
        if (!ok) bad(`migration[${i}].props.${p} is not string | {to, values?} | null`);
      }
      if (r.selectors !== undefined && !Object.values(r.selectors as object).every((s) => typeof s === 'string')) bad(`migration[${i}].selectors values are not strings`);
    }
  }
  return v;
}
