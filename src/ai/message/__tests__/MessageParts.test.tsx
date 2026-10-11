import { describe, expect, it } from '@jest/globals';
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { MessageParts } from '../MessageParts';
import type { AgMessage } from '../../types';
import fixture from '../../__fixtures__/ui-messages.ai-sdk.json';

const asMessages = fixture.messages as unknown as AgMessage[];

describe('MessageParts (fixtures)', () => {
  it('renders text/source/file/step-start parts and emits one SourceList after the last text part', () => {
    const withSources = asMessages.find((m) => m.parts.some((p) => p.type === 'source-url'))!;
    const { container } = render(<MessageParts message={withSources} />);
    expect(container.querySelector('[data-ag-part="text-part"]')).not.toBeNull();
    const lists = container.querySelectorAll('[data-ag-part="source-list"]');
    expect(lists.length).toBe(1);
  });

  it('escapes text (no HTML injection)', () => {
    const msg: AgMessage = { id: 'x', role: 'assistant', parts: [{ type: 'text', text: '<img src=x onerror=alert(1)>' }] };
    const { container } = render(<MessageParts message={msg} />);
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('renders file parts: image thumbnail vs attachment chip', () => {
    const msg: AgMessage = {
      id: 'f1', role: 'user',
      parts: [
        { type: 'file', mediaType: 'image/png', url: 'blob:img', filename: 'shot.png' },
        { type: 'file', mediaType: 'application/pdf', url: 'blob:doc', filename: 'spec.pdf' },
      ],
    };
    const { container } = render(<MessageParts message={msg} />);
    expect(container.querySelector('img[alt="shot.png"]')).not.toBeNull();
    expect(container.querySelector('[data-media-type="application/pdf"]')).not.toBeNull();
  });

  it('error status renders compact ProviderErrorState; aborted renders Stopped', () => {
    const err: AgMessage = { id: 'e', role: 'assistant', parts: [], metadata: { status: 'error' } };
    const { container } = render(<MessageParts message={err} />);
    expect(container.querySelector('[data-ag-part="provider-error"]')).not.toBeNull();
    const ab: AgMessage = { id: 'a', role: 'assistant', parts: [], metadata: { status: 'aborted' } };
    const r2 = render(<MessageParts message={ab} />);
    expect(r2.container.textContent).toContain('Stopped');
  });

  it('data-* parts render only via a named renderer', () => {
    const msg: AgMessage = { id: 'd', role: 'assistant', parts: [{ type: 'data-foo', data: { a: 1 } }] };
    const { container, rerender } = render(<MessageParts message={msg} />);
    expect(container.querySelector('[data-ag-part]')).toBeNull();
    rerender(<MessageParts message={msg} renderers={{ 'data-foo': () => <b data-ag-part="data-foo">FOO</b> }} />);
    expect(container.querySelector('[data-ag-part="data-foo"]')).not.toBeNull();
  });

  it('showSteps renders role=separator for step-start parts', () => {
    const msg: AgMessage = { id: 's', role: 'assistant', parts: [{ type: 'text', text: 'a' }, { type: 'step-start' }, { type: 'text', text: 'b' }] };
    const { container } = render(<MessageParts message={msg} showSteps />);
    expect(container.querySelector('[role="separator"]')).not.toBeNull();
  });
});
