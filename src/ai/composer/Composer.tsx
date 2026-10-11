'use client';
import * as React from 'react';
import type { AgChatStatus } from '../types';
import { useAttachments } from './useAttachments';
import type { AttachmentReject } from './useAttachments';
import { useAnnouncer } from '../../theme';
import { AiIcon } from '../icons/AiIcon';
import type { AiIconName } from '../icons/index';

export interface ComposerLabels {
  input?: string;
  submit?: string;
  stop?: string;
  attach?: string;
  removeAttachment?: (name: string) => string;
}

interface ComposerCtx {
  value: string;
  setValue: (v: string) => void;
  status: AgChatStatus;
  disabled: boolean;
  maxLength: number | undefined;
  submit(): void;
  stop(): void;
  files: File[];
  removeFile(name: string): void;
  openPicker(): void;
  textareaId: string;
  labels: ComposerLabels;
  streaming: boolean;
}

const Ctx = React.createContext<ComposerCtx | null>(null);
function useComposer(): ComposerCtx {
  const c = React.useContext(Ctx);
  if (!c) throw new Error('Composer.* must render inside <Composer.Root>');
  return c;
}

export interface ComposerRootProps {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  status?: AgChatStatus | undefined;
  onSubmit?: ((detail: { text: string; files: File[] }) => void) | undefined;
  onStop?: (() => void) | undefined;
  disabled?: boolean | undefined;
  maxLength?: number | undefined;
  maxRows?: number | undefined;
  submitOnEnter?: boolean | undefined;
  stopOnEscape?: boolean | undefined;
  accept?: string | undefined;
  maxFiles?: number | undefined;
  maxFileSize?: number | undefined;
  onAttachmentReject?: ((rej: AttachmentReject) => void) | undefined;
  /** Attachments present on mount (uncontrolled), e.g. a restored draft. */
  defaultFiles?: readonly File[] | undefined;
  labels?: ComposerLabels | undefined;
  className?: string | undefined;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLFormElement>;
}

/** REQ-SURF-116..119: form root owning value/status/attachments context. */
export function ComposerRoot({
  value: valueProp,
  defaultValue,
  onValueChange,
  status = 'ready',
  onSubmit,
  onStop,
  disabled = false,
  maxLength,
  maxRows = 8,
  submitOnEnter = true,
  stopOnEscape = true,
  accept,
  maxFiles = 10,
  maxFileSize = 20 * 1024 * 1024,
  onAttachmentReject,
  defaultFiles,
  labels = {},
  className,
  children,
  ref,
}: ComposerRootProps) {
  const textareaId = React.useId();
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const value = valueProp ?? inner;
  const setValue = React.useCallback((v: string) => {
    if (valueProp === undefined) setInner(v);
    onValueChange?.(v);
  }, [valueProp, onValueChange]);

  const attachments = useAttachments({ accept, maxFiles, maxFileSize, onAttachmentReject, initialFiles: defaultFiles });
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const streaming = status === 'submitted' || status === 'streaming';

  const submit = React.useCallback(() => {
    const text = value.trim();
    if (disabled || streaming) return;
    if (!text && attachments.files.length === 0) return;
    onSubmit?.({ text, files: [...attachments.files] });
    attachments.clear();
  }, [value, disabled, streaming, attachments, onSubmit]);

  const stop = React.useCallback(() => {
    if (streaming) onStop?.();
  }, [streaming, onStop]);

  const ctx = React.useMemo<ComposerCtx>(() => ({
    value, setValue, status, disabled, maxLength, submit, stop,
    files: attachments.files, removeFile: attachments.remove,
    openPicker: () => fileInputRef.current?.click(),
    textareaId, labels, streaming,
  }), [value, setValue, status, disabled, maxLength, submit, stop, attachments, textareaId, labels, streaming]);

  return (
    <Ctx.Provider value={ctx}>
      <form
        ref={ref}
        data-ag-part="composer"
        data-status={status}
        data-dragging={dragging || undefined}
        className={className}
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) attachments.add(e.dataTransfer.files, 'drop');
        }}
        onPaste={(e) => {
          const fs = Array.from(e.clipboardData.files);
          if (fs.length) attachments.add(fs, 'paste');
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          hidden
          data-ag-part="file-input"
          onChange={(e) => { if (e.target.files?.length) attachments.add(e.target.files, 'picker'); e.target.value = ''; }}
        />
        {children ?? (
          <>
            <ComposerAttachments />
            <ComposerTextarea maxRows={maxRows} submitOnEnter={submitOnEnter} stopOnEscape={stopOnEscape} />
            <ComposerCounter />
            <ComposerActions />
          </>
        )}
      </form>
    </Ctx.Provider>
  );
}

