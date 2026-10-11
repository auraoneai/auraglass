// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// Frozen 4.x consumer usage — GlassCarousel + GlassGallery + GlassImageViewer.
import { GlassCarousel, GlassGallery, GlassImageViewer } from 'aura-glass';

const imgs = ['/a.jpg', '/b.jpg', '/c.jpg'];

export function GalleryPage() {
  return (
    <>
      <GlassGallery images={imgs} columns={3} />
      <GlassCarousel slidesToShow={2} autoPlay infinite>
        {imgs.map((s) => <img key={s} src={s} alt="" />)}
      </GlassCarousel>
      <GlassImageViewer images={imgs} index={0} />
    </>
  );
}
