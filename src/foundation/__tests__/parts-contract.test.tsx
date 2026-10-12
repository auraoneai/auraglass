/* CMP-017 (REQ-CMP-06): for every discovered *.meta.ts (no allow-list), render every story; collected
   data-ag-part values must be a subset of meta.parts and their union must equal
   meta.parts; every data-state value must be in AG_STATES. */
import * as React from 'react';
import { describe, expect, it, afterEach, jest } from '@jest/globals';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import { AG_STATES } from '../../foundation/state';
import { discoverCmpMetas, loadStories, storyElement } from '../../../tests/foundation/metas';

// jsdom lacks PointerEvent — BU switch/toggle dispatch with it.
if (typeof window !== 'undefined' && !('PointerEvent' in window)) {
  Object.defineProperty(window, 'PointerEvent', { configurable: true, writable: true, value: class extends MouseEvent {
    public pointerId = 0;
    public pointerType = 'mouse';
    public isPrimary = true;
    constructor(type: string, init: MouseEventInit = {}) { super(type, init); }
  } });
}

const STATE_SET = new Set<string>(AG_STATES);

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

describe('parts contract (rendered DOM == meta.parts)', () => {
  const metas = discoverCmpMetas();
  it('registered metas exist', () => {
    expect(metas.length).toBeGreaterThan(0);
  });

  for (const { name, meta } of metas) {
    it(`${name}: story data-ag-part union equals meta.parts and data-state is in AG_STATES`, async () => {
      const stories = loadStories(name);
      if (stories.length === 0) throw new Error(`no story file for ${name}`);
      const seen = new Set<string>();
      const states = new Set<string>();
      let rendered = 0;
      for (const loaded of stories) {
        for (const storyName of Object.keys(loaded.exports)) {
          if (storyName === 'default') continue;
          const { element } = storyElement(loaded, storyName);
          if (!element) continue;
          cleanup();
          render(element);
          await act(async () => {});
          rendered += 1;
          for (const el of Array.from(document.querySelectorAll('[data-ag-part]'))) {
            const v = el.getAttribute('data-ag-part');
            if (v) seen.add(v);
          }
          for (const el of Array.from(document.querySelectorAll('[data-state]'))) {
            for (const s of (el.getAttribute('data-state') ?? '').split(/\s+/).filter(Boolean)) {
              states.add(s);
            }
          }
        }
      }
      expect(rendered).toBeGreaterThan(0);
      for (const p of seen) {
        if (!meta.parts.includes(p)) throw new Error(`${name}: rendered part '${p}' not declared in meta.parts`);
      }
      if (JSON.stringify([...seen].sort()) !== JSON.stringify([...meta.parts].sort())) {
        throw new Error(`${name}: union of rendered parts ${JSON.stringify([...seen].sort())} != meta.parts ${JSON.stringify([...meta.parts].sort())}`);
      }
      for (const s of states) {
        if (!STATE_SET.has(s)) throw new Error(`${name}: data-state '${s}' not in AG_STATES`);
      }
    });
  }
});

/* REQ-CMP-07: per-family interaction — each stateful part carries exactly one
   AG_STATES value on data-state and it toggles after a user interaction. */
