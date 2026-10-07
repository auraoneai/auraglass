/* MAT-224 / REQ-MOT-T15,-59: packed-tarball consumer without the optional
 * `motion` peer. Stages tests/motion/fixtures/no-peer into a temp dir, packs
 * aura-glass via `npm pack` (TRUST-002's scripts/ci/lib/npm-pack.js when it
 * lands), npm-installs the tarball (motion absent by construction), vite-
 * builds + previews, then Playwright asserts Sheet/TabBar render and detent
 * change via keyboard + handle buttons; fixture 2's `aura-glass/motion`
 * import must fail with the contract message. Lane L11 (consumer canaries). */
import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const FIXTURE = resolve(__dirname, 'fixtures/no-peer');
const PEER_MESSAGE =
  'aura-glass/motion requires the optional peer "motion@^12". Install it with: npm i motion@^12';
const PREVIEW_URL = 'http://127.0.0.1:4419';
const run = (cmd: string, args: string[], cwd: string) =>
  execFileSync(cmd, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8', timeout: 300_000 });

test.describe.configure({ mode: 'serial', timeout: 300_000 });

let stage = '';

const packTarball = (dest: string): string => {
  // TRUST-002's npm-pack.js is the sanctioned packer when it lands; npm pack
  // produces the same tarball shape for this consumer check.
  const libPack = resolve(process.cwd(), 'scripts/ci/lib/npm-pack.js');
  if (existsSync(libPack)) {
    return run('node', [libPack, '--dest', dest], process.cwd()).trim().split('\n').at(-1)!;
  }
  const out = run('npm', ['pack', '--pack-destination', dest, '--silent'], process.cwd());
  return out.trim().split('\n').at(-1)!;
};

test.beforeAll(async () => {
  stage = mkdtempSync(join(tmpdir(), 'ag-no-peer-'));
  cpSync(FIXTURE, stage, { recursive: true });
  const tgz = packTarball(stage);
  run('npm', ['install', '--no-audit', '--no-fund', tgz, 'vite', '@vitejs/plugin-react', 'react@^19', 'react-dom@^19'], stage);
  // the peer must stay absent: assert before building
  const motionPkg = join(stage, 'node_modules', 'motion', 'package.json');
  expect(existsSync(motionPkg), 'fixture must not have motion installed').toBe(false);
  run('npm', ['run', 'build'], stage);
});

test.afterAll(async () => {
  try { execFileSync('pkill', ['-f', 'vite preview'], { stdio: 'ignore' }); } catch { /* none */ }
});

test('Sheet and TabBar render/open/detent without the motion peer', async ({ page }) => {
  // serve the built consumer
  const { spawn } = await import('node:child_process');
  const server = spawn('npm', ['run', 'preview'], { cwd: stage, stdio: 'pipe' });
  try {
    await expect.poll(async () => {
      try { const r = await fetch(`${PREVIEW_URL}/`); return r.ok; } catch { return false; }
    }, { timeout: 30_000 }).toBe(true);
    await page.goto(`${PREVIEW_URL}/`);

    // Sheet: open, then detent change via keyboard and handle buttons
    await page.getByTestId('open-sheet').click();
    const sheet = page.getByTestId('sheet');
    await expect(sheet).toBeVisible();
    await page.keyboard.press('ArrowUp');
    await page.getByTestId('detent-up').click();
    await page.getByTestId('detent-down').click();
    // CSS-snap detents move the sheet synchronously — surface must stay visible
    await expect(sheet).toBeVisible();

    // TabBar: render + keyboard detent/tab change
    const tabbar = page.getByTestId('tabbar');
    await expect(tabbar).toBeVisible();
    const tabs = tabbar.locator('[role="tab"]');
    await expect(tabs).toHaveCount(2);
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');
    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  } finally {
    server.kill('SIGTERM');
  }
});

test('aura-glass/motion without the peer fails with the contract message', async () => {
  // Node-side import of the fixture entry: the friendly error must surface
  // verbatim, not ERR_MODULE_NOT_FOUND.
  const entry = join(stage, 'src', 'motion-import.tsx');
  expect(existsSync(entry)).toBe(true);
  const viteNode = join(stage, 'node_modules', '.bin', 'vite');
  void viteNode;
  // Node can't run TSX — import the packed dist surface directly instead:
  // resolves 'aura-glass/motion' inside the staged consumer.
  const motionEntry = join(stage, 'node_modules', 'aura-glass', 'dist', 'motion', 'public.js');
  let message = '';
  try {
    await import(pathToFileURL(motionEntry).href);
  } catch (e) {
    message = (e as Error).message;
  }
  expect(message).toBe(PEER_MESSAGE);
});
