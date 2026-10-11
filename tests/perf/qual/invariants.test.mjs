/** @jest-environment jsdom */
/* tests/perf/qual/invariants.test.mjs — local unit checks of the REQ-QUAL-42/-43 instrument and evaluators (QUAL, G-22).
   The browser specs themselves run only remotely (qual:certify:l10); this file runs in the l10 jest step and locally. */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from '@jest/globals';
import { agInstrument } from './instrument.js';
import {
  BLANK_ID, FIXTURE, LIMITS, AgPendingProducer, backdropRootViolations, candidateEntries, cellsByScene, fallbackViolations, leakViolations,
  lensViolations, liveContexts, pendingOrFail, previewUrl, scenesOf, webglViolations,
} from './invariants.mjs';

const SCENES = ['photo', 'saturated-abstract', 'dense-text', 'dark-media', 'flat-white', 'flat-black', 'hf-pattern', 'video-frame'];

/* jsdom has no ResizeObserver/IntersectionObserver and no WebGL: minimal stand-ins installed BEFORE the instrument, so
   its constructor and getContext wrappers wrap them exactly as they wrap the browser's. */
class FakeObserver {
  constructor(cb) { this.cb = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
}
function fakeGl(canvas) {
  const ctx = { canvas, lost: false, isContextLost: () => ctx.lost,
    getExtension: (name) => (name === 'WEBGL_lose_context' ? { loseContext: () => { ctx.lost = true; } } : null) };
  return ctx;
}

let I;
beforeAll(() => {
  window.ResizeObserver = class ResizeObserver extends FakeObserver {};
  window.IntersectionObserver = class IntersectionObserver extends FakeObserver {};
  const contexts = new WeakMap();
  window.HTMLCanvasElement.prototype.getContext = function getContext(type) {
    if (!/^webgl/.test(type)) return null;
    if (!contexts.has(this)) contexts.set(this, fakeGl(this));
    return contexts.get(this);
  };
  agInstrument();
  I = window.__agInstrument;
});

describe('instrument.js (page side, under jsdom)', () => {
  it('is idempotent', () => {
    agInstrument();
    expect(window.__agInstrument).toBe(I);
  });

  it('tracks window/document listeners, deduplicated like the DOM (type + callback + capture)', () => {
    const base = I.snapshot().listeners;
    const f = () => undefined;
    window.addEventListener('resize', f);
    window.addEventListener('resize', f);                 // duplicate: ignored by the DOM, ignored here
    window.addEventListener('resize', f, true);           // different capture: a second registration
    document.addEventListener('keydown', f, { passive: true });
    let s = I.snapshot().listeners;
    expect(s.window.resize - (base.window.resize ?? 0)).toBe(2);
    expect(s.document.keydown - (base.document.keydown ?? 0)).toBe(1);
    window.removeEventListener('resize', f);
    window.removeEventListener('resize', f, { capture: true });
    document.removeEventListener('keydown', f);
    s = I.snapshot().listeners;
    expect(s.window.resize ?? 0).toBe(base.window.resize ?? 0);
    expect(s.document.keydown ?? 0).toBe(base.document.keydown ?? 0);
  });

  it('counts an unqualified global addEventListener call (no receiver) against window', () => {
    const before = I.snapshot().listeners.window.focus ?? 0;
    const f = () => undefined;
    const add = window.addEventListener;
    add('focus', f);
    expect(I.snapshot().listeners.window.focus).toBe(before + 1);
    window.removeEventListener('focus', f);
    expect(I.snapshot().listeners.window.focus ?? 0).toBe(before);
  });

  it('drops `once` listeners when they fire and `signal` listeners when aborted', () => {
    const before = I.snapshot().listeners.window;
    window.addEventListener('ag-once', () => undefined, { once: true });
    const ctl = new AbortController();
    window.addEventListener('ag-signal', () => undefined, { signal: ctl.signal });
    expect(I.snapshot().listeners.window['ag-once']).toBe(1);
    expect(I.snapshot().listeners.window['ag-signal']).toBe(1);
    window.dispatchEvent(new Event('ag-once'));
    ctl.abort();
    const after = I.snapshot().listeners.window;
    expect(after['ag-once'] ?? 0).toBe(before['ag-once'] ?? 0);
    expect(after['ag-signal'] ?? 0).toBe(before['ag-signal'] ?? 0);
  });

  it('tracks pending rAF callbacks and intervals until cancelled/cleared (clearTimeout clears intervals too)', () => {
    const base = I.snapshot();
    const r = requestAnimationFrame(() => undefined);
    const a = setInterval(() => undefined, 1000);
    const b = setInterval(() => undefined, 1000);
    let s = I.snapshot();
    expect(s.pendingRaf).toBe(base.pendingRaf + 1);
    expect(s.rafRequests).toBe(base.rafRequests + 1);
    expect(s.intervals).toBe(base.intervals + 2);
    cancelAnimationFrame(r);
    clearInterval(a);
    clearTimeout(b);
    s = I.snapshot();
    expect(s.pendingRaf).toBe(base.pendingRaf);
    expect(s.intervals).toBe(base.intervals);
  });

  it('counts observers only while they observe a target and are not disconnected', () => {
    const base = I.snapshot().observers;
    const mo = new MutationObserver(() => undefined);
    const ro = new ResizeObserver(() => undefined);
    const io = new IntersectionObserver(() => undefined);
    expect(I.snapshot().observers).toEqual(base);       // constructed, observing nothing
    mo.observe(document.body, { childList: true });
    ro.observe(document.body);
    io.observe(document.body);
    expect(I.snapshot().observers).toEqual({
      MutationObserver: base.MutationObserver + 1, ResizeObserver: base.ResizeObserver + 1, IntersectionObserver: base.IntersectionObserver + 1,
    });
    expect(ro).toBeInstanceOf(FakeObserver);
    expect(ro.constructor.name).toBe('ResizeObserver');
    ro.unobserve(document.body);
    mo.disconnect();
    io.disconnect();
    expect(I.snapshot().observers).toEqual(base);
  });

  it('records WebGL contexts created by getContext and reports lost/connected state', () => {
    const since = performance.now();
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 270;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('webgl2');
    expect(canvas.getContext('webgl2')).toBe(ctx);          // same context again: recorded once
    expect(canvas.getContext('2d')).toBeNull();              // not WebGL: not recorded
    let s = I.snapshot(since);
    expect(s.webgl).toEqual([{ type: 'webgl2', offscreen: false, lost: false, connected: true, backing: { width: 480, height: 270 }, css: { width: 0, height: 0 } }]);
    expect(liveContexts(s)).toHaveLength(1);
    ctx.getExtension('WEBGL_lose_context').loseContext();
    canvas.remove();
    s = I.snapshot(since);
    expect(s.webgl).toEqual([expect.objectContaining({ lost: true, connected: false })]);
    expect(liveContexts(s)).toHaveLength(0);
    expect(I.snapshot(performance.now() + 1).webgl).toEqual([]);   // created before `since`: excluded
  });
});

describe('evaluators', () => {
  const snap = (over = {}) => ({ listeners: { window: {}, document: {} }, pendingRaf: 0, rafRequests: 0, intervals: 0,
    observers: { MutationObserver: 0, ResizeObserver: 0, IntersectionObserver: 0 }, webgl: [], ...over });

  it('leakViolations: clean state passes; every kind of leftover is reported', () => {
    const before = { snapshot: snap({ listeners: { window: { resize: 1 }, document: {} } }), quietRaf: 0, heapBytes: 10_000_000 };
    expect(leakViolations(before, { ...before, heapBytes: 10_000_000 + LIMITS.heapDeltaBytes })).toEqual([]);
    const after = {
      snapshot: snap({ listeners: { window: { resize: 11 }, document: { pointermove: 10 } }, pendingRaf: 10, intervals: 10,
        observers: { MutationObserver: 0, ResizeObserver: 10, IntersectionObserver: 0 } }),
      quietRaf: 300, heapBytes: 10_000_000 + LIMITS.heapDeltaBytes + 1,
    };
    const v = leakViolations(before, after);
    expect(v.map((x) => x.code)).toEqual(['listener-leak', 'listener-leak', 'raf-pending', 'raf-loop', 'interval-leak', 'observer-leak', 'heap-growth']);
    expect(v[0].detail).toBe("window 'resize' listeners 1 → 11 (+10)");
    expect(v[1].detail).toBe("document 'pointermove' listeners 0 → 10 (+10)");
  });

  it('leakViolations: an unmeasured heap is a violation, never a pass', () => {
    const s = { snapshot: snap(), quietRaf: 0, heapBytes: null };
    expect(leakViolations(s, s).map((x) => x.code)).toEqual(['heap-unmeasured']);
  });

  it('backdropRootViolations: one violation per backdrop-root property; will-change allowed only with [data-ag-animating]', () => {
    const ok = { desc: 'a', backdropFilter: 'none', filter: 'none', opacity: '1', mixBlendMode: 'normal', willChange: 'auto', animating: false };
    expect(backdropRootViolations([ok, { ...ok, willChange: 'opacity, transform', animating: true }])).toEqual([]);
    const bad = [
      { ...ok, backdropFilter: 'blur(2px)' }, { ...ok, filter: 'saturate(1.2)' }, { ...ok, opacity: '0.9' },
      { ...ok, mixBlendMode: 'multiply' }, { ...ok, willChange: 'transform' },
    ];
    expect(backdropRootViolations(bad).map((x) => x.code)).toEqual(['backdrop-filter', 'filter', 'opacity', 'mix-blend-mode', 'will-change']);
  });

  it('lensViolations: duplicates everywhere, missing defs when expected, url() backdrops only off Chromium', () => {
    const url = [{ desc: 'div::before', property: 'backdrop-filter', value: 'url("#ag-lens-fixed-control") blur(4px)' }];
    expect(lensViolations({ defs: 1, urlBackdrops: url }, 'chromium', { expectDefs: true })).toEqual([]);
    expect(lensViolations({ defs: 1, urlBackdrops: [] }, 'firefox', { expectDefs: true })).toEqual([]);
    expect(lensViolations({ defs: 0, urlBackdrops: [] }, 'webkit')).toEqual([]);
    expect(lensViolations({ defs: 0, urlBackdrops: [] }, 'webkit', { expectDefs: true }).map((x) => x.code)).toEqual(['lens-defs-missing']);
    expect(lensViolations({ defs: 2, urlBackdrops: url }, 'chromium').map((x) => x.code)).toEqual(['lens-defs-duplicate']);
    expect(lensViolations({ defs: 2, urlBackdrops: url }, 'webkit').map((x) => x.code)).toEqual(['lens-defs-duplicate', 'lens-url-backdrop']);
  });

  it('webglViolations: budget, DPR cap (rounded up), hidden/offscreen rAF, release on unmount', () => {
    const gl = (over = {}) => ({ type: 'webgl2', offscreen: false, lost: false, connected: true, backing: { width: 480, height: 270 }, css: { width: 320, height: 180 }, ...over });
    const clean = { mounted: snap({ webgl: [gl()] }), hiddenRaf: 0, offscreenRaf: 0, unmounted: snap({ webgl: [gl({ lost: true, connected: false })] }) };
    expect(webglViolations(clean)).toEqual([]);
    expect(liveContexts(clean.mounted)).toHaveLength(1);
    expect(webglViolations({ ...clean, mounted: snap({ webgl: [gl(), gl(), gl({ lost: true })] }) }).map((x) => x.code)).toEqual(['webgl-context-budget']);
    expect(webglViolations({ ...clean, mounted: snap({ webgl: [gl({ backing: { width: 640, height: 360 } })] }) }).map((x) => x.code)).toEqual(['webgl-dpr']);
    expect(webglViolations({ ...clean, mounted: snap({ webgl: [gl({ backing: { width: 481, height: 270 }, css: { width: 320.4, height: 180 } })] }) })).toEqual([]);
    expect(webglViolations({ ...clean, hiddenRaf: 30, offscreenRaf: 29 }).map((x) => x.code)).toEqual(['webgl-raf-hidden', 'webgl-raf-offscreen']);
    expect(webglViolations({ ...clean, unmounted: snap({ webgl: [gl({ connected: false })] }) }).map((x) => x.code)).toEqual(['webgl-unreleased']);
    expect(webglViolations({ ...clean, hiddenRaf: null }).map((x) => x.code)).toEqual(['webgl-raf-unmeasured']);
    expect(webglViolations({ mounted: snap(), hiddenRaf: null, offscreenRaf: null, unmounted: null })).toEqual([]);
  });

  it('fallbackViolations: every blurred element is a violation of the condition', () => {
    expect(fallbackViolations([], 'forced-colors')).toEqual([]);
    expect(fallbackViolations([{ desc: 'div[data-fixture=bespoke-blur]', pseudo: null, property: 'backdrop-filter', value: 'blur(12px)' }], 'tier-lightweight'))
      .toEqual([{ code: 'backdrop-filter-under-fallback', detail: 'tier-lightweight: div[data-fixture=bespoke-blur] backdrop-filter: blur(12px)' }]);
  });
});

describe('subject cells', () => {
  it('scenesOf: explicit list, "all", flagship default all, otherwise the preview default', () => {
    expect(scenesOf({ scenes: ['flat-white', 'nope'] }, [], SCENES)).toEqual(['flat-white']);
    expect(scenesOf({ scenes: 'all' }, [], SCENES)).toEqual(SCENES);
    expect(scenesOf({}, ['flagship'], SCENES)).toEqual(SCENES);
    expect(scenesOf({}, ['core'], SCENES)).toEqual(['photo']);
  });

  it('cellsByScene groups story ids per scene in id order', () => {
    const m = cellsByScene([{ id: 'b', scenes: ['photo', 'flat-black'] }, { id: 'a', scenes: ['photo'] }], SCENES);
    expect(m.get('photo')).toEqual(['a', 'b']);
    expect(m.get('flat-black')).toEqual(['b']);
    expect(m.get('dense-text')).toEqual([]);
  });

  it('candidateEntries excludes docs, no-cert stories and QUAL fixtures', () => {
    const index = { entries: {
      'x--a': { id: 'x--a', type: 'story', tags: ['flagship'], importPath: './stories/cmp/X.stories.tsx' },
      'x--docs': { id: 'x--docs', type: 'docs', tags: [], importPath: './stories/cmp/X.mdx' },
      'f--n': { id: 'f--n', type: 'story', tags: ['no-cert'], importPath: './stories/cmp/F.stories.tsx' },
      'q--p': { id: 'q--p', type: 'story', tags: [], importPath: './stories/qual/fixtures/perf/Leak.stories.tsx' },
    } };
    expect(candidateEntries(index).map((e) => e.id)).toEqual(['x--a']);
  });

  it('previewUrl encodes globals and cert mode', () => {
    expect(previewUrl('http://h', 'a--b', { scene: 'photo', tier: 'lightweight', transparency: undefined }))
      .toBe('http://h/iframe.html?id=a--b&viewMode=story&globals=scene%3Aphoto%3Btier%3Alightweight&ag-cert=1');
  });
});

describe('fixture stories', () => {
  it('every FIXTURE id is a no-cert story of stories/qual/fixtures/perf in the Storybook index', () => {
    /* storybook-static/index.json when AG_STORYBOOK_STATIC is set (qual:certify:l10), else Storybook's own indexer over
       .storybook/main.ts in a child node (it registers test hooks when loaded inside jest). */
    let index;
    if (process.env.AG_STORYBOOK_STATIC) {
      index = JSON.parse(readFileSync(join(process.env.AG_STORYBOOK_STATIC, 'index.json'), 'utf8'));
    } else {
      const script = `require(${JSON.stringify(createRequire(join(process.cwd(), 'package.json')).resolve('storybook/internal/core-server'))})
        .buildIndex({ configDir: ${JSON.stringify(join(process.cwd(), '.storybook'))} })
        .then((i) => process.stdout.write(JSON.stringify(i)), (e) => { console.error(e); process.exit(1); });`;
      const r = spawnSync(process.execPath, ['-e', script], { cwd: process.cwd(), encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
      if (r.status !== 0) throw new Error(`Storybook buildIndex failed (exit ${r.status}):\n${r.stderr}`);
      index = JSON.parse(r.stdout);
    }
    const ids = Object.values(FIXTURE).flatMap((group) => Object.values(group));
    for (const id of ids) {
      const e = index.entries[id];
      expect({ id, type: e?.type, noCert: e?.tags?.includes('no-cert'), dir: e?.importPath?.startsWith('./stories/qual/fixtures/perf/') })
        .toEqual({ id, type: 'story', noCert: true, dir: true });
    }
    expect(index.entries[BLANK_ID]?.type).toBe('story');
  }, 120_000);
});

describe('pending and remote-only', () => {
  it('pendingOrFail throws a `pending:` AgPendingProducer before release and a plain failure at release', () => {
    expect(() => pendingOrFail('x missing', 'FIN-D', 'pr')).toThrow(AgPendingProducer);
    expect(() => pendingOrFail('x missing', 'FIN-D', 'pr')).toThrow(/^pending: x missing \(producer: FIN-D\)$/);
    let err;
    try { pendingOrFail('x missing', 'FIN-D', 'release'); } catch (e) { err = e; }
    expect(err).not.toBeInstanceOf(AgPendingProducer);
    expect(err.message).toBe('release scope: x missing (producer: FIN-D)');
  });

  it('every invariant spec refuses to run without AG_REMOTE_RUNNER=1 (playwright test --list)', () => {
    const env = { ...process.env };
    delete env.AG_REMOTE_RUNNER;
    const cli = join(process.cwd(), 'node_modules/@playwright/test/cli.js');
    const r = spawnSync(process.execPath, [cli, 'test', '-c', 'tests/perf/qual/playwright.config.ts', '--list',
      '--project', 'qual:l10-invariants-chromium'], { env, encoding: 'utf8', cwd: process.cwd() });
    expect(r.status).not.toBe(0);
    const out = `${r.stdout}\n${r.stderr}`;
    for (const spec of ['mount-unmount-leak', 'backdrop-root', 'lens-defs', 'webgl-context', 'a11y-fallback']) {
      expect(out).toContain(`${spec}.spec.ts`);
    }
    expect(out).toContain('remote-only: the L10 invariant specs');
  }, 120_000);
});
