'use client';
import * as React from 'react';
import { StatCard, Table } from 'aura-glass/data';
import type { TableColumnDef } from 'aura-glass/data';
import { UsageMeter , type AgUsage } from 'aura-glass/ai';

export interface EvalRun {
  id: string;
  model: string;
  dataset: string;
  passRate: number;
  deltaBaseline: number;
  costUsd: number;
  startedAt: string;
}

export interface EvalDashboardProps {
  runs: readonly EvalRun[];
  title?: string | undefined;
  usage?: AgUsage | undefined;
}

const pct = (n: number) => `${Math.round(n * 100)}%`;
const usd = (n: number) => `$${n.toFixed(2)}`;

/** ai-eval-dashboard (SURF-373, REQ-SURF-173): eval runs table (run, model,
 * dataset, pass rate, Δ baseline, cost, started) on the W2 Table plus three
 * StatCards. All metric numbers come from props/fixtures — no literals. */
export function EvalDashboard({ runs, title = 'Evaluation', usage }: EvalDashboardProps) {
  const best = runs.reduce<EvalRun | null>((b, r) => (b == null || r.passRate > b.passRate ? r : b), null);
  const meanRate = runs.length ? runs.reduce((n, r) => n + r.passRate, 0) / runs.length : 0;
  const totalCost = runs.reduce((n, r) => n + r.costUsd, 0);
  const columns = React.useMemo<TableColumnDef<EvalRun>[]>(() => [
    { id: 'run', header: 'Run', accessorKey: 'id' },
    { id: 'model', header: 'Model', accessorKey: 'model' },
    { id: 'dataset', header: 'Dataset', accessorKey: 'dataset' },
    { id: 'passRate', header: 'Pass rate', accessorFn: (r: EvalRun) => pct(r.passRate) },
    { id: 'delta', header: 'Δ baseline', accessorFn: (r: EvalRun) => `${r.deltaBaseline >= 0 ? '+' : ''}${pct(r.deltaBaseline)}` },
    { id: 'cost', header: 'Cost', accessorFn: (r: EvalRun) => usd(r.costUsd) },
    { id: 'started', header: 'Started', accessorKey: 'startedAt' },
  ], []);
  return (
    <section data-ag-part="eval-dashboard" aria-label={title}>
      <header data-ag-part="eval-summary" style={{ display: 'flex', gap: '1rem' }}>
        <StatCard label="Runs" value={runs.length} />
        <StatCard label="Mean pass rate" value={pct(meanRate)} />
        <StatCard label="Total cost" value={usd(totalCost)} description={best ? `best: ${best.id}` : undefined} />
      </header>
      <Table columns={columns} data={[...runs]} aria-label={title} />
      {usage ? <UsageMeter usage={usage} /> : null}
    </section>
  );
}
