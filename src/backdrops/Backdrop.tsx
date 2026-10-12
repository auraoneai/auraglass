/* REQ-SURF-155..160 — Backdrop: the only public backdrop surface. Server
 * component (no 'use client'): decorative layer aria-hidden, content slot
 * z-1; declarations via data-ag-backdrop per preset; zero animations by
 * default; drift gated under [data-ag-continuous="on"]. */
import * as React from 'react';
import { BackdropDriftLayer, BackdropMediaLayer } from './BackdropTone';

export type {
  BackdropPreset, BackdropScheme, BackdropPalette, BackdropMotion,
  BackdropToneProp, BackdropProps, BackdropPhotoProps, BackdropVideoProps,
  BackdropGraphicProps,
} from './types';
import type { BackdropPreset, BackdropProps, BackdropPhotoProps, BackdropVideoProps } from './types';

const PRESET_DECLARATION: Record<BackdropPreset, 'media' | null> = {
  photo: 'media', video: 'media', aurora: null, mesh: null, grain: null,
};

export const Backdrop = function Backdrop(props: BackdropProps & {
  /** Ref to the rendered root element. */
  ref?: React.Ref<HTMLDivElement> }) {
  const { ref } = props;
  const {
    preset, palette = 'aurora', scheme = 'auto', mediaTone, grain = false,
    motion = 'static', fixed = false, className, children,
    // per-preset media props are read below through the union; pull them out
    // of `rest` so none of them ever lands on the root <div> (REQ-SURF-155)
    src: _src, srcSet: _srcSet, sizes: _sizes, poster: _poster, crossOrigin: _crossOrigin,
    ...rest
  } = props as BackdropProps & Partial<Omit<BackdropPhotoProps, 'preset'> & Omit<BackdropVideoProps, 'preset'>>;
  const drift = motion === 'drift';
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
        drift ? 'ag-backdrop--drift' : undefined,
        className,
      ].filter(Boolean).join(' ')}
      data-ag-backdrop-preset={preset}
      data-ag-palette={palette}
      {...(declaration !== undefined ? { 'data-ag-backdrop': declaration } : {})}
      {...(mediaTone !== undefined ? { 'data-ag-media-tone': mediaTone } : {})}
      {...(isMedia ? { 'data-ag-media-root': '' } : {})}
      // REQ-SURF-160: the grain preset is the overlay alone; any other preset
      // adds it with grain={true}
      data-backdrop-grain={grain || preset === 'grain' ? '' : undefined}
      data-backdrop-motion={motion}
      {...rest}
    >
      {isMedia ? (
        <BackdropMediaLayer
          sample={mediaTone === undefined}
          source={(props as BackdropPhotoProps | BackdropVideoProps).src}
          video={preset === 'video'}
          drift={drift}
        >
          {layer}
        </BackdropMediaLayer>
      ) : drift ? (
        <BackdropDriftLayer />
      ) : (
        <div className="ag-backdrop-layer" data-ag-part="backdrop-layer" aria-hidden="true" />
      )}
      {children !== undefined && children !== null ? (
        <div className="ag-backdrop-content" data-ag-part="backdrop-content">{children}</div>
      ) : null}
    </div>
  );
};
