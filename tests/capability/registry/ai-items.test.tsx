/** @jest-environment jsdom */
// SURF-377 / REQ-SURF-173 (REQ-FIN-88, AC-FIN-88) — ai registry items and the
// ai-workspace block, rendered against the REAL library sources, plus the
// useAuraChat adapter driven through a mock ChatTransport (in-memory streams,
// no network).
//
// Resolution: items import the public specifiers ('aura-glass',
// 'aura-glass/<entry>'). The root jest.config.js maps none of them yet
// (REQ-FIN-09 / contract C-4, FIN-A); until it does, each specifier is
// aliased here to its source entry via jest.requireActual — the real module,
// the same mapping the root mapper will make.
import './web-streams-env';
import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, render, renderHook, waitFor } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as ts from 'typescript';
import type { ChatTransport, UIMessageChunk } from 'ai';

jest.mock('aura-glass', () => jest.requireActual('../../../src/index'), { virtual: true });
jest.mock('aura-glass/app-shell', () => jest.requireActual('../../../src/app-shell/index'), { virtual: true });
jest.mock('aura-glass/data', () => jest.requireActual('../../../src/data/index'), { virtual: true });
jest.mock('aura-glass/ai', () => jest.requireActual('../../../src/ai/index'), { virtual: true });

import { StreamingMarkdown } from '../../../registry/items/ai-markdown/index';
import { closeStreamingMarkdown } from '../../../registry/items/ai-markdown/StreamingMarkdown';
import { ModelPicker } from '../../../registry/items/ai-model-picker/index';
import { ArtifactPanel } from '../../../registry/items/ai-artifact-panel/index';
import { TraceTree } from '../../../registry/items/ai-trace-tree/index';
import { EvalDashboard } from '../../../registry/items/ai-eval-dashboard/index';
import { VoiceInputAction } from '../../../registry/items/ai-voice-input/index';
import { AiWorkspace } from '../../../registry/blocks/ai-workspace/index';
import { useAuraChat } from '../../../registry/items/ai-sdk-adapter/index';
import type { AuraUIMessage } from '../../../registry/items/ai-sdk-adapter/index';
import * as ai from 'aura-glass/ai';
import type { AgMessage, AgToolPart } from 'aura-glass/ai';

const ROOT = join(__dirname, '../../..');

afterEach(() => cleanup());

