/* tests/dx/lib/local-registry.ts — PLAT-103 (REQ-FIN-43). Verdaccio-seeded npm
   registry for the quickstart replay: the packed `aura-glass` and
   `@auraglass/cli` tarballs (plat:package:pack / plat:test:docs) are published
   into a throwaway verdaccio so the doc commands (`npm install aura-glass@^5`,
   `npx @auraglass/cli ...`) resolve to the commit under test instead of the
   public registry (where @auraglass/cli does not exist and aura-glass is 4.x).
   Everything else proxies to registry.npmjs.org. Remote-only (CI). */
import { spawn, execFileSync, type ChildProcess } from 'node:child_process';
import { mkdtempSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer } from 'node:net';

/** Pinned verdaccio (exact version per machine policy). */
export const VERDACCIO = 'verdaccio@6.10.5';
/** Packages that must come only from the seeded tarballs (never the uplink). */
const LOCAL_ONLY = ['aura-glass', '@auraglass/*'];

export interface LocalRegistry {
  url: string;
  /** name -> seeded version */
  seeded: Record<string, string>;
  stop(): void;
}

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const s = createServer();
    s.once('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const addr = s.address();
      const port = typeof addr === 'object' && addr ? addr.port : 0;
      s.close(() => resolve(port));
    });
  });
}

async function waitUp(url: string, proc: ChildProcess, timeoutMs: number): Promise<void> {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    if (proc.exitCode !== null) throw new Error(`verdaccio exited early (code ${proc.exitCode})`);
    try {
      const res = await fetch(`${url}/-/ping`);
      if (res.ok) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`verdaccio did not answer ${url}/-/ping within ${timeoutMs} ms`);
}

/** Tarballs to seed: every *.tgz in `packDir` whose name starts with one of `prefixes`. */
export function findTarballs(packDir: string, prefixes: string[]): string[] {
  if (!existsSync(packDir)) return [];
  return readdirSync(packDir)
    .filter((f) => f.endsWith('.tgz') && prefixes.some((p) => f.startsWith(p)))
    .map((f) => join(packDir, f));
}

export async function startLocalRegistry(tarballs: string[]): Promise<LocalRegistry> {
  if (tarballs.length === 0) throw new Error('local registry: no tarballs to seed (needs plat:package:pack artifacts)');
  const dir = mkdtempSync(join(tmpdir(), 'ag-verdaccio-'));
  const port = await freePort();
  const url = `http://127.0.0.1:${port}`;
  const local = LOCAL_ONLY.map((p) => `  '${p}':\n    access: $all\n    publish: $all\n`).join('');
  writeFileSync(
    join(dir, 'config.yaml'),
    `storage: ${join(dir, 'storage')}\n` +
      `auth:\n  htpasswd:\n    file: ${join(dir, 'htpasswd')}\n    max_users: 10\n` +
      `uplinks:\n  npmjs:\n    url: https://registry.npmjs.org/\n    timeout: 60s\n` +
      `packages:\n${local}  '**':\n    access: $all\n    publish: $authenticated\n    proxy: npmjs\n` +
      `log: { type: stdout, format: pretty, level: warn }\n`,
  );
  const proc = spawn('npx', ['-y', VERDACCIO, '--config', join(dir, 'config.yaml'), '--listen', `127.0.0.1:${port}`], {
    stdio: 'ignore',
    detached: false,
  });
  const stop = () => { if (proc.exitCode === null) proc.kill('SIGTERM'); };
  try {
    await waitUp(url, proc, 120_000);
    // A throwaway user gives npm publish a token (verdaccio refuses token-less publishes).
    const res = await fetch(`${url}/-/user/org.couchdb.user:ag-ci`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'ag-ci', password: 'ag-ci-throwaway' }),
    });
    const { token } = (await res.json()) as { token?: string };
    if (!token) throw new Error(`verdaccio adduser failed: HTTP ${res.status}`);
    const host = url.replace(/^https?:/, '');
    const seeded: Record<string, string> = {};
    for (const tgz of tarballs) {
      const out = execFileSync(
        'npm',
        ['publish', tgz, '--registry', url, `--${host}/:_authToken=${token}`, '--tag', 'latest', '--ignore-scripts', '--json'],
        { cwd: dir, stdio: ['ignore', 'pipe', 'pipe'], timeout: 120_000 },
      ).toString();
      const rep = JSON.parse(out.slice(out.indexOf('{'))) as { name: string; version: string };
      seeded[rep.name] = rep.version;
    }
    return { url, seeded, stop };
  } catch (e) {
    stop();
    throw e;
  }
}
