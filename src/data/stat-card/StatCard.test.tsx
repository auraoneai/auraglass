/** @jest-environment jsdom */
// SURF-178 / REQ-SURF-90: locale matrix, trend x direction matrix, labelledby
// uniqueness, link card + deep nested-interactive check, sparkline, loading.
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { StatCard } from './StatCard';

describe('StatCard (SURF-176, REQ-SURF-90)', () => {
  // Expected strings are the CLDR output for each locale (Arabic-Indic digits
  // and separators for ar-EG; NBSP before % in de-DE).
  it.each([
    ['en-US', '1,234,567.89', '+12.5%'],
    ['de-DE', '1.234.567,89', '+12,5 %'],
    ['ja-JP', '1,234,567.89', '+12.5%'],
    ['ar-EG', '١٬٢٣٤٬٥٦٧٫٨٩', '؜+١٢٫٥٪؜'],
  ])('locale %s formats value and visible delta', (locale, value, delta) => {
    const { container } = render(<StatCard label="Revenue" value={1234567.89} delta={0.125} locale={locale} />);
    expect(container.querySelector('[data-ag-part="stat-card-value"]')!.textContent).toBe(value);
    const visibleDelta = container.querySelector('[data-ag-part="stat-card-delta"] > span[aria-hidden="true"]:last-child')!;
    expect(visibleDelta.textContent).toBe(delta);
  });

  it.each([
    [0.125, 'up-is-good', 'success', 'Up 12.5% vs previous period'],
    [0.125, 'down-is-good', 'danger', 'Up 12.5% vs previous period'],
    [0.125, 'neutral', 'neutral', 'Up 12.5% vs previous period'],
    [-0.125, 'up-is-good', 'danger', 'Down 12.5% vs previous period'],
    [-0.125, 'down-is-good', 'success', 'Down 12.5% vs previous period'],
    [-0.125, 'neutral', 'neutral', 'Down 12.5% vs previous period'],
    [0, 'up-is-good', 'neutral', 'Unchanged 0% vs previous period'],
    [0, 'down-is-good', 'neutral', 'Unchanged 0% vs previous period'],
    [0, 'neutral', 'neutral', 'Unchanged 0% vs previous period'],
  ] as const)('delta %p x %s -> intent %s, hidden text "%s"', (delta, trendDirection, intent, text) => {
    const { container } = render(<StatCard label="M" value={1} delta={delta} trendDirection={trendDirection} />);
    const deltaEl = container.querySelector('[data-ag-part="stat-card-delta"]')!;
    expect(deltaEl.getAttribute('data-ag-intent')).toBe(intent);
    expect(container.querySelector('[data-ag-part="stat-card"]')!.getAttribute('data-ag-intent')).toBe(intent);
    expect(deltaEl.querySelector('.ag-visually-hidden')!.textContent).toBe(text);
  });

  it('labels.up/down/unchanged localise the hidden trend words', () => {
    const { container } = render(
      <StatCard label="M" value={1} delta={-0.5} locale="de-DE" deltaLabel="ggü. Vorperiode" labels={{ down: 'Runter' }} />,
    );
    expect(container.querySelector('.ag-visually-hidden')!.textContent).toBe('Runter 50 % ggü. Vorperiode');
  });

  it('two cards with the same label get distinct labelledby targets that resolve to their own label', () => {
    const { container } = render(
      <>
        <StatCard label="Revenue" value={1} />
        <StatCard label="Revenue" value={1} />
      </>,
    );
    const cards = [...container.querySelectorAll('article')];
    const targets = cards.map((c) => c.getAttribute('aria-labelledby')!);
    expect(new Set(targets).size).toBe(2);
    cards.forEach((card, i) => {
      const label = document.getElementById(targets[i]!)!;
      expect(card.contains(label)).toBe(true);
      expect(label.textContent).toBe('Revenue');
    });
    expect(new Set([...container.querySelectorAll('[id]')].map((e) => e.id)).size).toBe(
      container.querySelectorAll('[id]').length,
    );
  });

  it('explicit id names the labelledby target', () => {
    const { container } = render(<StatCard id="mrr" label="MRR" value={5} />);
    expect(container.querySelector('article')!.getAttribute('aria-labelledby')).toBe('mrr-label');
    expect(container.querySelector('#mrr-label')!.textContent).toBe('MRR');
  });

  it('href turns the whole card into one link', () => {
    const { container } = render(<StatCard label="L" value={1} href="/x" />);
    const a = container.querySelector('a[href="/x"]')!;
    expect(a.getAttribute('data-ag-part')).toBe('stat-card');
    expect(container.querySelector('article')).toBeNull();
  });

  describe('nested interactive descendants inside a linked card (dev error)', () => {
    const Wrapper = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;
    const run = (children: React.ReactNode) => {
      const prev = process.env['NODE_ENV'];
      process.env['NODE_ENV'] = 'development';
      const err = jest.spyOn(console, 'error').mockImplementation(() => {});
      try {
        render(
          <StatCard label="L" value={1} href="/x">
            {children}
          </StatCard>,
        );
        return err.mock.calls.some((c) => String(c[0]).includes('nested interactive children'));
      } finally {
        err.mockRestore();
        process.env['NODE_ENV'] = prev;
      }
    };
    it('flags a button nested several levels deep', () => {
      expect(run(<div><span><button type="button">x</button></span></div>)).toBe(true);
    });
    it('flags a component element carrying onClick or href', () => {
      expect(run(<Wrapper><Wrapper>{React.createElement(Wrapper, { onClick: () => {} } as never)}</Wrapper></Wrapper>)).toBe(true);
      expect(run(React.createElement(Wrapper, { href: '/y' } as never))).toBe(true);
    });
    it('flags tabIndex >= 0 but not static content', () => {
      expect(run(<div><span tabIndex={0}>f</span></div>)).toBe(true);
      expect(run(<div><span>static</span><em>text</em></div>)).toBe(false);
    });
  });

  it('sparkline renders aria-hidden svg', () => {
    const { container } = render(<StatCard label="S" value={1} sparkline={[1, 2, 3]} />);
    const svg = container.querySelector('[data-ag-part="stat-card-sparkline"] svg')!;
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('loading masks the value', () => {
    const { container } = render(<StatCard label="L" value={42} loading />);
    expect(container.querySelector('[data-ag-part="stat-card-value"]')!.getAttribute('data-state')).toBe('loading');
  });
});
