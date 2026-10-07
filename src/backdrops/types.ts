/* Backdrop prop types — the discriminated union per preset (REQ-SURF-155). */
import * as React from 'react';

export type BackdropPreset = 'aurora' | 'mesh' | 'photo' | 'video' | 'grain';
export type BackdropScheme = 'light' | 'dark' | 'auto';
export type BackdropPalette = 'aurora' | 'prism' | 'ocean' | 'ember' | 'mono';
export type BackdropMotion = 'static' | 'drift';
export type BackdropToneProp = 'light' | 'dark';

export interface BackdropBase {
  /** 5-id palette; mono forces mono regardless of preset colours. */
  palette?: BackdropPalette | undefined;
  /** aurora/mesh only — declares data-ag-backdrop='light'|'dark'|'auto'. */
  scheme?: BackdropScheme | undefined;
  /** Explicit tone when sampling cannot run (SSR, CORS-less, no idle). */
  tone?: BackdropToneProp | undefined;
  /** Grain overlay on any preset. */
  grain?: boolean | undefined;
  /** 'drift' runs one keyframe under the continuous gate. Default 'static'. */
  motion?: BackdropMotion | undefined;
  /** position: fixed; never background-attachment: fixed. */
  fixed?: boolean | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
}

export interface BackdropPhotoProps extends BackdropBase {
  preset: 'photo';
  src: string;
  srcSet?: string | undefined;
  sizes?: string | undefined;
  crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
}

export interface BackdropVideoProps extends BackdropBase {
  preset: 'video';
  src: string;
  poster?: string | undefined;
  crossOrigin?: 'anonymous' | 'use-credentials' | '' | undefined;
}

export interface BackdropGraphicProps extends BackdropBase {
  preset: 'aurora' | 'mesh' | 'grain';
}

export type BackdropProps = BackdropPhotoProps | BackdropVideoProps | BackdropGraphicProps;
