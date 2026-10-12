/** @jest-environment node */
/* REQ-QUAL-11 / REQ-QUAL-05: the shared lane fixture's browser hooks, driven with a fake Browser —
   contexts opened through browser.newContext() get the determinism init script, and each worker records
   { name, version } under $AG_LANE_EVIDENCE_DIR/browser-versions/ for the lane manifest. */
import { describe, expect, it } from '@jest/globals';
import { mkdtempSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Browser } from '@playwright/test';
import { BROWSER_VERSIONS_DIR, deterministicBrowser, recordBrowserVersion } from '../../certification/lanes/_fixtures/determinism';
import { DEFAULT_SEED, FIXED_EPOCH_MS, determinismInit } from '../../certification/lanes/_fixtures/determinism-init';

function fakeBrowser(name = 'webkit', version = '26.0') {
  const scripts: Array<{ fn: unknown; arg: unknown }> = [];
  const contexts: unknown[] = [];
  const browser = {
    newContext: async (opts?: unknown) => {
      const ctx = { opts, addInitScript: async (fn: unknown, arg: unknown) => { scripts.push({ fn, arg }); } };
      contexts.push(ctx);
      return ctx;
    },
    browserType: () => ({ name: () => name }),
    version: () => version,
  };
  return { browser: browser as unknown as Browser, scripts, contexts };
}

describe('lane fixture browser hooks', () => {
  it('every browser.newContext() context starts with the determinism init script', async () => {
    const { browser, scripts, contexts } = fakeBrowser();
    const patched = deterministicBrowser(browser);
    const ctx = await patched.newContext({ reducedMotion: 'reduce' });
    expect(contexts).toEqual([ctx]);
    expect((ctx as unknown as { opts: unknown }).opts).toEqual({ reducedMotion: 'reduce' });
    expect(scripts).toEqual([{ fn: determinismInit, arg: { epochMs: FIXED_EPOCH_MS, seed: DEFAULT_SEED } }]);
    await patched.newContext();
    expect(scripts).toHaveLength(2);
  });

  it('records the worker browser name and version under AG_LANE_EVIDENCE_DIR', () => {
    const dir = mkdtempSync(join(tmpdir(), 'ag-lane-fixture-'));
    try {
      const { browser } = fakeBrowser('firefox', '142.0.1');
      const file = recordBrowserVersion(browser, 3, { AG_LANE_EVIDENCE_DIR: dir });
      expect(file).not.toBeNull();
      const files = readdirSync(join(dir, BROWSER_VERSIONS_DIR));
      expect(files).toEqual([`firefox-${process.pid}-3.json`]);
      expect(JSON.parse(readFileSync(file!, 'utf8'))).toEqual({ name: 'firefox', version: '142.0.1' });
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('records nothing outside a lane run', () => {
    expect(recordBrowserVersion(fakeBrowser().browser, 0, {})).toBeNull();
  });
});
