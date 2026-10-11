'use client';
import * as React from 'react';
import type { AgToolPart } from '../types';
import { toolDisplayState } from '../tool-state';
import type { AgToolDisplayState } from '../types';
import { AiIcon } from '../icons/AiIcon';
import { useAnnouncer, useResolvedPreferences } from '../../theme';
import { ToolCallApproval } from './ToolApproval';

export interface ApprovalResponseDetail {
  approvalId: string;
  toolCallId: string;
  approved: boolean;
  reason?: string;
}

export interface ToolCallLabels {
  queued?: string;
  running?: string;
  needsApproval?: string;
  succeeded?: string;
  failed?: string;
  denied?: string;
  showAll?: string;
  approve?: string;
  deny?: string;
  denyReason?: string;
  waitingForApproval?: string;
  approvalNeeded?: string;
}

const DISPLAY_TEXT: Record<AgToolDisplayState, string> = {
  queued: 'Preparing',
  running: 'Running',
  'needs-approval': 'Needs approval',
  succeeded: 'Done',
  failed: 'Failed',
  denied: 'Denied',
};

type AnyToolPart = AgToolPart | (Omit<AgToolPart, 'type'> & { type: 'dynamic-tool'; toolName: string });

export interface ToolCallProps {
  part: AnyToolPart;
  title?: string | undefined;
  labels?: ToolCallLabels | undefined;
  renderInput?: ((input: unknown) => React.ReactNode) | undefined;
  renderOutput?: ((output: unknown) => React.ReactNode) | undefined;
  onApprovalResponse?: ((detail: ApprovalResponseDetail) => void) | undefined;
  defaultOpen?: boolean | undefined;
  maxPreviewChars?: number | undefined;
  className?: string | undefined;
  ref?: React.Ref<HTMLDivElement>;
}

function toolName(part: AnyToolPart): string {
  return part.type === 'dynamic-tool' ? part.toolName : part.type.slice('tool-'.length);
}

function JsonBlock({ label, value, maxChars }: { label: string; value: unknown; maxChars: number }) {
  const full = React.useMemo(() => {
    try { return JSON.stringify(value, null, 2) ?? 'undefined'; } catch { return String(value); }
  }, [value]);
  const [expanded, setExpanded] = React.useState(false);
  const capped = !expanded && full.length > maxChars;
  const shown = capped ? `${full.slice(0, maxChars)}…` : full;
  return (
    <div data-ag-part="io">
      <pre data-ag-part="io-pre" aria-label={label} tabIndex={0} style={{ overflowX: 'auto' }}>
        {shown}
      </pre>
      {capped ? (
        <button type="button" data-ag-part="io-expand" onClick={() => setExpanded(true)}>
          Show all
        </button>
      ) : null}
    </div>
  );
}

/** REQ-SURF-120/121: Collapsible tool call with display-state header. */
function ToolCallBase({
  part,
  title,
  labels = {},
  renderInput,
  renderOutput,
  onApprovalResponse,
  defaultOpen,
  maxPreviewChars = 4000,
  className,
  ref,
}: ToolCallProps) {
  const display = toolDisplayState(part);
  const open = defaultOpen ?? (display === 'needs-approval' || display === 'failed');
  const [opened, setOpened] = React.useState(open);
  const contentId = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const { announce } = useAnnouncer();
  // REQ-SURF-190: the resolved motion (min of OS floor, app, user), never
  // the raw setting, which can be 'system' or above the reduced-motion floor.
  const { motion } = useResolvedPreferences();
  const lastAnnounced = React.useRef<AgToolDisplayState | null>(null);
  React.useEffect(() => {
    if (display === 'needs-approval' && lastAnnounced.current !== 'needs-approval') {
      announce(labels.approvalNeeded ? labels.approvalNeeded.replace('{tool}', title ?? toolName(part)) : `Approval needed: ${title ?? toolName(part)}`, { politeness: 'assertive' });
    }
    lastAnnounced.current = display;
  }, [display, announce, labels.approvalNeeded, title, part]);
  const text = {
    queued: labels.queued ?? DISPLAY_TEXT.queued,
    running: labels.running ?? DISPLAY_TEXT.running,
    'needs-approval': labels.needsApproval ?? DISPLAY_TEXT['needs-approval'],
    succeeded: labels.succeeded ?? DISPLAY_TEXT.succeeded,
    failed: labels.failed ?? DISPLAY_TEXT.failed,
    denied: labels.denied ?? DISPLAY_TEXT.denied,
  }[display];

  return (
    <div ref={ref} data-ag-part="tool-call" data-state={display} className={className}>
      <button
        ref={triggerRef}
        type="button"
        data-ag-part="trigger"
        aria-expanded={opened}
        aria-controls={contentId}
        onClick={() => setOpened((o) => !o)}
      >
        <AiIcon name="tool" />
        <span data-ag-part="tool-name">{title ?? toolName(part)}</span>
        <span data-ag-part="tool-state">{text}</span>
        {display === 'running' ? (
          <span data-ag-part="running-dots" data-motion={motion} aria-hidden="true" />
        ) : null}
        <AiIcon name="chevron" />
      </button>
      {opened ? (
        <div id={contentId} data-ag-part="content">
          {part.input !== undefined ? (
            renderInput ? renderInput(part.input) : <JsonBlock label="Input" value={part.input} maxChars={maxPreviewChars} />
          ) : null}
          {part.output !== undefined ? (
            renderOutput ? renderOutput(part.output) : <JsonBlock label="Output" value={part.output} maxChars={maxPreviewChars} />
          ) : null}
          {part.errorText ? <p data-ag-part="error-text" role="alert">{part.errorText}</p> : null}
          {display === 'needs-approval' ? (
            <ToolCallApproval part={part} labels={labels} onApprovalResponse={onApprovalResponse} triggerRef={triggerRef} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export interface ToolCallComponent {
  (props: ToolCallProps): React.ReactElement;
  displayState: typeof toolDisplayState;
  Approval: typeof ToolCallApproval;
}

/** REQ-SURF-02 static: `ToolCall.displayState` is the §4.5 mapper. */
export const ToolCall = Object.assign(ToolCallBase, {
  displayState: toolDisplayState,
  Approval: ToolCallApproval,
}) as ToolCallComponent;

