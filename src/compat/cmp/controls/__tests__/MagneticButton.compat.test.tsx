/* REQ-CMP-35: MagneticButton lazily imports { magnetic } from aura-glass/motion
   when the optional motion peer resolves and applies its ref to the button
   element; without the peer it drops the magnetic props with one warning. */
import { describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

const mockMotion = { bound: [] as HTMLElement[] };

jest.mock('../../../../motion/public', () => ({
  magnetic: jest.fn(() => ({
    ref: (el: HTMLElement | null) => { if (el) mockMotion.bound.push(el); },
    style: {},
  })),
}));

import { MagneticButton } from '../MagneticButton';
import { magnetic } from '../../../../motion/public';

const flush = async () => { await act(async () => {}); };

describe('MagneticButton compat (REQ-CMP-35)', () => {
  it('with motion resolved, magnetic() applies its ref to the button element', async () => {
    render(<MagneticButton magnetic>hover</MagneticButton>);
    await waitFor(() => expect(magnetic).toHaveBeenCalled());
    const btn = screen.getByRole('button');
    expect(mockMotion.bound).toContain(btn);
  });

  it('preserves native drag and animation event handlers through the motion host', async () => {
    const onDrag = jest.fn();
    const onAnimationStart = jest.fn();
    (magnetic as jest.Mock).mockClear();
    render(<MagneticButton magnetic onDrag={onDrag} onAnimationStart={onAnimationStart}>events</MagneticButton>);
    await waitFor(() => expect(magnetic).toHaveBeenCalled());
    const button = screen.getByRole('button');
    fireEvent.drag(button);
    fireEvent.animationStart(button);
    expect(onDrag).toHaveBeenCalledWith(expect.objectContaining({ type: 'drag', target: button }));
    expect(onAnimationStart).toHaveBeenCalledWith(expect.objectContaining({ type: 'animationstart', target: button }));
  });

  it('without magnetic props it renders a plain button and never loads motion', async () => {
    (magnetic as jest.Mock).mockClear();
    render(<MagneticButton>plain</MagneticButton>);
    await flush();
    expect(screen.getByRole('button')).toBeTruthy();
    expect(magnetic).not.toHaveBeenCalled();
  });
  it('explicit magnetic=false disables motion even with a strength', async () => {
    (magnetic as jest.Mock).mockClear();
    render(<MagneticButton magnetic={false} magneticStrength={0.2}>disabled motion</MagneticButton>);
    await flush();
    expect(magnetic).not.toHaveBeenCalled();
  });

  it('preserves caller styles and forwards and clears the caller ref', async () => {
    const ref = React.createRef<HTMLButtonElement>();
    const { unmount } = render(<MagneticButton magnetic ref={ref} style={{ color: 'red' }}>styled</MagneticButton>);
    await waitFor(() => expect(magnetic).toHaveBeenCalled());
    const button = screen.getByRole('button');
    expect(ref.current).toBe(button);
    expect(button.style.color).toBe('red');
    unmount();
    expect(ref.current).toBeNull();
  });

});
