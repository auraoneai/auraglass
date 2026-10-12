/* CMP-015 (REQ-CMP-03): every component's ref resolves to its root part's DOM
   element after mount. Parametrised over EVERY discovered *.meta.ts (no
   hand-maintained allow-list). Components whose Default story renders the subject
   directly are checked through that story; the rest — compounds whose root part is
   a popup (overlays: rendered open), controls whose stories wrap the subject in a
   demo component, and metas whose part list is not root-first — use the explicit
   REF_FIXTURES below, which name the part the ref must land on. */
import * as React from 'react';
import { describe, expect, it, afterEach } from '@jest/globals';
import { render, act, cleanup } from '@testing-library/react';
import { discoverCmpMetas, loadStories, storyElement } from '../../../tests/foundation/metas';
import { AuraGlassProvider } from '../../theme';
import { Dialog } from '../../components/dialog';
import { AlertDialog } from '../../components/alert-dialog';
import { Popover } from '../../components/popover';
import { Tooltip } from '../../components/tooltip';
import { Menu } from '../../components/menu';
import { Sheet } from '../../components/sheet';
import { Select } from '../../components/select';
import { Combobox } from '../../components/combobox';
import { Toast } from '../../components/toast';
import { Checkbox, CheckboxGroup } from '../../components/checkbox';
import { RadioGroup } from '../../components/radio-group';
import { Slider } from '../../components/slider';
import { Switch } from '../../components/switch';
import { ToggleGroup } from '../../components/toggle-group';
import { Pagination } from '../../components/pagination/Pagination';
import { Tabs } from '../../components/tabs/Tabs';
import { Timeline } from '../../components/timeline/Timeline';
import { ActivityFeed } from '../../components/timeline/ActivityFeed';
import { SourceTransition } from '../../components/source-transition/SourceTransition';
import { TabBar } from '../../components/tab-bar/TabBar';
import { CommandPalette } from '../../components/command-palette/CommandPalette';
import { Icon } from '../../icons/components';

// jsdom lacks PointerEvent — Base UI overlays dispatch with it.
if (typeof window !== 'undefined' && !('PointerEvent' in window)) {
  Object.defineProperty(window, 'PointerEvent', { configurable: true, writable: true, value: MouseEvent });
}

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

/* A callback ref over Element is assignable to every part's Ref<HTML*Element | SVGElement>. */
type AnyRef = React.RefCallback<Element>;
interface RefFixture {
  /** data-ag-part the ref must resolve to. */
  part: string;
  render: (ref: AnyRef) => React.ReactElement;
  /** The root part is an <svg> (Icon), so the node is an SVGElement. */
  svg?: true;
}

const TIMELINE_ITEMS = [{ id: 'a', timestamp: '2026-01-01T00:00:00Z', title: 'Created' }];

/* Overlays: ref goes on the popup part (Content), rendered open. Compound
   controls: ref goes on the part that renders the root element. */
const REF_FIXTURES: Record<string, RefFixture> = {
  Dialog: {
    part: 'popup',
    render: (ref) => (
      <Dialog.Root defaultOpen>
        <Dialog.Content ref={ref} aria-label="Dialog"><Dialog.Title>T</Dialog.Title></Dialog.Content>
      </Dialog.Root>
    ),
  },
  AlertDialog: {
    part: 'popup',
    render: (ref) => (
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Content ref={ref}>
          <AlertDialog.Title>Delete?</AlertDialog.Title>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
          <AlertDialog.Action>Delete</AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Root>
    ),
  },
  Sheet: {
    part: 'popup',
    render: (ref) => (
      <Sheet.Root defaultOpen>
        <Sheet.Content ref={ref}><Sheet.Title>Sheet</Sheet.Title></Sheet.Content>
      </Sheet.Root>
    ),
  },
  Popover: {
    part: 'popup',
    render: (ref) => (
      <Popover.Root defaultOpen>
        <Popover.Trigger>anchor</Popover.Trigger>
        <Popover.Content ref={ref} aria-label="pop">body</Popover.Content>
      </Popover.Root>
    ),
  },
  Tooltip: {
    part: 'popup',
    render: (ref) => (
      <Tooltip.Provider>
        <Tooltip.Root defaultOpen>
          <Tooltip.Trigger>save</Tooltip.Trigger>
          <Tooltip.Content ref={ref}>hint</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    ),
  },
  Menu: {
    part: 'popup',
    render: (ref) => (
      <Menu.Root defaultOpen>
        <Menu.Trigger>actions</Menu.Trigger>
        <Menu.Content ref={ref}><Menu.Item>Cut</Menu.Item></Menu.Content>
      </Menu.Root>
    ),
  },
  Select: {
    part: 'trigger',
    render: (ref) => (
      <Select.Root>
        <Select.Trigger ref={ref} placeholder="Pick" aria-label="Fruit" />
        <Select.Content><Select.Item value="apple" label="Apple" /></Select.Content>
      </Select.Root>
    ),
  },
  /* Input-family: the ref lands on the native control (REQ-CMP-60/63/65). */
  Combobox: {
    part: 'input',
    render: (ref) => (
      <Combobox.Root items={['Apple']}>
        <Combobox.Input ref={ref} placeholder="Fruit" aria-label="Fruit" />
        <Combobox.Content><Combobox.Item value="Apple">Apple</Combobox.Item></Combobox.Content>
      </Combobox.Root>
    ),
  },
  Toast: {
    part: 'viewport',
    render: (ref) => (
      <Toast.Provider>
        <Toast.Viewport ref={ref} />
      </Toast.Provider>
    ),
  },
  Checkbox: { part: 'root', render: (ref) => <Checkbox ref={ref} aria-label="agree" /> },
  CheckboxGroup: {
    part: 'root',
    render: (ref) => (
      <CheckboxGroup ref={ref} aria-label="prefs">
        <Checkbox value="a">A</Checkbox>
      </CheckboxGroup>
    ),
  },
  RadioGroup: {
    part: 'root',
    render: (ref) => (
      <RadioGroup.Root ref={ref} aria-label="plan" defaultValue="a">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
      </RadioGroup.Root>
    ),
  },
  Slider: { part: 'root', render: (ref) => <Slider.Root ref={ref} aria-label="vol" defaultValue={30} /> },
  Switch: { part: 'root', render: (ref) => <Switch ref={ref} aria-label="airplane" /> },
  ToggleGroup: {
    part: 'root',
    render: (ref) => (
      <ToggleGroup.Root ref={ref} aria-label="format">
        <ToggleGroup.Item value="b">Bold</ToggleGroup.Item>
      </ToggleGroup.Root>
    ),
  },
  /* SURF metas under src/components: their part lists are alphabetical, so the
     root part is named explicitly. */
  Pagination: { part: 'pagination', render: (ref) => <Pagination.Root ref={ref} pageCount={5} defaultPage={2} /> },
  Tabs: {
    part: 'tabs',
    render: (ref) => (
      <Tabs.Root ref={ref} defaultValue="a">
        <Tabs.List aria-label="Sections"><Tabs.Tab value="a">A</Tabs.Tab></Tabs.List>
        <Tabs.Panel value="a">Panel</Tabs.Panel>
      </Tabs.Root>
    ),
  },
  Timeline: {
    part: 'timeline-container',
    render: (ref) => <Timeline ref={ref as React.Ref<HTMLElement>} items={TIMELINE_ITEMS} aria-label="History" />,
  },
  ActivityFeed: {
    part: 'activity-feed',
    render: (ref) => <ActivityFeed ref={ref as React.Ref<HTMLElement>} items={TIMELINE_ITEMS} aria-label="Activity" />,
  },
  SourceTransition: {
    part: 'source-transition',
    render: (ref) => (
      <SourceTransition.Root ref={ref}>
        <SourceTransition.Source id="card">Card</SourceTransition.Source>
      </SourceTransition.Root>
    ),
  },
  TabBar: {
    part: 'tab-bar',
    render: (ref) => (
      <TabBar.Root ref={ref} aria-label="Primary">
        <TabBar.Item value="home" href="/home">Home</TabBar.Item>
        <TabBar.Item value="search" href="/search">Search</TabBar.Item>
      </TabBar.Root>
    ),
  },
  CommandPalette: {
    part: 'command-palette',
    render: (ref) => <CommandPalette ref={ref as React.Ref<HTMLDivElement>} defaultOpen hotkey={false}>palette</CommandPalette>,
  },
  Icon: { part: 'root', svg: true, render: (ref) => <Icon ref={ref as React.Ref<SVGSVGElement>} name="search" /> },
};

