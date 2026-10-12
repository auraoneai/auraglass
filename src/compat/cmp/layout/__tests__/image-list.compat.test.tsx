/* REQ-CMP-127 compat: ImageList, ImageListItem and ImageListItemBar (4.x) map onto the 5.0 ImageList and warn
   once with their #313 DEP-C ids (DEP-C0259..0261). GlassGallery is not absorbed here: it is removed with no
   adapter (DEP-S0605, media-gallery registry item; FIN SURF-13). */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { ImageList as CompatImageList } from '../ImageList';
import { ImageListItem } from '../ImageListItem';
import { ImageListItemBar } from '../ImageListItemBar';
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

  it('GlassGallery has no CMP adapter: it is the SURF removed name DEP-S0605 (one deprecation row per symbol)', async () => {
    const compat = (await import('../../index')) as Record<string, unknown>;
    expect('GlassGallery' in compat).toBe(false);
    const { default: cmpRows } = await import('../../../../../fragments/deprecations/cmp');
    const { default: surfRows } = await import('../../../../../fragments/deprecations/surf');
    const rows = [...cmpRows, ...surfRows].filter((r) => r.symbol === 'GlassGallery');
    expect(rows.map((r) => [r.id, r.compat ?? null])).toEqual([['DEP-S0605', null]]);
  });
});
