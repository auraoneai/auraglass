/* REQ-SURF-15 (REQ-FIN-80): pure helpers for the L11 migrate-4to5 canary
   (scripts/surf/migrate-canary.mjs). No I/O beyond reading a directory listing,
   so tests/data/migrate-canary.test.ts can exercise every rule locally. */
import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

// The only TODO shape the migrate engine writes (packages/cli/src/migrate/4to5/todo.ts, S-38).
export const TODO_PREFIX = 'TODO(aura-glass 5):';
export const SUBSETS = ['flagship', 'chart', 'report'];
export const CASE_GLOB_SUFFIX = '.page.tsx';

// `render={<button type="button" onClick={…} />}` — the REQ-SURF-14/15 shape for
// handler-only nav items (PRD: handler-only items become render={<button>} items).
const HANDLER_BUTTON_RE = /render=\{\s*<button\s+type="button"\s+onClick=\{/g;

/** Every frozen case page under `dir`, as posix paths relative to `dir`, sorted. */
export function listCaseFiles(dir) {
  const out = [];
  const walk = (d) => {
    for (const ent of readdirSync(d, { withFileTypes: true })) {
      const abs = join(d, ent.name);
      if (ent.isDirectory()) walk(abs);
      else if (ent.isFile() && ent.name.endsWith(CASE_GLOB_SUFFIX)) out.push(relative(dir, abs).split(sep).join('/'));
    }
  };
  walk(dir);
  return out.sort();
}

/** Structural checks on canary.json against the case files on disk. Returns error strings. */
export function validateManifest(manifest, caseFiles) {
  const errors = [];
  if (!manifest || !Array.isArray(manifest.cases)) return ['canary.json: cases[] missing'];
  if (manifest.from !== 'aura-glass@4.1.0') errors.push(`canary.json: from must be aura-glass@4.1.0 (got ${manifest.from})`);
  const seen = new Map();
  for (const c of manifest.cases) {
    const where = `canary.json case ${c?.file ?? '(no file)'}`;
    if (typeof c?.file !== 'string' || !c.file.endsWith(CASE_GLOB_SUFFIX)) {
      errors.push(`${where}: file must be a <area>/<Family>${CASE_GLOB_SUFFIX} path`);
      continue;
    }
    seen.set(c.file, (seen.get(c.file) ?? 0) + 1);
    if (!caseFiles.includes(c.file)) errors.push(`${where}: no such case file`);
    if (!SUBSETS.includes(c.subset)) errors.push(`${where}: subset must be one of ${SUBSETS.join('|')}`);
    if (!Array.isArray(c.families) || c.families.length === 0) errors.push(`${where}: families[] must name the 4.x families it covers`);
    if (c.handlerOnlyItems !== undefined && !(Number.isInteger(c.handlerOnlyItems) && c.handlerOnlyItems > 0)) {
      errors.push(`${where}: handlerOnlyItems must be a positive integer`);
    }
    if (c.subset === 'flagship') {
      const hasRender = Boolean(c.render) && typeof c.render.export === 'string' && c.render.props && typeof c.render.props === 'object';
      const exempt = typeof c.renderExempt === 'string' && c.renderExempt.length > 0;
      if (hasRender === exempt) errors.push(`${where}: a flagship case needs exactly one of render{export,props} or renderExempt`);
    } else if (c.render || c.renderExempt) {
      errors.push(`${where}: only flagship cases are rendered`);
    }
  }
  for (const [file, n] of seen) if (n > 1) errors.push(`canary.json: ${file} listed ${n} times`);
  for (const f of caseFiles) if (!seen.has(f)) errors.push(`canary.json: case ${f} is not classified (add it to cases[])`);
  if (!manifest.cases.some((c) => c.subset === 'chart')) errors.push('canary.json: at least one chart page is required');
  if (!manifest.cases.some((c) => c.subset === 'flagship')) errors.push('canary.json: the flagship subset is empty');
  return errors;
}

/** Drops a leading `// @ts-nocheck …` line (kept in the repo so the root tsc skips the frozen inputs). */
export function stripTsNocheck(source) {
  return source.replace(/^\/\/ @ts-nocheck[^\n]*\n/, '');
}

export function countMarkers(source) {
  let n = 0;
  for (let i = source.indexOf(TODO_PREFIX); i !== -1; i = source.indexOf(TODO_PREFIX, i + TODO_PREFIX.length)) n += 1;
  return n;
}

export function countHandlerButtons(source) {
  return (source.match(HANDLER_BUTTON_RE) ?? []).length;
}

/**
 * Applies the REQ-SURF-15 expectations to one migrated case.
 * todos: the migrate report's todos for the file; source: the file after migration.
 */
export function evaluateCase(c, { todos, source }) {
  const failures = [];
  const markers = countMarkers(source);
  const handlerButtons = countHandlerButtons(source);
  if (c.subset === 'flagship') {
    if (todos.length !== 0) failures.push(`flagship: expected 0 TODOs, report has ${todos.length}: ${todos.map((t) => `[${t.transform}] ${t.reason}`).join('; ')}`);
    if (markers !== 0) failures.push(`flagship: expected 0 TODO markers in the migrated file, found ${markers}`);
  } else if (c.subset === 'chart') {
    if (todos.length !== 1 || todos[0].transform !== 'removed') {
      failures.push(`chart: expected exactly 1 TODO from 'removed', report has ${todos.length}: ${todos.map((t) => `[${t.transform}] ${t.reason}`).join('; ')}`);
    }
    if (markers !== 1) failures.push(`chart: expected exactly 1 TODO marker in the migrated file, found ${markers}`);
  }
  if (c.handlerOnlyItems !== undefined && handlerButtons !== c.handlerOnlyItems) {
    failures.push(`handler items: expected ${c.handlerOnlyItems} render={<button type="button" onClick={…} />} items, found ${handlerButtons}`);
  }
  return { file: c.file, subset: c.subset, todos, markers, handlerButtons, ok: failures.length === 0, failures };
}

/** JSON props with {"$date": iso} revived to Date (used by the render runner). */
export function reviveProps(value) {
  if (Array.isArray(value)) return value.map(reviveProps);
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 1 && keys[0] === '$date') return new Date(value.$date);
    return Object.fromEntries(keys.map((k) => [k, reviveProps(value[k])]));
  }
  return value;
}
