/* CMP-319 / REQ-CMP-125: ColorPicker — flat ValueProps<{space, value}>, three Base UI sliders (hue, channel,
   alpha), a hex/OKLCH input that round-trips, a 2-D area (aria-valuetext, 1% / 10% steps), and a popup that
   composes Popover (overlay regular). Colour vectors live in tests/fixtures/cmp/color-picker.json (REQ-CMP-139). */
import { describe, expect, it } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { ColorPicker } from './index';
import { hexToOklch, oklchToHex, hexToHsv, hsvToHex } from './colors';
import { overlayMaterial } from '../overlays/_shared/overlaySurface';
import { COMPOUND_PARTS } from '../../contracts/components';
import FX from '../../../tests/fixtures/cmp/color-picker.json';

const q = (sel: string) => document.querySelector(sel) as HTMLElement;
const area = () => q('[data-ag-part="area"]');
const sliderIn = (part: string) => q(`[data-ag-part="${part}"] input[aria-valuenow]`);

function Full(props: Partial<React.ComponentProps<typeof ColorPicker.Root>>) {
  return (
    <ColorPicker.Root defaultOpen defaultValue={FX.start} {...props}>
      <ColorPicker.Trigger>Pick</ColorPicker.Trigger>
      <ColorPicker.Content>
        <ColorPicker.Area />
        <ColorPicker.Hue />
        <ColorPicker.Channel channel="s" />
        <ColorPicker.Alpha />
        <ColorPicker.Input />
      </ColorPicker.Content>
    </ColorPicker.Root>
  );
}

