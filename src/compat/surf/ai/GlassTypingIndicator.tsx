'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { AiIcon } from '../../../ai/icons/AiIcon';

/** @deprecated GlassTypingIndicatorProps DEP-S0654 since 4.2.0, removed in 6.0.0. */
export interface GlassTypingIndicatorProps {
  visible?: boolean;
  names?: string[];
  className?: string;
}

export function GlassTypingIndicator({ visible = true, names, className }: GlassTypingIndicatorProps) {
  warnDeprecated('DEP-S0654');
  if (!visible) return null;
  return (
    <div data-ag-part="typing-indicator" className={className} role="status">
      <span data-ag-part="typing-dot" aria-hidden="true" />
      <span data-ag-part="typing-dot" aria-hidden="true" />
      <span data-ag-part="typing-dot" aria-hidden="true" />
      {names?.length ? <span className="ag-visually-hidden">{names.join(', ')} typing</span> : <span className="ag-visually-hidden">Typing</span>}
    </div>
  );
}
