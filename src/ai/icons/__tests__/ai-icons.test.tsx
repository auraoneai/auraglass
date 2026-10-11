/* REQ-CMP-30: AiIcon dispatchers render createIcon glyphs — decorative
   aria-hidden by default, role=img when labelled, fill paths intact. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { AiIcon, AI_ICONS, SendIcon } from '../index';

describe('AI icons (REQ-CMP-30)', () => {
  it('every named glyph renders an svg with its path', () => {
    for (const name of Object.keys(AI_ICONS)) {
      const { container, unmount } = render(<AiIcon name={name as keyof typeof AI_ICONS} />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg!.querySelector('path')).not.toBeNull();
      expect(svg!.getAttribute('aria-hidden')).toBe('true');
      unmount();
    }
  });

  it('aria-label promotes to role=img and drops aria-hidden', () => {
    const { container } = render(<AiIcon name="send" aria-label="Send" />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-hidden')).toBeNull();
  });

  it('fill glyphs carry fill=currentColor stroke=none; size prop applies', () => {
    const { container } = render(<SendIcon size={10} />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('width')).toBe('10');
    expect(svg.querySelector('path')!.getAttribute('fill')).toBe('currentColor');
    expect(svg.querySelector('path')!.getAttribute('stroke')).toBe('none');
  });

  it('AiIcon keeps data-ag-part=icon + data-icon=name', () => {
    const { container } = render(<AiIcon name="stop" />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('data-ag-part')).toBe('icon');
    expect(svg.getAttribute('data-icon')).toBe('stop');
  });
});
