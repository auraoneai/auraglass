/* GlassChatInput — 4.x compat adapter (REQ-SURF-13, DEP-S0401) → Composer.
   value/onChange(value), onSend(text), placeholder → the input label,
   disabled, maxLength map onto Composer. onVoiceRecording/enableVoice is
   dropped (the ai-voice-input registry item replaces it; named in the
   DEP-S0401 message); attachments/emoji toggles are Composer parts. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Composer } from '../../../ai/composer/Composer';

export interface GlassChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassChatInput` compat adapter (DEP-S0401).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link Composer from aura-glass/ai}.
 */
export function GlassChatInput(props: GlassChatInputProps) {
  warnDeprecated('DEP-S0401');
  const { value, onChange, onSend, placeholder, disabled } = props;
  return (
    <Composer
      {...(value !== undefined ? { value } : {})}
      {...(onChange ? { onValueChange: onChange } : {})}
      {...(disabled ? { disabled: true } : {})}
      labels={placeholder !== undefined ? { input: placeholder } : {}}
      onSubmit={({ text }) => onSend?.(text)}
    />
  );
}
