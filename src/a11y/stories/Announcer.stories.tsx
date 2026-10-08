/* MAT-296: A11y/Announcer — polite + assertive buttons and a streaming demo
   (createStreamingAnnouncer, one flush per interval). Assertions in the e2e
   spec read [data-ag-announcer] [aria-live] regions. */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAnnouncer, createStreamingAnnouncer } from '../../theme/announcer/useAnnouncer';
import { AuraGlassProvider } from '../../theme/AuraGlassProvider';
import type { StoryAgParameters } from '../../contracts/testing';

function Demo() {
  const { announce, clear } = useAnnouncer();
  const [streaming, setStreaming] = React.useState(false);
  const streamRef = React.useRef<{ stop(): void } | null>(null);
  const n = React.useRef(0);

  const startStream = () => {
    if (streaming) return;
    setStreaming(true);
    const s = createStreamingAnnouncer((m) => announce(m), { intervalMs: 1000 });
    streamRef.current = s;
    const iv = setInterval(() => {
      n.current += 1;
      s.push(`Chunk ${n.current} of the streamed report`);
      if (n.current >= 5) {
        clearInterval(iv);
        s.stop();
        setStreaming(false);
      }
    }, 250);
  };

  return (
    <div data-ag-surface="" data-ag-variant="regular" style={{ padding: 16 }}>
      <button type="button" data-ag-part="announce-polite"
        onClick={() => announce('Saved politely')}>Announce polite</button>{' '}
      <button type="button" data-ag-part="announce-assertive"
        onClick={() => announce('Interrupted assertively', { politeness: 'assertive' })}>
        Announce assertive
      </button>{' '}
      <button type="button" data-ag-part="announce-stream" onClick={startStream} disabled={streaming}>
        Stream 5 chunks
      </button>{' '}
      <button type="button" data-ag-part="announce-clear" onClick={clear}>Clear</button>
    </div>
  );
}

const meta: Meta = {
  title: 'A11y/Announcer',
  component: Demo,
  decorators: [(Story) => <AuraGlassProvider><Story /></AuraGlassProvider>],
  parameters: {
    ag: { subject: 'A11yAnnouncer', kind: 'component' } satisfies StoryAgParameters,
  },
};
export default meta;

export const Default: StoryObj = {};
