/* CMP-295/420: Text — generated for lane 3g (T0/T2 components). */
import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Text } from './index';

describe('Text', () => {
  it('renders <p> by default with type/size/intent attrs', () => {
    const { container } = render(<Text>hello</Text>);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.tagName).toBe('P');
    expect(el.getAttribute('data-type')).toBe('body');
    expect(el.getAttribute('data-type')).toBe('body');
    // REQ-CMP-111: no size prop → no data-ag-size (type role governs)
    expect(el.getAttribute('data-ag-size')).toBeNull();
    expect(el.className).not.toMatch(/ag-text-size-/);
    expect(el.getAttribute('data-ag-intent')).toBe('neutral');
  });
  it('maps type roles callout|caption|label|mono onto data-type', () => {
    for (const t of ['callout', 'caption', 'label', 'mono'] as const) {
      const { container, unmount } = render(<Text type={t}>x</Text>);
      expect(container.querySelector('[data-ag-part="root"]')!.getAttribute('data-type')).toBe(t);
      unmount();
    }
  });
  it('emits muted, weight, truncate and size attrs', () => {
    const { container } = render(<Text size="xs" muted weight="bold" truncate>q</Text>);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.getAttribute('data-ag-size')).toBe('xs');
    expect(el.hasAttribute('data-muted')).toBe(true);
    expect(el.getAttribute('data-weight')).toBe('bold');
    expect(el.hasAttribute('data-truncate')).toBe(true);
  });
  it('honours the render prop (span for inline)', () => {
    const { container } = render(<Text render={<span data-x="1" />}>i</Text>);
    const el = container.querySelector('[data-ag-part="root"]')!;
    expect(el.tagName).toBe('SPAN');
    expect(el.getAttribute('data-x')).toBe('1');
  });
  /* REQ-CMP-111: the role quartet is the only font-size source when `size` is
     unset — caption must resolve to its own token, not body's. (jsdom does not
     apply stylesheets, so the cascade is checked on the parsed rules.) */
  describe('type-role font sizes (CSS)', () => {
    const css = readFileSync(join(__dirname, 'Text.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ selector: m[1]!.trim(), body: m[2]! }));
    const fontSize = (selector: string) => {
      const rule = rules.find((r) => r.selector === selector);
      expect(rule).toBeDefined();
      return /(?:^|;)\s*font-size:\s*([^;]+)/.exec(rule!.body)?.[1]?.trim();
    };

    it('.ag-text-type-caption reads --ag-type-caption-size, distinct from body', () => {
      const caption = fontSize('.ag-text-type-caption');
      const body = fontSize('.ag-text-type-body');
      expect(caption).toMatch(/^var\(--ag-type-caption-size\b/);
      expect(body).toMatch(/^var\(--ag-type-body-size\b/);
      expect(caption).not.toBe(body);
    });

    it('with size unset nothing else sets font-size on a caption Text', () => {
      const { container } = render(<Text type="caption">c</Text>);
      const el = container.querySelector('[data-ag-part="root"]')!;
      // Every rule that sets font-size and matches the rendered element.
      const matching = rules
        .filter((r) => /(?:^|;)\s*font-size:/.test(r.body))
        .filter((r) => r.selector.split(',').some((sel) => { try { return el.matches(sel.trim()); } catch { return false; } }))
        .map((r) => r.selector);
      expect(matching).toEqual(['.ag-text-type-caption']);
    });
  });
});
