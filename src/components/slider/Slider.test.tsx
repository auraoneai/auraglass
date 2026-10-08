import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Slider } from './index';

beforeAll(() => {
  if (typeof window.PointerEvent !== 'function') {
    (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
  }
});

describe('Slider (CMP-152)', () => {
  it('renders slider role with min/max/step and emits parts', () => {
    const { container } = render(
      <Slider.Root aria-label="vol" defaultValue={30} min={0} max={100} marks={[{ value: 0, label: '0' }, { value: 100, label: '100' }]} />,
    );
    const slider = screen.getByRole('slider', { name: 'vol' });
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '100');
    for (const p of ['root', 'control', 'track', 'range', 'thumb', 'mark', 'mark-label']) {
      expect(container.querySelector(`[data-ag-part="${p}"]`)).toBeTruthy();
    }
  });

  it('keyboard ArrowRight increments by step and fires onValueChange', async () => {
    const spy = jest.fn();
    render(<Slider.Root aria-label="v" defaultValue={10} step={5} onValueChange={spy} />);
    screen.getByRole('slider', { name: 'v' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(spy).toHaveBeenCalledWith(15, expect.objectContaining({ reason: expect.any(String) }));
  });

  it('onValueCommitted fires on keyup/commit', async () => {
    const commit = jest.fn();
    render(<Slider.Root aria-label="v" defaultValue={10} onValueCommitted={commit} />);
    const thumb = screen.getByRole('slider', { name: 'v' });
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowRight}');
    expect(commit).toHaveBeenCalled();
  });

  it('range value renders two thumbs', () => {
    render(<Slider.Root aria-label="r" defaultValue={[20, 80]} />);
    expect(screen.getAllByRole('slider')).toHaveLength(2);
  });
});
