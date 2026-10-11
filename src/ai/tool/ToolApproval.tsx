'use client';
// Rendered inside ToolCall.Approval (SURF-324).
import * as React from 'react';
import type { AgToolPart } from '../types';
import type { ApprovalResponseDetail, ToolCallLabels } from './ToolCall';
import { TextField } from '../../components/text-field';

type AnyToolPart = AgToolPart | (Omit<AgToolPart, 'type'> & { type: 'dynamic-tool'; toolName: string });

export interface ToolCallApprovalProps {
  part: AnyToolPart;
  labels?: ToolCallLabels | undefined;
  onApprovalResponse?: ((detail: ApprovalResponseDetail) => void) | undefined;
  /** Focus returns to the ToolCall trigger after a response. */
  triggerRef?: React.RefObject<HTMLElement | null> | undefined;
}

/**
 * REQ-SURF-121: Approve / Deny (Deny reveals a CMP TextField reason). A
 * response fires once and disables both buttons until `part.state` or the
 * approval id changes — the response state is keyed by both, so a new
 * approval request re-enables the controls even if the component stays
 * mounted.
 */
export function ToolCallApproval({ part, labels = {}, onApprovalResponse, triggerRef }: ToolCallApprovalProps) {
  const approvalId = part.approval?.id ?? part.toolCallId;
  const requestKey = `${part.state}:${approvalId}`;
  const [respondedFor, setRespondedFor] = React.useState<string | null>(null);
  const [askingFor, setAskingFor] = React.useState<string | null>(null);
  const [reason, setReason] = React.useState('');
  const responded = respondedFor === requestKey;
  const askingReason = askingFor === requestKey;

  React.useEffect(() => {
    if (!onApprovalResponse) {
      console.warn('ToolCall: needs-approval without onApprovalResponse — the call is inert.');
    }
  }, [onApprovalResponse]);

  const respond = (approved: boolean, r?: string) => {
    if (responded) return;
    setRespondedFor(requestKey);
    onApprovalResponse?.({ approvalId, toolCallId: part.toolCallId, approved, ...(r ? { reason: r } : {}) });
    triggerRef?.current?.focus();
  };

  if (!onApprovalResponse) {
    return <p data-ag-part="waiting">{labels.waitingForApproval ?? 'Waiting for approval'}</p>;
  }
  return (
    <div data-ag-part="approval">
      {!askingReason ? (
        <>
          <button
            type="button"
            data-ag-part="approve"
            disabled={responded}
            onClick={() => respond(true)}
          >
            {labels.approve ?? 'Approve'}
          </button>
          <button
            type="button"
            data-ag-part="deny"
            disabled={responded}
            onClick={() => { setReason(''); setAskingFor(requestKey); }}
          >
            {labels.deny ?? 'Deny'}
          </button>
        </>
      ) : (
        <div data-ag-part="deny-reason">
          <TextField
            label={labels.denyReason ?? 'Reason (optional)'}
            value={reason}
            onValueChange={(v) => setReason(v)}
            disabled={responded}
          />
          <button type="button" disabled={responded} onClick={() => respond(false, reason)}>
            {labels.deny ?? 'Deny'}
          </button>
        </div>
      )}
    </div>
  );
}
