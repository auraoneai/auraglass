/* REQ-CMP-57: date fields expose aria-describedby in description-then-error
   order (RAC-owned slots — see CONTRACT-AMENDMENT.md). */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { DateField } from './DateField';
import { TimePicker } from './TimePicker';

function describedByOrder(input: HTMLElement, root: HTMLElement) {
  const ids = (input.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
  const texts = ids.map((id) => root.querySelector(`#${CSS.escape(id)}`)?.textContent ?? '');
  return texts;
}

describe('date field describedby order (REQ-CMP-57)', () => {
  it('DateField: description id precedes error id', () => {
    const { container } = render(
      <DateField label="When" description="Pick a date" errorMessage="Required" isInvalid />,
    );
    const input = container.querySelector('input, [role="spinbutton"], [data-slot]') as HTMLElement;
    expect(input).not.toBeNull();
    const texts = describedByOrder(input, container);
    const dIdx = texts.findIndex((t) => /Pick a date/.test(t));
    const eIdx = texts.findIndex((t) => /Required/.test(t));
    expect(dIdx).toBeGreaterThanOrEqual(0);
    expect(eIdx).toBeGreaterThan(dIdx);
  });

  it('TimePicker: description id precedes error id', () => {
    const { container } = render(
      <TimePicker label="T" description="Pick a time" errorMessage="Bad" isInvalid />,
    );
    const input = container.querySelector('input, [role="spinbutton"], [data-slot]') as HTMLElement;
    expect(input).not.toBeNull();
    const texts = describedByOrder(input, container);
    const dIdx = texts.findIndex((t) => /Pick a time/.test(t));
    const eIdx = texts.findIndex((t) => /Bad/.test(t));
    expect(dIdx).toBeGreaterThanOrEqual(0);
    expect(eIdx).toBeGreaterThan(dIdx);
  });
});
