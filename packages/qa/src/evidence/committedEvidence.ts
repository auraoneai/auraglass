/* REQ-QUAL-60 Evidence is artifacts, never commits (QUAL, S-48, D-32).
   Tracked paths may not include generated evidence: anything under reports/, certification/out/,
   test-results/, playwright-report/, coverage/, .artifacts/, storybook-static/, any `*-snapshots/`
   directory, or any PNG outside certification/baselines/, certification/scenes/, showcase/<id>/assets/
   and docs/**\/assets/. Shipping PNGs under src/**\/assets/ are admitted only by the owner's OD-19
   decision (docs/release/decisions/od-19.md, question 2); until it is recorded they sit in the expiring
   baseline packages/qa/baselines/no-committed-evidence.json. */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const EVIDENCE_DIRS = ['reports/', 'certification/out/', 'test-results/', 'playwright-report/', 'coverage/',
  '.artifacts/', 'storybook-static/'] as const;
export const OD19_RECORD = 'docs/release/decisions/od-19.md';
export const COMMITTED_EVIDENCE_BASELINE = 'packages/qa/baselines/no-committed-evidence.json';

const PNG_ALLOWED: readonly RegExp[] = [
  /^certification\/baselines\//,
  /^certification\/scenes\//,
  /^showcase\/[^/]+\/assets\//,
  /^docs\/(?:.+\/)?assets\//,
];
const SRC_ASSETS = /^src\/(?:.+\/)?assets\//;

export type EvidenceRule = 'evidence-path' | 'snapshot-dir' | 'png-outside-allowlist';
export interface EvidenceOffender { file: string; rule: EvidenceRule }

export interface Od19Decision { recorded: boolean; admitSrcAssets: boolean; status: string }

/** Reads OD-19's front matter. Only the owner fills `status`; `defaulted` takes the PRD-F §5.9 default
    (allow `src/**\/assets/`); `decided` must state `pngAllowlist: allow-src-assets | relocate`. */
export function parseOd19(text: string | null): Od19Decision {
  if (text === null) return { recorded: false, admitSrcAssets: false, status: 'absent' };
  const fm = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!fm) throw new Error(`${OD19_RECORD}: missing front matter`);
  const field = (k: string) => new RegExp(`^${k}:[ \\t]*(.*)$`, 'm').exec(fm[1]!)?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '';
  const status = field('status');
  if (status === 'defaulted') return { recorded: true, admitSrcAssets: true, status };
  if (status === 'decided') {
    const choice = field('pngAllowlist');
    if (choice === 'allow-src-assets') return { recorded: true, admitSrcAssets: true, status };
    if (choice === 'relocate') return { recorded: true, admitSrcAssets: false, status };
    throw new Error(`${OD19_RECORD}: status decided but pngAllowlist is '${choice}' (expected allow-src-assets | relocate)`);
  }
  return { recorded: false, admitSrcAssets: false, status: status || 'unset' };
}

export function scanTrackedPaths(paths: readonly string[], od19: Od19Decision): EvidenceOffender[] {
  const out: EvidenceOffender[] = [];
  for (const file of paths) {
    if (EVIDENCE_DIRS.some((d) => file.startsWith(d))) out.push({ file, rule: 'evidence-path' });
    else if (/(^|\/)[^/]+-snapshots\//.test(file)) out.push({ file, rule: 'snapshot-dir' });
    else if (/\.png$/i.test(file) && !PNG_ALLOWED.some((re) => re.test(file)) && !(od19.admitSrcAssets && SRC_ASSETS.test(file))) {
      out.push({ file, rule: 'png-outside-allowlist' });
    }
  }
  return out;
}

export function gitTrackedPaths(cwd: string): string[] {
  return execFileSync('git', ['ls-files', '-z'], { cwd, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }).split('\0').filter(Boolean);
}

export function readOd19(root: string): Od19Decision {
  const p = join(root, OD19_RECORD);
  return parseOd19(existsSync(p) ? readFileSync(p, 'utf8') : null);
}
