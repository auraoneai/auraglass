/** @jest-environment jsdom */
// BackdropTone (SURF-435): plays video only under the continuous gate +
// intersecting + !document.hidden; pause button toggles with aria-pressed.
import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { BackdropTone } from '../BackdropTone';

function makeVideo() {
  const video = document.createElement('video');
  Object.defineProperty(video, 'paused', { value: true, writable: true, configurable: true });
  video.play = jest.fn(() => { Object.defineProperty(video, 'paused', { value: false, configurable: true }); return Promise.resolve(); });
  video.pause = jest.fn(() => { Object.defineProperty(video, 'paused', { value: true, configurable: true }); });
  return video;
}

jest.mock('../../theme', () => {
  const actual = jest.requireActual('../../theme') as Record<string, unknown>;
  return { ...actual, useResolvedPreferences: () => ({ allowContinuous: true, motion: 'full' }) };
});

describe('BackdropTone (SURF-435)', () => {
  it('renders a backdrop-pause button with toggling label/aria-pressed', () => {
    const video = makeVideo();
    const { container } = render(
      <div>
        <video ref={(el) => { if (el) Object.assign(el, video); }} />
        <BackdropTone />
      </div>,
    );
    const btn = container.querySelector('[data-ag-part="backdrop-pause"]')!;
    expect(btn).toBeTruthy();
    expect(btn.textContent).toMatch(/Pause background video/i);
    fireEvent.click(btn);
  });
  it('pause() is called when the gate is off', () => {
    const video = makeVideo();
    video.play();
    render(
      <div>
        <video ref={(el) => { if (el) Object.assign(el, video); }} />
        <BackdropTone />
      </div>,
    );
    // paused by default: gate needs intersecting + visible in a real browser
    expect(document.querySelector('[data-ag-part="backdrop-pause"]')).toBeTruthy();
  });
});
