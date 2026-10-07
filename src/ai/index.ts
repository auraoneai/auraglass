/**
 * AuraGlass 5.0 `./ai` barrel (contract §4.7): exactly 11 value exports.
 * Helpers ship as typed statics (REQ-SURF-02): `Message.Parts`,
 * `Message.getText`, `Thread.RenderersProvider`, `ToolCall.displayState`.
 * No `"use client"` on this module (REQ-SURF-289, entry barrels stay neutral).
 */

export { Thread } from './thread/Thread';
export { Message } from './message/Message';
export { StreamingText } from './message/StreamingText';
export { Composer } from './composer/Composer';
export { ToolCall } from './tool/ToolCall';
export { SourceList } from './sources/SourceList';
export { Citation } from './sources/Citation';
export { Reasoning } from './reasoning/Reasoning';
export { AgentSteps } from './agent/AgentSteps';
export { UsageMeter } from './usage/UsageMeter';
export { ProviderErrorState } from './error/ProviderErrorState';

export type {
  AgRole,
  AgMessage,
  AgMessageMetadata,
  AgPart,
  AgToolPart,
  AgToolSdkState,
  AgToolDisplayState,
  AgUsage,
  AgChatStatus,
  AgStep,
} from './types';
export type { AiRenderers, AgPartRenderer, AgTextRenderer } from './renderers';
export type { ThreadHandle, ThreadLabels, ThreadRootProps, ThreadItemsProps } from './thread/Thread';
export type { MessageRootProps, MessageLabels } from './message/Message';
export type { MessagePartsProps } from './message/MessageParts';
export type { StreamingTextProps } from './message/StreamingText';
export type { ComposerRootProps, ComposerLabels } from './composer/Composer';
export type { ToolCallProps, ToolCallLabels, ApprovalResponseDetail } from './tool/ToolCall';
export type { ReasoningProps, ReasoningLabels } from './reasoning/Reasoning';
export type { AgentStepsProps } from './agent/AgentSteps';
export type { SourceListProps, AgSourcePart } from './sources/SourceList';
export type { CitationProps } from './sources/Citation';
export type { UsageMeterProps } from './usage/UsageMeter';
export type { ProviderErrorStateProps, AgErrorKind } from './error/ProviderErrorState';
