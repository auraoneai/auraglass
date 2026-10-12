import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Slider } from './index';
import { SliderControl } from './Slider.client';

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
    const [a, b] = screen.getAllByRole('slider') as [HTMLElement, HTMLElement];
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
        <SliderControl>
          <Slider.Track>
            <Slider.Range />
            <Slider.Thumb aria-label="x" />
          </Slider.Track>
        </SliderControl>
      </Slider.Root>,
    );
    for (const part of ['control', 'track', 'range', 'thumb']) {
      expect(container.querySelector(`[data-ag-part="${part}"]`)).not.toBeNull();
    }
  });
});

describe('REQ-CMP-50 APG keyboard (exact values)', () => {
  const setup = (props: Partial<React.ComponentProps<typeof Slider.Root>> = {}) => {
    render(<Slider.Root aria-label="k" defaultValue={50} min={0} max={100} step={2} largeStep={10} {...props} />);
    const thumb = screen.getByRole('slider', { name: 'k' });
    act(() => thumb.focus());
    return thumb;
  };
  const now = (el: HTMLElement) => Number(el.getAttribute('aria-valuenow'));

  it('Arrow ±step, Shift+Arrow ±largeStep', async () => {
    const thumb = setup();
    await userEvent.keyboard('{ArrowRight}');
    expect(now(thumb)).toBe(52);
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(now(thumb)).toBe(48);
    await userEvent.keyboard('{Shift>}{ArrowRight}{/Shift}');
    expect(now(thumb)).toBe(58);
    await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}');
    expect(now(thumb)).toBe(48);
  });

  it('PageUp/PageDown ±largeStep; Home → min, End → max', async () => {
    const thumb = setup();
    await userEvent.keyboard('{PageUp}');
    expect(now(thumb)).toBe(60);
    await userEvent.keyboard('{PageDown}{PageDown}');
    expect(now(thumb)).toBe(40);
    await userEvent.keyboard('{Home}');
    expect(now(thumb)).toBe(0);
    await userEvent.keyboard('{End}');
    expect(now(thumb)).toBe(100);
  });

  it('RTL (dir="rtl" ancestor) mirrors ArrowRight/ArrowLeft', async () => {
    render(
      <div dir="rtl">
        <Slider.Root aria-label="rtl" defaultValue={50} step={5} />
      </div>,
    );
    const thumb = screen.getByRole('slider', { name: 'rtl' });
    act(() => thumb.focus());
    await userEvent.keyboard('{ArrowRight}');
    expect(now(thumb)).toBe(45);
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(now(thumb)).toBe(55);
  });

  it('LTR without a dir ancestor: ArrowRight increments', async () => {
    const thumb = setup();
    await userEvent.keyboard('{ArrowRight}');
    expect(now(thumb)).toBe(52);
  });

  it('vertical slider sets aria-orientation="vertical"; ArrowUp increments', async () => {
    const thumb = setup({ orientation: 'vertical' });
    expect(thumb).toHaveAttribute('aria-orientation', 'vertical');
    await userEvent.keyboard('{ArrowUp}');
    expect(now(thumb)).toBe(52);
  });

  it('format produces aria-valuetext on the thumb', () => {
    render(<Slider.Root aria-label="pct" defaultValue={0.8} min={0} max={1} step={0.05} format={{ style: 'percent' }} locale="en-US" />);
    expect(screen.getByRole('slider', { name: 'pct' })).toHaveAttribute('aria-valuetext', '80%');
  });
});

describe('REQ-CMP-49 slider material', () => {
  it('track is a content-sunken content surface', () => {
    const { container } = render(<Slider.Root aria-label="m" defaultValue={10} />);
    const track = container.querySelector('[data-ag-part="track"]')!;
    expect(track).toHaveAttribute('data-ag-surface');
    expect(track).toHaveAttribute('data-ag-layer', 'content');
    expect(track).toHaveAttribute('data-ag-content', 'content-sunken');
  });

  it('exported Slider.Track part is content-sunken too', () => {
    const { container } = render(
      <Slider.Root aria-label="p" defaultValue={10}>
        <SliderControl>
          <Slider.Track>
            <Slider.Thumb aria-label="p" />
          </Slider.Track>
        </SliderControl>
      </Slider.Root>,
    );
    expect(container.querySelector('[data-ag-part="track"]')).toHaveAttribute('data-ag-content', 'content-sunken');
    const thumb = container.querySelector('[data-ag-part="thumb"]')!;
    expect(thumb).toHaveAttribute('data-ag-layer', 'transient');
    expect(thumb).not.toHaveAttribute('data-ag-allow-nested');
  });

  it('thumb is transient/thin and opaque at rest (no allow-nested outside a drag)', () => {
    const { container } = render(<Slider.Root aria-label="t" defaultValue={10} />);
    const thumb = container.querySelector('[data-ag-part="thumb"]')!;
    expect(thumb).toHaveAttribute('data-ag-layer', 'transient');
    expect(thumb).toHaveAttribute('data-ag-thickness', 'thin');
    expect(thumb).not.toHaveAttribute('data-ag-allow-nested');
    expect(container.querySelector('[data-dragging]')).toBeNull();
  });
});

describe('REQ-CMP-49 drag-only glass', () => {
  it('thumb gains data-ag-allow-nested (transient glass) only while dragging', () => {
    const { container } = render(<Slider.Root aria-label="d" defaultValue={10} />);
    const control = container.querySelector('[data-ag-part="control"]') as HTMLElement;
    const thumbEl = () => container.querySelector('[data-ag-part="thumb"]')!;
    control.getBoundingClientRect = () => ({ x: 0, y: 0, top: 0, left: 0, right: 200, bottom: 20, width: 200, height: 20, toJSON: () => ({}) });
    expect(thumbEl()).not.toHaveAttribute('data-ag-allow-nested');
    fireEvent.pointerDown(control, { pointerId: 1, button: 0, clientX: 50, clientY: 10, pointerType: 'mouse' });
    fireEvent.pointerMove(document, { pointerId: 1, buttons: 1, clientX: 80, clientY: 10, pointerType: 'mouse' });
    expect(container.querySelector('.ag-slider')).toHaveAttribute('data-dragging');
    expect(thumbEl()).toHaveAttribute('data-ag-allow-nested');
    fireEvent.pointerUp(document, { pointerId: 1, clientX: 80, clientY: 10, pointerType: 'mouse' });
    expect(container.querySelector('.ag-slider')).not.toHaveAttribute('data-dragging');
    expect(thumbEl()).not.toHaveAttribute('data-ag-allow-nested');
  });
});

describe('REQ-CMP-50 direction changes after mount', () => {
  it('a dir="rtl" set on an ancestor after mount mirrors keys on the next focus', async () => {
    const { container } = render(
      <div data-testid="host">
        <Slider.Root aria-label="late" defaultValue={50} step={5} />
      </div>,
    );
    (container.firstElementChild as HTMLElement).setAttribute('dir', 'rtl');
    const thumb = screen.getByRole('slider', { name: 'late' });
    act(() => thumb.focus());
    await userEvent.keyboard('{ArrowRight}');
    expect(Number(thumb.getAttribute('aria-valuenow'))).toBe(45);
  });
});
