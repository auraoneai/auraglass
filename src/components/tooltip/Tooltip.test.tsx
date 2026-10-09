/* CMP-271 (REQ-CMP-99/100/101): Tooltip — describedby on the trigger, dev
   error on interactive content, provider skip-delay, long-press on touch. */
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render, screen, act, fireEvent, createEvent } from '@testing-library/react';
import * as React from 'react';
import { AuraGlassProvider } from '../../theme';
import { TooltipPortal, TooltipPositioner, TooltipPopup, Tooltip } from './index';

const Demo = ({ children, trigger = 'save', popup = <TooltipPopup>hint</TooltipPopup>, provider = {} }: {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  popup?: React.ReactElement;
  provider?: Record<string, unknown>;
}) => (
  <AuraGlassProvider>
    <Tooltip.Provider {...provider}>
      <Tooltip.Root>
        <Tooltip.Trigger>{trigger}</Tooltip.Trigger>
        <TooltipPortal>
          <TooltipPositioner>{popup}</TooltipPositioner>
        </TooltipPortal>
      </Tooltip.Root>
      {children}
    </Tooltip.Provider>
  </AuraGlassProvider>
);

describe('Tooltip', () => {
  beforeEach(() => {
    if (window.PointerEvent === undefined) {
      (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
    }
  });
  afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

  it('hover opens after provider delay (600ms) and popup gets role=tooltip + thin material', async () => {
    jest.useFakeTimers();
    render(<Demo />);
    const trigger = screen.getByText('save');
    fireEvent.mouseEnter(trigger);
    fireEvent.pointerMove(trigger, { pointerType: 'mouse' });
    fireEvent.mouseMove(trigger);
    act(() => { jest.advanceTimersByTime(599); });
    expect(document.querySelector('[data-ag-part="popup"]')).toBeNull();
    act(() => { jest.advanceTimersByTime(2); });
    const popup = document.querySelector('[data-ag-part="popup"]');
    expect(popup).not.toBeNull();
    expect(popup!.getAttribute('role')).toBe('tooltip');
    expect(popup!.getAttribute('data-ag-overlay')).toBe('tooltip');
    expect(popup!.getAttribute('data-ag-thickness')).toBe('thin');
  });

  it('the focused element carries aria-describedby → popup', async () => {
    render(
      <AuraGlassProvider>
        <Tooltip.Provider>
          <Tooltip.Root defaultOpen>
            <Tooltip.Trigger>save</Tooltip.Trigger>
            <TooltipPortal><TooltipPositioner><TooltipPopup>hint text</TooltipPopup></TooltipPositioner></TooltipPortal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </AuraGlassProvider>,
    );
    const trigger = screen.getByText('save');
    const popup = document.querySelector('[data-ag-part="popup"]')!;
    expect(trigger.getAttribute('aria-describedby')).toBe(popup.id);
  });

  it('dev error on interactive content inside Popup', async () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <AuraGlassProvider>
        <Tooltip.Provider>
          <Tooltip.Root defaultOpen>
            <Tooltip.Trigger>save</Tooltip.Trigger>
            <TooltipPortal><TooltipPositioner><TooltipPopup><button>click</button></TooltipPopup></TooltipPositioner></TooltipPortal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </AuraGlassProvider>,
    );
    await act(async () => {});
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('must not contain interactive content'));
  });

  it('provider skip-delay window: second tooltip opens within 400ms without the 600ms delay', async () => {
    jest.useFakeTimers();
    render(
      <AuraGlassProvider>
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>first</Tooltip.Trigger>
            <TooltipPortal><TooltipPositioner><TooltipPopup>one</TooltipPopup></TooltipPositioner></TooltipPortal>
          </Tooltip.Root>
          <Tooltip.Root>
            <Tooltip.Trigger>second</Tooltip.Trigger>
            <TooltipPortal><TooltipPositioner><TooltipPopup>two</TooltipPopup></TooltipPositioner></TooltipPortal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </AuraGlassProvider>,
    );
    const first = screen.getByText('first');
    fireEvent.mouseEnter(first);
    fireEvent.pointerMove(first, { pointerType: 'mouse' });
    fireEvent.mouseMove(first);
    act(() => { jest.advanceTimersByTime(601); });
    expect(document.querySelector('[data-ag-part="popup"]')).not.toBeNull();
    fireEvent.pointerLeave(first, { pointerType: 'mouse' });
    fireEvent.mouseLeave(first);
    act(() => { jest.advanceTimersByTime(10); });
    const second = screen.getByText('second');
    fireEvent.mouseEnter(second);
    fireEvent.pointerMove(second, { pointerType: 'mouse' });
    fireEvent.mouseMove(second);
    // inside the skip-delay window → opens instantly, no 600ms wait
    act(() => { jest.advanceTimersByTime(60); });
    const popup = document.querySelector('[data-ag-part="popup"]');
    expect(popup?.textContent).toBe('two');
  });

  it('touch tap does not open; 500ms long-press opens', async () => {
    jest.useFakeTimers();
    render(<Demo />);
    const trigger = screen.getByText('save');
    // jsdom PointerEvent lacks pointerType — define it on the event itself
    const down = (t: HTMLElement) => {
      const e = createEvent.pointerDown(t);
      Object.defineProperty(e, 'pointerType', { value: 'touch' });
      fireEvent(t, e);
    };
    const up = (t: HTMLElement) => {
      const e = createEvent.pointerUp(t);
      Object.defineProperty(e, 'pointerType', { value: 'touch' });
      fireEvent(t, e);
    };
    // plain tap: down+up quickly
    down(trigger);
    act(() => { jest.advanceTimersByTime(120); });
    up(trigger);
    act(() => { jest.advanceTimersByTime(700); });
    expect(document.querySelector('[data-ag-part="popup"]')).toBeNull();
    // long-press ≥500ms
    down(trigger);
    act(() => { jest.advanceTimersByTime(499); });
    expect(document.querySelector('[data-ag-part="popup"]')).toBeNull();
    act(() => { jest.advanceTimersByTime(2); });
    expect(document.querySelector('[data-ag-part="popup"]')).not.toBeNull();
    up(trigger);
  });
});
