// fixtures.ts — deterministic sample data for ai-trace-tree (no clocks, no randomness,
// no network — contract §3.3 file contract). Stories and showcases import it.
import type { AgStep } from 'aura-glass/ai';

export const TRACE_STEPS: AgStep[] = [
  { id: 'plan', label: 'Plan response', state: 'succeeded', startedAt: 0, endedAt: 120 },
  { id: 'search', label: 'Retrieve docs', state: 'succeeded', startedAt: 120, endedAt: 400,
    children: [{ id: 'q1', label: 'vector query', state: 'succeeded', startedAt: 130, endedAt: 300 }] },
  { id: 'draft', label: 'Draft answer', state: 'running', startedAt: 400 },
  { id: 'gate', label: 'Deploy approval', state: 'needs-approval' },
];

export const TRACE_TOTAL_MS = 600;
