import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleGroup } from './index';

const Items = () => (
  <>
    <ToggleGroup.Item value="b">Bold</ToggleGroup.Item>
    <ToggleGroup.Item value="i">Italic</ToggleGroup.Item>
    <ToggleGroup.Item value="u">Underline</ToggleGroup.Item>
  </>
);

describe('ToggleGroup', () => {
  it('renders group with items', () => {
    render(
      <ToggleGroup.Root>
        <Items />
      </ToggleGroup.Root>,
    );
    expect(document.querySelector('[data-ag-part="root"]')).not.toBeNull();
    expect(document.querySelectorAll('[data-ag-part="item"]')).toHaveLength(3);
  });

  it('single-select (multiple=false): selecting one deselects others; last may deselect', () => {
    render(
      <ToggleGroup.Root defaultValue={['b']}>
        <Items />
      </ToggleGroup.Root>,
    );
    const b = screen.getByRole('button', { name: 'Bold' });
    const i = screen.getByRole('button', { name: 'Italic' });
    expect(b).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(i);
    expect(i).toHaveAttribute('aria-pressed', 'true');
    expect(b).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(i);
    expect(i).toHaveAttribute('aria-pressed', 'false');
  });

  it('multiple allows several pressed', () => {
    render(
      <ToggleGroup.Root multiple>
        <Items />
      </ToggleGroup.Root>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('onValueChange receives string[] with details', () => {
    const onValueChange = jest.fn();
    render(
      <ToggleGroup.Root onValueChange={onValueChange}>
        <Items />
      </ToggleGroup.Root>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Bold' }));
    expect(onValueChange).toHaveBeenCalledWith(['b'], expect.anything());
  });
});
