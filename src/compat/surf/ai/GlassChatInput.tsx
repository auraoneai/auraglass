'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Composer } from '../../../ai/composer/Composer';
import type { ComposerRootProps } from '../../../ai/composer/Composer';

export interface GlassChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function GlassChatInput({ value, onChange, onSend, placeholder, disabled }: GlassChatInputProps) {
  warnDeprecated('GlassChatInput (dropped: onVoiceRecording — use the ai-voice-input registry item)');
  return (
    <Composer
      {...(value !== undefined ? { value } : {})}
      onValueChange={onChange}
      disabled={disabled}
      labels={placeholder !== undefined ? { input: placeholder } : {}}
      onSubmit={({ text }) => onSend?.(text)}
    />
  );
}
