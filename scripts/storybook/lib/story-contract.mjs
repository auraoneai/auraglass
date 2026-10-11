// QUAL (S-41; REQ-QUAL-50; REQ-FIN-106; FIN-450): the story-contract validator.
// Reads every story file in the .storybook/main.ts globs (statically) and reports, per owner:
//   ag-missing            a story whose subject is a ComponentMeta has no parameters.ag { subject, kind }
//   ag-invalid            parameters.ag.kind is not a StoryKind, subject is not a string, or ag has keys outside StoryAgParameters
//   subject-unresolved    kind component|matrix with a subject that is no ComponentMeta.name
//   tag-not-allowed       a meta/story tag outside STORY_TAGS
//   flagship-no-stories   a flagship ComponentMeta has no story file
//   flagship-missing-story  a flagship's stories lack Playground / States / Keyboard (REQUIRED_FLAGSHIP_STORIES)
//   keyboard-not-apg      the Keyboard story is not tagged `apg`
//   keyboard-unreferenced the Keyboard story id is not referenced by an APG spec under tests/a11y/apg/<owner>/
//   imports-storybook     a story file imports from .storybook/**
//   any-type              `any` in a story file (args must type-check under strict / noImplicitAny)
// Matrix/scene/Lab framing comes from QUAL's decorators; QUAL never edits an owner's story — a violation is a failure
// on the owner's paths (contract §6.1). Pre-existing violations live in the expiring baseline.
import { readFileSync } from 'node:fs';
import { join, posix } from 'node:path';
import { ROOT, storyFiles, parseStoryFile, loadMetas, ownerOf, isPlainObject, UNKNOWN } from './story-static.mjs';
import { buildApgIndex } from '../write-apg-index.mjs';

// Mirrors src/contracts/testing.ts (S-41). tests/storybook/story-contract.test.ts asserts these equal the contract values.
export const STORY_TAGS = ['flagship', 'core', 'apg', 'lab', 'scene', 'showcase', 'certified', 'no-cert'];
export const STORY_KINDS = ['lab', 'component', 'matrix', 'scene', 'showcase'];
export const REQUIRED_FLAGSHIP_STORIES = ['Playground', 'States', 'Keyboard'];
export const AG_KEYS = ['subject', 'kind', 'states', 'refraction', 'scenes', 'tier', 'axes'];

const resolveImport = (file, spec) => (spec.startsWith('.') ? posix.normalize(posix.join(posix.dirname(file), spec)) : spec);

/**
 * Validate parsed story files. `parsed`: parseStoryFile results; `metas`: ComponentMeta[]; `apg`: { references };
 * `ownerFor(file)`: owning stream. Returns [{ check:'story-contract', rule, key, owner, file, message }].
 */
