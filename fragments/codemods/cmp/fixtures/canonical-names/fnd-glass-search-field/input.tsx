// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassSearchField } from 'aura-glass';

export function X() {
  return <GlassSearchField value={q} onChange={e=>setQ(e.target.value)} />;
}
