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
import { toAgMessages, type ChatMessage } from './_messages';

export type { ChatMessage } from './_messages';

export interface GlassChatProps {
  messages?: ChatMessage[];
  currentUserId?: string;
  title?: string;
  onSend?: (text: string) => void;
  onSendMessage?: (text: string) => void;
  className?: string;
  [legacy: string]: unknown;
}

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
