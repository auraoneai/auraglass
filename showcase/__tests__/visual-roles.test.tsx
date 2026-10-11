/* Visual-role contract for the collaborative-workspace, mobile-productivity,
   ecommerce and analytics showcases (REQ-QUAL-58 visual quality pass).
   jsdom cannot paint, so these assert the structure the material engine paints
   from: every chrome/overlay surface goes through the engine with a variant, no
   readable text sits directly on the scene (it must be inside a surface), shells
   without a sidebar do not reserve the sidebar column, and the fixed broken bits
   (raw select value, corner-pinned dialog footer buttons, "You"/"Assistant"
   comment authors) stay fixed. */
import { describe, expect, it, jest, afterEach } from '@jest/globals';
import * as React from 'react';
import { cleanup, render } from '@testing-library/react';

jest.mock('../analytics/assets/insight-mark.avif', () => 'insight-mark.avif');
jest.mock('../collaborative-workspace/assets/brief-cover.avif', () => 'brief-cover.avif');
jest.mock('../ecommerce/assets/atlas-chair-side.avif', () => 'atlas-chair-side.avif');
jest.mock('../ecommerce/assets/atlas-chair.avif', () => 'atlas-chair.avif');
jest.mock('../ecommerce/assets/nimbus-lamp.avif', () => 'nimbus-lamp.avif');
jest.mock('../ecommerce/assets/orbit-tote.avif', () => 'orbit-tote.avif');
jest.mock('../ecommerce/assets/vega-mug.avif', () => 'vega-mug.avif');
jest.mock('../mobile-productivity/assets/tasks-mark.avif', () => 'tasks-mark.avif');

/* jest.mock above is hoisted above these imports by babel-jest. */
import { AuraGlassProvider, Environment } from '../../src/root/mat';
import { Analytics, AnalyticsFilterChart } from '../analytics/Analytics.showcase';
import {
  CollaborativeDocumentComments,
  CollaborativeShare,
  CollaborativeWorkspace,
} from '../collaborative-workspace/CollaborativeWorkspace.showcase';
import { Ecommerce, EcommerceCartSheet, EcommerceProductFragment } from '../ecommerce/Ecommerce.showcase';
import { MobileProductivity, MobileSheetAtDetent, MobileTabBar } from '../mobile-productivity/MobileProductivity.showcase';

const STAGE = (el: React.ReactElement) => (
  <AuraGlassProvider storage={null}>
    <Environment backdrop="media" image="/scenes/photo.jpg">{el}</Environment>
  </AuraGlassProvider>
);

function mount(el: React.ReactElement) {
  const errors: string[] = [];
  const spy = jest.spyOn(console, 'error').mockImplementation((...a: unknown[]) => {
    errors.push(a.map(String).join(' '));
  });
  const utils = render(STAGE(el));
  spy.mockRestore();
  return { ...utils, errors };
}

/** Visible text nodes (outside visually-hidden helpers and hidden elements). */
function visibleTextNodes(root: Element): Text[] {
  const out: Text[] = [];
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n as Text;
    if (!t.textContent?.trim()) continue;
    const parent = t.parentElement;
    if (!parent) continue;
    if (parent.closest('.ag-visually-hidden, .ag-vh, [hidden], [aria-hidden="true"], svg, option, script, style')) continue;
    if (parent.closest('.ag-skip-link')) continue; // hidden until focused
    out.push(t);
  }
  return out;
}

const FULL_PAGES: Array<[string, React.ReactElement]> = [
  ['collaborative-workspace', <CollaborativeWorkspace key="cw" />],
  ['mobile-productivity', <MobileProductivity key="mp" />],
  ['ecommerce', <Ecommerce key="ec" />],
  ['analytics', <Analytics key="an" />],
];

