/* Visual-pass structure checks for the ai-command-center, financial-dashboard and
   ops-console showcases: content sits on content-raised Card surfaces (never bare
   on the scene), headings come from Heading (token type scale), and no block
   placeholder copy leaks into a showcase. Pixel review stays with L14. */
import { describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';

jest.mock('../../showcase/ai-command-center/assets/workspace-mark.avif', () => 'workspace-mark.avif');
jest.mock('../../showcase/financial-dashboard/assets/ledgerline-mark.avif', () => 'ledgerline-mark.avif');
jest.mock('../../showcase/ops-console/assets/beacon-mark.avif', () => 'beacon-mark.avif');

import { AiCommandCenter, AiCommandCenterToolCalls } from '../../showcase/ai-command-center/AiCommandCenter.showcase';
import {
  FinancialDashboard,
  FinancialDashboardKpis,
  FinancialDashboardLedgerHead,
} from '../../showcase/financial-dashboard/FinancialDashboard.showcase';
import { OpsConsole, OpsConsoleSplit } from '../../showcase/ops-console/OpsConsole.showcase';
import { COPY } from '../../showcase/ai-command-center/copy';
import { APP_TITLE } from '../../registry/blocks/app-frame/fixtures';
import { KPIS, LEDGER } from '../../showcase/financial-dashboard/copy';

const contentCards = (root: ParentNode) =>
  Array.from(root.querySelectorAll('[data-ag-surface][data-ag-layer="content"][data-ag-content="content-raised"]'));

describe('ai-command-center visual pass', () => {
  it('puts the conversation and every activity panel on content-raised cards', () => {
    const { container } = render(<AiCommandCenter />);
    const cards = contentCards(container);
    expect(cards.length).toBe(4);
    const conversation = screen.getByRole('region', { name: 'Conversation' });
    expect(cards).toContain(conversation);
    for (const name of [COPY.toolActivity, COPY.reasoning, COPY.draftReply]) {
      const heading = screen.getByRole('heading', { level: 2, name });
      expect(heading.closest('[data-ag-content="content-raised"]')).not.toBeNull();
    }
  });

  it('keeps glass on the shell chrome, never on the content cards', () => {
    const { container } = render(<AiCommandCenter />);
    const chrome = Array.from(container.querySelectorAll('[data-ag-surface][data-ag-layer="chrome"]')).map((el) =>
      el.getAttribute('data-ag-part'),
    );
    expect(chrome).toEqual(expect.arrayContaining(['top-bar', 'sidebar', 'inspector']));
    for (const card of contentCards(container)) expect(card.hasAttribute('data-ag-variant')).toBe(false);
  });

  it('renders section headings through Heading and a single h1', () => {
    const { container } = render(<AiCommandCenter />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 2, name: /tool activity/i }).classList.contains('ag-heading')).toBe(true);
  });

  it('the ToolCall fragment is a card with an unbulleted stack', () => {
    const { container } = render(<AiCommandCenterToolCalls />);
    expect(contentCards(container)).toHaveLength(1);
    expect(container.querySelector('ol')).not.toBeNull();
  });
});

describe('financial-dashboard visual pass', () => {
  it('wraps each KPI tile in a content-raised card so tiles have an edge on flat-white', () => {
    const { container } = render(<FinancialDashboardKpis />);
    const cards = contentCards(container);
    expect(cards).toHaveLength(KPIS.length);
    for (const card of cards) expect(card.querySelector('[data-ag-part="stat-card"]')).not.toBeNull();
  });

  it('the chart draws gridlines, y ticks and one marker per month for each series', () => {
    const { container } = render(<FinancialDashboard />);
    const svg = container.querySelector('svg[aria-label="Net cash flow by month"]');
    expect(svg).not.toBeNull();
    expect(svg!.querySelectorAll('line')).toHaveLength(5);
    expect(svg!.querySelectorAll('polyline')).toHaveLength(2);
    expect(svg!.querySelectorAll('circle')).toHaveLength(12);
  });

  it('the ledger fragment shows exactly one page of 20 rows and no pagination', () => {
    const { container } = render(<FinancialDashboardLedgerHead />);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(20);
    expect(screen.queryByRole('navigation', { name: 'Ledger pages' })).toBeNull();
  });

  it('pagination in the ledger view actually moves through the ledger', () => {
    function Paged() {
      const [page, setPage] = React.useState(1);
      return <FinancialDashboardLedgerHead page={page} onPageChange={setPage} />;
    }
    render(<Paged />);
    const nav = screen.getByRole('navigation', { name: 'Ledger pages' });
    expect(screen.getByText(LEDGER[0]!.id)).toBeTruthy();
    fireEvent.click(within(nav).getByRole('button', { name: /next/i }));
    expect(screen.queryByText(LEDGER[0]!.id)).toBeNull();
    expect(screen.getByText(LEDGER[20]!.id)).toBeTruthy();
  });
});

describe('ops-console visual pass', () => {
  it('replaces the app-frame placeholder brand, nav and inspector copy', () => {
    const { container } = render(<OpsConsole />);
    expect(container.textContent).not.toContain(APP_TITLE);
    expect(container.textContent).not.toContain('Select a row to inspect it.');
    expect(container.textContent).toContain('Beacon Ops');
    expect(screen.getByRole('link', { name: 'Incidents' }).getAttribute('aria-current')).toBe('page');
  });

  it('puts the incident grid and the topology split on content-raised cards', () => {
    const { container } = render(<OpsConsole />);
    expect(contentCards(container)).toHaveLength(2);
    const { container: split } = render(<OpsConsoleSplit />);
    expect(contentCards(split)).toHaveLength(1);
    expect(split.querySelectorAll('dt.ag-text')).toHaveLength(6);
  });

  it('renders the destructive trigger as a Button, not a bare UA button', () => {
    render(<OpsConsole />);
    const resolve = screen.getByRole('button', { name: 'Resolve incident' });
    expect(resolve.getAttribute('data-ag-surface')).toBe('');
    expect(resolve.getAttribute('data-ag-intent')).toBe('danger');
  });
});
