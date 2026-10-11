/* scripts/docs/lib/migration-guide.mjs — REQ-PLAT-105 (REQ-FIN-43, FIN-C.3-11).
   Builds the 4.x → 5.0 migration guide from data, never from hand-typed names:

     template  apps/docs/templates/plat/migrate/5.mdx   hand-written prose only
                                                         (0 Glass[A-Z]\w+ tokens)
     output    apps/docs/generated/plat/migrate/5.md     route /plat/migrate/5

   The template carries one MDX comment directive per generated section,
   `{/* @generated <name> *\/}`, on a line of its own. assembleGuide() replaces
   each with the section body; an unknown, missing or repeated directive throws.

     codemods          one subsection per packages/cli catalogue transform:
                       automation, command, B-ids it serves, its `basic` fixture
     breaking-changes  docs/release/breaking-changes.json B1..Bn (#b-<n>) with
                       every deprecation entry under its B-id (#<entry.doc>)
     by-component      ComponentMeta.migration rows (props, selectors) per meta
     removed           codemod-fragment `removed` rows + entries with no
                       replacement, each with a registry or 4.x LTS pointer

   Output is Markdown in the subset apps/docs/lib/markdown.tsx renders (ATX
   headings with `{#id}`, GFM tables, fences, lists); no raw HTML or JSX. */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative, sep } from 'node:path';
import { loadFragments } from '../../../src/contracts/load-fragments.mjs';

export const TEMPLATE_PATH = 'apps/docs/templates/plat/migrate/5.mdx';
export const GUIDE_OUT = 'apps/docs/generated/plat/migrate/5.md';
export const GUIDE_ROUTE = '/plat/migrate/5';
export const CATALOGUE_PATH = 'packages/cli/src/migrate/4to5/catalogue.json';
export const SECTIONS = ['codemods', 'breaking-changes', 'by-component', 'removed'];
export const GLASS_TOKEN = /\bGlass[A-Z]\w+/g;
const FIXTURE_STREAMS = ['plat', 'cmp', 'mat', 'surf', 'qual'];
const DIRECTIVE = /^\{\/\*\s*@generated\s+([\w-]+)\s*\*\/\}\s*$/;
const LANG = { '.tsx': 'tsx', '.ts': 'ts', '.jsx': 'jsx', '.js': 'js', '.css': 'css', '.json': 'json', '.mjs': 'js' };

