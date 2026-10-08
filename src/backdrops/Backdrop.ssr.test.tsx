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
  it('explicit tone sets data-ag-media-tone', () => {
    expect(renderToString(<Backdrop preset="photo" src="/x.jpg" tone="dark" />)).toContain('data-ag-media-tone="dark"');
  });
});
