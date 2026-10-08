'use client';
import * as React from 'react';

export interface ReasoningLabels {
  thinking?: string;
  thoughtFor?: (seconds: string) => string;
}

export interface ReasoningProps {
  text: string;
  state: 'streaming' | 'done';
  durationMs?: number | undefined;
  defaultOpen?: boolean | undefined;
  labels?: ReasoningLabels | undefined;
  className?: string | undefined;
}

function formatSeconds(ms: number): string {
  const s = ms / 1000;
  return s < 10 ? s.toFixed(1) : String(Math.round(s));
}

/**
 * REQ-SURF-122: auto-opens when streaming starts, auto-closes once on done
 * unless the user toggled during streaming.
 */
export function Reasoning({ text, state, durationMs, defaultOpen, labels = {}, className }: ReasoningProps) {
  const [open, setOpen] = React.useState(defaultOpen ?? state === 'streaming');
  const toggledDuringStream = React.useRef(false);
  const startedAt = React.useRef<number | null>(null);
  const [elapsed, setElapsed] = React.useState<number | null>(null);
  const contentId = React.useId();

  React.useEffect(() => {
    if (state === 'streaming') {
      if (startedAt.current === null) startedAt.current = performance.now();
      setOpen(true);
    } else if (state === 'done') {
      if (startedAt.current !== null && elapsed === null) {
        setElapsed(performance.now() - startedAt.current);
      }
      if (!toggledDuringStream.current) setOpen(false);
    }
  }, [state, elapsed]);

  const ms = durationMs ?? elapsed;
  const label = state === 'streaming'
    ? (labels.thinking ?? 'Thinking…')
    : (labels.thoughtFor ?? ((s: string) => `Thought for ${s} s`))(formatSeconds(ms ?? 0));

  return (
    <div data-ag-part="reasoning" data-state={state} className={className}>
      <button
        type="button"
        data-ag-part="trigger"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => {
          if (state === 'streaming') toggledDuringStream.current = true;
          setOpen((o) => !o);
        }}
      >
        {label}
      </button>
      {open ? (
        <div id={contentId} data-ag-part="content">
          {text}
        </div>
      ) : null}
    </div>
  );
}
