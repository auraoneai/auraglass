import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { MediaScrubber, scrubberValueText } from '../MediaScrubber/MediaScrubber';

describe('MediaScrubber (REQ-SURF-136)', () => {
  it('aria-valuetext spoken for 0, 92, 3725, NaN max', () => {
    expect(scrubberValueText(0, 250)).toBe('0 seconds of 4 minutes 10 seconds');
    expect(scrubberValueText(92, 250)).toBe('1 minute 32 seconds of 4 minutes 10 seconds');
    expect(scrubberValueText(3725, 3725)).toBe('1 hour 2 minutes 5 seconds of 1 hour 2 minutes 5 seconds');
    expect(scrubberValueText(0, NaN)).toBe('0 seconds of unknown duration');
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
  it('aria-label defaults to Seek and slider carries it', () => {
    const { container } = render(<MediaScrubber value={0} max={10} />);
    expect(container.querySelector('[aria-label="Seek"]')).toBeTruthy();
  });
});
