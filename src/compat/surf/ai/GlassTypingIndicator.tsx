/* GlassTypingIndicator — 4.x compat adapter (REQ-SURF-13, DEP-S0403). The
   5.0 successor is a streaming-status message (or AgentSteps); this adapter
   keeps the 4.x standalone placement as a polite live status. users
   (string | string[]) with showUsers, and the 4.x `text` template
   ("{users} {isAre} …"), become the status text; visible={false} renders
   nothing. Dot animation styling (variant/dotColor/size) is dropped. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';

export interface GlassTypingIndicatorProps {
  visible?: boolean;
  users?: string | string[];
  names?: string[];
  showUsers?: boolean;
  text?: string;
  className?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassTypingIndicator` compat adapter (DEP-S0403).
 * @deprecated since 4.2.0, removed in 5.0.0. Use {@link a streaming-status AgMessage or AgentSteps from aura-glass/ai}.
 */
export function GlassTypingIndicator(props: GlassTypingIndicatorProps) {
  warnDeprecated('DEP-S0403');
  const { visible = true, users, names, showUsers = true, text, className } = props;
  if (!visible) return null;
  const list = names ?? (Array.isArray(users) ? users : users ? [users] : []);
  const who = showUsers ? list.join(', ') : '';
  const message = text
    ? text.replace('{users}', who).replace('{isAre}', list.length > 1 ? 'are' : 'is').trim()
    : who
      ? `${who} ${list.length > 1 ? 'are' : 'is'} typing`
      : 'Typing';
  return (
    <div role="status" aria-live="polite" {...(className ? { className } : {})}>
      <span aria-hidden="true">•••</span> {message}
    </div>
  );
}
