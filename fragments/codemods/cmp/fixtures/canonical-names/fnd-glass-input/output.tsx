// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { TextField } from 'aura-glass';

export function X() {
  return <TextField label="Name" value={n} onChange={e=>setN(e.target.value)} />;
}
