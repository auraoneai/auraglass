import { afterEach, beforeAll, describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render } from '@testing-library/react';
import * as React from 'react';
import { MediaControls } from '../MediaControls/MediaControls';
import type { MediaHandle } from '../useMediaElement';
import { getServerSnapshot, type MediaTextTrack } from '../mediaStore';

beforeAll(() => {
  // jsdom lacks PointerEvent; Base UI's useButton synthesizes one on Space.
  (window as { PointerEvent?: unknown }).PointerEvent = window.MouseEvent;
});
afterEach(() => { jest.restoreAllMocks(); });

/** media length in seconds (a media time, not a motion duration) */
const CLIP_SECONDS = 300;
const track = (id: string, mode: string): MediaTextTrack => ({ id, label: id, language: 'en', kind: 'captions', mode });

function handle(over: Partial<MediaHandle['state']> = {}) {
  return {
    state: { ...getServerSnapshot(), paused: true, currentTime: 100, duration: CLIP_SECONDS, ...over },
    play: jest.fn(async () => {}), pause: jest.fn(), toggle: jest.fn(), seek: jest.fn(), seekBy: jest.fn(),
    setVolume: jest.fn(), setMuted: jest.fn(), setRate: jest.fn(), requestPictureInPicture: jest.fn(),
    requestFullscreen: jest.fn(), setTextTrackMode: jest.fn(),
  } satisfies MediaHandle;
}

