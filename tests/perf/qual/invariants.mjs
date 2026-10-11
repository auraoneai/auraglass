/* tests/perf/qual/invariants.mjs — REQ-QUAL-42/-43 shared logic for the L10 invariant specs (QUAL; FIN-446).
     evaluators   pure functions from probe data to violations ({ code, detail }); unit-tested in invariants.test.mjs
     page probes  self-contained functions passed to page.evaluate (no closure over module scope)
     driver       Storybook preview navigation (one page load per globals set, then story switches through the preview
                  API, the same path run-perf.mjs's mount cycle uses), subject-cell discovery, evidence output
   Specs: mount-unmount-leak, backdrop-root, lens-defs, webgl-context, a11y-fallback (tests/perf/qual/*.spec.ts),
   all in qual:certify:l10 through tests/perf/qual/playwright.config.ts. */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const REMOTE_ONLY_MESSAGE = 'remote-only: the L10 invariant specs (tests/perf/qual/{mount-unmount-leak,backdrop-root,lens-defs,'
  + 'webgl-context,a11y-fallback}.spec.ts) run only on the remote runner (AG_REMOTE_RUNNER=1). Run them in GitLab CI: qual:certify:l10.';

export const STORYBOOK_URL = process.env.AG_STORYBOOK_URL ?? 'http://127.0.0.1:6006';
/** The empty Lab page (G-20 perf fixture): the "unmounted" state of every mount cycle. */
export const BLANK_ID = 'perf-harness-blank--default';

/** REQ-QUAL-42 / -43 limits (QUAL PRD §16). */
export const LIMITS = {
  cycles: 10,
  heapDeltaBytes: 1024 * 1024,
  webglContexts: 1,
  webglDpr: 1.5,
  quietMs: 500,
  reactMs: 200,
};

/** QUAL fixture story ids (stories/qual/fixtures/perf/**, tagged no-cert: never certification subjects). */
export const FIXTURE = {
  leak: {
    windowListener: 'qual-fixtures-perf-leak--window-listener',
    documentListener: 'qual-fixtures-perf-leak--document-listener',
    rafLoop: 'qual-fixtures-perf-leak--raf-loop',
    interval: 'qual-fixtures-perf-leak--interval',
    observer: 'qual-fixtures-perf-leak--observer',
    clean: 'qual-fixtures-perf-leak--clean',
  },
  backdropRoot: {
    hosts: 'qual-fixtures-perf-backdrop-root--hosts',
    clean: 'qual-fixtures-perf-backdrop-root--clean',
  },
  lens: {
    enhanced10: 'qual-fixtures-perf-lens-defs--enhanced-10',
    duplicate: 'qual-fixtures-perf-lens-defs--duplicate',
  },
  webgl: {
    clean: 'qual-fixtures-perf-webgl--clean',
    threeContexts: 'qual-fixtures-perf-webgl--three-contexts',
    unreleased: 'qual-fixtures-perf-webgl--unreleased',
    ungatedLoop: 'qual-fixtures-perf-webgl--ungated-loop',
    fullDpr: 'qual-fixtures-perf-webgl--full-dpr',
  },
  fallback: {
    surfaces: 'qual-fixtures-perf-a11y-fallback--surfaces',
    bespokeBlur: 'qual-fixtures-perf-a11y-fallback--bespoke-blur',
  },
};

/* ------------------------------------------------------------------ pending (PRD-F §4.3 rule 2) ------------------------------------------------------------------ */

export const LANE_SCOPE = process.env.AG_SCOPE ?? 'pr';

/** A producer that has not landed. The QUAL lane runner (G-03) classifies a run whose every failure starts with
    `pending:` as pending; at release scope the same condition is a plain failure (REQ-QUAL-06). */
export class AgPendingProducer extends Error {
  constructor(message) { super(message); this.name = 'AgPendingProducer'; }
}
export function pendingOrFail(reason, producer, scope = LANE_SCOPE) {
  if (scope === 'release') throw new Error(`release scope: ${reason} (producer: ${producer})`);
  throw new AgPendingProducer(`pending: ${reason} (producer: ${producer})`);
}

/* ------------------------------------------------------------------ evaluators ------------------------------------------------------------------ */

const v = (code, detail) => ({ code, detail });

