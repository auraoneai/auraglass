/* REQ-QUAL-11 (REQ-FIN-106, FIN-449): stories reach their captured state without timers.
   Jest fake timers are installed and NEVER advanced; only animation frames (which StoryRoot's readiness
   needs) run. A story that reaches its state through props (`defaultOpen`, a streaming `step` arg) must
   reach its final DOM and data-ag-cert-ready; a story that opens through setTimeout must not. */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { act, cleanup, render } from '@testing-library/react';
import * as React from 'react';
import type { Decorator } from '@storybook/react-vite';
import { Dialog } from '../../src/components/dialog';
import { StreamingText } from '../../src/ai/message/StreamingText';
import { CERT_READY_ATTR } from '../../.storybook/contract/StoryRoot';

jest.mock('../../.storybook/contract/sheets', () => ({ BUILT_SHEETS: {}, SOURCE_SHEETS: {} }));
import preview from '../../.storybook/preview';

const GLOBALS = { scheme: 'light', contrast: 'standard', transparency: 'glass', motion: 'full',
  density: 'regular', tier: 'standard', scene: 'photo' };

/** Renders a story through the real preview decorator and lets up to `maxFrames` animation frames run. */
async function renderStory(Story: React.ComponentType, id: string, maxFrames = 20): Promise<HTMLElement> {
  const decorator = (preview.decorators as Decorator[])[0]!;
  render(decorator(Story as never, { id, globals: GLOBALS, parameters: { ag: { subject: id, kind: 'component' } } } as never) as React.ReactElement);
  const root = document.querySelector<HTMLElement>('[data-ag-story-content]')!;
  for (let i = 0; i < maxFrames && !root.hasAttribute(CERT_READY_ATTR); i += 1) {
    await act(async () => { await new Promise<void>((r) => { window.requestAnimationFrame(() => r()); }); });
  }
  return root;
}

const TOKENS = ['Glass ', 'adapts ', 'to ', 'the ', 'backdrop ', 'behind ', 'it.'];
function StreamingStep({ step }: { step: number }) {
  return <StreamingText text={TOKENS.slice(0, step).join('')} streaming={step < TOKENS.length} announce="off" />;
}

function OpenDialog() {
  return (
    <Dialog.Root defaultOpen>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop />
        <Dialog.Popup>
          <Dialog.Title>Delete file</Dialog.Title>
          <Dialog.Description>This cannot be undone.</Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** Anti-fixture: reaches its "open" state only through a timer. */
function TimerOpenedDialog() {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setOpen(true), 300); return () => clearTimeout(t); }, []);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Popup>
          <Dialog.Title>Delete file</Dialog.Title>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const popup = () => document.querySelector<HTMLElement>('[data-ag-part="popup"][role="dialog"]');

beforeEach(() => {
  if (window.PointerEvent === undefined) (window as unknown as Record<string, unknown>).PointerEvent = window.MouseEvent;
  jest.useFakeTimers({ doNotFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'queueMicrotask', 'nextTick', 'setImmediate'] });
});

afterEach(() => {
  cleanup();
  jest.clearAllTimers();
  jest.useRealTimers();
});

describe('deterministic stories (REQ-QUAL-11)', () => {
  it('an overlay story using defaultOpen is open and cert-ready without advancing timers', async () => {
    const root = await renderStory(OpenDialog, 'cmp-dialog--open');
    expect(popup()).not.toBeNull();
    expect(popup()!.textContent).toContain('Delete file');
    expect(root.hasAttribute(CERT_READY_ATTR)).toBe(true);
  });

  it('a StreamingText story at step=n shows exactly n tokens and is cert-ready without advancing timers', async () => {
    const Step4 = () => <StreamingStep step={4} />;
    const root = await renderStory(Step4, 'surf-ai-streamingtext--step-4');
    const text = root.querySelector('[data-ag-part="streaming-text"] [data-ag-part="text"]');
    expect(text!.textContent).toBe('Glass adapts to the ');
    expect(root.querySelector('[data-ag-part="streaming-text"]')!.getAttribute('data-state')).toBe('streaming');
    expect(root.hasAttribute(CERT_READY_ATTR)).toBe(true);
  });

  it('a StreamingText story at the final step is done without timers', async () => {
    const Done = () => <StreamingStep step={TOKENS.length} />;
    const root = await renderStory(Done, 'surf-ai-streamingtext--done');
    expect(root.querySelector('[data-ag-part="streaming-text"]')!.getAttribute('data-state')).toBe('done');
    expect(root.querySelector('[data-ag-part="caret"]')).toBeNull();
  });

  it('fails for a story that reaches its state through setTimeout', async () => {
    const root = await renderStory(TimerOpenedDialog, 'fixture--timer-open');
    expect(root.hasAttribute(CERT_READY_ATTR)).toBe(true);   // readiness does not wait on arbitrary timers…
    expect(popup()).toBeNull();                              // …so the timer-driven state is not reached
    expect(jest.getTimerCount()).toBeGreaterThan(0);         // the state sits behind a pending timer
  });
});
