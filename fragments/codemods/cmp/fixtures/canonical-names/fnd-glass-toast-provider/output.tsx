// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { Toast } from 'aura-glass';

export function X() {
  return <Toast.Provider timeout={4000}><Toast.Viewport position="top-center" />{app}</Toast.Provider>;
}
