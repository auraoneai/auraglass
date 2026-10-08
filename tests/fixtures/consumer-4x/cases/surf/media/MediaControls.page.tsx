// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// Frozen 4.x consumer usage — SURF/media case: LiquidGlassMediaControls +
// GlassVideoPlayer + GlassAudioPlayer (do not "fix"; it is the test).
import { LiquidGlassMediaControls, GlassVideoPlayer, GlassAudioPlayer } from 'aura-glass';

export function PlayerPage() {
  return (
    <>
      <GlassVideoPlayer src="/film.mp4" poster="/film.jpg" controls />
      <GlassAudioPlayer src="/podcast.mp3" />
      <LiquidGlassMediaControls playing={false} onPlayPause={(p) => console.log(p)} />
    </>
  );
}
