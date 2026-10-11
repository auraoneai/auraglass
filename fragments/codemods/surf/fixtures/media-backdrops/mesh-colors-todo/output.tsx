// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
// TODO(aura-glass 5): GlassMeshGradient colors[] has no 5.0 prop; mesh palettes come from S-03 colours, see apps/docs/content/surf/migration/media.md
import { Backdrop } from 'aura-glass/backdrops';

export function Hero() {
  return <Backdrop preset="mesh"><h1>x</h1></Backdrop>;
}
