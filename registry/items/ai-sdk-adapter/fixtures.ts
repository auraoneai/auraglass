// fixtures.ts — deterministic sample data for ai-sdk-adapter (no clocks, no randomness,
// no network — contract §3.3 file contract). Stories and showcases import it.
import type { UIMessage } from 'ai';

/** Seed history for `useAuraChat({ messages })` — AI SDK v5 UIMessage parts. */
export const AURA_CHAT_MESSAGES: UIMessage[] = [
  { id: 'm-1', role: 'user', parts: [{ type: 'text', text: 'Summarise the 04:12 deploy.' }] },
  { id: 'm-2', role: 'assistant', parts: [{ type: 'text', text: 'Deploy window 04:12–04:19 UTC. No errors.' }] },
];
