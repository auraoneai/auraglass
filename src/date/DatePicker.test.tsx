/** @jest-environment jsdom */
// REQ-SURF-98 / REQ-SURF-101: DatePicker behaviour — contextual Calendar
// (uncontrolled select updates the field and closes), LayerStack popover with
// Escape focus return, value description on the CMP Button trigger, initial
// focus on the selected cell, spinbutton segments, bottom-sheet presentation below 640px, and
// locale/dir from the closest [lang]/[dir] without an SSR mismatch.
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { CalendarDate } from '@internationalized/date';
import { renderAg, renderAgServer } from '../../tests/helpers';
import { DatePicker } from './DatePicker';

const seg = (root: ParentNode, type: string) =>
  root.querySelector<HTMLElement>(`[data-ag-part="date-input"] [role="spinbutton"][data-type="${type}"]`)!;

describe('DatePicker (REQ-SURF-98/101)', () => {
  it('opens from the CMP Button trigger and closes on Escape, returning focus to the trigger', async () => {
    const user = userEvent.setup();
    renderAg(<DatePicker label="Due" defaultValue={new CalendarDate(2026, 10, 15)} />);
    const trigger = screen.getByRole('button', { name: 'Choose date' });
    expect(trigger.classList.contains('ag-button')).toBe(true);
    expect(trigger.getAttribute('data-ag-part')).toBe('date-picker-trigger');
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog');
    expect(dialog.getAttribute('data-ag-part')).toBe('date-picker-popover');
    expect(dialog.getAttribute('data-ag-overlay')).toBe('popover');
    expect(dialog.getAttribute('aria-labelledby')).toBe(screen.getByText('Due').id);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });

  it('focuses the selected date cell on open', async () => {
    const user = userEvent.setup();
    renderAg(<DatePicker label="Due" defaultValue={new CalendarDate(2026, 10, 15)} />);
    await user.click(screen.getByRole('button', { name: 'Choose date' }));
    await screen.findByRole('dialog');
    await waitFor(() => expect(document.activeElement?.getAttribute('aria-label')).toMatch(/October 15, 2026/));
  });

  it('uncontrolled: selecting a day updates the field value and closes the popup', async () => {
    const user = userEvent.setup();
    const { container } = renderAg(<DatePicker label="Due" defaultValue={new CalendarDate(2026, 10, 15)} />);
    await user.click(screen.getByRole('button', { name: 'Choose date' }));
    await user.click(await screen.findByRole('button', { name: /October 22, 2026/ }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(seg(container, 'day').getAttribute('aria-valuenow')).toBe('22');
    expect(seg(container, 'month').getAttribute('aria-valuenow')).toBe('10');
  });

  it('trigger aria-describedby holds the formatted value', async () => {
    const user = userEvent.setup();
    const { container } = renderAg(<DatePicker label="Due" defaultValue={new CalendarDate(2026, 10, 15)} />);
    const trigger = screen.getByRole('button', { name: 'Choose date' });
    const desc = () => document.getElementById(trigger.getAttribute('aria-describedby') ?? '')?.textContent;
    expect(desc()).toBe('October 15, 2026');
    await user.click(trigger);
    await user.click(await screen.findByRole('button', { name: /October 3, 2026/ }));
    await waitFor(() => expect(desc()).toBe('October 3, 2026'));
    expect(container.querySelector('[data-ag-part="date-picker-value"]')?.className).toBe('ag-vh');
  });

  it('DateInput segments are spinbuttons: Up/Down, digits and Backspace', async () => {
    const on = jest.fn();
    const user = userEvent.setup();
    const { container } = renderAg(<DatePicker label="Due" defaultValue={new CalendarDate(2026, 10, 15)} onValueChange={on} />);
    const day = seg(container, 'day');
    expect(day.getAttribute('role')).toBe('spinbutton');
    act(() => day.focus());
    await user.keyboard('{ArrowUp}');
    expect(seg(container, 'day').getAttribute('aria-valuenow')).toBe('16');
    await user.keyboard('{ArrowDown}{ArrowDown}');
    expect(seg(container, 'day').getAttribute('aria-valuenow')).toBe('14');
    act(() => seg(container, 'month').focus());
    await user.keyboard('3');
    expect(seg(container, 'month').getAttribute('aria-valuenow')).toBe('3');
    act(() => seg(container, 'year').focus());
    await user.keyboard('{Backspace}');
    expect(seg(container, 'year').getAttribute('aria-valuenow')).toBe('202');
    expect(on).toHaveBeenLastCalledWith(expect.objectContaining({ year: 202, month: 3, day: 14 }));
  });

  it('name submits the ISO value', () => {
    const { container } = renderAg(
      <form>
        <DatePicker label="Due" name="due" defaultValue={new CalendarDate(2026, 10, 15)} />
      </form>,
    );
    expect(new FormData(container.querySelector('form')!).get('due')).toBe('2026-10-15');
  });

  it('isReadOnly disables the trigger', () => {
    renderAg(<DatePicker label="Due" isReadOnly defaultValue={new CalendarDate(2026, 10, 15)} />);
    expect(screen.getByRole('button', { name: 'Choose date' }).hasAttribute('disabled')).toBe(true);
  });

  describe('container width below 640px', () => {
    const OriginalRO = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
    beforeEach(() => {
      class FixedRO {
        constructor(private cb: (entries: unknown[]) => void) {}
        observe(el: Element) {
          this.cb([{ target: el, contentRect: { width: 390 }, contentBoxSize: [{ inlineSize: 390 }] }]);
        }
        unobserve() {}
        disconnect() {}
      }
      (globalThis as { ResizeObserver?: unknown }).ResizeObserver = FixedRO;
    });
    afterEach(() => {
      (globalThis as { ResizeObserver?: unknown }).ResizeObserver = OriginalRO;
    });

    it('presents the CMP Popover as a bottom sheet anchored to the viewport bottom edge', async () => {
      const user = userEvent.setup();
      renderAg(<DatePicker label="Due" defaultValue={new CalendarDate(2026, 10, 15)} />);
      await user.click(screen.getByRole('button', { name: 'Choose date' }));
      const dialog = await screen.findByRole('dialog');
      expect(dialog.getAttribute('data-ag-presentation')).toBe('sheet');
      expect(dialog.getAttribute('data-ag-side')).toBe('bottom');
      expect(dialog.getAttribute('data-ag-overlay')).toBe('popover');
      const positioner = dialog.closest('[data-ag-part="positioner"]') as HTMLElement;
      expect(positioner.getAttribute('data-ag-presentation')).toBe('sheet');
      expect(positioner.style.position).toBe('fixed');
      // Popup sits on top of the viewport-bottom anchor.
      expect(positioner.getAttribute('data-side')).toBe('top');
      await user.click(screen.getByRole('button', { name: /October 18, 2026/ }));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    });

    it('Escape closes the sheet presentation and returns focus to the trigger', async () => {
      const user = userEvent.setup();
      renderAg(<DatePicker label="Due" defaultValue={new CalendarDate(2026, 10, 15)} />);
      const trigger = screen.getByRole('button', { name: 'Choose date' });
      await user.click(trigger);
      await screen.findByRole('dialog');
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      expect(document.activeElement).toBe(trigger);
    });
  });

  it('locale and dir resolve from the closest [lang]/[dir]', async () => {
    const user = userEvent.setup();
    const { container } = renderAg(
      <div lang="de-DE">
        <div dir="rtl">
          <DatePicker label="Datum" defaultValue={new CalendarDate(2026, 10, 15)} />
        </div>
      </div>,
    );
    await waitFor(() => {
      const types = [...container.querySelectorAll('[data-ag-part="date-input"] [role="spinbutton"]')].map((s) => s.getAttribute('data-type'));
      expect(types).toEqual(['day', 'month', 'year']);
    });
    expect(container.querySelector('[data-ag-part="date-picker"]')?.getAttribute('dir')).toBe('rtl');
    await user.click(screen.getByRole('button', { name: 'Choose date' }));
    const dialog = await screen.findByRole('dialog');
    expect(dialog.getAttribute('dir')).toBe('rtl');
    // de-DE weeks start on Monday: the first column header is "M" (Montag).
    expect(dialog.querySelector('thead th')?.textContent).toBe('M');
  });

  it('SSR without a locale prop renders the fallback locale and hydrates without mismatch', async () => {
    const ui = (
      <div lang="de-DE">
        <DatePicker label="Datum" defaultValue={new CalendarDate(2026, 10, 15)} />
      </div>
    );
    const server = renderAgServer(ui);
    // en-US segment order on the server (month first): the DOM is unreadable there.
    expect(server.html.indexOf('data-type="month"')).toBeLessThan(server.html.indexOf('data-type="day"'));
    const { warnings } = await server.hydrate();
    expect(warnings.filter((w) => /hydrat|did not match|mismatch/i.test(w))).toEqual([]);
  });

  it('an explicit locale prop wins over the DOM and renders on the server', () => {
    const server = renderAgServer(
      <div lang="en-US">
        <DatePicker label="Datum" locale="de-DE" defaultValue={new CalendarDate(2026, 10, 15)} />
      </div>,
    );
    expect(server.html.indexOf('data-type="day"')).toBeLessThan(server.html.indexOf('data-type="month"'));
  });
});
