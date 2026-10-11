import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { MediaScrubber, scrubberValueText } from '../MediaScrubber/MediaScrubber';
import { MediaControls } from '../MediaControls/MediaControls';

/* jsdom has no PointerEvent; Base UI's slider reads clientX/buttons, which
 * MouseEvent carries. */
beforeAll(() => {
  (window as { PointerEvent?: unknown }).PointerEvent = window.MouseEvent;
});

let frames: FrameRequestCallback[] = [];
const runFrame = () => {
  const due = frames;
  frames = [];
  act(() => { for (const cb of due) cb(performance.now()); });
};
beforeEach(() => {
  frames = [];
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => { frames.push(cb); return frames.length; });
  jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
});
afterEach(() => { jest.restoreAllMocks(); });

const thumbInput = (c: HTMLElement, part = 'media-scrubber') =>
  c.querySelector(`[data-ag-part="${part}"] [data-ag-part="thumb"] input[type="range"]`) as HTMLInputElement;

/** A 300 px wide control at x=0. */
function sizeControl(c: HTMLElement) {
  const control = c.querySelector('[data-ag-part="media-scrubber"] [data-ag-part="control"]') as HTMLElement;
  control.getBoundingClientRect = () => ({ left: 0, right: 300, width: 300, top: 0, bottom: 20, height: 20, x: 0, y: 0, toJSON: () => ({}) });
  return control;
}

describe('MediaScrubber (REQ-SURF-136)', () => {
  it('aria-valuetext spoken for 0, 92, 3725, NaN max', () => {
    expect(scrubberValueText(0, 250)).toBe('0 seconds of 4 minutes 10 seconds');
    expect(scrubberValueText(92, 250)).toBe('1 minute 32 seconds of 4 minutes 10 seconds');
    expect(scrubberValueText(3725, 3725)).toBe('1 hour 2 minutes 5 seconds of 1 hour 2 minutes 5 seconds');
    expect(scrubberValueText(0, NaN)).toBe('0 seconds of unknown duration');
  });
  it('the thumb input carries the spoken valuetext and aria-label Seek', () => {
    const { container } = render(<MediaScrubber value={92} max={250} />);
    const input = thumbInput(container);
    expect(input.getAttribute('aria-valuetext')).toBe('1 minute 32 seconds of 4 minutes 10 seconds');
    expect(input.getAttribute('aria-label')).toBe('Seek');
  });
  it('buffered ranges render as --_ag-start/--_ag-end layers, no width/left', () => {
    const { container } = render(
      <MediaScrubber value={10} max={100} buffered={[[0, 25], [40, 100]]} />,
    );
    const layers = container.querySelectorAll('[data-ag-part="media-scrubber-buffered"]');
    expect(layers.length).toBe(2);
    const el = layers[0] as HTMLElement;
    expect(el.style.getPropertyValue('--_ag-start')).toBe('0%');
    expect(el.style.getPropertyValue('--_ag-end')).toBe('25%');
    expect(el.style.width).toBe('');
    expect(el.style.left).toBe('');
  });
  it('chapters render markers at --_ag-start', () => {
    const { container } = render(
      <MediaScrubber value={0} max={100} chapters={[{ start: 50, title: 'Ch 2' }]} />,
    );
    const ch = container.querySelector('[data-ag-part="media-scrubber-chapter"]') as HTMLElement;
    expect(ch.style.getPropertyValue('--_ag-start')).toBe('50%');
  });
  it('10 pointermoves inside one frame → 1 onValueChange; release → exactly 1 commit', () => {
    const onValueChange = jest.fn();
    const onValueCommit = jest.fn();
    const { container } = render(
      <MediaScrubber value={0} max={300} onValueChange={onValueChange} onValueCommit={onValueCommit} />,
    );
    const control = sizeControl(container);
    fireEvent.pointerDown(control, { button: 0, buttons: 1, clientX: 30, clientY: 10 });
    for (let i = 1; i <= 10; i++) {
      fireEvent.pointerMove(document, { buttons: 1, clientX: 30 + i * 10, clientY: 10 });
    }
    expect(onValueChange).not.toHaveBeenCalled(); // nothing before the frame
    runFrame();
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenLastCalledWith(130);
    fireEvent.pointerUp(document, { buttons: 0, clientX: 130, clientY: 10 });
    runFrame();
    expect(onValueCommit).toHaveBeenCalledTimes(1);
    expect(onValueCommit).toHaveBeenCalledWith(130);
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });
  it('while dragging: root + thumb carry data-dragging, the thumb is transient glass, tooltip shows the drag time', () => {
    const { container } = render(<MediaScrubber value={0} max={300} onValueChange={() => {}} onValueCommit={() => {}} />);
    const control = sizeControl(container);
    const thumb = () => container.querySelector('[data-ag-part="media-scrubber"] [data-ag-part="thumb"]') as HTMLElement;
    expect(thumb().getAttribute('data-ag-layer')).toBeNull();
    fireEvent.pointerDown(control, { button: 0, buttons: 1, clientX: 30, clientY: 10 });
    for (let i = 1; i <= 4; i++) fireEvent.pointerMove(document, { buttons: 1, clientX: 30 + i * 30, clientY: 10 });
    const root = container.querySelector('[data-ag-part="media-scrubber"]') as HTMLElement;
    expect(root.hasAttribute('data-dragging')).toBe(true);
    expect(thumb().hasAttribute('data-dragging')).toBe(true);
    expect(thumb().getAttribute('data-ag-layer')).toBe('transient');
    const tip = container.querySelector('[data-ag-part="media-scrubber-tooltip"]') as HTMLElement;
    expect(tip.textContent).toBe('2:30');
    expect(tip.getAttribute('aria-hidden')).toBe('true');
    fireEvent.pointerUp(document, { buttons: 0, clientX: 150, clientY: 10 });
    expect(root.hasAttribute('data-dragging')).toBe(false);
    expect(thumb().getAttribute('data-ag-layer')).toBeNull();
  });
  it(', and . step one frame only while paused', () => {
    const onValueChange = jest.fn();
    const { container, rerender } = render(
      <MediaScrubber value={10} max={100} frameRate={25} paused={false} onValueChange={onValueChange} />,
    );
    fireEvent.keyDown(thumbInput(container), { key: '.' });
    expect(onValueChange).not.toHaveBeenCalled();
    rerender(<MediaScrubber value={10} max={100} frameRate={25} paused onValueChange={onValueChange} />);
    fireEvent.keyDown(thumbInput(container), { key: '.' });
    expect(onValueChange).toHaveBeenLastCalledWith(10.04);
    fireEvent.keyDown(thumbInput(container), { key: ',' });
    expect(onValueChange).toHaveBeenLastCalledWith(9.96);
  });
  it('Volume is the CMP Slider with percent aria-valuetext', () => {
    const { container } = render(<MediaControls.Root playing={false} volume={0.5}><MediaControls.Volume /></MediaControls.Root>);
    const input = thumbInput(container, 'media-volume');
    expect(input.getAttribute('aria-label')).toBe('Volume');
    expect(input.getAttribute('aria-valuetext')).toMatch(/%$/);
    expect(input.getAttribute('aria-valuetext')).toBe('50%');
    expect(container.querySelector('[data-ag-part="media-volume"] .ag-slider')).toBeTruthy();
  });
});
