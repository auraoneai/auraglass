// @ts-nocheck — negative fixture: intentionally-invalid input read as text by the gate under test.
// Frozen 4.x consumer usage — SURF/media case: LiquidGlassMediaControls +
// GlassVideoPlayer (do not "fix"; it is the test).
import { useState } from 'react';
import { LiquidGlassMediaControls, GlassVideoPlayer } from 'aura-glass';

export function PlayerPage() {
  const [playing, setPlaying] = useState(false);
  return (
    <>
      <GlassVideoPlayer sources={[{ src: '/film.mp4', type: 'video/mp4' }]} poster="/film.jpg" controls />
      <LiquidGlassMediaControls playing={playing} onPlayPause={() => setPlaying((p) => !p)} />
    </>
  );
}