/** REQ-QUAL-42: state after N mount/unmount cycles vs the pre-mount state (both on the unmounted page, after GC). */
export function leakViolations(before, after) {
  const out = [];
  for (const target of ['window', 'document']) {
    const b = before.snapshot.listeners[target] ?? {};
    const a = after.snapshot.listeners[target] ?? {};
    for (const type of Object.keys(a).sort()) {
      const d = a[type] - (b[type] ?? 0);
      if (d > 0) out.push(v('listener-leak', `${target} '${type}' listeners ${b[type] ?? 0} → ${a[type]} (+${d})`));
    }
  }
  if (after.snapshot.pendingRaf > before.snapshot.pendingRaf) {
    out.push(v('raf-pending', `pending requestAnimationFrame callbacks ${before.snapshot.pendingRaf} → ${after.snapshot.pendingRaf}`));
  }
  if (after.quietRaf > before.quietRaf) {
    out.push(v('raf-loop', `requestAnimationFrame requests in a ${LIMITS.quietMs} ms quiet window ${before.quietRaf} → ${after.quietRaf}`));
  }
  if (after.snapshot.intervals > before.snapshot.intervals) {
    out.push(v('interval-leak', `live setInterval timers ${before.snapshot.intervals} → ${after.snapshot.intervals}`));
  }
  for (const kind of Object.keys(after.snapshot.observers).sort()) {
    const b = before.snapshot.observers[kind] ?? 0;
    const a = after.snapshot.observers[kind];
    if (a > b) out.push(v('observer-leak', `live ${kind} ${b} → ${a}`));
  }
  if (before.heapBytes == null || after.heapBytes == null) {
    out.push(v('heap-unmeasured', 'heap usage was not measured (Chromium CDP Runtime.getHeapUsage after forced GC)'));
  } else if (after.heapBytes - before.heapBytes > LIMITS.heapDeltaBytes) {
    out.push(v('heap-growth', `JS heap after GC ${before.heapBytes} → ${after.heapBytes} bytes (+${after.heapBytes - before.heapBytes} > ${LIMITS.heapDeltaBytes})`));
  }
  return out;
}

/** REQ-QUAL-43 (1): no `.ag-surface` host is a backdrop root. `hosts` from probeSurfaceHosts. */
export function backdropRootViolations(hosts) {
  const out = [];
  for (const h of hosts) {
    if (h.backdropFilter !== 'none') out.push(v('backdrop-filter', `${h.desc} backdrop-filter: ${h.backdropFilter}`));
    if (h.filter !== 'none') out.push(v('filter', `${h.desc} filter: ${h.filter}`));
    if (Number(h.opacity) !== 1) out.push(v('opacity', `${h.desc} opacity: ${h.opacity}`));
    if (h.mixBlendMode !== 'normal') out.push(v('mix-blend-mode', `${h.desc} mix-blend-mode: ${h.mixBlendMode}`));
    if (h.willChange !== 'auto' && !h.animating) out.push(v('will-change', `${h.desc} will-change: ${h.willChange} without [data-ag-animating]`));
  }
  return out;
}

/** REQ-QUAL-43 (2): ≤1 lens defs per document (exactly 1 where `expectDefs`), 0 applied url() backdrops off Chromium. */
export function lensViolations(probe, engine, { expectDefs = false } = {}) {
  const out = [];
  if (probe.defs > 1) out.push(v('lens-defs-duplicate', `${probe.defs} svg[data-ag-lens-defs] in the document (exactly one allowed)`));
  else if (expectDefs && probe.defs !== 1) out.push(v('lens-defs-missing', `${probe.defs} svg[data-ag-lens-defs] with enhanced surfaces mounted (exactly one required)`));
  if (engine !== 'chromium') for (const u of probe.urlBackdrops) out.push(v('lens-url-backdrop', `${engine}: ${u.desc} ${u.property}: ${u.value}`));
  return out;
}

/** WebGL contexts that are live: attached canvas (or an OffscreenCanvas) and not lost. */
export const liveContexts = (snapshot) => snapshot.webgl.filter((g) => !g.lost && (g.connected || g.offscreen));

