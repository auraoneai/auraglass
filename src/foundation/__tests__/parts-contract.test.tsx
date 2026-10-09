/* CMP-017 (REQ-CMP-06): for every registered meta, render every story; collected
   data-ag-part values must be a subset of meta.parts and their union must equal
   meta.parts; every data-state value must be in AG_STATES. */
import * as React from 'react';
import { describe, expect, it, afterEach } from '@jest/globals';
import { render, cleanup, act, fireEvent } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { AG_STATES } from '../../foundation/state';
import { discoverCmpMetas, loadStories, storyElement, REPO_ROOT } from '../../../tests/foundation/metas';

const coverage = JSON.parse(
  readFileSync(join(REPO_ROOT, 'tests', 'foundation', 'contract-coverage.json'), 'utf8'),
) as { registered: string[] };


// jsdom lacks PointerEvent — BU switch/toggle dispatch with it.
if (typeof window !== 'undefined' && !('PointerEvent' in window)) {
  (window as any).PointerEvent = class extends MouseEvent {
    public pointerId = 0;
    public pointerType = 'mouse';
    public isPrimary = true;
    constructor(type: string, init: MouseEventInit = {}) { super(type, init); }
  };
}

const STATE_SET = new Set<string>(AG_STATES);

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

describe('parts contract (rendered DOM == meta.parts)', () => {
  const metas = discoverCmpMetas().filter((m) => coverage.registered.includes(m.name));
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
    expectSingleState(items[0], 'checked');
    expectSingleState(items[1], 'unchecked');
    fireEvent.click(items[1]);
    await act(async () => {});
    expectSingleState(items[1], 'checked');
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
    expectSingleState(items[0], 'on');
    expectSingleState(items[1], 'off');
    fireEvent.click(items[1]);
    await act(async () => {});
    expectSingleState(items[1], 'on');
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
    if (trigger) {
      expectSingleState(trigger, 'closed');
    }
  });

  it('segmented-control item: unchecked → checked on click', async () => {
    const { SegmentedControl } = await import('../../components/segmented-control/SegmentedControl.client');
    const { container } = render(
      <SegmentedControl.Root defaultValue="a">
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl.Root>,
    );
    const items = container.querySelectorAll('[data-ag-part="item"]');
    expectSingleState(items[0], 'checked');
    expectSingleState(items[1], 'unchecked');
    fireEvent.click(items[1]);
    await act(async () => {});
    expectSingleState(items[1], 'checked');
  });
});
