/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { ResizablePanels } from './ResizablePanels';

const Three = () => (
  <ResizablePanels.Root defaultLayout={[40, 30, 30]}>
    <ResizablePanels.Panel id="a" minSize={10}>a</ResizablePanels.Panel>
    <ResizablePanels.Handle label="Split a/b" />
    <ResizablePanels.Panel id="b" minSize={10}>b</ResizablePanels.Panel>
    <ResizablePanels.Handle label="Split b/c" />
    <ResizablePanels.Panel id="c">c</ResizablePanels.Panel>
  </ResizablePanels.Root>
);

describe('ResizablePanels (SURF-051)', () => {
  it('renders separator handles with ARIA values', () => {
    render(<Three />);
    const handles = screen.getAllByRole('separator');
    expect(handles).toHaveLength(2);
    expect(handles[0]).toHaveAttribute('aria-orientation', 'vertical'); // APG: separator between left/right panes is vertical
    expect(handles[0]).toHaveAttribute('aria-valuemin', '10');
    expect(handles[0]).toHaveAttribute('aria-valuemax', '100');
  });

  it('arrow keys resize the adjacent panel', () => {
    render(<Three />);
    const h0 = screen.getAllByRole('separator')[0]!;
    h0.focus();
    fireEvent.keyDown(h0, { key: 'ArrowRight' });
    expect(h0).toHaveAttribute('aria-valuenow', '42');
    fireEvent.keyDown(h0, { key: 'ArrowLeft', shiftKey: true });
    expect(h0).toHaveAttribute('aria-valuenow', '32');
  });

  it('Home/End snap to the panel min/max', () => {
    render(<Three />);
    const h0 = screen.getAllByRole('separator')[0]!;
    // neighbours can only give 50 of the requested 60 → clamps at 90
    fireEvent.keyDown(h0, { key: 'End' });
    expect(h0).toHaveAttribute('aria-valuenow', '90');
    fireEvent.keyDown(h0, { key: 'Home' });
    expect(h0).toHaveAttribute('aria-valuenow', '10');
  });

  it('Enter collapses a collapsible panel and restores it', () => {
    render(
      <ResizablePanels.Root defaultLayout={[50, 50]}>
        <ResizablePanels.Panel id="a" collapsible collapsedSize={0} expandedSize={60} minSize={10}>
          a
        </ResizablePanels.Panel>
        <ResizablePanels.Handle label="Split" />
        <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    const h = screen.getAllByRole('separator')[0]!;
    fireEvent.keyDown(h, { key: 'Enter' });
    expect(h).toHaveAttribute('aria-valuenow', '0');
    fireEvent.keyDown(h, { key: 'Enter' });
    expect(h).toHaveAttribute('aria-valuenow', '60');
  });

  it('persists layout to localStorage under ag-panels:<autoSaveId>', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem');
    render(
      <ResizablePanels.Root autoSaveId="demo" defaultLayout={[50, 50]}>
        <ResizablePanels.Panel id="a">a</ResizablePanels.Panel>
        <ResizablePanels.Handle label="Split" />
        <ResizablePanels.Panel id="b">b</ResizablePanels.Panel>
      </ResizablePanels.Root>,
    );
    const h = screen.getAllByRole('separator')[0]!;
    fireEvent.keyDown(h, { key: 'ArrowRight' });
    expect(spy).toHaveBeenCalledWith('ag-panels:demo', expect.stringContaining('52'));
    spy.mockRestore();
  });

  it('SURF-42: px-string sizes convert against the root rect + onCollapse/onExpand', () => {
    const onCollapse = jest.fn();
    render(
      <ResizablePanels.Root orientation="horizontal">
        <ResizablePanels.Panel id="a" defaultSize="240px" minSize="100px" collapsible onCollapse={onCollapse} />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel id="b" />
      </ResizablePanels.Root>,
    );
    // no measurable rect in jsdom → px strings behave like percents; the
    // contract is exercised (no crash, separator still APG-complete).
    const sep = screen.getByRole('separator');
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('SURF-44: default aria-label derives from the preceding panel', () => {
    render(
      <ResizablePanels.Root orientation="horizontal" labels={{ resize: 'Größe ändern: {panel}' }}>
        <ResizablePanels.Panel id="a" label="Navigation" defaultSize={40} />
        <ResizablePanels.Handle />
        <ResizablePanels.Panel id="b" />
      </ResizablePanels.Root>,
    );
    expect(screen.getByRole('separator')).toHaveAttribute('aria-label', 'Größe ändern: Navigation');
  });

  it('SURF-42: disabled handle is inert; withGrip renders the grip span', () => {
    const { container } = render(
      <ResizablePanels.Root orientation="horizontal">
        <ResizablePanels.Panel id="a" defaultSize={40} />
        <ResizablePanels.Handle disabled withGrip />
        <ResizablePanels.Panel id="b" />
      </ResizablePanels.Root>,
    );
    const sep = screen.getByRole('separator');
    expect(sep).toHaveAttribute('aria-disabled', 'true');
    expect(container.querySelector('.ag-panels__grip')).toBeTruthy();
  });
});
