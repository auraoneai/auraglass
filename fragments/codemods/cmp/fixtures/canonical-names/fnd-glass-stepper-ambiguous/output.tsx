// TODO(aura-glass 5): 'GlassStepper' is compat-only in 5.0 — imported from 'aura-glass/compat', see docs/auraglass-5/migrate/5.md#b-5
// @ts-nocheck — codemod fixture: intentionally unbound identifiers/imports
import { GlassStepper } from 'aura-glass/compat';

export function X() {
  return <GlassStepper {...v} />;
}
