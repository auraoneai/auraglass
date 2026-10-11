/* REQ-SURF-155..160 — Backdrop: the only public backdrop surface. Server
 * component (no 'use client'): decorative layer aria-hidden, content slot
 * z-1; declarations via data-ag-backdrop per preset; zero animations by
 * default; drift gated under [data-ag-continuous="on"]. */
import * as React from 'react';
import { BackdropTone } from './BackdropTone';

export type {
  BackdropPreset, BackdropScheme, BackdropPalette, BackdropMotion,
  BackdropToneProp, BackdropProps, BackdropPhotoProps, BackdropVideoProps,
  BackdropGraphicProps,
} from './types';
import type { BackdropPreset, BackdropProps, BackdropPhotoProps, BackdropVideoProps } from './types';

const PRESET_DECLARATION: Record<BackdropPreset, 'media' | null> = {
  photo: 'media', video: 'media', aurora: null, mesh: null, grain: null,
};

export const Backdrop = function Backdrop(props: BackdropProps & { ref?: React.Ref<HTMLDivElement> }) {
  const { ref } = props;
  const {
    preset, palette = 'aurora', scheme = 'auto', mediaTone, grain = false,
    motion = 'static', fixed = false, className, children, ...rest
  } = props;
  const declaration =
    PRESET_DECLARATION[preset] === 'media' ? 'media'
      : preset === 'aurora' || preset === 'mesh' ? scheme
        : undefined;
  const isMedia = preset === 'photo' || preset === 'video';
  const layer: React.ReactNode =
    preset === 'photo'
      ? <img aria-hidden="true" alt="" src={(props as BackdropPhotoProps).src}
          srcSet={(props as BackdropPhotoProps).srcSet} sizes={(props as BackdropPhotoProps).sizes}
          crossOrigin={(props as BackdropPhotoProps).crossOrigin || undefined}
          decoding="async" fetchPriority="low" />
      : preset === 'video'
        ? <video aria-hidden="true" muted playsInline loop disablePictureInPicture
            preload="metadata" poster={(props as BackdropVideoProps).poster}
            crossOrigin={(props as BackdropVideoProps).crossOrigin || undefined}
            src={(props as BackdropVideoProps).src} />
        : null;
  return (
    <div
      ref={ref}
      className={['ag-backdrop', fixed ? 'ag-backdrop--fixed' : undefined, className].filter(Boolean).join(' ')}
      data-ag-backdrop-preset={preset}
      data-ag-palette={palette}
      {...(declaration !== undefined ? { 'data-ag-backdrop': declaration } : {})}
      {...(mediaTone !== undefined ? { 'data-ag-media-tone': mediaTone } : {})}
      {...(isMedia ? { 'data-ag-media-root': '' } : {})}
      data-ag-backdrop-grain={grain ? '' : undefined}
      data-ag-motion={motion}
      {...rest}
    >
      <div className="ag-backdrop-layer" data-ag-part="backdrop-layer" aria-hidden="true">
        {layer}
      </div>
      {preset === 'video' ? <BackdropTone /> : null}
      {children !== undefined && children !== null ? (
        <div className="ag-backdrop-content" data-ag-part="backdrop-content">{children}</div>
      ) : null}
    </div>
  );
};
