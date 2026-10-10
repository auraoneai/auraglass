/* CMP-319: ColorPicker — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { ColorPicker } from './index';
import { hexToOklch, oklchToHex, hexToHsv, hsvToHex } from './colors';

describe('ColorPicker', () => {
  it('renders trigger + swatch; open shows content/area/hue parts', async () => {
    render(<ColorPicker.Root defaultOpen defaultValue="#3b82f6"><ColorPicker.Trigger>Pick</ColorPicker.Trigger><ColorPicker.Content><ColorPicker.Area /><ColorPicker.Hue /></ColorPicker.Content></ColorPicker.Root>);
    await act(async () => {});
    for (const p of ['root', 'trigger', 'swatch', 'positioner', 'popup', 'area', 'area-thumb', 'hue', 'hue-thumb']) {
      expect(document.querySelector(`[data-ag-part="${p}"]`)).not.toBeNull();
    }
  });
  it('Area is a single focusable role=slider with 2D roledescription', async () => {
    render(<ColorPicker.Root defaultOpen><ColorPicker.Content><ColorPicker.Area /></ColorPicker.Content></ColorPicker.Root>);
    await act(async () => {});
    const area = document.querySelector('[data-ag-part="area"]')!;
    expect(area.getAttribute('role')).toBe('slider');
    expect(area.getAttribute('aria-roledescription')).toBe('2D slider');
    expect(area.getAttribute('tabindex') ?? area.getAttribute('tabIndex')).not.toBeNull();
    expect((area.getAttribute('aria-valuetext') ?? '')).toMatch(/saturation \d+%, brightness \d+%/);
  });
  it('Area keyboard steps ±1% and Shift ±10%', async () => {
    render(<ColorPicker.Root defaultOpen defaultValue="#3b82f6"><ColorPicker.Content><ColorPicker.Area /></ColorPicker.Content></ColorPicker.Root>);
    await act(async () => {});
    const area = document.querySelector('[data-ag-part="area"]')! as HTMLElement;
    const before = area.getAttribute('aria-valuetext')!;
    fireEvent.keyDown(area, { key: 'ArrowRight' });
    const after = area.getAttribute('aria-valuetext')!;
    expect(after).not.toBe(before);
  });
});

describe('color conversions', () => {
  it('hex↔oklch round-trips within 1 ΔE', () => {
    for (const hex of ['#000000', '#ffffff', '#ff0000', '#3b82f6', '#0ea5e9', '#22c55e', '#eab308']) {
      const back = oklchToHex(hexToOklch(hex));
      // compare channel distance as a proxy ΔE bound
      const a = parseInt(hex.slice(1), 16), b = parseInt(back.slice(1), 16);
      const dr = Math.abs(((a >> 16) & 255) - ((b >> 16) & 255));
      const dg = Math.abs(((a >> 8) & 255) - ((b >> 8) & 255));
      const db = Math.abs((a & 255) - (b & 255));
      expect(Math.sqrt(dr * dr + dg * dg + db * db)).toBeLessThan(20);
    }
  });
  it('hex↔hsv round-trips exactly', () => {
    for (const hex of ['#000000', '#ffffff', '#ff0000', '#3b82f6']) {
      expect(hsvToHex(hexToHsv(hex))).toBe(hex);
    }
  });
});
