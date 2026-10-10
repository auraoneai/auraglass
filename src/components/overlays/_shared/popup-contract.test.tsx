/* CMP-205 (REQ-CMP-85): popup contract over the lane's real subjects plus the
   FixturePopover (a real Base UI Popover through our seam): positioner/popup/
   arrow parts, overlayMaterial attributes, portal target. */
import { describe, expect, it, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider } from '../../../theme';
import { MOUNTED_SUBJECTS } from './__tests__/subjects';
import { overlayMaterial } from './overlaySurface';
import type { OverlayKind } from './overlayTypes';
import { Select } from '../../select/index';
import { Combobox } from '../../combobox/index';
import { Dialog } from '../../dialog/index';
import { Popover } from '../../popover/index';
import FixturePopover from './__fixtures__/FixturePopover';

describe('popup contract (CMP-205)', () => {
  beforeEach(() => {
    if (window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
    document.querySelectorAll('[data-ag-portal-root]').forEach((n) => n.remove());
  });

  it.each(MOUNTED_SUBJECTS.map((s) => [s.name, s] as const))(
    '%s popup carries overlay material attributes + part identity',
    async (_name, subject) => {
      render(<AuraGlassProvider>{subject.mount!()}</AuraGlassProvider>);
      await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
      const popup = document.querySelector(subject.popupSelector)!;
      expect(popup.getAttribute('data-ag-layer')).toBe('overlay');
      expect(popup.getAttribute('data-ag-thickness')).toBeTruthy();
      expect(popup.getAttribute('data-ag-overlay')).toBeTruthy();
      expect(popup.getAttribute('data-ag-variant')).toBe('regular');
      expect(popup.getAttribute('data-state')).toBe('open');
    },
  );

  /* REQ-CMP-78: the thickness table is the single contract every overlay kind
     shares — assert it on overlayMaterial() for all 9 kinds. */
  const EXPECTED_THICKNESS: Record<OverlayKind, 'thick' | 'regular' | 'thin'> = {
    dialog: 'thick',
    'alert-dialog': 'thick',
    sheet: 'thick',
    popover: 'regular',
    menu: 'regular',
    tooltip: 'thin',
    toast: 'thin',
    select: 'regular',
    combobox: 'regular',
  };

  it.each(Object.entries(EXPECTED_THICKNESS))(
    'overlayMaterial(%s) → overlay kind + thickness + regular variant',
    (kind, thickness) => {
      const m = overlayMaterial(kind as OverlayKind) as unknown as Record<string, string>;
      expect(m['data-ag-overlay']).toBe(kind);
      expect(m['data-ag-layer']).toBe('overlay');
      expect(m['data-ag-thickness']).toBe(thickness);
      expect(m['data-ag-variant']).toBe('regular');
    },
  );

  it('prominent passes through overlayMaterial on dialog/popover only', () => {
    const prom = (k: OverlayKind) =>
      (overlayMaterial(k, { prominent: true }) as unknown as Record<string, string>)['data-ag-prominent'];
    expect(prom('dialog')).toBe('');
    expect(prom('popover')).toBe('');
    expect(prom('menu')).toBeUndefined();
    expect(prom('tooltip')).toBeUndefined();
  });

  it('per-instance variant is regular | identity', () => {
    const v = (variant: 'regular' | 'identity') =>
      (overlayMaterial('dialog', { variant }) as unknown as Record<string, string>)['data-ag-variant'];
    expect(v('regular')).toBe('regular');
    expect(v('identity')).toBe('identity');
  });

  /* Select + Combobox subjects: popups carry data-ag-overlay=select|combobox,
     thickness=regular and the [data-ag-surface] hook that material.css keys on
     after REQ-FIN-02 (#117). Mounted without AuraGlassProvider — the jsdom
     portal flake is baselined separately. */
  it.each([
    ['select', <Select.Root key="s" defaultOpen><Select.Trigger>anchor</Select.Trigger><Select.Content><Select.Item value="a">a</Select.Item></Select.Content></Select.Root>],
    ['combobox', <Combobox.Root key="c" defaultOpen items={[{ value: 'a', label: 'a' }]}><Combobox.Input /><Combobox.Content><Combobox.Item value="a">a</Combobox.Item></Combobox.Content></Combobox.Root>],
  ])('%s popup: data-ag-overlay, thickness=regular, data-ag-surface', async (kind, el) => {
    render(el as React.ReactElement);
    await act(async () => { await new Promise((r) => setTimeout(r, 40)); });
    const popup = document.querySelector(`[data-ag-overlay="${kind}"]`);
    expect(popup).toBeTruthy();
    expect(popup!.getAttribute('data-ag-layer')).toBe('overlay');
    expect(popup!.getAttribute('data-ag-thickness')).toBe('regular');
    expect(popup!.hasAttribute('data-ag-surface')).toBe(true);
  });

  it('Dialog and Popover popups: identity variant + prominent pass through', async () => {
    render(
      <AuraGlassProvider>
        <Dialog.Root defaultOpen>
          <Dialog.Portal>
            <Dialog.Popup aria-label="prominent dialog" variant="identity" prominent>
              <Dialog.Title>Prominent dialog</Dialog.Title>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <Popover.Root defaultOpen>
          <Popover.Trigger>anchor</Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner>
              <Popover.Popup variant="identity" prominent>
                <Popover.Title>Prominent popover</Popover.Title>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
      </AuraGlassProvider>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    for (const kind of ['dialog', 'popover']) {
      const popup = document.querySelector(`[data-ag-overlay="${kind}"]`);
      expect(popup).toBeTruthy();
      expect(popup!.getAttribute('data-ag-variant')).toBe('identity');
      expect(popup!.getAttribute('data-ag-prominent')).toBe('');
    }
  });

  it('fixture popover: Positioner→Popup structure, arrow part, portal root', async () => {
    render(<AuraGlassProvider><FixturePopover /></AuraGlassProvider>);
    await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
    const positioner = document.querySelector('[data-ag-part="positioner"]');
    const popup = document.querySelector('[data-ag-part="popup"]');
    const arrow = document.querySelector('[data-ag-part="arrow"]');
    expect(positioner).toBeTruthy();
    expect(popup).toBeTruthy();
    expect(positioner!.contains(popup)).toBe(true);
    expect(arrow).toBeTruthy();
    expect(popup!.getAttribute('data-ag-overlay')).toBe('popover');
    expect(popup!.getAttribute('data-ag-layer')).toBe('overlay');
    const layerRoot = document.querySelector('[data-ag-portal-root] [data-ag-layer-root="overlay"]');
    expect(layerRoot?.contains(positioner!)).toBe(true);
  });
});
