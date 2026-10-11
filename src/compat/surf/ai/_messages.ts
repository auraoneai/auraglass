/* 4.x ChatMessage → AgMessage mapping shared by the chat compat adapters
   (REQ-SURF-13): content → one text part, attachments → file parts,
   type 'system' → system, sender.id === currentUserId → user else assistant,
   timestamp → metadata.createdAt (ISO string for Dates). */
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