describe('MediaControls shortcuts (REQ-SURF-137)', () => {
  it('all 9 keys act when focus is inside the toolbar (controlled callbacks)', () => {
    const onPlaying = jest.fn();
    const onSeek = jest.fn();
    const onMuted = jest.fn();
    const onRate = jest.fn();
    const onCaptions = jest.fn();
    const { container } = render(
      <MediaControls.Root playing={false} onPlayingChange={onPlaying} onSeek={onSeek} onMutedChange={onMuted}
        onRateChange={onRate} onCaptionsChange={onCaptions} playbackRate={1}
        textTracks={[track('en', 'disabled')]} currentTime={100} duration={300}>
        <MediaControls.PlayButton />
        <MediaControls.Scrubber />
      </MediaControls.Root>,
    );
    // keys go to the scrubber thumb (a range input, not a text field)
    const thumb = container.querySelector('[data-ag-part="media-scrubber"] [data-ag-part="thumb"] input') as HTMLElement;
    act(() => { thumb.focus(); });
    fireEvent.keyDown(thumb, { key: ' ' });
    expect(onPlaying).toHaveBeenLastCalledWith(true);
    fireEvent.keyDown(thumb, { key: 'k' });
    expect(onPlaying).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(thumb, { key: 'j' });
    expect(onSeek).toHaveBeenLastCalledWith(90);
    fireEvent.keyDown(thumb, { key: 'l' });
    expect(onSeek).toHaveBeenLastCalledWith(110);
    fireEvent.keyDown(thumb, { key: 'm' });
    expect(onMuted).toHaveBeenLastCalledWith(true);
    fireEvent.keyDown(thumb, { key: 'c' });
    expect(onCaptions).toHaveBeenLastCalledWith('en');
    fireEvent.keyDown(thumb, { key: '<' });
    expect(onRate).toHaveBeenLastCalledWith(0.75);
    fireEvent.keyDown(thumb, { key: '>' });
    expect(onRate).toHaveBeenLastCalledWith(1.25);
  });
  it('F requests fullscreen, C flips the captions track, </> set the rate on the media handle', () => {
    const h = handle({ playbackRate: 1.5, textTracks: [track('en', 'showing')] });
    const { container } = render(<MediaControls.Root media={h}><MediaControls.PlayButton /></MediaControls.Root>);
    const play = container.querySelector('[data-ag-part="media-play"]') as HTMLElement;
    act(() => { play.focus(); });
    fireEvent.keyDown(play, { key: 'f' });
    expect(h.requestFullscreen).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(play, { key: 'C' });
    expect(h.setTextTrackMode).toHaveBeenCalledWith('en', 'disabled');
    fireEvent.keyDown(play, { key: '<' });
    expect(h.setRate).toHaveBeenLastCalledWith(1.25);
    fireEvent.keyDown(play, { key: '>' });
    expect(h.setRate).toHaveBeenLastCalledWith(1.75);
    fireEvent.keyDown(play, { key: 'K' });
    expect(h.toggle).toHaveBeenCalledTimes(1);
  });
  it('keys on shortcutTarget act while focus is inside it, outside the toolbar', () => {
    const onPlaying = jest.fn();
    const onSeek = jest.fn();
    function Player() {
      const [target, setTarget] = React.useState<HTMLElement | null>(null);
      return (
        <div ref={setTarget} data-testid="player" tabIndex={-1}>
          <button type="button" data-testid="inside">poster</button>
          <MediaControls.Root playing={false} onPlayingChange={onPlaying} onSeek={onSeek} currentTime={50}
            duration={100} shortcutTarget={target} />
        </div>
      );
    }
    const { getByTestId } = render(<Player />);
    const inside = getByTestId('inside');
    act(() => { inside.focus(); });
    fireEvent.keyDown(inside, { key: 'k' });
    expect(onPlaying).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(inside, { key: 'l' });
    expect(onSeek).toHaveBeenLastCalledWith(60);
    // handled once even though the event also passes the Root listener's element chain
    const play = document.querySelector('[data-ag-part="media-play"]') as HTMLElement;
    act(() => { play.focus(); });
    fireEvent.keyDown(play, { key: 'k' });
    expect(onPlaying).toHaveBeenCalledTimes(2);
  });
  it('keys do nothing when focus is outside Root and shortcutTarget', () => {
    const onPlaying = jest.fn();
    const { getByTestId } = render(
      <div>
        <input data-testid="outside" />
        <button type="button" data-testid="btn">x</button>
        <MediaControls.Root playing={false} onPlayingChange={onPlaying} />
      </div>,
    );
    const input = getByTestId('outside');
    act(() => { input.focus(); });
    fireEvent.keyDown(input, { key: ' ' });
    fireEvent.keyDown(input, { key: 'k' });
    const btn = getByTestId('btn');
    act(() => { btn.focus(); });
    fireEvent.keyDown(btn, { key: 'k' });
    expect(onPlaying).not.toHaveBeenCalled();
  });
  it('shortcuts=false disables handling', () => {
    const onPlaying = jest.fn();
    const { container } = render(<MediaControls.Root playing={false} onPlayingChange={onPlaying} shortcuts={false} />);
    const play = container.querySelector('[data-ag-part="media-play"]') as HTMLElement;
    act(() => { play.focus(); });
    fireEvent.keyDown(play, { key: 'k' });
    expect(onPlaying).not.toHaveBeenCalled();
  });
  it('never registers keydown on window or document; Root/shortcutTarget listeners carry a signal', () => {
    const winAdd = jest.spyOn(window, 'addEventListener');
    const docAdd = jest.spyOn(document, 'addEventListener');
    const elAdd = jest.spyOn(HTMLElement.prototype, 'addEventListener');
    const target = document.createElement('div');
    document.body.appendChild(target);
    const { unmount } = render(<MediaControls.Root playing={false} shortcutTarget={target} />);
    const keyCalls = (calls: unknown[][]) => calls.filter((c) => c[0] === 'keydown');
    expect(keyCalls(winAdd.mock.calls)).toHaveLength(0);
    expect(keyCalls(docAdd.mock.calls)).toHaveLength(0);
    const root = document.querySelector('[data-ag-part="media-controls"]');
    // React's own delegated listeners sit on the render container; count ours
    const elKey = elAdd.mock.calls.filter((c, i) => c[0] === 'keydown'
      && (elAdd.mock.contexts[i] === root || elAdd.mock.contexts[i] === target));
    expect(elKey).toHaveLength(2); // Root + shortcutTarget
    const signals = elKey.map((c) => (c[2] as AddEventListenerOptions | undefined)?.signal);
    expect(signals.every((s) => s instanceof AbortSignal)).toBe(true);
    unmount();
    expect(signals.every((s) => s!.aborted)).toBe(true);
    target.remove();
  });
});
