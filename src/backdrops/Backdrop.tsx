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

export const Backdrop = React.forwardRef<HTMLDivElement, BackdropProps>(function Backdrop(
  props, ref,
) {
  const {
    preset, palette = 'aurora', scheme = 'auto', tone, grain = false,
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
      className={[
        'ag-backdrop',
        fixed ? 'ag-backdrop--fixed' : undefined,
        // REQ-SURF-190: the drift opt-in is a class, never `data-ag-motion`.
        // That attribute is the MAT preference axis (full|calm|none, setter
        // MAT); writing 'static'/'drift' on the backdrop shadowed the resolved
        // motion for nearest-carrier readers inside it.
        motion === 'drift' ? 'ag-backdrop--drift' : undefined,
        className,
      ].filter(Boolean).join(' ')}
      data-ag-backdrop-preset={preset}
      data-ag-palette={palette}
      {...(declaration !== undefined ? { 'data-ag-backdrop': declaration } : {})}
      {...(tone !== undefined ? { 'data-ag-media-tone': tone } : {})}
      {...(isMedia ? { 'data-ag-media-root': '' } : {})}
      data-ag-backdrop-grain={grain ? '' : undefined}
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
});
