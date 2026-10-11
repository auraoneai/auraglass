'use client';
/* REQ-SURF-138 — PiP toggle. Below 480 px it moves into the "More" menu
 * rendered by Root (REQ-SURF-135). */
import * as React from 'react';
import { MonitorIcon } from '../../../icons/action/monitor';
import { useMediaLayout, useMediaModel, useRegisterPart } from '../mediaContext';
import { MediaToolbarButton } from './ToolbarButton';

export function PictureInPicture({ className, ref }: { className?: string | undefined; ref?: React.Ref<HTMLButtonElement> | undefined }) {
  useRegisterPart('pip');
  const m = useMediaModel('PictureInPicture');
  const { size } = useMediaLayout();
  if (size !== 'full') return null;
  return (
    <MediaToolbarButton
      ref={ref}
      className={className}
      data-ag-part="media-pip"
      label="Picture in picture"
      aria-pressed={m.pictureInPicture}
      icon={<MonitorIcon />}
      onClick={() => m.requestPictureInPicture()}
    />
  );
}
