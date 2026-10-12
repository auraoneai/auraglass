/* tests/dx/registry-shadcn-interop.spec.ts — REQ-PLAT-94 (remote,
   plat:test:registry, playwright.dx-e2e.config.ts). A fresh shadcn Base UI
   Next app (`npx shadcn@latest init --template next --base base`) adds the
   published AuraGlass registry items with the shadcn CLI itself:
     npx shadcn@latest add <url>/r/auraglass.json
     npx shadcn@latest add <url>/r/app-frame.json
   then `next build` must pass, and a shadcn `Button` and an AuraGlass `Button`
   must resolve the same `--primary`.

   <url> is a local server over apps/docs/public/r — the items scripts/registry/
   build.mjs --certification published for this commit (an uncertified item is
   not there and the spec fails). Two harness rewrites are applied to the served
   JSON, both so the gate exercises THIS commit rather than npm/ui.shadcn.com:
   `aura-glass@^5` → `aura-glass@file:<packed tarball>` (the base item must
   declare exactly `aura-glass@^5`, asserted before rewriting), and a bare
   registryDependency that names an AuraGlass item → `<url>/r/<name>.json`.
   The capture battery moved to tests/dx/registry-render.spec.ts (REQ-PLAT-97).
   Runs only on the remote runner. */
import { test, expect } from '@playwright/test';
import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PACK_MANIFEST = join(ROOT, '.artifacts/e2e/pack-dir.json');
const PUBLIC_R = join(ROOT, 'apps/docs/public/r');
const SHADCN = 'shadcn@latest';

const run = (cmd: string, args: string[], cwd: string, timeout = 600_000) =>
  execFileSync(cmd, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout, env: { ...process.env, CI: '1', NEXT_TELEMETRY_DISABLED: '1' } });

/** Serves <PUBLIC_R>/<name>.json with the two documented harness rewrites. */
function registryServer(tarball: string): Promise<{ server: Server; base: string }> {
  const names = new Set(readdirSync(PUBLIC_R).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)));
  return new Promise((done) => {
    const server = createServer((req, res) => {
      const m = /^\/r\/([a-z0-9-]+)\.json$/.exec((req.url ?? '').split('?')[0] ?? '');
      if (!m || !names.has(m[1]!)) { res.writeHead(404).end(); return; }
      const item = JSON.parse(readFileSync(join(PUBLIC_R, `${m[1]}.json`), 'utf8'));
      const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
      item.dependencies = (item.dependencies ?? []).map((d: string) => (d === 'aura-glass@^5' ? `aura-glass@file:${tarball}` : d));
      item.registryDependencies = (item.registryDependencies ?? []).map((d: string) => (names.has(d) ? `${base}/r/${d}.json` : d));
      res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(item));
    });
    server.listen(0, '127.0.0.1', () => done({ server, base: `http://127.0.0.1:${(server.address() as { port: number }).port}` }));
  });
}

function findFile(dir: string, pred: (src: string) => boolean): string | null {
  for (const e of readdirSync(dir)) {
    if (e === 'node_modules' || e === '.next' || e.startsWith('.git')) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) { const f = findFile(p, pred); if (f) return f; }
    else if (/\.(tsx|ts|jsx)$/.test(e) && pred(readFileSync(p, 'utf8'))) return p;
  }
  return null;
}

const freePort = () => new Promise<number>((r) => { const s = createServer().listen(0, '127.0.0.1', () => { const p = (s.address() as { port: number }).port; s.close(() => r(p)); }); });

test.setTimeout(45 * 60_000);

