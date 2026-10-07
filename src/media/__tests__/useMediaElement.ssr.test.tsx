/** @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import * as React from 'react';
import { useMediaElement } from '../useMediaElement';

function H() {
  const ref = React.useRef<HTMLVideoElement>(null);
  const h = useMediaElement(ref);
  return <div data-paused={String(h.state.paused)} data-duration={String(h.state.duration)} data-tone={String(h.state.tone)}><video ref={ref} /></div>;
}

describe('useMediaElement SSR (REQ-SURF-08)', () => {
  it('server render yields the exact server snapshot', () => {
    const html = renderToString(<H />);
    expect(html).toContain('data-paused="true"');
    expect(html).toContain('data-duration="NaN"');
    expect(html).toContain('data-tone="undefined"');
  });
});
