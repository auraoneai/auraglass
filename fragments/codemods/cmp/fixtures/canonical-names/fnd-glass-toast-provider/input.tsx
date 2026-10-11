// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassToastProvider } from 'aura-glass';

export function X() {
  return <GlassToastProvider position="top" duration={4000}>{app}</GlassToastProvider>;
}
