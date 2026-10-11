/** update (PLAT-313): replace installed file when clean upstream diff; refuse modified/both (exit 1) unless --force -> write `<file>.auraglass-upstream`. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { makeOut, status, printJson } from '../cli/output.js';
import { EXIT, CliError, usageError } from '../cli/errors.js';
import { fetchItem } from '../registry/client.js';
import { rewriteAliases } from './add.js';
import { unifiedDiff } from '../migrate/4to5/index.js';
import { assertClean } from '../core/git-guard.js';
import { ensureInsideCwd, atomicWrite } from '../core/fs-safety.js';

const STAMP = /(\/\/|\/\*+)\s*@auraglass\/registry\s+(\S+?)@(\S+)\s+sha256:([0-9a-f]{64})/;

export async function updateCommand(args: string[], flags: Record<string, string | boolean>): Promise<number> {
  const out = makeOut(flags);
  const cwd = String(flags.cwd ?? process.cwd());
  const [name] = args;
  if (!name) throw usageError('update <name> expected');
  const registry = typeof flags.registry === 'string' ? flags.registry : undefined;
  const item = await fetchItem(name, registry);
  const version = String((item as { version?: string }).version ?? '0.0.0');
  const force = Boolean(flags.force);

  const results: Array<{ file: string; action: string }> = [];
  const plannedWrites: Array<{ path: string; content: string }> = [];
  const refused: string[] = [];

  for (const f of item.files ?? []) {
    if (!f.path || f.content === undefined) continue;
    const upstreamHash = createHash('sha256').update(f.content, 'utf8').digest('hex');
    // Find the stamped local file.
    let localPath: string | null = null;
    let localBody = '';
    let localSha = '';
    const walk = (dir: string, depth: number) => {
      if (depth > 6 || localPath) return;
      let ents: fs.Dirent[];
      try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (const ent of ents) {
        if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) { walk(p, depth + 1); continue; }
        if (!/\.(tsx?|jsx?|css)$/.test(ent.name)) continue;
        try {
          const raw = fs.readFileSync(p, 'utf8');
          const m = raw.slice(0, 400).match(STAMP);
          if (m && m[2] === item.name && (p.endsWith(`/${f.path!}`) || p.endsWith(f.path!) ||
              (p.includes(`/${item.name}/`) && p.endsWith(`/${path.basename(f.path!)}`)))) {
            localPath = p;
            localSha = m[4]!;
            localBody = raw.replace(/^(\/\/|\/\*+)\s*@auraglass\/registry[^\n]*\n/, '');
            return;
          }
        } catch { /* skip */ }
      }
    };
    walk(cwd, 0);
    if (!localPath) {
      results.push({ file: f.path, action: 'not-installed' });
      continue;
    }
    const localHash = createHash('sha256').update(localBody, 'utf8').digest('hex');
    const locallyModified = localHash !== localSha;
    const upstreamChanged = upstreamHash !== localSha;
    if (!upstreamChanged && !locallyModified) {
      results.push({ file: f.path, action: 'unchanged' });
      continue;
    }
    if (locallyModified && !force) {
      refused.push(f.path);
      results.push({ file: f.path, action: 'refused-locally-modified' });
      continue;
    }
    if (locallyModified && force) {
      const stamp = `// @auraglass/registry ${item.name}@${version} sha256:${upstreamHash}\n`;
      plannedWrites.push({ path: `${localPath}.auraglass-upstream`, content: stamp + rewriteAliases(f.content, '@', '') });
      results.push({ file: f.path, action: 'wrote .auraglass-upstream' });
      continue;
    }
    const stamp = `// @auraglass/registry ${item.name}@${version} sha256:${upstreamHash}\n`;
    plannedWrites.push({ path: localPath, content: stamp + rewriteAliases(f.content, '@', '') });
    results.push({ file: f.path, action: 'updated' });
  }

  if (flags['dry-run']) {
    const diffs = plannedWrites.map((w: any) => {
      const abs = path.join(cwd, w.path);
      const before = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
      return { path: w.path, diff: unifiedDiff(w.path, before, w.content) };
    });
    const dryRefused = refused.length && !force ? `refusing to overwrite modified files: ${refused.join(', ')}` : null;
    if (out.json) printJson({ version: 1, dryRun: true, files: diffs.map((d) => d.path), diffs, ...(dryRefused ? { error: dryRefused } : {}) });
    else {
      for (const d of diffs) { if (!out.silent) process.stdout.write(`${d.diff}\n`); }
      if (dryRefused) status(out, 'fail', `${dryRefused} (use --force to write .auraglass-upstream)`);
    }
    return dryRefused ? EXIT.validation : EXIT.ok;
  }
  /* apply what's allowed first; refused files still report + exit 1 */
  if (plannedWrites.length) {
    assertClean(cwd, plannedWrites.map((p: any) => p.path), { allowDirty: Boolean(flags['allow-dirty']), allowNoGit: Boolean(flags['allow-no-git']) });
    for (const w of plannedWrites) {
      const dest = ensureInsideCwd(cwd, w.path);
      atomicWrite(cwd, dest, w.content);
    }
  }
  const refusedError = refused.length && !force
    ? `refusing to overwrite modified files: ${refused.join(', ')}`
    : null;
  if (out.json) printJson({ version: 1, name, upstream: version, files: results, ...(refusedError ? { error: refusedError } : {}) });
  else {
    for (const r of results) status(out, r.action === 'updated' ? 'pass' : 'info', `${r.file}: ${r.action}`);
    if (refusedError) status(out, 'fail', `${refusedError} (use --force to write .auraglass-upstream)`);
  }
  return refusedError ? EXIT.validation : EXIT.ok;
}
