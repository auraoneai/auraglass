import fs from 'node:fs';
import path from 'node:path';
import { makeOut, status, printJson } from '../cli/output.js';
import { EXIT, networkError, usageError } from '../cli/errors.js';
import { walkFiles } from '../migrate/4to5/index.js';
import { AUDIT_THRESHOLDS } from '../audit/thresholds.js';
import { buildRequest, formatSurface, runBackdropAudit } from '../audit/backdrop.js';

const BACKDROP_SETUP = [
  'AURAGLASS_AUDIT_ENDPOINT is not set — audit backdrop is remote-only and never launches a browser locally',
  'run the reference endpoint where Playwright is installed: node node_modules/@auraglass/cli/audit/reference-server.mjs --port 4791',
  'then: AURAGLASS_AUDIT_ENDPOINT=http://<host>:4791 auraglass audit backdrop --url <url> [--selector <css>]',
  'contract: node_modules/@auraglass/cli/schema/audit-backdrop.json',
];

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
    // Remote-only (REQ-PLAT-89): the CLI never starts a browser; it POSTs to
    // AURAGLASS_AUDIT_ENDPOINT per schema/audit-backdrop.json.
    const endpoint = process.env.AURAGLASS_AUDIT_ENDPOINT;
    if (!endpoint) {
      for (const line of BACKDROP_SETUP) status(out, line === BACKDROP_SETUP[0] ? 'fail' : 'info', line);
      return EXIT.network;
    }
    const target = typeof flags.url === 'string' ? flags.url : undefined;
    if (!target) throw usageError('audit backdrop --url <url> [--selector <css>] expected');
    if (flags.selector === true) throw usageError('audit backdrop --selector <css> needs a value');
    const selector = typeof flags.selector === 'string' ? flags.selector : undefined;
    const outcome = await runBackdropAudit(endpoint, buildRequest(target, selector));
    if (outcome.kind === 'remote-error') throw networkError(outcome.message);
    const { report, evaluated, failed } = outcome;
    if (out.json) {
      printJson({ ...report, surfaces: evaluated, thresholds: AUDIT_THRESHOLDS, failed });
    } else {
      for (const s of evaluated) status(out, s.verdict, formatSurface(s));
      if (!evaluated.length) status(out, 'fail', `no [data-ag-surface] found at ${report.url}${selector ? ` within ${selector}` : ''}`);
      else status(out, 'info', `${evaluated.length - failed}/${evaluated.length} surface(s) pass at ${report.url}`);
    }
    return failed > 0 || evaluated.length === 0 ? EXIT.validation : EXIT.ok;
  }
  throw usageError(`unknown audit subcommand: ${sub ?? '(none)'} (expected deps|imports|backdrop)`);
}
