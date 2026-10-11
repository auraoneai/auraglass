/* GlassChat — 4.x compat adapter (REQ-SURF-13, DEP-S0400) → Thread +
   Composer. 4.x ChatMessage → AgMessage: content → one `text` part,
   attachments → `file` parts, type 'system' → role system, sender.id ===
   currentUserId → user else assistant, timestamp (Date | string | number)
   → metadata.createdAt (ISO string for Dates). title → the region's
   aria-label; onSendMessage/onSend(text) ← Composer submit. The dropped 4.x
   props (reactions, replyTo, edited, predictive, eyeTracking, adaptive,
   spatialAudio, consciousness, trackAchievements, virtualScroll,
   onVoiceRecording) are named in the DEP-S0400 message. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Thread } from '../../../ai/thread/Thread';
import { Composer } from '../../../ai/composer/Composer';
import type { AgMessage } from '../../../ai/types';

export interface ChatMessage {
  id: string;
  content: string;
  sender: { id: string; name?: string; avatar?: string; status?: string };
  type?: 'text' | 'system' | string;
  timestamp?: Date | string | number;
  attachments?: Array<{ name?: string; type?: string; url?: string }>;
  [legacy: string]: unknown;
}

export interface GlassChatProps {
  messages?: ChatMessage[];
  currentUserId?: string;
  title?: string;
  onSend?: (text: string) => void;
  onSendMessage?: (text: string) => void;
  className?: string;
  [legacy: string]: unknown;
}

export function toAgMessages(messages: readonly ChatMessage[], currentUserId: string | undefined, withFiles = true): AgMessage[] {
  return messages.map((m) => ({
    id: m.id,
    role: m.type === 'system' ? 'system' : m.sender.id === currentUserId ? 'user' : 'assistant',
    parts: [
      { type: 'text' as const, text: m.content },
      ...(withFiles ? (m.attachments ?? []) : []).map((a) => ({
        type: 'file' as const,
        mediaType: a.type ?? 'application/octet-stream',
        url: a.url ?? '',
        ...(a.name !== undefined ? { filename: a.name } : {}),
      })),
    ],
    ...(m.timestamp !== undefined
      ? { metadata: { createdAt: m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp } }
      : {}),
  }));
}

/**
 * 4.x `GlassChat` compat adapter (DEP-S0400).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link Thread + Message + Composer from aura-glass/ai}.
 */
export function GlassChat(props: GlassChatProps) {
  warnDeprecated('DEP-S0400');
  const { messages = [], currentUserId, title, onSend, onSendMessage, className } = props;
  const send = onSendMessage ?? onSend;
  return (
    <section aria-label={title ?? 'Chat'} {...(className ? { className } : {})}>
      <Thread messages={toAgMessages(messages, currentUserId)} />
      {send ? <Composer onSubmit={({ text }) => send(text)} /> : null}
    </section>
  );
}
