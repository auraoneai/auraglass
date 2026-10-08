// @ts-nocheck
import { LiquidGlassMediaControls } from 'aura-glass';

export function Player() {
  return <LiquidGlassMediaControls playing={false} onPlayPause={(p: boolean) => console.log(p)} compact />;
}
