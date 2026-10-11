#!/usr/bin/env node
// scripts/surf/calibrate-media-tone.mjs — REQ-SURF-152 tone calibration.
//
// Measure (CI job surf:test:media-tone-calibration, $AG_PLAYWRIGHT_IMAGE):
//   node scripts/surf/calibrate-media-tone.mjs [--out <dir>]
//   Serves the 8 QUAL scenes (certification/scenes, S-42) with the real
//   sampler bundle, decodes each scene in Chromium as <img crossOrigin=anonymous>,
//   runs sampleOwnedPixels + classifyTone in-page and writes
//   <out>/media-tone-calibration.json: per-scene measured {mean,p10,p90,stdev,tone},
//   the current TONE_* constants, the anchor verdicts and, per constant, the
//   interval that keeps every anchor correct with the others fixed (derived
//   value = current when it already satisfies the anchors, else the interval
//   midpoint). Exits 1 when an anchor misclassifies (the TONE_* constants in
//   src/backdrops/sampling/classifyTone.ts then need the derived values).
// Check (same CI job, and locally against a downloaded artifact):
//   node scripts/surf/calibrate-media-tone.mjs --check --from <artifact.json>
//   Exits 1 unless src/backdrops/sampling/__fixtures__/scene-stats.json equals
//   the artifact's per-scene stats.
// Write (locally, from the downloaded CI artifact — never from hand-typed data):
//   node scripts/surf/calibrate-media-tone.mjs --write --from <artifact.json>
//
// Measuring needs a browser, so outside CI / the remote runner it exits 2 and
// prints the remote command (PRD-F §12 rule 6).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import {
  ANCHORS_PATH, FIXTURE_PATH, ROOT, bundleSampler, readScenes, sampleScenesInPage, sceneIds, startSamplingServer,
} from './media-sampling-harness.mjs';

const ARTIFACT = 'media-tone-calibration.json';
const DECIMALS = 4;
const STAT_KEYS = ['mean', 'p10', 'p90', 'stdev'];
const CONSTANTS = ['TONE_LIGHT_MEAN', 'TONE_LIGHT_P10', 'TONE_DARK_MEAN', 'TONE_DARK_P90'];

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const round = (v) => Number(v.toFixed(DECIMALS));
const fail = (msg) => { console.error(`calibrate-media-tone: ${msg}`); process.exit(1); };

/** The classifyTone rule with explicit constants (used only to derive
 * feasible intervals; every measured scene also checks it agrees with the
 * real in-page classifyTone under the current constants). */
function classifyWith(c, s) {
  if (s.mean >= c.TONE_LIGHT_MEAN && s.p10 >= c.TONE_LIGHT_P10) return 'light';
  if (s.mean <= c.TONE_DARK_MEAN && s.p90 <= c.TONE_DARK_P90) return 'dark';
  return 'busy';
}

function anchorsOk(c, scenes, anchors) {
  return Object.entries(anchors).every(([id, want]) => classifyWith(c, scenes[id]) === want);
}

function deriveConstants(current, scenes, anchors) {
  const out = {};
  for (const k of CONSTANTS) {
    const ok = [];
    for (let i = 0; i <= 1000; i++) {
      const v = i / 1000;
      if (anchorsOk({ ...current, [k]: v }, scenes, anchors)) ok.push(v);
    }
    const feasible = ok.length ? [ok[0], ok[ok.length - 1]] : null;
    const satisfied = anchorsOk(current, scenes, anchors);
    out[k] = {
      current: current[k],
      feasible,
      derived: satisfied ? current[k] : feasible ? round((feasible[0] + feasible[1]) / 2) : null,
    };
  }
  return out;
}

function fixtureFromArtifact(artifact) {
  const ids = sceneIds();
  const got = Object.keys(artifact.scenes ?? {});
  if (ids.length !== got.length || !ids.every((id) => got.includes(id))) {
    fail(`artifact scenes [${got.join(', ')}] are not the 8 S-42 ids [${ids.join(', ')}]`);
  }
  const scenes = {};
  for (const id of ids) {
    const s = artifact.scenes[id];
    for (const k of STAT_KEYS) if (typeof s[k] !== 'number' || !Number.isFinite(s[k])) fail(`artifact scene ${id}.${k} is not a number`);
    scenes[id] = { ...Object.fromEntries(STAT_KEYS.map((k) => [k, round(s[k])])), expect: s.tone ?? 'busy' };
  }
  return {
    generatedBy: 'scripts/surf/calibrate-media-tone.mjs --write --from <CI artifact media-tone-calibration.json>',
    source: { job: artifact.job, sha: artifact.sha, engine: artifact.engine, measuredAt: artifact.measuredAt },
    scenes,
  };
}

