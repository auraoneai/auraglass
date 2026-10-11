'use client';
import * as React from 'react';
import { useNowPlaying } from '../npContext';

export const Artwork = function Artwork({src, className, ref}: { src?: string | undefined; className?: string } & { ref?: React.Ref<HTMLDivElement> }) {
    const m = useNowPlaying('Artwork');
    const s = src ?? m.artwork;
    return (
      <div ref={ref} data-ag-part="now-playing-artwork" className={['ag-now-playing-artwork', className].filter(Boolean).join(' ')}>
        {s ? <img src={s} alt="" aria-hidden="true" /> : null}
      </div>
    );
  };
