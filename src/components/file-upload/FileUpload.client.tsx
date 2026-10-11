/* CMP-318: FileUpload — button opens the hidden <input type=file>; dropzone
   accepts drag/drop; chosen files list with name/size/remove. Rejection by
   accept type, maxSize, maxCount. `onUpload(file, signal)` is optional: without
   it a file never reaches 'complete' (no fake progress — R-07's setInterval is
   not ported). Removing an uploading file aborts its upload.
   parts [root, dropzone, input, list, item, item-name, item-size, remove]. */
'use client';
import * as React from 'react';
import { cn } from '../../internal/index';
import { Field } from '../field';
import { materialProps } from '../../material/index';
import { useAnnouncer } from '../../theme/announcer/useAnnouncer';

const SUNKEN = materialProps({ layer: 'content', content: 'content-sunken' });

export interface FileUploadItem {
  file: File;
  status: 'selected' | 'uploading' | 'complete' | 'error';
  /** 0..1 while uploading (driven by onUpload's onProgress). */
  progress?: number;
  error?: string;
}

export interface FileUploadRejection {
  file: File;
  reason: 'type' | 'size' | 'count';
}

export type FileUploadChangeReason =
  | 'accept'
  | 'reject'
  | 'remove'
  | 'progress'
  | 'complete'
  | 'error';