export function ComposerTextarea({
  maxRows = 8,
  submitOnEnter = true,
  stopOnEscape = true,
}: { maxRows?: number; submitOnEnter?: boolean; stopOnEscape?: boolean }) {
  const c = useComposer();
  return (
    <textarea
      id={c.textareaId}
      data-ag-part="input"
      aria-label={c.labels.input ?? 'Message'}
      value={c.value}
      disabled={c.disabled}
      maxLength={c.maxLength}
      rows={1}
      style={{ ['--_ag-composer-max-rows' as string]: maxRows }}
      onChange={(e) => c.setValue(e.target.value)}
      onKeyDown={(e) => {
        const ne = e.nativeEvent as KeyboardEvent;
        if (ne.isComposing || ne.keyCode === 229) return; // IME guard (REQ-SURF-117)
        if (e.key === 'Escape' && stopOnEscape && c.streaming) { c.stop(); return; }
        if (e.key !== 'Enter') return;
        const chord = e.metaKey || e.ctrlKey;
        if (chord) { e.preventDefault(); c.submit(); return; }
        if (submitOnEnter && !e.shiftKey) { e.preventDefault(); c.submit(); }
      }}
    />
  );
}

export function ComposerAttachments() {
  const c = useComposer();
  if (c.files.length === 0) return null;
  return (
    <ul data-ag-part="attachments">
      {c.files.map((f) => (
        <li key={f.name} data-ag-part="attachment">
          <span data-ag-part="attachment-name">{f.name}</span>
          <button
            type="button"
            data-ag-part="attachment-remove"
            aria-label={(c.labels.removeAttachment ?? ((n: string) => `Remove ${n}`))(f.name)}
            onClick={() => c.removeFile(f.name)}
          >
            <AiIcon name="stop" size={10} />
          </button>
        </li>
      ))}
    </ul>
  );
}

export function ComposerAction({
  kind = 'custom',
  icon,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: 'attach' | 'custom' | undefined; icon?: AiIconName }) {
  const c = useComposer();
  return (
    <button
      type="button"
      data-ag-part="action"
      data-kind={kind}
      aria-label={rest['aria-label'] ?? (kind === 'attach' ? (c.labels.attach ?? 'Attach file') : undefined)}
      onClick={kind === 'attach' ? () => c.openPicker() : rest.onClick}
      {...rest}
    >
      {icon ? <AiIcon name={icon} /> : null}
      {rest.children}
    </button>
  );
}

export function ComposerActions({ children }: { children?: React.ReactNode }) {
  return (
    <div data-ag-part="actions">
      {children ?? <ComposerSubmit />}
    </div>
  );
}

export function ComposerSubmit(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const c = useComposer();
  const empty = c.value.trim().length === 0 && c.files.length === 0;
  if (c.streaming) {
    return (
      <button type="button" data-ag-part="stop" aria-label={c.labels.stop ?? 'Stop generating'} onClick={c.stop} {...props}>
        <AiIcon name="stop" />
      </button>
    );
  }
  return (
    <button
      type="submit"
      data-ag-part="submit"
      aria-label={c.labels.submit ?? 'Send message'}
      aria-disabled={empty || c.disabled}
      {...props}
    >
      <AiIcon name="send" />
    </button>
  );
}

export function ComposerCounter() {
  const c = useComposer();
  const { announce } = useAnnouncer();
  const len = c.value.length;
  const max = c.maxLength;
  const pct = max ? len / max : 0;
  const announced = React.useRef<'90' | '100' | null>(null);
  React.useEffect(() => {
    if (pct >= 1 && announced.current !== '100') { announced.current = '100'; announce(`${len} of ${max} characters`); }
    else if (pct >= 0.9 && announced.current === null) { announced.current = '90'; announce(`${len} of ${max} characters`); }
    else if (pct < 0.9) announced.current = null;
  }, [pct, len, max, announce]);
  if (!max) return null;
  return (
    <output data-ag-part="counter" aria-live="polite" htmlFor={c.textareaId}>
      {len}/{max}
    </output>
  );
}

export interface ComposerComponent {
  (props: ComposerRootProps): React.ReactElement;
  Root: typeof ComposerRoot;
  Textarea: typeof ComposerTextarea;
  Attachments: typeof ComposerAttachments;
  Actions: typeof ComposerActions;
  Action: typeof ComposerAction;
  Submit: typeof ComposerSubmit;
  Counter: typeof ComposerCounter;
}

export const Composer = Object.assign(ComposerRoot, {
  Root: ComposerRoot,
  Textarea: ComposerTextarea,
  Attachments: ComposerAttachments,
  Actions: ComposerActions,
  Action: ComposerAction,
  Submit: ComposerSubmit,
  Counter: ComposerCounter,
}) as ComposerComponent;
