'use client';
/* Rate cycles through RATES; below 480 px it moves into the "More" menu
 * rendered by Root (REQ-SURF-135). */
import * as React from 'react';
import { useMediaLayout, useMediaModel, useRegisterPart } from '../mediaContext';
import { RATES } from '../shortcuts';
import { MediaToolbarButton } from './ToolbarButton';

export function nextRate(rate: number): number {
  const i = RATES.findIndex((r) => r > rate + 1e-9);
  return i === -1 ? RATES[0]! : RATES[i]!;
}

export function formatRate(rate: number): string {
  return `${Number(rate.toFixed(2))}×`;
}

export function Rate({ className, ref }: { className?: string | undefined; ref?: React.Ref<HTMLButtonElement> | undefined }) {
  useRegisterPart('rate');
  const m = useMediaModel('Rate');
  const { size } = useMediaLayout();
  if (size !== 'full') return null;
  return (
    <MediaToolbarButton
      ref={ref}
      className={className}
      data-ag-part="media-rate"
      label={`Playback rate ${formatRate(m.playbackRate)}`}
      icon={<span aria-hidden="true">{formatRate(m.playbackRate)}</span>}
      onClick={() => m.setRate(nextRate(m.playbackRate))}
    />
  );
}
