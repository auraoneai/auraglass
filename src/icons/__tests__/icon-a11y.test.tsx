/* CMP-038 (REQ-CMP-A11Y icons): decorative default = aria-hidden='true' and no
   role; aria-label → role='img' + accessible name; title → <title> linked by
   aria-labelledby; every glyph module export is annotated PURE-tagged. */
import { describe, expect, it } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CheckIcon, SearchIcon, Icon } from '../index';

const ICONS_ROOT = join(__dirname, '..');
const CATEGORIES = ['action', 'ai', 'collaboration', 'commerce', 'data', 'media', 'navigation', 'status'];

describe('icon accessibility', () => {
  it('decorative default: aria-hidden=true, no role', () => {
    const { container } = render(<CheckIcon />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
    expect(svg).toHaveAttribute('focusable', 'false');
  });
  it('aria-label → role=img with accessible name', () => {
    render(<SearchIcon aria-label="Search" />);
    const svg = screen.getByLabelText('Search');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).not.toHaveAttribute('aria-hidden');
  });
  it('title → <title> element linked via aria-labelledby', () => {
    const { container } = render(<Icon name="check" title="Done" />);
    const svg = container.querySelector('svg')!;
    const title = svg.querySelector('title')!;
    expect(title).toHaveTextContent('Done');
    expect(svg).toHaveAttribute('aria-labelledby', expect.stringContaining(title.id));
    expect(svg).toHaveAttribute('role', 'img');
  });
  it('every glyph module export is /*#__PURE__*/-annotated', () => {
    let glyphCount = 0;
    const bad: string[] = [];
    for (const cat of CATEGORIES) {
      const dir = join(ICONS_ROOT, cat);
      for (const f of readdirSync(dir)) {
        if (!f.endsWith('.tsx')) continue;
        glyphCount++;
        const text = readFileSync(join(dir, f), 'utf8');
        if (/export const \w+ = (?!\/\*#__PURE__\*\/)/.test(text.replace(/\n/g, ' '))) {
          bad.push(`${cat}/${f}`);
        }
      }
    }
    expect(glyphCount).toBeGreaterThan(100);
    expect(bad).toEqual([]);
  });
});