/** REQ-QUAL-43 (3): context budget, DPR cap, render loop stopped while hidden / offscreen, released on unmount. */
export function webglViolations({ mounted, hiddenRaf, offscreenRaf, unmounted }) {
  const out = [];
  const live = liveContexts(mounted);
  if (live.length > LIMITS.webglContexts) out.push(v('webgl-context-budget', `${live.length} live WebGL contexts (≤${LIMITS.webglContexts})`));
  for (const g of live) {
    if (!g.backing || !g.css || g.css.width <= 0 || g.css.height <= 0) continue;
    const allowedW = Math.ceil(g.css.width * LIMITS.webglDpr);
    const allowedH = Math.ceil(g.css.height * LIMITS.webglDpr);
    if (g.backing.width > allowedW || g.backing.height > allowedH) {
      const dpr = Math.max(g.backing.width / g.css.width, g.backing.height / g.css.height);
      out.push(v('webgl-dpr', `${g.type} canvas ${g.backing.width}×${g.backing.height} for ${g.css.width}×${g.css.height} CSS px (DPR ${dpr.toFixed(2)} > ${LIMITS.webglDpr})`));
    }
  }
  if (live.length > 0) {
    if (hiddenRaf == null || offscreenRaf == null) out.push(v('webgl-raf-unmeasured', 'hidden/offscreen rAF windows were not measured'));
    if (hiddenRaf > 0) out.push(v('webgl-raf-hidden', `${hiddenRaf} requestAnimationFrame requests in ${LIMITS.quietMs} ms with document.visibilityState 'hidden'`));
    if (offscreenRaf > 0) out.push(v('webgl-raf-offscreen', `${offscreenRaf} requestAnimationFrame requests in ${LIMITS.quietMs} ms with every canvas offscreen`));
  }
  if (unmounted) {
    const kept = unmounted.webgl.filter((g) => !g.lost);
    if (kept.length) out.push(v('webgl-unreleased', `${kept.length} WebGL context(s) not lost after unmount (WEBGL_lose_context)`));
  }
  return out;
}

/** REQ-QUAL-43 (4): under a fallback condition no element (or ::before/::after) has backdrop-filter ≠ none. */
export function fallbackViolations(blurred, condition) {
  return blurred.map((b) => v('backdrop-filter-under-fallback', `${condition}: ${b.desc}${b.pseudo ?? ''} ${b.property}: ${b.value}`));
}

/** Scenes of one subject story: parameters.ag.scenes, 'all' → every scene; unset → every scene for flagships (S-41),
    the preview default scene otherwise. */
export function scenesOf(ag, tags, allScenes, defaultScene = 'photo') {
  if (ag?.scenes === 'all') return [...allScenes];
  if (Array.isArray(ag?.scenes) && ag.scenes.length) return ag.scenes.filter((s) => allScenes.includes(s));
  return tags.includes('flagship') ? [...allScenes] : [defaultScene];
}

/** Groups cells by scene, keeping each scene's stories in id order. */
export function cellsByScene(stories, allScenes) {
  const out = new Map(allScenes.map((s) => [s, []]));
  for (const s of [...stories].sort((a, b) => a.id.localeCompare(b.id))) for (const sc of s.scenes) out.get(sc)?.push(s.id);
  return out;
}

/** Index entries that are candidate subjects: stories, not `no-cert`, not QUAL fixtures. */
export function candidateEntries(index) {
  return Object.values(index.entries ?? {})
    .filter((e) => e.type === 'story' && !(e.tags ?? []).includes('no-cert') && !String(e.importPath ?? '').startsWith('./stories/qual/'))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/* ------------------------------------------------------------------ page probes (self-contained) ------------------------------------------------------------------ */

/** Waits (≤2 s) for finite animations/transitions to finish so computed values are settled. */
export async function settleAnimations() {
  const finite = document.getAnimations().filter((a) => {
    const t = a.effect && a.effect.getComputedTiming ? a.effect.getComputedTiming() : null;
    return a.playState === 'running' && t && Number.isFinite(t.endTime);
  });
  await Promise.race([Promise.all(finite.map((a) => a.finished.catch(() => null))), new Promise((r) => setTimeout(r, 2000))]);
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
}

export function probeSurfaceHosts() {
  const desc = (el) => {
    const parts = [el.tagName.toLowerCase()];
    for (const a of ['data-ag-part', 'data-ag-layer', 'data-ag-fixture']) if (el.hasAttribute(a)) parts.push(`[${a}=${el.getAttribute(a)}]`);
    return `.ag-surface ${parts.join('')}`;
  };
  return [...document.querySelectorAll('.ag-surface')].map((el) => {
    const cs = getComputedStyle(el);
    const bf = cs.backdropFilter || cs.webkitBackdropFilter || 'none';
    const wbf = cs.webkitBackdropFilter || 'none';
    return {
      desc: desc(el),
      backdropFilter: bf !== 'none' ? bf : wbf,
      filter: cs.filter || 'none',
      opacity: cs.opacity,
      mixBlendMode: cs.mixBlendMode || 'normal',
      willChange: cs.willChange || 'auto',
      animating: el.hasAttribute('data-ag-animating'),
    };
  });
}

/** Every element / ::before / ::after with a computed backdrop-filter (either spelling) other than none. */
export function probeBlurred() {
  const out = [];
  const desc = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += `#${el.id}`;
    if (el.classList && el.classList.length) s += `.${[...el.classList].slice(0, 3).join('.')}`;
    for (const a of ['data-ag-part', 'data-ag-fixture']) if (el.hasAttribute(a)) s += `[${a}=${el.getAttribute(a)}]`;
    return s;
  };
  for (const el of document.querySelectorAll('*')) {
    for (const pseudo of [null, '::before', '::after']) {
      const cs = getComputedStyle(el, pseudo);
      if (pseudo && (cs.content === 'none' || cs.content === 'normal')) continue;
      for (const property of ['backdrop-filter', '-webkit-backdrop-filter']) {
        const value = cs.getPropertyValue(property);
        if (value && value !== 'none') { out.push({ desc: desc(el), pseudo, property, value }); break; }
      }
    }
  }
  return out;
}