function readArtifact() {
  const from = opt('from');
  if (!from) fail('--check/--write need --from <path to the CI artifact media-tone-calibration.json>');
  if (!existsSync(from)) fail(`${from} does not exist`);
  const a = JSON.parse(readFileSync(from, 'utf8'));
  if (JSON.stringify(a).includes('"pending"')) fail(`${from} contains a 'pending' key; it is not a measured artifact`);
  return a;
}

async function measure() {
  if (!process.env.CI && !process.env.AG_REMOTE_RUNNER) {
    console.error('calibrate-media-tone measures in a real browser and runs only on the remote runner:\n'
      + '  GitLab job surf:test:media-tone-calibration (ci/surf.gitlab-ci.yml)\n'
      + '  locally: node scripts/surf/calibrate-media-tone.mjs --check|--write --from <downloaded artifact>');
    process.exit(2);
  }
  const outDir = opt('out') ?? process.env.AG_ARTIFACTS ?? '.artifacts/surf/media-tone';
  const anchors = JSON.parse(readFileSync(ANCHORS_PATH, 'utf8')).anchors;
  const scenes = readScenes();
  const { chromium } = await import('@playwright/test');
  const server = await startSamplingServer({ bundle: await bundleSampler({ mode: 'production' }) });
  const browser = await chromium.launch();
  const engine = `chromium ${browser.version()}`;
  let results;
  let current;
  try {
    const page = await browser.newPage();
    await page.goto(`${server.origin}/`);
    current = await page.evaluate((keys) => Object.fromEntries(keys.map((k) => [k, globalThis.__agSampling[k]])), CONSTANTS);
    results = await sampleScenesInPage(page, { origin: server.origin, scenes });
  } finally {
    await browser.close();
    await server.close();
  }

  const measured = {};
  for (const r of results) {
    if (!r.stats) fail(`the sampler returned null for scene ${r.id} (decode/CORS failure on the harness origin)`);
    const tone = r.tone ?? 'busy';
    if (classifyWith(current, r.stats) !== tone) fail(`classifyWith() disagrees with the real classifyTone on ${r.id}`);
    measured[r.id] = { ...r.stats, tone, naturalWidth: r.naturalWidth };
  }
  const anchorVerdicts = Object.fromEntries(Object.entries(anchors).map(([id, want]) => [id, { want, got: measured[id].tone, ok: measured[id].tone === want }]));
  const artifact = {
    generatedBy: 'scripts/surf/calibrate-media-tone.mjs',
    job: process.env.CI_JOB_URL ?? null,
    sha: process.env.CI_COMMIT_SHA ?? null,
    engine,
    measuredAt: new Date().toISOString(),
    scenes: measured,
    anchors: anchorVerdicts,
    constants: deriveConstants(current, measured, anchors),
  };
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, ARTIFACT);
  writeFileSync(outFile, `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(`wrote ${outFile}`);
  for (const [id, s] of Object.entries(measured)) {
    console.log(`  ${id.padEnd(20)} mean ${s.mean.toFixed(4)}  p10 ${s.p10.toFixed(4)}  p90 ${s.p90.toFixed(4)}  stdev ${s.stdev.toFixed(4)}  → ${s.tone}`);
  }
  for (const [k, v] of Object.entries(artifact.constants)) console.log(`  ${k} current ${v.current} derived ${v.derived} feasible ${JSON.stringify(v.feasible)}`);
  const bad = Object.entries(anchorVerdicts).filter(([, v]) => !v.ok);
  if (bad.length) fail(`anchor scenes misclassified with the current TONE_* constants: ${bad.map(([id, v]) => `${id} want ${v.want} got ${v.got}`).join('; ')}`);
}

// --fixture overrides the target (used by tests/media/calibrate-media-tone.test.ts).
const fixturePath = opt('fixture') ?? FIXTURE_PATH;
const shown = relative(ROOT, fixturePath);

if (flag('check')) {
  const want = fixtureFromArtifact(readArtifact());
  if (!existsSync(fixturePath)) fail(`${shown} is missing; regenerate it with --write --from <artifact>`);
  const have = JSON.parse(readFileSync(fixturePath, 'utf8'));
  const diffs = sceneIds().filter((id) => JSON.stringify(have.scenes?.[id]) !== JSON.stringify(want.scenes[id]));
  if (diffs.length) fail(`${shown} differs from the artifact for: ${diffs.join(', ')} (run --write --from <artifact>)`);
  console.log(`${shown} matches the artifact (8 scenes)`);
} else if (flag('write')) {
  const fixture = fixtureFromArtifact(readArtifact());
  writeFileSync(fixturePath, `${JSON.stringify(fixture, null, 2)}\n`);
  console.log(`wrote ${shown} from the artifact`);
} else {
  await measure();
}
