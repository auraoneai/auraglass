// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
// TODO(aura-glass 5): migrate to aura-glass/ai Thread/Message/Composer, see apps/docs/content/surf/migration/ai.md
import { GlassButton } from 'aura-glass';
import { GlassChat } from 'aura-glass/compat';

export function Support() {
  return <GlassChat footer={<GlassButton>Send</GlassButton>} />;
}