describe('ColorPicker', () => {
  it('exposes exactly the contract parts as ColorPicker.*', () => {
    expect(Object.keys(ColorPicker).sort()).toEqual([...COMPOUND_PARTS.ColorPicker].sort());
  });

  it('renders every meta part; open shows content/area/hue/channel/alpha/input', async () => {
    render(<Full />);
    await act(async () => {});
    for (const p of ['root', 'trigger', 'swatch', 'positioner', 'popup', 'area', 'area-thumb', 'hue', 'channel', 'alpha', 'input']) {
      expect({ p, found: document.querySelector(`[data-ag-part="${p}"]`) !== null }).toEqual({ p, found: true });
    }
  });

  it('the popup composes Popover with overlay regular material', async () => {
    render(<Full />);
    await act(async () => {});
    const popup = q('[data-ag-part="popup"]');
    for (const [k, v] of Object.entries(overlayMaterial('popover'))) {
      expect({ k, v: popup.getAttribute(k) }).toEqual({ k, v: String(v) });
    }
    expect(popup.getAttribute('data-ag-layer')).toBe('overlay');
    expect(popup.getAttribute('data-ag-overlay')).toBe('popover');
  });

  it('Area is a single focusable role=slider with 2D roledescription and valuetext', async () => {
    render(<Full />);
    await act(async () => {});
    const a = area();
    expect(a.getAttribute('role')).toBe('slider');
    expect(a.getAttribute('aria-roledescription')).toBe('2D slider');
    expect(a.tabIndex).toBe(0);
    expect(a.querySelectorAll('[tabindex]').length).toBe(0);
    expect(a.getAttribute('aria-valuetext')).toBe('saturation 76%, brightness 96%');
  });

  it('Area steps exactly 1% on Arrow and 10% on Shift+Arrow', async () => {
    render(<Full />);
    await act(async () => {});
    const press = (key: string, shiftKey = false) => { fireEvent.keyDown(area(), { key, shiftKey }); return area().getAttribute('aria-valuetext'); };
    expect(press('ArrowRight')).toBe('saturation 77%, brightness 96%');
    expect(press('ArrowRight', true)).toBe('saturation 87%, brightness 96%');
    expect(press('ArrowLeft')).toBe('saturation 86%, brightness 96%');
    expect(press('ArrowUp')).toBe('saturation 86%, brightness 97%');
    expect(press('ArrowDown', true)).toBe('saturation 86%, brightness 87%');
    expect(press('ArrowUp', true)).toBe('saturation 86%, brightness 97%');
    expect(press('ArrowUp', true)).toBe('saturation 86%, brightness 100%'); // clamped
  });

  it('Hue, Channel and Alpha are keyboard-operable Base UI sliders', async () => {
    render(<Full />);
    await act(async () => {});
    for (const part of ['hue', 'channel', 'alpha']) {
      const input = sliderIn(part);
      expect({ part, type: input.getAttribute('type') }).toEqual({ part, type: 'range' });
    }
    const hue = sliderIn('hue');
    const h0 = Number(hue.getAttribute('aria-valuenow'));
    expect(hue.getAttribute('aria-valuetext')).toBe(`hue ${h0}°`);
    fireEvent.keyDown(hue, { key: 'ArrowRight' });
    await act(async () => {});
    expect(Number(sliderIn('hue').getAttribute('aria-valuenow'))).toBe(h0 + 1);
    fireEvent.keyDown(sliderIn('hue'), { key: 'ArrowRight', shiftKey: true });
    await act(async () => {});
    expect(Number(sliderIn('hue').getAttribute('aria-valuenow'))).toBe(h0 + 1 + 15);

    const s0 = Number(sliderIn('channel').getAttribute('aria-valuenow'));
    fireEvent.keyDown(sliderIn('channel'), { key: 'ArrowLeft' });
    await act(async () => {});
    // Base UI snaps to the 1-point step grid
    expect(Number(sliderIn('channel').getAttribute('aria-valuenow'))).toBe(Math.round(s0) - 1);
    // the channel slider and the area agree on saturation
    expect(area().getAttribute('aria-valuetext')).toMatch(new RegExp(`^saturation ${Math.round(s0) - 1}%`));

    expect(Number(sliderIn('alpha').getAttribute('aria-valuenow'))).toBe(1);
    fireEvent.keyDown(sliderIn('alpha'), { key: 'ArrowLeft' });
    await act(async () => {});
    expect(Number(sliderIn('alpha').getAttribute('aria-valuenow'))).toBeCloseTo(0.99, 5);
  });

  it('typing a hex + Enter emits {space:"srgb"} and updates the area; the input shows it back', async () => {
    const seen: { space: string; value: string }[] = [];
    render(<Full onValueChange={(v) => seen.push(v)} />);
    await act(async () => {});
    const input = q('[data-ag-part="input"] input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: FX.roundTrip.typed } });
    fireEvent.keyDown(input, { key: 'Enter' });
    await act(async () => {});
    expect(seen).toEqual([{ space: 'srgb', value: FX.roundTrip.typed }]);
    expect(area().getAttribute('aria-valuetext')).toBe(FX.roundTrip.areaValueText);
    expect((q('[data-ag-part="input"] input') as HTMLInputElement).value).toBe(FX.roundTrip.typed);
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('typing an OKLCH value emits the oklch space; an unparsable value marks the input invalid', async () => {
    const seen: { space: string; value: string }[] = [];
    render(<Full onValueChange={(v) => seen.push(v)} />);
    await act(async () => {});
    const input = q('[data-ag-part="input"] input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: FX.oklchTyped } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(seen.length).toBe(1);
    expect(seen[0]?.space).toBe('oklch');
    expect(seen[0]?.value).toMatch(/^oklch\(/);
    fireEvent.change(input, { target: { value: 'not a colour' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(seen.length).toBe(1);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('onValueChange emits the {space, value} object from the area', async () => {
    const seen: { space: string; value: string }[] = [];
    render(<Full onValueChange={(v) => seen.push(v)} />);
    await act(async () => {});
    fireEvent.keyDown(area(), { key: 'ArrowRight' });
    expect(seen.length).toBe(1);
    expect(seen[0]?.space).toBe('srgb');
    expect(seen[0]?.value).toMatch(/^#[0-9a-f]{6}$/);
  });
});

describe('color conversions', () => {
  it('hex↔oklch round-trips within a small channel distance', () => {
    for (const h of FX.conversions) {
      const back = oklchToHex(hexToOklch(h));
      const a = parseInt(h.slice(1), 16), b = parseInt(back.slice(1), 16);
      const dr = Math.abs(((a >> 16) & 255) - ((b >> 16) & 255));
      const dg = Math.abs(((a >> 8) & 255) - ((b >> 8) & 255));
      const db = Math.abs((a & 255) - (b & 255));
      expect(Math.sqrt(dr * dr + dg * dg + db * db)).toBeLessThan(20);
    }
  });
  it('hex↔hsv round-trips exactly', () => {
    for (const h of FX.exactHsv) expect(hsvToHex(hexToHsv(h))).toBe(h);
  });
});
