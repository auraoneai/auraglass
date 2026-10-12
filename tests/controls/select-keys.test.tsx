/* REQ-CMP-66: Select keyboard (select-only combobox). Base UI drives the
   keys; these jsdom cases prove the CMP wrapper keeps them: Home/End bound
   the highlight, Space selects and closes, and Tab while the listbox is open
   closes it and moves focus to the next control. Opening keys and typeahead
   are covered in src/components/select/Select.test.tsx; the in-browser legs
   live in tests/a11y/apg/cmp/select.apg.spec.ts. */
import { beforeAll, describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../../src/components/select';

const ITEMS = { a: 'Alpha', b: 'Beta', c: 'Gamma' };

function Demo() {
  return (
    <>
      <Select.Root items={ITEMS}>
        <Select.Trigger aria-label="Letter" />
        <Select.Content>
          {Object.entries(ITEMS).map(([value, label]) => (
            <Select.Item key={value} value={value} label={label} />
          ))}
        </Select.Content>
      </Select.Root>
      <button type="button">next</button>
    </>
  );
}

const option = (label: string) =>
  Array.from(document.querySelectorAll<HTMLElement>('[role="option"]')).find((el) => el.textContent === label)!;
const listbox = () => document.querySelector('[role="listbox"]');
/* Closed = the trigger reports aria-expanded=false and the popup is no longer
   open (jsdom keeps the popup mounted for Base UI's exit transition). */
const expectClosed = (trigger: HTMLElement) => {
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(document.querySelector('[data-ag-part="popup"][data-state="open"]')).toBeNull();
};

async function openWithArrowDown() {
  render(<Demo />);
  const trigger = screen.getByRole('combobox');
  trigger.focus();
  await userEvent.keyboard('{ArrowDown}');
  await act(async () => {});
  expect(listbox()).toBeTruthy();
  return trigger;
}

describe('Select keys (REQ-CMP-66)', () => {
  beforeAll(() => {
    if (window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
  });

  it('End highlights the last option, Home the first', async () => {
    await openWithArrowDown();
    await userEvent.keyboard('{End}');
    await act(async () => {});
    expect(option('Gamma')).toHaveAttribute('data-highlighted');
    await userEvent.keyboard('{Home}');
    await act(async () => {});
    expect(option('Alpha')).toHaveAttribute('data-highlighted');
    expect(option('Gamma')).not.toHaveAttribute('data-highlighted');
  });

  it('Space selects the highlighted option and closes', async () => {
    const trigger = await openWithArrowDown();
    await userEvent.keyboard('{End}');
    await act(async () => {});
    await userEvent.keyboard('{ }');
    await waitFor(() => expectClosed(trigger));
    expect(trigger).toHaveTextContent('Gamma');
  });

  it('Tab while open closes the listbox and moves focus to the next control', async () => {
    const trigger = await openWithArrowDown();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.tab();
    await waitFor(() => expectClosed(trigger));
    expect(document.activeElement).toBe(screen.getByText('next'));
  });
});
