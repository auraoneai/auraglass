// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { useToast } from 'aura-glass';

export function useX() {
  const { addToast, removeToast } = useToast();
  return { addToast, removeToast };
}
