'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Thread } from '../../../ai/thread/Thread';
import type { ChatMessage } from './GlassChat';
import type { AgMessage } from '../../../ai/types';

/** @deprecated GlassMessageListProps DEP-S0651 since 4.2.0, removed in 6.0.0. */
export interface GlassMessageListProps {
  messages: ChatMessage[];
  currentUserId?: string;
  className?: string;
}

export function GlassMessageList({ messages, currentUserId, className }: GlassMessageListProps) {
  warnDeprecated('DEP-S0651');
  const ag: AgMessage[] = messages.map((m) => ({
    id: m.id,
    role: m.type === 'system' ? 'system' : m.sender.id === currentUserId ? 'user' : 'assistant',
    parts: [{ type: 'text', text: m.content }],
    ...(m.timestamp !== undefined ? { metadata: { createdAt: m.timestamp } } : {}),
  }));
  return <Thread messages={ag} className={className} />;
}
