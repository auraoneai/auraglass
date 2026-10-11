'use client';
import * as React from 'react';
import { useAnnouncer, useResolvedPreferences } from '../../theme';

export interface StreamingTextProps {
  text: string;
  streaming?: boolean | undefined;
  /** Live-annunciation policy; complete announcements go through the MAT announcer. */
  announce?: 'complete' | 'sentences' | 'off' | undefined;
  className?: string | undefined;
}

/**
 * REQ-SURF-113: renders `text` plus a blinking caret while `streaming`.
 * React's render batching already coalesces same-frame prop updates into a
 * single commit; `memo` keeps sibling streaming text from re-rendering when
 * an unrelated message prop changes.
 */
export const StreamingText = React.memo(function StreamingText({
  text,
  streaming = false,
  announce = 'complete',
}: StreamingTextProps) {
  const { announce: speak } = useAnnouncer();
  // SURF-362 (§4.5): the text node itself is aria-live="off" — inside the
  // role="log" viewport, per-token additions would double-announce. Speech
  // goes through the MAT announcer: completed sentences, or the whole text
  // once streaming ends.
  const spoken = React.useRef(0);
  const wasStreaming = React.useRef(false);
  React.useEffect(() => {
    if (announce === 'off') return;
    if (announce === 'sentences' && streaming) {
      const done = text.slice(0, spoken.current ? Math.max(text.lastIndexOf('. ', spoken.current) + 1, 0) : 0);
      void done;
      const boundary = Math.max(text.lastIndexOf('. '), text.lastIndexOf('! '), text.lastIndexOf('? '));
      if (boundary > spoken.current) {
        speak(text.slice(spoken.current, boundary + 1).trim());
        spoken.current = boundary + 1;
      }
    }
    if (wasStreaming.current && !streaming && announce === 'complete') {
      speak(text.slice(spoken.current));
      spoken.current = text.length;
    }
    wasStreaming.current = streaming;
  }, [text, streaming, announce, speak]);
  // REQ-SURF-190: the resolved motion (min of OS floor, app, user), never
  // the raw setting, which can be 'system' or above the reduced-motion floor.
  const { motion } = useResolvedPreferences();
  return (
    <span data-ag-part="streaming-text" data-state={streaming ? 'streaming' : 'done'} data-announce={announce}>
      <span data-ag-part="text" aria-live="off">{text}</span>
      {streaming ? <span data-ag-part="caret" data-motion={motion} aria-hidden="true" /> : null}
    </span>
  );
});
