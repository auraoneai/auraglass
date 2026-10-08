import * as React from 'react';
import type { AgStep } from '../types';

export interface AgentStepsProps {
  steps: readonly AgStep[];
  className?: string | undefined;
}

function fmtDuration(ms: number): string {
  const s = ms / 1000;
  return s < 10 ? `${s.toFixed(1)} s` : `${Math.round(s)} s`;
}

function duration(step: AgStep): number | null {
  if (step.startedAt === undefined || step.endedAt === undefined) return null;
  return step.endedAt - step.startedAt;
}

const STATE_TEXT: Record<AgStep['state'], string> = {
  queued: 'Queued',
  running: 'Running',
  'needs-approval': 'Needs approval',
  succeeded: 'Done',
  failed: 'Failed',
  denied: 'Denied',
  skipped: 'Skipped',
};

/** REQ-SURF-123: server-safe ordered list of agent steps. */
export function AgentSteps({ steps, className }: AgentStepsProps) {
  return (
    <ol data-ag-part="agent-steps" className={className}>
      {steps.map((step) => {
        const d = duration(step);
        return (
          <li
            key={step.id}
            data-ag-part="step"
            data-state={step.state}
            aria-current={step.state === 'running' ? 'step' : undefined}
          >
            <span data-ag-part="step-icon" aria-hidden="true" />
            <span data-ag-part="step-label">{step.label}</span>
            <span data-ag-part="step-state">{STATE_TEXT[step.state]}</span>
            {d !== null ? <span data-ag-part="step-duration">{fmtDuration(d)}</span> : null}
            {step.detail ? <span data-ag-part="step-detail">{step.detail}</span> : null}
            {step.children?.length ? <AgentSteps steps={step.children} /> : null}
          </li>
        );
      })}
    </ol>
  );
}