describe('data-state interaction contract (REQ-CMP-07)', () => {
  const expectSingleState = (el: Element | null, state: string) => {
    expect(el).not.toBeNull();
    expect(el!.getAttribute('data-state')).toBe(state);
  };

  it('switch root/thumb: unchecked → checked on click', async () => {
    const { Switch } = await import('../../components/switch/Switch.client');
    const { container } = render(<Switch />);
    const root = container.querySelector('[data-ag-part="root"]') as HTMLElement;
    expectSingleState(root, 'unchecked');
    expectSingleState(container.querySelector('[data-ag-part="thumb"]'), 'unchecked');
    fireEvent.click(root);
    await act(async () => {});
    expectSingleState(root, 'checked');
    expectSingleState(container.querySelector('[data-ag-part="thumb"]'), 'checked');
  });

  it('checkbox root: unchecked → checked → indeterminate', async () => {
    const { Checkbox } = await import('../../components/checkbox/Checkbox.client');
    const { container, rerender } = render(<Checkbox />);
    const root = container.querySelector('[data-ag-part="root"]') as HTMLElement;
    expectSingleState(root, 'unchecked');
    fireEvent.click(root);
    await act(async () => {});
    expectSingleState(root, 'checked');
    rerender(<Checkbox indeterminate />);
    await act(async () => {});
    expectSingleState(container.querySelector('[data-ag-part="root"]'), 'indeterminate');
  });

  it('radio-group item: unchecked → checked on click', async () => {
    const { RadioGroup } = await import('../../components/radio-group/RadioGroup.client');
    const { container } = render(
      <RadioGroup.Root defaultValue="a">
        <RadioGroup.Item value="a">A</RadioGroup.Item>
        <RadioGroup.Item value="b">B</RadioGroup.Item>
      </RadioGroup.Root>,
    );
    const items = container.querySelectorAll('[data-ag-part="item"]');
    const [firstItem, secondItem] = items;
    if (!firstItem || !secondItem) throw new Error("Expected two rendered items");
    expectSingleState(firstItem, 'checked');
    expectSingleState(secondItem, 'unchecked');
    fireEvent.click(secondItem);
    await act(async () => {});
    expectSingleState(secondItem, 'checked');
  });

  it('toggle-group item + toggle Button: off → on on click', async () => {
    const { ToggleGroup } = await import('../../components/toggle-group/ToggleGroup.client');
    const { Button } = await import('../../components/button/Button.client');
    const { container } = render(
      <>
        <ToggleGroup.Root defaultValue={['a']}>
          <ToggleGroup.Item value="a">A</ToggleGroup.Item>
          <ToggleGroup.Item value="b">B</ToggleGroup.Item>
        </ToggleGroup.Root>
        <Button defaultPressed={false}>toggle</Button>
      </>,
    );
    const items = container.querySelectorAll('[data-ag-part="item"]');
    const [firstItem, secondItem] = items;
    if (!firstItem || !secondItem) throw new Error("Expected two rendered items");
    expectSingleState(firstItem, 'on');
    expectSingleState(secondItem, 'off');
    fireEvent.click(secondItem);
    await act(async () => {});
    expectSingleState(secondItem, 'on');
    const btn = container.querySelector('.ag-button') as HTMLElement;
    expectSingleState(btn, 'off');
    fireEvent.click(btn);
    await act(async () => {});
    expectSingleState(btn, 'on');
  });

  it('accordion item/trigger/panel: collapsed → expanded on click', async () => {
    const { Accordion } = await import('../../components/accordion/Accordion.client');
    const { container } = render(
      <Accordion.Root>
        <Accordion.Item value="a">
          <Accordion.Header>
            <Accordion.Trigger>head</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>body</Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    const item = container.querySelector('[data-ag-part="item"]') as HTMLElement;
    const trigger = container.querySelector('[data-ag-part="trigger"]') as HTMLElement;
    expectSingleState(item, 'collapsed');
    expectSingleState(trigger, 'collapsed');
    fireEvent.click(trigger);
    await act(async () => {});
    expectSingleState(item, 'expanded');
    expectSingleState(trigger, 'expanded');
    expectSingleState(document.querySelector('[data-ag-part="content"]'), 'expanded');
  });

  it('select trigger + popup: closed → open on click', async () => {
    const { Select } = await import('../../components/select/Select.client');
    const { container } = render(
      <Select.Root>
        <Select.Trigger placeholder="pick" />
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select.Root>,
    );
    const trigger = container.querySelector('[data-ag-part="trigger"]') as HTMLElement;
    expectSingleState(trigger, 'closed');
    fireEvent.click(trigger);
    await act(async () => {});
    expectSingleState(trigger, 'open');
    expectSingleState(document.querySelector('[data-ag-part="positioner"]'), 'open');
  });

  it('combobox input: idle → loading; trigger: closed → open', async () => {
    const { Combobox } = await import('../../components/combobox/Combobox.client');
    const { container, rerender } = render(
      <Combobox.Root items={['a']} loading={false}>
        <Combobox.Input />
      </Combobox.Root>,
    );
    const input = container.querySelector('[data-ag-part="input"]') as HTMLElement;
    expectSingleState(input, 'idle');
    rerender(
      <Combobox.Root items={['a']} loading>
        <Combobox.Input />
      </Combobox.Root>,
    );
    await act(async () => {});
    expectSingleState(input, 'loading');
    const trigger = container.querySelector('[data-ag-part="trigger"]') as HTMLElement;
    expectSingleState(trigger, 'closed');
  });

  it('segmented-control item: unchecked → checked on click', async () => {
    const { SegmentedControl } = await import('../../components/segmented-control/SegmentedControl.client');
    const { container } = render(
      <SegmentedControl.Root defaultValue="a" name="selection" aria-label="Selection">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    const items = container.querySelectorAll('[data-ag-part="item"]');
    const [firstItem, secondItem] = items;
    if (!firstItem || !secondItem) throw new Error("Expected two rendered items");
    expectSingleState(firstItem, 'checked');
    expectSingleState(secondItem, 'unchecked');
    fireEvent.click(secondItem);
    await act(async () => {});
    expectSingleState(secondItem, 'checked');
  });

  it('menu trigger closed → open; checkbox item unchecked → checked; mixed → indeterminate', async () => {
    const { Menu } = await import('../../components/menu/Menu.client');
    const Demo = () => {
      const [wrap, setWrap] = React.useState(false);
      return (
        <Menu.Root>
          <Menu.Trigger>actions</Menu.Trigger>
          <Menu.Content>
            <Menu.CheckboxItem checked={wrap} onCheckedChange={(c) => setWrap(c === true)}>Wrap</Menu.CheckboxItem>
            <Menu.CheckboxItem checked="indeterminate">Selective</Menu.CheckboxItem>
          </Menu.Content>
        </Menu.Root>
      );
    };
    render(<Demo />);
    const trigger = document.querySelector('[data-ag-part="trigger"]') as HTMLElement;
    expectSingleState(trigger, 'closed');
    fireEvent.click(trigger);
    await act(async () => {});
    expectSingleState(trigger, 'open');
    const item = (label: string) => Array.from(document.querySelectorAll('[role="menuitemcheckbox"]')).find((n) => n.textContent?.includes(label)) as HTMLElement;
    expectSingleState(item('Wrap'), 'unchecked');
    expectSingleState(item('Selective'), 'indeterminate');
    fireEvent.click(item('Wrap'));
    await act(async () => {});
    expectSingleState(item('Wrap'), 'checked');
  });

  it('menu radio items: checked moves on click; submenu trigger closed → open', async () => {
    const { Menu } = await import('../../components/menu/Menu.client');
    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>view</Menu.Trigger>
        <Menu.Content>
          <Menu.RadioGroup defaultValue="list">
            <Menu.RadioItem value="list">List</Menu.RadioItem>
            <Menu.RadioItem value="grid">Grid</Menu.RadioItem>
          </Menu.RadioGroup>
          <Menu.Submenu>
            <Menu.SubmenuTrigger>Share</Menu.SubmenuTrigger>
            <Menu.Content><Menu.Item>Email</Menu.Item></Menu.Content>
          </Menu.Submenu>
        </Menu.Content>
      </Menu.Root>,
    );
    await act(async () => {});
    const radio = (label: string) => Array.from(document.querySelectorAll('[role="menuitemradio"]')).find((n) => n.textContent?.includes(label)) as HTMLElement;
    expectSingleState(radio('List'), 'checked');
    expectSingleState(radio('Grid'), 'unchecked');
    fireEvent.click(radio('Grid'));
    await act(async () => {});
    expectSingleState(radio('Grid'), 'checked');
    expectSingleState(radio('List'), 'unchecked');
    const sub = document.querySelector('[data-ag-part="submenu-trigger"]') as HTMLElement;
    expectSingleState(sub, 'closed');
    sub.focus();
    fireEvent.keyDown(sub, { key: 'ArrowRight' });
    await act(async () => {});
    expect(document.querySelectorAll('[role="menu"]')).toHaveLength(2);
    expectSingleState(sub, 'open');
  });

  it('context-menu items and trigger carry single data-state values', async () => {
    const { ContextMenu, ContextMenuCheckboxItem, ContextMenuRadioGroup, ContextMenuRadioItem } = await import('../../components/menu/ContextMenu.client');
    render(
      <ContextMenu.Root>
        <ContextMenu.Trigger><div>area</div></ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenuCheckboxItem checked>Grid lines</ContextMenuCheckboxItem>
          <ContextMenuRadioGroup defaultValue="a">
            <ContextMenuRadioItem value="a">A</ContextMenuRadioItem>
            <ContextMenuRadioItem value="b">B</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenu.Content>
      </ContextMenu.Root>,
    );
    const trigger = document.querySelector('[data-ag-part="context-trigger"]') as HTMLElement;
    expectSingleState(trigger, 'closed');
    fireEvent.contextMenu(trigger);
    await act(async () => {});
    expectSingleState(trigger, 'open');
    expectSingleState(document.querySelector('[role="menuitemcheckbox"]'), 'checked');
    const radios = document.querySelectorAll('[role="menuitemradio"]');
    expectSingleState(radios[0]!, 'checked');
    expectSingleState(radios[1]!, 'unchecked');
  });

  it('popover and tooltip triggers: closed → open', async () => {
    const { Popover } = await import('../../components/popover/Popover.client');
    render(
      <Popover.Root>
        <Popover.Trigger>info</Popover.Trigger>
      </Popover.Root>,
    );
    const trigger = document.querySelector('[data-ag-part="trigger"]') as HTMLElement;
    expectSingleState(trigger, 'closed');
    fireEvent.click(trigger);
    await act(async () => {});
    expectSingleState(trigger, 'open');
    cleanup();
    const { Tooltip } = await import('../../components/tooltip/Tooltip.client');
    render(
      <Tooltip.Root open>
        <Tooltip.Trigger>help</Tooltip.Trigger>
      </Tooltip.Root>,
    );
    expectSingleState(document.querySelector('[data-ag-part="trigger"]'), 'open');
  });
});

describe('toDataState emits exactly one value (REQ-CMP-07)', () => {
  it('maps each flag to its single AG_STATES member', async () => {
    const { toDataState } = await import('../../foundation/state');
    expect(toDataState({ open: true })).toBe('open');
    expect(toDataState({ open: false })).toBe('closed');
    expect(toDataState({ checked: 'mixed' })).toBe('indeterminate');
    expect(toDataState({ pressed: false })).toBe('off');
    expect(toDataState({ expanded: true })).toBe('expanded');
    expect(toDataState({ loading: undefined })).toBeUndefined();
    expect(toDataState({})).toBeUndefined();
  });

  it('two flags are a type error and, at runtime, a dev error with one value (never space-joined)', async () => {
    const { toDataState } = await import('../../foundation/state');
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // @ts-expect-error — one flag per call
    const v = toDataState({ open: true, loading: true });
    expect(v).toBe('open');
    expect(v).not.toMatch(/\s/);
    expect(spy.mock.calls.filter((c) => String(c[0]).includes('one state flag'))).toHaveLength(1);
    spy.mockRestore();
  });
});
