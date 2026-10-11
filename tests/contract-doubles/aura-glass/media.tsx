import { comp, compound } from './_factory';
export const NowPlayingBar = compound('NowPlayingBar');
export const ImageViewer = compound('ImageViewer');
export const MediaControls = compound('MediaControls');
export function useMediaElement() {
  return { playing: false, currentTime: 0, duration: 0, volume: 1, muted: false };
}
export function formatMediaTime(s: number) { return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`; }
export type MediaHandle = { play(): void; pause(): void };
