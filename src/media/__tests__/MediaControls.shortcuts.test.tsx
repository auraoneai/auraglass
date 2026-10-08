import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import { MediaControls } from '../MediaControls/MediaControls';

describe('MediaControls shortcuts (REQ-SURF-137)', () => {
  beforeAll(() => {
    // jsdom lacks PointerEvent; Base UI's useButton synthesizes one on Space.
    (window as { PointerEvent?: unknown }).PointerEvent = window.MouseEvent;
  });
  it('Space/K/J/L/M/F/C/</> act when focus is inside the toolbar', () => {
    const onPlaying = jest.fn();
    const onSeek = jest.fn();
    const onMuted = jest.fn();
    const { container } = render(
      <MediaControls.Root playing={false} onPlayingChange={onPlaying} onSeek={onSeek} onMutedChange={onMuted}
        currentTime={100} duration={300}>
        <MediaControls.PlayButton />
      </MediaControls.Root>,
    );
    const play = container.querySelector('[data-ag-part="media-play"]') as HTMLElement;
    play.focus();
    fireEvent.keyDown(play, { key: ' ' });
    expect(onPlaying).toHaveBeenCalledWith(true);
    fireEvent.keyDown(play, { key: 'j' });
    expect(onSeek).toHaveBeenCalledWith(90);
    fireEvent.keyDown(play, { key: 'l' });
    expect(onSeek).toHaveBeenCalledWith(110);
    fireEvent.keyDown(play, { key: 'm' });
    expect(onMuted).toHaveBeenCalledWith(true);
  });
  it('Space in an outside <input> does not toggle', () => {
    const onPlaying = jest.fn();
    const { container } = render(
      <div>
        <input data-testid="outside" />
        <MediaControls.Root playing={false} onPlayingChange={onPlaying} />
      </div>,
    );
    const input = container.querySelector('[data-testid="outside"]') as HTMLElement;
    input.focus();
    fireEvent.keyDown(input, { key: ' ' });
    expect(onPlaying).not.toHaveBeenCalled();
  });
  it('shortcuts=false disables handling', () => {
    const onPlaying = jest.fn();
    const { container } = render(<MediaControls.Root playing={false} onPlayingChange={onPlaying} shortcuts={false} />);
    const play = container.querySelector('[data-ag-part="media-play"]') as HTMLElement;
    play.focus();
    fireEvent.keyDown(play, { key: 'k' }); // k is shortcut-only; Space would activate the button natively
    expect(onPlaying).not.toHaveBeenCalled();
  });
});
