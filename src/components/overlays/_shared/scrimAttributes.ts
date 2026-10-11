/* Modal scrim attributes for the overlay backdrops (Dialog, AlertDialog,
   Sheet). The backdrops never carried [data-ag-layer="scrim"], so the MAT
   scrim rule (colour + backdrop blur capped at 12px) never applied and modal
   scrims had no blur at all. The attribute is MAT-owned (S-01 setter MAT), so
   the names come from the MAT setter path. */
import { scrimAttributes } from '../../../material/stateAttributes';

export const SCRIM_ATTRIBUTES = Object.freeze(scrimAttributes());
