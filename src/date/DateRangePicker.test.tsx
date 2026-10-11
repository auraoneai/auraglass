/** @jest-environment jsdom */
// REQ-SURF-102: DateRangePicker — one grid per visible month, container-driven
// visibleMonths, draft-commit with Apply, presets through the draft, Escape
// discards the draft.
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { renderAg } from '../../tests/helpers';
import { DateRangePicker } from './DateRangePicker';
import type { DateRangeValue } from './DateRangePicker';

const seg = (root: ParentNode, which: 'start' | 'end', type: string) =>
  root.querySelector<HTMLElement>(`[data-ag-part="date-input-${which}"] [role="spinbutton"][data-type="${type}"]`)!;
const ymd = (root: ParentNode, which: 'start' | 'end') =>
  ['year', 'month', 'day'].map((t) => seg(root, which, t).getAttribute('aria-valuenow')).join('-');

const week = { label: 'Launch week', value: { start: new CalendarDate(2026, 11, 2), end: new CalendarDate(2026, 11, 8) } };
const initial = { start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 3) };

async function open(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Choose dates' }));
  return screen.findByRole('dialog');
}

describe('DateRangePicker (REQ-SURF-102)', () => {
  const OriginalRO = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
  afterEach(() => {
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = OriginalRO;
  });
  const fixWidth = (w: number) => {
    class FixedRO {
      constructor(private cb: (entries: unknown[]) => void) {}
      observe(el: Element) {
        this.cb([{ target: el, contentRect: { width: w }, contentBoxSize: [{ inlineSize: w }] }]);
      }
      unobserve() {}
      disconnect() {}
    }
    (globalThis as { ResizeObserver?: unknown }).ResizeObserver = FixedRO;
  };

  it('renders two month grids by default', async () => {
    const user = userEvent.setup();
    renderAg(<DateRangePicker label="Range" defaultValue={initial} />);
    const dialog = await open(user);
    expect(dialog.querySelectorAll('.ag-calendar__grid').length).toBe(2);
    const labels = [...dialog.querySelectorAll('[role="grid"]')].map((g) => g.getAttribute('aria-label'));
    expect(labels[0]).toMatch(/October 2026/);
    expect(labels[1]).toMatch(/November 2026/);
  });

  it('renders two grids at a >=768px container and one below', async () => {
    const user = userEvent.setup();
    fixWidth(800);
    const wide = renderAg(<DateRangePicker label="Range" defaultValue={initial} />);
    expect((await open(user)).querySelectorAll('.ag-calendar__grid').length).toBe(2);
    wide.unmount();
    fixWidth(700);
    renderAg(<DateRangePicker label="Range" defaultValue={initial} />);
    expect((await open(user)).querySelectorAll('.ag-calendar__grid').length).toBe(1);
  });

  it('an explicit visibleMonths wins over the container', async () => {
    const user = userEvent.setup();
    fixWidth(1200);
    renderAg(<DateRangePicker label="Range" visibleMonths={1} defaultValue={initial} />);
    expect((await open(user)).querySelectorAll('.ag-calendar__grid').length).toBe(1);
  });

  it('uncontrolled preset goes through the draft and updates the inputs on Apply', async () => {
    const on = jest.fn();
    const user = userEvent.setup();
    const { container } = renderAg(<DateRangePicker label="Range" presets={[week]} defaultValue={initial} onValueChange={on} />);
    await open(user);
    await user.click(screen.getByRole('option', { name: 'Launch week' }));
    // Draft only: the field and the callback are untouched until Apply.
    expect(ymd(container, 'start')).toBe('2026-10-1');
    expect(on).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(ymd(container, 'start')).toBe('2026-11-2');
    expect(ymd(container, 'end')).toBe('2026-11-8');
    expect(on).toHaveBeenCalledTimes(1);
  });

  it('a calendar selection is a draft: onValueChange is not called before Apply', async () => {
    const on = jest.fn();
    const user = userEvent.setup();
    const { container } = renderAg(<DateRangePicker label="Range" visibleMonths={1} defaultValue={initial} onValueChange={on} />);
    await open(user);
    await user.click(screen.getByRole('button', { name: /October 12, 2026/ }));
    await user.click(screen.getByRole('button', { name: /October 16, 2026/ }));
    expect(on).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(ymd(container, 'end')).toBe('2026-10-3');
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(on).toHaveBeenCalledTimes(1);
    expect(String(on.mock.calls[0]?.[0] && (on.mock.calls[0][0] as { end: unknown }).end)).toBe('2026-10-16');
    expect(ymd(container, 'end')).toBe('2026-10-16');
  });

  it('Escape discards the draft and returns focus to the trigger', async () => {
    const on = jest.fn();
    const user = userEvent.setup();
    const { container } = renderAg(<DateRangePicker label="Range" presets={[week]} defaultValue={initial} onValueChange={on} />);
    await open(user);
    await user.click(screen.getByRole('option', { name: 'Launch week' }));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(on).not.toHaveBeenCalled();
    expect(ymd(container, 'start')).toBe('2026-10-1');
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Choose dates' }));
    // Re-opening starts again from the committed value, not the discarded draft.
    const dialog = await open(user);
    expect(dialog.querySelector('.ag-calendar__cell[data-selection-start]')?.textContent).toBe('1');
  });

  it('controlled: Apply reports through onValueChange and the parent value drives the field', async () => {
    const on = jest.fn<(v: DateRangeValue | null) => void>();
    const user = userEvent.setup();
    const ui = (v: DateRangeValue | null) => <DateRangePicker label="Range" presets={[week]} value={v} onValueChange={on} />;
    const { container, rerender } = renderAg(ui(initial));
    await open(user);
    await user.click(screen.getByRole('option', { name: 'Launch week' }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(on).toHaveBeenCalledTimes(1);
    // The parent has not applied the change yet: the field still shows its value.
    expect(ymd(container, 'end')).toBe('2026-10-3');
    rerender(ui(on.mock.calls[0]![0]));
    await waitFor(() => expect(ymd(container, 'end')).toBe('2026-11-8'));
  });

  it('presets sit beside the calendar in the popover and above it in the sheet', async () => {
    const user = userEvent.setup();
    const wide = renderAg(<DateRangePicker label="Range" presets={[week]} defaultValue={initial} />);
    let dialog = await open(user);
    expect(dialog.querySelector('.ag-date-range-picker__body')?.getAttribute('data-ag-layout')).toBe('beside');
    await user.keyboard('{Escape}');
    wide.unmount();
    fixWidth(390);
    renderAg(<DateRangePicker label="Range" presets={[week]} defaultValue={initial} />);
    dialog = await open(user);
    expect(dialog.getAttribute('data-ag-presentation')).toBe('sheet');
    expect(dialog.querySelector('.ag-date-range-picker__body')?.getAttribute('data-ag-layout')).toBe('stacked');
  });
});
