'use client';
/* CommandPalette (SURF-085, REQ-FIN-07 transfer / REQ-FIN-82): a modal
   Base UI Dialog hosting Command.
   - Layering: registers with the S-25 LayerStack through `useLayer`
     ({ kind: 'command-palette', modal: true }) and portals into the shared
     overlay layer root from `usePortalContainer('overlay')` — no own portal
     root, no document Escape/pointer listeners, no body styles.
   - Escape: one keypress closes one layer. The palette's entry hands the key
     back to the focused content (`onEscape` returns false) so Command's input
     clears a non-empty query first; an unconsumed Escape inside the popup
     closes the palette. Base UI's own escape dismissal is ignored, so a
     layer stacked above the palette (it is then the top entry) takes the key
     and the palette stays open.
   - Chrome: overlay/thick Surface material on the popup and a clear scrim
     (--ag-scrim-clear); the input takes initial focus; focus returns to the
     opener on close.
   - hotkey='mod+k' by default (false disables): one document keydown listener
     per mounted palette. The foundation seam that replaces it
     (useGlobalHotkey, #326) is not on `next` yet. */

import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { useLayer, usePortalContainer } from '../../theme';
import { materialProps } from '../../material/materialProps';
import { Command } from './Command';

// Base UI Dialog.Root renders no element (no data-ag-part to carry); the
// palette's DOM parts are portal, scrim and command-palette.
const DialogRoot = BaseDialog.Root;

export type CommandPaletteProps = {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  /** Global hotkey — 'mod+k' by default; pass false to disable. */
  hotkey?: string | false | undefined;
  /** Accessible name of the dialog (default 'Command palette'). */
  'aria-label'?: string | undefined;
  children?: React.ReactNode;
};

function hotkeyMatches(e: KeyboardEvent, hotkey: string): boolean {
  const [mod, key] = hotkey.split('+');
  if (mod === 'mod' && !(e.metaKey || e.ctrlKey)) return false;
  return e.key.toLowerCase() === (key ?? '').toLowerCase();
}

export function CommandPalette({
  open,
  defaultOpen,
  onOpenChange,
  hotkey = 'mod+k',
  'aria-label': ariaLabel = 'Command palette',
  children,
}: CommandPaletteProps) {
  const [internal, setInternal] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? internal;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (open === undefined) setInternal(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );
  const isOpenRef = React.useRef(isOpen);
  isOpenRef.current = isOpen;

  // One document listener per mounted palette; toggles on the hotkey.
  React.useEffect(() => {
    if (hotkey === false) return;
    const onKey = (e: KeyboardEvent) => {
      if (hotkeyMatches(e, hotkey)) {
        e.preventDefault();
        setOpen(!isOpenRef.current);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [hotkey, setOpen]);

  const container = usePortalContainer('overlay');
  const [popup, setPopup] = React.useState<HTMLElement | null>(null);
  const layer = useLayer({
    kind: 'command-palette',
    modal: true,
    open: isOpen,
    element: popup,
    // The key goes to the focused palette content (see header).
    onEscape: () => false,
  });
  const isTopRef = React.useRef(layer.isTop);
  isTopRef.current = layer.isTop;

  const onPopupKeyDown = (e: React.KeyboardEvent) => {
    // Command's input calls preventDefault when Escape cleared its query.
    // Only while the palette is the top layer: a layer stacked above it owns
    // the key.
    if (e.key === 'Escape' && !e.defaultPrevented && !e.nativeEvent.isComposing && isTopRef.current) {
      e.preventDefault();
      e.stopPropagation();
      setOpen(false);
    }
  };

  const initialFocus = React.useCallback(
    () => popup?.querySelector<HTMLElement>('[data-ag-part="input"]') ?? true,
    [popup],
  );

  return (
    <DialogRoot
      open={isOpen}
      modal
      onOpenChange={(next, details) => {
        // Escape is owned by the layer stack + the popup handler above.
        if (!next && details?.reason === 'escape-key') return;
        setOpen(next);
      }}
    >
      {/* null = no provider: Base UI's default container (S-23 fallback). */}
      <BaseDialog.Portal data-ag-part="portal" {...(container ? { container } : {})}>
        <BaseDialog.Backdrop data-ag-part="scrim" data-ag-scrim="" className="ag-command-palette__scrim" />
        <BaseDialog.Popup
          ref={setPopup}
          aria-label={ariaLabel}
          initialFocus={initialFocus}
          data-ag-part="command-palette"
          data-ag-size="lg"
          data-ag-placement="top"
          data-state={isOpen ? 'open' : 'closed'}
          {...materialProps({ layer: 'overlay', thickness: 'thick' })}
          className="ag-surface ag-command-palette"
          onKeyDown={onPopupKeyDown}
        >
          {children ?? (
            <Command.Root>
              <Command.Input placeholder="Type a command…" />
              <Command.List />
            </Command.Root>
          )}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </DialogRoot>
  );
}
