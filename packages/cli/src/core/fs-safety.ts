/**
 * Filesystem safety (PLAT-303): every write target and traversal result is
 * realpath-resolved on BOTH sides and must stay inside the project cwd.
 * Escape attempts are a safety refusal (exit 3).
 */
import fs from 'node:fs';
import path from 'node:path';
import { safetyError } from '../cli/errors.js';

export function realpath(p: string): string {
  try {
    return fs.realpathSync(p);
  } catch {
    // The path may not exist yet; resolve its nearest existing ancestor.
    const dir = path.dirname(p);
    try {
      return path.join(fs.realpathSync(dir), path.basename(p));
    } catch {
      return path.resolve(p);
    }
  }
}

export function isInsideCwd(cwd: string, target: string): boolean {
  const root = realpath(cwd);
  const full = realpath(target);
  if (full === root) return true;
  return full.startsWith(root + path.sep);
}

/** Return the resolved absolute path or throw exit-3. */
export function ensureInsideCwd(cwd: string, target: string): string {
  const abs = path.isAbsolute(target) ? target : path.join(cwd, target);
  if (!isInsideCwd(cwd, abs)) {
    throw safetyError(`Refusing to write outside the current project: ${abs}`);
  }
  return realpath(abs);
}

export function mkdirp(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

/** Atomic write: temp file in the same directory, then rename over the target. */
export function atomicWrite(cwd: string, target: string, contents: string): void {
  const dest = ensureInsideCwd(cwd, target);
  mkdirp(path.dirname(dest));
  const tmp = `${dest}.tmp-${process.pid}-${Date.now()}`;
  try {
    fs.writeFileSync(tmp, contents, 'utf8');
    fs.renameSync(tmp, dest);
  } finally {
    try {
      fs.rmSync(tmp);
    } catch { /* already moved */ }
  }
}

/** Atomic write for generated project files (init / add). */
export function writeProjectFile(cwd: string, target: string, contents: string): void {
  atomicWrite(cwd, target, contents);
}