export function probeLens() {
  const urlBackdrops = [];
  for (const el of document.querySelectorAll('*')) {
    for (const pseudo of [null, '::before', '::after']) {
      const cs = getComputedStyle(el, pseudo);
      if (pseudo && (cs.content === 'none' || cs.content === 'normal')) continue;
      for (const property of ['backdrop-filter', '-webkit-backdrop-filter']) {
        const value = cs.getPropertyValue(property);
        if (value && /url\(/.test(value)) {
          urlBackdrops.push({ desc: `${el.tagName.toLowerCase()}${el.getAttribute('data-ag-fixture') ? `[data-ag-fixture=${el.getAttribute('data-ag-fixture')}]` : ''}${pseudo ?? ''}`, property, value });
          break;
        }
      }
    }
  }
  return { defs: document.querySelectorAll('svg[data-ag-lens-defs]').length, urlBackdrops,
    refractionSurfaces: document.querySelectorAll('.ag-surface[data-ag-refraction]').length };
}

/* ------------------------------------------------------------------ Storybook driver ------------------------------------------------------------------ */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function previewUrl(base, storyId, globals = {}) {
  const g = Object.entries(globals).filter(([, val]) => val != null).map(([k, val]) => `${k}:${val}`).join(';');
  return `${base}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story${g ? `&globals=${encodeURIComponent(g)}` : ''}&ag-cert=1`;
}

async function waitRender(page, storyId) {
  return page.evaluate(async (id) => {
    const t0 = performance.now();
    for (;;) {
      const r = window.__STORYBOOK_PREVIEW__?.currentRender;
      if (r && r.id === id && (r.phase === 'completed' || r.phase === 'errored' || r.phase === 'aborted')) return r.phase;
      if (performance.now() - t0 > 30_000) return r ? `${r.phase ?? 'unknown'} (timeout)` : 'no-render (timeout)';
      await new Promise((res) => setTimeout(res, 25));
    }
  }, storyId);
}

/** Loads the preview once with `globals` on `storyId` (default: the blank fixture). */
export async function openPreview(page, { base = STORYBOOK_URL, storyId = BLANK_ID, globals = {} } = {}) {
  await page.goto(previewUrl(base, storyId, globals), { waitUntil: 'load' });
  await page.waitForSelector('[data-ag-cert-ready]', { timeout: 30_000, state: 'attached' });
  const phase = await waitRender(page, storyId);
  if (phase !== 'completed') throw new Error(`story ${storyId} render phase ${phase}`);
}

/** Switches the loaded preview to `storyId` (the previous story unmounts) and waits for the render to complete. */
export async function showStory(page, storyId) {
  await page.evaluate((sid) => { window.__STORYBOOK_PREVIEW__.onSetCurrentStory({ storyId: sid, viewMode: 'story' }); }, storyId);
  const phase = await waitRender(page, storyId);
  if (phase !== 'completed') throw new Error(`story ${storyId} render phase ${phase}`);
}

/** Imports a story's CSF module and returns its parameters.ag and tags without rendering it. */
export async function loadStoryMeta(page, storyId) {
  return page.evaluate(async (sid) => {
    const store = window.__STORYBOOK_PREVIEW__?.storyStoreValue;
    if (!store || typeof store.loadStory !== 'function') throw new Error('Storybook preview store (storyStoreValue.loadStory) is unavailable');
    const story = await store.loadStory({ storyId: sid });
    return { ag: story.parameters?.ag ?? null, tags: story.tags ?? [] };
  }, storyId);
}

export async function fetchIndex(base = STORYBOOK_URL) {
  const res = await fetch(`${base}/index.json`);
  if (!res.ok) throw new Error(`index.json not reachable at ${base} (HTTP ${res.status}) — qual:build:storybook must run first`);
  return res.json();
}

/** Subject stories (parameters.ag.subject set) with their scenes. Throws `pending:` (rule 2) when there are none. */
export async function subjectStories(page, allScenes, base = STORYBOOK_URL) {
  const index = await fetchIndex(base);
  const out = [];
  let unannotated = 0;
  await openPreview(page, { base });
  for (const e of candidateEntries(index)) {
    const { ag, tags } = await loadStoryMeta(page, e.id);
    if (!ag?.subject) { unannotated += 1; continue; }
    out.push({ id: e.id, subject: ag.subject, tags, scenes: scenesOf(ag, tags, allScenes) });
  }
  if (out.length === 0) pendingOrFail(`no story in ${base}/index.json declares parameters.ag.subject`, 'stream stories with parameters.ag (CMP/SURF/MAT)');
  return { stories: out, unannotated };
}

/**
 * Visits every (story, scene) cell: one preview load per scene with `globals` + scene, then story switches.
 * `perCell(cell)` returns violations; a story that fails to render is itself a violation (the invariant could not be
 * evaluated, so the cell does not pass).
 */
export async function crawlCells(page, stories, allScenes, { base = STORYBOOK_URL, globals = {}, perCell, onScene } = {}) {
  const results = [];
  for (const [scene, ids] of cellsByScene(stories, allScenes)) {
    if (!ids.length) continue;
    await openPreview(page, { base, globals: { ...globals, scene } });
    if (onScene) await onScene(scene);
    for (const id of ids) {
      let violations;
      try {
        await showStory(page, id);
        violations = await perCell({ storyId: id, scene });
      } catch (err) {
        violations = [v('cell-error', String(err?.message ?? err).split('\n')[0])];
        await openPreview(page, { base, globals: { ...globals, scene } });
        if (onScene) await onScene(scene);
      }
      results.push({ storyId: id, scene, violations });
    }
  }
  return results;
}

export function formatCellFailures(results) {
  return results.filter((r) => r.violations.length)
    .map((r) => `${r.storyId} @ ${r.scene}: ${r.violations.map((x) => `${x.code} — ${x.detail}`).join('; ')}`);
}

/* ------------------------------------------------------------------ page actions for the specs ------------------------------------------------------------------ */

/** rAF requests by page code in a quiet window of `ms` (after `reactMs` for the page to react to a state change). */
export async function rafRequestsIn(page, ms = LIMITS.quietMs, reactMs = 0) {
  return page.evaluate(async ([quiet, react]) => {
    await new Promise((r) => setTimeout(r, react));
    const t = performance.now();
    await new Promise((r) => setTimeout(r, quiet));
    return window.__agInstrument.rafRequestsSince(t);
  }, [ms, reactMs]);
}

export async function snapshot(page, webglSinceMs) {
  return page.evaluate((since) => window.__agInstrument.snapshot(since), webglSinceMs ?? null);
}

export async function pageNow(page) { return page.evaluate(() => performance.now()); }

/** Simulated `document.visibilityState === 'hidden'` (+ visibilitychange) for `fn`, then restored. */
export async function whileHidden(page, fn) {
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  try { return await fn(); } finally {
    await page.evaluate(() => {
      delete document.visibilityState;
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    });
  }
}

/** Moves the story root far below the viewport (IntersectionObserver sees every canvas leave it) for `fn`. */
export async function whileOffscreen(page, fn) {
  await page.evaluate(() => {
    const root = document.querySelector('#storybook-root') ?? document.body;
    root.setAttribute('data-ag-offscreen-probe', root.style.transform);
    root.style.transform = 'translateY(400vh)';
  });
  try { return await fn(); } finally {
    await page.evaluate(() => {
      const root = document.querySelector('[data-ag-offscreen-probe]');
      if (root) { root.style.transform = root.getAttribute('data-ag-offscreen-probe') ?? ''; root.removeAttribute('data-ag-offscreen-probe'); }
    });
  }
}

/* ------------------------------------------------------------------ evidence ------------------------------------------------------------------ */

export function evidenceDir() {
  return resolve(process.env.AURAGLASS_EVIDENCE_DIR ?? '.artifacts', 'qual', process.env.CI_JOB_NAME_SLUG ?? 'qual-certify-l10');
}
export function writeEvidence(name, doc) {
  const dir = resolve(evidenceDir(), 'invariants');
  mkdirSync(dir, { recursive: true });
  const file = resolve(dir, name);
  writeFileSync(file, `${JSON.stringify({ sha: process.env.CI_COMMIT_SHA ?? null, jobUrl: process.env.CI_JOB_URL ?? null,
    generatedAt: new Date().toISOString(), ...doc }, null, 2)}\n`);
  return file;
}

export { sleep };
