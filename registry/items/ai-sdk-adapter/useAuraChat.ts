/* ai-sdk-adapter (SURF-390, REQ-SURF-106/170/173): wraps @ai-sdk/react
 * `useChat` and returns ready-made props for ./ai:
 *
 *   const chat = useAuraChat({ transport: new DefaultChatTransport({ api: '/api/chat' }) });
 *   <Thread {...chat.threadProps} />
 *   <MessageActions {...chat.messageProps(message)} />
 *   <ToolCall {...chat.toolCallProps(part)} />
 *   <Composer {...chat.composerProps} />
 *
 * Messages are typed `UIMessage<AgMessageMetadata>`, which the shipped
 * `AgMessage` model is a structural supertype of (tests/types/surf/
 * ai-sdk-compat.test-d.ts), so `threadProps.messages` needs no cast.
 *
 * Tool approval: AI SDK v5 (the pinned major) has no approval states or
 * `addToolApprovalResponse` — that API is v6 (OD-16). The v5 human-in-the-loop
 * equivalent is `addToolResult({ tool, toolCallId, output })` with the
 * decision as the tool output, plus `sendAutomaticallyWhen:
 * lastAssistantMessageIsCompleteWithToolCalls` so the decision is sent back to
 * the route. Requires the consumer's `ai` + `@ai-sdk/react` dependencies
 * (declared in registry-item.json). */
'use client';
import * as React from 'react';
import { useChat } from '@ai-sdk/react';
import { lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import type { ChatInit, ChatTransport, FileUIPart, UIMessage } from 'ai';
import type { AgMessage, AgMessageMetadata, AgToolPart, ApprovalResponseDetail } from 'aura-glass/ai';

/** The SDK message shape useAuraChat works with; assignable to `AgMessage`. */
export type AuraUIMessage = UIMessage<AgMessageMetadata>;

type AnyToolPart = AgToolPart | (Omit<AgToolPart, 'type'> & { type: 'dynamic-tool'; toolName: string });

/** Output recorded on a tool part when the user approves or denies it. */
export interface AuraToolApprovalOutput {
  approved: boolean;
  approvalId: string;
  reason?: string;
}

export interface UseAuraChatOptions {
  /** Transport — e.g. `new DefaultChatTransport({ api: '/api/chat' })`. */
  transport?: ChatTransport<AuraUIMessage>;
  messages?: AuraUIMessage[];
  /** When to re-send automatically. Defaults to
   * `lastAssistantMessageIsCompleteWithToolCalls`, so an approval/denial
   * reaches the route without another user turn. */
  sendAutomaticallyWhen?: ChatInit<AuraUIMessage>['sendAutomaticallyWhen'];
}

export interface AuraMessageProps {
  message: AgMessage;
  /** Assistant messages only: `chat.regenerate({ messageId })`. */
  onRegenerate?: ((messageId: string) => void) | undefined;
  /** Copies the message's text parts to the clipboard. */
  onCopy: () => Promise<void>;
}

export interface AuraToolCallProps {
  part: AnyToolPart;
  /** `<ToolCall onApprovalResponse>` handler. */
  onApprovalResponse: (detail: ApprovalResponseDetail) => void;
  onApprove: () => void;
  onDeny: (reason?: string) => void;
}

export interface UseAuraChatResult {
  threadProps: { messages: AgMessage[] };
  messageProps: (message: AgMessage) => AuraMessageProps;
  toolCallProps: (part: AnyToolPart) => AuraToolCallProps;
  composerProps: {
    onSubmit: (payload: { text: string; files: File[] }) => void;
    onStop?: (() => void) | undefined;
  };
  status: 'submitted' | 'streaming' | 'ready' | 'error';
}

function readAsDataUrl(file: File): Promise<string> {
  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error ?? new Error(`Could not read ${file.name}`));
      reader.readAsDataURL(file);
    });
  }
  // Non-DOM runtimes (workers without FileReader): base64 from the bytes.
  return file.arrayBuffer().then((buf) => {
    let bin = '';
    const bytes = new Uint8Array(buf);
    for (const b of bytes) bin += String.fromCharCode(b);
    return `data:${file.type || 'application/octet-stream'};base64,${btoa(bin)}`;
  });
}

/** Composer `File[]` → AI SDK `FileUIPart[]` (data URLs, like the SDK's own
 * `convertFileListToFileUIParts`, which only accepts a `FileList`). */
export function filesToFileParts(files: readonly File[]): Promise<FileUIPart[]> {
  return Promise.all(files.map(async (file) => ({
    type: 'file' as const,
    mediaType: file.type || 'application/octet-stream',
    filename: file.name,
    url: await readAsDataUrl(file),
  })));
}

/** Same join as `Message.getText` (text parts, blank-line separated); kept
 * local so the hook has no runtime import of aura-glass/ai. */
function messageText(message: AgMessage): string {
  return message.parts
    .flatMap((p) => (p.type === 'text' ? [p.text] : []))
    .join('\n\n');
}

function toolNameOf(part: AnyToolPart): string {
  return part.type === 'dynamic-tool' ? part.toolName : part.type.slice('tool-'.length);
}

export function useAuraChat(options: UseAuraChatOptions = {}): UseAuraChatResult {
  const chat = useChat<AuraUIMessage>({
    ...(options.transport ? { transport: options.transport } : {}),
    ...(options.messages ? { messages: options.messages } : {}),
    sendAutomaticallyWhen: options.sendAutomaticallyWhen ?? lastAssistantMessageIsCompleteWithToolCalls,
  });
  const { sendMessage, regenerate, stop, addToolResult } = chat;
  const streaming = chat.status === 'streaming' || chat.status === 'submitted';

  const messageProps = React.useCallback((message: AgMessage): AuraMessageProps => ({
    message,
    ...(message.role === 'assistant'
      ? { onRegenerate: (messageId: string) => { void regenerate({ messageId }); } }
      : {}),
    onCopy: () => navigator.clipboard.writeText(messageText(message)),
  }), [regenerate]);

  const toolCallProps = React.useCallback((part: AnyToolPart): AuraToolCallProps => {
    const respond = (detail: ApprovalResponseDetail) => {
      const output: AuraToolApprovalOutput = {
        approved: detail.approved,
        approvalId: detail.approvalId,
        ...(detail.reason ? { reason: detail.reason } : {}),
      };
      void addToolResult({ tool: toolNameOf(part), toolCallId: detail.toolCallId, output });
    };
    const approvalId = part.approval?.id ?? part.toolCallId;
    return {
      part,
      onApprovalResponse: respond,
      onApprove: () => respond({ approvalId, toolCallId: part.toolCallId, approved: true }),
      onDeny: (reason) => respond({ approvalId, toolCallId: part.toolCallId, approved: false, ...(reason ? { reason } : {}) }),
    };
  }, [addToolResult]);

  const onSubmit = React.useCallback(({ text, files }: { text: string; files: File[] }) => {
    if (files.length === 0) {
      void sendMessage({ text });
      return;
    }
    void filesToFileParts(files).then((parts) => sendMessage({ text, files: parts }));
  }, [sendMessage]);

  return {
    threadProps: { messages: chat.messages },
    messageProps,
    toolCallProps,
    composerProps: {
      onSubmit,
      ...(streaming ? { onStop: () => { void stop(); } } : {}),
    },
    status: chat.status,
  };
}
