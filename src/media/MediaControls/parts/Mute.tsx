'use client';
/* REQ-SURF-138 — Mute toggle: constant label, aria-pressed = muted. */
import * as React from 'react';
import { Volume2Icon } from '../../../icons/action/volume-2';
import { VolumeXIcon } from '../../../icons/action/volume-x';
import { useMediaLayout, useMediaModel, useRegisterPart } from '../mediaContext';
import { MediaToolbarButton } from './ToolbarButton';

/** The bare toggle (also rendered by Volume below 480 px). */
export function MuteToggle({ className, ref }: { className?: string | undefined; ref?: React.Ref<HTMLButtonElement> | undefined }) {
  const m = useMediaModel('Mute');
  return (
    <MediaToolbarButton
      ref={ref}
      className={className}
      data-ag-part="media-mute"
      label="Mute"
      aria-pressed={m.muted}
      icon={m.muted ? <VolumeXIcon /> : <Volume2Icon />}
      onClick={() => m.setMuted(!m.muted)}
    />
  );
}

export function Mute(props: { className?: string | undefined; ref?: React.Ref<HTMLButtonElement> | undefined }) {
  useRegisterPart('mute');
  const { size } = useMediaLayout();
  if (size === 'minimal') return null;
  return <MuteToggle {...props} />;
}
