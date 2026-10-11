'use client';
import * as React from 'react';
import { Composer } from 'aura-glass/ai';

export interface VoiceInputActionProps {
  /** Called with the recorded audio File (built from dataavailable chunks,
   * mimeType taken from the recorder). The consumer transcribes it. */
  onFile?: ((file: File) => void) | undefined;
  disabled?: boolean | undefined;
  'aria-label'?: string | undefined;
}

type VoiceState = 'idle' | 'recording' | 'unsupported' | 'denied';

/** ai-voice-input (SURF-374, REQ-SURF-170/173): Composer.Action using a real
 * MediaRecorder. getUserMedia prompts for mic permission; the recording state
 * is announced; stop produces a File from the recorded chunks. Browsers
 * without MediaRecorder/getUserMedia get an explicit unsupported state — no
 * mock capture path. */
export function VoiceInputAction({ onFile, disabled, 'aria-label': ariaLabel = 'Voice input' }: VoiceInputActionProps) {
  const [state, setState] = React.useState<VoiceState>(() =>
    typeof navigator !== 'undefined' && 'mediaDevices' in navigator && 'MediaRecorder' in globalThis ? 'idle' : 'unsupported');
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);

  const stop = React.useCallback(() => {
    const rec = recorderRef.current;
    if (rec && rec.state !== 'inactive') rec.stop();
  }, []);

  const start = React.useCallback(async () => {
    if (state === 'unsupported') return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.addEventListener('dataavailable', (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      });
      rec.addEventListener('stop', () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType });
        onFile?.(new File([blob], 'voice-input.webm', { type: rec.mimeType }));
        setState('idle');
      }, { once: true });
      recorderRef.current = rec;
      rec.start();
      setState('recording');
    } catch {
      setState('denied');
    }
  }, [state, onFile]);

  return (
    <Composer.Action
      aria-label={ariaLabel}
      aria-pressed={state === 'recording'}
      disabled={disabled === true || state === 'unsupported'}
      data-ag-part="voice-input"
      data-state={state}
      title={state === 'unsupported' ? 'Voice input is not supported in this browser' : ariaLabel}
      onClick={state === 'recording' ? stop : () => { void start(); }}
    >
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M8 1a2 2 0 0 0-2 2v4a2 2 0 0 0 4 0V3a2 2 0 0 0-2-2Zm-5 6a5 5 0 0 0 4 4.9V14H5.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1H9v-2.1A5 5 0 0 0 13 7h-1a4 4 0 0 1-8 0Z" fill="currentColor"/></svg>
      <span data-ag-part="voice-state" aria-live="polite">
        {state === 'recording' ? 'Recording' : state === 'denied' ? 'Microphone blocked' : state === 'unsupported' ? 'Unsupported' : ''}
      </span>
    </Composer.Action>
  );
}