const toPosix = (p) => p.split(sep).join('/');
const code = (s) => {
  const str = String(s);
  const run = Math.max(0, ...[...str.matchAll(/`+/g)].map((m) => m[0].length));
  const tick = '`'.repeat(run + 1);
  return run ? `${tick} ${str} ${tick}` : `${tick}${str}${tick}`;
};
const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
/** Inline text: a leading `<` would start a raw-HTML block in the docs renderer. */
const text = (s) => String(s).replace(/^\s*</, '\\<');
const heading = (depth, title, id) => `${'#'.repeat(depth)} ${title} {#${id}}`;
const slugify = (name) => name.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[^\w-]+/g, '-').toLowerCase();

/** Entry anchor = the entry's own `doc` fragment (PRD: "#dep-<id> equal to its doc fragment"). */
export function entryAnchor(entry) {
  const id = String(entry.doc ?? '').replace(/^#/, '');
  if (!/^dep-[\w-]+$/.test(id)) throw new Error(`${entry.id}: doc '${entry.doc}' is not a #dep-<id> fragment`);
  return id;
}
export const bAnchor = (bId) => `b-${String(bId).replace(/^B/i, '')}`;
/** Transform anchors are the bare id, matching the `#<id>` fragments of catalogue docs and TODO markers. */
export const codemodAnchor = (id) => String(id);

// ---- breaking-changes ------------------------------------------------------

/**
 * Every register B-id (plus any B-id an entry names that the register lacks),
 * in numeric order, each followed by its deprecation entries.
 * opts.depth: heading depth of the B-ids; entries are one level deeper.
 * opts.codemodHref(id): link target of a codemod id (default: in-page anchor).
 */
export function breakingMd(entries, register = [], { depth = 3, codemodHref = (id) => `#${codemodAnchor(id)}` } = {}) {
  const byB = new Map(register.map((r) => [String(r.id), []]));
  const seen = new Set();
  for (const e of entries) {
    const a = entryAnchor(e);
    if (seen.has(a)) throw new Error(`duplicate deprecation anchor #${a} (${e.id})`);
    seen.add(a);
    const k = String(e.breaking);
    if (!byB.has(k)) byB.set(k, []);
    byB.get(k).push(e);
  }
  const out = [];
  const num = (b) => Number(String(b).replace(/^B/i, ''));
  for (const b of [...byB.keys()].sort((x, y) => num(x) - num(y))) {
    const reg = register.find((r) => String(r.id) === b);
    out.push(heading(depth, `${b}${reg?.title ? `: ${reg.title}` : ''}`, bAnchor(b)), '');
    if (reg) {
      const facts = [];
      if (reg.affected) facts.push(`- Affects: ${text(reg.affected)}`);
      if (reg.path) facts.push(`- Migration path: ${text(reg.path)}`);
      facts.push(`- Codemod: ${reg.codemod ? `[${code(reg.codemod)}](${codemodHref(reg.codemod)})` : 'none (manual change)'}`);
      if (reg.escapeHatch) facts.push(`- Escape hatch: ${text(reg.escapeHatch)}`);
      if (reg.cdIn) facts.push(`- Deprecation warnings ship in: ${code(reg.cdIn)}`);
      out.push(...facts, '');
    }
    const rows = [...byB.get(b)].sort((x, y) => String(x.id).localeCompare(String(y.id)));
    if (!rows.length) out.push(`No deprecation entry is filed under ${b}.`, '');
    for (const e of rows) {
      out.push(heading(depth + 1, `${e.id}: ${code(e.symbol)}`, entryAnchor(e)), '');
      out.push(`- Kind: ${code(e.kind)} · entry: ${code(e.entry)} · status: ${code(e.status)} · since ${code(e.since)} · removed in ${code(e.removeIn)}`);
      out.push(`- Replacement: ${e.replacement ? code(e.replacement) : 'none'}`);
      if (e.codemod) out.push(`- Codemod: [${code(e.codemod)}](${codemodHref(e.codemod)}) (automation: ${e.automation}): ${code(`npx @auraglass/cli migrate 4to5 --transform ${e.codemod}`)}`);
      if (e.compat) out.push(`- Keeps working in 5.x through ${code('aura-glass/compat')} as ${code(e.compat)}`);
      out.push('', text(e.message), '');
    }
  }
  return out.join('\n');
}

// ---- codemods --------------------------------------------------------------

function filesIn(dir) {
  return existsSync(dir) ? readdirSync(dir).sort().filter((f) => statSync(join(dir, f)).isFile()) : [];
}

/** All fixture case dirs for a transform across stream fragments: [{stream, name, dir}]. */
export function fixtureCases(root, id) {
  const out = [];
  for (const stream of FIXTURE_STREAMS) {
    const base = join(root, 'fragments/codemods', stream, 'fixtures', id);
    if (!existsSync(base)) continue;
    for (const name of readdirSync(base).sort()) {
      const dir = join(base, name);
      if (statSync(dir).isDirectory()) out.push({ stream, name, dir });
    }
  }
  return out;
}

/** The `basic` case (PLAT first, then stream order) with its input/output files, or null. */
export function basicFixture(root, id) {
  const c = fixtureCases(root, id).find((x) => x.name === 'basic');
  if (!c) return null;
  const files = filesIn(c.dir);
  const pick = (stem) => files.find((f) => f.replace(extname(f), '') === stem);
  const input = pick('input'); const output = pick('output');
  if (!input || !output) throw new Error(`${toPosix(relative(root, c.dir))}: basic fixture needs input.* and output.*`);
  const read = (f) => ({ path: toPosix(relative(root, join(c.dir, f))), lang: LANG[extname(f)] ?? '', text: readFileSync(join(c.dir, f), 'utf8') });
  return { stream: c.stream, input: read(input), output: read(output) };
}

function fence(lang, body) {
  const run = Math.max(2, ...[...body.matchAll(/`{3,}/g)].map((m) => m[0].length));
  const f = '`'.repeat(run + 1);
  return `${f}${lang}\n${body.replace(/\n$/, '')}\n${f}`;
}

export function codemodsMd(root, catalogue, register = [], { depth = 3 } = {}) {
  const transforms = catalogue.transforms ?? [];
  if (!transforms.length) throw new Error(`${CATALOGUE_PATH}: no transforms`);
  const out = [];
  for (const t of transforms) {
    out.push(heading(depth, code(t.id), codemodAnchor(t.id)), '');
    const serves = register.filter((r) => r.codemod === t.id).map((r) => `[${r.id}](#${bAnchor(r.id)})`);
    out.push(`- Kind: ${t.kind === 'core' ? 'core transform' : 'area transform'} · automation: ${code(t.automation)}`);
    out.push(`- Run alone: ${code(`npx @auraglass/cli migrate 4to5 --transform ${t.id}`)}`);
    if (serves.length) out.push(`- Breaking changes: ${serves.join(', ')}`);
    out.push('');
    const basic = basicFixture(root, t.id);
    if (basic) {
      out.push(`Fixture ${code(basic.input.path.replace(/\/input\.[^/]+$/, ''))}, before:`, '', fence(basic.input.lang, basic.input.text), '');
      out.push('After:', '', fence(basic.output.lang, basic.output.text), '');
    } else {
      const cases = fixtureCases(root, t.id).map((c) => code(toPosix(relative(root, c.dir))));
      out.push(cases.length
        ? `This transform has no \`basic\` fixture case. Its committed cases: ${cases.join(', ')}.`
        : 'This transform has no committed fixture case.', '');
    }
  }
  return out.join('\n');
}

// ---- by-component ----------------------------------------------------------

function propTarget(v) {
  if (v === null) return 'removed';
  if (typeof v === 'string') return code(v);
  const values = v.values ? ` (${Object.entries(v.values).map(([a, b]) => `${code(a)} → ${code(typeof b === 'string' ? b : JSON.stringify(b))}`).join(', ')})` : '';
  return `${v.to === null ? 'removed' : code(v.to)}${values}`;
}

/**
 * metas: [{ name, entry, file, migration: MigrationRow[], selectors?: [{from,to}] }].
 * Selector rows come from MigrationRow.selectors (contract S-31) and the
 * meta-level `selectors` array some stream metas carry.
 */
export function byComponentMd(metas, { depth = 3 } = {}) {
  const rows = metas.filter((m) => (m.migration ?? []).length).sort((a, b) => a.name.localeCompare(b.name));
  if (!rows.length) throw new Error('by-component: no ComponentMeta has migration rows');
  const out = [];
  for (const m of rows) {
    const importPath = m.entry === '.' ? 'aura-glass' : `aura-glass/${String(m.entry).replace(/^\.\//, '')}`;
    out.push(heading(depth, code(m.name), `component-${slugify(m.name)}`), '');
    out.push(`Import from ${code(importPath)}. Source: ${code(m.file)}.`, '');
    out.push('| 4.x export | Automation | Compat adapter |', '| --- | --- | --- |');
    for (const r of m.migration) out.push(`| ${cell(code(r.from))} | ${r.automation} | ${r.compat ? 'yes' : 'no'} |`);
    out.push('');
    const props = m.migration.flatMap((r) => Object.entries(r.props ?? {}).map(([p, v]) => [r.from, p, v]));
    if (props.length) {
      out.push('| 4.x export | 4.x prop | 5.0 |', '| --- | --- | --- |');
      for (const [from, p, v] of props) out.push(`| ${cell(code(from))} | ${cell(code(p))} | ${cell(propTarget(v))} |`);
      out.push('');
    }
    const sels = [
      ...m.migration.flatMap((r) => Object.entries(r.selectors ?? {}).map(([f, t]) => [f, t])),
      ...(Array.isArray(m.selectors) ? m.selectors.map((s) => [s.from, s.to]) : []),
    ];
    if (sels.length) {
      out.push('| 4.x selector | 5.0 selector |', '| --- | --- |');
      for (const [f, t] of sels) out.push(`| ${cell(code(f))} | ${cell(code(t))} |`);
      out.push('');
    }
  }
  return out.join('\n');
}

// ---- removed ---------------------------------------------------------------

/**
 * removedRows: codemod-fragment `removed` rows [{stream, symbol, entry, reason, registryItem?, doc}].
 * entries: deprecation entries; those with replacement null are listed too.
 * registryNames: Set of registry item/block names present in this tree.
 */
export function removedMd(removedRows, entries, registryNames, { depth = 3 } = {}) {
  const anchors = new Map(entries.map((e) => [entryAnchor(e), e]));
  const bySymbol = new Map(entries.map((e) => [`${e.entry}|${e.symbol}`, e]));
  const pointer = (registryItem) => {
    if (!registryItem) return `stay on the 4.x LTS line (${code('aura-glass@^4')}) for this API`;
    return registryNames.has(registryItem)
      ? `copy the registry item: ${code(`npx @auraglass/cli add ${registryItem}`)}`
      : `registry item ${code(registryItem)} (not in this release's registry; stay on 4.x LTS until it ships)`;
  };
  const link = (row) => {
    const frag = String(row.doc ?? '').replace(/^#/, '');
    const e = anchors.get(frag) ?? bySymbol.get(`${row.entry}|${row.symbol}`) ?? bySymbol.get(`.|${row.symbol}`);
    return e ? ` ([${e.id}](#${entryAnchor(e)}))` : '';
  };
  const out = [];
  const list = [...removedRows].sort((a, b) => a.symbol.localeCompare(b.symbol));
  if (list.length) {
    out.push(heading(depth, 'Removed by the codemod', 'removed-exports'), '');
    out.push('| 4.x API | Entry | Why | Where to go |', '| --- | --- | --- | --- |');
    for (const r of list) out.push(`| ${cell(code(r.symbol))}${cell(link(r))} | ${cell(code(r.entry))} | ${cell(r.reason)} | ${cell(pointer(r.registryItem))} |`);
    out.push('');
  }
  const none = entries.filter((e) => !e.replacement).sort((a, b) => String(a.id).localeCompare(String(b.id)));
  if (none.length) {
    out.push(heading(depth, 'Deprecations with no replacement', 'removed-no-replacement'), '');
    out.push('| Entry | 4.x API | Kind | Where to go |', '| --- | --- | --- | --- |');
    for (const e of none) {
      const where = e.compat ? `${code('aura-glass/compat')} keeps ${code(e.compat)} through 5.x`
        : e.codemod ? `nothing replaces it; [${code(e.codemod)}](#${codemodAnchor(e.codemod)}) deletes the usage`
          : pointer(null);
      out.push(`| [${e.id}](#${entryAnchor(e)}) | ${cell(code(e.symbol))} | ${code(e.kind)} | ${cell(where)} |`);
    }
    out.push('');
  }
  if (!out.length) throw new Error('removed: no removed rows and no entry without a replacement');
  return out.join('\n');
}

// ---- assembly --------------------------------------------------------------

/** Replace each `{/* @generated <name> *\/}` line of the template; strict. */
export function assembleGuide(template, parts) {
  const used = new Set();
  const src = template.replace(/\r\n/g, '\n');
  /* Template-only MDX comments (`{/* … *\/}` blocks that are not directives) never reach the page. */
  const lines = src.split('\n').map((line, i) => {
    const m = line.match(DIRECTIVE);
    if (!m) return line;
    const name = m[1];
    if (!(name in parts)) throw new Error(`${TEMPLATE_PATH}:${i + 1}: unknown generated section '${name}'`);
    if (used.has(name)) throw new Error(`${TEMPLATE_PATH}:${i + 1}: generated section '${name}' used twice`);
    used.add(name);
    return parts[name].replace(/\n+$/, '');
  });
  const body = stripComments(lines);
  const missing = Object.keys(parts).filter((k) => !used.has(k));
  if (missing.length) throw new Error(`${TEMPLATE_PATH}: missing generated section(s) ${missing.join(', ')}`);
  return `${body.join('\n').replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '').replace(/\n*$/, '')}\n`;
}

/** Drop `{/* … *\/}` comment blocks that start a template line (directives are already replaced). */
function stripComments(lines) {
  const out = []; let inComment = false; let fence = null;
  for (const line of lines) {
    const f = line.match(/^\s{0,3}(`{3,}|~{3,})/);
    if (!inComment && f) { fence = fence == null ? f[1] : (line.trim().startsWith(fence) ? null : fence); out.push(line); continue; }
    if (fence != null) { out.push(line); continue; }
    if (!inComment && /^\s*\{\/\*/.test(line)) inComment = true;
    if (inComment) { if (/\*\/\}\s*$/.test(line)) inComment = false; continue; }
    out.push(line);
  }
  if (inComment) throw new Error(`${TEMPLATE_PATH}: unterminated {/* comment */}`);
  return out;
}

/** Hand-written lines of the template (directives excluded). */
export const handWritten = (template) => template.split('\n').filter((l) => !DIRECTIVE.test(l)).join('\n');

export function registryNames(root) {
  const names = new Set();
  for (const kind of ['items', 'blocks']) {
    const dir = join(root, 'registry', kind);
    if (!existsSync(dir)) continue;
    for (const n of readdirSync(dir)) if (statSync(join(dir, n)).isDirectory()) names.add(n);
  }
  return names;
}

export async function loadCodemodRemoved(root) {
  const rows = [];
  for (const { stream, value } of await loadFragments('codemods', root)) {
    for (const r of value?.removed ?? []) rows.push({ ...r, stream });
  }
  return rows;
}

/** Component metas with their migration rows, evaluated like prepare-docs-app.mjs does. */
export async function loadMigrationMetas(root) {
  /* Lazy: prepare-docs-app pulls TypeScript and the registry builder, which the
     non --docs paths of gen-deprecations never need. */
  const { collectComponents, evalTsModule } = await import('../prepare-docs-app.mjs');
  const { components } = collectComponents(root);
  const foundation = { defineMeta: (m) => m };
  const out = [];
  for (const c of components) {
    const mod = evalTsModule(join(root, c.file), (spec) => (/(^|\/)foundation(\/index)?$/.test(spec) ? foundation : undefined));
    const meta = [...new Set(Object.values(mod))].find((v) => v && v.name === c.name);
    out.push({ name: c.name, entry: c.entry, file: c.file, migration: meta?.migration ?? [], selectors: meta?.selectors });
  }
  return out;
}

/** Everything --docs needs, read from the tree at `root`. */
export async function guideInputs(root, { entries, register }) {
  return {
    template: readFileSync(join(root, TEMPLATE_PATH), 'utf8'),
    catalogue: JSON.parse(readFileSync(join(root, CATALOGUE_PATH), 'utf8')),
    metas: await loadMigrationMetas(root),
    removed: await loadCodemodRemoved(root),
    registry: registryNames(root),
    entries, register,
  };
}

export function buildGuide(root, inputs) {
  const { template, catalogue, metas, removed, registry, entries, register } = inputs;
  if (!entries.length) throw new Error('migration guide: 0 deprecation entries');
  const hits = handWritten(template).match(GLASS_TOKEN);
  if (hits) throw new Error(`${TEMPLATE_PATH}: hand-written text names 4.x exports (${[...new Set(hits)].join(', ')}); generate them instead`);
  return assembleGuide(template, {
    codemods: codemodsMd(root, catalogue, register),
    'breaking-changes': breakingMd(entries, register),
    'by-component': byComponentMd(metas),
    removed: removedMd(removed, entries, registry),
  });
}
