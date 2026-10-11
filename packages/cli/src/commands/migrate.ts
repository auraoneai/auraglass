import fs from 'node:fs';
import path from 'node:path';
import { makeOut, status, printJson } from '../cli/output.js';
import { EXIT, usageError } from '../cli/errors.js';
import { runMigration, selectTransforms } from '../migrate/4to5/index.js';
import { atomicWrite, ensureInsideCwd } from '../core/fs-safety.js';
import { assertClean } from '../core/git-guard.js';
import { migrateIcons, reportOnly } from '../migrate/legacy/icons.js';

export async function migrateCommand(args: string[], flags: Record<string, string | boolean>): Promise<number> {
  const out = makeOut(flags);
  const cwd = String(flags.cwd ?? process.cwd());
  const [sub] = args;
  if (sub === 'icons') {
    const from = String(flags.from ?? '');
    if (from !== 'lucide' && from !== 'radix' && from !== 'mui') {
      throw usageError(`migrate icons --from <lucide|radix|mui> expected, got '${from || '(none)'}'`);
    }
    const write = Boolean(flags.write);
    if (write) {
      const preview = migrateIcons(cwd, from, false);
      if (preview.changed) assertClean(cwd, (preview.report.files as string[]).map((f) => path.join(cwd, f)), {
        allowDirty: Boolean(flags['allow-dirty']),
        allowNoGit: Boolean(flags['allow-no-git']),
      });
    }
    const r = migrateIcons(cwd, from, write);
    if (out.json) printJson(r.report);
    else for (const l of r.lines) status(out, 'info', l);
    return r.changed && !write ? EXIT.validation : EXIT.ok;
  }
  if (sub === 'radix' || sub === 'mui') {
    if (flags.write) throw usageError(`${sub} is report-only; no automated migration`);
    const r = reportOnly(cwd, sub);
    if (out.json) printJson(r.report);
    else for (const l of r.lines) status(out, 'info', l);
    return EXIT.ok;
  }
  if (sub === '4to5' || sub === undefined) {
    const transforms = flags.transform ? String(flags.transform).split(',') : undefined;
    if (transforms) selectTransforms(transforms);
    const dryRun = Boolean(flags['dry-run']);
    const paths = args.slice(1).filter((a) => !a.startsWith('-'));
    const { report, writes, diffs } = runMigration({ cwd, transforms, dryRun, paths: paths.length ? paths : undefined });
    if (dryRun) {
      if (out.json) {
        printJson({ ...report, dryRun: true, diffs: Object.fromEntries(diffs) });
      } else {
        for (const d of diffs.values()) {
          if (!out.silent) process.stdout.write(`${d}\n`);
        }
        status(out, 'info', `dry-run: ${report.summary.filesChanged} file(s) would change, ${report.summary.todos} TODO(s)`);
      }
    } else {
      const touched = [...writes.keys()];
      assertClean(cwd, touched, { allowDirty: Boolean(flags['allow-dirty']), allowNoGit: Boolean(flags['allow-no-git']) });
      for (const [abs, content] of writes) {
        atomicWrite(cwd, abs, content);
      }
      if (out.json) {
        printJson(report);
      } else {
        status(out, 'info', `${report.summary.filesChanged} file(s) changed, ${report.summary.changes} change(s), ${report.summary.todos} TODO(s)`);
        for (const f of report.files) {
          for (const t of f.todos) status(out, 'warn', `${f.path}${t.line ? `:${t.line}` : ''} TODO ${t.reason}`);
        }
      }
    }
    if (typeof flags.report === 'string') {
      const dest = ensureInsideCwd(cwd, flags.report);
      fs.writeFileSync(dest, `${JSON.stringify(report, null, 2)}\n`);
    }
    if (report.summary.todos > 0 && !flags['allow-todo']) return EXIT.validation;
    return EXIT.ok;
  }
  throw usageError(`unknown migrate subcommand: ${sub ?? '(none)'} (expected 4to5|icons|radix|mui)`);
}
