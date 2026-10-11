// TODO(aura-glass 5): removed in 5.0 (registry item 'media-gallery'), see apps/docs/content/surf/migration/media.md
// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassGallery } from 'aura-glass';

export const Photos = ({ images }) => <GlassGallery images={images} />;
