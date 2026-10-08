'use client';
import * as React from 'react';
import { formatMediaTime, type MediaHandle } from 'aura-glass/media';

export interface TranscriptCue {
  /** Cue start time in seconds. */
  start: number;
  end?: number;
  text: string;
  speaker?: string;
}

export interface MediaTranscriptProps {
  cues: TranscriptCue[];
  /** A live MediaHandle — renders the active cue with aria-current and
   * click-to-seek. Without it the list is static. */
  media?: MediaHandle;
  label?: string;
}

/** media-transcript (SURF-512, lands public in 5.1): cues as an <ol>; the
 * current cue carries aria-current="true"; clicking a cue seeks the media. */
export function MediaTranscript({ cues, media, label = 'Transcript' }: MediaTranscriptProps) {
  const now = media?.state.currentTime ?? 0;
  const active = media ? cues.findIndex((c) => now >= c.start && (c.end == null || now < c.end)) : -1;
  return (
    <ol data-ag-part="media-transcript" aria-label={label} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {cues.map((c, i) => (
        <li key={i} aria-current={i === active ? 'true' : undefined} data-active={i === active || undefined}>
          <button type="button" disabled={!media}
            onClick={() => media?.seek(c.start)}
            style={{ background: 'none', border: 0, padding: '0.25rem 0.5rem', textAlign: 'start', cursor: media ? 'pointer' : 'default' }}>
            <time dateTime={`PT${c.start}S`}>{formatMediaTime(c.start)}</time>{' '}
            {c.speaker ? <strong>{c.speaker}: </strong> : null}
            {c.text}
          </button>
        </li>
      ))}
    </ol>
  );
}