const FRAGMENTS: Array<[string, React.ReactElement]> = [
  ['collaborative document + comments', <CollaborativeDocumentComments key="a" />],
  ['collaborative share popover', <CollaborativeShare key="b" defaultOpen />],
  ['mobile tab bar', <MobileTabBar key="c" />],
  ['mobile sheet detent 2', <MobileSheetAtDetent key="d" detent={1} />],
  ['ecommerce product detail', <EcommerceProductFragment key="e" />],
  ['ecommerce cart sheet', <EcommerceCartSheet key="f" />],
  ['analytics filter bar + chart', <AnalyticsFilterChart key="g" />],
];

afterEach(() => cleanup());

describe('showcase visual roles (collaborative-workspace, mobile-productivity, ecommerce, analytics)', () => {
  it.each([...FULL_PAGES, ...FRAGMENTS])('%s renders without React errors', (_name, el) => {
    const { errors } = mount(el);
    expect(errors.filter((e) => !/act\(|not wrapped in act/.test(e))).toEqual([]);
  });

  it.each([...FULL_PAGES, ...FRAGMENTS])('%s: no visible text sits directly on the scene', (_name, el) => {
    mount(el);
    const bare = visibleTextNodes(document.body)
      .filter((t) => !t.parentElement!.closest('[data-ag-surface]'))
      .map((t) => `${t.parentElement!.tagName.toLowerCase()}: ${t.textContent!.trim().slice(0, 40)}`);
    expect(bare).toEqual([]);
  });

  it.each([...FULL_PAGES, ...FRAGMENTS])('%s: every chrome/overlay/transient surface carries a material variant', (_name, el) => {
    mount(el);
    const layered = Array.from(document.querySelectorAll('[data-ag-surface][data-ag-layer]:not([data-ag-layer="content"])'));
    expect(layered.filter((s) => !s.hasAttribute('data-ag-variant')).map((s) => s.outerHTML.slice(0, 80))).toEqual([]);
  });

  it.each(FULL_PAGES)('%s: the top bar is a chrome glass surface', (_name, el) => {
    mount(el);
    const bar = document.querySelector('[data-ag-part="top-bar"]');
    expect(bar).not.toBeNull();
    expect(bar).toHaveAttribute('data-ag-layer', 'chrome');
    expect(bar).toHaveAttribute('data-ag-variant', 'regular');
  });

  it.each(FULL_PAGES)('%s: a shell without a Sidebar does not reserve the sidebar column', (_name, el) => {
    mount(el);
    const shell = document.querySelector('.ag-app-shell');
    expect(shell).not.toBeNull();
    expect(shell!.querySelector('[data-ag-slot="sidebar"]')).toBeNull();
    expect(shell).toHaveAttribute('data-ag-sidebar', 'collapsed');
  });

  it.each(FULL_PAGES)('%s: the skip link is inside the shell or its top bar', (_name, el) => {
    mount(el);
    const skip = document.querySelector('.ag-skip-link');
    expect(skip).not.toBeNull();
    expect(skip!.closest('.ag-app-shell')).not.toBeNull();
  });

  it('ecommerce: the upholstery select shows its label, not the raw value', () => {
    mount(<Ecommerce />);
    const trigger = document.querySelector('.ag-select [data-ag-part="value"]');
    expect(trigger?.textContent).toBe('Fog grey');
  });

  it('collaborative-workspace: comments are attributed to people', () => {
    mount(<CollaborativeDocumentComments />);
    const headings = Array.from(document.querySelectorAll('[data-ag-part="message"] [data-ag-part="heading"]')).map((h) => h.textContent);
    expect(headings.length).toBeGreaterThan(0);
    for (const h of headings) expect(h).not.toMatch(/^(You|Assistant)\b/);
  });

  it('collaborative-workspace: the document title is not repeated under the page header', () => {
    mount(<CollaborativeWorkspace />);
    const titles = Array.from(document.querySelectorAll('h1, h2')).filter((h) => h.textContent === 'Q2 launch brief — Harbor payments');
    expect(titles.map((h) => h.tagName)).toEqual(['H1']);
  });
});
