/** @jest-environment node */
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { Backdrop } from './Backdrop';

describe('Backdrop SSR (REQ-SURF-158/08)', () => {
  it('photo/video declare data-ag-backdrop="media" server-side', () => {
    const html = renderToString(<Backdrop preset="photo" src="/x.jpg" />);
    expect(html).toContain('data-ag-backdrop="media"');
    const v = renderToString(<Backdrop preset="video" src="/v.mp4" />);
    expect(v).toContain('data-ag-backdrop="media"');
  });
  it('aurora/mesh declare light|dark|auto from scheme', () => {
    expect(renderToString(<Backdrop preset="aurora" scheme="light" />)).toContain('data-ag-backdrop="light"');
    expect(renderToString(<Backdrop preset="mesh" scheme="dark" />)).toContain('data-ag-backdrop="dark"');
    expect(renderToString(<Backdrop preset="aurora" scheme="auto" />)).toContain('data-ag-backdrop="auto"');
  });
  it('grain alone sets no data-ag-backdrop', () => {
    const html = renderToString(<Backdrop preset="grain" />);
    expect(html).toContain('data-ag-backdrop-preset="grain"');
    expect(html).not.toContain('data-ag-backdrop="media"');
    expect(html).not.toMatch(/data-ag-backdrop="(light|dark|auto)"/);
  });
  it('explicit mediaTone sets data-ag-media-tone', () => {
    expect(renderToString(<Backdrop preset="photo" src="/x.jpg" mediaTone="dark" />)).toContain('data-ag-media-tone="dark"');
  });
  it('src/srcSet/sizes/poster/crossOrigin never leak onto the root <div> (REQ-SURF-155)', () => {
    const photo = renderToString(
      <Backdrop preset="photo" src="/x.jpg" srcSet="/x-2.jpg 2x" sizes="100vw" crossOrigin="anonymous" />,
    );
    expect(photo).not.toMatch(/<div[^>]* (?:src|srcSet|srcset|sizes|poster|crossOrigin|crossorigin)=/);
    expect(photo).toMatch(/<img[^>]* src="\/x.jpg"/);
    const video = renderToString(<Backdrop preset="video" src="/v.mp4" poster="/p.jpg" crossOrigin="anonymous" />);
    expect(video).not.toMatch(/<div[^>]* (?:src|poster|crossOrigin|crossorigin)=/);
    expect(video).toMatch(/<video[^>]* poster="\/p.jpg"/);
  });
  it('every palette id is emitted as data-ag-palette (default aurora)', () => {
    expect(renderToString(<Backdrop preset="mesh" />)).toContain('data-ag-palette="aurora"');
    for (const palette of ['aurora', 'prism', 'ocean', 'ember', 'mono'] as const) {
      expect(renderToString(<Backdrop preset="aurora" palette={palette} />)).toContain(`data-ag-palette="${palette}"`);
    }
  });
  it('preset="grain" turns the grain overlay on by itself; grain={true} adds it to any preset (REQ-SURF-160)', () => {
    expect(renderToString(<Backdrop preset="grain" />)).toContain('data-backdrop-grain=""');
    expect(renderToString(<Backdrop preset="aurora" />)).not.toContain('data-backdrop-grain');
    expect(renderToString(<Backdrop preset="aurora" grain />)).toContain('data-backdrop-grain=""');
  });
  it('video renders the pause control hidden server-side (nothing plays before hydration, REQ-SURF-157)', () => {
    expect(renderToString(<Backdrop preset="video" src="/v.mp4" />)).toMatch(/<button[^>]*data-ag-part="backdrop-pause"[^>]* hidden=""/);
  });
});
