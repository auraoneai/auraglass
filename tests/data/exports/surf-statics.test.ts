/** @jest-environment jsdom */
// SURF-141 — REQ-SURF-02: the SURF contract statics exist and work without
// rendering. All 11 rows: FilterBar useModel/serialize/parse, Message
// Parts/getText, Thread.RenderersProvider, ToolCall.displayState,
// AppShell.parseCookie (asserted by the REQ-SURF-01 gate in
// surf-entries.test.ts), Pagination.getRange, Command.score,
// SourceTransition.start.
import { describe, expect, it } from '@jest/globals';
import { FilterBar } from '../../../src/data/filter-bar/FilterBar';
import type { FilterField } from '../../../src/data/filter-bar/filter-model';
import { Message } from '../../../src/ai/message/Message';
import { Thread } from '../../../src/ai/thread/Thread';
import { ToolCall } from '../../../src/ai/tool/ToolCall';
import { Pagination } from '../../../src/components/pagination/Pagination';
import { Command } from '../../../src/components/command-palette/Command';
import { SourceTransition } from '../../../src/components/source-transition/SourceTransition';

const FIELDS: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'age', label: 'Age', type: 'number' },
];

describe('FilterBar statics (SURF-141, REQ-SURF-02/86)', () => {
  it('exposes useModel, serialize, parse', () => {
    expect(typeof FilterBar.useModel).toBe('function');
    expect(typeof FilterBar.serialize).toBe('function');
    expect(typeof FilterBar.parse).toBe('function');
  });
  it('serialize/parse round-trip a populated group', () => {
    const group = {
      kind: 'group' as const,
      id: 'g1',
      combinator: 'and' as const,
      children: [
        { kind: 'rule' as const, id: 'r1', fieldId: 'name', operator: 'contains' as const, value: 'ada' },
        { kind: 'rule' as const, id: 'r2', fieldId: 'age', operator: '>=' as const, value: 30 },
      ],
    };
    const params = FilterBar.serialize(group);
    const back = FilterBar.parse(FIELDS, params);
    expect(back.children.length).toBe(2);
  });
});

describe('namespace statics (REQ-SURF-02)', () => {
  it('all contract statics exist as functions', () => {
    const t = (o: unknown) => typeof o;
    expect({ messageParts: t(Message.Parts), messageGetText: t(Message.getText) })
      .toEqual({ messageParts: 'function', messageGetText: 'function' });
    expect(t(Thread.RenderersProvider)).toBe('function');
    expect(t(ToolCall.displayState)).toBe('function');
    expect(t(Pagination.getRange)).toBe('function');
    expect(t(Command.score)).toBe('function');
    expect(t(SourceTransition.start)).toBe('function');
    /* AppShell.parseCookie is the 11th — landed by REQ-SURF-01 and gated in
       tests/data/exports/surf-entries.test.ts. */
  });
  it('Pagination.getRange returns the range shape', () => {
    const r = Pagination.getRange({ page: 5, pageCount: 20, siblingCount: 1, boundaryCount: 1 });
    expect(Array.isArray(r)).toBe(true);
    expect(r.length).toBeGreaterThan(0);
  });
  it('Command.score ranks fuzzy hits in [0,1]', () => {
    const hit = Command.score('strm', 'streaming text');
    const miss = Command.score('zzz', 'streaming text');
    expect(hit).toBeGreaterThan(0);
    expect(miss).toBeLessThanOrEqual(hit);
  });
});
