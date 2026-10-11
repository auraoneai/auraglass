/**
 * AuraGlass 5.0 `src/ai/types.ts` — the §4.5 AI data model.
 *
 * Structural mirror of the AI SDK `UIMessage`: `useChat().messages` type-checks
 * as `AgMessage[]` with no cast and no `ai` import in shipped code.
 */

export type AgRole = 'user' | 'assistant' | 'system' | 'tool';

export interface AgMessage<M = AgMessageMetadata> {
  id: string;
  role: AgRole;
  parts: readonly AgPart[];
  metadata?: M;
}

export interface AgMessageMetadata {
  createdAt?: string | number;
  model?: string;
  status?: 'pending' | 'streaming' | 'complete' | 'error' | 'aborted';
  usage?: AgUsage;
}

export type AgPart =
  | { type: 'text'; text: string; state?: 'streaming' | 'done' }
  | { type: 'reasoning'; text: string; state?: 'streaming' | 'done' }
  | AgToolPart
  | (Omit<AgToolPart, 'type'> & { type: 'dynamic-tool'; toolName: string })
  | { type: 'source-url'; sourceId: string; url: string; title?: string }
  | { type: 'source-document'; sourceId: string; mediaType: string; title: string; filename?: string }
  | { type: 'file'; mediaType: string; url: string; filename?: string }
  | { type: 'step-start' }
  | { type: `data-${string}`; id?: string; data: unknown };

export interface AgToolPart {
  type: `tool-${string}`;
  toolCallId: string;
  state: AgToolSdkState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
  approval?: { id: string; approved?: boolean; reason?: string };
}

export type AgToolSdkState =
  | 'input-streaming'
  | 'input-available'
  | 'approval-requested'
  | 'approval-responded'
  | 'output-available'
  | 'output-error'
  | 'output-denied';

export type AgToolDisplayState =
  | 'queued'
  | 'running'
  | 'needs-approval'
  | 'succeeded'
  | 'failed'
  | 'denied';

export interface AgUsage {
  inputTokens?: number;
  outputTokens?: number;
  reasoningTokens?: number;
  cachedInputTokens?: number;
  contextWindow?: number;
  costUsd?: number;
}

export type AgChatStatus = 'ready' | 'submitted' | 'streaming' | 'error';

/** AgentSteps step shape (REQ-SURF-123). */
export interface AgStep {
  id: string;
  label: string;
  state: AgToolDisplayState | 'skipped';
  detail?: string;
  startedAt?: number;
  endedAt?: number;
  children?: readonly AgStep[];
}
