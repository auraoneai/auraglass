/**
 * Git guard (PLAT-303): writing commands refuse to write into files that are
 * already dirty (`git status --porcelain -- <touched paths>` non-empty).
 * `--allow-dirty` and `--allow-no-git` opt out explicitly.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { safetyError } from '../cli/errors.js';

export function isGitRepo(cwd: string): boolean {
  try {
    execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd, stdio: 'pipe' });
    return true;
  } catch {
    return fs.existsSync(path.join(cwd, '.git'));
  }
}

export interface GitGuardOptions {
  allowDirty?: boolean;
  allowNoGit?: boolean;
}

/**
 * Assert that every path in `touched` (absolute or cwd-relative) is clean.
 * Throws exit-3 otherwise; no-op when allowDirty, or when cwd is not a repo
 * and allowNoGit. When cwd is not a repo without the flag, refuses —
 * writing without version control is unsafe.
 */
export function assertClean(cwd: string, touched: string[], opts: GitGuardOptions): void {
  /* Non-git is refused unless allowNoGit — independent of allowDirty. */
  if (!isGitRepo(cwd)) {
    if (opts.allowNoGit) return;
    throw safetyError(`Not a git repository: ${cwd} (pass --allow-no-git to proceed without a guard)`);
  }
  if (opts.allowDirty) return;
  const rel = touched.map((t: any) => path.relative(cwd, path.isAbsolute(t) ? t : path.join(cwd, t)));
  let out = '';
  try {
    out = execFileSync('git', ['status', '--porcelain', '--', ...rel], { cwd, encoding: 'utf8' });
  } catch (e) {
    throw safetyError(`git status failed — refusing to write without a cleanliness check: ${(e as Error).message}`);
  }
  const dirty = out.split('\n').map((l) => l.slice(3).trim()).filter(Boolean);
  if (dirty.length > 0) {
    throw safetyError(`Refusing to write into a dirty tree: ${dirty.join(', ')}`);
  }
}
