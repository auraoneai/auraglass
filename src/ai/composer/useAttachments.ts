'use client';
import * as React from 'react';
import { useAnnouncer } from '../../theme';

export interface AttachmentReject {
  file: File;
  reason: 'type' | 'size' | 'count';
}

export interface UseAttachmentsOptions {
  accept?: string | undefined;
  maxFiles?: number | undefined;
  maxFileSize?: number | undefined;
  onAttachmentReject?: ((rej: AttachmentReject) => void) | undefined;
  /** Files attached on mount (e.g. a restored draft); not validated. */
  initialFiles?: readonly File[] | undefined;
}

function accepts(file: File, accept: string): boolean {
  const rules = accept.split(',').map((s) => s.trim()).filter(Boolean);
  if (rules.length === 0) return true;
  return rules.some((rule) => {
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule.toLowerCase());
    if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1));
    return file.type === rule;
  });
}

export function useAttachments({ accept, maxFiles = 10, maxFileSize = 20 * 1024 * 1024, onAttachmentReject, initialFiles }: UseAttachmentsOptions = {}) {
  const [files, setFiles] = React.useState<File[]>(() => [...(initialFiles ?? [])]);
  const { announce } = useAnnouncer();

  const add = React.useCallback((incoming: File[] | FileList, _source: 'picker' | 'paste' | 'drop') => {
    const list = Array.from(incoming as Iterable<File>);
    setFiles((cur) => {
      const next = [...cur];
      for (const f of list) {
        let reason: AttachmentReject['reason'] | null = null;
        if (accept && !accepts(f, accept)) reason = 'type';
        else if (f.size > maxFileSize) reason = 'size';
        else if (next.length >= maxFiles) reason = 'count';
        if (reason) {
          onAttachmentReject?.({ file: f, reason });
          announce(`Attachment rejected: ${f.name} (${reason})`);
          continue;
        }
        next.push(f);
      }
      return next;
    });
  }, [accept, maxFileSize, maxFiles, onAttachmentReject, announce]);

  const remove = React.useCallback((name: string) => {
    setFiles((cur) => cur.filter((f) => f.name !== name));
  }, []);

  const clear = React.useCallback(() => setFiles([]), []);

  return { files, add, remove, clear };
}
