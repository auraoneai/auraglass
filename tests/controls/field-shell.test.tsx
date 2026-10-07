/** Family cases (PRD §FND-139 field-shell): every registered control family mounts and emits its parts. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { CONTROL_FAMILIES } from './families';

describe('control families (field-shell)', () => {
  it('registry is non-empty', () => {
    expect(CONTROL_FAMILIES.length).toBeGreaterThan(0);
  });

  it.each(CONTROL_FAMILIES.map((f) => [f.family, f] as const))('%s fixture mounts with a root part', (_family, { fixture: Fixture }) => {
    const { container } = render(<Fixture />);
    expect(container.querySelector('[data-ag-part="root"]')).not.toBeNull();
  });

  it('button family: three buttons incl. one prominent-safe identity and one danger', () => {
    render(
      React.createElement(CONTROL_FAMILIES.find((f) => f.family === 'button')!.fixture),
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
    expect(buttons.map((b) => b.getAttribute('data-ag-variant'))).toEqual([
      'regular',
      'identity',
      'regular',
    ]);
    expect(buttons[2]!.getAttribute('data-ag-intent')).toBe('danger');
  });
});
