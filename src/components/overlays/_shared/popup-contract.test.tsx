/* CMP-205 (REQ-CMP-85): popup contract over the lane's real subjects plus the
   FixturePopover (a real Base UI Popover through our seam): positioner/popup/
   arrow parts, overlayMaterial attributes, portal target. */
import { describe, expect, it, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider } from '../../../theme';
import { MOUNTED_SUBJECTS } from './__tests__/subjects';
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
