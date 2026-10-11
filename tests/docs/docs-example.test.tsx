/* tests/docs/docs-example.test.tsx — REQ-PLAT-99 / PLAT-375 (REQ-FIN-43).
   The example renderer wraps demos in the real aura-glass Environment with a
   declared backdrop per S-42 scene and a 390 px preview toggle, and never
   writes reader preferences to <html>/<body>; the mobile nav is the real
   aura-glass Sheet. `aura-glass` maps to the repository's own modules here
   because the packed tarball only exists in CI (plat:package:pack). */
import { describe, expect, it, jest, beforeAll } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { fireEvent, render, screen, within } from '@testing-library/react';
import * as React from 'react';
import { SCENES, SCENE_BACKDROP } from '../../src/contracts/testing';

jest.mock('aura-glass', () => ({
  ...jest.requireActual<Record<string, unknown>>('../../src/material/Environment'),
  ...jest.requireActual<Record<string, unknown>>('../../src/components/sheet'),
}), { virtual: true });

import { Example } from '../../apps/docs/components/Example';
import { MobileNav } from '../../apps/docs/components/MobileNav';
import { buildNav, type NavData } from '../../apps/docs/nav.config';

const scenes = SCENES.map((id) => ({ id, backdrop: SCENE_BACKDROP[id], file: id === 'photo' ? 'photo.jpg' : null }));

describe('docs Example', () => {
  it('offers the 8 SCENES and renders the demo inside Environment with the scene backdrop', () => {
    const before = { html: [...document.documentElement.attributes].map((a) => a.name), body: [...document.body.attributes].map((a) => a.name) };
    const { container } = render(<Example name="Button — basic" scenes={scenes} basePath="/sub/docs"><button type="button">Demo</button></Example>);
    const group = screen.getByRole('group', { name: 'Scene' });
    const buttons = within(group).getAllByRole('button');
    expect(buttons.map((b) => b.textContent)).toEqual([...SCENES]);
    expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');

    const env = () => container.querySelector('[data-ag-part="preview"] > [data-ag-backdrop]')!;
    expect(env()).toHaveAttribute('data-ag-backdrop', 'media');
    expect(env().querySelector('img[data-ag-part="backdrop-media"]')).toHaveAttribute('src', '/sub/docs/scenes/photo.jpg');
    expect(within(env() as HTMLElement).getByRole('button', { name: 'Demo' })).toBeInTheDocument();

    fireEvent.click(within(group).getByRole('button', { name: 'flat-black' }));
    expect(env()).toHaveAttribute('data-ag-backdrop', 'dark');
    expect(container.querySelector('figure')).toHaveAttribute('data-ag-scene', 'flat-black');
    expect(screen.getByText(/scene asset flat-black pending/)).toHaveAttribute('data-ag-state', 'pending');

    expect([...document.documentElement.attributes].map((a) => a.name)).toEqual(before.html);
    expect([...document.body.attributes].map((a) => a.name)).toEqual(before.body);
  });

  it('toggles a 390 px preview width', () => {
    const { container } = render(<Example name="x" scenes={scenes}>demo</Example>);
    const toggle = screen.getByRole('button', { name: '390 px preview' });
    const preview = container.querySelector('[data-ag-part="preview"]') as HTMLElement;
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(preview.style.inlineSize).toBe('');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(preview.style.inlineSize).toBe('390px');
    expect(preview.style.maxInlineSize).toBe('100%');
  });
});

describe('docs MobileNav', () => {
  beforeAll(() => {
    if (window.PointerEvent === undefined) (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
  });

  it('opens the primary navigation in a Sheet dialog and closes on navigation', async () => {
    const data: NavData = { version: '5.0.0-alpha.0', components: [], surfaces: [], api: [], scenes: [] };
    render(<MobileNav nav={buildNav(data)} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    const dialog = await screen.findByRole('dialog');
    const nav = within(dialog).getByRole('navigation', { name: 'Primary' });
    const intro = within(nav).getByRole('link', { name: 'Introduction' });
    expect(intro).toHaveAttribute('href', '/plat/introduction');
    fireEvent.click(intro);
    await screen.findByRole('button', { name: 'Open navigation' });
    expect(screen.queryByRole('navigation', { name: 'Primary' })).toBeNull();
  });
});
