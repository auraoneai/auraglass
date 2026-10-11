/* REQ-SURF-140: WaveformLevel reads motion itself — a resolved calm|none
   preference removes the level transition even without a data-ag-motion
   ancestor; full motion leaves the media.css transition in place. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';

let mockMotion: 'full' | 'calm' | 'none' = 'full';
jest.mock('../../theme', () => {
  const actual = jest.requireActual('../../theme') as Record<string, unknown>;
  return { ...actual, useResolvedPreferences: () => ({ motion: mockMotion }) };
});
import { WaveformLevel } from '../Waveform/WaveformLevel';

const bar = (c: HTMLElement) => c.querySelector('[data-ag-part="waveform-level"]') as SVGPathElement;

describe('WaveformLevel motion (REQ-SURF-140)', () => {
  afterEach(() => { mockMotion = 'full'; });

  it.each(['calm', 'none'] as const)('motion=%s → transition-duration 0s, transform still applied', (m) => {
    mockMotion = m;
    const { container } = render(<WaveformLevel level={0.6} label="Level" />);
    expect(bar(container).style.transitionDuration).toBe('0s');
    expect(bar(container).style.transform).toBe('scaleY(0.6)');
  });

  it('motion=full → no inline transition override', () => {
    const { container } = render(<WaveformLevel level={0.25} label="Level" />);
    expect(bar(container).style.transitionDuration).toBe('');
    expect(bar(container).style.transform).toBe('scaleY(0.25)');
  });
});
