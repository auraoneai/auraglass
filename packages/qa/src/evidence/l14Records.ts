/* REQ-QUAL-25 (QUAL, FIN-432). L14 records a `next-qual/baselines-<yyyymmdd>` PR needs for every changed subject-state.
   Records are human-made files under certification/review/records/ (FIN-H path; this module only reads them). The record
   shape is certification/schemas/review-record.schema.json (G-16, REQ-QUAL-73); a record passes when every rubric score is
   ≥ 3. A malformed record is reported, never counted. */
import { existsSync, globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const L14_RECORDS_DIR = 'certification/review/records';

export interface L14Read { passing: Set<string>; problems: string[] }

export function readPassingL14(root: string, dir = L14_RECORDS_DIR): L14Read {
  const abs = join(root, dir);
  const passing = new Set<string>();
  const problems: string[] = [];
  if (!existsSync(abs)) return { passing, problems };
  for (const f of globSync('**/*.json', { cwd: abs }).sort()) {
    let r: { version?: unknown; sha?: unknown; reviewer?: unknown; item?: { kind?: unknown; subject?: unknown; state?: unknown }; scores?: Record<string, unknown> };
    try { r = JSON.parse(readFileSync(join(abs, f), 'utf8')); } catch (e) { problems.push(`${dir}/${f}: ${(e as Error).message}`); continue; }
    const scores = r.scores && typeof r.scores === 'object' ? Object.values(r.scores) : [];
    const valid = r.version === 1 && typeof r.sha === 'string' && /^[0-9a-f]{40}$/.test(r.sha) && typeof r.reviewer === 'string' && r.reviewer.length >= 2
      && r.item?.kind === 'subject-state' && typeof r.item.subject === 'string' && typeof r.item.state === 'string'
      && scores.length >= 6 && scores.every((s) => Number.isInteger(s) && (s as number) >= 1 && (s as number) <= 4);
    if (!valid) {
      if (r.item?.kind === 'subject-state') problems.push(`${dir}/${f}: not a valid subject-state review record`);
      continue;
    }
    if (scores.every((s) => (s as number) >= 3)) passing.add(`${r.item!.subject as string}/${r.item!.state as string}`);
  }
  return { passing, problems };
}
