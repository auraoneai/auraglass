/** @jest-environment jsdom */
import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { SourceTransition } from './SourceTransition';
import * as motion from '../../motion';

describe('SourceTransition (SURF-091)', () => {
  it('moves the view-transition-name to the destination on activate', async () => {
    render(
      <SourceTransition.Root>
        <SourceTransition.Source id="s1">src</SourceTransition.Source>
        <SourceTransition.Destination id="s1">dest</SourceTransition.Destination>
      </SourceTransition.Root>,
    );
    const src = document.querySelector('[data-ag-part="source"]') as HTMLElement;
    expect(src.style.viewTransitionName).toBe('');
    await act(async () => {
      fireEvent.click(src);
    });
    // transition ran through startMorph: name cleared again post-update
    expect(src.style.viewTransitionName).toBe('');
    const dest = document.querySelector('[data-ag-part="destination"]') as HTMLElement;
    expect(dest.style.opacity).toBe('1');
  });

  it('focus follows the morph to the destination', async () => {
    render(
      <SourceTransition.Root>
        <SourceTransition.Source id="s1">
          <button type="button">go</button>
        </SourceTransition.Source>
        <SourceTransition.Destination id="s1">
          <a href="/x">land</a>
        </SourceTransition.Destination>
      </SourceTransition.Root>,
    );
    const btn = screen.getByRole('button', { name: 'go' });
    btn.focus();
    await act(async () => {
      fireEvent.click(btn.parentElement!);
    });
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'land' }));
  });

  it('routes through the MAT startMorph seam', async () => {
    const spy = jest.spyOn(motion, 'startMorph');
    render(
      <SourceTransition.Root>
        <SourceTransition.Source id="s1">src</SourceTransition.Source>
        <SourceTransition.Destination id="s1">dest</SourceTransition.Destination>
      </SourceTransition.Root>,
    );
    await act(async () => {
      fireEvent.click(document.querySelector('[data-ag-part="source"]')!);
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
