/** @jest-environment jsdom */
// SURF-216 / REQ-SURF-99: RA-aligned prop pairs across the date family.
// Every case asserts behaviour; the inner Calendar of a picker is driven by
// RAC context only, so one selection fires onValueChange exactly once.
import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { CalendarDate, CalendarDateTime, Time } from '@internationalized/date';
import { renderAg } from '../../tests/helpers';
import { DateField } from './DateField';
import { Calendar } from './Calendar';
import { DatePicker } from './DatePicker';
import { DateRangePicker } from './DateRangePicker';
import { TimeField, TimePicker } from './TimePicker';

const segments = (root: ParentNode, sel = '[role="spinbutton"]') =>
  [...root.querySelectorAll<HTMLElement>(sel)];
const segment = (root: ParentNode, type: string) =>
  root.querySelector<HTMLElement>(`[role="spinbutton"][data-type="${type}"]`);

function formValue(form: HTMLFormElement, name: string) {
  return new FormData(form).get(name);
}

describe('date props (REQ-SURF-99)', () => {
  it('DateField: controlled value is displayed in the segments', () => {
    const { container } = render(<DateField label="D" value={new CalendarDate(2026, 10, 7)} onValueChange={() => {}} />);
    expect(segment(container, 'month')?.getAttribute('aria-valuenow')).toBe('10');
    expect(segment(container, 'day')?.getAttribute('aria-valuenow')).toBe('7');
    expect(segment(container, 'year')?.getAttribute('aria-valuenow')).toBe('2026');
  });

  it('DateField: ArrowUp on a segment fires onValueChange exactly once with the next value', () => {
    const on = jest.fn();
    const { container } = render(<DateField label="D" defaultValue={new CalendarDate(2026, 10, 7)} onValueChange={on} />);
    const day = segment(container, 'day')!;
    act(() => day.focus());
    fireEvent.keyDown(day, { key: 'ArrowUp' });
    expect(on).toHaveBeenCalledTimes(1);
    expect(String(on.mock.calls[0]?.[0])).toBe('2026-10-08');
  });

  it('DateField: name submits the ISO value inside a <form>', () => {
    const { container } = render(
      <form>
        <DateField label="D" name="due" defaultValue={new CalendarDate(2026, 10, 7)} />
      </form>,
    );
    expect(formValue(container.querySelector('form')!, 'due')).toBe('2026-10-07');
  });

  it('DateField: granularity minute renders hour and minute segments', () => {
    const { container } = render(
      <DateField label="D" granularity="minute" defaultValue={new CalendarDateTime(2026, 10, 7, 9, 30)} />,
    );
    expect(segment(container, 'hour')).not.toBeNull();
    expect(segment(container, 'minute')).not.toBeNull();
    expect(segment(container, 'second')).toBeNull();
  });

  it('DateField: isReadOnly / isRequired / isInvalid reach every segment', () => {
    const { container } = render(
      <DateField label="D" isReadOnly isRequired isInvalid defaultValue={new CalendarDate(2026, 10, 7)} />,
    );
    const segs = segments(container);
    expect(segs).toHaveLength(3);
    for (const s of segs) {
      expect(s.getAttribute('aria-readonly')).toBe('true');
      expect(s.getAttribute('aria-required')).toBe('true');
      expect(s.getAttribute('aria-invalid')).toBe('true');
    }
  });

  it('TimeField: hourCycle 24 renders no AM/PM segment; isDisabled marks segments', () => {
    const { container } = render(<TimeField label="T" hourCycle={24} isDisabled defaultValue={new Time(14, 30)} />);
    expect(segment(container, 'dayPeriod')).toBeNull();
    expect(segment(container, 'hour')?.getAttribute('aria-valuenow')).toBe('14');
    for (const s of segments(container)) expect(s.getAttribute('aria-disabled')).toBe('true');
  });

  it('TimeField: hourCycle 12 renders the AM/PM segment', () => {
    const { container } = render(<TimeField label="T" hourCycle={12} defaultValue={new Time(14, 30)} />);
    expect(segment(container, 'dayPeriod')).not.toBeNull();
  });

  it('TimeField: name submits the ISO time', () => {
    const { container } = render(
      <form>
        <TimeField label="T" name="at" defaultValue={new Time(9, 30)} />
      </form>,
    );
    expect(formValue(container.querySelector('form')!, 'at')).toBe('09:30:00');
  });

  it('Calendar: minValue / maxValue / isDateUnavailable mark cells', () => {
    const { container } = render(
      <Calendar
        aria-label="Cal"
        defaultValue={new CalendarDate(2026, 10, 15)}
        minValue={new CalendarDate(2026, 10, 5)}
        maxValue={new CalendarDate(2026, 10, 25)}
        isDateUnavailable={(d) => d.day === 13}
      />,
    );
    const cell = (day: number) =>
      [...container.querySelectorAll<HTMLElement>('.ag-calendar__cell')].find(
        (c) => c.textContent === String(day) && !c.hasAttribute('data-outside-month'),
      )!;
    expect(cell(4).getAttribute('aria-disabled')).toBe('true');
    expect(cell(26).getAttribute('aria-disabled')).toBe('true');
    expect(cell(13).hasAttribute('data-unavailable')).toBe(true);
    expect(cell(13).getAttribute('aria-disabled')).toBe('true');
    expect(cell(14).getAttribute('aria-disabled')).toBeNull();
  });

  it('DatePicker: selecting a date calls onValueChange exactly once', async () => {
    const on = jest.fn();
    const user = userEvent.setup();
    renderAg(<DatePicker label="Due" defaultValue={new CalendarDate(2026, 10, 15)} onValueChange={on} />);
    await user.click(screen.getByRole('button', { name: 'Choose date' }));
    await user.click(await screen.findByRole('button', { name: /October 20, 2026/ }));
    expect(on).toHaveBeenCalledTimes(1);
    expect(String(on.mock.calls[0]?.[0])).toBe('2026-10-20');
  });

  it('DatePicker: controlled value is displayed and name submits ISO', () => {
    const { container } = renderAg(
      <form>
        <DatePicker label="Due" name="due" value={new CalendarDate(2026, 3, 9)} onValueChange={() => {}} />
      </form>,
    );
    expect(segment(container, 'month')?.getAttribute('aria-valuenow')).toBe('3');
    expect(segment(container, 'day')?.getAttribute('aria-valuenow')).toBe('9');
    expect(formValue(container.querySelector('form')!, 'due')).toBe('2026-03-09');
  });

  it('DatePicker: isDisabled disables the trigger and segments', () => {
    const { container } = renderAg(<DatePicker label="Due" isDisabled defaultValue={new CalendarDate(2026, 3, 9)} />);
    expect(screen.getByRole('button', { name: 'Choose date' }).hasAttribute('disabled')).toBe(true);
    for (const s of segments(container)) expect(s.getAttribute('aria-disabled')).toBe('true');
  });

  it('DateRangePicker: one commit fires onValueChange exactly once; name submits both ISO ends', async () => {
    const on = jest.fn();
    const user = userEvent.setup();
    const { container } = renderAg(
      <form>
        <DateRangePicker
          label="Range"
          name="span"
          visibleMonths={1}
          defaultValue={{ start: new CalendarDate(2026, 10, 1), end: new CalendarDate(2026, 10, 3) }}
          onValueChange={on}
        />
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Choose dates' }));
    await user.click(await screen.findByRole('button', { name: /October 12, 2026/ }));
    await user.click(screen.getByRole('button', { name: /October 14, 2026/ }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(on).toHaveBeenCalledTimes(1);
    const form = container.querySelector('form')!;
    await waitFor(() => expect(formValue(form, 'span-start')).toBe('2026-10-12'));
    expect(formValue(form, 'span-end')).toBe('2026-10-14');
  });

  it('TimePicker: picking an hour fires onValueChange exactly once', async () => {
    const on = jest.fn();
    const user = userEvent.setup();
    renderAg(<TimePicker label="At" hourCycle={24} defaultValue={new Time(9, 30)} onValueChange={on} />);
    await user.click(screen.getByRole('button', { name: 'Choose time' }));
    await user.click(await screen.findByRole('option', { name: '14' }));
    expect(on).toHaveBeenCalledTimes(1);
    expect(String(on.mock.calls[0]?.[0])).toBe('14:30:00');
  });
});
