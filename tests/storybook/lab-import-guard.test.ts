/**
 * @jest-environment node
 */
/* REQ-QUAL-54 (REQ-FIN-106, FIN-451): nothing under .storybook/** is importable from src/**, showcase/** or
   registry/**, and no .storybook file or story-only attribute ships. The repo-wide import guard runs here on the
   current tree; the shipped-artifact scan runs in L1 against the packed tarball (AURAGLASS_TARBALL from
   plat:package:pack) and is exercised here on built fixture tarballs/directories. */
import { describe, expect, it } from '@jest/globals';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  STORY_ONLY_ATTRIBUTES, dirEntries, guardedFiles, importViolations, reachesStorybook, scanTarball, shippedViolations, specifiers,
} from '../../scripts/qual/verify-lab-not-shipped.mjs';
import { AG_ATTRIBUTES } from '../../src/contracts/material';

describe('import guard', () => {
  it('the current tree imports nothing from .storybook/** in src, showcase or registry', () => {
    const files = guardedFiles();
    expect(files.length).toBeGreaterThan(100);
    expect(importViolations(files)).toEqual([]);
  });

  it('catches static, re-export, dynamic, require and import-type forms', () => {
    const code = [
      "import { x } from '../../../.storybook/lab/LabControls';",
      "export * from '../../../.storybook/contract/StoryRoot';",
      "const m = import('../../../.storybook/preview');",
      "const r = require('../../../.storybook/main');",
      "type T = import('../../../.storybook/lab/SpecKnobs').SpecKnob;",
      "import ok from '../material';",
    ].join('\n');
    expect(specifiers(code, 'src/components/x/X.tsx')).toHaveLength(6);
    expect(importViolations([{ file: 'src/components/x/X.tsx', code }])).toHaveLength(5);
  });

  it('applies to showcase and registry, and to bare `.storybook` specifiers', () => {
    expect(reachesStorybook('../../.storybook/blocks', 'showcase/ops/Ops.showcase.tsx')).toBe(true);
    expect(reachesStorybook('../../../.storybook/lab/ContrastReadout', 'registry/blocks/a/index.tsx')).toBe(true);
    expect(reachesStorybook('aura-glass/.storybook/x', 'src/a.ts')).toBe(true);
    expect(reachesStorybook('../storybook-helpers', 'src/a/b.ts')).toBe(false);
  });

  it('allows only the S-51 doc-blocks import, only from MDX', () => {
    expect(reachesStorybook('../../../.storybook/blocks', 'src/ai/thread/Thread.mdx')).toBe(false);
    expect(reachesStorybook('../../../.storybook/blocks/index.tsx', 'src/ai/thread/Thread.mdx')).toBe(false);
    expect(reachesStorybook('../../../.storybook/lab/LabControls', 'src/ai/thread/Thread.mdx')).toBe(true);
    expect(reachesStorybook('../../../.storybook/blocks', 'src/ai/thread/Thread.tsx')).toBe(true);
  });
});

describe('shipped-artifact scan', () => {
  it('the five story-only attributes are exactly the QUAL story-only rows of the S-01 registry', () => {
    const storyOnly = Object.entries(AG_ATTRIBUTES).filter(([, v]) => v.setter === 'QUAL').map(([k]) => k);
    expect([...STORY_ONLY_ATTRIBUTES].sort()).toEqual(storyOnly.sort());
  });

  const tmp = () => mkdtempSync(join(tmpdir(), 'lab-guard-'));
  const write = (root: string, files: Record<string, string>) => {
    for (const [p, c] of Object.entries(files)) { mkdirSync(join(root, p, '..'), { recursive: true }); writeFileSync(join(root, p), c); }
  };

  it('passes a clean dist and fails each story-only attribute in a runtime file', () => {
    const dir = tmp();
    try {
      write(dir, { 'index.js': 'export const a = "data-ag-surface";', 'styles.css': '[data-ag-surface]{}', 'index.d.ts': 'export type A = "data-ag-cert-ready";' });
      expect(shippedViolations(dirEntries(dir, 'dist/'))).toEqual([]);
      for (const attr of STORY_ONLY_ATTRIBUTES) {
        write(dir, { 'chunk.js': `el.setAttribute("${attr}", "")` });
        expect(shippedViolations(dirEntries(dir, 'dist/'))).toEqual([`dist/chunk.js: ships story-only attribute ${attr}`]);
      }
      write(dir, { 'chunk.js': '', 'material.css': '[data-ag-state-cell] { outline: 0 }' });
      expect(shippedViolations(dirEntries(dir, 'dist/'))).toEqual(['dist/material.css: ships story-only attribute data-ag-state-cell']);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });

  it('fails a tarball that ships a .storybook file', () => {
    const dir = tmp();
    try {
      write(dir, { 'package/dist/index.js': 'export {}', 'package/.storybook/lab/LabControls.js': 'export {}' });
      const tgz = join(dir, 'aura-glass-0.0.0.tgz');
      execFileSync('tar', ['-czf', tgz, '-C', dir, 'package']);
      expect(scanTarball(tgz)).toEqual(['aura-glass-0.0.0.tgz:package/.storybook/lab/LabControls.js: a .storybook file is shipped']);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
