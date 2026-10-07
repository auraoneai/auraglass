/** @jest-environment jsdom */
// ai-voice-input unit test (SURF-374): MediaRecorder test double asserting
// the produced File comes from dataavailable chunks.
import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';

jest.mock('aura-glass/ai', () => {
  const ReactMod = require('react') as typeof import('react');
  return {
    Composer: {
      Action: (p: Record<string, unknown>) => {
        const { children, ...rest } = p;
        return ReactMod.createElement('button', rest, children as never);
      },
    },
  };
}, { virtual: true });

import { VoiceInputAction } from './VoiceInputAction';

class MockMediaRecorder {
  static instances: MockMediaRecorder[] = [];
  state: 'inactive' | 'recording' = 'inactive';
  mimeType = 'audio/webm';
  private listeners = new Map<string, Array<() => void>>();
  constructor(public stream: unknown) { MockMediaRecorder.instances.push(this); }
  addEventListener(ev: string, cb: () => void) {
    const l = this.listeners.get(ev) ?? []; l.push(cb); this.listeners.set(ev, l);
  }
  start() { this.state = 'recording'; }
  chunks: BlobPart[] = [];
  emitChunk(data: BlobPart) { this.chunks.push(data); }
  stop() {
    this.state = 'inactive';
    for (const cb of this.listeners.get('dataavailable') ?? []) {
      // @ts-expect-error — test double Event shape
      cb({ data: new Blob(this.chunks, { type: 'audio/webm' }) });
    }
    for (const cb of this.listeners.get('stop') ?? []) cb();
  }
}

describe('VoiceInputAction (SURF-374)', () => {
  it('records chunks and emits a File built from dataavailable payloads', async () => {
    MockMediaRecorder.instances = [];
    const tracks = [{ stop: jest.fn() }];
    (globalThis as Record<string, unknown>).MediaRecorder = MockMediaRecorder;
    Object.defineProperty(navigator, 'mediaDevices', {
      configurable: true,
      value: { getUserMedia: jest.fn(async () => ({ getTracks: () => tracks })) },
    });
    const onFile = jest.fn();
    const { getByLabelText } = render(<VoiceInputAction onFile={onFile} />);
    const btn = getByLabelText('Voice input');
    fireEvent.click(btn);
    await act(async () => { await Promise.resolve(); await Promise.resolve(); });
    const rec = MockMediaRecorder.instances.at(-1)!;
    rec.emitChunk('chunk-a');
    rec.emitChunk('chunk-b');
    fireEvent.click(btn); // stop
    expect(onFile).toHaveBeenCalledTimes(1);
    const file = onFile.mock.calls[0]![0] as File;
    expect(file.type).toBe('audio/webm');
    expect(file.size).toBe('chunk-achunk-b'.length);
    expect(tracks[0]!.stop).toHaveBeenCalled();
  });
  it('unsupported browsers render an explicit state and no capture', () => {
    const saved = { ...(globalThis as Record<string, unknown>) };
    delete (globalThis as Record<string, unknown>).MediaRecorder;
    const { getByLabelText } = render(<VoiceInputAction />);
    expect(getByLabelText('Voice input')).toBeDisabled();
    Object.assign(globalThis, saved);
  });
});
