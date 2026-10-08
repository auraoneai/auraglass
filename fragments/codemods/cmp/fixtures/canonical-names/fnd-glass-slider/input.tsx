// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassSlider } from 'aura-glass';

export function X() {
  return <GlassSlider value={v} onChange={e=>setV(Number(e.target.value))} />;
}
