import * as React from 'react';
import type { AgMessage } from '../types';
import { getMessageText } from '../text';
import { MessageParts } from './MessageParts';
import { MessageAction, MessageActions } from './MessageActions';
import type { MessagePartsProps } from './MessageParts';

export interface MessageLabels {
  you?: string;
  assistant?: string;
  system?: string;
  tool?: string;
  copied?: string;
  regenerate?: string;
  thumbsUp?: string;
  thumbsDown?: string;
}

export interface MessageRootProps {
  message: AgMessage;
  author?: string | undefined;
  locale?: string | undefined;
  timeZone?: string | undefined;
  labels?: MessageLabels | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
}

const AUTHOR_DEFAULTS: Record<string, string> = {
  user: 'You',
  assistant: 'Assistant',
  system: 'System',
  tool: 'Tool',
};

export function MessageRoot({
  message,
  author,
  locale = 'en-US',
  timeZone = 'UTC',
  labels,
  className,
  children,
  ref,
}: MessageRootProps) {
  const headingId = `ag-msg-${message.id}-heading`;
  const createdAt = message.metadata?.createdAt;
  const time = createdAt
    ? new Intl.DateTimeFormat(locale, { timeZone, timeStyle: 'short' }).format(new Date(createdAt))
    : null;
  const displayAuthor = author ?? labels?.[message.role as keyof MessageLabels] ?? AUTHOR_DEFAULTS[message.role] ?? message.role;
  return (
    <article
      ref={ref}
      id={`ag-msg-${message.id}`}
      aria-labelledby={headingId}
      data-ag-part="message"
      data-role={message.role}
      data-state={message.metadata?.status ?? 'complete'}
      className={className}
    >
      <span id={headingId} data-ag-part="heading" className="ag-visually-hidden">
        {displayAuthor}
        {time ? `, ${time}` : ''}
      </span>
      {children}
    </article>
  );
}

export function MessageAvatar({ children }: { children?: React.ReactNode }) {
  return <span data-ag-part="avatar" aria-hidden="true">{children}</span>;
}

export function MessageContent({ children }: { children?: React.ReactNode }) {
  return <div data-ag-part="content">{children}</div>;
}

export function MessageFooter({ children }: { children?: React.ReactNode }) {
  return <div data-ag-part="footer">{children}</div>;
}

export interface MessageComponent {
  (props: MessageRootProps): React.ReactElement;
  Avatar: typeof MessageAvatar;
  Content: typeof MessageContent;
  Footer: typeof MessageFooter;
  Parts: typeof MessageParts;
  getText: typeof getMessageText;
}

/**
 * REQ-SURF-111/114: server-safe compound. `Message.Root` reads no context —
 * `Thread.Items` passes `locale`/`timeZone` down; `Message.Parts` is the
 * static name for `MessageParts`; `Message.Actions`/`Action` live in
 * `MessageActions.tsx` (client island) and are attached in `src/ai/index.ts`.
 */
const MessageBase = (props: MessageRootProps) => (
  <MessageRoot {...props}>
    {props.children ?? (
      <MessageContent>
        <MessageParts message={props.message} />
      </MessageContent>
    )}
  </MessageRoot>
);

export const Message = Object.assign(MessageBase, {
  Avatar: MessageAvatar,
  Content: MessageContent,
  Footer: MessageFooter,
  Parts: MessageParts,
  Actions: MessageActions,
  Action: MessageAction,
  getText: getMessageText,
}) as MessageComponent & {
  Parts: typeof MessageParts;
  Actions: typeof MessageActions;
  Action: typeof MessageAction;
};

export type { MessagePartsProps };
