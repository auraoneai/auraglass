/** @jest-environment node */
// SURF-266 / REQ-SURF-171 — support-inbox block server render against the
// real library sources.
import { describe, expect, it, jest } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
// 'aura-glass/<entry>' is not mapped by the root jest config yet (REQ-FIN-09 /
// contract C-4, FIN-A): alias to the src/contracts/entries.ts sources — the
// real modules, never doubles.
jest.mock('aura-glass/data', () => jest.requireActual('../../../src/data/index'), { virtual: true });
jest.mock('aura-glass/ai', () => jest.requireActual('../../../src/ai/index'), { virtual: true });

import { SupportInbox } from '../../../registry/blocks/support-inbox/index';
import { MESSAGES, TICKETS } from '../../../registry/blocks/support-inbox/fixtures';

describe('support-inbox block', () => {
  it('renders the ticket table and the conversation Thread', () => {
    const html = renderToString(createElement(SupportInbox));
    expect(html).toContain('data-ag-part="support-inbox"');
    for (const t of TICKETS) expect(html).toContain(t.subject);
    expect(html).toContain('data-ag-part="thread"');
    expect(html).toContain('role="log"');
    for (const m of MESSAGES[TICKETS[0]!.id]!) expect(html).toContain(m.body);
  });
});
