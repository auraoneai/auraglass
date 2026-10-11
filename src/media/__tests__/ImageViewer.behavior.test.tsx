import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider } from '../../theme';
import { ImageViewer, type ImageViewerItem } from '../ImageViewer/ImageViewer';

/* REQ-SURF-141..144 (REQ-FIN-86, and the REQ-FIN-07 ImageViewer transfer):
 * controlled/defaultOpen/loop, one portal + one Escape owner + focus rules,
 * id-resolved Trigger, wheel/pan/pinch. */

const items = (n: number, caption = false): ImageViewerItem[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `p${i + 1}`, src: `/img/${i + 1}.jpg`, alt: `photo ${i + 1}`,
    ...(caption ? { caption: `Caption ${i + 1}` } : {}),
  }));

beforeAll(() => {
  // jsdom has no PointerEvent: give pointer events their pointerId/clientX/Y.
  if (typeof window.PointerEvent === 'undefined') {
    class PointerEventShim extends MouseEvent {
      pointerId: number;
      constructor(type: string, init: PointerEventInit = {}) {
        super(type, init);
        this.pointerId = init.pointerId ?? 1;
      }
    }
    (window as unknown as { PointerEvent: unknown }).PointerEvent = PointerEventShim;
  }
});

const q = <T extends Element = HTMLElement>(sel: string) => document.body.querySelector<T>(sel);
const popup = () => q('[data-ag-part="image-viewer-popup"]');
const stage = () => q('[data-ag-part="image-viewer-stage"]')!;
const visibleAlt = () =>
  (Array.from(stage().querySelectorAll('img')).find((i) => !i.hasAttribute('hidden')) as HTMLImageElement).alt;

async function openViaTrigger(ui: React.ReactElement, label: string) {
  const r = render(ui);
  fireEvent.click(r.getByText(label));
  await waitFor(() => expect(popup()).toBeTruthy());
  return r;
}

