'use client';
/* REQ-SURF-136 — MediaScrubber on the CMP Slider seam (src/components/slider,
 * S-30: Root/Track/Range/Thumb/Value). Buffered ranges and chapter markers are
 * layers whose only inline style is --_ag-start/--_ag-end. aria-valuetext is
 * spoken "X of Y". Keyboard + hover are handled here so the part contract is
 * all the seam provides; pointer-drag behaviour comes from the CMP Slider. */
import * as React from 'react';
import { Slider } from '../../components/slider';

type FC = React.FC<Record<string, unknown> & { children?: React.ReactNode }>;
const SliderRoot = Slider.Root as FC;
const SliderTrack = Slider.Track as FC;
const SliderRange = Slider.Range as FC;
const SliderThumb = Slider.Thumb as FC;
import { formatMediaTime } from '../formatMediaTime';
import { BufferedLayer } from './BufferedLayer';
import { ChapterMarkers } from './ChapterMarkers';

export interface MediaScrubberProps {
  value: number;
  max: number;
  onValueChange?: ((value: number) => void) | undefined;
  /** Fires once when the drag or key interaction commits. */
  onValueCommit?: ((value: number) => void) | undefined;
  buffered?: [number, number][] | undefined;
  chapters?: { start: number; title: string }[] | undefined;
  /** Seconds per small arrow step. Default 1. */
  step?: number | undefined;
  /** Seconds per PageUp/Down. Default 10. */
  largeStep?: number | undefined;
  /** When set, , and . step one frame while paused. */
  frameRate?: number | undefined;
  formatHoverTime?: ((seconds: number) => string) | undefined;
  'aria-label'?: string | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
}

export function scrubberValueText(value: number, max: number): string {
  const v = formatMediaTime(value, { spoken: true });
  const d = formatMediaTime(max, { spoken: true });
  return `${v} of ${d}`;
}

export const MediaScrubber = React.forwardRef<HTMLDivElement, MediaScrubberProps>(
  function MediaScrubber(props, ref) {
    const {
      value, max, onValueChange, onValueCommit, buffered = [], chapters = [],
      step = 1, largeStep = 10, frameRate, formatHoverTime = formatMediaTime,
      className, disabled,
      'aria-label': ariaLabel = 'Seek',
    } = props;
    const [dragging, setDragging] = React.useState(false);
    const [hoverTime, setHoverTime] = React.useState<number | null>(null);
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const lastValue = React.useRef(value);
    lastValue.current = value;

    const safeMax = Number.isFinite(max) && max > 0 ? max : 0;
    const pct = (s: number) => (safeMax > 0 ? Math.min(100, Math.max(0, (s / safeMax) * 100)) : 0);
    const commit = React.useCallback(() => {
      onValueCommit?.(lastValue.current);
    }, [onValueCommit]);

    const onKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === ',' || e.key === '.') {
        if (!frameRate) return;
        const dt = 1 / frameRate * (e.key === '.' ? 1 : -1);
        onValueChange?.(Math.min(safeMax, Math.max(0, value + dt)));
        e.preventDefault();
      } else if (e.key === 'PageDown') {
        onValueChange?.(Math.max(0, value - largeStep));
        e.preventDefault();
      } else if (e.key === 'PageUp') {
        onValueChange?.(Math.min(safeMax, value + largeStep));
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        onValueChange?.(Math.min(safeMax, value + step));
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        onValueChange?.(Math.max(0, value - step));
        e.preventDefault();
      } else if (e.key === 'Home') {
        onValueChange?.(0);
        e.preventDefault();
      } else if (e.key === 'End') {
        onValueChange?.(safeMax);
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

    return (
      <SliderRoot
        ref={(node: HTMLDivElement | null) => {
          (rootRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={['ag-media-scrubber', className].filter(Boolean).join(' ')}
        data-ag-part="media-scrubber"
        value={value}
        min={0}
        max={safeMax}
        step={step}
        disabled={disabled}
        onValueChange={(v: number | number[]) => onValueChange?.(Array.isArray(v) ? v[0]! : v)}
      >
        <SliderTrack
          className="ag-media-scrubber-track"
          data-ag-part="media-scrubber-track"
          onKeyDown={onKeyDown}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setHoverTime(null)}
          onPointerDown={() => setDragging(true)}
          onPointerUp={() => { if (dragging) { setDragging(false); commit(); } }}
          onKeyUp={() => commit()}
        >
          {/* buffered + chapter layers — inline style carries only --_ag-start/--_ag-end */}
          {buffered.map(([s, e], i) => <BufferedLayer key={i} start={s} end={e} max={safeMax} />)}
          <ChapterMarkers chapters={chapters} max={safeMax} />
          <SliderRange className="ag-media-scrubber-range" data-ag-part="media-scrubber-range" />
          <SliderThumb
            className="ag-media-scrubber-thumb"
            data-ag-part="media-scrubber-thumb"
            aria-label={ariaLabel}
            aria-valuetext={scrubberValueText(value, safeMax)}
            {...(dragging ? { 'data-dragging': '' } : {})}
          />
          {hoverTime !== null ? (
            <span
              data-ag-part="media-scrubber-tooltip"
              aria-hidden="true"
              style={{ '--_ag-start': `${pct(hoverTime)}%` } as React.CSSProperties}
            >
              {formatHoverTime(hoverTime)}
            </span>
          ) : null}
        </SliderTrack>
      </SliderRoot>
    );
  },
);
