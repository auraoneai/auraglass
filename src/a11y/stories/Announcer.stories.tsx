/* MAT-296: A11y/Announcer — polite + assertive buttons and a streaming demo
   (one buffered flush per interval). Assertions in the e2e
   spec read [data-ag-announcer] [aria-live] regions. */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useAnnouncer } from '../../theme/announcer/useAnnouncer';
import { AuraGlassProvider } from '../../theme/AuraGlassProvider';
import type { StoryAgParameters } from '../../contracts/testing';

function Demo() {
  const { announce, clear } = useAnnouncer();
  const [streaming, setStreaming] = React.useState(false);
  const streamRef = React.useRef<(() => void) | null>(null);
  React.useEffect(() => () => { streamRef.current?.(); }, []);

  const startStream = () => {
    if (streamRef.current) return;
    setStreaming(true);
    let count = 0;
    let buffer = '';
    let flushTimer: ReturnType<typeof setInterval> | null = null;
    const flush = () => {
      if (!buffer) return;
      announce(buffer);
      buffer = '';
    };
    // The story exercises the shipped hook; stream production and buffering
    // belong to this demo rather than importing a tree-shaken private helper.
    const producer = setInterval(() => {
      count += 1;
      buffer += `Chunk ${count} of the streamed report`;
      if (flushTimer === null) {
        flush(); // First chunk is immediate; later chunks share one interval.
        flushTimer = setInterval(flush, 1000);
      }
      if (count >= 5) {
        streamRef.current?.();
        flush(); // Preserve the final buffered tail when the stream completes.
        setStreaming(false);
      }
    }, 250);
    streamRef.current = () => {
      clearInterval(producer);
      if (flushTimer !== null) clearInterval(flushTimer);
      streamRef.current = null;
    };
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
