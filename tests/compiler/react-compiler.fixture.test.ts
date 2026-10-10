/* REQ-CMP-24 — every CMP component/primitive source compiles under
   babel-plugin-react-compiler@1.0.0 with panicThreshold 'all_errors' and
   produces zero bail-out diagnostics (CompileError/CompileSkip/PipelineError). */
import { beforeAll, describe, expect, it } from '@jest/globals';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as babel from '@babel/core';

const ROOT = join(__dirname, '..', '..');
const reactCompiler: unknown = require('babel-plugin-react-compiler');

interface LogEvent { kind?: string; detail?: unknown }
const events: Array<{ file: string; kind: string }> = [];
const logger = {
  logEvent: (filename: string, event: LogEvent) => {
    if (event?.kind && event.kind !== 'CompileSuccess') {
      events.push({ file: filename, kind: event.kind });
    }
  },
};

/* SURF-owned dirs under src/components (PRD-F §6, FIN-F). REQ-CMP-24 covers
   CMP component files; the SURF sources' compiler cleanliness is FIN-F's. */
const SURF_DIRS = ['tabs', 'tab-bar', 'breadcrumbs', 'pagination', 'command-palette', 'source-transition', 'timeline'];

function sources(): string[] {
  return execSync("find src/components src/primitives -name '*.tsx' ! -name '*.test.tsx' ! -name '*.stories.tsx'", { cwd: ROOT })
    .toString().trim().split('\n').filter(Boolean)
    .filter((rel) => !SURF_DIRS.some((d) => rel.startsWith(`src/components/${d}/`)))
    .sort();
}

const results = new Map<string, string[]>();
beforeAll(() => {
  for (const rel of sources()) {
    const code = readFileSync(join(ROOT, rel), 'utf8');
    const before = events.length;
    try {
      babel.transformSync(code, {
        filename: rel,
        presets: [
          ['@babel/preset-env', { targets: { node: '20.19' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
        plugins: [[reactCompiler, { compilationMode: 'infer', panicThreshold: 'all_errors', logger }]],
        babelrc: false,
        configFile: false,
      });
    } catch (e) {
      events.push({ file: rel, kind: `Thrown:${(e as Error).message.slice(0, 120)}` });
    }
    const delta = events.slice(before).filter((e) => e.file === rel);
    results.set(rel, delta.map((e) => e.kind));
  }
}, 300_000);

describe('REQ-CMP-24 react-compiler fixture', () => {
  it.each(sources())('%s compiles with 0 bail-outs', (rel) => {
    expect({ file: rel, bailouts: results.get(rel) ?? ['not run'] }).toEqual({ file: rel, bailouts: [] });
  });
});
