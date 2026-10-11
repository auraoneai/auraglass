/* GlassMessageList — 4.x compat adapter (REQ-SURF-13, DEP-S0402) → Thread.
   ChatMessage → AgMessage through the GlassChat mapping (content → text
   part, sender.id === currentUserId → user, timestamp → metadata.createdAt).
   The dropped 4.x props (virtualScroll, reactions, replyTo, edited) are named
   in the DEP-S0402 message; onMessageClick/onMessageReaction have no 5.0
   equivalent. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Thread } from '../../../ai/thread/Thread';
import { toAgMessages, type ChatMessage } from './GlassChat';

export interface GlassMessageListProps {
  messages?: ChatMessage[];
  currentUserId?: string;
  className?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassMessageList` compat adapter (DEP-S0402).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link Thread from aura-glass/ai}.
 */
export function GlassMessageList(props: GlassMessageListProps) {
  warnDeprecated('DEP-S0402');
  const { messages = [], currentUserId, className } = props;
  return <Thread messages={toAgMessages(messages, currentUserId, false)} {...(className ? { className } : {})} />;
}
