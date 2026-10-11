/* ai-sdk-compat (SURF-284): the shipped AgMessage model is a structural
 * superset of the AI SDK `UIMessage` — every recorded SDK v5 envelope
 * deserialises into AgMessage. Checked against the exact pinned versions
 * in package-pins.json (ai@5.0.29): SDK v5 defines 4 tool states
 * (input-streaming|input-available|output-available|output-error) and 3
 * roles; AgMessage adds approval-requested|approval-responded|output-denied
 * and the 'tool' role, so assignability is SDK -> Ag only. */
import { expectAssignable } from 'tsd';
import type { ChatStatus, UIMessage } from 'ai';
import type { AgChatStatus, AgMessage, AgMessageMetadata } from '../../../src/ai/types';

// UIMessage's metadata generic defaults to `unknown`; envelopes carry AgMessageMetadata.
declare const sdk: UIMessage<AgMessageMetadata>[];
declare const status: AgChatStatus;

// Every SDK message deserialises into the shipped model.
expectAssignable<AgMessage[]>(sdk);
// Chat status mirrors the SDK status union exactly.
expectAssignable<ChatStatus>(status);
expectAssignable<AgChatStatus>(status as ChatStatus);
export {};
