'use client';
/* CommandPalette (SURF-085): CMP Dialog hosting Command. hotkey='mod+k' by
   default (false disables); exactly one document keydown listener per mounted
   palette. Opening focuses the input; closing restores the trigger's focus.
   No scrim/blur/material of its own. */

import * as React from 'react';
import { Dialog } from '../dialog';
import { Command } from './Command';
import type { toChangeDetails } from '../../foundation';
/** S-30 ChangeDetails, via the CMP foundation seam (no contracts/ specifier in src). */
type ChangeDetails = ReturnType<typeof toChangeDetails>;

const DialogRoot = Dialog.Root as React.FC<{
  open?: boolean;
  onOpenChange?: (open: boolean, details?: ChangeDetails) => void;
  children?: React.ReactNode;
}>;
const DialogContent = Dialog.Content as React.FC<Record<string, unknown> & { children?: React.ReactNode }>;

export type CommandPaletteProps = {
  open?: boolean | undefined;
  defaultOpen?: boolean | undefined;
  onOpenChange?: ((open: boolean, details: ChangeDetails) => void) | undefined;
  /** Global hotkey — 'mod+k' by default; pass false to disable. */
  hotkey?: string | false | undefined;
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
  children,
}: CommandPaletteProps) {
  const [internal, setInternal] = React.useState(defaultOpen ?? false);
  const isOpen = open ?? internal;
  const setOpen = React.useCallback(
    (next: boolean, details?: ChangeDetails) => {
      if (open === undefined) setInternal(next);
      onOpenChange?.(next, details ?? { event: undefined, reason: 'none' });
    },
    [open, onOpenChange],
  );

  // One document listener per mounted palette; toggles on the hotkey.
  React.useEffect(() => {
    if (hotkey === false) return;
    const onKey = (e: KeyboardEvent) => {
      if (hotkeyMatches(e, hotkey)) {
        e.preventDefault();
        setOpen(!isOpenRef.current, { event: e, reason: 'hotkey' });
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [hotkey, setOpen]);
  const isOpenRef = React.useRef(isOpen);
  isOpenRef.current = isOpen;

  return (
    <DialogRoot open={isOpen} onOpenChange={setOpen}>
      <DialogContent
        data-ag-part="command-palette"
        data-ag-size="lg"
        data-ag-placement="top"
        className="ag-command-palette"
      >
        {children ?? (
          <Command.Root>
            <Command.Input placeholder="Type a command…" />
            <Command.List />
          </Command.Root>
        )}
      </DialogContent>
    </DialogRoot>
  );
}
