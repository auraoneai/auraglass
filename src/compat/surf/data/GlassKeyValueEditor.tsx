'use client';
import { warnDeprecated } from '../../../internal';
import { KeyValueEditor } from '../../../data/key-value-editor';
import type { KeyValueEditorProps } from '../../../data/key-value-editor';

export type GlassKeyValueEditorProps = {
  entries?: Record<string, string>;
  pairs?: Record<string, string>;
  onChange?: (entries: Record<string, string>) => void;
} & Omit<KeyValueEditorProps, 'value' | 'defaultValue' | 'onValueChange'>;

export function GlassKeyValueEditor(props: GlassKeyValueEditorProps) {
  warnDeprecated('DEP-S0646');
  const { entries, pairs, onChange, ...rest } = props;
  const rec = entries ?? pairs ?? {};
  const toPairs = (r: Record<string, string>) => Object.entries(r).map(([key, value]) => ({ key, value }));
  const toRec = (p: { key: string; value: string }[]) => Object.fromEntries(p.map(({ key, value }) => [key, value]));
  return (
    <KeyValueEditor
      {...rest}
      defaultValue={toPairs(rec)}
      onValueChange={(p: { key: string; value: string }[]) => onChange?.(toRec(p))}
    />
  );
}
