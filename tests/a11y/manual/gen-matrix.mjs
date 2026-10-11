#!/usr/bin/env node
/* tests/a11y/manual/gen-matrix.mjs — L13 manual screen-reader / touch / motion
   matrix generator (REQ-FIN-110, REQ-QUAL-72; FIN-H task H3-2).

   Usage:
     node tests/a11y/manual/gen-matrix.mjs            write tests/a11y/manual/sr-matrix.template.json
     node tests/a11y/manual/gen-matrix.mjs --check    regenerate in memory; exit 1 on drift
     node tests/a11y/manual/gen-matrix.mjs --out <p>  write to <p> instead (tests)

   Inputs (nothing is hand-listed that the repo already declares):
     - every src/**\/*.meta.ts, evaluated (esbuild bundle, the same technique as
       certification/run.mjs and src/contracts/load-fragments.mjs) — never parsed
       with regexes. A ComponentMeta is any export with name/owner/parts.
     - every story file matched by .storybook/main.ts `stories`, indexed with
       Storybook's own CSF indexer (storybook/internal/csf-tools), i.e. the ids
       that index.json / cert-manifest.json carry and that tests/helpers
       `listSubjects` returns at runtime.

   Rows: one per (subject, pass, at).
     - every flagship meta (ComponentMeta.flagship 1..44):
         sr    x voiceover-macos, voiceover-ios, nvda-chrome, talkback-chrome
         touch x touch-ios, touch-android
     - the issue-#16 subjects that are not flagships (ISSUE_16 below)
     - MAT: Surface/Material Lab and GlassPreferencesPanel (sr x 4 + touch x 2)
     - motion: Button, Dialog, Menu, Sheet, Tabs x the 4 SR platforms under OS
       reduced motion, recorded by MAT (REQ-MAT-66), script mat/reduced-motion-pass.md
   Each row: subject (kebab id = SrRecord.subject), name, stream, flagship,
   pass, at, storyId, script, record (path the SrRecord is committed at, the
   layout scripts/mat/verify-a11y-manual.mjs enforces) and required: true.

   Gaps are reported, never patched: a flagship number 1..44 with no meta goes
   to `missingFlagships` (warning, exit 0) — the owning stream adds or
   renumbers the meta; this tool never edits src/**. A subject with no indexed
   story goes to `missingStories` (warning; its rows carry storyId null, so they
   cannot be run until the owning stream adds the story). Ambiguous or unknown
   meta names, owners outside mat|cmp|surf and out-of-range flagships exit 1. */
import { readFileSync, writeFileSync, mkdtempSync, rmSync, globSync } from 'node:fs';
import { createRequire } from 'node:module';
import { build } from 'esbuild';
import { loadCsf } from 'storybook/internal/csf-tools';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
export const TEMPLATE_PATH = 'tests/a11y/manual/sr-matrix.template.json';
const require = createRequire(join(ROOT, 'package.json'));

/** SrRecord `at` enum (H3-1 / Appendix C C-16). */
export const SR_AT = ['voiceover-macos', 'voiceover-ios', 'nvda-chrome', 'talkback-chrome'];
export const TOUCH_AT = ['touch-ios', 'touch-android'];
export const FLAGSHIP_RANGE = [1, 44];
const STREAM = { CMP: 'cmp', SURF: 'surf', MAT: 'mat' };
const PASS_ORDER = ['sr', 'touch', 'motion'];
const AT_ORDER = [...SR_AT, ...TOUCH_AT];

/** Issue #16 checklist → subjects. Flagship subjects already carry full rows;
    the rest are added with the passes the issue asks for (SR list / touch list). */
export const ISSUE_16 = [
  { topic: 'menus', subjects: ['Menu'], passes: ['sr', 'touch'] },
  { topic: 'overlays', subjects: ['Dialog', 'AlertDialog', 'Sheet', 'Popover', 'Tooltip'], passes: ['sr', 'touch'] },
  { topic: 'app-shell-navigation', subjects: ['AppShell', 'Sidebar', 'SidebarDrawer', 'MobileShell', 'TabBar'], passes: ['sr', 'touch'] },
  { topic: 'tabs', subjects: ['Tabs'], passes: ['sr'] },
  { topic: 'command-palette', subjects: ['CommandPalette'], passes: ['sr', 'touch'] },
  { topic: 'toast', subjects: ['Toast'], passes: ['sr', 'touch'] },
  { topic: 'workflow-states', subjects: ['EmptyState', 'ErrorState', 'LoadingState'], passes: ['sr'] },
  { topic: 'select', subjects: ['Select'], passes: ['sr', 'touch'] },
  { topic: 'combobox', subjects: ['Combobox'], passes: ['sr', 'touch'] },
  { topic: 'dialog-drawer-detents', subjects: ['Dialog', 'Sheet'], passes: ['touch'] },
  { topic: 'orientation-change', subjects: ['OrientationChange'], passes: ['touch'] },
];

