/** diff (PLAT-312): compare an installed file against the upstream item — 4 states + --patch. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { makeOut, status, printJson } from '../cli/output.js';
import { EXIT, usageError } from '../cli/errors.js';
import { fetchItem } from '../registry/client.js';
import { unifiedDiff } from '../migrate/4to5/index.js';
import { rewriteAliases } from './add.js';

type State = 'unchanged' | 'locally-modified' | 'upstream-changed' | 'both' | 'not-installed' | 'missing-local';

const STAMP = /[@/*\s]*@auraglass\/registry\s+(\S+?)@(\S+)\s+sha256:([0-9a-f]{64})/;

function findStamped(cwd: string, name: string): Array<{ path: string; upstream: string; sha: string }> {
  const hits: Array<{ path: string; upstream: string; sha: string }> = [];
  const walk = (dir: string, depth: number) => {
    if (depth > 6) return;
    let ents: fs.Dirent[];
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const ent of ents) {
      if (ent.name === 'node_modules' || ent.name.startsWith('.')) continue;
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p, depth + 1);
      else if (/\.(tsx?|jsx?|css)$/.test(ent.name)) {
        try {
          const head = fs.readFileSync(p, 'utf8').slice(0, 400);
          const m = head.match(STAMP);
          if (m && m[1] === name) hits.push({ path: p, upstream: m[2]!, sha: m[3]! });
        } catch { /* skip */ }
      }
    }
  };
  walk(cwd, 0);
  return hits;
}

export async function diffCommand(args: string[], flags: Record<string, string | boolean>): Promise<number> {
  const out = makeOut(flags);
  const cwd = String(flags.cwd ?? process.cwd());
  const [name] = args;
  if (!name) throw usageError('diff <name> expected');
  const registry = typeof flags.registry === 'string' ? flags.registry : undefined;
  const item = await fetchItem(name, registry);
  const version = String((item as { version?: string }).version ?? '0.0.0');
  const stamped = findStamped(cwd, name);

  const states: Array<{ file: string; state: State; patch?: string }> = [];
  for (const f of item.files ?? []) {
    if (!f.path || f.content === undefined) continue;
    const upstreamHash = createHash('sha256').update(f.content, 'utf8').digest('hex');
    const local = stamped.find((s: any) => s.path.endsWith(`/${f.path!}`) || s.path.endsWith(f.path!));
    if (!local) {
      states.push({ file: f.path, state: 'not-installed' });
      continue;
    }
    const raw = fs.readFileSync(local.path, 'utf8');
    const body = raw.replace(/^(\/\/|\/\*+)\s*@auraglass\/registry[^\n]*\n/, '');
    const localHash = createHash('sha256').update(body, 'utf8').digest('hex');
    /* stamp sha = what upstream looked like at install time */
    const locallyModified = localHash !== local.sha;
    const upstreamChanged = upstreamHash !== local.sha;
    const state: State = !locallyModified && !upstreamChanged ? 'unchanged'
      : locallyModified && upstreamChanged ? 'both'
      : locallyModified ? 'locally-modified' : 'upstream-changed';
    const rel = path.relative(cwd, local.path);
    const entry: { file: string; state: State; patch?: string } = { file: rel, state };
    if (flags.patch && state !== 'unchanged') {
      entry.patch = unifiedDiff(rel, body, rewriteAliases(f.content, '@', ''));
    }
    states.push(entry);
  }
  for (const s of stamped) {
    if (!states.some((st) => path.join(cwd, st.file) === s.path)) {
      states.push({ file: path.relative(cwd, s.path), state: 'missing-local' });
    }
  }

  if (out.json) printJson({ version: 1, name, upstream: version, files: states });
  else {
    for (const s of states) {
      const lvl = s.state === 'unchanged' ? 'pass' : s.state === 'not-installed' || s.state === 'missing-local' ? 'info' : 'warn';
      status(out, lvl, `${s.file}: ${s.state}`);
      if (s.patch && !out.silent) process.stdout.write(`${s.patch}\n`);
    }
  }
  return states.some((s: any) => s.state === 'both' || s.state === 'upstream-changed' || s.state === 'locally-modified') ? EXIT.validation : EXIT.ok;
}
