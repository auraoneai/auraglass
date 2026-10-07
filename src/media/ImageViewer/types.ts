export interface ImageViewerItem {
  id: string;
  src: string;
  srcSet?: string | undefined;
  alt: string;
  caption?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
}
