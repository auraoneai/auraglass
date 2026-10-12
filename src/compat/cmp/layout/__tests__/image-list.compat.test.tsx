/* REQ-CMP-127 compat: ImageList, ImageListItem, ImageListItemBar and GlassGallery
   (4.x) map onto the 5.0 ImageList and warn once with their #313 DEP-C ids
   (DEP-C0259..0262). */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { ImageList as CompatImageList } from '../ImageList';
import { ImageListItem } from '../ImageListItem';
import { ImageListItemBar } from '../ImageListItemBar';
import { GlassGallery } from '../GlassGallery';
import { ImageList } from '../../../../components/image-list';

describe('compat/cmp/layout (REQ-CMP-127)', () => {
  let warn: jest.SpiedFunction<typeof console.warn>;
  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });
  afterEach(() => {
    warn.mockRestore();
  });
  const warnings = (dep: string) => warn.mock.calls.filter((c) => String(c[0]).includes(dep)).length;

  it('compat ImageList warns once (DEP-C0259) and renders the 5.0 part tree', () => {
    const items = [{ src: 'x.png', alt: 'x', title: 'T' }];
    const { container, rerender } = render(<CompatImageList items={items} />);
    rerender(<CompatImageList items={items} cols={2} />);
    expect(warnings('DEP-C0259')).toBe(1);
    expect(container.querySelector('[data-ag-part="item-img"]')!.getAttribute('alt')).toBe('x');
    expect(container.querySelector('[data-ag-part="item-bar"]')).not.toBeNull();
    expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-cols')).toBe('2');
  });

  it('compat ImageListItem (DEP-C0260) and ImageListItemBar (DEP-C0261) warn and render', () => {
    const { container } = render(
      <ImageList>
        <ImageListItem><ImageListItemBar title="b" /></ImageListItem>
      </ImageList>,
    );
    expect(warnings('DEP-C0260')).toBe(1);
    expect(warnings('DEP-C0261')).toBe(1);
    expect(container.querySelectorAll('[data-ag-part="item"]')).toHaveLength(1);
    expect(container.querySelector('[data-ag-part="item-bar-title"]')!.textContent).toBe('b');
  });

  it('GlassGallery (DEP-C0262) maps images to items and columns to cols', () => {
    const { container } = render(<GlassGallery images={[{ src: 'a.png', caption: 'cap' }]} columns={2} />);
    expect(warnings('DEP-C0262')).toBe(1);
    const root = container.querySelector('[data-ag-part="root"]')!;
    expect(root.getAttribute('data-ag-appearance')).toBe('standard');
    expect(root.getAttribute('data-cols')).toBe('2');
    const img = container.querySelector('[data-ag-part="item-img"]')!;
    expect(img.getAttribute('src')).toBe('a.png');
    expect(img.getAttribute('alt')).toBe('');
    expect(container.querySelector('[data-ag-part="item-bar-title"]')!.textContent).toBe('cap');
  });
});
