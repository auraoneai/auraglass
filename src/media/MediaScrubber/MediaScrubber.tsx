'use client';
/* REQ-SURF-136 — MediaScrubber on the CMP Slider seam (src/components/slider,
 * S-30) with the media slider parts (MediaSliderParts). Buffered ranges and
 * chapter markers are layers whose only inline style is --_ag-start/--_ag-end.
 * aria-valuetext on the thumb input is spoken "X of Y". Dragging seeks at most
 * once per animation frame (onValueChange coalesced through
 * requestAnimationFrame) and commits once (onValueCommit). The thumb carries
 * transient glass only while data-dragging; at a coarse pointer the time
 * tooltip sits above the thumb while dragging. , and . step one frame, only
 * while `paused`. */
import * as React from 'react';
import { Slider } from '../../components/slider';
import { formatMediaTime } from '../formatMediaTime';
import { BufferedLayer } from './BufferedLayer';
import { ChapterMarkers } from './ChapterMarkers';
import { MediaSliderParts, SliderToolbarItem } from './MediaSliderParts';

export interface MediaScrubberProps {
  value: number;
  max: number;
  /** Seeks while dragging/keying; called at most once per animation frame. */
  onValueChange?: ((value: number) => void) | undefined;
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

/** Coalesces a value stream to ≤1 call per animation frame; flush() delivers
 * the pending value synchronously (used on commit). */
export function useFrameCoalesced(cb: ((v: number) => void) | undefined) {
  const cbRef = React.useRef(cb);
  cbRef.current = cb;
  const pending = React.useRef<{ v: number } | null>(null);
  const raf = React.useRef<number | null>(null);
  const cancel = React.useCallback(() => {
    if (raf.current !== null) { cancelAnimationFrame(raf.current); raf.current = null; }
  }, []);
  const flush = React.useCallback(() => {
    cancel();
    const p = pending.current;
    pending.current = null;
    if (p) cbRef.current?.(p.v);
  }, [cancel]);
  const push = React.useCallback((v: number) => {
    pending.current = { v };
    if (raf.current === null) {
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        const p = pending.current;
        pending.current = null;
        if (p) cbRef.current?.(p.v);
      });
    }
  }, []);
  /** Drop the pending value (a commit with the same value supersedes it). */
  const drop = React.useCallback(() => { cancel(); pending.current = null; }, [cancel]);
  React.useEffect(() => drop, [drop]);
  return { push, flush, drop };
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
  const seek = useFrameCoalesced(onValueChange);

  const safeMax = Number.isFinite(max) && max > 0 ? max : 0;
  const pct = (s: number) => (safeMax > 0 ? Math.min(100, Math.max(0, (s / safeMax) * 100)) : 0);
  const shown = dragValue ?? value;

  const onKeyDown = (e: React.KeyboardEvent) => {
    // Base UI owns the standard slider keys; , and . frame-step only while paused.
    if (e.key === ',' || e.key === '.') {
      if (!frameRate || !paused) return;
      const dt = (1 / frameRate) * (e.key === '.' ? 1 : -1);
      onValueChange?.(Math.min(safeMax, Math.max(0, value + dt)));
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
          if (details.reason === 'drag') {
            if (!dragging) setDragging(true);
            setDragValue(n);
          }
          seek.push(n);
        }}
        onValueCommitted={(v) => {
          const n = Array.isArray(v) ? v[0]! : v;
          setDragging(false);
          setDragValue(null);
          if (onValueCommit) {
            // the commit carries the final position; a pending frame seek is superseded
            seek.drop();
            onValueCommit(n);
          } else {
            seek.flush();
          }
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
