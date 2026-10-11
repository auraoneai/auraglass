/* CMP-205 (REQ-CMP-85): popup contract over the lane's real subjects plus the
   FixturePopover (a real Base UI Popover through our seam): positioner/popup/
   arrow parts, overlayMaterial attributes, portal target. */
import { describe, expect, it, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { Popover as BasePopover } from '@base-ui/react/popover';
import { AuraGlassProvider } from '../../../theme';
import { MOUNTED_SUBJECTS } from './__tests__/subjects';
import { defaultPositionerProps } from './positioning';
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

  /* REQ-CMP-85: anchored subjects share the one positioner contract. */
  it('defaultPositionerProps is the 8/8 collision contract', () => {
    expect(defaultPositionerProps.sideOffset).toBe(8);
    expect(defaultPositionerProps.collisionPadding).toBe(8);
    expect(defaultPositionerProps.collisionAvoidance).toEqual({ side: 'flip', align: 'shift' });
  });

  /* Behavioural half: the positioner Base UI renders carries the computed
     geometry. Its main-axis translate is the applied sideOffset, and
     --available-{width,height} shrink by 2 x collisionPadding. Each anchored
     subject is compared with a bare Base UI Popover given the literal 8/8
     props (independent of defaultPositionerProps). */
  function readGeometry(positioner: HTMLElement) {
    const match = /translate\((-?[\d.]+)px, (-?[\d.]+)px\)/u.exec(positioner.style.transform);
    const side = positioner.getAttribute('data-side');
    const mainAxis = match ? Math.abs(Number(side === 'left' || side === 'right' ? match[1] : match[2])) : null;
    return {
      side,
      mainAxisOffset: mainAxis,
      availableWidth: positioner.style.getPropertyValue('--available-width'),
      availableHeight: positioner.style.getPropertyValue('--available-height'),
    };
  }

  async function referenceGeometry() {
    const view = render(
      <BasePopover.Root defaultOpen>
        <BasePopover.Trigger>anchor</BasePopover.Trigger>
        <BasePopover.Portal>
          <BasePopover.Positioner
            data-testid="reference-positioner"
            sideOffset={8}
            collisionPadding={8}
            collisionAvoidance={{ side: 'flip', align: 'shift' }}
          >
            <BasePopover.Popup>reference</BasePopover.Popup>
          </BasePopover.Positioner>
        </BasePopover.Portal>
      </BasePopover.Root>,
    );
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    const geometry = readGeometry(document.querySelector<HTMLElement>('[data-testid="reference-positioner"]')!);
    view.unmount();
    return geometry;
  }

  const ANCHORED = ['Popover', 'Menu', 'Select', 'Combobox', 'Tooltip'] as const;

  it.each(ANCHORED)(
    '%s positioner applies sideOffset 8 / collisionPadding 8',
    async (name) => {
      const reference = await referenceGeometry();
      expect(reference.mainAxisOffset).toBe(8);
      const subject = MOUNTED_SUBJECTS.find((s) => s.name === name)!;
      render(subject.mount!());
      await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
      const popup = document.querySelector<HTMLElement>(subject.popupSelector)!;
      const geometry = readGeometry(popup.closest<HTMLElement>('[data-ag-part="positioner"]')!);
      expect(geometry.mainAxisOffset).toBe(defaultPositionerProps.sideOffset);
      expect(geometry.availableWidth).toBe(reference.availableWidth);
      expect(geometry.availableHeight).toBe(reference.availableHeight);
    },
  );

  it.each(ANCHORED)('%s popup carries data-side/data-align', async (name) => {
    const subject = MOUNTED_SUBJECTS.find((s) => s.name === name)!;
    render(subject.mount!());
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    const popup = document.querySelector(subject.popupSelector)!;
    expect(popup.getAttribute('data-side')).toBeTruthy();
    expect(popup.getAttribute('data-align')).toBeTruthy();
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
