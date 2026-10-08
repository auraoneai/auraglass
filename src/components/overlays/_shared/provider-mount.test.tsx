/* CMP-246 (REQ-CMP-99): with a real AuraGlassProvider the overlay subjects
   resolve the layered portal roots (no fallback warning), the announcer is
   live, and subjects register on the layer stack. Cross-lane seams (Tooltip
   no-Provider, useToast without wrapper) stay PENDING until 3f/3i. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, act } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider, useAnnouncer } from '../../../theme';
import { MOUNTED_SUBJECTS, SEAM_SUBJECTS } from './__tests__/subjects';
import { Tooltip } from '../../tooltip/index';
import { Toast, useToast } from '../../toast/index';
import { screen, fireEvent } from '@testing-library/react';
import { Dialog } from '../../dialog/index';

function AnnouncerProbe() {
  const { announce } = useAnnouncer();
  return <button data-testid="announce" onClick={() => announce('probe-polite')}>announce</button>;
}

function BareToastInner() {
  const t = useToast();
  return (
    <>
      <button onClick={() => t.info({ title: 'hi' })}>add</button>
      <Toast.Viewport>
        {t.toasts.map((toast) => (
          <Toast.Root key={toast.id} toast={toast}><Toast.Title>{toast.title}</Toast.Title></Toast.Root>
        ))}
      </Toast.Viewport>
    </>
  );
}
function BareToastHost() {
  return (
    <Toast.Provider>
      <BareToastInner />
    </Toast.Provider>
  );
}

describe('provider mount (CMP-246)', () => {
  beforeEach(() => {
    if (window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
    document.querySelectorAll('[data-ag-portal-root]').forEach((n) => n.remove());
  });
  afterEach(() => { jest.restoreAllMocks(); });

  it.each(MOUNTED_SUBJECTS.map((s) => [s.name, s] as const))(
    '%s under AuraGlassProvider: layered portal, no fallback warning, announcer live',
    async (_name, subject) => {
      const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
      render(
        <AuraGlassProvider>
          <AnnouncerProbe />
          {subject.mount!()}
        </AuraGlassProvider>,
      );
      await act(async () => { await new Promise((r) => setTimeout(r, 30)); });
      const layerRoot = document.querySelector(`[data-ag-portal-root] [data-ag-layer-root="${subject.layerRoot}"]`);
      const popup = document.querySelector(subject.popupSelector);
      expect(layerRoot?.contains(popup!)).toBe(true);
      expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('no AuraGlassProvider'));
      const { getByTestId } = await import('@testing-library/react').then(() => ({ getByTestId: (id: string) => document.querySelector(`[data-testid="${id}"]`)! }));
      (getByTestId('announce') as HTMLElement).click();
      await act(async () => {});
      const live = document.querySelector('[data-ag-announcer] [aria-live="polite"]');
      expect(live?.textContent).toBe('probe-polite');
    },
  );

  it('closed Dialog inside provider keeps popup out of the DOM', () => {
    render(
      <AuraGlassProvider>
        <Dialog.Root>
          <Dialog.Trigger>Open</Dialog.Trigger>
          <Dialog.Portal><Dialog.Popup aria-label="x"><Dialog.Title>t</Dialog.Title></Dialog.Popup></Dialog.Portal>
        </Dialog.Root>
      </AuraGlassProvider>,
    );
    expect(document.querySelector('[data-ag-part="popup"]')).toBeNull();
  });

  it('Tooltip.Root opens on hover without an enclosing Tooltip.Provider', async () => {
    jest.useFakeTimers();
    render(
      <Tooltip.Root>
        <Tooltip.Trigger>bare</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner><Tooltip.Popup>hint</Tooltip.Popup></Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>,
    );
    const trigger = screen.getByText('bare');
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseMove(trigger);
    act(() => { jest.advanceTimersByTime(700); });
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="popup"]')).not.toBeNull();
    jest.useRealTimers();
  });

  it('useToast() works inside a bare Toast.Provider (portal falls back to body)', async () => {
    render(<BareToastHost />);
    fireEvent.click(screen.getByText('add'));
    await act(async () => {});
    expect(document.querySelector('[data-ag-part="root"]')).not.toBeNull();
  });
});
