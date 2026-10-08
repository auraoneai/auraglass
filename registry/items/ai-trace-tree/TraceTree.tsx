'use client';
import * as React from 'react';
import { TreeView } from 'aura-glass/data';
import type { AgStep } from 'aura-glass/ai';

export interface TraceTreeProps {
  steps: readonly AgStep[];
  /** Total run duration in ms for the duration bars; defaults to the sum of
   * top-level step durations. */
  totalMs?: number | undefined;
  renderDetail?: ((step: AgStep) => React.ReactNode) | undefined;
  'aria-label'?: string | undefined;
}

interface TraceItem extends Record<string, unknown> {
  step: AgStep;
}

const STATE_ICON: Record<string, string> = {
  queued: '○', running: '◌', 'needs-approval': '⚠', succeeded: '✓', failed: '✕', denied: '⊘', skipped: '—',
};

/** ai-trace-tree (SURF-372, REQ-SURF-173): AgStep trees on W2 TreeView with a
 * duration bar per span (width = span/total, min 2px) plus the text duration
 * and state icon. */
export function TraceTree({ steps, totalMs, renderDetail, 'aria-label': ariaLabel = 'Trace' }: TraceTreeProps) {
  const total = totalMs ?? steps.reduce((n, s) => n + (s.endedAt != null && s.startedAt != null ? s.endedAt - s.startedAt : 0), 0);
  const items = React.useMemo<TraceItem[]>(() => steps.map((step) => ({ step })), [steps]);
  return (
    <div data-ag-part="trace-tree" data-total-ms={total}>
      <TreeView<TraceItem>
        items={items}
        getKey={(i: TraceItem) => i.step.id}
        getChildren={(i: TraceItem) => i.step.children?.map((c: AgStep) => ({ step: c }))}
        getTextValue={(i: TraceItem) => i.step.label}
        aria-label={ariaLabel}
        renderItem={(i: TraceItem) => {
          const span = i.step.endedAt != null && i.step.startedAt != null ? i.step.endedAt - i.step.startedAt : null;
          const pct = span != null && total > 0 ? Math.max((span / total) * 100, 2 / Math.max(total, 1)) : 0;
          return (
            <span data-ag-part="trace-node" data-state={i.step.state}>
              <span aria-hidden="true" data-ag-part="trace-icon">{STATE_ICON[i.step.state] ?? '•'}</span>
              <span data-ag-part="trace-label">{i.step.label}</span>
              {span != null ? (
                <>
                  <span
                    data-ag-part="trace-duration-bar"
                    role="presentation"
                    style={{ display: 'inline-block', blockSize: '4px', minInlineSize: '2px', inlineSize: `${pct}%`, background: 'currentColor', opacity: 0.35 }}
                  />
                  <span data-ag-part="trace-duration">{span} ms</span>
                </>
              ) : null}
              {renderDetail ? <span data-ag-part="trace-detail">{renderDetail(i.step)}</span> : null}
            </span>
          );
        }}
      />
    </div>
  );
}
