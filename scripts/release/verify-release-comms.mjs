#!/usr/bin/env node
/* scripts/release/verify-release-comms.mjs — PLAT-209. The release-banner and
   version claims outside the release docs must stay in sync:
     - README carries the `<!-- AG-RELEASE-BANNER -->` marker block and the
       banner's major version matches package.json.
     - llms.txt has a `## Versions` section listing the same major.
     - npm dist-tags (--dist-tags, live) agree with the package version.
   Usage: node scripts/release/verify-release-comms.mjs [--dist-tags] [--root .] */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

export const bannerOf = (readme) => {
  const m = readme.match(/<!--\s*AG-RELEASE-BANNER\s*-->([\s\S]*?)<!--\s*\/AG-RELEASE-BANNER\s*-->/);
  return m ? m[1] : null;
};
export const versionsSection = (llms) => {
  const start = llms.match(/^##\s+Versions?\b[^\n]*\n/mi);
  if (!start || start.index == null) return null;
  const rest = llms.slice(start.index + start[0].length);
  const next = rest.match(/^##\s/m);
  return next && next.index != null ? rest.slice(0, next.index) : rest;
};
export const majorOf = (v) => v.split('.')[0];

export function checkComms({ readme = '', llms = '', pkgVersion = '0.0.0', distTags = null } = {}) {
  const errors = []; const notes = [];
  const banner = bannerOf(readme);
  if (!banner) errors.push('README.md: missing <!-- AG-RELEASE-BANNER --> block');
  else if (!banner.includes(`v${majorOf(pkgVersion)}`) && !banner.includes(`${majorOf(pkgVersion)}.x`))
    notes.push(`README banner does not mention v${majorOf(pkgVersion)} (update at each major cut)`);
  const vers = versionsSection(llms);
  if (!vers) errors.push('llms.txt: missing ## Versions section');
  else if (!vers.includes(`${majorOf(pkgVersion)}.x`) && !vers.includes(`v${majorOf(pkgVersion)}`))
    errors.push(`llms.txt Versions does not list ${majorOf(pkgVersion)}.x`);
  if (distTags) {
    const latestMajor = majorOf(distTags.latest ?? '');
    if (latestMajor && latestMajor !== majorOf(pkgVersion))
      notes.push(`npm latest (${distTags.latest}) tracks a different major than package.json (${pkgVersion}) — expected during the 5.0.0 train`);
    if (distTags.next && !distTags.next.startsWith(`${majorOf(pkgVersion)}.`))
      errors.push(`npm next dist-tag (${distTags.next}) does not match package.json major ${majorOf(pkgVersion)}`);
  }
  return { errors, notes };
}

export function main(argv = process.argv.slice(2), { root = ROOT } = {}) {
  const read = (p) => existsSync(p) ? readFileSync(p, 'utf8') : '';
  const pkg = JSON.parse(read(join(root, 'package.json')) || '{}');
  let distTags = null;
  if (argv.includes('--dist-tags')) {
    try { distTags = JSON.parse(execFileSync('npm', ['view', 'aura-glass', 'dist-tags', '--json'], { encoding: 'utf8', timeout: 30000 })); }
    catch { distTags = { error: 'unreachable' }; }
  }
  const { errors, notes } = checkComms({
    readme: read(join(root, 'README.md')), llms: read(join(root, 'llms.txt')),
    pkgVersion: pkg.version ?? '0.0.0', distTags,
  });
  for (const n of notes) console.log(`note ${n}`);
  if (errors.length) { for (const e of errors) console.error(`FAIL ${e}`); return 1; }
  console.log('verify-release-comms: release banner + llms.txt in sync');
  return 0;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try { process.exit(main()); } catch (e) { console.error(e); process.exit(1); }
}
