/** @jest-environment jsdom */
// tests/ai/exports/ai-exports.test.ts — AC-SURF-15 (SURF-367): ./ai exports
// exactly the 11 value names + helpers as typed statics; nothing else.

import { describe, expect, it } from '@jest/globals';
import * as Ai from '../../../src/ai';

const VALUES = [
  'Thread', 'Message', 'StreamingText', 'Composer', 'ToolCall',
  'SourceList', 'Citation', 'Reasoning', 'AgentSteps', 'UsageMeter',
  'ProviderErrorState',
];

describe('ai barrel exports (AC-SURF-15)', () => {
  it('exactly 11 value exports', () => {
    const valueKeys = Object.keys(Ai).filter((k) => typeof (Ai as Record<string, unknown>)[k] !== 'undefined');
    expect(valueKeys.sort()).toEqual([...VALUES].sort());
  });
  it('typed statics', () => {
    expect(typeof Ai.Message.Parts).toBe('function');
    expect(typeof Ai.Message.getText).toBe('function');
    expect(typeof Ai.Thread.RenderersProvider).toBe('function');
    expect(typeof Ai.ToolCall.displayState).toBe('function');
    expect(typeof Ai.ToolCall.Approval).toBe('function');
  });
});
