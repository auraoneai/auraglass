/** @jest-environment node */
import { describe, test, expect } from '@jest/globals';
// REQ-MAT-02 / REQ-FIN-50 (D.3-04, MAT-008): every compiler-guard fixture exits 1
// naming the failing token path. Guards live in scripts/tokens/guards.mjs; its CLI
// runs schema validation + alias resolution + every guard over a token tree.
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';

const ROOT = join(__dirname, '..', '..');
const fixture = (name: string) => `tests/tokens/fixtures/guards/${name}/tokens`;

function run(script: string, args: string[]) {
  const r = spawnSync('node', [script, ...args], { cwd: ROOT, encoding: 'utf8' });
  return { status: r.status, text: String(r.stderr ?? '') + String(r.stdout ?? '') };
}

// [fixture, token path the output must name, expected finding]
const GUARD_CASES: Array<[string, string, RegExp]> = [
  ['unresolved-alias', 'sys.bad', /unresolved alias \{missing\.token\} referenced from sys\.bad/],
  ['cycle', 'sys.a', /alias cycle: sys\.a -> sys\.b -> sys\.a/],
  ['schema', '$.sys.bad', /schema: .* at \$\.sys\.bad: \$type: "wat-type" not in enum/],
  ['material-to-ref', 'material.leak', /guard material-alias: material\.leak: material\.\* alias \{ref\.local\} targets tier 'ref'/],
  ['material-to-material', 'material.outer', /guard material-alias: material\.outer: material\.\* alias \{material\.inner\} targets tier 'material'/],
  ['preset-material', 'preset.bad.material', /guard preset: preset\.bad\.material: preset defines material\.\* keys/],
  ['preset-private-var', 'preset.bad.name', /guard preset: preset\.bad\.name: preset value contains private --_ag-\* var/],
  ['comp-ref-leak', 'comp.button.radius', /guard ref-leak: comp\.button\.radius: comp-tier token resolves through ref-tier ref\.dimension\.r8 with no sys hop/],
  ['public-ref-leak', 'ref.dimension.r8', /guard ref-leak: ref\.dimension\.r8: emitted --ag-leak is a ref-tier token/],
  ['blur-cap', 'sys.blur.huge', /guard blur-cap: sys\.blur\.huge: blur 40px exceeds the 32px cap/],
  ['bezier-y', 'sys.ease.overshoot', /guard bezier-y: sys\.ease\.overshoot: cubic-bezier\(0\.3, 1\.5, 0\.6, 1\) has y control point 1\.5 outside \[0, 1\]/],
  ['bezier-y', 'sys.ease.overshoot-css', /guard bezier-y: sys\.ease\.overshoot-css: cubic-bezier\(0\.3, -0\.4, 0\.6, 1\) has y control point -0\.4 outside \[0, 1\]/],
  ['spring-zeta', 'sys.spring.wobbly', /guard spring-zeta: sys\.spring\.wobbly: spring dampingRatio 0\.5 outside \[0\.8, 1\]/],
  ['spring-response', 'sys.spring.sluggish', /guard spring-response: sys\.spring\.sluggish: spring response 1000ms outside \[120, 800\] ms/],
];

describe('compiler guards (REQ-MAT-02, scripts/tokens/guards.mjs)', () => {
  test.each(GUARD_CASES)('fixture %s exits 1 naming %s', (name, path, re) => {
    const { status, text } = run('scripts/tokens/guards.mjs', ['--fixtures', fixture(name)]);
    expect(status).toBe(1);
    expect(text).toContain(path);
    expect(text).toMatch(re);
  });

  test('a preset whose name contains "material." but has no material key passes every guard', () => {
    const { status, text } = run('scripts/tokens/guards.mjs', ['--fixtures', fixture('preset-name-material')]);
    expect(text).toMatch(/tokens:guards OK \(1 tokens, 7 guards\)/);
    expect(status).toBe(0);
  });

  test('the real token tree passes every guard', () => {
    const { status, text } = run('scripts/tokens/guards.mjs', []);
    expect(text).toMatch(/tokens:guards OK \(\d+ tokens, 7 guards\)/);
    expect(status).toBe(0);
  });
});

// build.mjs pipeline rows (validate + resolve + build.mjs's current in-file guards).
// The build.mjs -> guards.mjs call is the REQ-FIN-01 transfer to FIN-A; these rows
// hold before and after it.
const BUILD_CASES: Array<[string, RegExp]> = [
  ['unresolved-alias', /unresolved alias \{missing\.token\} referenced from sys\.bad/],
  ['cycle', /alias cycle.*sys\.a/],
  ['material-to-ref', /material\.leak.*tier 'ref'/],
  ['preset-material', /schema violations[\s\S]*\$\.preset\.bad\.\$value: additional property 'material'/],
  ['preset-private-var', /preset\.bad.*--_ag-/],
  ['schema', /schema violations[\s\S]*\$\.sys\.bad/],
  ['bezier-y', /schema violations[\s\S]*\$\.sys\.ease\.overshoot\.\$value\[1\]: 1\.5 > max 1/],
  ['spring-zeta', /schema violations[\s\S]*\$\.sys\.spring\.wobbly\.\$value\.dampingRatio: 0\.5 < min 0\.8/],
  ['spring-response', /schema violations[\s\S]*\$\.sys\.spring\.sluggish\.\$value\.response\.value: 1000 > max 800/],
];

describe('build.mjs guard pipeline (MAT-008)', () => {
  test.each(BUILD_CASES)('fixture %s exits 1 naming the path', (name, re) => {
    const out = mkdtempSync(join(tmpdir(), 'ag-fix-'));
    try {
      const { status, text } = run('scripts/tokens/build.mjs', ['--fixtures', fixture(name), '--out', out]);
      expect(status).toBe(1);
      expect(text).toMatch(re);
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });
});
