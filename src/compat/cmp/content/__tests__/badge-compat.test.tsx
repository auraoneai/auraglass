/* REQ-CMP-114 compat legs: the three absorbed 4.x badge names warn their
   #313 (release/4.x) DEP ids and render 5.0 Badge output with the 4.x props
   mapped. */
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { GlassStatusDot } from '../GlassStatusDot';
import { GlassConnectionStatus } from '../GlassConnectionStatus';
import { LiquidGlassBadgeCluster } from '../LiquidGlassBadgeCluster';
import * as compat from '../../index';

afterEach(cleanup);

async function renderCollectingWarnings(el: React.ReactElement) {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  let view!: ReturnType<typeof render>;
  await act(async () => { view = render(el); });
  const messages = warn.mock.calls.map((c) => String(c[0]));
  warn.mockRestore();
  return { view, messages };
}

function setOnline(value: boolean) {
  Object.defineProperty(window.navigator, 'onLine', { configurable: true, get: () => value });
}

describe('Badge compat (REQ-CMP-114)', () => {
  it('exports the three adapters from src/compat/cmp', () => {
    expect(compat.GlassStatusDot).toBe(GlassStatusDot);
    expect(compat.GlassConnectionStatus).toBe(GlassConnectionStatus);
    expect(compat.LiquidGlassBadgeCluster).toBe(LiquidGlassBadgeCluster);
  });

  describe('GlassStatusDot -> Badge dot (DEP-C0237)', () => {
    it('warns DEP-C0237 and renders a dot badge', async () => {
      const { view, messages } = await renderCollectingWarnings(<GlassStatusDot />);
      expect(messages.some((m) => m.includes('DEP-C0237'))).toBe(true);
      const root = view.container.querySelector('[data-ag-part="root"]')!;
      expect(root).toHaveAttribute('data-ag-dot');
      expect(root).toHaveClass('ag-badge-dot');
      expect(root).toHaveAttribute('data-ag-intent', 'success');
    });

    it.each([
      ['ok', 'success'],
      ['warn', 'warning'],
      ['error', 'danger'],
      ['busy', 'info'],
      ['offline', 'neutral'],
    ] as const)('maps status %s to intent %s', (status, intent) => {
      const { container } = render(<GlassStatusDot status={status} />);
      expect(container.querySelector('[data-ag-part="root"]')).toHaveAttribute('data-ag-intent', intent);
    });

    it('maps size to the dot inline/block size and keeps className', () => {
      const { container } = render(<GlassStatusDot size={12} className="x" />);
      const root = container.querySelector<HTMLElement>('[data-ag-part="root"]')!;
      expect(root.style.inlineSize).toBe('12px');
      expect(root.style.blockSize).toBe('12px');
      expect(root).toHaveClass('x');
    });
  });

  describe('GlassConnectionStatus -> Badge (DEP-C0238)', () => {
    afterEach(() => setOnline(true));

    it('warns DEP-C0238 and maps explicit status to intent and label', async () => {
      const { view, messages } = await renderCollectingWarnings(<GlassConnectionStatus status="slow" />);
      expect(messages.some((m) => m.includes('DEP-C0238'))).toBe(true);
      const root = view.container.querySelector('[data-ag-part="root"]')!;
      expect(root).toHaveAttribute('data-ag-intent', 'warning');
      expect(root).toHaveAttribute('role', 'status');
      expect(root).toHaveAttribute('aria-live', 'polite');
      expect(root).toHaveTextContent('Slow Connection');
    });

    it('auto status follows window online/offline events and reports changes', async () => {
      setOnline(true);
      const onStatusChange = jest.fn();
      const { container } = render(<GlassConnectionStatus onStatusChange={onStatusChange} labels={{ offline: 'Down' }} />);
      const root = container.querySelector('[data-ag-part="root"]')!;
      expect(root).toHaveAttribute('data-ag-intent', 'success');
      expect(root).toHaveTextContent('Online');

      setOnline(false);
      await act(async () => { window.dispatchEvent(new Event('offline')); });
      expect(root).toHaveAttribute('data-ag-intent', 'danger');
      expect(root).toHaveTextContent('Down');
      expect(onStatusChange).toHaveBeenLastCalledWith('offline');

      setOnline(true);
      await act(async () => { window.dispatchEvent(new Event('online')); });
      expect(root).toHaveAttribute('data-ag-intent', 'success');
      expect(onStatusChange).toHaveBeenLastCalledWith('online');
    });

    it('showText=false renders a dot named by the status label', () => {
      render(<GlassConnectionStatus status="offline" showText={false} />);
      const root = screen.getByRole('status');
      expect(root).toHaveAttribute('data-ag-dot');
      expect(root).toHaveTextContent('Offline');
    });

    it('drops unmappable 4.x props with one warning each', async () => {
      const { messages } = await renderCollectingWarnings(
        <GlassConnectionStatus status="online" position="top-left" elevation="level2" />,
      );
      expect(messages.some((m) => m.includes('DEP-C0238.prop.position'))).toBe(true);
      expect(messages.some((m) => m.includes('DEP-C0238.prop.elevation'))).toBe(true);
    });
  });

  describe('LiquidGlassBadgeCluster -> Badge (DEP-C0236)', () => {
    const items = [
      { id: 'a', label: 'Alpha', selected: true },
      { id: 'b', label: 'Beta' },
      { id: 'c', label: 'Gamma' },
      { id: 'd', label: 'Delta' },
      { id: 'e', label: 'Epsilon' },
    ];

    it('warns DEP-C0236 and renders one Badge per visible item plus a +N toggle', async () => {
      const onExpandedChange = jest.fn();
      const { view, messages } = await renderCollectingWarnings(
        <LiquidGlassBadgeCluster items={items} onExpandedChange={onExpandedChange} />,
      );
      expect(messages.some((m) => m.includes('DEP-C0236'))).toBe(true);
      const badges = view.container.querySelectorAll('.ag-badge');
      expect([...badges].map((b) => b.textContent)).toEqual(['Alpha', 'Beta', 'Gamma']);
      expect(badges[0]).toHaveAttribute('data-ag-intent', 'info');
      expect(badges[0]).toHaveAttribute('aria-pressed', 'true');
      expect(badges[1]).toHaveAttribute('data-ag-intent', 'neutral');
      const toggle = screen.getByRole('button', { name: '+2' });
      fireEvent.click(toggle);
      expect(onExpandedChange).toHaveBeenCalledWith(true);
    });

    it('expanded shows every item and no toggle', () => {
      const { container } = render(<LiquidGlassBadgeCluster items={items} expanded />);
      expect(container.querySelectorAll('.ag-badge')).toHaveLength(5);
      expect(screen.queryByRole('button')).toBeNull();
    });
  });
});
