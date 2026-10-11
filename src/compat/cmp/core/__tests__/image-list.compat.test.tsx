import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { ImageList as CompatImageList } from '../ImageList';
import { ImageListItem } from '../ImageListItem';
import { ImageListItemBar } from '../ImageListItemBar';
import { GlassGallery } from '../GlassGallery';
import { ImageList } from '../../../../components/image-list';

describe('compat/cmp/core (REQ-CMP-127)', () => {
  beforeEach(() => jest.restoreAllMocks());
  const warned = (dep: string) => {
    const calls = (jest.spyOn(console, 'warn') as jest.Mock).mock.calls;
    return calls.some((c) => String(c[0]).includes(dep));
  };

  it('compat ImageList warns + renders the 5.0 part tree', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<CompatImageList items={[{ src: 'x.png', alt: 'x', title: 'T' }]} />);
    expect(warned('DEP-C0259')).toBe(true);
    expect(container.querySelector('[data-ag-part="item-img"]')).not.toBeNull();
    expect(container.querySelector('[data-ag-part="item-bar"]')).not.toBeNull();
    warn.mockRestore();
  });

  it('compat ImageListItem + ItemBar warn + render', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <ImageList>
        <ImageListItem><ImageListItemBar title="b" /></ImageListItem>
      </ImageList>,
    );
    expect(warned('DEP-C0260')).toBe(true);
    expect(warned('DEP-C0261')).toBe(true);
    expect(container.querySelectorAll('[data-ag-part="item"]')).not.toHaveLength(0);
    warn.mockRestore();
  });

  it('GlassGallery maps images to items + warns', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<GlassGallery images={[{ src: 'a.png', caption: 'cap' }]} columns={2} />);
    expect(warned('DEP-C0262')).toBe(true);
    expect(container.querySelector('[data-ag-variant]')!.getAttribute('data-ag-cols')).toBe('2');
    warn.mockRestore();
  });

  it('ItemBar carries chrome-thin material', () => {
    const { container } = render(<ImageList.ItemBar title="t" />);
    const bar = container.querySelector('[data-ag-part="item-bar"]')!;
    expect(bar.getAttribute('data-ag-layer')).toBe('chrome');
    expect(bar.getAttribute('data-ag-thickness')).toBe('thin');
  });
});
