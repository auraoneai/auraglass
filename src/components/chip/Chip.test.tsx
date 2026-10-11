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
  it('renders no close part unless onRemove is given', () => {
    const { container } = render(<Chip>Plain</Chip>);
    expect(container.querySelector('[data-ag-part="close"]')).toBeNull();
  });
  it('removable: close part named "Remove {label}" calls onRemove', () => {
    const removed: string[] = [];
    const { container } = render(<Chip onRemove={() => removed.push('Tag')}>Tag</Chip>);
    const close = screen.getByRole('button', { name: 'Remove Tag' });
    expect(close).toBe(container.querySelector('[data-ag-part="close"]'));
    fireEvent.click(close);
    expect(removed).toEqual(['Tag']);
  });
  it('removable: removeLabel and messages override the name; disabled disables close', () => {
    render(
      <Chip disabled removeLabel="Apple" messages={{ removeItem: 'Entfernen {label}' }} onRemove={() => {}}>
        <i>Apple</i>
      </Chip>,
    );
    expect(screen.getByRole('button', { name: 'Entfernen Apple' })).toBeDisabled();
  });
  it('removing moves focus to the next chip, or the previous one when last', () => {
    function List() {
      const [items, setItems] = React.useState(['A', 'B', 'C']);
      return (
        <div>
          {items.map((n) => (
            <Chip key={n} onRemove={() => setItems((cur) => cur.filter((c) => c !== n))}>
              {n}
            </Chip>
          ))}
        </div>
      );
    }
    render(<List />);
    fireEvent.click(screen.getByRole('button', { name: 'Remove B' }));
    expect(screen.queryByRole('button', { name: 'B' })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'C' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove C' }));
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'A' }));
  });
});
