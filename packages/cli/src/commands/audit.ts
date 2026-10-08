import fs from 'node:fs';
import path from 'node:path';
import { makeOut, status, printJson } from '../cli/output.js';
import { EXIT, networkError, usageError } from '../cli/errors.js';
import { walkFiles } from '../migrate/4to5/index.js';
import { AUDIT_THRESHOLDS } from '../audit/thresholds.js';

const FORBIDDEN = ['@mui/', 'react-bootstrap', 'antd', '@chakra-ui/', 'primereact', 'react-datepicker'];

function auditDeps(cwd: string): Record<string, unknown> {
  const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  const issues: Array<{ pkg: string; kind: string }> = [];
  for (const f of FORBIDDEN) {
    for (const d of Object.keys(all)) {
      if (d === f || d.startsWith(f)) issues.push({ pkg: d, kind: 'forbidden' });
    }
  }
  return { version: 1, kind: 'deps', dependencies: Object.keys(all).length, issues };
}

function auditImports(cwd: string): Record<string, unknown> {
  const counts: Record<string, number> = {};
  const files: string[] = [];
  for (const abs of walkFiles(cwd)) {
    if (!/\.(tsx?|jsx?)$/.test(abs)) continue;
    let src: string;
    try { src = fs.readFileSync(abs, 'utf8'); } catch { continue; }
    const rel = path.relative(cwd, abs);
    let hit = false;
    for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
      const spec = m[1]!;
      if (/^(aura-glass|@auraglass)/.test(spec)) {
        counts[spec] = (counts[spec] ?? 0) + 1;
        hit = true;
      }
    }
    if (hit) files.push(rel);
  }
  return { version: 1, kind: 'imports', files, subpaths: counts };
}

export async function auditCommand(args: string[], flags: Record<string, string | boolean>): Promise<number> {
  const out = makeOut(flags);
  const cwd = String(flags.cwd ?? process.cwd());
  const [sub] = args;
  if (sub === 'deps') {
    const r = auditDeps(cwd);
    if (out.json) printJson(r);
    else {
      status(out, 'info', `${(r.dependencies as number)} dependencies`);
      for (const i of r.issues as Array<{ pkg: string }>) status(out, 'warn', `forbidden dep: ${i.pkg}`);
    }
    return (r.issues as unknown[]).length ? EXIT.validation : EXIT.ok;
  }
  if (sub === 'imports') {
    const r = auditImports(cwd);
    if (out.json) printJson(r);
    else {
      for (const [spec, n] of Object.entries(r.subpaths as Record<string, number>)) {
        status(out, 'info', `${spec} (${n})`);
      }
      status(out, 'info', `${(r.files as string[]).length} file(s) import aura-glass`);
    }
    return EXIT.ok;
  }
  if (sub === 'backdrop') {
    // Remote-only: POST page/frame data to AURAGLASS_AUDIT_ENDPOINT.
    const url = process.env.AURAGLASS_AUDIT_ENDPOINT;
    if (!url) {
      status(out, 'fail', 'AURAGLASS_AUDIT_ENDPOINT is not set — configure the audit service first');
      return EXIT.network;
    }
    const target = typeof flags.url === 'string' ? flags.url : undefined;
    if (!target) throw usageError('audit backdrop --url <url> expected');
    let res: Response;
    try {
      res = await fetch(`${url.replace(/\/$/, '')}/audit`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: target, thresholds: AUDIT_THRESHOLDS }),
      });
    } catch (e) {
      throw networkError(`audit backdrop unreachable: ${url} (${String(e)})`);
    }
    if (!res.ok) throw networkError(`audit backdrop ${res.status}: ${url}`);
    const report = (await res.json()) as Record<string, unknown>;
    if (out.json) printJson(report);
    else status(out, 'info', `backdrop audit ${target}`);
    return EXIT.ok;
  }
  throw usageError(`unknown audit subcommand: ${sub ?? '(none)'} (expected deps|imports|backdrop)`);
}
