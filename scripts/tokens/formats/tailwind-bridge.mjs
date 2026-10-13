// Tailwind has one producer for token-only and full package builds (REQ-PLAT-75).
// MAT supplies the resolved MaterialSpec so utility scalars match ladders.css.
import { buildBridge } from '../../build/gen-tailwind-bridge.mjs';
import { emitManifest } from './manifest.mjs';

export async function emitTailwind(cells, records, resolved) {
  return buildBridge(JSON.parse(emitManifest(records, cells, [])), resolved.get('material.material'));
}
