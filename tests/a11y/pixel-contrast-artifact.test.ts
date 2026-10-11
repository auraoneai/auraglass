/** @jest-environment node */
/* MAT-315 / REQ-MAT-65 (D.3-39): the a11y-pixel-contrast.json gate.
   The artifact is produced only by the remote lane
   (tests/visual/mat/a11y/pixel-contrast.spec.ts, merged and validated by
   scripts/mat/a11y-pixel-contrast.mjs in mat:test:a11y-pixel-contrast-report).
   - The validator is exercised here against constructed artifacts (shape
     fixtures, not measured data): full matrix passes; a missing cell, a
     missing row field, a failing row, a missing sha/run id each fail.
   - The gate fails when A11Y_PIXEL_CONTRAST_ART is set but the file is
     missing, and when the lane is main/release (AG_SCOPE main|release, a tag,
     or the main/next/release branches) and the artifact is absent. When an
     artifact is present it must validate with 0 failing rows. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  loadContract, validateArtifact, matrixCells, artifactRequired, gate,
} from '../../scripts/mat/a11y-pixel-contrast.mjs';

const CONTRACT = loadContract(process.cwd());

function fullArtifact() {
  const rows = matrixCells(CONTRACT).map((cell) => {
    const [scene, engine, scheme, transparency, mode, viewport] = cell.split('|');
    const row: Record<string, unknown> = {};
    for (const k of CONTRACT.rowSchema.required) row[k] = null;
    return { ...row, storyId: 'mat-fixture--default', background: scene, scene, engine, scheme, transparency, mode,
      viewport: Number(viewport), fail: false };
  });
  return { sha: 'a'.repeat(40), runId: '1', rows };
}

describe('validateArtifact', () => {
  it('accepts the full 8x3x2x3x3x2 matrix with every row field and 0 failing rows', () => {
    expect(matrixCells(CONTRACT)).toHaveLength(8 * 3 * 2 * 3 * 3 * 2);
    expect(validateArtifact(fullArtifact(), CONTRACT)).toEqual([]);
  });

  it('rejects a missing matrix cell', () => {
    const art = fullArtifact();
    art.rows = art.rows.slice(1);
    expect(validateArtifact(art, CONTRACT).join('\n')).toMatch(/1 matrix cell\(s\) missing/);
  });

  it('rejects a row missing a contract field', () => {
    const art = fullArtifact();
    delete (art.rows[0] as Record<string, unknown>).worstRatio;
    expect(validateArtifact(art, CONTRACT).join('\n')).toMatch(/misses worstRatio/);
  });

  it('rejects a failing row and names its owner and subject', () => {
    const art = fullArtifact();
    Object.assign(art.rows[3]!, { fail: true, owner: 'CMP', subject: 'Button', storyId: 'cmp-button--states', worstRatio: 3.1, need: 4.5 });
    const errors = validateArtifact(art, CONTRACT);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/^FAIL \[CMP Button cmp-button--states\]/);
  });

  it('rejects an artifact without sha or run id', () => {
    const { sha: _s, runId: _r, ...rest } = fullArtifact();
    const errors = validateArtifact(rest, CONTRACT);
    expect(errors).toEqual(expect.arrayContaining(['artifact has no sha', 'artifact has no run id / job']));
  });
});

describe('artifactRequired / gate', () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ag-pixel-'));

  it('is required on main and release lanes and when the env names a path', () => {
    expect(artifactRequired({ AG_SCOPE: 'main' })).toBe(true);
    expect(artifactRequired({ AG_SCOPE: 'release' })).toBe(true);
    expect(artifactRequired({ CI_COMMIT_TAG: 'v5.0.0-rc.1' })).toBe(true);
    expect(artifactRequired({ CI_COMMIT_BRANCH: 'next' })).toBe(true);
    expect(artifactRequired({ CI_COMMIT_BRANCH: 'release/4.x' })).toBe(true);
    expect(artifactRequired({ A11Y_PIXEL_CONTRAST_ART: 'x.json' })).toBe(true);
    expect(artifactRequired({ AG_SCOPE: 'pr', CI_COMMIT_BRANCH: 'next-fin/d-a11y-suites' })).toBe(false);
  });

  it('fails when A11Y_PIXEL_CONTRAST_ART is set but the file is missing', () => {
    expect(gate({ A11Y_PIXEL_CONTRAST_ART: path.join(tmp, 'absent.json') })).toEqual([
      expect.stringMatching(/missing \(required on this lane\)/),
    ]);
  });

  it('fails on main/release when the artifact is absent', () => {
    const env = { AG_SCOPE: 'release' };
    expect(gate(env, tmp)).toEqual([expect.stringMatching(/missing \(required on this lane\)/)]);
  });

  it('validates a present artifact', () => {
    const file = path.join(tmp, 'a11y-pixel-contrast.json');
    const art = fullArtifact();
    fs.writeFileSync(file, JSON.stringify(art));
    expect(gate({ A11Y_PIXEL_CONTRAST_ART: file })).toEqual([]);
    Object.assign(art.rows[0]!, { fail: true });
    fs.writeFileSync(file, JSON.stringify(art));
    expect(gate({ A11Y_PIXEL_CONTRAST_ART: file })).toHaveLength(1);
  });

  it('this lane: the artifact is present and valid wherever the lane requires it', () => {
    const env = { ...process.env } as Record<string, string | undefined>;
    expect(gate(env)).toEqual([]);
  });
});
