import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, waitFor } from '@testing-library/react';
import * as React from 'react';

/* REQ-SURF-145 (REQ-FIN-86): Stage backdrop + tone, chrome material on
 * Toolbar/Caption, Inspector layout hook, sampling opt-out. The tone LRU is
 * replaced by a recorder so the test controls what the sampler "measured". */
const mockSampled: string[] = [];
jest.mock('../sampling/toneCache', () => ({
  getOrSampleTone: (el: HTMLImageElement, _region: unknown, apply: (t: 'light' | 'dark' | undefined, l: number | null) => void) => {
    mockSampled.push(el.getAttribute('src') ?? '');
    apply(el.getAttribute('src')?.includes('dark') ? 'dark' : 'light', 0.5);
  },
}));

// (jest.mock above is hoisted before these imports)
import { AuraGlassProvider } from '../../theme';
import { ImageViewer, type ImageViewerItem } from '../ImageViewer/ImageViewer';

const ITEMS: ImageViewerItem[] = [
  { id: 'a', src: '/img/dark.jpg', alt: 'night street', caption: 'Night' },
  { id: 'b', src: '/img/bright.jpg', alt: 'snow field' },
];

const decodeDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'decode');
const widthDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'naturalWidth');
let decodeCalls = 0;
beforeAll(() => {
  Object.defineProperty(HTMLImageElement.prototype, 'decode', {
    configurable: true,
    value() { decodeCalls += 1; return Promise.resolve(); },
  });
  Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', { configurable: true, get: () => 800 });
});
afterAll(() => {
  if (decodeDesc) Object.defineProperty(HTMLImageElement.prototype, 'decode', decodeDesc);
  else delete (HTMLImageElement.prototype as { decode?: unknown }).decode;
  if (widthDesc) Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', widthDesc);
});

const q = (sel: string) => document.body.querySelector<HTMLElement>(sel);
const stage = () => q('[data-ag-part="image-viewer-stage"]')!;

function Viewer(props: { sampleTone?: boolean; inspector?: boolean }) {
  return (
    <AuraGlassProvider>
      <ImageViewer.Root items={ITEMS} defaultOpen {...(props.sampleTone !== undefined ? { sampleTone: props.sampleTone } : {})}>
        {props.inspector ? (
          <ImageViewer.Popup>
            <ImageViewer.Toolbar />
            <ImageViewer.Caption />
            <ImageViewer.Inspector><p>800×500</p></ImageViewer.Inspector>
            <ImageViewer.Close />
          </ImageViewer.Popup>
        ) : <ImageViewer.Popup />}
      </ImageViewer.Root>
    </AuraGlassProvider>
  );
}

describe('ImageViewer chrome/scrim/tone (REQ-SURF-145)', () => {
  it('Stage declares data-ag-backdrop=media inside a media-backdrop popup', async () => {
    render(<Viewer />);
    await waitFor(() => expect(q('[data-ag-part="image-viewer-stage"]')).toBeTruthy());
    expect(stage().getAttribute('data-ag-backdrop')).toBe('media');
    expect(q('[data-ag-part="image-viewer-popup"]')!.getAttribute('data-ag-backdrop')).toBe('media');
    expect(q('[data-ag-part="image-viewer-scrim"]')!.getAttribute('aria-hidden')).toBe('true');
  });

  it('samples the current image after decode() and writes data-ag-media-tone on the Stage; follows navigation', async () => {
    mockSampled.length = 0;
    decodeCalls = 0;
    render(<Viewer />);
    await waitFor(() => expect(stage().getAttribute('data-ag-media-tone')).toBe('dark'));
    expect(decodeCalls).toBeGreaterThan(0);
    expect(mockSampled).toEqual(['/img/dark.jpg']);
    fireEvent.keyDown(q('[data-ag-part="image-viewer-popup"]')!, { key: 'ArrowRight' });
    await waitFor(() => expect(stage().getAttribute('data-ag-media-tone')).toBe('light'));
    expect(mockSampled).toEqual(['/img/dark.jpg', '/img/bright.jpg']);
  });

  it('sampleTone={false} never samples and writes no tone', async () => {
    mockSampled.length = 0;
    render(<Viewer sampleTone={false} />);
    await waitFor(() => expect(q('[data-ag-part="image-viewer-stage"]')).toBeTruthy());
    await new Promise((r) => setTimeout(r, 10));
    expect(mockSampled).toEqual([]);
    expect(stage().hasAttribute('data-ag-media-tone')).toBe(false);
  });

  it('Toolbar and Caption carry the MAT chrome material, variant clear', async () => {
    render(<Viewer />);
    await waitFor(() => expect(q('[data-ag-part="image-viewer-toolbar"]')).toBeTruthy());
    for (const part of ['image-viewer-toolbar', 'image-viewer-caption']) {
      const el = q(`[data-ag-part="${part}"]`)!;
      expect(el.classList.contains('ag-surface')).toBe(true);
      expect(el.getAttribute('data-ag-surface')).toBe('');
      expect(el.getAttribute('data-ag-layer')).toBe('chrome');
      expect(el.getAttribute('data-ag-variant')).toBe('clear');
    }
  });

  it('a mounted Inspector marks the popup data-ag-inspector=open (layout reserves its region)', async () => {
    const r = render(<Viewer inspector />);
    await waitFor(() => expect(q('[data-ag-part="image-viewer-inspector"]')).toBeTruthy());
    expect(q('[data-ag-part="image-viewer-popup"]')!.getAttribute('data-ag-inspector')).toBe('open');
    expect(q('[data-ag-part="image-viewer-inspector"]')!.getAttribute('aria-label')).toBe('Image details');
    r.unmount();
    render(<Viewer />);
    await waitFor(() => expect(q('[data-ag-part="image-viewer-popup"]')).toBeTruthy());
    expect(q('[data-ag-part="image-viewer-popup"]')!.hasAttribute('data-ag-inspector')).toBe(false);
  });
});
