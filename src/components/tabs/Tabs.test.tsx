/** @jest-environment jsdom */
import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import * as React from 'react';
import { Tabs } from './Tabs';

const Demo = ({ onChange, keepMounted }: { onChange?: (v: string) => void; keepMounted?: boolean }) => (
  <Tabs.Root defaultValue="a" onValueChange={onChange}>
    <Tabs.List>
      <Tabs.Tab value="a">Alpha</Tabs.Tab>
      <Tabs.Tab value="b">Beta</Tabs.Tab>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Panel value="a" {...(keepMounted ? { keepMounted: true } : {})}>A</Tabs.Panel>
    <Tabs.Panel value="b" {...(keepMounted ? { keepMounted: true } : {})}>B</Tabs.Panel>
  </Tabs.Root>
);

describe('Tabs (SURF-065)', () => {
  it('two instances have unique ids', () => {
    render(
      <>
        <Demo />
        <Demo />
      </>,
    );
    const tabs = document.querySelectorAll('[role="tab"]');
    const ids = [...tabs].map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has no landmark role and emits part contract attributes', () => {
    render(<Demo />);
    expect(document.querySelector('[data-ag-part="tabs"]')).not.toBeNull();
    expect(document.querySelector('[data-ag-part="list"]')).not.toBeNull();
    expect(document.querySelector('[data-ag-part="tab"]')).not.toBeNull();
    expect(document.querySelector('[data-ag-part="panel"]')).not.toBeNull();
    expect(document.querySelector('[data-ag-part="indicator"]')).not.toBeNull();
    expect(screen.queryAllByRole('navigation')).toHaveLength(0);
  });

  it('onValueChange receives the value string', () => {
    const seen: string[] = [];
    render(<Demo onChange={(v) => seen.push(v)} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(seen).toEqual(['b']);
  });

  it('data-state tracks activation on tabs', () => {
    render(<Demo />);
    const beta = screen.getByRole('tab', { name: 'Beta' });
    expect(beta).toHaveAttribute('data-state', 'inactive');
    fireEvent.click(beta);
    expect(beta).toHaveAttribute('data-state', 'active');
  });

  it('inactive panels unmount by default; keepMounted keeps them hidden', () => {
    const { rerender } = render(<Demo />);
    expect(screen.queryByText('B')).toBeNull();
    rerender(<Demo keepMounted />);
    const b = screen.getByText('B').closest('[data-ag-part="panel"]')!;
    expect(b).toHaveAttribute('hidden');
  });

  it('SURF-47/48: pill default + id/aria-controls resolution both ways', () => {
    const { container } = render(
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
          <Tabs.Tab value="b">B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a" keepMounted>pa</Tabs.Panel>
        <Tabs.Panel value="b" keepMounted>pb</Tabs.Panel>
      </Tabs.Root>,
    );
    expect(container.querySelector('[data-ag-appearance="pill"]')).toBeTruthy();
    // tab -> panel via aria-controls; panel -> tab via aria-labelledby
    for (const tab of screen.getAllByRole('tab')) {
      const panelId = tab.getAttribute('aria-controls')!;
      const panel = document.getElementById(panelId);
      expect(panel).toBeTruthy();
      expect(panel!.getAttribute('aria-labelledby')).toBe(tab.id);
    }
    // two identical instances -> 0 duplicate ids
    const { container: c2 } = render(
      <Tabs.Root defaultValue="a">
        <Tabs.List><Tabs.Tab value="a">A</Tabs.Tab></Tabs.List>
        <Tabs.Panel value="a">x</Tabs.Panel>
      </Tabs.Root>,
    );
    const ids = new Set(
      Array.from(document.querySelectorAll('[id]')).map((e) => e.id),
    );
    expect(ids.size).toBe(document.querySelectorAll('[id]').length);
    void c2;
  });
});

// ---------------------------------------------------------------------------
// REQ-FIN-82 follow-ups on merged #356/#357 (SURF-47..50).
// ---------------------------------------------------------------------------
import { jest } from '@jest/globals';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import { axe } from 'jest-axe';
import * as motion from '../../motion';

jest.mock('../../motion', () => {
  const actual = jest.requireActual<typeof import('../../motion')>('../../motion');
  return { ...actual, startMorph: jest.fn(actual.startMorph) };
});

const Three = ({
  onChange,
  activateOnFocus,
  disabledB,
}: {
  onChange?: (v: string, d: unknown) => void;
  activateOnFocus?: boolean;
  disabledB?: boolean;
}) => (
  <Tabs.Root defaultValue="a" {...(onChange ? { onValueChange: onChange } : {})} {...(activateOnFocus ? { activateOnFocus } : {})}>
    <Tabs.List>
      <Tabs.Tab value="a">A</Tabs.Tab>
      <Tabs.Tab value="b" {...(disabledB ? { disabled: true } : {})}>B</Tabs.Tab>
      <Tabs.Tab value="c">C</Tabs.Tab>
      <Tabs.Indicator />
    </Tabs.List>
    <Tabs.Panel value="a" keepMounted>pa</Tabs.Panel>
    <Tabs.Panel value="b" keepMounted>pb</Tabs.Panel>
    <Tabs.Panel value="c" keepMounted>pc</Tabs.Panel>
  </Tabs.Root>
);

const tab = (name: string) => screen.getByRole('tab', { name });
// Base UI's composite moves focus in a microtask after the keydown.
const press = async (key: string) => {
  const el = document.activeElement as HTMLElement;
  await act(async () => {
    fireEvent.keyDown(el, { key });
    await Promise.resolve();
  });
};

describe('Tabs SURF-47: appearance + (value, details)', () => {
  it("default data-ag-appearance='pill'", () => {
    render(<Three />);
    expect(document.querySelector('[data-ag-part="tabs"]')).toHaveAttribute('data-ag-appearance', 'pill');
  });

  it('onValueChange receives (value, details) with a string reason', () => {
    const spy = jest.fn();
    render(<Three onChange={spy} />);
    fireEvent.click(tab('B'));
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('b', expect.objectContaining({ reason: expect.any(String) }));
  });
});

describe('Tabs SURF-48: keyboard (manual activation by default)', () => {
  it('ArrowRight/ArrowLeft move focus and wrap; Home/End jump', async () => {
    render(<Three />);
    act(() => tab('A').focus());
    await press('ArrowRight');
    expect(document.activeElement).toBe(tab('B'));
    await press('ArrowRight');
    expect(document.activeElement).toBe(tab('C'));
    await press('ArrowRight');
    expect(document.activeElement).toBe(tab('A')); // wraps
    await press('ArrowLeft');
    expect(document.activeElement).toBe(tab('C')); // wraps backwards
    await press('Home');
    expect(document.activeElement).toBe(tab('A'));
    await press('End');
    expect(document.activeElement).toBe(tab('C'));
  });

  it('manual mode: focus does not activate until Enter', async () => {
    render(<Three />);
    act(() => tab('A').focus());
    await press('ArrowRight');
    expect(tab('B')).toHaveAttribute('data-state', 'inactive');
    expect(tab('A')).toHaveAttribute('data-state', 'active');
    // Enter on the focused <button> tab activates it (user-event synthesises
    // the click a browser would).
    await userEvent.setup().keyboard('{Enter}');
    expect(tab('B')).toHaveAttribute('data-state', 'active');
  });

  it('activateOnFocus: arrow keys activate the focused tab', async () => {
    render(<Three activateOnFocus />);
    act(() => tab('A').focus());
    await press('ArrowRight');
    expect(tab('B')).toHaveAttribute('data-state', 'active');
  });

  // Base UI keeps disabled tabs focusable (APG "focusable when disabled",
  // TabsTab focusableWhenDisabled) — they are skipped for activation, never
  // selected by roving focus, Enter or click.
  it('disabled tabs are skipped for activation (focusable, never selected)', async () => {
    const spy = jest.fn();
    render(<Three disabledB activateOnFocus onChange={spy} />);
    act(() => tab('A').focus());
    await press('ArrowRight');
    expect(tab('B')).toHaveAttribute('aria-disabled', 'true');
    expect(tab('B')).toHaveAttribute('data-state', 'inactive');
    await userEvent.setup().keyboard('{Enter}');
    fireEvent.click(tab('B'));
    expect(tab('B')).toHaveAttribute('data-state', 'inactive');
    expect(spy).not.toHaveBeenCalledWith('b', expect.anything());
    await press('ArrowRight');
    expect(document.activeElement).toBe(tab('C'));
    expect(tab('C')).toHaveAttribute('data-state', 'active');
  });
});

describe('Tabs SURF-48: idrefs + axe across two identical instances', () => {
  const Two = () => (
    <>
      <Three />
      <Three />
    </>
  );

  it('0 dangling ARIA idrefs: aria-controls and aria-labelledby resolve both ways', () => {
    render(<Two />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(6);
    const dangling: string[] = [];
    for (const t of tabs) {
      const controls = t.getAttribute('aria-controls');
      const panel = controls ? document.getElementById(controls) : null;
      if (!panel) {
        dangling.push(`${t.id} aria-controls=${String(controls)}`);
        continue;
      }
      if (panel.getAttribute('aria-labelledby') !== t.id) dangling.push(`${panel.id} aria-labelledby`);
    }
    for (const el of document.querySelectorAll('[aria-labelledby], [aria-controls]')) {
      for (const attr of ['aria-labelledby', 'aria-controls']) {
        for (const ref of (el.getAttribute(attr) ?? '').split(/\s+/).filter(Boolean)) {
          if (!document.getElementById(ref)) dangling.push(`${attr}=${ref}`);
        }
      }
    }
    expect(dangling).toEqual([]);
    const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('axe duplicate-id-aria = 0 (and no other violations)', async () => {
    const { container } = render(<Two />);
    const results = (await axe(container)) as { violations: Array<{ id: string }> };
    expect(results.violations.filter((v) => v.id === 'duplicate-id-aria')).toEqual([]);
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});

describe('Tabs SURF-49: indicator morph seam + CSS fallback', () => {
  it('startMorph is called once per activation with the indicator as a surface', () => {
    const spy = motion.startMorph as unknown as jest.Mock;
    render(<Three />);
    spy.mockClear();
    fireEvent.click(tab('B'));
    expect(spy).toHaveBeenCalledTimes(1);
    const opts = spy.mock.calls[0]![1] as { surfaces: Element[] };
    expect(opts.surfaces).toContain(document.querySelector('[data-ag-part="indicator"]'));
    fireEvent.click(tab('C'));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('indicator transition-property is only translate and scale', () => {
    const css = readFileSync(join(__dirname, 'Tabs.css'), 'utf8');
    const props: string[] = [];
    postcss.parse(css).walkRules((rule) => {
      if (rule.selector.trim() !== '.ag-tabs__indicator') return;
      rule.walkDecls('transition-property', (d) => {
        props.push(...d.value.split(',').map((v) => v.trim()));
      });
      rule.walkDecls('transition', (d) => {
        props.push(`transition:${d.value}`);
      });
    });
    expect(props.sort()).toEqual(['scale', 'translate']);
  });
});

describe('Tabs SURF-50: overflow mask, scrollIntoView, data-state', () => {
  it('.ag-tabs__list carries a mask-image only under the overflow attributes', () => {
    const css = readFileSync(join(__dirname, 'Tabs.css'), 'utf8');
    const masked: string[] = [];
    postcss.parse(css).walkDecls('mask-image', (d) => {
      masked.push((d.parent as postcss.Rule).selector);
    });
    expect(masked.length).toBeGreaterThan(0);
    for (const sel of masked) expect(sel).toMatch(/\.ag-tabs__list\[data-ag-overflow-(start|end)='true'\]/);
  });

  it('scrollIntoView({block,inline:nearest}) is called once on activation', () => {
    const original = Element.prototype.scrollIntoView;
    const spy = jest.fn();
    Element.prototype.scrollIntoView = spy as never;
    try {
      render(<Three />);
      spy.mockClear();
      fireEvent.click(tab('B'));
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' });
      expect(spy.mock.contexts[0]).toBe(tab('B'));
    } finally {
      Element.prototype.scrollIntoView = original;
    }
  });

  it('every tab, panel and the indicator carry data-state', () => {
    render(<Three />);
    const panels = document.querySelectorAll('[data-ag-part="panel"]');
    expect(panels).toHaveLength(3);
    for (const el of [...panels, ...document.querySelectorAll('[data-ag-part="tab"]')]) {
      expect(el.getAttribute('data-state')).toMatch(/^(active|inactive)$/);
    }
    expect(screen.getByText('pa')).toHaveAttribute('data-state', 'active');
    expect(screen.getByText('pb', { selector: '[data-ag-part="panel"]' })).toHaveAttribute('data-state', 'inactive');
    expect(document.querySelector('[data-ag-part="indicator"]')).toHaveAttribute('data-state', 'active');
  });
});
