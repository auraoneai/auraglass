import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { renderToString } from 'react-dom/server';
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
});
