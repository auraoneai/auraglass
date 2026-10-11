// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { SearchField } from 'aura-glass';

export function X() {
  return <SearchField value={q} onChange={e=>setQ(e.target.value)} />;
}
