/* REQ-QUAL-09 (REQ-FIN-106, FIN-449): StoryRoot readiness. data-ag-cert-ready must wait for
   document.fonts.ready, every image decode and two animation frames, and must be cleared on unmount
   and per story. Frames are driven by a manual requestAnimationFrame queue so ordering is exact. */
import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import { act, render } from '@testing-library/react';
import * as React from 'react';
import { CERT_READY_ATTR, StoryRoot } from '../../.storybook/contract/StoryRoot';

type Deferred = { promise: Promise<void>; resolve: () => void; reject: (e: unknown) => void };
const deferred = (): Deferred => {
  let resolve!: () => void; let reject!: (e: unknown) => void;
  const promise = new Promise<void>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
};

let frames: FrameRequestCallback[] = [];
let fonts: Deferred;
let decodes: Deferred[];
const realRaf = window.requestAnimationFrame;
const realDecode = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'decode');

const flushMicrotasks = () => act(async () => { for (let i = 0; i < 10; i += 1) await Promise.resolve(); });
const frame = async () => {
  const run = frames; frames = [];
  await act(async () => { run.forEach((cb) => cb(performance.now())); });
  await flushMicrotasks();
};
const content = () => document.querySelector<HTMLElement>('[data-ag-story-content]');

beforeEach(() => {
  frames = [];
  fonts = deferred();
  decodes = [];
  window.requestAnimationFrame = (cb: FrameRequestCallback) => { frames.push(cb); return frames.length; };
  Object.defineProperty(document, 'fonts', { configurable: true, value: { ready: fonts.promise } });
  Object.defineProperty(HTMLImageElement.prototype, 'decode', {
    configurable: true,
    value() { const d = deferred(); decodes.push(d); return d.promise; },
  });
});

afterEach(() => {
  window.requestAnimationFrame = realRaf;
  delete (document as unknown as { fonts?: unknown }).fonts;
  if (realDecode) Object.defineProperty(HTMLImageElement.prototype, 'decode', realDecode);
  else delete (HTMLImageElement.prototype as unknown as { decode?: unknown }).decode;
});

describe('StoryRoot (REQ-QUAL-09)', () => {
  it('renders exactly one [data-ag-story-content] with the kind and no class or style', () => {
    const { container } = render(<StoryRoot kind="component"><button type="button">x</button></StoryRoot>);
    const roots = container.querySelectorAll('[data-ag-story-content]');
    expect(roots).toHaveLength(1);
    const root = roots[0] as HTMLElement;
    expect(container.firstElementChild).toBe(root);
    expect(root.getAttribute('data-ag-story-kind')).toBe('component');
    expect(root.hasAttribute('class')).toBe(false);
    expect(root.hasAttribute('style')).toBe(false);
  });

  it('rejects a kind outside StoryKind', () => {
    const spy = jestSilence();
    expect(() => render(<StoryRoot kind={'page' as never} />)).toThrow(/unknown story kind/);
    spy();
  });

  it('is not ready before document.fonts.ready resolves, even after many frames', async () => {
    render(<StoryRoot kind="component"><span>text</span></StoryRoot>);
    await flushMicrotasks();
    for (let i = 0; i < 5; i += 1) await frame();
    expect(content()!.hasAttribute(CERT_READY_ATTR)).toBe(false);
    fonts.resolve();
    await flushMicrotasks();
    expect(content()!.hasAttribute(CERT_READY_ATTR)).toBe(false); // frames still pending
    await frame();
    expect(content()!.hasAttribute(CERT_READY_ATTR)).toBe(false); // one frame is not enough
    await frame();
    expect(content()!.hasAttribute(CERT_READY_ATTR)).toBe(true);
  });

  it('waits for every image in the document and every extra image to decode', async () => {
    render(<StoryRoot kind="scene" images={['/scenes/flat-white.jpg']}><img alt="" src="/a.png" /><img alt="" src="/b.png" /></StoryRoot>);
    fonts.resolve();
    await flushMicrotasks();
    expect(decodes).toHaveLength(3);
    decodes[0]!.resolve(); decodes[2]!.resolve();
    await flushMicrotasks();
    await frame(); await frame(); await frame();
    expect(content()!.hasAttribute(CERT_READY_ATTR)).toBe(false);
    decodes[1]!.resolve();
    await flushMicrotasks();
    await frame(); await frame();
    expect(content()!.hasAttribute(CERT_READY_ATTR)).toBe(true);
  });

  it('never marks ready when a decode fails', async () => {
    const restore = jestSilence();
    render(<StoryRoot kind="component"><img alt="" src="/broken.png" /></StoryRoot>);
    fonts.resolve();
    await flushMicrotasks();
    decodes[0]!.reject(new Error('EncodingError'));
    await flushMicrotasks();
    await frame(); await frame(); await frame();
    expect(content()!.hasAttribute(CERT_READY_ATTR)).toBe(false);
    restore();
  });

  it('removes the attribute on unmount and resets it for the next story', async () => {
    const view = render(<StoryRoot key="a--one" kind="component" />);
    fonts.resolve();
    await flushMicrotasks(); await frame(); await frame();
    const first = content()!;
    expect(first.hasAttribute(CERT_READY_ATTR)).toBe(true);
    view.rerender(<StoryRoot key="a--two" kind="component" />);
    expect(first.hasAttribute(CERT_READY_ATTR)).toBe(false);
    const second = content()!;
    expect(second).not.toBe(first);
    expect(second.hasAttribute(CERT_READY_ATTR)).toBe(false);
    await flushMicrotasks(); await frame(); await frame();
    expect(second.hasAttribute(CERT_READY_ATTR)).toBe(true);
    view.unmount();
    expect(second.hasAttribute(CERT_READY_ATTR)).toBe(false);
    expect(document.querySelector(`[${CERT_READY_ATTR}]`)).toBeNull();
  });
});

function jestSilence(): () => void {
  const original = console.error;
  console.error = () => {};
  return () => { console.error = original; };
}
