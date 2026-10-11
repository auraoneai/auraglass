#!/usr/bin/env node
// QUAL (REQ-QUAL-49; REQ-FIN-106; FIN-450): Storybook information-architecture lint.
//
//   node scripts/storybook/lint-titles.mjs [--index storybook-static/index.json] [--baseline <path>] [--json <out>]
//   node scripts/storybook/lint-titles.mjs --story-sort          print the storySort literal computed from the metas
//   node scripts/storybook/lint-titles.mjs --write-story-sort    rewrite the marked storySort block in .storybook/preview.tsx
//   node scripts/storybook/lint-titles.mjs --check-story-sort    exit 1 when preview.tsx's storySort differs from the computed one
//   node scripts/storybook/lint-titles.mjs --prune               shrink the expiring baseline (rows of check story-titles)
//
// Without --index the story set is computed from source (the same ids Storybook indexes). Violations are attributed
// to the owner of the story file (contracts/ownership.json) and printed per owner. Exit 1 when a violation is not in
// the expiring baseline (certification/baselines-gates/story-contract.json, PRD-F §4.3 rule 3).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, staticIndex, builtIndex, loadMetas, flagshipOrder } from './lib/story-static.mjs';
import { compare, formatByOwner, loadBaseline, packageVersion, pruneBaseline } from './lib/baseline.mjs';

/** REQ-QUAL-49: the exact top-level order. The nested array orders the children of `Flagships`. */
export const STORY_SORT_ORDER = ['Start Here', 'Material Lab', 'Scenes', 'Showcases', 'Flagships',
  ['Controls', 'Overlays', 'App Shell', 'Data', 'AI', 'Media'], 'Core', 'Foundations', 'Migration'];
export const FLAGSHIP_GROUPS = STORY_SORT_ORDER[5];
/** Groups whose titles may be larger than the smallest flagship title (rule oversize-title). */
export const LARGE_GROUPS = ['Flagships', 'Showcases', 'Material Lab'];
export const MAX_COMPONENT_STORIES = 12;
export const RULES = ['version-segment', 'lowercase-leaf', 'glass-prefix', 'multi-group', 'leaf-not-meta-name',
  'too-many-stories', 'oversize-title', 'default-variants-only'];

/**
 * The storySort `order` Storybook receives: STORY_SORT_ORDER with, after each Flagships group, the flagship leaf names
 * in ComponentMeta.flagship order (Storybook orders a group's children by the array that follows the group's name).
 */
export function computeStorySort(metas) {
  const names = flagshipOrder(metas).map((m) => m.name);
  const groups = FLAGSHIP_GROUPS.flatMap((g) => [g, [...names]]);
  return STORY_SORT_ORDER.map((x) => (Array.isArray(x) ? groups : x));
}

/** Strip the per-group flagship arrays: what remains must deep-equal STORY_SORT_ORDER. */
export function storySortSkeleton(order) {
  return order.map((x) => (Array.isArray(x) ? x.filter((y) => !Array.isArray(y)) : x));
}

const split = (title) => String(title).split('/').map((s) => s.trim()).filter(Boolean);

/**
 * Lint the index entries. `entries`: [{ type, id, title, name, importPath, subject?, kind?, owner }]; `metas`: ComponentMeta[].
 * Returns [{ check:'story-titles', rule, key, owner, file, message }].
 */