test('shadcn Base UI app: add auraglass + app-frame with the shadcn CLI, next build, shared --primary', async ({ page }) => {
  expect(process.env.CI, 'remote-only subject: runs in GitLab plat:test:registry (CI)').toBeTruthy();
  const { tarballs } = JSON.parse(readFileSync(PACK_MANIFEST, 'utf8')) as { tarballs: Record<string, string> };
  for (const n of ['auraglass', 'app-frame']) expect(existsSync(join(PUBLIC_R, `${n}.json`)), `${n}.json not published in apps/docs/public/r (uncertified for this sha?)`).toBe(true);
  const baseItem = JSON.parse(readFileSync(join(PUBLIC_R, 'auraglass.json'), 'utf8'));
  expect(baseItem.dependencies, 'registry:base auraglass declares exactly aura-glass@^5 (REQ-PLAT-94)').toEqual(['aura-glass@^5']);

  const work = mkdtempSync(join(tmpdir(), 'ag-shadcn-'));
  const { server, base } = await registryServer(tarballs['aura-glass']!);
  let next: ChildProcess | null = null;
  try {
    run('npx', ['--yes', SHADCN, 'init', '--template', 'next', '--base', 'base', '--name', 'app', '--yes', '--no-monorepo'], work, 900_000);
    const app = join(work, 'app');
    const components = JSON.parse(readFileSync(join(app, 'components.json'), 'utf8'));
    expect(String(components.style), 'a Base UI shadcn app').toMatch(/^base-/);
    run('npx', ['--yes', SHADCN, 'add', 'button', '--yes', '--overwrite'], app);
    run('npx', ['--yes', SHADCN, 'add', `${base}/r/auraglass.json`, '--yes', '--overwrite'], app);
    run('npx', ['--yes', SHADCN, 'add', `${base}/r/app-frame.json`, '--yes', '--overwrite'], app);

    const installed = JSON.parse(readFileSync(join(app, 'node_modules/aura-glass/package.json'), 'utf8'));
    expect(installed.version, 'the packed aura-glass of this commit is installed').toBe(JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8')).version);
    const css = readFileSync(join(app, components.tailwind.css), 'utf8');
    expect(css, 'base item css merged into the app stylesheet').toContain('aura-glass/styles.css');
    const helper = findFile(app, (s) => /export\s*\{\s*cn\s*\}|export (const|function) cn\b/.test(s) && /aura-glass|clsx/.test(s) && !/tailwind-merge/.test(s));
    expect(helper, 'lib/auraglass.ts (cn) written by the base item').not.toBeNull();
    const frame = findFile(app, (s) => /export function AppFrame\b/.test(s));
    expect(frame, 'app-frame block files written by shadcn add').not.toBeNull();

    const uiAlias = String(components.aliases?.ui ?? '@/components/ui');
    mkdirSync(join(app, 'app/interop'), { recursive: true });
    writeFileSync(join(app, 'app/interop/page.tsx'), `import { Button as ShadcnButton } from '${uiAlias}/button';
import { Button as AuraButton } from 'aura-glass';

const probe = { display: 'block', width: 4, height: 4, background: 'var(--primary)' } as const;
export default function Page() {
  return (
    <main>
      <h1>interop</h1>
      <ShadcnButton data-interop="shadcn">shadcn<span data-probe style={probe} /></ShadcnButton>
      <AuraButton data-interop="auraglass">AuraGlass<span data-probe style={probe} /></AuraButton>
    </main>
  );
}
`);
    mkdirSync(join(app, 'app/frame'), { recursive: true });
    const rel = relative(join(app, 'app/frame'), frame!).replace(/\.(tsx|ts|jsx)$/, '');
    writeFileSync(join(app, 'app/frame/page.tsx'), `import { AppFrame } from '${rel.startsWith('.') ? rel : `./${rel}`}';\n\nexport default function Page() {\n  return <AppFrame><h1>frame</h1></AppFrame>;\n}\n`);

    run('npm', ['run', 'build'], app, 1_200_000);

    const port = await freePort();
    next = spawn(process.execPath, [join(app, 'node_modules/next/dist/bin/next'), 'start', '-p', String(port), '-H', '127.0.0.1'], { cwd: app, stdio: ['ignore', 'pipe', 'pipe'] });
    await new Promise<void>((res, rej) => {
      let out = '';
      const t = setTimeout(() => rej(new Error(`next start timeout:\n${out}`)), 90_000);
      const on = (d: Buffer) => { out += d; if (/ready|started server|Local:/i.test(out)) { clearTimeout(t); res(); } };
      next!.stdout?.on('data', on); next!.stderr?.on('data', on);
      next!.on('exit', (c) => { clearTimeout(t); rej(new Error(`next start exited ${c}:\n${out}`)); });
    });

    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    for (const route of ['/interop', '/frame']) {
      const r = await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'networkidle' });
      expect(r?.status(), `${route} status`).toBe(200);
    }
    await page.goto(`http://127.0.0.1:${port}/interop`, { waitUntil: 'networkidle' });
    const primary = await page.evaluate(() => {
      const read = (sel: string) => { const el = document.querySelector(`${sel} [data-probe]`); return el ? getComputedStyle(el).backgroundColor : null; };
      return { shadcn: read('[data-interop="shadcn"]'), auraglass: read('[data-interop="auraglass"]') };
    });
    expect(primary.shadcn, 'shadcn Button resolves --primary to a colour').toMatch(/^(rgb|color|oklch|lab)/);
    expect(primary.shadcn).not.toBe('rgba(0, 0, 0, 0)');
    expect(primary.auraglass, 'shadcn and AuraGlass Buttons resolve the same --primary').toBe(primary.shadcn);
    expect(errors, 'console/page errors').toEqual([]);
  } finally {
    next?.kill();
    server.close();
    rmSync(work, { recursive: true, force: true });
  }
});
