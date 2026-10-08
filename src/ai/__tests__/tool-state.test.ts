import { describe, expect, it } from '@jest/globals';
import { toolDisplayState } from '../tool-state';
import type { AgToolPart } from '../types';

const base: Omit<AgToolPart, 'state'> = { type: 'tool-search', toolCallId: 'tc-1' };

describe('toolDisplayState (§4.5)', () => {
  it.each([
    ['input-streaming', undefined, 'queued'],
    ['input-available', undefined, 'running'],
    ['approval-requested', undefined, 'needs-approval'],
    ['approval-responded', { id: 'a1', approved: true }, 'running'],
    ['approval-responded', { id: 'a1', approved: false }, 'denied'],
    ['output-available', undefined, 'succeeded'],
    ['output-error', undefined, 'failed'],
    ['output-denied', undefined, 'denied'],
  ] as const)('%s → %s', (state, approval, expected) => {
    expect(toolDisplayState({ ...base, state, approval } as AgToolPart)).toBe(expected);
  });
});
