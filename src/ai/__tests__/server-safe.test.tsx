import { describe, expect, it } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(__dirname, '..');

/**
 * REQ-SURF-07: Message.tsx, MessageParts.tsx, AgentSteps.tsx, UsageMeter.tsx
 * are server-safe — no 'use client' directive, no hooks, no context reads.
 * (Client modules they *render* — ToolCall/Reasoning/etc — carry the directive.)
 */
const SERVER_MODULES = [
  'message/Message.tsx',
  'message/MessageParts.tsx',
  'agent/AgentSteps.tsx',
  'usage/UsageMeter.tsx',
];

const HOOK_RE = /\b(use(State|Effect|Memo|Callback|Ref|Context|Id|ImperativeHandle|LayoutEffect|Reducer|SyncExternalStore|Transition|DeferredValue|InsertionEffect|Optimistic)|useAiRenderers|useAnnouncer|useLayer|usePortalContainer|useThreadScroll|useAttachments|useThread)\s*\(/;
const CTX_READ_RE = /\b(useContext|createContext)\b/;

describe('ai server-safe modules (REQ-SURF-07)', () => {
  it.each(SERVER_MODULES)('%s has no use client directive / hooks / context reads', (file) => {
    const src = readFileSync(join(ROOT, file), 'utf8');
    expect(src.startsWith("'use client'") || src.startsWith('"use client"')).toBe(false);
    expect(HOOK_RE.test(src)).toBe(false);
    expect(CTX_READ_RE.test(src)).toBe(false);
  });
});
