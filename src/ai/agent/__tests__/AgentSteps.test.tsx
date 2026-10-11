import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToString } from 'react-dom/server';
import postcss, { type AtRule, type Rule } from 'postcss';
import { AgentSteps } from '../AgentSteps';
import type { AgStep } from '../../types';

const steps: AgStep[] = [
  { id: 's1', label: 'Plan', state: 'succeeded', startedAt: 0, endedAt: 4200 },
  { id: 's2', label: 'Search', state: 'running', detail: 'runbooks' },
  { id: 's3', label: 'Escalate', state: 'skipped', children: [{ id: 's3a', label: 'Page oncall', state: 'skipped' }] },
];

describe('AgentSteps', () => {
  it('renders an ordered list with aria-current on the running step (server render)', () => {
    const html = renderToString(<AgentSteps steps={steps} />);
    expect(html).toContain('data-ag-part="agent-steps"');
    expect(html).toContain('aria-current="step"');
    expect(html).toContain('4.2 s');
    expect(html).toContain('Skipped');
    expect(html.match(/<ol/g)!.length).toBe(2);
  });

  it('renderToString contains one state svg per step inside its step-icon', () => {
    const flat: AgStep[] = [
      { id: 'a', label: 'Plan', state: 'succeeded' },
      { id: 'b', label: 'Search', state: 'running' },
      { id: 'c', label: 'Deploy', state: 'failed' },
    ];
    const html = renderToString(<AgentSteps steps={flat} />);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const icons = [...doc.querySelectorAll('[data-ag-part="step"] > [data-ag-part="step-icon"] > svg')];
    expect(icons).toHaveLength(3);
    expect(icons.map((s) => s.getAttribute('data-ag-icon'))).toEqual(['succeeded', 'running', 'failed']);
    for (const s of icons) expect(s.getAttribute('aria-hidden')).toBe('true');
    // Icon + text: the state text stays next to every icon.
    expect([...doc.querySelectorAll('[data-ag-part="step-state"]')].map((n) => n.textContent)).toEqual(['Done', 'Running', 'Failed']);
  });

  it('nested steps get their own icons (4 svgs for the 3+1 tree)', () => {
    const html = renderToString(<AgentSteps steps={steps} />);
    expect(html.match(/<svg/g)!.length).toBe(4);
  });

  it('ai.css: CSS-only running atom on the step icon, static under reduced motion and calm/none motion', () => {
    const root = postcss.parse(readFileSync(join(__dirname, '..', '..', 'ai.css'), 'utf8'));
    const atom = '[data-ag-part="step"][data-state="running"] [data-ag-part="step-icon"]::after';
    const animated: Rule[] = [];
    const stilled: Array<{ rule: Rule; media: string | null }> = [];
    root.walkRules((rule) => {
      const sels = rule.selectors.map((x) => x.replace(/\s+/g, ' ').trim());
      const media = rule.parent?.type === 'atrule' && (rule.parent as AtRule).name === 'media' ? (rule.parent as AtRule).params : null;
      const hasAnim = rule.nodes.some((d) => d.type === 'decl' && d.prop === 'animation' && d.value !== 'none');
      const stops = rule.nodes.some((d) => d.type === 'decl' && d.prop === 'animation' && d.value === 'none');
      if (sels.includes(atom) && hasAnim && media === null) animated.push(rule);
      if (stops && sels.some((x) => x.includes('[data-ag-part="step-icon"]::after'))) {
        stilled.push({ rule, media });
      }
    });
    expect(animated).toHaveLength(1);
    expect(stilled.some((s) => s.media === '(prefers-reduced-motion: reduce)')).toBe(true);
    const motionSels = stilled.flatMap((s) => s.rule.selectors);
    expect(motionSels.some((x) => x.includes("[data-ag-motion='calm']") || x.includes('[data-ag-motion="calm"]'))).toBe(true);
    expect(motionSels.some((x) => x.includes("[data-ag-motion='none']") || x.includes('[data-ag-motion="none"]'))).toBe(true);
  });
});
