// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { useToast } from 'aura-glass';

export function useX() {
  const t = useToast();
  return t.add;
}
