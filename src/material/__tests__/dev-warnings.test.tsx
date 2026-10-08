/* MAT-150 — dev warnings: clear without backdrop, clear under auto,
   allowNested depth >= 2, refraction on non-chrome layers, production silence. */
import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { render } from '@testing-library/react';
import { Surface } from '../Surface';
import { warnOnce, warnSurface } from '../dev/warnings';
import { startSurfaceCounter } from '../dev/surfaceCounter';

describe('dev warnings', () => {
  it('clear without backdrop warns once per element', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Surface variant="clear" layer="chrome" />);
    render(<Surface variant="clear" layer="chrome" />);
    expect(warn).toHaveBeenCalledTimes(2); // once per element
    const msgs = warn.mock.calls.map((c) => String(c[0]));
    expect(msgs.every((m) => m.includes('variant="clear" requires a declared backdrop'))).toBe(true);
    warn.mockRestore();
  });

  it('clear under an auto backdrop warns', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <div data-ag-backdrop="auto">
        <Surface variant="clear" layer="chrome" />
      </div>,
    );
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('variant="clear" requires a declared backdrop'),
    );
    warn.mockRestore();
  });

  it('clear under a declared backdrop does not warn', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <div data-ag-backdrop="dark">
        <Surface variant="clear" layer="chrome" />
      </div>,
    );
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('allowNested at depth >= 2 warns once with depth + selector', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <Surface layer="chrome">
        <Surface layer="chrome">
          <Surface layer="chrome" allowNested />
        </Surface>
      </Surface>,
    );
    const hits = warn.mock.calls.filter((c) => /allowNested at depth \d/.test(String(c[0])));
    expect(hits.length).toBe(1);
    expect(String(hits[0]![0])).toMatch(/at depth 2 at \./);
    warn.mockRestore();
  });

  it('refraction on a non-chrome layer warns', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Surface layer="overlay" refraction />);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('refraction is ignored on layer="overlay"'),
    );
    warn.mockRestore();
  });

  it('warnOnce deduplicates per element and key', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const el = document.createElement('div');
    warnOnce(el, 'k', 'm');
    warnOnce(el, 'k', 'm');
    warnOnce(el, 'other', 'm2');
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });
});

describe('production silence', () => {
  it('warns are no-ops under NODE_ENV=production', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const el = document.createElement('div');
    el.setAttribute('data-ag-variant', 'clear');
    warnSurface(el);
    warnOnce(el, 'k', 'm');
    const stop = startSurfaceCounter(document);
    expect(warn).not.toHaveBeenCalled();
    process.env.NODE_ENV = prev;
    stop();
    warn.mockRestore();
  });
});
