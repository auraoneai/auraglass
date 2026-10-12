// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassCard } from 'aura-glass';
import { GlassWorkspacePanel } from 'aura-glass';

export function X() {
  return <GlassWorkspacePanel><GlassCard>x</GlassCard></GlassWorkspacePanel>;
}
