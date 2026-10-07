'use client';
/* REQ-SURF-140 — live level meter: a Waveform driven by a single `level`
 * sample; transform transition --ag-duration-micro, 0 s under calm|none. */
import * as React from 'react';
import { Waveform, type WaveformProps } from './Waveform';

export function WaveformLevel(props: Omit<WaveformProps, 'peaks'> & { level: number }): React.ReactElement {
  return <Waveform {...props} level={props.level} bars={8} />;
}
