/** @jest-environment jsdom */
// REQ-SURF-100 / REQ-SURF-103: Calendar week numbers — exactly one
// <th role=rowheader scope=row> plus 7 gridcells per week row, the row count
// matches the month, ISO numbers from each row's Thursday; RangeCalendar
// renders one grid per visible month.
import { describe, expect, it } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { CalendarDate, getWeeksInMonth } from '@internationalized/date';
import { Calendar, RangeCalendar } from './Calendar';

const rows = (root: ParentNode) => [...root.querySelectorAll('[role="grid"] tbody tr')];

describe('Calendar week numbers (REQ-SURF-100/103)', () => {
  it.each([
    ['en-US', new CalendarDate(2026, 10, 7)],
    ['en-US', new CalendarDate(2026, 8, 1)],
    ['de-DE', new CalendarDate(2021, 1, 4)],
    ['de-DE', new CalendarDate(2026, 2, 1)],
  ] as const)('%s %s: each row has exactly 1 rowheader + 7 gridcells', (locale, date) => {
    const { container } = render(<Calendar aria-label="Cal" locale={locale} defaultValue={date} showWeekNumbers />);
    const weekRows = rows(container);
    expect(weekRows).toHaveLength(getWeeksInMonth(date, locale));
    for (const tr of weekRows) {
      expect(tr.querySelectorAll('[role="rowheader"]')).toHaveLength(1);
      expect(tr.querySelectorAll('[role="gridcell"]')).toHaveLength(7);
      const th = tr.firstElementChild!;
      expect(th.tagName).toBe('TH');
      expect(th.getAttribute('scope')).toBe('row');
    }
    expect(container.querySelectorAll('[role="rowheader"]')).toHaveLength(weekRows.length);
    // Header: one leading week column + 7 weekdays.
    expect(container.querySelectorAll('[role="grid"] thead th')).toHaveLength(8);
  });

  it('without showWeekNumbers there are no rowheaders and 7 header cells', () => {
    const { container } = render(<Calendar aria-label="Cal" defaultValue={new CalendarDate(2026, 10, 7)} />);
    expect(container.querySelectorAll('[role="rowheader"]')).toHaveLength(0);
    expect(container.querySelectorAll('[role="grid"] thead th')).toHaveLength(7);
  });

  it('de-DE (Monday-first) January 2021: first row is W53, the row of Jan 4 is W1', () => {
    const { container } = render(
      <Calendar aria-label="Cal" locale="de-DE" defaultValue={new CalendarDate(2021, 1, 4)} showWeekNumbers />,
    );
    const headers = [...container.querySelectorAll('[role="rowheader"]')].map((th) => th.textContent);
    expect(headers.slice(0, 2)).toEqual(['53', '1']);
  });

  it('en-US (Sunday-first) rows take the ISO week of their Thursday', () => {
    // Oct 2026: the row Sun Oct 4 – Sat Oct 10 has Thursday Oct 8 → W41.
    const { container } = render(
      <Calendar aria-label="Cal" locale="en-US" defaultValue={new CalendarDate(2026, 10, 7)} showWeekNumbers />,
    );
    const row = rows(container).find((tr) => [...tr.querySelectorAll('.ag-calendar__cell')].some((c) => c.textContent === '8' && !c.hasAttribute('data-outside-month')))!;
    expect(row.querySelector('[role="rowheader"]')?.textContent).toBe('41');
    expect(row.querySelector('[role="rowheader"]')?.getAttribute('aria-label')).toBe('Week 41');
  });

  it('firstDayOfWeek="mon" moves the week start and keeps one rowheader per row', () => {
    const { container } = render(
      <Calendar aria-label="Cal" locale="en-US" firstDayOfWeek="mon" defaultValue={new CalendarDate(2026, 10, 7)} showWeekNumbers />,
    );
    const first = rows(container)[0]!;
    expect(first.querySelectorAll('[role="rowheader"]')).toHaveLength(1);
    expect(first.querySelector('[role="gridcell"] .ag-calendar__cell')?.textContent).toBe('28'); // Mon Sep 28
  });

  it('arrow keys still move the roving cell with week numbers on', () => {
    const { container } = render(
      <Calendar aria-label="Cal" defaultValue={new CalendarDate(2026, 10, 7)} showWeekNumbers />,
    );
    const focused = () => container.querySelector<HTMLElement>('.ag-calendar__cell[tabindex="0"]')!;
    expect(container.querySelectorAll('.ag-calendar__cell[tabindex="0"]')).toHaveLength(1);
    act(() => focused().focus());
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(document.activeElement?.getAttribute('aria-label')).toMatch(/October 14, 2026/);
  });

  it('Home / End move to the start / end of the focused week (APG), not the month', () => {
    const { container } = render(<Calendar aria-label="Cal" locale="en-US" defaultValue={new CalendarDate(2026, 10, 7)} />);
    act(() => container.querySelector<HTMLElement>('.ag-calendar__cell[tabindex="0"]')!.focus());
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(document.activeElement?.getAttribute('aria-label')).toMatch(/Sunday, October 4, 2026/);
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(document.activeElement?.getAttribute('aria-label')).toMatch(/Saturday, October 10, 2026/);
  });

  it('Home honours firstDayOfWeek', () => {
    const { container } = render(
      <Calendar aria-label="Cal" locale="en-US" firstDayOfWeek="mon" defaultValue={new CalendarDate(2026, 10, 7)} />,
    );
    act(() => container.querySelector<HTMLElement>('.ag-calendar__cell[tabindex="0"]')!.focus());
    fireEvent.keyDown(document.activeElement!, { key: 'Home' });
    expect(document.activeElement?.getAttribute('aria-label')).toMatch(/Monday, October 5, 2026/);
  });
});

describe('RangeCalendar months (REQ-SURF-102)', () => {
  it('visibleMonths=2 renders two consecutive month grids', () => {
    const { container } = render(
      <RangeCalendar aria-label="Range" visibleMonths={2} defaultValue={{ start: new CalendarDate(2026, 10, 5), end: new CalendarDate(2026, 10, 9) }} />,
    );
    const grids = [...container.querySelectorAll('.ag-calendar__grid')];
    expect(grids).toHaveLength(2);
    expect(grids[0]?.getAttribute('aria-label')).toMatch(/October 2026/);
    expect(grids[1]?.getAttribute('aria-label')).toMatch(/November 2026/);
  });

  it('visibleMonths=1 renders one grid', () => {
    const { container } = render(<RangeCalendar aria-label="Range" visibleMonths={1} />);
    expect(container.querySelectorAll('.ag-calendar__grid')).toHaveLength(1);
  });
});