/** Subjects that are scenarios, not ComponentMeta exports: resolved to a story
    through the CSF index (by story file + preferred export, or another subject's story). */
export const SCENARIOS = {
  SurfaceMaterialLab: { stream: 'mat', storyFile: 'src/material/stories/Material.Lab.stories.tsx', passes: ['sr', 'touch'] },
  OrientationChange: { stream: 'surf', storyOf: 'MobileShell', passes: ['touch'] },
};
/** REQ-MAT-66 MAT subjects (sr x 4 + touch x 2 each). */
export const MAT_SUBJECTS = ['SurfaceMaterialLab', 'GlassPreferencesPanel'];
/** REQ-MAT-66 reduced-motion pass. */
export const MOTION_SUBJECTS = ['Button', 'Dialog', 'Menu', 'Sheet', 'Tabs'];
export const MOTION_SCRIPT = 'tests/a11y/manual/scripts/mat/reduced-motion-pass.md';
const PREFERRED_EXPORTS = ['Playground', 'Default', 'Overview'];

export const kebab = (name) => name
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
  .toLowerCase();

/** Evaluates every src/**\/*.meta.ts in one esbuild bundle; returns ComponentMeta records. */
export async function loadMetas(root = ROOT) {
  const files = globSync('src/**/*.meta.ts', { cwd: root }).sort();
  const entry = files.map((f, i) => `export * as m${i} from ${JSON.stringify(`./${f}`)};`).join('\n');
  const res = await build({
    stdin: { contents: entry, resolveDir: root, loader: 'ts', sourcefile: 'gen-matrix-metas.ts' },
    bundle: true, write: false, format: 'cjs', platform: 'node', logLevel: 'silent',
    define: { 'process.env.NODE_ENV': '"production"' },
    loader: { '.css': 'empty', '.svg': 'empty', '.png': 'empty' },
  });
  const dir = mkdtempSync(join(tmpdir(), 'ag-gen-matrix-'));
  try {
    const out = join(dir, 'metas.cjs');
    writeFileSync(out, res.outputFiles[0].text);
    const mod = createRequire(out)(out);
    const metas = [];
    files.forEach((file, i) => {
      // A meta is often exported twice (named + default): count each object once.
      for (const value of new Set(Object.values(mod[`m${i}`] ?? {}))) {
        if (value && typeof value === 'object' && typeof value.name === 'string'
          && typeof value.owner === 'string' && Array.isArray(value.parts)) {
          metas.push({ ...value, file });
        }
      }
    });
    return metas;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Story globs from .storybook/main.ts (evaluated, not parsed). */
async function storyGlobs(root) {
  const res = await build({
    entryPoints: [join(root, '.storybook/main.ts')], bundle: true, write: false,
    format: 'cjs', platform: 'node', logLevel: 'silent', packages: 'external',
  });
  const cfg = new Function('module', 'exports', 'require', `${res.outputFiles[0].text}; return module.exports;`)(
    { exports: {} }, {}, require);
  const stories = (cfg.default ?? cfg).stories ?? [];
  return stories.filter((s) => typeof s === 'string' && !s.endsWith('.mdx'))
    .map((s) => relative(root, resolve(root, '.storybook', s)));
}

/** Storybook CSF index: [{file, title, subject, stories:[{id, exportName}]}]. */
export async function indexStories(root = ROOT) {
  const expand = (g) => g.replace(/\.@\(([^)]+)\)$/, (_, alts) => `.{${alts.split('|').join(',')}}`);
  const files = [...new Set((await storyGlobs(root)).flatMap((g) => globSync(expand(g), { cwd: root })))].sort();
  const out = [];
  for (const file of files) {
    const csf = loadCsf(readFileSync(join(root, file), 'utf8'), { fileName: file, makeTitle: (t) => t }).parse();
    if (!csf.meta?.title) throw new Error(`${file}: CSF default export has no title`);
    out.push({
      file, title: csf.meta.title, subject: metaSubject(csf._metaAnnotations?.parameters),
      stories: Object.entries(csf._stories).map(([exportName, s]) => ({ id: s.id, exportName })),
    });
  }
  return out;
}

/** parameters.ag.subject string literal from the CSF default export (AST, not regex). */
function metaSubject(node) {
  const prop = (obj, key) => obj?.type === 'ObjectExpression'
    ? obj.properties.find((p) => p.type === 'ObjectProperty'
      && ((p.key.type === 'Identifier' && p.key.name === key) || (p.key.type === 'StringLiteral' && p.key.value === key)))?.value
    : undefined;
  let ag = prop(node, 'ag');
  if (ag?.type === 'TSSatisfiesExpression' || ag?.type === 'TSAsExpression') ag = ag.expression;
  const subject = prop(ag, 'subject');
  return subject?.type === 'StringLiteral' ? subject.value : null;
}

function pickStory(entries) {
  for (const entry of entries) {
    for (const want of PREFERRED_EXPORTS) {
      const hit = entry.stories.find((s) => s.exportName === want);
      if (hit) return hit.id;
    }
  }
  return entries.find((e) => e.stories.length)?.stories[0].id ?? null;
}

/** Story id for a subject: CSF files whose meta parameters.ag.subject names it,
    else the `<Name>.stories.tsx` file of the meta (foundation/metas.ts convention). */
function storyFor(name, index, metaFile) {
  const bySubject = index.filter((e) => e.subject === name);
  if (bySubject.length) return pickStory(bySubject);
  const byFile = index.filter((e) => e.file.split('/').pop() === `${name}.stories.tsx`);
  if (byFile.length > 1 && metaFile) {
    // Prefer the story file beside (or under the stream's story tree for) the meta's directory.
    const near = byFile.filter((e) => dirname(e.file).startsWith(dirname(metaFile)));
    if (near.length) return pickStory(near);
  }
  return byFile.length ? pickStory(byFile) : null;
}

export async function generate(root = ROOT) {
  const metas = await loadMetas(root);
  const index = await indexStories(root);
  const errors = [];
  const missingStories = [];
  const subjects = new Map(); // name -> {name, subject, stream, flagship, storyId, passes:Set}

  const metaByName = new Map();
  for (const m of metas) {
    const list = metaByName.get(m.name) ?? [];
    list.push(m);
    metaByName.set(m.name, list);
  }
  const resolveMeta = (name, why) => {
    const list = metaByName.get(name) ?? [];
    if (list.length === 1) return list[0];
    errors.push(list.length ? `${why}: ${name} is declared by ${list.length} metas (${list.map((m) => m.file).join(', ')})`
      : `${why}: no ComponentMeta named ${name} under src/**/*.meta.ts`);
    return null;
  };
  const addSubject = (name, passes, why) => {
    let s = subjects.get(name);
    if (!s) {
      if (SCENARIOS[name]) {
        const sc = SCENARIOS[name];
        const storyId = sc.storyFile
          ? pickStory(index.filter((e) => e.file === sc.storyFile))
          : subjects.get(sc.storyOf)?.storyId ?? storyFor(sc.storyOf, index, resolveMeta(sc.storyOf, why)?.file);
        s = { name, stream: sc.stream, owner: sc.stream.toUpperCase(), flagship: null, storyId, passes: new Set() };
      } else {
        const m = resolveMeta(name, why);
        if (!m) return;
        if (!STREAM[m.owner]) { errors.push(`${m.file}: owner ${m.owner} has no SrRecord stream`); return; }
        s = { name, stream: STREAM[m.owner], owner: m.owner, flagship: Number.isInteger(m.flagship) ? m.flagship : null,
          storyId: storyFor(name, index, m.file), passes: new Set() };
      }
      // No story = no URL to test: a gap for the owning stream (story files are theirs), never patched here.
      if (!s.storyId) missingStories.push({ subject: kebab(name), name, owner: s.owner });
      subjects.set(name, s);
    }
    for (const p of passes) s.passes.add(p);
  };

  // Flagships 1..44 (every meta carrying a flagship number).
  const flagshipMap = {};
  for (const m of metas.filter((x) => Number.isInteger(x.flagship)).sort((a, b) => a.flagship - b.flagship || a.name.localeCompare(b.name))) {
    if (m.flagship < FLAGSHIP_RANGE[0] || m.flagship > FLAGSHIP_RANGE[1]) {
      errors.push(`${m.file}: flagship ${m.flagship} outside ${FLAGSHIP_RANGE.join('..')}`);
      continue;
    }
    (flagshipMap[m.flagship] ??= []).push(kebab(m.name));
    addSubject(m.name, ['sr', 'touch'], `flagship ${m.flagship}`);
  }
  const missingFlagships = [];
  for (let n = FLAGSHIP_RANGE[0]; n <= FLAGSHIP_RANGE[1]; n++) if (!flagshipMap[n]) missingFlagships.push(n);

  for (const t of ISSUE_16) for (const name of t.subjects) addSubject(name, t.passes, `issue #16 ${t.topic}`);
  for (const name of MAT_SUBJECTS) addSubject(name, ['sr', 'touch'], 'REQ-MAT-66');

  const rows = [];
  const seen = new Set();
  for (const s of [...subjects.values()]) {
    const subject = kebab(s.name);
    if (seen.has(subject)) errors.push(`subject id ${subject} is produced by two names`);
    seen.add(subject);
    for (const pass of PASS_ORDER.filter((p) => s.passes.has(p))) {
      for (const at of pass === 'sr' ? SR_AT : TOUCH_AT) {
        rows.push(row(s, subject, s.stream, pass, at, `tests/a11y/manual/scripts/${s.stream}/${subject}.md`));
      }
    }
  }
  for (const name of MOTION_SUBJECTS) {
    const s = subjects.get(name);
    if (!s) { errors.push(`motion: ${name} is not a matrix subject`); continue; }
    for (const at of SR_AT) rows.push(row(s, kebab(name), 'mat', 'motion', at, MOTION_SCRIPT));
  }
  rows.sort((a, b) => a.stream.localeCompare(b.stream) || a.subject.localeCompare(b.subject)
    || PASS_ORDER.indexOf(a.pass) - PASS_ORDER.indexOf(b.pass) || AT_ORDER.indexOf(a.at) - AT_ORDER.indexOf(b.at));

  const template = {
    $comment: 'Generated by tests/a11y/manual/gen-matrix.mjs from src/**/*.meta.ts and the Storybook CSF index. Do not hand-edit; CI runs --check.',
    version: 1,
    req: ['REQ-FIN-110', 'REQ-QUAL-72', 'REQ-MAT-66'],
    at: { sr: SR_AT, touch: TOUCH_AT, motion: SR_AT },
    storyUrl: '<CI Storybook artifact for $SHA>/?path=/story/<storyId>',
    flagships: Object.fromEntries(Object.entries(flagshipMap).map(([k, v]) => [k, v])),
    missingFlagships,
    missingStories,
    issue16: ISSUE_16.map((t) => ({ topic: t.topic, subjects: t.subjects.map(kebab), passes: t.passes })),
    counts: {
      rows: rows.length,
      byPass: Object.fromEntries(PASS_ORDER.map((p) => [p, rows.filter((r) => r.pass === p).length])),
      byStream: Object.fromEntries(['mat', 'cmp', 'surf'].map((st) => [st, rows.filter((r) => r.stream === st).length])),
    },
    rows,
  };
  return { template, errors, missingFlagships, missingStories };
}

function row(s, subject, stream, pass, at, script) {
  return {
    subject, name: s.name, stream, flagship: s.flagship, pass, at, storyId: s.storyId, script,
    record: `tests/a11y/manual/records/${stream}/${subject}-${at}${pass === 'motion' ? '-motion' : ''}.json`,
    required: true,
  };
}

export const serialize = (template) => `${JSON.stringify(template, null, 2)}\n`;

async function main(argv) {
  const check = argv.includes('--check');
  const outIdx = argv.indexOf('--out');
  if (outIdx !== -1 && !argv[outIdx + 1]) { console.error('gen-matrix: --out needs a path'); return 64; }
  const unknown = argv.filter((a, i) => a !== '--check' && a !== '--out' && !(outIdx !== -1 && i === outIdx + 1));
  if (unknown.length) { console.error(`gen-matrix: unknown argument(s) ${unknown.join(' ')}`); return 64; }
  const out = resolve(ROOT, outIdx !== -1 ? argv[outIdx + 1] : TEMPLATE_PATH);

  const { template, errors, missingFlagships, missingStories } = await generate(ROOT);
  if (errors.length) {
    for (const e of errors) console.error(`gen-matrix: ERROR ${e}`);
    return 1;
  }
  if (missingFlagships.length) {
    console.warn(`gen-matrix: WARNING missingFlagships ${JSON.stringify(missingFlagships)} — no src/**/*.meta.ts declares these flagship numbers; the owning stream adds or renumbers the meta (src/** is not edited here).`);
  }
  if (missingStories.length) {
    console.warn(`gen-matrix: WARNING missingStories ${JSON.stringify(missingStories.map((m) => `${m.owner}:${m.name}`))} — no Storybook story declares parameters.ag.subject for these subjects (or <Name>.stories.tsx); their rows carry storyId null until the owning stream adds the story.`);
  }
  const text = serialize(template);
  if (check) {
    let current = null;
    try { current = readFileSync(out, 'utf8'); } catch { /* missing = drift */ }
    if (current !== text) {
      console.error(`gen-matrix: DRIFT ${relative(ROOT, out)} differs from the generated matrix; run node tests/a11y/manual/gen-matrix.mjs and commit the result.`);
      return 1;
    }
    console.log(`gen-matrix: ${relative(ROOT, out)} up to date (${template.counts.rows} rows).`);
    return 0;
  }
  writeFileSync(out, text);
  console.log(`gen-matrix: wrote ${relative(ROOT, out)} (${template.counts.rows} rows; ${JSON.stringify(template.counts.byPass)}).`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).then((code) => { process.exitCode = code; }, (err) => {
    console.error(`gen-matrix: ${err?.stack ?? err}`);
    process.exitCode = 1;
  });
}