export function lintTitles(entries, metas) {
  const metaByName = new Map(metas.map((m) => [m.name, m]));
  const stories = entries.filter((e) => e.type === 'story' || e.type === undefined);
  const titles = new Map();
  for (const e of stories) {
    if (!titles.has(e.title)) titles.set(e.title, []);
    titles.get(e.title).push(e);
  }
  const out = [];
  const push = (rule, title, list, message) => {
    const file = String(list[0]?.importPath ?? '').replace(/^\.\//, '');
    out.push({ check: 'story-titles', rule, key: title, owner: list[0]?.owner ?? 'PLAT', file, message: `${title}: ${message} (${file})` });
  };
  const subjectsOf = (list) => [...new Set(list.map((e) => e.subject).filter((s) => s && metaByName.has(s)))];

  // rule multi-group: one component (meta subject) titled under more than one top-level group
  const groupsBySubject = new Map();
  for (const [title, list] of titles) {
    for (const s of subjectsOf(list)) {
      if (!groupsBySubject.has(s)) groupsBySubject.set(s, new Set());
      groupsBySubject.get(s).add(split(title)[0]);
    }
  }
  const flagshipSizes = [...titles].filter(([t]) => split(t)[0] === 'Flagships').map(([, l]) => l.length);
  const smallestFlagship = flagshipSizes.length ? Math.min(...flagshipSizes) : null;

  for (const [title, list] of [...titles].sort(([a], [b]) => a.localeCompare(b))) {
    const segs = split(title);
    const leaf = segs[segs.length - 1] ?? '';
    const group = segs[0] ?? '';
    const subjects = subjectsOf(list);
    const isComponent = subjects.length > 0;
    const bad = segs.find((s) => /^v?\d+\.\d+/.test(s));
    if (bad) push('version-segment', title, list, `segment "${bad}" is a version`);
    if (/^[a-z]/.test(leaf)) push('lowercase-leaf', title, list, `leaf "${leaf}" starts lowercase`);
    if (/^Glass/.test(leaf)) push('glass-prefix', title, list, `leaf "${leaf}" carries the 4.x Glass prefix (D-14)`);
    for (const s of subjects) {
      const gs = groupsBySubject.get(s);
      if (gs.size > 1) push('multi-group', title, list, `component ${s} is titled under ${gs.size} groups (${[...gs].sort().join(', ')})`);
    }
    if (isComponent && !subjects.includes(leaf)) push('leaf-not-meta-name', title, list, `leaf "${leaf}" is not the subject's ComponentMeta.name (${subjects.join(', ')})`);
    const nonMatrix = list.filter((e) => e.kind !== 'matrix').length;
    if (isComponent && nonMatrix > MAX_COMPONENT_STORIES) push('too-many-stories', title, list, `${nonMatrix} non-matrix stories (> ${MAX_COMPONENT_STORIES})`);
    if (!LARGE_GROUPS.includes(group) && smallestFlagship !== null && list.length > smallestFlagship) {
      push('oversize-title', title, list, `${list.length} stories outside Flagships/Showcases/Material Lab (> smallest flagship title, ${smallestFlagship})`);
    }
    const names = [...new Set(list.map((e) => e.name))].sort();
    if (names.length === 2 && names[0] === 'Default' && names[1] === 'Variants') push('default-variants-only', title, list, 'story set is exactly {Default, Variants}');
  }
  return out;
}

/** The storySort literal inside the marked block of preview.tsx, as source text. */
export function renderStorySortBlock(order) {
  const q = (s) => `'${String(s).replace(/'/g, "\\'")}'`;
  const body = order.flatMap((x) => {
    if (!Array.isArray(x)) return [`          ${q(x)},`];
    return ['          [', ...x.map((y) => (Array.isArray(y) ? `            [${y.map(q).join(', ')}],` : `            ${q(y)},`)), '          ],'];
  });
  return ['      // <ag:story-sort> generated by `node scripts/storybook/lint-titles.mjs --write-story-sort` (REQ-QUAL-49)',
    '      storySort: {', '        order: [', ...body, '        ],', '      },', '      // </ag:story-sort>'].join('\n');
}

const BLOCK_RE = /^[ \t]*\/\/ <ag:story-sort>[^\n]*\n[\s\S]*?^[ \t]*\/\/ <\/ag:story-sort>/m;

function main(argv) {
  const arg = (n) => { const i = argv.indexOf(n); return i >= 0 ? argv[i + 1] : undefined; };
  const metas = loadMetas(ROOT);
  const previewPath = join(ROOT, '.storybook', 'preview.tsx');
  if (argv.includes('--story-sort')) { process.stdout.write(`${JSON.stringify(computeStorySort(metas), null, 2)}\n`); return 0; }
  if (argv.includes('--write-story-sort') || argv.includes('--check-story-sort')) {
    const src = readFileSync(previewPath, 'utf8');
    if (!BLOCK_RE.test(src)) { console.error('lint-titles: .storybook/preview.tsx has no // <ag:story-sort> block'); return 1; }
    const next = src.replace(BLOCK_RE, renderStorySortBlock(computeStorySort(metas)));
    if (argv.includes('--check-story-sort')) {
      if (next !== src) { console.error('lint-titles: storySort in .storybook/preview.tsx is stale; run node scripts/storybook/lint-titles.mjs --write-story-sort'); return 1; }
      console.log('lint-titles: storySort matches the ComponentMeta.flagship order');
      return 0;
    }
    writeFileSync(previewPath, next);
    console.log('lint-titles: wrote storySort into .storybook/preview.tsx');
    return 0;
  }
  const indexPath = arg('--index');
  if (indexPath && !existsSync(indexPath)) { console.error(`lint-titles: ${indexPath} does not exist (build Storybook first)`); return 1; }
  const { entries } = indexPath ? builtIndex(indexPath, ROOT) : staticIndex(ROOT);
  const violations = lintTitles(entries, metas);
  if (argv.includes('--prune')) { console.log(`lint-titles: pruned ${pruneBaseline(violations, ['story-titles'])} stale rows`); return 0; }
  const baseline = loadBaseline(ROOT, arg('--baseline'));
  const r = compare(violations, baseline, { checks: ['story-titles'], version: packageVersion(ROOT) });
  const json = arg('--json');
  if (json) writeFileSync(json, `${JSON.stringify({ source: indexPath ?? 'static', ...r }, null, 2)}\n`);
  console.log(`lint-titles: ${entries.length} entries, ${violations.length} violations (${r.baselined.length} baselined, ${r.introduced.length} introduced, ${r.stale.length} stale baseline rows${r.expired ? ', baseline expired at RC-1' : ''})`);
  if (r.baselined.length) console.log(`baselined, per owner:\n${formatByOwner(r.baselined)}`);
  if (r.introduced.length) { console.error(`FAIL introduced, per owner:\n${formatByOwner(r.introduced)}`); return 1; }
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv.slice(2)));
