import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { Switch } from './index';
import { SWITCH_KEYS } from './Switch.keys';

beforeAll(() => {
  if (typeof window.PointerEvent !== 'function') {
    (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
  }
});

describe('Switch (CMP-134)', () => {
  it('has role=switch and toggles on Space', async () => {
    const spy = jest.fn();
    render(<Switch onCheckedChange={spy} aria-label="airplane" />);
    const sw = screen.getByRole('switch', { name: 'airplane' });
    sw.focus();
    await userEvent.keyboard(' ');
    expect(spy).toHaveBeenCalledWith(true, expect.objectContaining({ reason: expect.any(String) }));
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });

  it('records the pin Enter behaviour (SWITCH_KEYS)', async () => {
    const spy = jest.fn();
    render(<Switch onCheckedChange={spy} aria-label="x" />);
    screen.getByRole('switch', { name: 'x' }).focus();
    await userEvent.keyboard('{Enter}');
    if (SWITCH_KEYS.enter === 'toggles') {
      expect(spy).toHaveBeenCalled();
    } else {
      expect(spy).not.toHaveBeenCalled();
    }
  });

  it('emits parts root/thumb/hit-area', () => {
    const { container } = render(<Switch aria-label="x" />);
    for (const p of ['root', 'thumb', 'hit-area']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).toBeTruthy();
    }
  });
});

describe('REQ-CMP-46', () => {
  it('thumb gets data-ag-animating on toggle then it clears', async () => {
    const { container } = render(
      <Switch defaultChecked={false} aria-label="sw" />,
    );
    const root = container.querySelector('[data-ag-part="root"]') as HTMLElement;
    expect(root).not.toBeNull();
    /* track + thumb material attrs present */
    expect(root.getAttribute('data-ag-content')).toBe('content-sunken');
    const thumb = root.querySelector('[data-ag-part="thumb"]') as HTMLElement;
    expect(thumb.getAttribute('data-ag-layer')).toBe('transient');
    /* at rest the thumb is a nested inner-fill surface (no own optics) */
    expect(thumb.hasAttribute('data-ag-allow-nested')).toBe(false);
    (screen.getByRole('switch', { name: 'sw' }) as HTMLElement).focus();
    await userEvent.keyboard(' ');
    expect(thumb.getAttribute('data-ag-animating')).not.toBeNull();
    /* glass while moving: allowNested keeps MAT optics inside the track */
    expect(thumb.hasAttribute('data-ag-allow-nested')).toBe(true);
    await act(() => new Promise((r) => setTimeout(r, 450)));
    expect(thumb.getAttribute('data-ag-animating')).toBeNull();
    expect(thumb.hasAttribute('data-ag-allow-nested')).toBe(false);
  });
});

/* REQ-CMP-45: the track is sized from the comp tokens (32x18 / 40x22 / 52x30,
   tokens/comp/comp.tokens.json) as a border-box with the 2px private inset;
   the thumb is track-h - 2*inset and slides track-w - track-h. */
describe('REQ-CMP-45 switch track geometry (Switch.css)', () => {
  const css = postcss.parse(readFileSync(join(__dirname, 'Switch.css'), 'utf8'));
  const decl = (selector: string, prop: string): string | undefined => {
    let v: string | undefined;
    css.walkRules((r) => {
      if (r.selectors.includes(selector)) r.walkDecls(prop, (d) => { v = d.value.replace(/\s+/g, ' ').trim(); });
    });
    return v;
  };
  const tokens = JSON.parse(readFileSync(join(__dirname, '../../../tokens/comp/comp.tokens.json'), 'utf8'));
  const sw = tokens.comp.switch;

  it('the comp tokens hold 32x18 / 40x22 / 52x30 and a 2px inset', () => {
    const px = (k: string) => `${sw[k].$value.value}${sw[k].$value.unit}`;
    expect([px('track-w-sm'), px('track-h-sm')]).toEqual(['32px', '18px']);
    expect([px('track-w-md'), px('track-h-md')]).toEqual(['40px', '22px']);
    expect([px('track-w-lg'), px('track-h-lg')]).toEqual(['52px', '30px']);
    expect(px('thumb-inset')).toBe('2px');
    expect(sw['thumb-inset'].$extensions['ag.cssVar']).toBe('--_ag-switch-thumb-inset');
  });

  it('the track is a border-box with the inset as padding', () => {
    const root = ".ag-switch[data-ag-part='root']";
    expect(decl(root, 'box-sizing')).toBe('border-box');
    expect(decl(root, 'padding')).toBe('var(--_ag-switch-thumb-inset)');
  });

  it.each([
    ['md', ".ag-switch[data-ag-part='root']", ".ag-switch [data-ag-part='thumb']", ".ag-switch[data-ag-part='root'][data-checked] [data-ag-part='thumb']"],
    ['sm', ".ag-switch[data-ag-part='root'][data-ag-size='sm']", ".ag-switch[data-ag-part='root'][data-ag-size='sm'] [data-ag-part='thumb']", ".ag-switch[data-ag-part='root'][data-ag-size='sm'][data-checked] [data-ag-part='thumb']"],
    ['lg', ".ag-switch[data-ag-part='root'][data-ag-size='lg']", ".ag-switch[data-ag-part='root'][data-ag-size='lg'] [data-ag-part='thumb']", ".ag-switch[data-ag-part='root'][data-ag-size='lg'][data-checked] [data-ag-part='thumb']"],
  ])('%s: track, thumb and slide use the public tokens', (size, track, thumb, checked) => {
    expect(decl(track, 'inline-size')).toBe(`var(--ag-switch-track-w-${size})`);
    expect(decl(track, 'block-size')).toBe(`var(--ag-switch-track-h-${size})`);
    const thumbSide = `calc(var(--ag-switch-track-h-${size}) - 2 * var(--_ag-switch-thumb-inset))`;
    expect(decl(thumb, 'block-size')).toBe(thumbSide);
    expect(decl(thumb, 'inline-size')).toBe(thumbSide);
    expect(decl(checked, 'translate')).toBe(`calc( var(--ag-switch-track-w-${size}) - var(--ag-switch-track-h-${size}) ) 0`);
  });

  it('references no undefined private --_ag-switch-track-* vars', () => {
    expect(readFileSync(join(__dirname, 'Switch.css'), 'utf8')).not.toMatch(/--_ag-switch-track-/);
  });

  it('disabled dimming skips surface parts (REQ-CMP-13)', () => {
    let sel = '';
    css.walkRules((r) => { if (r.selector.includes('[data-disabled]') && r.some((n) => n.type === 'decl' && n.prop === 'opacity')) sel = r.selector; });
    expect(sel).toContain(':not([data-ag-surface])');
  });
});
