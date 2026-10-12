/** File walker shared by migrate, audit and doctor --v5 (no transform imports, so
 *  doctor --v5 can be bundled into the 4.x CLI without jscodeshift — REQ-PLAT-61). */
import fs from 'node:fs';
import path from 'node:path';

export const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'out', 'coverage', '.turbo', 'storybook-static']);

/** Minimal .gitignore matcher: dir names, `*.ext`, leading-slash, `**`. */
function gitignoreMatcher(patterns: string[]): (rel: string, isDir: boolean) => boolean {
  const rules = patterns
    .map((p: any) => p.trim())
    .filter((p: any) => p && !p.startsWith('#') && !p.startsWith('!'));
  const toRe = (p: string): RegExp => {
    let s = p;
    const dirOnly = s.endsWith('/');
    if (dirOnly) s = s.slice(0, -1);
    const anchored = s.startsWith('/');
    if (anchored) s = s.slice(1);
    const esc = s
      .replace(/[.+^${}()|[\]\\]/g, '\\$&')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '[^/]*')
      .replace(//g, '.*');
    const base = anchored ? `^${esc}` : `(^|/)${esc}`;
    return new RegExp(dirOnly ? `${base}(/|$)` : `${base}$`);
  };
  const res = rules.map(toRe);
  return (rel) => res.some((r: any) => r.test(rel));
}

function loadIgnores(cwd: string): (rel: string, isDir: boolean) => boolean {
  const patterns: string[] = [];
  try {
    patterns.push(...fs.readFileSync(path.join(cwd, '.gitignore'), 'utf8').split('\n'));
  } catch { /* none */ }
  const match = gitignoreMatcher(patterns);
  return (rel, isDir) => {
    const seg = rel.split('/');
    if (seg.some((s: any) => SKIP_DIRS.has(s))) return true;
    return match(rel, isDir);
  };
}

export function walkFiles(cwd: string, roots?: string[]): string[] {
  const ignored = loadIgnores(cwd);
  const out: string[] = [];
  const dirs = roots?.length ? roots.map((r: any) => path.join(cwd, r)) : [cwd];
  const stack = [...dirs];
  while (stack.length) {
    const dir = stack.pop()!;
    let ents: fs.Dirent[];
    try {
      ents = fs.readdirSync(dir, { withFileTypes: true });
    } catch { continue; }
    for (const ent of ents) {
      const abs = path.join(dir, ent.name);
      const rel = path.relative(cwd, abs).split(path.sep).join('/');
      if (ignored(rel, ent.isDirectory())) continue;
      if (ent.isDirectory()) stack.push(abs);
      else if (ent.isFile()) out.push(abs);
    }
  }
  return out.sort();
}
