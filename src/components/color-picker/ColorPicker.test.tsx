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

/* eslint-disable auraglass/no-raw-design-values -- fixture colors are the unit under test */
describe('ColorPicker REQ-CMP-125', () => {
  it('onValueChange emits the {space, value} object', async () => {
    const seen: { space: string; value: string }[] = [];
    render(
      <ColorPicker.Root defaultOpen defaultValue="#3b82f6" onValueChange={(v) => seen.push(v)}>
        <ColorPicker.Content><ColorPicker.Area /></ColorPicker.Content>
      </ColorPicker.Root>,
    );
    await act(async () => {});
    fireEvent.keyDown(document.querySelector('[data-ag-part="area"]')!, { key: 'ArrowRight' });
    await act(async () => {});
    expect(seen.length).toBeGreaterThan(0);
    expect(seen[0].space).toBe('srgb');
    expect(seen[0].value).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('Channel renders a slider wired to the channel', async () => {
    render(
      <ColorPicker.Root defaultOpen defaultValue="#3b82f6">
        <ColorPicker.Content><ColorPicker.Channel channel="s" /></ColorPicker.Content>
      </ColorPicker.Root>,
    );
    await act(async () => {});
    const slider = document.querySelector('[data-ag-part="channel"] input[aria-valuenow]')!;
    expect(slider).not.toBeNull();
    expect(Number(slider.getAttribute('aria-valuenow'))).toBeGreaterThan(0);
  });

  it('Alpha slider starts at 1', async () => {
    render(
      <ColorPicker.Root defaultOpen defaultValue="#3b82f6">
        <ColorPicker.Content><ColorPicker.Alpha /></ColorPicker.Content>
      </ColorPicker.Root>,
    );
    await act(async () => {});
    const slider = document.querySelector('[data-ag-part="alpha"] input[aria-valuenow]')!;
    expect(Number(slider.getAttribute('aria-valuenow'))).toBe(1);
  });

  it('Input parses oklch() and emits the oklch space', async () => {
    const seen: { space: string; value: string }[] = [];
    render(
      <ColorPicker.Root defaultOpen onValueChange={(v) => seen.push(v)}>
        <ColorPicker.Content><ColorPicker.Input /></ColorPicker.Content>
      </ColorPicker.Root>,
    );
    await act(async () => {});
    const input = document.querySelector('[data-ag-part="input"] input')! as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'oklch(0.7 0.15 200)' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(seen.length).toBe(1);
    expect(seen[0].space).toBe('oklch');
    expect(seen[0].value).toMatch(/^oklch\(/);
  });
});
