import { makeOut, status, printJson } from '../cli/output.js';
import { runChecks } from '../doctor/checks.js';
import { runV5 } from '../doctor/v5.js';
import { EXIT } from '../cli/errors.js';

export async function doctorCommand(args: string[], flags: Record<string, string | boolean>): Promise<number> {
  const out = makeOut(flags);
  const cwd = String(flags.cwd ?? process.cwd());
  void args;
  if (flags.v5) {
    const { findings, byCodemod } = runV5(cwd);
    const summary = { automatic: 0, needsReview: 0, manual: 0 };
    for (const f of findings) summary[f.automation] += 1;
    if (out.json) {
      printJson({ version: 1, summary, findings, byCodemod });
    } else {
      if (!findings.length) status(out, 'pass', 'no removeIn 5.0.0 usages found');
      for (const [codemod, list] of Object.entries(byCodemod)) {
        for (const f of list) {
          status(out, f.automation === 'manual' ? 'warn' : 'info', `${f.path}:${f.line} ${f.symbol} [${codemod}/${f.automation}] ${f.message}`);
        }
      }
    }
    return EXIT.ok;
  }
  const results = runChecks(cwd);
  if (out.json) {
    printJson({ version: 1, checks: results });
  } else {
    for (const r of results) status(out, r.status === 'pass' ? 'pass' : r.status === 'info' ? 'info' : r.status === 'warn' ? 'warn' : 'fail', `${r.id}: ${r.message}`);
  }
  return results.some((r: any) => r.status === 'fail') ? EXIT.validation : EXIT.ok;
}
