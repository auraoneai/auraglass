'use client';
// Rendered inside ToolCall.Approval (SURF-324).
import * as React from 'react';
import type { AgToolPart } from '../types';
import type { ApprovalResponseDetail, ToolCallLabels } from './ToolCall';
import { useAnnouncer } from '../../theme';

type AnyToolPart = AgToolPart | (Omit<AgToolPart, 'type'> & { type: 'dynamic-tool'; toolName: string });

export interface ToolCallApprovalProps {
  part: AnyToolPart;
  labels?: ToolCallLabels | undefined;
  onApprovalResponse?: ((detail: ApprovalResponseDetail) => void) | undefined;
  /** Focus returns to the ToolCall trigger after a response. */
  triggerRef?: React.RefObject<HTMLElement | null> | undefined;
}

export function ToolCallApproval({ part, labels, onApprovalResponse, triggerRef }: {
  part: AnyToolPart;
  labels: ToolCallLabels;
  onApprovalResponse?: ((detail: ApprovalResponseDetail) => void) | undefined;
  triggerRef?: React.RefObject<HTMLElement | null> | undefined;
}) {
  const [responded, setResponded] = React.useState(false);
  const [askingReason, setAskingReason] = React.useState(false);
  const [reason, setReason] = React.useState('');
  const approvalId = part.approval?.id ?? part.toolCallId;

  React.useEffect(() => {
    if (!onApprovalResponse) {
      console.warn('ToolCall: needs-approval without onApprovalResponse — the call is inert.');
    }
  }, [onApprovalResponse]);

  const respond = (approved: boolean, r?: string) => {
    if (responded) return;
    setResponded(true);
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
            onClick={() => setAskingReason(true)}
          >
            {labels.deny ?? 'Deny'}
          </button>
        </>
      ) : (
        <div data-ag-part="deny-reason">
          <label>
            {labels.denyReason ?? 'Reason (optional)'}
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} />
          </label>
          <button type="button" disabled={responded} onClick={() => respond(false, reason)}>
            {labels.deny ?? 'Deny'}
          </button>
        </div>
      )}
    </div>
  );
}
