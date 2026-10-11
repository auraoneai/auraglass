// registry/items/comment-thread/CommentThread.tsx — SURF-596 (AC-SURF-30),
// REQ-SURF-176. Comment surface: an <ol> of <li><article> comments with
// <time dateTime>, per-comment Resolve, and a multiline composer. Enter
// submits — never inside an IME composition (the guard sits on the
// textarea's own keydown), and Shift+Enter inserts a newline. Below 360 px of
// container width the avatar column collapses (comment-thread.css).
'use client';
import * as React from 'react';
import { Avatar, Button, Card, TextField } from 'aura-glass';
import './comment-thread.css';

export interface ThreadComment {
  id: string;
  author: string;
  body: string;
  /** ISO date string — fixtures pin real strings, no clock */
  at?: string;
  resolved?: boolean;
}

export interface CommentThreadProps {
  comments: ThreadComment[];
  /** What the thread is attached to (e.g. 'Line 42 · totals row'); names the thread. */
  anchorLabel?: string;
  draft?: string;
  defaultDraft?: string;
  onDraftChange?: (draft: string) => void;
  onSubmit?: (body: string) => void;
  /** Called with the comment id when its Resolve action is pressed. */
  onResolve?: (id: string) => void;
  submitLabel?: string;
}

const initials = (name: string) => name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

export function CommentThread({
  comments,
  anchorLabel,
  draft,
  defaultDraft = '',
  onDraftChange,
  onSubmit,
  onResolve,
  submitLabel = 'Comment',
}: CommentThreadProps) {
  const [inner, setInner] = React.useState(defaultDraft);
  const value = draft === undefined ? inner : draft;
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const setValue = (v: string) => {
    if (draft === undefined) setInner(v);
    onDraftChange?.(v);
  };
  const submitRef = React.useRef<() => void>(() => {});
  submitRef.current = () => {
    const body = valueRef.current.trim();
    if (!body) return;
    onSubmit?.(body);
    setValue('');
  };

  /* TextField exposes the native control through `ref` (no onKeyDown prop):
     the IME-safe Enter handler is attached to the textarea itself. */
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  React.useEffect(() => {
    const el: HTMLElement | null = inputRef.current;
    if (el === null) return undefined;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.shiftKey) return;           // Shift+Enter: newline
      if (e.isComposing || e.keyCode === 229) return;         // IME confirms text, never submits
      e.preventDefault();
      submitRef.current();
    };
    el.addEventListener('keydown', onKeyDown);
    return () => el.removeEventListener('keydown', onKeyDown);
  }, []);

  const headingId = React.useId();
  return (
    <Card.Root data-ag-part="root" className="ag-comment-thread"
      {...(anchorLabel !== undefined ? { 'aria-labelledby': headingId, role: 'region' } : {})}>
      {anchorLabel !== undefined ? (
        <Card.Header data-ag-part="anchor">
          <span id={headingId} className="ag-comment-thread__anchor">{anchorLabel}</span>
        </Card.Header>
      ) : null}
      <Card.Body data-ag-part="body">
        <ol data-ag-part="comments" className="ag-comment-thread__list">
          {comments.map((c) => (
            <li key={c.id} data-ag-part="comment" data-resolved={c.resolved || undefined}>
              <article className="ag-comment-thread__comment" aria-label={`${c.author}${c.resolved ? ' (resolved)' : ''}`}>
                <Avatar.Root data-ag-part="avatar" className="ag-comment-thread__avatar" aria-hidden="true">
                  <Avatar.Fallback>{initials(c.author)}</Avatar.Fallback>
                </Avatar.Root>
                <div className="ag-comment-thread__content">
                  <strong data-ag-part="author">{c.author}</strong>
                  {c.at ? <time data-ag-part="at" dateTime={c.at}>{c.at}</time> : null}
                  <p data-ag-part="text">{c.body}</p>
                  {onResolve !== undefined && !c.resolved ? (
                    <Button data-ag-part="resolve" variant="clear" size="sm"
                      aria-label={`Resolve comment by ${c.author}`} onClick={() => onResolve(c.id)}>Resolve</Button>
                  ) : null}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </Card.Body>
      <Card.Footer data-ag-part="composer">
        <TextField
          data-ag-part="input"
          multiline
          rows={2}
          ref={inputRef}
          value={value}
          onValueChange={(v) => setValue(v)}
          placeholder="Write a comment"
          aria-label="Write a comment"
        />
        <Button data-ag-part="submit" onClick={() => submitRef.current()}>{submitLabel}</Button>
      </Card.Footer>
    </Card.Root>
  );
}

export default CommentThread;
