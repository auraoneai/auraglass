'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Thread } from '../../../ai/thread/Thread';
import { Composer } from '../../../ai/composer/Composer';
import type { AgMessage } from '../../../ai/types';

/** @deprecated ChatMessage DEP-S0653 since 4.2.0, removed in 6.0.0. */
export interface ChatMessage {
  id: string;
  content: string;
  sender: { id: string; name?: string };
  type?: 'system';
  timestamp?: string | number;
  attachments?: Array<{ name?: string; type?: string; url?: string }>;
}

export interface GlassChatProps {
  messages: ChatMessage[];
  currentUserId?: string;
  onSend?: (text: string) => void;
  className?: string;
}

/** REQ-SURF-13/SC-34: 4.x ChatMessage → AgMessage mapping (one dev warning). */
export function GlassChat({ messages, currentUserId, onSend, className }: GlassChatProps) {
  warnDeprecated('DEP-S0653');
  const ag: AgMessage[] = messages.map((m) => ({
    id: m.id,
    role: m.type === 'system' ? 'system' : m.sender.id === currentUserId ? 'user' : 'assistant',
    parts: [
      { type: 'text', text: m.content },
      ...(m.attachments ?? []).map((a) => ({ type: 'file' as const, mediaType: a.type ?? 'application/octet-stream', url: a.url ?? '', ...(a.name !== undefined ? { filename: a.name } : {}) })),
    ],
    ...(m.timestamp !== undefined ? { metadata: { createdAt: m.timestamp } } : {}),
  }));
  return (
    <div className={className} data-ag-part="glass-chat">
      <Thread messages={ag} />
      {onSend ? <Composer onSubmit={({ text }) => onSend(text)} /> : null}
    </div>
  );
}
