'use client';
import * as React from 'react';
import { useMediaModel } from '../mediaContext';

export const PictureInPicture = function PictureInPicture({className, ref}: { className?: string } & { ref?: React.Ref<HTMLButtonElement> }) {
  const m = useMediaModel('PictureInPicture');
  return (
    <button
        type="button"
        role="button"
        tabIndex={0}
      ref={ref}
      className={['ag-media-btn', className].filter(Boolean).join(' ')}
      data-ag-part="media-pip"
      aria-pressed={m.pictureInPicture}
      aria-label="Picture in picture"
      onClick={() => m.requestPictureInPicture()}
    >
      <span aria-hidden="true">◱</span>
    </button>
  );
};
