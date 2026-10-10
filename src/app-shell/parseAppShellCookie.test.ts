import { describe, expect, it } from '@jest/globals';
import { parseAppShellCookie, serializeAppShellCookie, serializeAppShellCookieValue } from './parseAppShellCookie';

describe('parseAppShellCookie', () => {
  it('parses both keys in any order', () => {
    expect(parseAppShellCookie('sidebar:rail;inspector:open')).toEqual({ sidebar: 'rail', inspector: 'open' });
    expect(parseAppShellCookie('inspector:closed;sidebar:collapsed')).toEqual({ sidebar: 'collapsed', inspector: 'closed' });
  });

  it('partial input yields partial output', () => {
    expect(parseAppShellCookie('sidebar:expanded')).toEqual({ sidebar: 'expanded' });
    expect(parseAppShellCookie('inspector:open')).toEqual({ inspector: 'open' });
  });

  it('ignores unknown keys and states', () => {
    expect(parseAppShellCookie('sidebar:rail;foo:bar;inspector:weird')).toEqual({ sidebar: 'rail' });
    expect(parseAppShellCookie('sidebar:weird')).toEqual({});
  });

  it('malformed input never throws and gives {}', () => {
    const junk: Array<string | undefined | null> = [
      undefined, null, '', ';;;', 'sidebar', ':open', 'no-colon-at-all', ':::', 'sidebar:', '=x;y=z',
      // runtime tolerance for values that are not strings at all
      42 as unknown as string, {} as unknown as string,
    ];
    for (const v of junk) {
      expect(() => parseAppShellCookie(v)).not.toThrow();
      expect(parseAppShellCookie(v)).toEqual({});
    }
  });

  it('oversized input (>4 KB) parses to {}', () => {
    const big = `sidebar:rail;${'x'.repeat(5000)}`;
    expect(parseAppShellCookie(big)).toEqual({});
  });

  it('serialize/parse round-trips', () => {
    const state = { sidebar: 'rail' as const, inspector: 'closed' as const };
    expect(parseAppShellCookie(serializeAppShellCookieValue(state))).toEqual(state);
    expect(parseAppShellCookie(serializeAppShellCookieValue({}))).toEqual({});
    const full = serializeAppShellCookie('demo', state);
    expect(full).toContain('ag-shell-demo=sidebar:rail,inspector:closed');
    expect(full).toContain('SameSite=Lax');
    expect(full).toContain('Path=/');
    expect(full).toContain('Max-Age=31536000');
  });
});
