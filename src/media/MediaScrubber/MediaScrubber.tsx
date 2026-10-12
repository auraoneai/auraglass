'use client';
/* REQ-SURF-136 — MediaScrubber on the CMP Slider seam (src/components/slider,
 * S-30) with the media slider parts (MediaSliderParts). Buffered ranges and
 * chapter markers are layers whose only inline style is --_ag-start/--_ag-end.
 * aria-valuetext on the thumb input is spoken "X of Y". Dragging seeks at most
 * once per animation frame (the CMP Slider coalesces pointer changes through
 * the S-13 ticker, REQ-CMP-16) and commits once (onValueCommit). The thumb
 * carries transient glass only while data-dragging (set when the pointer
 * presses the control, cleared on commit); at a coarse pointer the time
 * tooltip sits above the thumb while dragging. , and . step one frame, only
 * while `paused`. */
import * as React from 'react';
import { Slider } from '../../components/slider';
import { formatMediaTime } from '../formatMediaTime';
import { BufferedLayer } from './BufferedLayer';
import { ChapterMarkers } from './ChapterMarkers';
import { MediaSliderParts, SliderToolbarItem } from './MediaSliderParts';
/* S-30 ChangeDetails from the public contract module, so the emitted d.ts never
   names the private foundation seam (REQ-CMP-01). */
import type { ChangeDetails } from '../../contracts/components';

export interface MediaScrubberProps {
  value: number;
  max: number;
  /** Seeks while dragging/keying; called at most once per animation frame. */
  onValueChange?: ((value: number, details: ChangeDetails) => void) | undefined;
  /** Fires once when the drag or key interaction commits. */
  onValueCommit?: ((value: number) => void) | undefined;
  buffered?: [number, number][] | undefined;
  chapters?: { start: number; title: string }[] | undefined;
  /** Seconds per small arrow step. Default 1. */
  step?: number | undefined;
  /** Seconds per PageUp/Down. Default 10. */
  largeStep?: number | undefined;
  /** With `paused`, , and . step one frame (1/frameRate s). */
  frameRate?: number | undefined;
  /** Frame stepping applies only while paused. Default false. */
  paused?: boolean | undefined;
  formatHoverTime?: ((seconds: number) => string) | undefined;
  'aria-label'?: string | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
  /** Set by MediaControls: the thumb joins the toolbar's roving focus. */
  toolbarItem?: boolean | undefined;
  ref?: React.Ref<HTMLDivElement> | undefined;
}

export function scrubberValueText(value: number, max: number): string {
  const v = formatMediaTime(value, { spoken: true });
  const d = formatMediaTime(max, { spoken: true });
  return `${v} of ${d}`;
}

export function MediaScrubber(props: MediaScrubberProps) {
  const {
    value, max, onValueChange, onValueCommit, buffered = [], chapters = [],
    step = 1, largeStep = 10, frameRate, paused = false, formatHoverTime = formatMediaTime,
    className, disabled, toolbarItem, ref,
    'aria-label': ariaLabel = 'Seek',
  } = props;
  const [hoverTime, setHoverTime] = React.useState<number | null>(null);
  const [dragging, setDragging] = React.useState(false);
  // value shown while dragging, before the parent's (frame-coalesced) seek lands
  const [dragValue, setDragValue] = React.useState<number | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const safeMax = Number.isFinite(max) && max > 0 ? max : 0;
  const pct = (s: number) => (safeMax > 0 ? Math.min(100, Math.max(0, (s / safeMax) * 100)) : 0);
  const shown = dragValue ?? value;

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Base UI owns the standard slider keys; , and . frame-step only while paused.
    if (e.key === ',' || e.key === '.') {
      if (!frameRate || !paused) return;
      const dt = (1 / frameRate) * (e.key === '.' ? 1 : -1);
      onValueChange?.(Math.min(safeMax, Math.max(0, value + dt)), { event: e.nativeEvent, reason: 'keyboard' });
      e.preventDefault();
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const el = rootRef.current;
    if (!el || safeMax <= 0) { setHoverTime(null); return; }
    const r = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / Math.max(1, r.width)));
    setHoverTime(x * safeMax);
  };

  // The drag gesture starts when the primary pointer presses the slider
  // control; Base UI ends it with onValueCommitted on release.
  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled || e.button !== 0) return;
    if (!(e.target as Element | null)?.closest?.('[data-ag-part="control"]')) return;
    setDragging(true);
  };

  const tooltipTime = dragging ? shown : hoverTime;

  return (
    <div
      ref={(node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={['ag-media-scrubber', className].filter(Boolean).join(' ')}
      data-ag-part="media-scrubber"
      {...(dragging ? { 'data-dragging': '' } : {})}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerLeave={() => setHoverTime(null)}
    >
      {/* buffered + chapter layers — inline style carries only --_ag-start/--_ag-end */}
      {buffered.map(([s, e], i) => <BufferedLayer key={i} start={s} end={e} max={safeMax} />)}
      <ChapterMarkers chapters={chapters} max={safeMax} />
      <SliderToolbarItem enabled={toolbarItem}>
      <Slider.Root
        value={shown}
        min={0}
        max={safeMax}
        step={step}
        largeStep={largeStep}
        {...(disabled !== undefined ? { disabled } : {})}
        aria-label={ariaLabel}
        onValueChange={(v, details) => {
          const n = Array.isArray(v) ? v[0]! : v;
          // contract reason 'pointer' = Base UI track-press/drag, already
          // coalesced to <=1 call per frame by the CMP Slider; the gesture
          // runs until onValueCommitted (keyboard steps never drag)
          if (details.reason === 'pointer') {
            if (!dragging) setDragging(true);
            setDragValue(n);
          }
          onValueChange?.(n, details);
        }}
        onValueCommitted={(v) => {
          const n = Array.isArray(v) ? v[0]! : v;
          setDragging(false);
          setDragValue(null);
          onValueCommit?.(n);
        }}
      >
        <MediaSliderParts
          aria-label={ariaLabel}
          dragging={dragging}
          getAriaValueText={(_f, v) => scrubberValueText(v, safeMax)}
        />
      </Slider.Root>
      </SliderToolbarItem>
      {tooltipTime !== null ? (
        <span
          data-ag-part="media-scrubber-tooltip"
          aria-hidden="true"
          style={{ '--_ag-start': `${pct(tooltipTime)}%` } as React.CSSProperties}
        >
          {formatHoverTime(tooltipTime)}
        </span>
      ) : null}
    </div>
  );
}