// REQ-60/63/65: input-family refs land on the native control, not the root.
const REF_TARGET: Record<string, string> = {
  TextField: 'control',
  SearchField: 'control',
  NumberField: 'input',
};

describe('ref resolves to the root part element', () => {
  const metas = discoverCmpMetas().filter((m) => m.meta.parts.length > 0);

  it('covers every discovered meta', () => {
    expect(metas.length).toBeGreaterThan(0);
  });

  it('every fixture names a discovered meta and a part that meta declares', () => {
    const byName = new Map(metas.map((m) => [m.name, m.meta.parts as readonly string[]]));
    const stale = Object.entries(REF_FIXTURES).filter(([name, f]) => !byName.get(name)?.includes(f.part));
    expect(stale.map(([name]) => name)).toEqual([]);
  });

  for (const { name, meta } of metas) {
    const fixture = REF_FIXTURES[name];
    const rootPart = fixture?.part ?? REF_TARGET[name] ?? meta.parts[0]!;
    it(`${name}: ref.current is the [data-ag-part=${rootPart}] element`, async () => {
      if (fixture) {
        const seen: Array<Element | null> = [];
        const ref = (node: Element | null) => { seen.push(node); };
        render(<AuraGlassProvider>{fixture.render(ref)}</AuraGlassProvider>);
        await act(async () => { await new Promise((r) => setTimeout(r, 0)); });
        const target = document.querySelector(`[data-ag-part="${rootPart}"]`);
        if (!target) throw new Error(`${name}: no data-ag-part=${rootPart} element rendered`);
        const last = seen.filter((n) => n !== null).pop();
        expect(last).toBe(target);
        expect(last).toBeInstanceOf(fixture.svg ? SVGElement : HTMLElement);
        return;
      }
      const stories = loadStories(name);
      if (stories.length === 0) throw new Error(`no story file found for ${name}`);
      let asserted = 0;
      for (const loaded of stories) {
        const { element, reason } = storyElement(loaded, 'Default');
        if (!element) throw new Error(`${name}: Default story not renderable in ${loaded.file} (${reason}); add a REF_FIXTURES entry`);
        const el = element as React.ReactElement<Record<string, unknown> & { ref?: React.Ref<HTMLElement> }>;
        const seen: Array<HTMLElement | null> = [];
        const ref = (node: HTMLElement | null) => { seen.push(node); };
        const withRef = React.cloneElement(el, { ref } as Record<string, unknown>);
        const { container } = render(withRef);
        const rootEl = container.querySelector(`[data-ag-part="${rootPart}"]`);
        if (!rootEl) throw new Error(`${name}: no data-ag-part=${rootPart} element rendered`);
        expect(seen[seen.length - 1]).toBe(rootEl);
        expect(seen[seen.length - 1]).toBeInstanceOf(HTMLElement);
        asserted += 1;
        cleanup();
      }
      expect(asserted).toBeGreaterThan(0);
    });
  }
});