export function validateStoryContract(parsed, metas, apg, ownerFor = (f) => ownerOf(f)) {
  const metaByName = new Map(metas.map((m) => [m.name, m]));
  const out = [];
  const push = (rule, key, owner, file, message) => out.push({ check: 'story-contract', rule, key, owner, file, message });
  const flagshipFiles = new Map(); // meta name -> [{ p, exports }]

  for (const p of parsed) {
    const owner = ownerFor(p.file);
    const metaAg = isPlainObject(p.metaAg) ? p.metaAg : undefined;
    const leaf = p.title ? p.title.split('/').pop().trim() : '';
    const componentRoot = p.component ? p.component.split('.')[0] : null;
    const subjectMeta = (metaAg && typeof metaAg.subject === 'string' && metaByName.get(metaAg.subject))
      || (componentRoot && metaByName.get(componentRoot)) || metaByName.get(leaf) || null;

    // parameters.ag on every story of a ComponentMeta subject
    if (subjectMeta) {
      const missing = p.stories.filter((s) => {
        const ag = { ...(metaAg ?? {}), ...(isPlainObject(s.ag) ? s.ag : {}) };
        return typeof ag.subject !== 'string' || typeof ag.kind !== 'string';
      });
      if (missing.length) push('ag-missing', p.file, owner, p.file, `${p.file}: ${missing.length} ${subjectMeta.name} stor${missing.length === 1 ? 'y lacks' : 'ies lack'} parameters.ag { subject, kind } (${missing.map((s) => s.exportName).join(', ')})`);
    }
    const ags = [['meta', metaAg], ...p.stories.map((s) => [s.exportName, isPlainObject(s.ag) ? s.ag : undefined])].filter(([, a]) => a);
    const invalid = [];
    for (const [where, ag] of ags) {
      const extra = Object.keys(ag).filter((k) => !AG_KEYS.includes(k));
      if (extra.length) invalid.push(`${where}: unknown key${extra.length > 1 ? 's' : ''} ${extra.join(', ')}`);
      if ('kind' in ag && !STORY_KINDS.includes(ag.kind)) invalid.push(`${where}: kind ${String(ag.kind === UNKNOWN ? '<computed>' : ag.kind)}`);
      if ('subject' in ag && typeof ag.subject !== 'string') invalid.push(`${where}: subject is not a string literal`);
    }
    if (p.metaAg === UNKNOWN) invalid.push('meta: default export is not statically readable');
    if (invalid.length) push('ag-invalid', p.file, owner, p.file, `${p.file}: parameters.ag does not satisfy StoryAgParameters (${invalid.join('; ')})`);
    const unresolved = new Set();
    for (const [, ag] of ags) {
      const kind = ag.kind ?? metaAg?.kind;
      if (typeof ag.subject === 'string' && (kind === 'component' || kind === 'matrix') && !metaByName.has(ag.subject)) unresolved.add(ag.subject);
    }
    for (const s of unresolved) push('subject-unresolved', `${p.file}|${s}`, owner, p.file, `${p.file}: subject "${s}" (kind component/matrix) is no ComponentMeta.name`);

    const badTags = [...new Set([...p.metaTags, ...p.stories.flatMap((s) => s.tags)])].filter((t) => !STORY_TAGS.includes(t));
    if (badTags.length) push('tag-not-allowed', p.file, owner, p.file, `${p.file}: tags outside STORY_TAGS: ${badTags.join(', ')}`);

    const internal = p.imports.filter((i) => resolveImport(p.file, i.from).startsWith('.storybook/'));
    if (internal.length && !p.file.startsWith('.storybook/')) push('imports-storybook', p.file, owner, p.file, `${p.file}:${internal[0].line} imports ${internal.map((i) => i.from).join(', ')} (.storybook/** is QUAL-internal)`);
    if (p.anyUsages.length) push('any-type', p.file, owner, p.file, `${p.file}:${p.anyUsages[0].line} uses \`any\` ${p.anyUsages.length}× (strict / noImplicitAny)`);

    if (subjectMeta && typeof subjectMeta.flagship === 'number') {
      if (!flagshipFiles.has(subjectMeta.name)) flagshipFiles.set(subjectMeta.name, []);
      flagshipFiles.get(subjectMeta.name).push(p);
    }
  }

  const refsByOwnerDir = new Map();
  for (const r of apg.references) {
    const m = /^tests\/a11y\/apg\/([^/]+)\//.exec(r.spec);
    if (!m) continue;
    if (!refsByOwnerDir.has(m[1])) refsByOwnerDir.set(m[1], new Set());
    refsByOwnerDir.get(m[1]).add(r.storyId);
  }
  for (const meta of metas.filter((m) => typeof m.flagship === 'number')) {
    const files = flagshipFiles.get(meta.name) ?? [];
    if (!files.length) { push('flagship-no-stories', meta.name, meta.owner, meta.file, `flagship #${meta.flagship} ${meta.name} has no story file (${meta.file})`); continue; }
    const stories = files.flatMap((p) => p.stories.map((s) => ({ ...s, p })));
    const owner = ownerFor(files[0].file);
    for (const req of REQUIRED_FLAGSHIP_STORIES) {
      if (!stories.some((s) => s.exportName === req)) push('flagship-missing-story', `${meta.name}|${req}`, owner, files[0].file, `flagship ${meta.name} exports no ${req} story (${files.map((f) => f.file).join(', ')})`);
    }
    for (const kb of stories.filter((s) => s.exportName === 'Keyboard')) {
      const file = kb.p.file;
      if (![...kb.p.metaTags, ...kb.tags].includes('apg')) push('keyboard-not-apg', `${meta.name}|${kb.id}`, owner, file, `${file}: ${kb.id} is not tagged apg`);
      const dir = owner.toLowerCase();
      if (!refsByOwnerDir.get(dir)?.has(kb.id)) push('keyboard-unreferenced', `${meta.name}|${kb.id}`, owner, file, `${file}: no APG spec under tests/a11y/apg/${dir}/ references ${kb.id}`);
    }
  }
  return out;
}

/** Run the validator over the repository. */
export function validateRepository(root = ROOT) {
  const parsed = storyFiles(root).filter((f) => !f.file.endsWith('.mdx'))
    .map(({ file, directory }) => parseStoryFile(file, readFileSync(join(root, file), 'utf8'), { directory }));
  return validateStoryContract(parsed, loadMetas(root), buildApgIndex(root), (f) => ownerOf(f, root));
}

/** Architecture §11.2: the flagship tier is numbered 1..FLAGSHIP_COUNT. */
export const FLAGSHIP_COUNT = 44;

/**
 * REQ-QUAL-51 docs-page coverage: every flagship number 1..44 needs a ComponentMeta (its docs page is generated
 * from it). A missing number is reported against the owner of the nearest lower-numbered flagship meta
 * (the renumbering is the owners' REQ-QUAL-71 work).
 */
export function docsPageViolations(metas) {
  const flagships = metas.filter((m) => typeof m.flagship === 'number');
  const out = [];
  for (let n = 1; n <= FLAGSHIP_COUNT; n += 1) {
    if (flagships.some((m) => m.flagship === n)) continue;
    const prev = flagships.filter((m) => m.flagship < n).sort((a, b) => b.flagship - a.flagship)[0] ?? flagships[0];
    const owner = prev?.owner ?? 'CMP';
    out.push({ check: 'docs-pages', rule: 'flagship-number-missing', key: `#${n}`, owner, file: prev?.file,
      message: `flagship #${n} has no ComponentMeta, so no docs page is generated (REQ-QUAL-71 renumbering; nearest: ${prev ? `#${prev.flagship} ${prev.name}` : 'none'})` });
  }
  for (const m of flagships.filter((x) => !Number.isInteger(x.flagship) || x.flagship < 1 || x.flagship > FLAGSHIP_COUNT)) {
    out.push({ check: 'docs-pages', rule: 'flagship-number-invalid', key: m.name, owner: m.owner, file: m.file, message: `${m.file}: flagship ${m.flagship} is outside 1..${FLAGSHIP_COUNT}` });
  }
  return out;
}
