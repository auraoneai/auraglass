/* REQ-SURF-155 discriminated-union props. tsc-only. */
import type { BackdropProps, BackdropPhotoProps, BackdropVideoProps } from '../../../src/backdrops/index';
import { Backdrop } from '../../../src/backdrops/index';

const photo: BackdropPhotoProps = { preset: 'photo', src: '/x.jpg', palette: 'aurora' };
const video: BackdropVideoProps = { preset: 'video', src: '/v.mp4', poster: '/p.jpg', motion: 'drift' };
const aurora: BackdropProps = { preset: 'aurora', scheme: 'auto', grain: true, fixed: true };

// @ts-expect-error photo requires src
const noSrcPhoto: BackdropPhotoProps = { preset: 'photo' };
// @ts-expect-error video requires src
const noSrcVideo: BackdropVideoProps = { preset: 'video' };
// @ts-expect-error unknown preset
const badPreset: BackdropProps = { preset: 'hologram' };
// @ts-expect-error unknown palette
const badPalette: BackdropProps = { preset: 'mesh', palette: 'neon' };
// @ts-expect-error motion only static|drift
const badMotion: BackdropProps = { preset: 'grain', motion: 'warp' };

export { Backdrop, photo, video, aurora, noSrcPhoto, noSrcVideo, badPreset, badPalette, badMotion };
