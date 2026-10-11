/** @jest-environment jsdom */
// REQ-SURF-193 (REQ-FIN-90): markup half of the SURF focus gate. Every
// keyboard-focusable part of the date family, Chart, TreeView and the
// ImageViewer popup carries data-ag-focusable, so the MAT focus ring
// (src/a11y/css/focus.css, :where([data-ag-focusable]):focus-visible) is the
// ring they paint. The computed ring is asserted in a real browser by
// tests/e2e/surf/focus.spec.ts.
import { describe, expect, it } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { CalendarDate, Time } from '@internationalized/date';
import { DateField } from '../../src/date/DateField';
import { Calendar } from '../../src/date/Calendar';
import { DatePicker } from '../../src/date/DatePicker';
import { DateRangePicker } from '../../src/date/DateRangePicker';
import { TimePicker } from '../../src/date/TimePicker';
import { Chart } from '../../src/charts/Chart';
import { TreeView } from '../../src/data/tree-view/TreeView';
import { ImageViewer } from '../../src/media/ImageViewer/ImageViewer';
import { AuraGlassProvider } from '../../src/theme';
import { PORTAL_ROOT_MARKUP } from '../../src/contracts/preferences';

// jsdom has no ResizeObserver — report a fixed box so ChartFrame renders its plot.
class RO {
  cb: ResizeObserverCallback;
  constructor(cb: ResizeObserverCallback) { this.cb = cb; }
  observe() { this.cb([{ contentRect: { width: 640, height: 240 } } as ResizeObserverEntry], this as unknown as ResizeObserver); }
  unobserve() {}
  disconnect() {}
}
(globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= RO;

/** Elements the keyboard can reach: tab stops (tabIndex >= 0) plus roving-tabindex
    items (grid cells, rows, options, spinbuttons) that arrow keys focus. */
const FOCUSABLE = 'a[href], button, input:not([type="hidden"]), select, textarea, [tabindex], [contenteditable]:not([contenteditable="false"])';
const ROVING = '[role="gridcell"] > *, [role="row"], [role="option"], [role="spinbutton"]';

function unmarked(root: ParentNode): string[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)]
    .filter((el) => el.tabIndex >= 0 || el.matches(ROVING))
    .filter((el) => !(el as HTMLButtonElement).disabled && !el.closest('[hidden], [aria-hidden="true"]'))
    .filter((el) => el.getAttribute('data-ag-focusable') !== '')
    .map((el) => `${el.tagName.toLowerCase()}${el.className ? `.${String(el.className).trim().split(/\s+/).join('.')}` : ''}`);
}

describe('SURF focusable parts carry data-ag-focusable (REQ-SURF-193)', () => {
  it('DateField segments', () => {
    const { container } = render(<DateField label="Due" defaultValue={new CalendarDate(2026, 10, 7)} />);
    expect(container.querySelectorAll('.ag-date-field__segment[data-ag-focusable=""]').length).toBeGreaterThanOrEqual(3);
    expect(unmarked(container)).toEqual([]);
  });

  it('Calendar nav buttons and every cell, including aria-disabled (unavailable) cells', () => {
    const { container } = render(
      <Calendar defaultValue={new CalendarDate(2026, 10, 7)} isDateUnavailable={(d) => d.day === 8} />,
    );
    expect(container.querySelectorAll('.ag-calendar__nav[data-ag-focusable=""]').length).toBe(2);
    const cells = [...container.querySelectorAll<HTMLElement>('.ag-calendar__cell')];
    expect(cells.length).toBeGreaterThanOrEqual(28);
    expect(cells.filter((c) => c.getAttribute('data-ag-focusable') !== '')).toEqual([]);
    const unavailable = cells.filter((c) => c.getAttribute('aria-disabled') === 'true' && c.textContent === '8');
    expect(unavailable.length).toBe(1);
    expect(unmarked(container)).toEqual([]);
  });

  it('DatePicker segments + trigger, and the open popover calendar', () => {
    const { container } = render(<DatePicker label="Due" defaultValue={new CalendarDate(2026, 10, 15)} />);
    const trigger = container.querySelector<HTMLElement>('[data-ag-part="date-picker-trigger"]')!;
    expect(trigger.getAttribute('data-ag-focusable')).toBe('');
    expect(unmarked(container)).toEqual([]);
    act(() => { fireEvent.click(trigger); });
    const dialog = document.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog!.querySelectorAll('.ag-calendar__cell').length).toBeGreaterThanOrEqual(28);
    expect(unmarked(dialog!)).toEqual([]);
  });

  it('DateRangePicker segments + trigger', () => {
    const { container } = render(<DateRangePicker label="Window" />);
    expect(container.querySelector('[data-ag-part="date-range-picker-trigger"]')?.getAttribute('data-ag-focusable')).toBe('');
    expect(unmarked(container)).toEqual([]);
  });

  it('TimePicker segments + trigger', () => {
    const { container } = render(<TimePicker label="Start" defaultValue={new Time(9, 30)} />);
    expect(container.querySelector('[data-ag-part="time-picker-trigger"]')?.getAttribute('data-ag-focusable')).toBe('');
    expect(unmarked(container)).toEqual([]);
  });

  it('Chart plot svg', () => {
    const { container } = render(
      <Chart
        title="Revenue"
        type="line"
        data={[{ m: 'Jan', a: 30 }, { m: 'Feb', a: 55 }]}
        series={[{ key: 'a', label: 'A' }]}
        x={{ key: 'm', label: 'Month' }}
      />,
    );
    const svg = container.querySelector('[data-ag-part="chart-plot-svg"]');
    expect(svg?.getAttribute('tabindex')).toBe('0');
    expect(svg?.getAttribute('data-ag-focusable')).toBe('');
  });

  it('TreeView rows', () => {
    type Node = { id: string; label: string; children?: Node[] };
    const data: Node[] = [{ id: 'src', label: 'src', children: [{ id: 'a', label: 'a.ts' }] }, { id: 'docs', label: 'docs' }];
    const { container } = render(
      <TreeView items={data} getKey={(n) => n.id} getTextValue={(n) => n.label} aria-label="Files" defaultExpandedKeys={['src']} />,
    );
    const rows = [...container.querySelectorAll('[data-ag-part="tree-item"]')];
    expect(rows.length).toBe(3);
    expect(rows.filter((r) => r.getAttribute('data-ag-focusable') !== '')).toEqual([]);
  });

  it('ImageViewer popup', () => {
    // Same portal seeding as src/media/__tests__/ImageViewer.test.tsx: the
    // provider's portal root lands after Popup's first lookup in jsdom.
    if (!document.body.querySelector('[data-ag-portal-root]')) document.body.insertAdjacentHTML('beforeend', PORTAL_ROOT_MARKUP);
    const { getByText, unmount } = render(
      <AuraGlassProvider>
        <ImageViewer.Root items={[{ id: 'one', src: '/img/1.jpg', alt: 'One' }]}>
          <ImageViewer.Trigger id="one">open one</ImageViewer.Trigger>
          <ImageViewer.Popup />
        </ImageViewer.Root>
      </AuraGlassProvider>,
    );
    fireEvent.click(getByText('open one'));
    const popup = document.querySelector('[data-ag-part="image-viewer-popup"]');
    expect(popup).not.toBeNull();
    expect(popup!.getAttribute('data-ag-focusable')).toBe('');
    unmount();
    document.body.querySelector('[data-ag-portal-root]')?.remove();
  });
});
