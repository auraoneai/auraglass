import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Chip } from './index';

describe('Chip', () => {
  it('toggles pressed on click and reports (pressed, details)', () => {
    const seen: boolean[] = [];
    render(<Chip onPressedChange={(p) => seen.push(p)}>Filter</Chip>);
    const btn = screen.getByRole('button', { name: 'Filter' });
    expect(btn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-pressed', 'true');
    expect(seen).toEqual([true]);
  });
  it('honours controlled pressed', () => {
    render(<Chip pressed>On</Chip>);
    expect(screen.getByRole('button', { name: 'On' })).toHaveAttribute('aria-pressed', 'true');
  });
  it('renders icon slots and label part', () => {
    const { container } = render(
      <Chip leadingIcon={<i data-testid="l" />} trailingIcon={<i data-testid="t" />}>
        Tag
      </Chip>,
    );
    expect(container.querySelector('[data-ag-part="leading-icon"]')).toContainElement(screen.getByTestId('l'));
    expect(container.querySelector('[data-ag-part="trailing-icon"]')).toContainElement(screen.getByTestId('t'));
    expect(screen.getByText('Tag').getAttribute('data-ag-part')).toBe('label');
  });
  it('disables via Base UI', () => {
    render(<Chip disabled>Nope</Chip>);
    expect(screen.getByRole('button', { name: 'Nope' })).toBeDisabled();
  });
});
