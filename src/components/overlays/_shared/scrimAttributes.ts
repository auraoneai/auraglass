/* Modal scrim attributes (REQ-MAT-31 scrim hand-off). material.css styles the
   overlay owner's scrim through [data-ag-layer="scrim"] (backdrop blur capped
   at 12px) and zeroes the blur on any scrim without data-overlay-top. The
   backdrops never emitted either attribute, so the MAT rule never applied and
   modal scrims had no blur at all.

   Base UI renders no Backdrop for a dialog nested inside another dialog, so
   the one rendered scrim is always the top scrim. */
export const SCRIM_ATTRIBUTES: Readonly<Record<string, string>> = Object.freeze({
  'data-ag-layer': 'scrim',
  'data-overlay-top': '',
});
