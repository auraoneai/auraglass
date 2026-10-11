/**
 * REQ-PLAT-49 fixture — command-palette fuzzy search must not throw on
 * regex metacharacters; each char is escaped so '(' cannot widen a match.
 * Guards the fix whose release-note line ships in RELEASE_NOTES_4.1.1.md.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { readFileSync } from 'fs';
import { join } from 'path';
// framer-motion is an optional peer on the 4x line — mock it so the render
// fixture runs without the real animation lib (motion props dropped).
jest.mock('framer-motion', () => {
  const R = require('react');
  const MOTION_PROPS = new Set(['animate','initial','exit','transition','variants','whileHover','whileTap','whileFocus','whileDrag','layout']);
  const el = (tag) => R.forwardRef(({ children, ...rest }, ref) => {
    const dom = {};
    for (const k of Object.keys(rest)) if (!MOTION_PROPS.has(k)) dom[k] = rest[k];
    return R.createElement(tag, { ...dom, ref }, children);
  });
  return {
    motion: new Proxy({}, { get: (t, tag) => el(tag) }),
    AnimatePresence: ({ children }) => R.createElement(R.Fragment, null, children),
  };
});
import { GlassCommandPalette } from '../src/components/interactive/GlassCommandPalette';

const ITEMS = [
  { id: 'a', label: 'Open settings (admin)', keywords: ['settings'] },
  { id: 'b', label: 'Open docs', keywords: ['docs'] },
];

describe('command-palette regex fix', () => {
  it('fuzzy search escapes metacharacters — "(" does not throw', () => {
    render(<GlassCommandPalette open items={ITEMS} onClose={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(() => fireEvent.change(input, { target: { value: '(' } })).not.toThrow();
  });

  it('escaped query matches literally, not as a regex', () => {
    render(<GlassCommandPalette open items={ITEMS} onClose={() => {}} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '(admin' } });
    expect(screen.getByText('Open settings (admin)')).toBeInTheDocument();
    expect(screen.queryByText('Open docs')).toBeNull();
  });

  it('source: per-character escape before join(".*")', () => {
    const src = readFileSync(
      join(__dirname, '..', 'src/components/interactive/GlassCommandPalette.tsx'), 'utf8'
    );
    expect(src).toMatch(/replace\(\/\[\.\*\+\?\^\$\{\}\(\)\|\[\\\]\\\\\]\/g/);
    expect(src).toMatch(/join\("\.\*"\)/);
  });
});
