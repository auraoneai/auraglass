/* REQ-MAT-38 — dev surface counter started by the provider: warns once per
   threshold crossing (7 live surfaces -> 1 warning; 7 -> 5 -> 7 -> a 2nd
   warning), nesting/allowNested messages carry `at <selector>`, nothing under
   NODE_ENV=production, and a production consumer bundle of the provider +
   Surface carries neither dev module (scripts/mat/verify-dev-strip.mjs). */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { act, render } from '@testing-library/react';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { AuraGlassProvider } from '../../theme/index';
import { Surface } from '../Surface';
import { startSurfaceCounter } from '../dev/surfaceCounter';

const VW = 1280;
const VH = 800;
const COUNTER = /live backdrop filters in the viewport/;
/** A ::before backdrop-filter value with the given blur radius (px). */
const blurFilter = (px: number) => `blur(${px}px) saturate(1.6)`;

let warn: ReturnType<typeof jest.spyOn>;
const counterWarnings = (re: RegExp = COUNTER) =>
  warn.mock.calls.map((c: unknown[]) => String(c[0])).filter((m: string) => re.test(m));

/** Let the 500 ms debounce + idle fallback run, and flush MutationObserver records. */
const settle = async () => {
  await act(async () => { await Promise.resolve(); });
  await act(async () => { jest.advanceTimersByTime(600); });
  await act(async () => { jest.advanceTimersByTime(10); });
};

beforeEach(() => {
  jest.useFakeTimers();
  warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: VW });
  Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: VH });
  // jsdom has no layout or backdrop-filter: every .ag-surface is a visible
  // 100x100 box whose ::before carries a live 20px blur (unless it opts out).
  jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return { x: 0, y: 0, top: 0, left: 0, right: 100, bottom: 100, width: 100, height: 100, toJSON: () => ({}) } as DOMRect;
  });
  const real = window.getComputedStyle.bind(window);
  jest.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, pseudo?: string | null) => {
    if (pseudo === '::before' && el.classList.contains('ag-surface')) {
      const bf = el.getAttribute('data-test-filter') ?? blurFilter(20);
      return { backdropFilter: bf } as unknown as CSSStyleDeclaration;
    }
    return real(el, pseudo);
  });
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
  delete (document.documentElement as unknown as Record<string, unknown>).clientWidth;
  delete (document.documentElement as unknown as Record<string, unknown>).clientHeight;
  document.body.innerHTML = '';
});

const Surfaces = ({ n }: { n: number }) => (
  <>{Array.from({ length: n }, (_, i) => <Surface key={i} layer="chrome">{`s${i}`}</Surface>)}</>
);

describe('REQ-MAT-38 surface counter via the provider', () => {
  it('7 live surfaces at a fine pointer -> exactly 1 warning, not repeated on later checks', async () => {
    const { rerender, unmount } = render(<AuraGlassProvider storage={null}><Surfaces n={7} /></AuraGlassProvider>);
    await settle();
    expect(counterWarnings()).toHaveLength(1);
    expect(counterWarnings()[0]).toMatch(/7 live backdrop filters .*cap 6/);
    // a mutation that keeps the count above the cap does not warn again
    rerender(<AuraGlassProvider storage={null}><Surfaces n={8} /></AuraGlassProvider>);
    await settle();
    expect(counterWarnings()).toHaveLength(1);
    unmount();
  });

  it('7 -> 5 -> 7 re-arms: the second crossing warns again', async () => {
    const { rerender, unmount } = render(<AuraGlassProvider storage={null}><Surfaces n={7} /></AuraGlassProvider>);
    await settle();
    expect(counterWarnings()).toHaveLength(1);
    rerender(<AuraGlassProvider storage={null}><Surfaces n={5} /></AuraGlassProvider>);
    await settle();
    expect(counterWarnings()).toHaveLength(1);
    rerender(<AuraGlassProvider storage={null}><Surfaces n={7} /></AuraGlassProvider>);
    await settle();
    expect(counterWarnings()).toHaveLength(2);
    unmount();
  });

  it('5 live surfaces stay under the cap: no counter warning', async () => {
    const { unmount } = render(<AuraGlassProvider storage={null}><Surfaces n={5} /></AuraGlassProvider>);
    await settle();
    expect(counterWarnings()).toHaveLength(0);
    unmount();
  });

  it('nothing under NODE_ENV=production', async () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const { unmount } = render(<AuraGlassProvider storage={null}><Surfaces n={9} /></AuraGlassProvider>);
      await settle();
      const stop = startSurfaceCounter(document);
      await settle();
      stop();
      expect(warn).not.toHaveBeenCalled();
      unmount();
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});

describe('REQ-MAT-38 counter messages', () => {
  it('allowNested at depth >= 2 and nesting > 1 name the element (`at <selector>`)', async () => {
    document.body.innerHTML = `
      <div class="ag-surface" data-ag-layer="chrome">
        <div class="ag-surface" data-ag-layer="chrome">
          <div class="ag-surface" data-ag-layer="overlay" data-ag-allow-nested=""></div>
        </div>
      </div>`;
    const stop = startSurfaceCounter(document);
    await settle();
    stop();
    expect(counterWarnings(/allowNested at depth 2 at \.ag-surface\[data-ag-layer=overlay\]/)).toHaveLength(1);
    expect(counterWarnings(/nesting depth 2 exceeds 1 at \.ag-surface\[data-ag-layer=overlay\]/)).toHaveLength(1);
  });

  it('blur > 32px warns once per crossing with the selector, and re-arms when it is fixed', async () => {
    document.body.innerHTML = `<div class="ag-surface" data-ag-layer="chrome" data-test-filter="${blurFilter(40)}"></div>`;
    const el = document.body.firstElementChild!;
    const stop = startSurfaceCounter(document);
    await settle();
    expect(counterWarnings(/blur above 32px at \.ag-surface\[data-ag-layer=chrome\]/)).toHaveLength(1);
    el.setAttribute('data-test-filter', blurFilter(20));
    await settle();
    el.setAttribute('data-test-filter', blurFilter(48));
    await settle();
    stop();
    expect(counterWarnings(/blur above 32px/)).toHaveLength(2);
  });

  it('never writes attributes or styles', async () => {
    document.body.innerHTML = Array.from({ length: 8 }, () => '<div class="ag-surface" data-ag-layer="chrome"></div>').join('');
    const before = document.documentElement.outerHTML;
    const stop = startSurfaceCounter(document);
    await settle();
    stop();
    expect(counterWarnings()).toHaveLength(1);
    expect(document.documentElement.outerHTML).toBe(before);
  });
});

describe('REQ-MAT-38 production bundle', () => {
  it('a production consumer bundle of the provider + Surface has 0 surfaceCounter/warnings markers', () => {
    jest.useRealTimers();
    const script = join(__dirname, '../../../scripts/mat/verify-dev-strip.mjs');
    const out = execFileSync(process.execPath, [script, '--src', '--root', join(__dirname, '../../..')], { encoding: 'utf8' });
    expect(out).toMatch(/\[dev-strip\] OK \(src\): surfaceCounter hits in production bundle = 0/);
  });
});