export interface FileUploadChangeDetails {
  reason: FileUploadChangeReason;
  rejections?: readonly FileUploadRejection[];
}

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  /** Maximum admitted files. */
  maxFiles?: number;
  /** @deprecated use maxFiles */
  maxCount?: number;
  disabled?: boolean;
  /** Pre-populated file list (stories, controlled seeding). */
  defaultItems?: readonly FileUploadItem[];
  /** Called on every list mutation with the reason + rejections. */
  onValueChange?: (items: FileUploadItem[], details: FileUploadChangeDetails) => void;
  onFilesAccepted?: (items: FileUploadItem[]) => void;
  onFilesRejected?: (rejections: FileUploadRejection[]) => void;
  /** Optional async upload; aborts via signal, drives item.progress via onProgress. */
  onUpload?: (file: File, ctx: { signal: AbortSignal; onProgress: (progress: number) => void }) => Promise<unknown>;
  children?: React.ReactNode;
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  return accept.split(',').map((s) => s.trim()).some((rule) => {
    if (rule.endsWith('/*')) return file.type.startsWith(rule.slice(0, -1));
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule.toLowerCase());
    return file.type === rule;
  });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUpload({
  accept,
  multiple,
  maxSize,
  maxFiles,
  maxCount,
  disabled,
  defaultItems,
  onValueChange,
  onFilesAccepted,
  onFilesRejected,
  onUpload,
  children,
  className,
  ref,
  ...rest
}: FileUploadProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [items, setItems] = React.useState<FileUploadItem[]>(() => [...(defaultItems ?? [])]);
  const [dragging, setDragging] = React.useState(false);
  const [rejections, setRejections] = React.useState<readonly FileUploadRejection[]>([]);
  const controllers = React.useRef(new Map<File, AbortController>());
  const { announce } = useAnnouncer();
  const errorId = React.useId();
  const limit = maxFiles ?? maxCount;

  const updateItems = (next: FileUploadItem[] | ((prev: FileUploadItem[]) => FileUploadItem[]), reason: FileUploadChangeReason, rej?: readonly FileUploadRejection[]) => {
    setItems((prev) => {
      const list = typeof next === 'function' ? next(prev) : next;
      onValueChange?.(list, rej !== undefined ? { reason, rejections: rej } : { reason });
      return list;
    });
  };

  const admit = (files: File[]) => {
    const accepted: FileUploadItem[] = [];
    const rejected: FileUploadRejection[] = [];
    for (const file of files) {
      if (limit !== undefined && items.length + accepted.length >= limit) { rejected.push({ file, reason: 'count' }); continue; }
      if (!matchesAccept(file, accept)) { rejected.push({ file, reason: 'type' }); continue; }
      if (maxSize !== undefined && file.size > maxSize) { rejected.push({ file, reason: 'size' }); continue; }
      accepted.push(onUpload ? { file, status: 'uploading', progress: 0 } : { file, status: 'selected' });
    }
    if (rejected.length) {
      setRejections(rejected);
      onFilesRejected?.(rejected);
      updateItems((prev) => prev, 'reject', rejected);
      announce(
        `${rejected.length} file${rejected.length > 1 ? 's' : ''} rejected: ` +
          rejected.map((r) => `${r.file.name} (${r.reason})`).join(', '),
      );
    } else {
      setRejections([]);
    }
    if (accepted.length) {
      updateItems((prev) => [...prev, ...accepted], 'accept');
      onFilesAccepted?.(accepted);
      if (onUpload) {
        for (const item of accepted) {
          const ac = new AbortController();
          controllers.current.set(item.file, ac);
          Promise.resolve(
            onUpload(item.file, {
              signal: ac.signal,
              onProgress: (progress) =>
                updateItems(
                  (prev) => prev.map((p) => (p.file === item.file ? { ...p, progress: Math.min(1, Math.max(0, progress)) } : p)),
                  'progress',
                ),
            }),
          )
            .then(() =>
              updateItems((prev) => prev.map((p) => (p.file === item.file ? { ...p, status: 'complete', progress: 1 } : p)), 'complete'),
            )
            .catch((err: unknown) =>
              updateItems(
                (prev) =>
                  prev.map((p) =>
                    p.file === item.file ? { ...p, status: 'error', error: err instanceof Error ? err.message : 'upload failed' } : p,
                  ),
                'error',
              ),
            );
        }
      }
    }
  };

  const remove = (file: File) => {
    controllers.current.get(file)?.abort();
    controllers.current.delete(file);
    updateItems((prev) => prev.filter((p) => p.file !== file), 'remove');
  };

  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="root"
      className={cn('ag-file-upload', className)}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (disabled) return;
        admit(Array.from(e.dataTransfer.files).slice(0, multiple ? undefined : 1));
      }}
    >
      <Field.Root invalid={rejections.length > 0}>
      <button
        type="button"
        {...SUNKEN}
        data-ag-part="dropzone"
        className={cn('ag-file-upload-dropzone', dragging ? 'ag-file-upload-dragging' : undefined)}
        data-state={dragging ? 'active' : 'idle'}
        disabled={disabled}
        aria-describedby={rejections.length > 0 ? errorId : undefined}
        onClick={() => inputRef.current?.click()}
      >
        {children ?? 'Choose files or drop them here'}
      </button>
      {rejections.length > 0 ? (
        <Field.Error id={errorId} match data-ag-part="errors" className="ag-file-upload-errors">
          {rejections.map((r) => `${r.file.name}: ${r.reason}`).join('; ')}
        </Field.Error>
      ) : null}
      </Field.Root>
      <input
        ref={inputRef}
        type="file"
        data-ag-part="input"
        className="ag-file-upload-input"
        hidden
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          admit(Array.from(e.currentTarget.files ?? []));
          e.currentTarget.value = '';
        }}
      />
      {items.length > 0 ? (
        <ul data-ag-part="list" className="ag-file-upload-list">
          {items.map((item) => (
            <li key={item.file.name + item.file.size} data-ag-part="item" data-status={item.status} className="ag-file-upload-item">
              <span data-ag-part="item-name" className="ag-file-upload-name">
                {item.file.name}
              </span>
              <span data-ag-part="item-size" className="ag-file-upload-size">
                {formatSize(item.file.size)}
              </span>
              <button
                type="button"
                data-ag-part="remove"
                className="ag-file-upload-remove"
                aria-label={`Remove ${item.file.name}`}
                onClick={() => remove(item.file)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
