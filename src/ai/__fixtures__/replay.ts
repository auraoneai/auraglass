/**
 * Deterministic token-stream replay driver for AI stories/specs (SURF-344/345):
 * `createReplay(stream, clock)` → { messages(), pause(), step(n), finish() }.
 */
import type { AgMessage } from '../types';

export interface StreamFrame { t: number; partIndex: number; delta: string }
export interface RecordedStream { messageId: string; frames: StreamFrame[] }
export interface ReplayClock { now(): number; }

export interface Replay {
  messages(): readonly AgMessage[];
  pause(): void;
  step(n?: number): void;
  finish(): void;
  isDone(): boolean;
  subscribe(listener: () => void): () => void;
}

export function createReplay(stream: RecordedStream, clock: ReplayClock = { now: () => 0 }): Replay {
  let cursor = 0;
  let paused = false;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());
  const texts = new Map<number, string>();
  void clock;

  const materialize = (): AgMessage => ({
    id: stream.messageId,
    role: 'assistant',
    parts: Array.from(texts.entries()).sort(([a], [b]) => a - b).map(([i, text]) => ({
      type: 'text' as const,
      text,
      state: cursor >= stream.frames.length ? 'done' as const : 'streaming' as const,
    })),
    metadata: { status: cursor >= stream.frames.length ? 'complete' : 'streaming' },
  });

  const advance = (n: number) => {
    if (paused) return;
    for (let i = 0; i < n && cursor < stream.frames.length; i++, cursor++) {
      const f = stream.frames[cursor]!;
      texts.set(f.partIndex, (texts.get(f.partIndex) ?? '') + f.delta);
    }
  };

  return {
    messages: () => [materialize()],
    pause: () => { paused = true; emit(); },
    step: (n = 1) => { advance(n); emit(); },
    finish: () => { advance(stream.frames.length); emit(); },
    subscribe: (listener) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    isDone: () => cursor >= stream.frames.length,
  };
}
