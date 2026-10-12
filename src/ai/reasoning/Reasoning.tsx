'use client';
import * as React from 'react';
import { Collapsible } from '../../foundation/base-ui/collapsible';

export interface ReasoningLabels {
  thinking?: string;
  thoughtFor?: (seconds: string) => string;
}

export interface ReasoningProps {
  /** Reasoning text. */
  text: string;
  /** 'streaming' while reasoning is in progress, 'done' when finished. */
  state: 'streaming' | 'done';
  /** How long the model reasoned, shown in the summary once done. */
  durationMs?: number | undefined;
  /** Initial expanded state of the reasoning panel. */
  defaultOpen?: boolean | undefined;
  /** Overrides for the built-in, localizable UI strings. */
  labels?: ReasoningLabels | undefined;
  /** Class name merged onto the root element. */
  className?: string | undefined;
}

function formatSeconds(ms: number): string {
  const s = ms / 1000;
  return s < 10 ? s.toFixed(1) : String(Math.round(s));
}

/**
 * REQ-SURF-122: Base UI Collapsible. Auto-opens when streaming starts and
 * auto-closes once on done unless the user toggled during streaming. The panel
 * stays mounted (hidden when closed) so `aria-controls` always resolves. The
 * duration is `durationMs`, else `performance.now()` between the first
 * streaming commit and `done`.
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
      return;
    }
    // state === 'done': runs once per transition (deps are [state] only).
    const started = startedAt.current;
    if (started !== null) {
      const end = performance.now();
      setElapsed((prev) => prev ?? end - started);
    }
    if (!toggledDuringStream.current) setOpen(false);
  }, [state]);

  const ms = durationMs ?? elapsed;
  const label = state === 'streaming'
    ? (labels.thinking ?? 'Thinking…')
    : (labels.thoughtFor ?? ((s: string) => `Thought for ${s} s`))(formatSeconds(ms ?? 0));

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={(next: boolean) => {
        if (state === 'streaming') toggledDuringStream.current = true;
        setOpen(next);
      }}
      data-ag-part="reasoning"
      data-state={state}
      className={className}
    >
      <Collapsible.Trigger data-ag-part="trigger" aria-controls={contentId}>
        {label}
      </Collapsible.Trigger>
      <Collapsible.Panel id={contentId} data-ag-part="content" keepMounted>
        {text}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}
