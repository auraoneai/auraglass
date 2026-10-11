// @ts-nocheck — fixture resident read by the gate under test.
// Kbd is a root value export (src/root/cmp.ts), enumerated from the real
// build/exports.manifest.json entry source by the gate.
import { warnLabsPromoted } from "../../_internal/warn-once";
warnLabsPromoted("Kbd");
export { Kbd } from "aura-glass";
