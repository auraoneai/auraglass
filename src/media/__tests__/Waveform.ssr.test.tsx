/**
 * @jest-environment node
 */
/* REQ-SURF-140: Waveform is a server module — renders with peaks under the
   node environment. The directive/hook rule is enforced by
   tests/rsc/surf/directives.test.ts (Waveform.tsx is on its server list). */
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { Waveform } from '../Waveform/Waveform';
import { waveformPath } from '../Waveform/downsample';
import peaksFixture from '../__fixtures__/peaks-voice.json';

describe('Waveform SSR (REQ-SURF-140)', () => {
  it('renderToString(<Waveform peaks label/>) works under the node env', () => {
    expect(typeof document).toBe('undefined');
    const html = renderToString(<Waveform peaks={peaksFixture.peaks} label="Voice waveform" progress={0.5} />);
    expect(html).toMatch(/^<svg[^>]* role="img"/);
    expect(html).toContain('aria-label="Voice waveform"');
    expect((html.match(/<path /g) ?? []).length).toBe(2);
    const d = waveformPath(peaksFixture.peaks, 64, 640, 48);
    expect(html).toContain(`d="${d}"`);
    expect(html).toContain('<rect x="0" y="0" width="320" height="48"');
  });

  it('server output is deterministic (same input → byte-identical markup)', () => {
    const a = renderToString(<Waveform peaks={peaksFixture.peaks} label="Voice" progress={0.3} />);
    const b = renderToString(<Waveform peaks={new Float32Array(peaksFixture.peaks)} label="Voice" progress={0.3} />);
    expect(b).toBe(a);
  });
});
