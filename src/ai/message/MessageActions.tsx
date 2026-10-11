'use client';
import * as React from 'react';
import type { AgMessage } from '../types';
import { getMessageText } from '../text';
import { useAnnouncer } from '../../theme';
import { AiIcon } from '../icons/AiIcon';

export interface MessageActionsProps {
  message: AgMessage;
  onRegenerate?: ((messageId: string) => void) | undefined;
  onFeedback?: ((messageId: string, kind: 'up' | 'down') => void) | undefined;
  labels?: { copy?: string; copied?: string; regenerate?: string; thumbsUp?: string; thumbsDown?: string } | undefined;
}

export function MessageAction(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: keyof typeof import('../icons/index').AI_ICONS }) {
  const { icon, children, ...rest } = props;
  return (
    <button type="button" data-ag-part="action" {...rest}>
      {icon ? <AiIcon name={icon} /> : null}
      {children}
    </button>
  );
}

/**
 * REQ-SURF-114: always in the a11y tree and tab order; built-ins copy /
 * regenerate / feedback. Copy announces "Copied" through the announcer.
 */
export function MessageActions({ message, onRegenerate, onFeedback, labels }: MessageActionsProps) {
  const { announce } = useAnnouncer();
  const [vote, setVote] = React.useState<'up' | 'down' | null>(null);

  const copy = () => {
    void navigator.clipboard.writeText(getMessageText(message)).then(() => {
      announce(labels?.copied ?? 'Copied');
    });
  };
  const feedback = (kind: 'up' | 'down') => {
    const next = vote === kind ? null : kind;
    setVote(next);
    if (next) onFeedback?.(message.id, next);
  };

  return (
    <div data-ag-part="actions" role="group" aria-label="Message actions">
      <MessageAction icon="copy" aria-label={labels?.copy ?? 'Copy message'} onClick={copy} />
      {onRegenerate ? (
        <MessageAction
          icon="regenerate"
          aria-label={labels?.regenerate ?? 'Regenerate'}
          onClick={() => onRegenerate(message.id)}
        />
      ) : null}
      {onFeedback ? (
        <>
          <MessageAction
            icon="thumbs-up"
            aria-label={labels?.thumbsUp ?? 'Helpful'}
            aria-pressed={vote === 'up'}
            onClick={() => feedback('up')}
          />
          <MessageAction
            icon="thumbs-down"
            aria-label={labels?.thumbsDown ?? 'Not helpful'}
            aria-pressed={vote === 'down'}
            onClick={() => feedback('down')}
          />
        </>
      ) : null}
    </div>
  );
}
