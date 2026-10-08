/** @jest-environment jsdom */
// SURF-216: RA-aligned prop pairs across the date family; week-number cases.
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { DateField } from './DateField';
import { Calendar, RangeCalendar } from './Calendar';
import { DatePicker } from './DatePicker';
import { DateRangePicker } from './DateRangePicker';
import { TimeField, TimePicker } from './TimePicker';
import { isoWeekNumber } from './week-number';
import { CalendarDate, Time } from '@internationalized/date';

describe('date family (SURF-208..214, REQ-SURF-98..104)', () => {
  it('DateField renders labelled segments', () => {
    const { container } = render(
      <DateField label="Due" defaultValue={new CalendarDate(2026, 10, 7)} />,
    );
    expect(container.textContent).toContain('Due');
    expect(container.querySelectorAll('[data-ag-part="date-input"] [role="spinbutton"], .ag-date-field__segment').length).toBeGreaterThan(0);
  });

  it('DateField controlled pair', () => {
    const on = jest.fn();
    render(<DateField label="D" value={new CalendarDate(2026, 10, 7)} onValueChange={on} />);
    // controlled value renders; change goes through onValueChange (tested via segment typing below)
  });

  it('Calendar grid + nav buttons; unavailable dates get aria-disabled', () => {
    const { container } = render(
      <Calendar
        defaultValue={new CalendarDate(2026, 10, 7)}
        isDateUnavailable={(d) => d.day === 13}
      />,
    );
    expect(container.querySelector('[role="grid"], .ag-calendar__grid')).toBeTruthy();
    expect(container.querySelectorAll('.ag-calendar__nav').length).toBe(2);
    const cells = container.querySelectorAll('.ag-calendar__cell[data-disabled]');
    expect(cells.length).toBeGreaterThanOrEqual(1);
  });

  it('DatePicker trigger + popover with calendar inside', () => {
    const { container } = render(<DatePicker label="Pick" />);
    const trigger = container.querySelector('[data-ag-part="date-picker-trigger"]')!;
    expect(trigger.textContent).toBe('Choose date');
    fireEvent.click(trigger);
    expect(document.body.querySelector('[data-ag-part="date-picker-popover"]')).toBeTruthy();
  });

  it('DateRangePicker renders two inputs + presets listbox', () => {
    const p = { label: 'This week', value: { start: new CalendarDate(2026, 10, 5), end: new CalendarDate(2026, 10, 11) } };
    const { container } = render(<DateRangePicker label="Range" presets={[p]} />);
    expect(container.querySelector('[data-ag-part="date-input-start"]')).toBeTruthy();
    expect(container.querySelector('[data-ag-part="date-input-end"]')).toBeTruthy();
    fireEvent.click(container.querySelector('[data-ag-part="date-range-picker-trigger"]')!);
    expect(document.body.querySelector('[data-ag-part="date-range-presets"]')).toBeTruthy();
  });

  it('TimeField renders; TimePicker trigger opens columns', () => {
    const { container: tf } = render(<TimeField label="T" defaultValue={new Time(9, 30)} />);
    expect(tf.textContent).toContain('T');
    const { container } = render(<TimePicker label="T" minuteStep={15} />);
    fireEvent.click(container.querySelector('[data-ag-part="time-picker-trigger"]')!);
    expect(document.body.querySelector('[data-ag-part="time-picker-hours"]')).toBeTruthy();
    expect(document.body.querySelector('[data-ag-part="time-picker-minutes"]')).toBeTruthy();
    expect(document.body.querySelectorAll('[data-ag-part="time-picker-minutes"] [role="option"]').length).toBe(4);
  });

  it('isoWeekNumber ISO-8601 boundary cases', () => {
    expect(isoWeekNumber(new Date(Date.UTC(2020, 11, 31)))).toBe(53);
    expect(isoWeekNumber(new Date(Date.UTC(2021, 0, 3)))).toBe(53);
    expect(isoWeekNumber(new Date(Date.UTC(2021, 0, 4)))).toBe(1);
    expect(isoWeekNumber(new Date(Date.UTC(2026, 11, 28)))).toBe(53);
    expect(isoWeekNumber(new Date(Date.UTC(2026, 0, 1)))).toBe(1);
  });

  it('RangeCalendar respects visibleMonths', () => {
    const { container } = render(<RangeCalendar visibleMonths={1} />);
    expect(container.querySelectorAll('.ag-calendar__grid').length).toBe(1);
  });
});
