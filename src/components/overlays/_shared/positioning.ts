/* CMP-193 (REQ-CMP-85/-97): the one positioner config every anchored popup uses.
   sideOffset 8 from the anchor, 8px viewport padding, flip side then shift
   alignment — identical to the contract's default collision strategy. */
export const defaultPositionerProps = {
  sideOffset: 8,
  collisionPadding: 8,
  collisionAvoidance: { side: 'flip', align: 'shift' },
} as const;
