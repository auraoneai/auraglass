/* GlassKeyValueEditor — 4.x compat adapter (REQ-SURF-13, DEP-S0219) →
   KeyValueEditor. The 4.x API was controlled: value: {key,value}[] +
   onChange(pairs) — mapped 1:1 onto value/onValueChange. A record-shaped
   `entries`/`pairs` object is also accepted. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { KeyValueEditor } from '../../../data/key-value-editor';

export interface Pair {
  key: string;
  value: string;
}

export interface GlassKeyValueEditorProps {
  value?: Pair[];
  entries?: Record<string, string>;
  pairs?: Record<string, string>;
  onChange?: (pairs: Pair[]) => void;
  className?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassKeyValueEditor` compat adapter (DEP-S0219).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link KeyValueEditor from aura-glass/data}.
 */
export function GlassKeyValueEditor(props: GlassKeyValueEditorProps) {
  warnDeprecated('DEP-S0219');
  const { value, entries, pairs, onChange, className } = props;
  const record = entries ?? pairs;
  const list = value ?? (record ? Object.entries(record).map(([key, v]) => ({ key, value: v })) : []);
  return (
    <KeyValueEditor
      {...(onChange ? { value: list, onValueChange: (next: Pair[]) => onChange(next) } : { defaultValue: list })}
      {...(className ? { className } : {})}
    />
  );
}
