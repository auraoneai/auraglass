/* ai-sdk-compat (REQ-SURF-106, REQ-FIN-85): the shipped AgMessage model is a
 * structural superset of the AI SDK `UIMessage`, checked by the root
 * `tsc -p tsconfig.json --noEmit` against the exact devDependency pins in
 * package.json (ai@5.0.29, @ai-sdk/react@2.0.29). No `tsd`: every assertion is
 * a plain type-level assignment, so a regression is a compile error.
 *
 * SDK v5 defines 4 tool states (input-streaming|input-available|
 * output-available|output-error) and 3 roles; AgMessage adds
 * approval-requested|approval-responded|output-denied and the 'tool' role, so
 * assignability is SDK -> Ag only. Moving to SDK v6 (approval states) is
 * OD-16; until then the v5 major stays pinned. */
import type { ChatStatus, UIMessage } from 'ai';
import type { useChat } from '@ai-sdk/react';
import type { AgChatStatus, AgMessage, AgMessageMetadata, AgPart } from '../../../src/ai/types';

/** Mutual assignability: `Equal<A, B>` is `true` only when A and B are identical. */
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
function assertType<T extends true>(): T | void {}

// UIMessage's metadata generic defaults to `unknown`; envelopes carry AgMessageMetadata.
declare const sdkMessages: UIMessage<AgMessageMetadata>[];
declare const sdkPart: UIMessage<AgMessageMetadata>['parts'][number];

// 1. Every SDK message deserialises into the shipped model with no cast.
const agMessages: AgMessage[] = sdkMessages;
const agPart: AgPart = sdkPart;
// `satisfies` form of the same contract (no widening of the SDK value).
void (sdkMessages satisfies readonly AgMessage[]);

// 2. useChat().messages (the default UIMessage generic) is assignable as well.
type UseChatResult = ReturnType<typeof useChat<UIMessage<AgMessageMetadata>>>;
declare const chat: UseChatResult;
const fromHook: AgMessage[] = chat.messages;

// 3. useChat().status is assignable to AgChatStatus, and AgChatStatus mirrors
//    the SDK ChatStatus union exactly (both directions).
const hookStatus: AgChatStatus = chat.status;
assertType<Equal<AgChatStatus, ChatStatus>>();

// 4. The direction is one-way: AgMessage adds the 'tool' role and the approval
//    states, which SDK v5 rejects. If a future pin makes these compile, the
//    unused @ts-expect-error fails tsc and the comment above must be revisited.
declare const agOnly: AgMessage;
// @ts-expect-error -- AgMessage is a strict superset of SDK v5 UIMessage.
const backToSdk: UIMessage<AgMessageMetadata> = agOnly;

void agMessages;
void agPart;
void fromHook;
void hookStatus;
void backToSdk;
export {};
