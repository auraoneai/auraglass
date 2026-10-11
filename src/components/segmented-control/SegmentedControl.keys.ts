/** Recorded pin behaviour (BU 1.8.0) for REQ-CMP-43: SegmentedControl is a
 * radiogroup — arrows move AND select with wrap; Home/End bound to first/last;
 * Space never deselects the checked item. The APG spec imports this table —
 * a change here means the pinned Base UI keyboard contract changed. */
export const SEGMENTED_KEYS = {
  /** ArrowRight/Down from item i selects i+1 (roving+select-on-move). */
  arrowsMoveAndSelect: true,
  /** ArrowRight on the last item wraps to the first. */
  arrowWraps: true,
  /** Home selects the first item; End selects the last. */
  homeEndBound: true,
  /** Pressing Space/Enter on the checked item keeps aria-checked=true. */
  spaceNeverDeselects: true,
  /** Exactly one tab stop (the checked item) at all times. */
  oneTabStop: true,
} as const;
