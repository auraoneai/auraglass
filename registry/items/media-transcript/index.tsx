'use client';
import * as React from 'react';
import { formatMediaTime, type MediaHandle } from 'aura-glass/media';
import { useResolvedPreferences } from 'aura-glass/theme';

export interface TranscriptCue {
  /** Cue start time in seconds. */
  start: number;
  /** Cue end time in seconds (exclusive). */
  end: number;
  text: string;
  speaker?: string;
}

export interface MediaTranscriptProps {
  /** The cues, or a live TextTrack whose `cues` list is read (and re-read on
   *  `cuechange`) as {start,end,text}. */
  cues: readonly TranscriptCue[] | TextTrack;
  /** A live MediaHandle — renders the active cue with aria-current and
   * click-to-seek. Without it the list is static. */
  media?: MediaHandle;
  label?: string;
}

const isTrack = (c: readonly TranscriptCue[] | TextTrack): c is TextTrack => !Array.isArray(c);

/** TextTrackCueList -> TranscriptCue[] (VTTCue carries `text`; a generic cue has none). */
export function cuesFromTrack(track: TextTrack): TranscriptCue[] {
  const list = track.cues;
  if (list === null) return [];
  const out: TranscriptCue[] = [];
  for (let i = 0; i < list.length; i++) {
    const c = list[i] as TextTrackCue & { text?: string };
    out.push({ start: c.startTime, end: c.endTime, text: c.text ?? '' });
  }
  return out;
}

/** media-transcript (SURF-512, REQ-SURF-175; lands public in 5.1): cues as an
 * <ol>; the current cue carries aria-current="true"; clicking a cue seeks the
 * media. When the active cue changes it is scrolled into view
 * (block: 'nearest') — only while the pointer is not over the list, focus is
 * not inside it, and the resolved motion preference is 'full'. */
export function MediaTranscript({ cues, media, label = 'Transcript' }: MediaTranscriptProps) {
  const track = isTrack(cues) ? cues : null;
  const [trackTick, bump] = React.useReducer((n: number) => n + 1, 0);
  React.useEffect(() => {
    if (track === null) return undefined;
    track.addEventListener('cuechange', bump);
    return () => track.removeEventListener('cuechange', bump);
  }, [track]);
  const list = React.useMemo(
    () => (isTrack(cues) ? cuesFromTrack(cues) : cues),
    // trackTick re-reads a live TextTrack's cue list after cuechange.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cues, trackTick],
  );

  const now = media?.state.currentTime ?? 0;
  const active = media ? list.findIndex((c) => now >= c.start && now < c.end) : -1;

  const { motion } = useResolvedPreferences();
  const [hovered, setHovered] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const activeRef = React.useRef<HTMLLIElement | null>(null);
  const lastActive = React.useRef(active);
  React.useEffect(() => {
    if (active === lastActive.current) return;
    lastActive.current = active;
    if (active < 0 || hovered || focusWithin || motion !== 'full') return;
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [active, hovered, focusWithin, motion]);

  return (
    <ol data-ag-part="media-transcript" aria-label={label} style={{ listStyle: 'none', margin: 0, padding: 0 }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false); }}>
      {list.map((c, i) => (
        <li key={`${c.start}-${i}`} ref={i === active ? activeRef : undefined}
          aria-current={i === active ? 'true' : undefined} data-active={i === active || undefined}>
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
