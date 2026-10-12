import { afterEach, describe, expect, it, jest } from '@jest/globals';
import * as React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { Citation } from '../Citation';
import { SourceList, SourceScope } from '../SourceList';
import { layerStackFor } from '../../../theme/layers/LayerStack';
import { subscribeFrame } from '../../../motion';

const source = { type: 'source-url' as const, sourceId: 's-1', url: 'https://docs.x/keys', title: 'Key policy', snippet: 'Rotate keys every 90 days.' };
const preview = () => document.querySelector('[data-ag-part="citation-preview"]');
// one frame of the shared motion ticker (REQ-MOT-65: no direct rAF under src/ai)
const nextFrame = () => act(async () => { await new Promise<void>((r) => { const off = subscribeFrame(() => { off(); r(); }); }); });

afterEach(() => { jest.useRealTimers(); });

describe('Citation', () => {
  it('accessible name "Source {index}: {title}", href to the source item', () => {
    render(<Citation messageId="m1" source={source} index={2} />);
    const a = screen.getByRole('link', { name: 'Source 2: Key policy' });
    expect(a.getAttribute('href')).toBe('#ag-src-m1-s-1');
    expect(a.textContent).toContain('[2]');
  });

  it('preview opens on focus with title, snippet and hostname; closes on blur', async () => {
    jest.useFakeTimers();
    render(<Citation messageId="m1" source={source} index={1} />);
    const a = screen.getByRole('link', { name: 'Source 1: Key policy' });
    act(() => { a.focus(); });
    await act(async () => { jest.advanceTimersByTime(300); });
    const card = preview();
    expect(card).not.toBeNull();
    expect(card!.querySelector('[data-ag-part="citation-preview-title"]')!.textContent).toBe('Key policy');
    expect(card!.querySelector('[data-ag-part="citation-preview-snippet"]')!.textContent).toBe('Rotate keys every 90 days.');
    expect(card!.querySelector('[data-ag-part="citation-preview-host"]')!.textContent).toBe('docs.x');
    expect(a.getAttribute('aria-describedby')).toBe(card!.id);
    act(() => { a.blur(); });
    await act(async () => { jest.advanceTimersByTime(50); });
    expect(preview()).toBeNull();
  });

  it('hover opens only after 300 ms', async () => {
    jest.useFakeTimers();
    render(<Citation messageId="m1" source={source} index={1} />);
    const a = screen.getByRole('link', { name: 'Source 1: Key policy' });
    fireEvent.pointerEnter(a, { pointerType: 'mouse' });
    fireEvent.mouseEnter(a);
    fireEvent.mouseMove(a);
    await act(async () => { jest.advanceTimersByTime(290); });
    expect(preview()).toBeNull();
    await act(async () => { jest.advanceTimersByTime(20); });
    expect(preview()).not.toBeNull();
  });

  it('the preview carries no dialog/tooltip role and portals into the overlay container', async () => {
    jest.useFakeTimers();
    const { container } = render(<Citation messageId="m1" source={source} index={1} />);
    act(() => { screen.getByRole('link').focus(); });
    await act(async () => { jest.advanceTimersByTime(300); });
    const card = preview()!;
    expect(card).not.toBeNull();
    expect(container.contains(card)).toBe(false); // portalled out of the inline tree
    for (const el of [card, ...card.querySelectorAll('*')]) {
      expect(['dialog', 'tooltip']).not.toContain(el.getAttribute('role'));
    }
    expect(document.querySelectorAll('[role="dialog"], [role="tooltip"]')).toHaveLength(0);
  });

  it('Escape closes the preview (open card registered on the LayerStack) and focus stays on the citation', async () => {
    jest.useFakeTimers();
    render(<Citation messageId="m1" source={source} index={1} />);
    const a = screen.getByRole('link');
    act(() => { a.focus(); });
    await act(async () => { jest.advanceTimersByTime(300); });
    expect(preview()).not.toBeNull();
    expect(layerStackFor(document).top()?.kind).toBe('preview-card');
    fireEvent.keyDown(a, { key: 'Escape' });
    await act(async () => { jest.advanceTimersByTime(50); });
    expect(preview()).toBeNull();
    expect(document.activeElement).toBe(a);
    expect(layerStackFor(document).top()).toBeUndefined();
  });

  it('Enter/click activation opens the collapsed SourceList and focuses the source item', async () => {
    const sources = [1, 2, 3, 4].map((i) => ({ type: 'source-url' as const, sourceId: `s${i}`, url: `https://d.x/${i}`, title: `Ref ${i}` }));
    render(
      <article data-ag-part="message">
        <p><Citation messageId="m9" source={sources[3]!} index={4} /></p>
        <SourceList messageId="m9" sources={sources} />
      </article>,
    );
    const trigger = document.querySelector('[data-ag-part="source-list"] [data-ag-part="trigger"]')!;
    expect(trigger.getAttribute('aria-expanded')).toBe('false'); // 4 > 3 → closed
    const a = screen.getByRole('link', { name: 'Source 4: Ref 4' });
    const notPrevented = fireEvent.click(a); // Enter on a link dispatches click
    expect(notPrevented).toBe(false);
    await nextFrame();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(document.getElementById('ag-src-m9-s4'));
  });

  it('SourceScope: same message id in two scopes resolves to its own list', async () => {
    const s = [1, 2, 3, 4].map((i) => ({ type: 'source-url' as const, sourceId: `s${i}`, url: `https://d.x/${i}`, title: `Ref ${i}` }));
    render(
      <>
        <div data-testid="a"><SourceScope><Citation messageId="dup" source={s[0]!} index={1} /><SourceList messageId="dup" sources={s} /></SourceScope></div>
        <div data-testid="b"><SourceScope><Citation messageId="dup" source={s[0]!} index={1} /><SourceList messageId="dup" sources={s} /></SourceScope></div>
      </>,
    );
    const [, second] = screen.getAllByRole('link', { name: 'Source 1: Ref 1' });
    fireEvent.click(second!);
    await nextFrame();
    const triggers = [...document.querySelectorAll('[data-ag-part="source-list"] > [data-ag-part="trigger"]')];
    expect(triggers.map((t) => t.getAttribute('aria-expanded'))).toEqual(['false', 'true']);
  });

  it('without a mounted SourceList the native href navigation is kept', () => {
    render(<Citation messageId="none" source={source} index={1} />);
    expect(fireEvent.click(screen.getByRole('link'))).toBe(true);
  });
  /* REQ-CMP-85 (S-30): the preview card takes the shared anchored-popup
     positioner contract — Base UI applies the 8 px side offset as the
     main-axis translate and flags data-side/data-align on the card. */
  it('preview positioner applies the shared 8 px sideOffset with data-side/data-align', async () => {
    render(<Citation messageId="m1" source={source} index={1} defaultOpen />);
    await act(async () => { await new Promise((r) => setTimeout(r, 20)); });
    const positioner = document.querySelector<HTMLElement>('[data-ag-part="citation-preview-positioner"]')!;
    expect(positioner).not.toBeNull();
    const side = positioner.getAttribute('data-side');
    const match = /translate\((-?[\d.]+)px, (-?[\d.]+)px\)/u.exec(positioner.style.transform);
    expect(match).not.toBeNull();
    const mainAxis = Math.abs(Number(side === 'left' || side === 'right' ? match![1] : match![2]));
    expect(mainAxis).toBe(8);
    expect(preview()!.getAttribute('data-side')).toBeTruthy();
    expect(preview()!.getAttribute('data-align')).toBeTruthy();
  });
});
