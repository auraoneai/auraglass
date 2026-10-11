/* REQ-QUAL-13..18 (QUAL). Result shape every L6 gate returns. `pending` means a producer has not landed (lane runner
   reports it, PRD-F §4.3 rule 2); `not-applicable` means the cell has nothing the gate measures (recorded, never a pass
   for a gate that should have measured something — callers decide applicability before calling). */
export type GateStatus = 'pass' | 'fail' | 'pending' | 'not-applicable';

export interface GateResult {
  /** stable gate id used in manifests and failure messages (e.g. `not-blank`, `glass-over-nothing`) */
  gate: string;
  status: GateStatus;
  value?: number;
  limit?: number;
  detail: string;
}

export function gate(g: string, pass: boolean, value: number, limit: number, detail: string): GateResult {
  return { gate: g, status: pass ? 'pass' : 'fail', value, limit, detail };
}

/** Failure lines for a test assertion: one per failed gate, empty when every gate passed / pending / n.a. */
export function failures(results: readonly GateResult[]): string[] {
  return results.filter((r) => r.status === 'fail').map((r) => `${r.gate}: ${r.detail}`);
}
