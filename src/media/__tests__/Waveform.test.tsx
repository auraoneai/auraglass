import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import { Waveform } from '../Waveform/Waveform';
import { WaveformLevel } from '../Waveform/WaveformLevel';
import { downsamplePeaks, waveformPath } from '../Waveform/downsample';
import peaksFixture from '../__fixtures__/peaks-voice.json';

describe('Waveform (REQ-SURF-140)', () => {
  it('10,000 peaks → bars columns; deterministic byte-identical d', () => {
    const big = Array.from({ length: 10000 }, (_, i) => (i * 7 % 100) / 100);
    const d1 = waveformPath(big, 64, 640, 48);
    const d2 = waveformPath(big, 64, 640, 48);
    expect(d1).toBe(d2);
    expect(d1.split('M').length - 1).toBe(64);
    const cols = downsamplePeaks(big, 64);
    expect(cols).toHaveLength(64);
    for (const v of cols) { expect(v).toBeGreaterThanOrEqual(0); expect(v).toBeLessThanOrEqual(1); }
  });
  it('bars clamps 8–256', () => {
    expect(downsamplePeaks(peaksFixture.peaks, 2)).toHaveLength(8);
    expect(downsamplePeaks(peaksFixture.peaks, 999)).toHaveLength(256);
  });
  it('renders one svg role=img with ≤2 paths and clipPath at progress', () => {
    const { container } = render(
      <Waveform peaks={peaksFixture.peaks} label="Voice" progress={0.5} bars={16} />,
    );
    const svg = container.querySelector('svg[role="img"]')!;
    expect(svg.getAttribute('aria-label')).toBe('Voice');
    const paths = svg.querySelectorAll('path');
    expect(paths.length).toBe(2);
    const clip = svg.querySelector('clipPath rect')!;
    expect(Number(clip.getAttribute('width'))).toBeCloseTo(320);
  });
  it('d snapshot for the peaks-voice fixture (byte-identical across renders)', () => {
    const { container } = render(<Waveform peaks={peaksFixture.peaks} label="Voice" />);
    const d = container.querySelector('[data-ag-part="waveform-remaining"]')!.getAttribute('d');
    expect(container.querySelector('[data-ag-part="waveform-played"]')!.getAttribute('d')).toBe(d);
    expect(d!.split('M').length - 1).toBe(64);
    expect(d).toMatchSnapshot();
  });
  it('peaks mode: no inline motion, colours come from media.css (fill=currentColor fallback)', () => {
    const { container } = render(<Waveform peaks={peaksFixture.peaks} label="Voice" progress={0.25} />);
    for (const p of Array.from(container.querySelectorAll('path'))) {
      expect(p.getAttribute('fill')).toBe('currentColor');
      expect(p.getAttribute('style')).toBeNull();
    }
    expect(container.querySelector('clipPath')!.id).toBe(
      container.querySelector('[data-ag-part="waveform-played"]')!.getAttribute('clip-path')!.slice(5, -1),
    );
  });
  it('WaveformLevel level=0.6 renders a visible, unclipped bar with scaleY(0.6)', () => {
    const { container } = render(<WaveformLevel level={0.6} label="Level" />);
    const svg = container.querySelector('svg[role="img"]')!;
    expect(svg.getAttribute('aria-label')).toBe('Level');
    expect(svg.querySelectorAll('path').length).toBeLessThanOrEqual(2);
    const bar = svg.querySelector('[data-ag-part="waveform-level"]') as SVGPathElement;
    expect(bar).not.toBeNull();
    expect(bar.getAttribute('clip-path')).toBeNull();
    expect(svg.querySelector('clipPath')).toBeNull();
    expect(bar.style.transform).toBe('scaleY(0.6)');
    expect(bar.getAttribute('d')).toBe('M0 0h640v48h-640z');
    // default (full) motion keeps the CSS transition: no inline override
    expect(bar.style.transitionDuration).toBe('');
  });
  it('Waveform level prop delegates to WaveformLevel', () => {
    const { container } = render(<Waveform level={0.3} label="Level" />);
    const bar = container.querySelector('[data-ag-part="waveform-level"]') as SVGPathElement;
    expect(bar.style.transform).toBe('scaleY(0.3)');
  });
});
