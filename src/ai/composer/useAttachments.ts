import * as React from 'react';
import { useAnnouncer } from '../../theme';

export interface AttachmentReject {
  file: File;
  reason: 'type' | 'size' | 'count';
}

/** One attached file plus a stable generated id (two files may share a name). */
export interface ComposerAttachment {
  id: string;
  file: File;
}

export interface UseAttachmentsOptions {
  accept?: string | undefined;
  maxFiles?: number | undefined;
  maxFileSize?: number | undefined;
  onAttachmentReject?: ((rej: AttachmentReject) => void) | undefined;
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

/**
 * REQ-SURF-118: attachment list for Composer.Root. Accept/reject is decided
 * outside the state updater (from a ref mirroring the committed list), so the
 * reject callback and the announcement fire exactly once per file even when
 * React replays updaters (StrictMode, concurrent rendering).
 */
export function useAttachments({ accept, maxFiles = 10, maxFileSize = 20 * 1024 * 1024, onAttachmentReject }: UseAttachmentsOptions = {}) {
  const [items, setItems] = React.useState<ComposerAttachment[]>([]);
  const itemsRef = React.useRef<ComposerAttachment[]>(items);
  const seq = React.useRef(0);
  const prefix = React.useId();
  const { announce } = useAnnouncer();

  const commit = React.useCallback((next: ComposerAttachment[]) => {
    itemsRef.current = next;
    setItems(next);
  }, []);

  const add = React.useCallback((incoming: File[] | FileList, _source: 'picker' | 'paste' | 'drop') => {
    const list = Array.from(incoming as Iterable<File>);
    const next = [...itemsRef.current];
    const rejected: AttachmentReject[] = [];
    for (const f of list) {
      let reason: AttachmentReject['reason'] | null = null;
      if (accept && !accepts(f, accept)) reason = 'type';
      else if (f.size > maxFileSize) reason = 'size';
      else if (next.length >= maxFiles) reason = 'count';
      if (reason) {
        rejected.push({ file: f, reason });
        continue;
      }
      seq.current += 1;
      next.push({ id: `${prefix}a${seq.current}`, file: f });
    }
    if (next.length !== itemsRef.current.length) commit(next);
    for (const rej of rejected) {
      onAttachmentReject?.(rej);
      announce(`Attachment rejected: ${rej.file.name} (${rej.reason})`);
    }
  }, [accept, maxFileSize, maxFiles, onAttachmentReject, announce, commit, prefix]);

  const remove = React.useCallback((id: string) => {
    commit(itemsRef.current.filter((a) => a.id !== id));
  }, [commit]);

  const clear = React.useCallback(() => commit([]), [commit]);

  const files = React.useMemo(() => items.map((a) => a.file), [items]);

  return { items, files, add, remove, clear };
}
