/** @jest-environment jsdom */
// REQ-SURF-10 — pseudo-locale render: every SURF component rendered with
// labels overridden must show the override and zero English defaults.
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement as h } from 'react';
import { Pagination } from '../../src/components/pagination/Pagination';
import { Breadcrumbs } from '../../src/components/breadcrumbs/Breadcrumbs';
import { Message } from '../../src/ai/message/Message';
import { AppShell } from '../../src/app-shell';

const PL = '«Lörem»'; // pseudo-locale marker — must appear, English defaults must not

const FIXTURES: ReadonlyArray<readonly [string, React.ReactElement, string[]]> = [
  [
    'pagination',
    h(Pagination.Root as never, { count: 40, page: 2, pageSize: 10, labels: { previous: PL, next: PL, pagination: PL } }),
    ['Previous page', 'Next page', 'Pagination'],
  ],
  [
    'breadcrumbs',
    h(Breadcrumbs.Root as never, { 'aria-label': PL }, h(Breadcrumbs.Item as never, {}, h(Breadcrumbs.Link as never, { href: '#' }, PL)), h(Breadcrumbs.Current as never, {}, PL), h(Breadcrumbs.Item as never, {}, h(Breadcrumbs.Link as never, { href: '#' }, PL))),
    // structural class names (ag-breadcrumbs__*) are part names, not UI text —
    // the localizable default is the 'More' overflow label.
    ['More'],
  ],
  [
    'message',
    (() => { const msg = { id: 'm', role: 'assistant', parts: [{ type: 'text', text: PL }] } as never; return h(Message as never, { message: msg, labels: { assistant: PL } }); })(),
    // message role is a data attribute; the localizable default is 'Assistant'.
    ['Assistant'],
  ],
  [
    'appshell',
    h(AppShell.Root as never, {}, h(AppShell.Main as never, {}, PL)),
    ['Skip to content'],
  ],
];

describe('SURF pseudo-locale (REQ-SURF-10)', () => {
  it.each(FIXTURES)('%s: overrides render, 0 English defaults', (_name, el, banned) => {
    const html = renderToString(el);
    const found = banned.filter((b) => html.includes(b));
    expect({ found }).toEqual({ found: [] });
  });
  it('pagination shows the override', () => {
    const html = renderToString(h(Pagination.Root as never, { count: 40, page: 1, pageSize: 10, labels: { previous: PL, next: PL } }));
    expect(html).toContain(PL);
  });
});
