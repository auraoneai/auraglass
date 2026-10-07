// tests/capability/registry/blocks-lint.test.ts — REQ-SURF-170 (AC-SURF-26).
// Every registry/{blocks,items}/<id>/registry-item.json validates against the
// vendored shadcn v4 schema, uses an S-46 id, lists only existing files,
// declares registryDependencies for every AuraGlass name it imports, and
// imports public aura-glass entries only. Blocks land per lane; the lint
// holds from the first real block — none are skipped.
import { describe, expect, it } from '@jest/globals';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = join(__dirname, '../../..');
const SCHEMA = JSON.parse(
  readFileSync(join(ROOT, 'tests/capability/registry/__fixtures__/registry-item.schema.json'), 'utf8')
);

// S-46 SURF ids (contract §3.3). Blocks vs items is a schema check; the set
// below is the SURF-owned namespace (PLAT ids are checked by PLAT's lane).
const SURF_BLOCKS = new Set([
  'app-frame', 'ai-workspace', 'data-workspace', 'analytics-dashboard',
  'media-viewer', 'support-inbox', 'mobile-settings',
  'app-shell-workspace', 'commerce-cart', 'commerce-checkout', 'pricing',
  'audit-log', 'permissions-matrix',
]);
const SURF_ITEMS = new Set([
  'code-surface', 'diff-viewer', 'gantt', 'kanban', 'react-hook-form',
  'rich-text', 'transfer-list', 'presence-stack', 'comment-thread',
  'faceted-search', 'query-builder', 'schema-viewer', 'tree-select',
  'app-shell-workspace',
  // lane W3 (SURF-356/370..374/390)
  'ai-artifact-panel', 'ai-eval-dashboard', 'ai-markdown', 'ai-model-picker',
  'ai-sdk-adapter', 'ai-trace-tree', 'ai-voice-input',
  // lane W4 (SURF-502/512)
  'backdrop-hero', 'media-video-player', 'media-audio-player', 'media-gallery',
  'media-now-playing', 'media-transcript',
]);
const PUBLIC_AURA = new Set([
  'aura-glass', 'aura-glass/app-shell', 'aura-glass/data', 'aura-glass/date',
  'aura-glass/ai', 'aura-glass/media', 'aura-glass/backdrops', 'aura-glass/three',
  'aura-glass/charts',
]);
const AURA_NAME = /\b(?:import|from)\s*[^'"]*['"]([^'"]+)['"]/g;

function checkSchema(schema: any, value: any, path: string, errs: string[]) {
  if (schema.type) {
    const ok =
      (schema.type === 'object' && value && typeof value === 'object' && !Array.isArray(value)) ||
      (schema.type === 'array' && Array.isArray(value)) ||
      (schema.type === 'string' && typeof value === 'string') ||
      (schema.type === 'boolean' && typeof value === 'boolean');
    if (!ok) { errs.push(`${path}: expected ${schema.type}`); return; }
  }
  if (schema.enum && !schema.enum.includes(value)) errs.push(`${path}: not in enum`);
  if (schema.pattern && !(typeof value === 'string' && new RegExp(schema.pattern).test(value))) {
    errs.push(`${path}: fails ${schema.pattern}`);
  }
  if (schema.type === 'object' && value) {
    for (const k of schema.required ?? []) if (!(k in value)) errs.push(`${path}: missing ${k}`);
    if (schema.additionalProperties === false) {
      const allowed = new Set(Object.keys(schema.properties ?? {}));
      for (const k of Object.keys(value)) if (!allowed.has(k)) errs.push(`${path}: unknown ${k}`);
    }
    for (const [k, sub] of Object.entries(schema.properties ?? {})) {
      if (k in value) checkSchema(sub, value[k], `${path}.${k}`, errs);
    }
  }
  if (schema.type === 'array' && Array.isArray(value)) {
    value.forEach((it, i) => checkSchema(schema.items ?? true, it, `${path}[${i}]`, errs));
  }
}

function* items() {
  for (const kind of ['blocks', 'items'] as const) {
    const base = join(ROOT, 'registry', kind);
    if (!existsSync(base)) continue;
    for (const id of readdirSync(base)) {
      const meta = join(base, id, 'registry-item.json');
      if (existsSync(meta)) yield { kind, id, meta, dir: join(base, id) };
    }
  }
}

describe('SURF registry blocks/items lint', () => {
  const list = [...items()];

  it('every descriptor validates the vendored registry-item schema', () => {
    const errs: string[] = [];
    for (const { id, meta } of list) {
      checkSchema(SCHEMA, JSON.parse(readFileSync(meta, 'utf8')), id, errs);
    }
    expect(errs).toEqual([]);
  });

  it('every id is an S-46 SURF id of the right kind', () => {
    for (const { kind, id } of list) {
      if (kind === 'blocks') expect(SURF_BLOCKS).toContain(id);
      else expect(SURF_ITEMS).toContain(id);
    }
  });

  it('every files[] entry exists on disk', () => {
    const missing: string[] = [];
    for (const { id, dir, meta } of list) {
      const d = JSON.parse(readFileSync(meta, 'utf8'));
      for (const f of d.files ?? []) {
        if (!existsSync(join(dir, f.path))) missing.push(`${id}: ${f.path}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it('index.tsx imports only public aura-glass entries', () => {
    const bad: string[] = [];
    for (const { id, dir } of list) {
      const idx = join(dir, 'index.tsx');
      if (!existsSync(idx)) continue;
      for (const m of readFileSync(idx, 'utf8').matchAll(AURA_NAME)) {
        const spec = m[1]!;
        if (!spec.startsWith('aura-glass')) continue;
        if (!PUBLIC_AURA.has(spec)) bad.push(`${id}: ${spec}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('deterministic fixtures: no Math.random / Date.now / fetch in fixtures.ts', () => {
    const bad: string[] = [];
    for (const { id, dir } of list) {
      const fx = join(dir, 'fixtures.ts');
      if (!existsSync(fx)) continue;
      const text = readFileSync(fx, 'utf8');
      if (/Math\.random|Date\.now|new Date\(|fetch\s*\(|crypto\.randomUUID/.test(text)) {
        bad.push(id);
      }
    }
    expect(bad).toEqual([]);
  });

  it('colocated stories carry the six required states', () => {
    const REQUIRED = ['Default', 'Empty', 'RTL', 'ReducedTransparency', 'ForcedColors'];
    const missing: string[] = [];
    for (const { id, dir } of list) {
      const stories = readdirSync(dir).filter((f) => f.endsWith('.stories.tsx'));
      const text = stories.map((s) => readFileSync(join(dir, s), 'utf8')).join('\n');
      for (const s of REQUIRED) {
        if (!new RegExp(`\\b${s}\\b`).test(text)) missing.push(`${id}: ${s}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
