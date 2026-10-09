/* REQ-CMP-03 (3): ScrollArea, ImageList and SegmentedControl run their
   ResizeObserver through ref callbacks that return a cleanup; the cleanup
   must disconnect the observer on unmount (React 19 callback-ref cleanup). */
import * as React from 'react';
import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { render } from '@testing-library/react';
import { ScrollArea } from '../../components/scroll-area';
import { ImageList } from '../../components/image-list';
import { SegmentedControl } from '../../components/segmented-control';

const disconnect = jest.fn();
const observe = jest.fn();

class RO {
  constructor(_cb: ResizeObserverCallback) {}
  observe = observe;
  disconnect = disconnect;
  unobserve() {}
}

beforeEach(() => {
  disconnect.mockClear();
  observe.mockClear();
  (globalThis as Record<string, unknown>).ResizeObserver = RO as unknown as typeof ResizeObserver;
});
afterEach(() => {
  delete (globalThis as Record<string, unknown>).ResizeObserver;
});

describe('ref-callback observer cleanup', () => {
  it('ScrollArea Viewport disconnects its RO on unmount', () => {
    const { unmount } = render(
      <ScrollArea.Root>
        <ScrollArea.Viewport>content</ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical"><ScrollArea.Thumb /></ScrollArea.Scrollbar>
      </ScrollArea.Root>,
    );
    expect(observe).toHaveBeenCalled();
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it('ImageList masonry disconnects its RO on unmount', () => {
    const { unmount } = render(
      <ImageList variant="masonry" items={[{ src: '/a.png', alt: 'a' }] as never} />,
    );
    expect(observe).toHaveBeenCalled();
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it('SegmentedControl disconnects its RO on unmount', () => {
    const { unmount } = render(
      <SegmentedControl.Root defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    expect(observe).toHaveBeenCalled();
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
