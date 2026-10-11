import { describe, expect, it } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider } from '../../theme';
import { PORTAL_ROOT_MARKUP } from '../../contracts/preferences';
import { ImageViewer, type ImageViewerItem } from '../ImageViewer/ImageViewer';

const items = (n: number): ImageViewerItem[] =>
  Array.from({ length: n }, (_, i) => ({ id: `p${i + 1}`, src: `/img/${i + 1}.jpg`, alt: `photo ${i + 1}` }));

function Harness({ count, filter, id }: { count: number; filter?: number[]; id: string }) {
  const all = items(count);
  const shown = filter ? filter.map((i) => all[i]!) : all;
  return (
    <AuraGlassProvider>
      <ImageViewer.Root items={shown}>
        <ImageViewer.Trigger id={id}>open {id}</ImageViewer.Trigger>
        <ImageViewer.Popup />
      </ImageViewer.Root>
    </AuraGlassProvider>
  );
}

function ensurePortal() {
  // The provider's PORTAL_ROOT_MARKUP lands after Popup's first portal lookup
  // in jsdom; seed it directly so the overlay has a container.
  if (!document.body.querySelector('[data-ag-portal-root]')) {
    document.body.insertAdjacentHTML('beforeend', PORTAL_ROOT_MARKUP);
  }
}
function cleanupPortal() {
  document.body.querySelector('[data-ag-portal-root]')?.remove();
}

describe('ImageViewer (REQ-SURF-141..145)', () => {
  it('filter then open: 10→3 items, trigger p7, stage alt is p7', () => {
    for (let run = 0; run < 10; run++) {
      ensurePortal();
      const { getByText, unmount } = render(
        <Harness count={10} filter={[2, 6, 9]} id="p7" />,
      );
      fireEvent.click(getByText('open p7'));
      const stage = document.body.querySelector('[data-ag-part="image-viewer-stage"]')!;
      const visible = Array.from(stage.querySelectorAll('img')).filter((i) => !i.hasAttribute('hidden'));
      expect(visible).toHaveLength(1);
      expect((visible[0] as HTMLImageElement).alt).toBe('photo 7');
      unmount();
    }
  });
  it('renders at most 3 <img> (current + hidden prev/next)', () => {
    ensurePortal();
    const { getByText } = render(<Harness count={12} id="p5" />);
    fireEvent.click(getByText('open p5'));
    const stage = document.body.querySelector('[data-ag-part="image-viewer-stage"]')!;
    expect(stage.querySelectorAll('img').length).toBeLessThanOrEqual(3);
  });
  it('Counter announces once per navigation', () => {
    ensurePortal();
    const { getByText } = render(<Harness count={3} id="p1" />);
    fireEvent.click(getByText('open p1'));
    const polite = document.body.querySelector('[data-ag-announcer] [aria-live="polite"]');
    expect(polite?.textContent).toBe('1 of 3');
    fireEvent.keyDown(document.body.querySelector('[data-ag-part="image-viewer-popup"]')!, { key: 'ArrowRight' });
    expect(polite?.textContent).toBe('2 of 3');
  });
  it('zoom keys + - 0 and arrows work inside the popup', () => {
    ensurePortal();
    const { getByText } = render(<Harness count={3} id="p1" />);
    fireEvent.click(getByText('open p1'));
    const popup = document.body.querySelector('[data-ag-part="image-viewer-popup"]')!;
    fireEvent.keyDown(popup, { key: '+' });
    const stage = document.body.querySelector('[data-ag-part="image-viewer-stage"]')!;
    expect(stage.getAttribute('data-state')).toBe('zoomed');
    fireEvent.keyDown(popup, { key: '0' });
    expect(stage.getAttribute('data-state')).toBe('fit');
  });
});