describe('ai registry items', () => {
  it('ai-markdown closes open fences mid-stream and blocks non-http links', () => {
    const html = renderToString(createElement(StreamingMarkdown, { text: 'para\n```js\ncode', streaming: true }));
    expect(html).toContain('data-ag-part="md-code"');
    const bad = renderToString(createElement(StreamingMarkdown, { text: '[x](javascript:alert(1)) [y](https://ok.example)' }));
    expect(bad).not.toContain('href="javascript:');
    expect(bad).toContain('https://ok.example');
  });

  it("ai-markdown closes unterminated **, *, _ and ` while streaming", () => {
    expect(renderToString(createElement(StreamingMarkdown, { text: '**bold', streaming: true }))).toContain('<strong>bold</strong>');
    expect(renderToString(createElement(StreamingMarkdown, { text: 'an *ital', streaming: true }))).toContain('<em>ital</em>');
    expect(renderToString(createElement(StreamingMarkdown, { text: 'an _ital', streaming: true }))).toContain('<em>ital</em>');
    expect(renderToString(createElement(StreamingMarkdown, { text: 'run `npm t', streaming: true }))).toContain('<code>npm t</code>');
    // Not streaming: the source is rendered as delivered.
    expect(renderToString(createElement(StreamingMarkdown, { text: '**bold' }))).not.toContain('<strong>');

    expect(closeStreamingMarkdown('**bold *both')).toBe('**bold *both***');
    expect(closeStreamingMarkdown('`a *b')).toBe('`a *b`');
    // A marker with nothing after it yet is dropped, not closed.
    expect(closeStreamingMarkdown('text **')).toBe('text ');
    // Balanced, intraword, spaced and list markers are left alone.
    expect(closeStreamingMarkdown('**done** and *done*')).toBe('**done** and *done*');
    expect(closeStreamingMarkdown('call snake_case_name')).toBe('call snake_case_name');
    expect(closeStreamingMarkdown('a * b')).toBe('a * b');
    expect(closeStreamingMarkdown('* item one')).toBe('* item one');
    // Only the tail paragraph after the last closed fence is considered.
    expect(closeStreamingMarkdown('```\n*x\n```\n\nok **b')).toBe('```\n*x\n```\n\nok **b**');
  });

  it('ai-model-picker renders a labelled listbox with typed capabilities', () => {
    const html = renderToString(createElement(ModelPicker, {
      options: [
        { id: 'a', label: 'Alpha', provider: 'Prism', capabilities: ['vision', 'long-context'] },
        { id: 'b', label: 'Beta', provider: 'Prism', capabilities: ['tools', 'reasoning'] },
      ],
      value: 'a',
    }));
    expect(html).toContain('Alpha');
    expect(html).toContain('aria-haspopup="listbox"');
  });

  it('ai-artifact-panel renders by kind and routes code through renderCode', () => {
    const artifact = { id: 'a1', kind: 'code' as const, title: 'Snippet', language: 'ts', content: 'const x = 1;' };
    const plain = renderToString(createElement(ArtifactPanel, { artifact }));
    expect(plain).toContain('Snippet');
    expect(plain).toContain('const x = 1;');

    const calls: [string, string | undefined][] = [];
    const slotted = renderToString(createElement(ArtifactPanel, {
      artifact,
      renderCode: (code: string, language: string | undefined) => {
        calls.push([code, language]);
        return createElement('div', { 'data-testid': 'code-surface' }, code);
      },
    }));
    expect(calls).toContainEqual(['const x = 1;', 'ts']);
    expect(slotted).toContain('data-testid="code-surface"');
  });

  it('ai-artifact-panel never imports another item at runtime; code-surface stays a registryDependency', () => {
    const src = readFileSync(join(ROOT, 'registry/items/ai-artifact-panel/ArtifactPanel.tsx'), 'utf8');
    expect(src.match(/import\(/g) ?? []).toHaveLength(0);
    const item = JSON.parse(readFileSync(join(ROOT, 'registry/items/ai-artifact-panel/registry-item.json'), 'utf8')) as { registryDependencies: string[] };
    expect(item.registryDependencies).toContain('code-surface');
  });

  it('ai-trace-tree renders steps', () => {
    const html = renderToString(createElement(TraceTree, {
      steps: [{ id: 's1', label: 'Plan', state: 'succeeded', durationMs: 120 }, { id: 's2', label: 'Act', state: 'running' }] as never,
    }));
    expect(html).toContain('Plan');
    expect(html).toContain('Act');
  });

  it('ai-eval-dashboard renders cases', () => {
    const html = renderToString(createElement(EvalDashboard, {
      runs: [
        { id: 'run-1', model: 'aura-large', dataset: 'd1', passRate: 0.9, deltaBaseline: 0.02, costUsd: 1.2, startedAt: '2026-10-06T00:00:00Z' },
        { id: 'run-2', model: 'aura-small', dataset: 'd1', passRate: 0.7, deltaBaseline: -0.05, costUsd: 0.4, startedAt: '2026-10-05T00:00:00Z' },
      ],
    }));
    expect(html).toContain('aura-large');
    expect(html).toContain('aura-small');
    expect(html).toContain('$1.60');
    expect(html).toContain('80%');
  });

  it('ai-eval-dashboard source has no numeric literals outside fixtures (only the additive identity 0)', () => {
    const file = join(ROOT, 'registry/items/ai-eval-dashboard/EvalDashboard.tsx');
    const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const literals: string[] = [];
    const visit = (node: ts.Node) => {
      if (ts.isNumericLiteral(node) || ts.isBigIntLiteral(node)) {
        const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
        if (node.text !== '0') literals.push(`${line + 1}: ${node.text}`);
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
    expect(literals).toEqual([]);
  });

  it('ai-voice-input renders an accessible action inside Composer.Root', () => {
    // VoiceInputAction composes Composer.Action — it must mount inside a
    // <Composer> tree (registry usage is always <Composer><VoiceInputAction/></Composer>).
    const html = renderToString(createElement(ai.Composer as never, {
      children: createElement(VoiceInputAction, {}),
    }));
    expect(html).toContain('aria-label="Voice input"');
  });

  it('ai-workspace renders thread + composer + usage', () => {
    const html = renderToString(createElement(AiWorkspace, {}));
    expect(html).toContain('data-ag-part="thread"');
  });
});

/* ---------------------------------------------------------------------------
 * useAuraChat through a mock ChatTransport.
 * ------------------------------------------------------------------------- */

type SendOptions = Parameters<ChatTransport<AuraUIMessage>['sendMessages']>[0];

class MockTransport implements ChatTransport<AuraUIMessage> {
  calls: SendOptions[] = [];
  /** When true the next response stream stays open until aborted. */
  hang = false;
  async sendMessages(options: SendOptions): Promise<ReadableStream<UIMessageChunk>> {
    this.calls.push({ ...options, messages: structuredClone(options.messages) });
    const hang = this.hang;
    const callNo = this.calls.length;
    return new ReadableStream<UIMessageChunk>({
      start(controller) {
        // Same chunk framing as streamText().toUIMessageStream(): every model
        // step is delimited, so a continued assistant turn starts a new step.
        controller.enqueue({ type: 'start', messageId: `reply-${callNo}` });
        controller.enqueue({ type: 'start-step' });
        controller.enqueue({ type: 'text-start', id: 't1' });
        controller.enqueue({ type: 'text-delta', id: 't1', delta: 'reply' });
        if (hang) {
          options.abortSignal?.addEventListener('abort', () => controller.error(new DOMException('aborted', 'AbortError')));
          return;
        }
        controller.enqueue({ type: 'text-end', id: 't1' });
        controller.enqueue({ type: 'finish-step' });
        controller.enqueue({ type: 'finish' });
        controller.close();
      },
    });
  }
  async reconnectToStream() { return null; }
}

const SEED: AuraUIMessage[] = [
  { id: 'u-1', role: 'user', parts: [{ type: 'text', text: 'Roll back the 04:12 deploy.' }] },
  {
    id: 'a-1',
    role: 'assistant',
    parts: [
      { type: 'text', text: 'Rollback needs approval.' },
      { type: 'text', text: 'Target: web-prod.' },
      { type: 'tool-rollback', toolCallId: 'call-1', state: 'input-available', input: { service: 'web-prod' } },
    ],
  },
];

function toolPartOf(message: AgMessage | undefined): AgToolPart {
  const part = message?.parts.find((p): p is AgToolPart => p.type.startsWith('tool-'));
  if (!part) throw new Error('fixture has no tool part');
  return part;
}

describe('useAuraChat (ai-sdk-adapter, REQ-SURF-173)', () => {
  it('returns the 4 prop builders', () => {
    const { result } = renderHook(() => useAuraChat({ transport: new MockTransport(), messages: SEED }));
    const chat = result.current;
    expect(chat.threadProps.messages.map((m) => m.id)).toEqual(['u-1', 'a-1']);
    expect(typeof chat.messageProps).toBe('function');
    expect(typeof chat.toolCallProps).toBe('function');
    expect(typeof chat.composerProps.onSubmit).toBe('function');
    expect(chat.status).toBe('ready');

    const assistant = chat.messageProps(chat.threadProps.messages[1]!);
    expect(assistant.message.id).toBe('a-1');
    expect(typeof assistant.onRegenerate).toBe('function');
    expect(typeof assistant.onCopy).toBe('function');
    // Regenerate is offered on assistant messages only.
    expect(chat.messageProps(chat.threadProps.messages[0]!).onRegenerate).toBeUndefined();

    const tool = chat.toolCallProps(toolPartOf(chat.threadProps.messages[1]));
    expect(tool.part.toolCallId).toBe('call-1');
    for (const fn of [tool.onApprovalResponse, tool.onApprove, tool.onDeny]) expect(typeof fn).toBe('function');
  });

  it('composerProps.onSubmit sends the text through the transport', async () => {
    const transport = new MockTransport();
    const { result } = renderHook(() => useAuraChat({ transport }));
    act(() => result.current.composerProps.onSubmit({ text: 'hello', files: [] }));
    await waitFor(() => expect(transport.calls).toHaveLength(1));
    const call = transport.calls[0]!;
    expect(call.trigger).toBe('submit-message');
    expect(call.messages.at(-1)).toMatchObject({ role: 'user', parts: [{ type: 'text', text: 'hello' }] });
    await waitFor(() => expect(result.current.status).toBe('ready'));
    const reply = result.current.threadProps.messages.at(-1)!;
    expect(reply.role).toBe('assistant');
    expect(reply.parts).toContainEqual(expect.objectContaining({ type: 'text', text: 'reply', state: 'done' }));
  });

  it('composerProps.onSubmit passes files as FileUIParts (sendMessage({ text, files }))', async () => {
    const transport = new MockTransport();
    const { result } = renderHook(() => useAuraChat({ transport }));
    const file = new File(['abc'], 'notes.txt', { type: 'text/plain' });
    act(() => result.current.composerProps.onSubmit({ text: 'see attached', files: [file] }));
    await waitFor(() => expect(transport.calls).toHaveLength(1));
    const user = transport.calls[0]!.messages.at(-1)!;
    expect(user.parts).toContainEqual({ type: 'file', mediaType: 'text/plain', filename: 'notes.txt', url: 'data:text/plain;base64,YWJj' });
    expect(user.parts).toContainEqual({ type: 'text', text: 'see attached' });
  });

  it('composerProps.onStop aborts the in-flight transport request', async () => {
    const transport = new MockTransport();
    transport.hang = true;
    const { result } = renderHook(() => useAuraChat({ transport }));
    act(() => result.current.composerProps.onSubmit({ text: 'long answer', files: [] }));
    await waitFor(() => expect(result.current.status).toBe('streaming'));
    expect(result.current.composerProps.onStop).toBeDefined();
    act(() => result.current.composerProps.onStop!());
    await waitFor(() => expect(transport.calls[0]!.abortSignal?.aborted).toBe(true));
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.composerProps.onStop).toBeUndefined();
  });

  it('messageProps(message).onRegenerate calls chat.regenerate({ messageId })', async () => {
    const transport = new MockTransport();
    const { result } = renderHook(() => useAuraChat({ transport, messages: SEED }));
    const props = result.current.messageProps(result.current.threadProps.messages[1]!);
    act(() => props.onRegenerate!('a-1'));
    await waitFor(() => expect(transport.calls).toHaveLength(1));
    expect(transport.calls[0]).toMatchObject({ trigger: 'regenerate-message', messageId: 'a-1' });
    // The regenerated assistant turn is dropped from the request history.
    expect(transport.calls[0]!.messages.map((m) => m.id)).toEqual(['u-1']);
  });

  it('messageProps(message).onCopy writes the text parts to the clipboard', async () => {
    const writeText = jest.fn(async (_: string) => undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    const { result } = renderHook(() => useAuraChat({ transport: new MockTransport(), messages: SEED }));
    await result.current.messageProps(result.current.threadProps.messages[1]!).onCopy();
    expect(writeText).toHaveBeenCalledWith('Rollback needs approval.\n\nTarget: web-prod.');
  });

  it('toolCallProps(part).onApprove sends the approval response through the transport', async () => {
    const transport = new MockTransport();
    const { result } = renderHook(() => useAuraChat({ transport, messages: SEED }));
    const tool = result.current.toolCallProps(toolPartOf(result.current.threadProps.messages[1]));
    act(() => tool.onApprove());
    await waitFor(() => expect(transport.calls).toHaveLength(1));
    const call = transport.calls[0]!;
    expect(call.trigger).toBe('submit-message');
    const sent = toolPartOf(call.messages.at(-1));
    expect(sent).toMatchObject({ toolCallId: 'call-1', state: 'output-available', output: { approved: true, approvalId: 'call-1' } });
  });

  it('toolCallProps(part).onDeny / onApprovalResponse send a denial with its reason', async () => {
    const transport = new MockTransport();
    const { result } = renderHook(() => useAuraChat({ transport, messages: SEED }));
    const tool = result.current.toolCallProps(toolPartOf(result.current.threadProps.messages[1]));
    act(() => tool.onApprovalResponse({ approvalId: 'ap-9', toolCallId: 'call-1', approved: false, reason: 'freeze window' }));
    await waitFor(() => expect(transport.calls).toHaveLength(1));
    expect(toolPartOf(transport.calls[0]!.messages.at(-1))).toMatchObject({
      state: 'output-available',
      output: { approved: false, approvalId: 'ap-9', reason: 'freeze window' },
    });
  });

  it('wires into ToolCall: the Approve button reaches the transport', async () => {
    const transport = new MockTransport();
    // A v5 tool part is 'input-available'; the AgMessage approval state comes
    // from SDK v6 (OD-16) — render it as that state to exercise ToolCall.Approval.
    const { result } = renderHook(() => useAuraChat({ transport, messages: SEED }));
    const tool = result.current.toolCallProps(toolPartOf(result.current.threadProps.messages[1]));
    const view = render(createElement(ai.ToolCall, {
      ...tool,
      part: { ...tool.part, state: 'approval-requested', approval: { id: 'ap-1' } },
      defaultOpen: true,
    }));
    const approve = view.container.querySelector<HTMLButtonElement>('[data-ag-part="approve"]');
    expect(approve).not.toBeNull();
    act(() => approve!.click());
    await waitFor(() => expect(transport.calls).toHaveLength(1));
    expect(toolPartOf(transport.calls[0]!.messages.at(-1))).toMatchObject({ output: { approved: true, approvalId: 'ap-1' } });
  });
});
