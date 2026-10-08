// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { LiquidGlassSearchField } from 'aura-glass';

export function X() {
  return <LiquidGlassSearchField value={q} onChange={e=>setQ(e.target.value)} />;
}