describe('ImageViewer parts/props (REQ-SURF-141)', () => {
  it('controlled value: ArrowRight calls onValueChange(id) and the stage follows the value prop', async () => {
    const onValueChange = jest.fn();
    function Controlled() {
      const [v, setV] = React.useState('p1');
      return (
        <AuraGlassProvider>
          <ImageViewer.Root items={items(3)} value={v} onValueChange={(id) => { onValueChange(id); setV(id); }} defaultOpen>
            <ImageViewer.Popup />
          </ImageViewer.Root>
        </AuraGlassProvider>
      );
    }
    render(<Controlled />);
    await waitFor(() => expect(popup()).toBeTruthy());
    expect(visibleAlt()).toBe('photo 1');
    fireEvent.keyDown(popup()!, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith('p2');
    expect(visibleAlt()).toBe('photo 2');
  });

  it('controlled value without an update keeps showing the controlled item', async () => {
    const onValueChange = jest.fn();
    render(
      <AuraGlassProvider>
        <ImageViewer.Root items={items(3)} value="p2" onValueChange={onValueChange} defaultOpen>
          <ImageViewer.Popup />
        </ImageViewer.Root>
      </AuraGlassProvider>,
    );
    await waitFor(() => expect(popup()).toBeTruthy());
    fireEvent.keyDown(popup()!, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith('p3');
    expect(visibleAlt()).toBe('photo 2');
  });

  it('defaultOpen renders the popup without a Trigger', async () => {
    render(
      <AuraGlassProvider>
        <ImageViewer.Root items={items(2)} defaultOpen><ImageViewer.Popup /></ImageViewer.Root>
      </AuraGlassProvider>,
    );
    await waitFor(() => expect(popup()).toBeTruthy());
    expect(popup()!.getAttribute('role')).toBe('dialog');
  });

  it('loop=true wraps End → next → first; loop=false stays on the last', async () => {
    const onValueChange = jest.fn();
    render(
      <AuraGlassProvider>
        <ImageViewer.Root items={items(4)} loop defaultOpen onValueChange={onValueChange}><ImageViewer.Popup /></ImageViewer.Root>
      </AuraGlassProvider>,
    );
    await waitFor(() => expect(popup()).toBeTruthy());
    fireEvent.keyDown(popup()!, { key: 'End' });
    expect(visibleAlt()).toBe('photo 4');
    fireEvent.keyDown(popup()!, { key: 'ArrowRight' });
    expect(visibleAlt()).toBe('photo 1');
    expect(onValueChange).toHaveBeenLastCalledWith('p1');
    cleanup();
    render(
      <AuraGlassProvider>
        <ImageViewer.Root items={items(4)} defaultOpen><ImageViewer.Popup /></ImageViewer.Root>
      </AuraGlassProvider>,
    );
    await waitFor(() => expect(popup()).toBeTruthy());
    fireEvent.keyDown(popup()!, { key: 'End' });
    fireEvent.keyDown(popup()!, { key: 'ArrowRight' });
    expect(visibleAlt()).toBe('photo 4');
  });

  it('Stage data-state is fit at 1× and zoomed after Zoom in; Reset returns to fit', async () => {
    render(
      <AuraGlassProvider>
        <ImageViewer.Root items={items(2)} defaultOpen><ImageViewer.Popup /></ImageViewer.Root>
      </AuraGlassProvider>,
    );
    await waitFor(() => expect(popup()).toBeTruthy());
    expect(stage().getAttribute('data-state')).toBe('fit');
    fireEvent.click(q('[data-ag-part="image-viewer-zoom-in"]')!);
    expect(stage().getAttribute('data-state')).toBe('zoomed');
    fireEvent.click(q('[data-ag-part="image-viewer-zoom-reset"]')!);
    expect(stage().getAttribute('data-state')).toBe('fit');
  });
});

describe('ImageViewer popup dialog/layer/focus (REQ-SURF-142, REQ-FIN-07 transfer)', () => {
  function App({ caption = false, onOpenChange }: { caption?: boolean; onOpenChange?: (o: boolean) => void }) {
    return (
      <AuraGlassProvider>
        <main data-testid="app">
          <ImageViewer.Root items={items(3, caption)} {...(onOpenChange ? { onOpenChange } : {})}>
            <ImageViewer.Trigger id="p2">open p2</ImageViewer.Trigger>
            <ImageViewer.Popup />
          </ImageViewer.Root>
        </main>
      </AuraGlassProvider>
    );
  }

  it('portals exactly once, into the provider overlay layer root', async () => {
    await openViaTrigger(<App />, 'open p2');
    const overlay = q('[data-ag-portal-root] [data-ag-layer-root="overlay"]')!;
    expect(overlay).toBeTruthy();
    expect(document.body.querySelectorAll('[data-ag-part="image-viewer-popup"]')).toHaveLength(1);
    expect(overlay.contains(popup())).toBe(true);
    // one portal node in the overlay root, holding the popup
    expect(overlay.children).toHaveLength(1);
    expect(overlay.children[0]!.contains(popup())).toBe(true);
    // nothing portalled anywhere else in <body>
    const strays = Array.from(document.body.children).filter((el) =>
      !el.hasAttribute('data-ag-portal-root') && el.querySelector('[data-ag-part="image-viewer-popup"]'));
    expect(strays).toHaveLength(0);
  });

  it('focus moves to Close on open, and navigation does not move it again', async () => {
    await openViaTrigger(<App />, 'open p2');
    const close = q<HTMLButtonElement>('[data-ag-part="image-viewer-close"]')!;
    await waitFor(() => expect(document.activeElement).toBe(close));
    const next = q<HTMLButtonElement>('[data-ag-part="image-viewer-next"]')!;
    act(() => next.focus());
    fireEvent.keyDown(next, { key: 'ArrowRight' });
    expect(visibleAlt()).toBe('photo 3');
    expect(document.activeElement).toBe(next);
    fireEvent.keyDown(next, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(next);
  });

  it('Escape closes once and focus returns to the Trigger', async () => {
    const onOpenChange = jest.fn();
    const r = await openViaTrigger(<App onOpenChange={onOpenChange} />, 'open p2');
    const trigger = r.getByText('open p2');
    await waitFor(() => expect(document.activeElement).toBe(q('[data-ag-part="image-viewer-close"]')));
    onOpenChange.mockClear();
    fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
    await waitFor(() => expect(popup()).toBeNull());
    expect(onOpenChange).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('Close button closes and focus returns to the Trigger', async () => {
    const r = await openViaTrigger(<App />, 'open p2');
    fireEvent.click(q('[data-ag-part="image-viewer-close"]')!);
    await waitFor(() => expect(popup()).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(r.getByText('open p2')));
  });

  it('background is inert while open and restored after close', async () => {
    const r = await openViaTrigger(<App />, 'open p2');
    const appHost = r.getByTestId('app').closest('body > *')!;
    await waitFor(() => expect(appHost.hasAttribute('inert')).toBe(true));
    fireEvent.click(q('[data-ag-part="image-viewer-close"]')!);
    await waitFor(() => expect(popup()).toBeNull());
    await waitFor(() => expect(appHost.hasAttribute('inert')).toBe(false));
  });

  it('aria-labelledby names the dialog by the caption, else by a hidden alt span', async () => {
    await openViaTrigger(<App caption />, 'open p2');
    const byCaption = document.getElementById(popup()!.getAttribute('aria-labelledby')!);
    expect(byCaption?.getAttribute('data-ag-part')).toBe('image-viewer-caption');
    expect(byCaption?.textContent).toBe('Caption 2');
    expect(popup()!.hasAttribute('aria-label')).toBe(false);
    cleanup();
    await openViaTrigger(<App />, 'open p2');
    const byAlt = document.getElementById(popup()!.getAttribute('aria-labelledby')!);
    expect(byAlt?.textContent).toBe('photo 2');
    expect(byAlt?.className).toBe('ag-visually-hidden');
    fireEvent.keyDown(popup()!, { key: 'ArrowRight' });
    expect(document.getElementById(popup()!.getAttribute('aria-labelledby')!)?.textContent).toBe('photo 3');
  });
});

describe('ImageViewer id-resolved Trigger (REQ-SURF-143)', () => {
  it('a Trigger whose id was filtered out opens nothing and warns once in dev', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const all = items(10);
    const shown = [all[2]!, all[5]!, all[9]!]; // p3, p6, p10 — p7 filtered out
    const r = render(
      <AuraGlassProvider>
        <ImageViewer.Root items={shown}>
          <ImageViewer.Trigger id="p7">open p7</ImageViewer.Trigger>
          <ImageViewer.Popup />
        </ImageViewer.Root>
      </AuraGlassProvider>,
    );
    fireEvent.click(r.getByText('open p7'));
    await act(async () => { await new Promise((res) => setTimeout(res, 20)); });
    expect(popup()).toBeNull();
    expect(warn.mock.calls.some((c) => String(c[0]).includes('ImageViewer.Trigger id="p7"'))).toBe(true);
    warn.mockRestore();
  });
});

describe('ImageViewer zoom/pan/pinch (REQ-SURF-144)', () => {
  async function openAt(id = 'p1') {
    render(
      <AuraGlassProvider>
        <ImageViewer.Root items={items(3)} defaultValue={id} defaultOpen><ImageViewer.Popup /></ImageViewer.Root>
      </AuraGlassProvider>,
    );
    await waitFor(() => expect(popup()).toBeTruthy());
  }
  const currentImg = () => Array.from(stage().querySelectorAll('img')).find((i) => !i.hasAttribute('hidden')) as HTMLImageElement;

  it('a plain wheel at 1× is not prevented (page scroll keeps working) and does not zoom', async () => {
    await openAt();
    const notPrevented = fireEvent.wheel(stage(), { deltaY: -100 });
    expect(notPrevented).toBe(true);
    expect(stage().getAttribute('data-state')).toBe('fit');
  });

  it('ctrl+wheel zooms and is prevented; once zoomed a plain wheel is prevented too', async () => {
    await openAt();
    expect(fireEvent.wheel(stage(), { deltaY: -100, ctrlKey: true })).toBe(false);
    expect(stage().getAttribute('data-state')).toBe('zoomed');
    expect(fireEvent.wheel(stage(), { deltaY: -100 })).toBe(false);
    expect(currentImg().style.transform).toContain('scale(1.5625)');
  });

  it('a single pointer pans only while zoomed, and pan resets when zoom returns to 1', async () => {
    await openAt();
    const s = stage();
    fireEvent.pointerDown(s, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(s, { pointerId: 1, clientX: 140, clientY: 120 });
    fireEvent.pointerUp(s, { pointerId: 1 });
    expect(currentImg().style.transform).toContain('translate3d(0px, 0px, 0)');
    fireEvent.click(q('[data-ag-part="image-viewer-zoom-in"]')!);
    fireEvent.pointerDown(s, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerMove(s, { pointerId: 1, clientX: 140, clientY: 120 });
    fireEvent.pointerUp(s, { pointerId: 1 });
    expect(currentImg().style.transform).toContain('translate3d(40px, 20px, 0)');
    fireEvent.click(q('[data-ag-part="image-viewer-zoom-reset"]')!);
    expect(currentImg().style.transform).toContain('translate3d(0px, 0px, 0)');
  });

  it('a two-pointer pinch scales by the distance ratio, clamped to 8×', async () => {
    await openAt();
    const s = stage();
    fireEvent.pointerDown(s, { pointerId: 1, clientX: 100, clientY: 100 });
    fireEvent.pointerDown(s, { pointerId: 2, clientX: 200, clientY: 100 });
    fireEvent.pointerMove(s, { pointerId: 2, clientX: 300, clientY: 100 }); // 100 → 200 px
    expect(stage().getAttribute('data-state')).toBe('zoomed');
    expect(currentImg().style.transform).toContain('scale(2)');
    // live gesture: no CSS zoom transition while fingers are down
    expect(currentImg().style.transitionDuration).toBe('0s');
    fireEvent.pointerMove(s, { pointerId: 2, clientX: 2100, clientY: 100 }); // ratio 20 → clamp 8
    expect(currentImg().style.transform).toContain('scale(8)');
    fireEvent.pointerUp(s, { pointerId: 2 });
    fireEvent.pointerUp(s, { pointerId: 1 });
    expect(currentImg().style.transitionDuration).toBe('');
    // pinching back in clamps at 1× and resets to fit
    fireEvent.pointerDown(s, { pointerId: 3, clientX: 0, clientY: 0 });
    fireEvent.pointerDown(s, { pointerId: 4, clientX: 400, clientY: 0 });
    fireEvent.pointerMove(s, { pointerId: 4, clientX: 1, clientY: 0 });
    expect(stage().getAttribute('data-state')).toBe('fit');
  });
});
