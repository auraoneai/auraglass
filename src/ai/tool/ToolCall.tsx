'use client';
import * as React from 'react';
import { Collapsible } from '../../foundation/base-ui/collapsible';
import type { AgToolPart } from '../types';
import { toolDisplayState } from '../tool-state';
import type { AgToolDisplayState } from '../types';
import { AiIcon } from '../icons/AiIcon';
import { useAnnouncer, useResolvedPreferences } from '../../theme';
import { ToolCallApproval } from './ToolApproval';
import { StateIcon } from './StateIcon';

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
  /** Announced once on a live transition into `failed`; `{tool}`, `{error}`. */
  failedAnnouncement?: string;
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

function JsonBlock({ label, value, maxChars, showAll }: { label: string; value: unknown; maxChars: number; showAll: string }) {
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
          {showAll}
        </button>
      ) : null}
    </div>
  );
}

/** Display states that open the call on entry (REQ-SURF-120). */
const AUTO_OPEN: ReadonlySet<AgToolDisplayState> = new Set(['needs-approval', 'failed']);

function fill(template: string, tool: string, error: string): string {
  return template.replace('{tool}', tool).replace('{error}', error);
}

/**
 * REQ-SURF-120/121: Base UI Collapsible tool call with an icon + text header
 * per display state. The panel stays mounted (hidden when closed) so
 * `aria-controls` always resolves. It opens on mount and on every transition
 * into `needs-approval` / `failed` unless the user has toggled it. Failures are
 * plain text; the announcer speaks them once (REQ-SURF-129: no extra live
 * regions).
 */
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
  const [opened, setOpened] = React.useState(() => defaultOpen ?? AUTO_OPEN.has(display));
  const [userToggled, setUserToggled] = React.useState(false);
  // Adjust during render (not in an effect) so the approval controls are
  // visible in the same commit as the state change.
  const [prevDisplay, setPrevDisplay] = React.useState(display);
  if (prevDisplay !== display) {
    setPrevDisplay(display);
    if (AUTO_OPEN.has(display) && !userToggled && !opened) setOpened(true);
  }
  const contentId = React.useId();
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const { announce } = useAnnouncer();
  // REQ-SURF-190: the resolved motion (min of OS floor, app, user), never
  // the raw setting, which can be 'system' or above the reduced-motion floor.
  const { motion } = useResolvedPreferences();
  const name = title ?? toolName(part);
  const lastAnnounced = React.useRef<AgToolDisplayState | null>(null);
  React.useEffect(() => {
    const prev = lastAnnounced.current;
    lastAnnounced.current = display;
    if (prev === display) return;
    if (display === 'needs-approval') {
      announce(labels.approvalNeeded ? labels.approvalNeeded.replace('{tool}', name) : `Approval needed: ${name}`, { politeness: 'assertive' });
    } else if (display === 'failed' && prev !== null) {
      // Only a live transition is spoken; history loaded already-failed is not.
      const error = part.errorText ?? '';
      announce(
        labels.failedAnnouncement
          ? fill(labels.failedAnnouncement, name, error)
          : error ? `${name} failed: ${error}` : `${name} failed`,
        { politeness: 'assertive' },
      );
    }
  }, [display, announce, labels.approvalNeeded, labels.failedAnnouncement, name, part.errorText]);
  const text = {
    queued: labels.queued ?? DISPLAY_TEXT.queued,
    running: labels.running ?? DISPLAY_TEXT.running,
    'needs-approval': labels.needsApproval ?? DISPLAY_TEXT['needs-approval'],
    succeeded: labels.succeeded ?? DISPLAY_TEXT.succeeded,
    failed: labels.failed ?? DISPLAY_TEXT.failed,
    denied: labels.denied ?? DISPLAY_TEXT.denied,
  }[display];
  const showAll = labels.showAll ?? 'Show all';

  return (
    <Collapsible.Root
      ref={ref}
      open={opened}
      onOpenChange={(next: boolean) => {
        setUserToggled(true);
        setOpened(next);
      }}
      data-ag-part="tool-call"
      data-state={display}
      className={className}
    >
      <Collapsible.Trigger ref={triggerRef} data-ag-part="trigger" aria-controls={contentId}>
        <StateIcon state={display} />
        <span data-ag-part="tool-name">{name}</span>
        <span data-ag-part="tool-state">{text}</span>
        {display === 'running' ? (
          <span data-ag-part="running-dots" data-motion={motion} aria-hidden="true" />
        ) : null}
        <AiIcon name="chevron" />
      </Collapsible.Trigger>
      <Collapsible.Panel id={contentId} data-ag-part="content" keepMounted>
        {part.input !== undefined ? (
          renderInput ? renderInput(part.input) : <JsonBlock label="Input" value={part.input} maxChars={maxPreviewChars} showAll={showAll} />
        ) : null}
        {part.output !== undefined ? (
          renderOutput ? renderOutput(part.output) : <JsonBlock label="Output" value={part.output} maxChars={maxPreviewChars} showAll={showAll} />
        ) : null}
        {part.errorText ? <p data-ag-part="error-text">{part.errorText}</p> : null}
        {display === 'needs-approval' ? (
          <ToolCallApproval part={part} labels={labels} onApprovalResponse={onApprovalResponse} triggerRef={triggerRef} />
        ) : null}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
}

export interface ToolCallComponent {
  (props: ToolCallProps): React.ReactElement;
  displayState: typeof toolDisplayState;
  Approval: typeof ToolCallApproval;
}

/** REQ-SURF-02 static: `ToolCall.displayState` is the §4.5 mapper. */
export const ToolCall = /*#__PURE__*/ Object.assign(ToolCallBase, {
  displayState: toolDisplayState,
  Approval: ToolCallApproval,
}) as ToolCallComponent;

