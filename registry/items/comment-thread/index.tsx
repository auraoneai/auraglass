// registry/items/comment-thread — REQ-SURF-177 (5.1 scope).
// Single comment surface: controlled list + composer. The composer submits
// on Enter — but never inside an IME composition (isComposing guard).
import { useState } from 'react';
import { Avatar, Button, Card, TextField } from 'aura-glass';

export interface ThreadComment {
  id: string;
  author: string;
  body: string;
  /** ISO date string — fixtures pin real strings, no clock */
  at?: string;
}

export interface CommentThreadProps {
  comments: ThreadComment[];
  draft?: string;
  defaultDraft?: string;
  onDraftChange?: (draft: string) => void;
  onSubmit?: (body: string) => void;
  submitLabel?: string;
}

export function CommentThread({
  comments,
  draft,
  defaultDraft = '',
  onDraftChange,
  onSubmit,
  submitLabel = 'Comment',
}: CommentThreadProps) {
  const [inner, setInner] = useState(defaultDraft);
  const value = draft === undefined ? inner : draft;
  const setValue = (v: string) => {
    if (draft === undefined) setInner(v);
    onDraftChange?.(v);
  };
  const submit = () => {
    const body = value.trim();
    if (!body) return;
    onSubmit?.(body);
    setValue('');
  };

  return (
    <Card.Root data-ag-part="root">
      <Card.Body data-ag-part="body">
        <ol data-ag-part="comments" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {comments.map((c) => (
            <li key={c.id} data-ag-part="comment">
              <Avatar.Root data-ag-part="avatar">
                <Avatar.Fallback>{c.author.slice(0, 2).toUpperCase()}</Avatar.Fallback>
              </Avatar.Root>
              <div>
                <strong data-ag-part="author">{c.author}</strong>
                {c.at && <span data-ag-part="at">{c.at}</span>}
                <p data-ag-part="text">{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card.Body>
      <Card.Footer data-ag-part="composer">
        <TextField
          data-ag-part="input"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            // IME-safe: Enter inside a composition confirms text, not submit.
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Write a comment"
          aria-label="Write a comment"
        />
        <Button data-ag-part="submit" onClick={submit}>{submitLabel}</Button>
      </Card.Footer>
    </Card.Root>
  );
}

export default CommentThread;
