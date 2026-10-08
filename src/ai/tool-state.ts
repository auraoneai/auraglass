import type { AgToolDisplayState, AgToolPart } from './types';

type AnyToolPart = AgToolPart | (Omit<AgToolPart, 'type'> & { type: 'dynamic-tool'; toolName: string });

/** §4.5 SDK state → display state mapping (REQ-SURF-106/120). */
export function toolDisplayState(part: AnyToolPart): AgToolDisplayState {
  switch (part.state) {
    case 'input-streaming':
      return 'queued';
    case 'input-available':
      return 'running';
    case 'approval-requested':
      return 'needs-approval';
    case 'approval-responded':
      return part.approval?.approved === false ? 'denied' : 'running';
    case 'output-available':
      return 'succeeded';
    case 'output-error':
      return 'failed';
    case 'output-denied':
      return 'denied';
    default:
      return 'queued';
  }
}
