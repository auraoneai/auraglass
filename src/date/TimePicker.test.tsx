/** @jest-environment jsdom */
// REQ-SURF-104: TimePicker — one controllable value shared by the segments and
// the listbox columns, selectedKeys, AM/PM column for hourCycle 12, CMP
// Popover (LayerStack) with Escape focus return, exact minuteStep counts.
import { describe, expect, it, jest } from '@jest/globals';
import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Time } from '@internationalized/date';
import { renderAg } from '../../tests/helpers';
import { TimePicker } from './TimePicker';

const fieldText = (root: ParentNode) => root.querySelector('[data-ag-part="time-input"]')?.textContent ?? '';
const seg = (root: ParentNode, type: string) =>
  root.querySelector<HTMLElement>(`[data-ag-part="time-input"] [role="spinbutton"][data-type="${type}"]`)!;

async function open(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Choose time' }));
  return screen.findByRole('dialog');
}

describe('TimePicker (REQ-SURF-104)', () => {
  it.each([
    [1, 60],
    [5, 12],
    [10, 6],
    [15, 4],
    [30, 2],
  ] as const)('minuteStep %i renders exactly %i minute options', async (step, count) => {
    const user = userEvent.setup();
    renderAg(<TimePicker label="At" minuteStep={step} hourCycle={24} />);
    const dialog = await open(user);
    expect(dialog.querySelectorAll('[data-ag-part="time-picker-minutes"] [role="option"]')).toHaveLength(count);
    expect(dialog.querySelectorAll('[data-ag-part="time-picker-hours"] [role="option"]')).toHaveLength(24);
  });

  it('uncontrolled defaultValue 09:30: clicking hour 14 updates the field', async () => {
    const user = userEvent.setup();
    const { container } = renderAg(<TimePicker label="At" hourCycle={24} defaultValue={new Time(9, 30)} />);
    expect(fieldText(container)).toContain('09');
    await open(user);
    await user.click(screen.getByRole('option', { name: '14' }));
    expect(fieldText(container)).toContain('14');
    expect(seg(container, 'minute').getAttribute('aria-valuenow')).toBe('30');
  });

  it('selected options carry aria-selected and follow typed segment changes', async () => {
    const user = userEvent.setup();
    const { container } = renderAg(<TimePicker label="At" hourCycle={24} minuteStep={15} defaultValue={new Time(9, 30)} />);
    const dialog = await open(user);
    const selected = (col: string) =>
      [...dialog.querySelectorAll(`[data-ag-part="time-picker-${col}"] [role="option"][aria-selected="true"]`)].map((o) => o.textContent);
    expect(selected('hours')).toEqual(['09']);
    expect(selected('minutes')).toEqual(['30']);
    await user.click(screen.getByRole('option', { name: '45' }));
    expect(selected('minutes')).toEqual(['45']);
    expect(seg(container, 'minute').getAttribute('aria-valuenow')).toBe('45');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    act(() => seg(container, 'hour').focus());
    await user.keyboard('{ArrowUp}');
    const reopened = await open(user);
    expect(
      [...reopened.querySelectorAll('[data-ag-part="time-picker-hours"] [aria-selected="true"]')].map((o) => o.textContent),
    ).toEqual(['10']);
  });

  it('hourCycle 12 adds an AM/PM column with hours 1–12', async () => {
    const on = jest.fn();
    const user = userEvent.setup();
    const { container } = renderAg(<TimePicker label="At" hourCycle={12} defaultValue={new Time(9, 30)} onValueChange={on} />);
    const dialog = await open(user);
    const hours = [...dialog.querySelectorAll('[data-ag-part="time-picker-hours"] [role="option"]')].map((o) => o.textContent);
    expect(hours).toEqual(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']);
    const period = dialog.querySelector('[data-ag-part="time-picker-periods"]')!;
    expect([...period.querySelectorAll('[role="option"]')].map((o) => o.textContent)).toEqual(['AM', 'PM']);
    expect(period.querySelector('[aria-selected="true"]')?.textContent).toBe('AM');
    await user.click(screen.getByRole('option', { name: 'PM' }));
    expect(String(on.mock.calls.at(-1)?.[0])).toBe('21:30:00');
    expect(seg(container, 'dayPeriod').textContent).toBe('PM');
    await user.click(screen.getByRole('option', { name: '12' }));
    expect(String(on.mock.calls.at(-1)?.[0])).toBe('12:30:00');
  });

  it('controlled: picks report through onValueChange; the field shows the parent value', async () => {
    const on = jest.fn();
    const user = userEvent.setup();
    const { container } = renderAg(<TimePicker label="At" hourCycle={24} value={new Time(9, 30)} onValueChange={on} />);
    await open(user);
    await user.click(screen.getByRole('option', { name: '14' }));
    expect(on).toHaveBeenCalledTimes(1);
    expect(fieldText(container)).toContain('09'); // parent did not update
  });

  it('popup is a CMP Popover layer; Escape returns focus to the CMP Button trigger', async () => {
    const user = userEvent.setup();
    renderAg(<TimePicker label="At" hourCycle={24} defaultValue={new Time(9, 30)} />);
    const trigger = screen.getByRole('button', { name: 'Choose time' });
    expect(trigger.classList.contains('ag-button')).toBe(true);
    const dialog = await open(user);
    expect(dialog.getAttribute('data-ag-overlay')).toBe('popover');
    expect(dialog.getAttribute('aria-labelledby')).toBe(screen.getByText('At').id);
    await waitFor(() => expect(document.activeElement?.textContent).toBe('09'));
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });
});
