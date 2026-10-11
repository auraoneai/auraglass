// TODO(aura-glass 5): 'GlassChat' is compat-only in 5.0 — imported from 'aura-glass/compat', see docs/auraglass-5/migrate/5.md#b-5
// @ts-nocheck — frozen 4.x consumer usage of GlassChat (DEP-S0400), codemod input.
import { GlassChat } from 'aura-glass/compat';

export function Example() {
  return <GlassChat />;
}
