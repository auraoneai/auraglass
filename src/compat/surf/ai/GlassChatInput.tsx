'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Composer } from '../../../ai/composer/Composer';
import type { ComposerRootProps } from '../../../ai/composer/Composer';

/** @deprecated GlassChatInputProps DEP-S0652 since 4.2.0, removed in 6.0.0. */
export interface GlassChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function GlassChatInput({ value, onChange, onSend, placeholder, disabled }: GlassChatInputProps) {
  warnDeprecated('DEP-S0652');
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
