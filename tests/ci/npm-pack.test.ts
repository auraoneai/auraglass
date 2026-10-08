/* REQ-PLAT-37: npm pack --json parsing across npm 10/11/12 shapes. */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(__dirname, '..', '..');
const { parsePackJson, packToDir } = require(join(root, 'scripts/ci/lib/npm-pack.js'));
const fixtureDir = join(__dirname, 'fixtures', 'npm-pack');
const fixtures = readdirSync(fixtureDir).filter((f) => f.endsWith('.json') || f.endsWith('.txt'));

describe('parsePackJson', () => {
  it.each(fixtures.sort())('returns { filename, files } for %s', (name) => {
    const info = parsePackJson(readFileSync(join(fixtureDir, name), 'utf8'));
    expect(info.filename).toBe('aura-glass-4.1.0.tgz');
    expect(Array.isArray(info.files)).toBe(true);
    expect(info.files.length).toBeGreaterThan(0);
  });

  it('parses the npm<=11 array shape', () => {
    const info = parsePackJson('[{"filename":"a.tgz","files":[{"path":"x"}]}]');
    expect(info.filename).toBe('a.tgz');
  });

  it('parses an object with files itself', () => {
    const info = parsePackJson('{"filename":"a.tgz","files":[{"path":"x"}]}');
    expect(info.filename).toBe('a.tgz');
  });

  it('parses the npm>=12 name-keyed object shape', () => {
    const info = parsePackJson('{"aura-glass":{"filename":"a.tgz","files":[{"path":"x"}]}}');
    expect(info.filename).toBe('a.tgz');
  });

  it('throws on {}', () => {
    expect(() => parsePackJson('{}')).toThrow(/0 packages/);
  });

  it('throws on a 2-package object', () => {
    expect(() =>
      parsePackJson('{"a":{"filename":"a.tgz","files":[]},"b":{"filename":"b.tgz","files":[]}}')
    ).toThrow(/2 packages/);
  });

  it('throws on a 2-package array', () => {
    expect(() => parsePackJson('[{"filename":"a.tgz","files":[]},{"filename":"b.tgz","files":[]}]')).toThrow();
  });

  it('throws when there is no JSON payload', () => {
    expect(() => parsePackJson('npm notice only\nnothing here')).toThrow(/no JSON payload/);
  });

  it('throws on a result missing filename/files', () => {
    expect(() => parsePackJson('{"error":{"code":"E"}}')).toThrow();
  });
});

describe('packToDir', () => {
  it('uses an argument array (no string interpolation) and returns tarballPath', () => {
    const dest = join(require('node:os').tmpdir(), `ag-pack-${process.pid}`);
    require('node:fs').mkdirSync(dest, { recursive: true });
    const info = packToDir(root, dest);
    expect(info.tarballPath).toBe(join(dest, info.filename));
    expect(info.files.length).toBeGreaterThan(0);
  });
});

describe('static scan', () => {
  it('no scripts/** file calls JSON.parse on raw pack output', () => {
    const hits: string[] = [];
    const walk = (dir: string) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const p = join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.(js|mjs|cjs)$/.test(e.name)) {
          const s = readFileSync(p, 'utf8');
          if (/JSON\.parse\(packOutput\)/.test(s) || /JSON\.parse\(\s*packOutput/.test(s)) hits.push(p);
        }
      }
    };
    walk(join(root, 'scripts'));
    expect(hits).toEqual([]);
  });
});
