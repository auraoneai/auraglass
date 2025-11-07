'use client';
import { cn } from '@/lib/utils';

import React from 'react';
import { OptimizedGlass } from '../../primitives';
import { GlassButton } from '../button/GlassButton';

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt?: string;
  replies?: Comment[];
}

export interface GlassCommentThreadProps {
  comments: Comment[];
  onReply?: (parentId: string, text: string) => void;
}

export function GlassCommentThread({ comments, onReply }: GlassCommentThreadProps) {
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});
  const setDraft = (id: string, v: string) => setDrafts((d) => ({ ...d, [id]: v }));

  const render = (c: Comment, depth = 0) => (
    <div key={c.id} className={cn('glass-gap-2')}>
      <OptimizedGlass elevation={'level1'} className={cn('glass-radius-lg glass-p-3 glass-border glass-border-white-15')}>
        <div className={cn('glass-text-sm glass-text-primary-90 glass-font-medium')}>{c.author}</div>
        <div className={cn('glass-text-sm glass-text-primary-80 glass-whitespace-pre-wrap')}>{c.text}</div>
        {c.createdAt && <div className={cn('glass-text-xs glass-text-primary-60 glass-mt-1')}>{c.createdAt}</div>}
      </OptimizedGlass>
      <div className={cn('glass-ml-6')}>
        <div className={cn('glass-flex glass-gap-2 glass-items-center')}>
          <input 
            value={drafts[c.id] ?? ''} 
            onChange={(e) => setDraft(c.id, e.target.value)} 
            placeholder="Reply…" 
            className={cn('glass-flex-1 glass-bg-transparent glass-border glass-border-white-20 glass-radius-lg glass-px-2 glass-py-1 glass-text-sm glass-outline-none')} 
          />
          <GlassButton size="sm" variant="secondary" onClick={(e) => { if (onReply && drafts[c.id]) { onReply(c.id, drafts[c.id]); setDraft(c.id, ''); } }}>Reply</GlassButton>
        </div>
        {c.replies?.length ? (
          <div className={cn('glass-mt-2 glass-gap-2')}>
            {(c.replies || []).map((r: any) => render(r, depth + 1))}
          </div>
        ) : null}
      </div>
    </div>
  );

  return <div className={cn('glass-gap-3')}>{(comments || []).map((c: any) => render(c))}</div>;
}

export default GlassCommentThread;

