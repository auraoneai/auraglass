/* CMP-318: FileUpload — button opens the hidden <input type=file>; dropzone
   accepts drag/drop; chosen files list with name/size/remove. Rejection by
   accept type, maxSize, maxCount. `onUpload(file, signal)` is optional: without
   it a file never reaches 'complete' (no fake progress — R-07's setInterval is
   not ported). Removing an uploading file aborts its upload.
   parts [root, dropzone, input, list, item, item-name, item-size, remove]. */
'use client';
import * as React from 'react';
import { cn } from '../../internal/index';

export interface FileUploadItem {
  file: File;
  status: 'idle' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onError'> {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxCount?: number;
  disabled?: boolean;
  /** Pre-populated file list (stories, controlled seeding). */
  defaultItems?: readonly FileUploadItem[];
  onFilesAccepted?: (items: FileUploadItem[]) => void;
  onFilesRejected?: (rejections: { file: File; reason: 'type' | 'size' | 'count' }[]) => void;
  /** Optional async upload; aborts via the AbortSignal when a file is removed. */
  onUpload?: (file: File, signal: AbortSignal) => Promise<unknown>;
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
  maxCount,
  disabled,
  defaultItems,
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
  const controllers = React.useRef(new Map<File, AbortController>());

  const admit = (files: File[]) => {
    const accepted: FileUploadItem[] = [];
    const rejected: { file: File; reason: 'type' | 'size' | 'count' }[] = [];
    for (const file of files) {
      if (maxCount !== undefined && items.length + accepted.length >= maxCount) { rejected.push({ file, reason: 'count' }); continue; }
      if (!matchesAccept(file, accept)) { rejected.push({ file, reason: 'type' }); continue; }
      if (maxSize !== undefined && file.size > maxSize) { rejected.push({ file, reason: 'size' }); continue; }
      accepted.push({ file, status: onUpload ? 'uploading' : 'idle' });
    }
    if (rejected.length) onFilesRejected?.(rejected);
    if (accepted.length) {
      setItems((prev) => [...prev, ...accepted]);
      onFilesAccepted?.(accepted);
      if (onUpload) {
        for (const item of accepted) {
          const ac = new AbortController();
          controllers.current.set(item.file, ac);
          Promise.resolve(onUpload(item.file, ac.signal))
            .then(() => setItems((prev) => prev.map((p) => (p.file === item.file ? { ...p, status: 'complete' } : p))))
            .catch((err: unknown) =>
              setItems((prev) =>
                prev.map((p) =>
                  p.file === item.file ? { ...p, status: 'error', error: err instanceof Error ? err.message : 'upload failed' } : p,
                ),
              ),
            );
        }
      }
    }
  };

  const remove = (file: File) => {
    controllers.current.get(file)?.abort();
    controllers.current.delete(file);
    setItems((prev) => prev.filter((p) => p.file !== file));
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
      <button
        type="button"
        data-ag-part="dropzone"
        className={cn('ag-file-upload-dropzone', dragging ? 'ag-file-upload-dragging' : undefined)}
        data-state={dragging ? 'active' : 'idle'}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        {children ?? 'Choose files or drop them here'}
      </button>
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
            <li key={item.file.name + item.file.size} data-ag-part="item" data-ag-status={item.status} className="ag-file-upload-item">
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
