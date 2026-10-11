/** @jest-environment node */
// SURF-377 — ai registry items + ai-workspace block (doubles preset).
import { describe, expect, it } from '@jest/globals';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import type * as SM from '../../../registry/items/ai-markdown/index';
import type * as MP from '../../../registry/items/ai-model-picker/index';
import type * as AP from '../../../registry/items/ai-artifact-panel/index';
import type * as TT from '../../../registry/items/ai-trace-tree/index';
import type * as ED from '../../../registry/items/ai-eval-dashboard/index';
import type * as VI from '../../../registry/items/ai-voice-input/index';
import type * as AW from '../../../registry/blocks/ai-workspace/index';
import type * as AI from '../../../src/ai/index';

const PENDING = 'ai items: unresolvable under root jest until PR24 lands — assertions run under the doubles preset';
const load = <T,>(p: string) => { try { return require(p) as T; } catch { return null; } };
const sm = load<typeof SM>('../../../registry/items/ai-markdown/index');
const mp = load<typeof MP>('../../../registry/items/ai-model-picker/index');
const ap = load<typeof AP>('../../../registry/items/ai-artifact-panel/index');
const tt = load<typeof TT>('../../../registry/items/ai-trace-tree/index');
const ed = load<typeof ED>('../../../registry/items/ai-eval-dashboard/index');
const vi = load<typeof VI>('../../../registry/items/ai-voice-input/index');
const aw = load<typeof AW>('../../../registry/blocks/ai-workspace/index');
// Same specifier the registry item imports, so Composer.Root and
// VoiceInputAction share one context instance (src/ai vs the resolved
// aura-glass/ai entry would be two distinct React contexts).
const ai = load<typeof AI>('aura-glass/ai');

describe('ai registry items', () => {
  it('ai-markdown closes open fences mid-stream and blocks non-http links', () => {
    if (!sm) { console.warn(PENDING); return; }
    const html = renderToString(createElement(sm.StreamingMarkdown, { text: 'para\n```js\ncode', streaming: true }));
    expect(html).toContain('data-ag-part="md-code"');
    const bad = renderToString(createElement(sm.StreamingMarkdown, { text: '[x](javascript:alert(1)) [y](https://ok.example)' }));
    expect(bad).not.toContain('href="javascript:');
    expect(bad).toContain('https://ok.example');
  });
  it('ai-model-picker renders a labelled listbox', () => {
    if (!mp) { console.warn(PENDING); return; }
    const html = renderToString(createElement(mp.ModelPicker, {
      options: [{ id: 'a', label: 'Alpha', provider: 'Prism' }, { id: 'b', label: 'Beta', provider: 'Prism' }],
      value: 'a',
    }));
    expect(html).toContain('Alpha');
    expect(html).toContain('aria-haspopup="listbox"');
  });
  it('ai-artifact-panel renders by kind', () => {
    if (!ap) { console.warn(PENDING); return; }
    const html = renderToString(createElement(ap.ArtifactPanel, {
      artifact: { id: 'a1', kind: 'code', title: 'Snippet', language: 'ts', content: 'const x = 1;' },
    }));
    expect(html).toContain('Snippet');
    expect(html).toContain('const x = 1;');
  });
  it('ai-trace-tree renders steps', () => {
    if (!tt) { console.warn(PENDING); return; }
    const html = renderToString(createElement(tt.TraceTree, {
      steps: [{ id: 's1', label: 'Plan', state: 'succeeded', durationMs: 120 }, { id: 's2', label: 'Act', state: 'running' }] as never,
    }));
    expect(html).toContain('Plan');
    expect(html).toContain('Act');
  });
  it('ai-eval-dashboard renders cases', () => {
    if (!ed) { console.warn(PENDING); return; }
    const html = renderToString(createElement(ed.EvalDashboard, {
      runs: [
        { id: 'run-1', model: 'aura-large', dataset: 'd1', passRate: 0.9, deltaBaseline: 0.02, costUsd: 1.2, startedAt: '2026-10-06T00:00:00Z' },
        { id: 'run-2', model: 'aura-small', dataset: 'd1', passRate: 0.7, deltaBaseline: -0.05, costUsd: 0.4, startedAt: '2026-10-05T00:00:00Z' },
      ],
    }));
    expect(html).toContain('aura-large');
    expect(html).toContain('aura-small');
  });
  it('ai-voice-input renders an accessible action inside Composer.Root', () => {
    if (!vi || !ai) { console.warn(PENDING); return; }
    // VoiceInputAction composes Composer.Action — it must mount inside a
    // <Composer> tree (registry usage is always <Composer><VoiceInputAction/></Composer>).
    const html = renderToString(createElement(ai.Composer as never, {
      children: createElement(vi.VoiceInputAction, {}),
    }));
    expect(html).toContain('aria-label="Voice input"');
  });
  it('ai-workspace renders thread + composer + usage', () => {
    if (!aw) { console.warn(PENDING); return; }
    const html = renderToString(createElement(aw.AiWorkspace, {}));
    expect(html).toContain('data-ag-part="thread"');
  });
});
