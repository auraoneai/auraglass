/* REQ-CMP-06 (FIN-E.1 row 31): compound part surface on the CMP side.
   - every COMPOUND_PARTS part is exported as a component by the module CMP_MODULES names;
   - the COMPOUND_PARTS_PENDING parts REQ-CMP-06 implements (SegmentedControl.Indicator,
     Slider.Track/Range/Thumb, Menubar {Root, Menu}) exist, so the contract can promote them;
   - the anchored overlays' Content part is the whole overlay stack (Portal > Positioner >
     Popup), so callers never compose the internal parts: placement props reach the
     positioner and the rest reach the popup, which renders in the portal root. */
import * as React from 'react';
import { afterEach, describe, expect, it } from '@jest/globals';
import { act, cleanup, render } from '@testing-library/react';
import { join } from 'node:path';
import { CMP_MODULES, COMPOUND_PARTS, COMPOUND_PARTS_PENDING } from '../../src/contracts/components';
import { REPO_ROOT } from './metas';
import { Popover } from '../../src/components/popover';
import { Tooltip } from '../../src/components/tooltip';
import { Menu, Menubar, ContextMenu } from '../../src/components/menu';

type Parts = Record<string, unknown>;

const isComponent = (v: unknown): boolean =>
  typeof v === 'function' || (typeof v === 'object' && v !== null && typeof (v as { $$typeof?: unknown }).$$typeof === 'symbol');

function load(name: string): Parts {
  const path = CMP_MODULES[name as keyof typeof CMP_MODULES];
  const mod = require(join(REPO_ROOT, path)) as Record<string, unknown>;
  return mod[name] as Parts;
}

/** The pending rows REQ-CMP-06 owns; Toast.History/HistoryItem belong to REQ-CMP-110. */
const CMP06_PENDING = ['SegmentedControl', 'Slider', 'Menubar'] as const;

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

describe('COMPOUND_PARTS exports (S-30)', () => {
  for (const [name, parts] of Object.entries(COMPOUND_PARTS)) {
    it(`${name}: the public compound object is exactly the contract parts (plus its pending parts)`, () => {
      const C = load(name);
      expect(C).toBeDefined();
      const missing = (parts as readonly string[]).filter((p) => !isComponent(C[p]));
      expect({ name, missing }).toEqual({ name, missing: [] });
      // Portal/Positioner/Popup/Backdrop and other non-contract parts stay internal (named
      // exports of the .client module), never keys of the public compound object.
      const pending = ((COMPOUND_PARTS_PENDING as Record<string, readonly string[]>)[name] ?? []).filter((p) => p in C);
      expect({ name, keys: Object.keys(C).sort() }).toEqual({ name, keys: [...parts, ...pending].sort() });
    });
  }
});

describe('COMPOUND_PARTS_PENDING parts implemented by REQ-CMP-06', () => {
  it('covers exactly the pending rows outside REQ-CMP-110', () => {
    expect(Object.keys(COMPOUND_PARTS_PENDING).filter((k) => k !== 'Toast').sort()).toEqual([...CMP06_PENDING].sort());
  });
  for (const name of CMP06_PENDING) {
    it(`${name} exports ${COMPOUND_PARTS_PENDING[name].join(', ')}`, () => {
      const C = load(name);
      const missing = (COMPOUND_PARTS_PENDING[name] as readonly string[]).filter((p) => !isComponent(C[p]));
      expect({ name, missing }).toEqual({ name, missing: [] });
    });
  }
  it('Menubar stays a renderable flat component whose Menu part is the menu root', async () => {
    expect(isComponent(Menubar)).toBe(true);
    expect(Menubar.Root).toBe(Menubar);
    expect(Menubar.Menu).toBe(Menu.Root);
    const { getByRole } = render(
      <Menubar aria-label="App">
        <Menubar.Menu>
          <Menu.Trigger>File</Menu.Trigger>
        </Menubar.Menu>
      </Menubar>,
    );
    await act(async () => {});
    const bar = getByRole('menubar');
    expect(bar.getAttribute('data-ag-part')).toBe('root');
    expect(bar.textContent).toContain('File');
  });
});

/* Asserts the Content element tree: popup inside a positioner, both outside the render
   container (portalled), placement attribute on the positioner, popup props on the popup. */
function expectStack(container: HTMLElement, testId: string, side: string) {
  const popup = document.querySelector(`[data-testid="${testId}"]`) as HTMLElement | null;
  expect(popup).not.toBeNull();
  expect(popup!.getAttribute('data-ag-part')).toBe('popup');
  expect(popup!.classList.contains('custom-popup')).toBe(true);
  expect(container.contains(popup)).toBe(false);
  const positioner = popup!.parentElement!;
  expect(positioner.getAttribute('data-ag-part')).toBe('positioner');
  expect(positioner.getAttribute('data-side')).toBe(side);
}

describe('Content = Portal > Positioner > Popup (anchored overlays)', () => {
  it('Popover.Content', async () => {
    const { container } = render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content side="bottom" className="custom-popup" data-testid="pc">
          <Popover.Title>Filters</Popover.Title>
        </Popover.Content>
      </Popover.Root>,
    );
    await act(async () => {});
    expectStack(container, 'pc', 'bottom');
  });

  it('Tooltip.Content', async () => {
    const { container } = render(
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>Info</Tooltip.Trigger>
          <Tooltip.Content side="top" className="custom-popup" data-testid="tc">Hint</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>,
    );
    await act(async () => {});
    expectStack(container, 'tc', 'top');
    expect(document.querySelector('[data-testid="tc"]')!.getAttribute('role')).toBe('tooltip');
  });

  it('Menu.Content', async () => {
    const { container } = render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Actions</Menu.Trigger>
        <Menu.Content side="bottom" align="end" className="custom-popup" data-testid="mc">
          <Menu.Item>Rename</Menu.Item>
        </Menu.Content>
      </Menu.Root>,
    );
    await act(async () => {});
    expectStack(container, 'mc', 'bottom');
    expect(document.querySelector('[data-testid="mc"] [role="menuitem"]')?.textContent).toContain('Rename');
  });

  it('ContextMenu.Content', async () => {
    const { container } = render(
      <ContextMenu.Root defaultOpen>
        <ContextMenu.Trigger>Row</ContextMenu.Trigger>
        <ContextMenu.Content side="left" className="custom-popup" data-testid="cc">
          <ContextMenu.Item>Copy</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    await act(async () => {});
    expectStack(container, 'cc', 'left');
  });
});
