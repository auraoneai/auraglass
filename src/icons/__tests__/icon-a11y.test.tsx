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
        const text = readFileSync(join(dir, f), 'utf8').replace(/\n/g, ' ');
        // Call exports must carry the annotation. Bare-identifier aliases of a PURE glyph in the
        // same module (export const CloseIcon = XIcon;) or imported from a sibling glyph module
        // (itself checked here) must not: a #__PURE__ on a non-call is an INVALID_ANNOTATION
        // (REQ-PLAT-65, see tests/build displayname-pure).
        const pureExports = new Set([...text.matchAll(/export const (\w+) = \/\*#__PURE__\*\/ /g)].map((m) => m[1]));
        for (const m of text.matchAll(/import \{([^}]*)\} from '\.\/[\w-]+';/g)) {
          for (const name of m[1]!.split(',')) if (name.trim()) pureExports.add(name.trim());
        }
        for (const m of text.matchAll(/export const (\w+) = (?!\/\*#__PURE__\*\/)([^;]*);/g)) {
          const rhs = m[2]!.trim();
          if (!(/^[A-Za-z_$][\w$]*$/.test(rhs) && pureExports.has(rhs))) bad.push(`${cat}/${f}`);
        }
      }
    }
    expect(glyphCount).toBeGreaterThan(100);
    expect(bad).toEqual([]);
  });
});
