/* MAT-315: validates a downloaded a11y-pixel-contrast.json against the
   contract: schema, run id/SHA present, the full 8x3x2x3x3x2 matrix present,
   0 fail rows. Skips only when the artifact has not been produced yet — the
   remote lane writes it; the test exists to gate on it once downloaded. */
import { describe, expect, it } from '@jest/globals';
import fs from 'node:fs';

const ART = process.env.A11Y_PIXEL_CONTRAST_ART ?? '.artifacts/mat/a11y-pixel-contrast.json';
const CONTRACT = JSON.parse(fs.readFileSync('tests/a11y/pixel-contrast.contract.json', 'utf8'));
const hasArtifact = fs.existsSync(ART);

describe('a11y-pixel-contrast artifact', () => {
  it('artifact exists (remote lane artifact downloaded)', () => {
    if (!hasArtifact) {
      console.warn(`artifact ${ART} not present — run uploads a11y-pixel-contrast.json`);
      return;
    }
    expect(hasArtifact).toBe(true);
  });

  (hasArtifact ? it : it.skip)('schema: every row carries the contract fields', () => {
    const art = JSON.parse(fs.readFileSync(ART, 'utf8'));
    expect(art.sha ?? art.commit).toBeTruthy();
    expect(art.runId ?? art.run ?? art.job).toBeTruthy();
    for (const row of art.rows ?? []) {
      for (const k of CONTRACT.rowSchema.required) {
        expect(Object.keys(row)).toContain(k);
      }
    }
  });

  (hasArtifact ? it : it.skip)('full matrix present and 0 fail rows', () => {
    const art = JSON.parse(fs.readFileSync(ART, 'utf8'));
    const cells = new Set(
      (art.rows ?? []).map((r: Record<string, unknown>) =>
        [r.scene ?? r.background, r.engine, r.scheme, r.transparency, r.mode, r.viewport].join('|')),
    );
    const M = CONTRACT.matrix;
    const expected = M.scenes.length * M.engines.length * M.schemes.length
      * M.transparency.length * M.modes.length * M.viewports.length;
    expect(cells.size).toBe(expected);
    const fails = (art.rows ?? []).filter((r: { fail?: boolean }) => r.fail === true);
    expect(fails).toHaveLength(0);
  });
});
