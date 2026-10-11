/* REQ-SURF-116 / REQ-SURF-119: parses src/ai/ai.css with the jsdom CSSOM and
   matches its composer rules against the DOM the Composer actually renders,
   so a renamed part (the old `input` vs `textarea` drift) fails here. */
import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { AuraGlassProvider } from '../../../theme';
import { Composer } from '../Composer';

interface Decl { selector: string; prop: string; value: string; container: string | null }

function loadDecls(): Decl[] {
  const style = document.createElement('style');
  style.textContent = readFileSync(join(__dirname, '..', '..', 'ai.css'), 'utf8');
  document.head.appendChild(style);
  const out: Decl[] = [];
  const walk = (rules: CSSRuleList, container: string | null) => {
    for (const r of Array.from(rules)) {
      if (r instanceof CSSStyleRule) {
        for (let i = 0; i < r.style.length; i++) {
          const prop = (r.style as unknown as Record<number, string>)[i]!;
          out.push({ selector: r.selectorText, prop, value: r.style.getPropertyValue(prop).trim(), container });
        }
      } else if (r.constructor.name === 'CSSContainerRule') {
        // jsdom's CSSOM: the condition is the prelude of the rule text.
        walk((r as CSSGroupingRule).cssRules, r.cssText.slice(0, r.cssText.indexOf('{')));
      } else if (r instanceof CSSMediaRule) {
        // media-gated rules (pointer: coarse) are not part of these assertions
      } else if ('cssRules' in r) {
        walk((r as CSSGroupingRule).cssRules, container);
      }
    }
  };
  walk(style.sheet!.cssRules, null);
  style.remove();
  return out;
}

const decls = loadDecls();
const narrow = (c: string | null) => c !== null && /max-width:\s*480px/.test(c);

/** Last matching declaration of `prop` for `el` in the given context. */
function winning(el: Element, prop: string, ctx: 'wide' | 'narrow'): string | undefined {
  let value: string | undefined;
  for (const d of decls) {
    if (d.prop !== prop) continue;
    if (d.container !== null && !(ctx === 'narrow' && narrow(d.container))) continue;
    if (el.matches(d.selector)) value = d.value;
  }
  return value;
}

function renderFull() {
  render(
    <AuraGlassProvider>
      <Composer maxLength={100}>
        <Composer.Textarea maxRows={6} />
        <Composer.Counter />
        <Composer.Actions>
          <Composer.Action kind="attach" icon="attach" />
          <Composer.Submit />
        </Composer.Actions>
      </Composer>
    </AuraGlassProvider>,
  );
  const q = (part: string) => document.querySelector(`[data-ag-part="${part}"]`)!;
  return { textarea: q('textarea'), action: q('action'), submit: q('submit'), menu: q('composer-menu') };
}

describe('ai.css composer rules (REQ-SURF-116, REQ-SURF-119)', () => {
  it('the rendered textarea gets field-sizing: content and a maxRows-driven max-block-size', () => {
    const { textarea } = renderFull();
    expect(winning(textarea, 'field-sizing', 'wide')).toBe('content');
    expect(winning(textarea, 'max-block-size', 'wide')).toMatch(/calc\(var\(--_ag-composer-max-rows[^)]*\)\s*\*\s*1lh\)/);
    expect((textarea as HTMLElement).style.getPropertyValue('--_ag-composer-max-rows')).toBe('6');
    expect(winning(textarea, 'max-block-size', 'narrow')).toMatch(/^min\(5lh/);
  });

  it('below 480 px only secondary actions hide; Submit stays and the menu appears', () => {
    const { action, submit, menu } = renderFull();
    expect(menu).not.toBeNull();
    expect(winning(menu, 'display', 'wide')).toBe('none');
    expect(winning(action, 'display', 'wide')).toBeUndefined();
    expect(winning(action, 'display', 'narrow')).toBe('none');
    expect(winning(menu, 'display', 'narrow')).toBe('inline-flex');
    expect(winning(submit, 'display', 'narrow')).toBeUndefined();
  });

  it('Stop also stays visible below 480 px', () => {
    render(<Composer status="streaming"><Composer.Actions><Composer.Submit /></Composer.Actions></Composer>);
    const stop = document.querySelector('[data-ag-part="stop"]')!;
    expect(winning(stop, 'display', 'narrow')).toBeUndefined();
  });

  it('composer padding uses env(keyboard-inset-height) with the visualViewport fallback var', () => {
    renderFull();
    const form = document.querySelector('[data-ag-part="composer"]')!;
    const pad = winning(form, 'padding-block-end', 'wide') ?? '';
    expect(pad).toContain('env(keyboard-inset-height, 0px)');
    expect(pad).toContain('var(--_ag-ai-keyboard-inset, 0px)');
  });
});
