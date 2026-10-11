/**
 * Deterministic token stream for the Thread follow spec (REQ-SURF-108):
 * 300 frames × 50 tokens (15,000 one-token deltas, 16 ms apart per frame) into
 * a single text part. Replayed through `createReplay` by the
 * AI/Thread StreamingReplay story.
 */
import type { RecordedStream, StreamFrame } from './replay';

export const TOKENS_PER_FRAME = 50;
export const FRAMES = 300;

const WORDS = ['rotate', 'the', 'ingestion', 'keys', 'from', 'the', 'security', 'console', 'then', 'verify', 'overlap'];

export const THREAD_TOKEN_STREAM: RecordedStream = {
  messageId: 'replay-1',
  frames: Array.from({ length: FRAMES * TOKENS_PER_FRAME }, (_, i): StreamFrame => ({
    t: Math.floor(i / TOKENS_PER_FRAME) * 16,
    partIndex: 0,
    delta: `${WORDS[i % WORDS.length]}${i % 13 === 12 ? '.\n' : ' '}`,
  })),
};
