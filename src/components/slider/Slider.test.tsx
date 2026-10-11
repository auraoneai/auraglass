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

describe('REQ-CMP-48 slider parts', () => {
  it('getAriaValueText lands on each thumb as aria-valuetext', () => {
    render(
      <Slider.Root
        aria-label="level"
        defaultValue={[20, 80]}
        getAriaValueText={(v) => `${v} points`}
      />,
    );
    const texts = screen.getAllByRole('slider').map((el) => el.getAttribute('aria-valuetext'));
    expect(texts).toEqual(['20 points', '80 points']);
  });

  it('range thumbs respect minStepsBetweenValues', async () => {
    render(
      <Slider.Root
        aria-label="band"
        defaultValue={[30, 60]}
        step={10}
        minStepsBetweenValues={2}
      />,
    );
    const [a, b] = screen.getAllByRole('slider');
    a.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}'); /* +30 would collide */
    expect(Number(a.getAttribute('aria-valuenow'))).toBeLessThanOrEqual(40);
    expect(Number(b.getAttribute('aria-valuenow'))).toBe(60);
  });

  it('marks emit mark + mark-label parts; root emits data-orientation', () => {
    const { container } = render(
      <Slider.Root aria-label="m" defaultValue={50} orientation="vertical" marks={[{ value: 0, label: 'min' }, { value: 100, label: 'max' }]} />,
    );
    expect(container.querySelector('[data-ag-part="root"]')?.getAttribute('data-orientation')).toBe('vertical');
    expect(container.querySelectorAll('[data-ag-part="mark"]').length).toBe(2);
    expect(container.querySelectorAll('[data-ag-part="mark-label"]').length).toBe(2);
  });

  it('exported parts compose a custom layout', () => {
    const { container } = render(
      <Slider.Root aria-label="x" defaultValue={10}>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb aria-label="x" />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );
    for (const part of ['control', 'track', 'range', 'thumb']) {
      expect(container.querySelector(`[data-ag-part="${part}"]`)).not.toBeNull();
    }
  });
});
