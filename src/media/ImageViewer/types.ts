export interface ImageViewerItem {
  id: string;
  src: string;
  srcSet?: string | undefined;
  alt: string;
  caption?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
  /** Passed to the <img>; set it (with CORS headers) so tone sampling can read
   * cross-origin pixels. */
  crossOrigin?: 'anonymous' | 'use-credentials' | undefined;
}
