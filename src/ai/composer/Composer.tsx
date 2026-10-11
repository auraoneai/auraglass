'use client';
import * as React from 'react';
import { Field } from '@base-ui/react/field';
import type { AgChatStatus } from '../types';
import { useAttachments } from './useAttachments';
import type { AttachmentReject, ComposerAttachment } from './useAttachments';
import { useAnnouncer } from '../../theme';
import { Menu } from '../../components/menu';
import { AiIcon } from '../icons/AiIcon';
import type { AiIconName } from '../icons/index';

export interface ComposerLabels {
  input?: string;
  submit?: string;
  stop?: string;
  attach?: string;
  /** Trigger of the narrow-container (<480 px) actions menu (REQ-SURF-119). */
  moreActions?: string;
  removeAttachment?: (name: string) => string;
}

/** A secondary action registered by `Composer.Action` for the narrow menu. */
interface RegisteredAction {
  id: string;
  label: string;
  icon: AiIconName | undefined;
  disabled: boolean;
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
  attachments: ComposerAttachment[];
  removeFile(id: string): void;
  openPicker(): void;
  textareaId: string;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  labels: ComposerLabels;
  streaming: boolean;
  actions: RegisteredAction[];
  registerAction(action: RegisteredAction, onSelect: (e: React.MouseEvent<HTMLElement>) => void): () => void;
  selectAction(id: string, e: React.MouseEvent<HTMLElement>): void;
}

const Ctx = React.createContext<ComposerCtx | null>(null);
function useComposer(): ComposerCtx {
  const c = React.useContext(Ctx);
  if (!c) throw new Error('Composer.* must render inside <Composer.Root>');
  return c;
}

const useIsoLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

/* ── REQ-SURF-119 keyboard inset ──────────────────────────────────────────
   Where the VirtualKeyboard API exists, `env(keyboard-inset-height)` in
   ai.css does the work. Elsewhere ONE shared `visualViewport` resize listener
   (installed for the first mounted composer, removed with the last) writes
   `--_ag-ai-keyboard-inset` on every mounted composer form. */
const insetTargets = new Set<HTMLElement>();
let insetListener: (() => void) | null = null;

function keyboardEnvSupported(): boolean {
  return typeof navigator !== 'undefined' && 'virtualKeyboard' in navigator;
}

function writeKeyboardInset(): void {
  const vv = window.visualViewport;
  if (!vv) return;
  const inset = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
  for (const el of insetTargets) el.style.setProperty('--_ag-ai-keyboard-inset', `${inset}px`);
}

function trackKeyboardInset(el: HTMLElement): () => void {
  if (typeof window === 'undefined' || !window.visualViewport || keyboardEnvSupported()) return () => undefined;
  insetTargets.add(el);
  if (!insetListener) {
    insetListener = writeKeyboardInset;
    window.visualViewport.addEventListener('resize', insetListener);
  }
  writeKeyboardInset();
  return () => {
    insetTargets.delete(el);
    el.style.removeProperty('--_ag-ai-keyboard-inset');
    if (insetTargets.size === 0 && insetListener) {
      window.visualViewport?.removeEventListener('resize', insetListener);
      insetListener = null;
    }
  };
}

/** The Thread this composer belongs to: the nearest `[data-ag-part="thread"]`
    found walking up from the composer (ancestor, or inside a shared ancestor). */
function findThread(form: HTMLElement): HTMLElement | null {
  const own = form.closest<HTMLElement>('[data-ag-part="thread"]');
  if (own) return own;
  for (let node = form.parentElement; node; node = node.parentElement) {
    const hit = node.querySelector<HTMLElement>('[data-ag-part="thread"]');
    if (hit) return hit;
  }
  return null;
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

  const attachments = useAttachments({ accept, maxFiles, maxFileSize, onAttachmentReject });
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const [dragging, setDragging] = React.useState(false);
  // dragenter/dragleave fire for every child crossed; only depth 0 ends the drag.
  const dragDepth = React.useRef(0);
  const streaming = status === 'submitted' || status === 'streaming';

  const submit = React.useCallback(() => {
    const text = value.trim();
    if (disabled || streaming) return;
    if (!text && attachments.files.length === 0) return;
    onSubmit?.({ text, files: [...attachments.files] });
    attachments.clear();
    // REQ-SURF-117: the draft is consumed (uncontrolled: cleared here;
    // controlled: the owner is told via onValueChange('')) and focus stays
    // in the textarea, also when Submit was clicked.
    setValue('');
    textareaRef.current?.focus();
  }, [value, disabled, streaming, attachments, onSubmit, setValue]);

  const stop = React.useCallback(() => {
    if (streaming) onStop?.();
  }, [streaming, onStop]);

  // Narrow-menu registry: Composer.Action registers label/icon (state, for
  // rendering) and its handler (ref, so a new closure never re-registers).
  const [actions, setActions] = React.useState<RegisteredAction[]>([]);
  const handlers = React.useRef(new Map<string, (e: React.MouseEvent<HTMLElement>) => void>());
  const registerAction = React.useCallback((action: RegisteredAction, onSelect: (e: React.MouseEvent<HTMLElement>) => void) => {
    handlers.current.set(action.id, onSelect);
    setActions((cur) => {
      const i = cur.findIndex((a) => a.id === action.id);
      if (i === -1) return [...cur, action];
      const prev = cur[i]!;
      if (prev.label === action.label && prev.icon === action.icon && prev.disabled === action.disabled) return cur;
      const next = [...cur];
      next[i] = action;
      return next;
    });
    return () => {
      handlers.current.delete(action.id);
      setActions((cur) => cur.filter((a) => a.id !== action.id));
    };
  }, []);
  const selectAction = React.useCallback((id: string, e: React.MouseEvent<HTMLElement>) => { handlers.current.get(id)?.(e); }, []);

  const openPicker = React.useCallback(() => fileInputRef.current?.click(), []);

  // REQ-SURF-119: publish the composer's block size on its Thread so the
  // jump pill and the log's scroll padding clear a growing composer.
  React.useEffect(() => {
    const form = formRef.current;
    if (!form || typeof ResizeObserver === 'undefined') return;
    let thread: HTMLElement | null = null;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[entries.length - 1];
      if (!entry) return;
      const block = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      thread ??= findThread(form);
      if (!thread) return;
      const px = `${Math.round(block)}px`;
      thread.style.setProperty('--_ag-ai-composer-block', px);
      thread.style.setProperty('--ag-scroll-padding-block-end', px);
    });
    ro.observe(form);
    return () => {
      ro.disconnect();
      thread?.style.removeProperty('--_ag-ai-composer-block');
      thread?.style.removeProperty('--ag-scroll-padding-block-end');
    };
  }, []);

  React.useEffect(() => {
    const form = formRef.current;
    return form ? trackKeyboardInset(form) : undefined;
  }, []);

  const setFormRef = React.useCallback((el: HTMLFormElement | null) => {
    formRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as React.RefObject<HTMLFormElement | null>).current = el;
  }, [ref]);

  const ctx = React.useMemo<ComposerCtx>(() => ({
    value, setValue, status, disabled, maxLength, submit, stop,
    files: attachments.files, attachments: attachments.items, removeFile: attachments.remove,
    openPicker, textareaId, textareaRef, labels, streaming,
    actions, registerAction, selectAction,
  }), [value, setValue, status, disabled, maxLength, submit, stop, attachments, openPicker, textareaId, labels, streaming, actions, registerAction, selectAction]);

  return (
    <Ctx.Provider value={ctx}>
      <form
        ref={setFormRef}
        data-ag-part="composer"
        data-status={status}
        data-dragging={dragging || undefined}
        className={className}
        onSubmit={(e) => { e.preventDefault(); submit(); }}
        onDragEnter={(e) => {
          e.preventDefault();
          dragDepth.current += 1;
          setDragging(true);
        }}
        onDragOver={(e) => { e.preventDefault(); }}
        onDragLeave={() => {
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          dragDepth.current = 0;
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

function fieldSizingSupported(): boolean {
  return typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('field-sizing', 'content');
}

/**
 * REQ-SURF-116/119: Base UI Field (visually hidden `<label for>`) around the
 * textarea. Growth is `field-sizing: content` capped at `maxRows` lines by
 * ai.css; without field-sizing the height is measured from scrollHeight.
 */
export function ComposerTextarea({
  maxRows = 8,
  submitOnEnter = true,
  stopOnEscape = true,
}: { maxRows?: number; submitOnEnter?: boolean; stopOnEscape?: boolean }) {
  const c = useComposer();
  const label = c.labels.input ?? 'Message';

  useIsoLayoutEffect(() => {
    const el = c.textareaRef.current;
    if (!el || fieldSizingSupported()) return;
    el.style.blockSize = 'auto';
    const cs = getComputedStyle(el);
    const n = (v: string) => parseFloat(v) || 0;
    const line = n(cs.lineHeight) || (n(cs.fontSize) || 16) * 1.2;
    const padding = n(cs.paddingBlockStart) + n(cs.paddingBlockEnd);
    const border = n(cs.borderBlockStartWidth) + n(cs.borderBlockEndWidth);
    // scrollHeight = content + padding; convert to the box-sizing in use.
    const borderBox = cs.boxSizing === 'border-box';
    const content = borderBox ? el.scrollHeight + border : el.scrollHeight - padding;
    const cap = line * maxRows + (borderBox ? padding + border : 0);
    el.style.blockSize = `${Math.min(content, cap)}px`;
  }, [c.value, maxRows]);

  return (
    <Field.Root data-ag-part="field" disabled={c.disabled}>
      <Field.Label data-ag-part="label" className="ag-visually-hidden">{label}</Field.Label>
      <Field.Control
        id={c.textareaId}
        data-ag-part="textarea"
        value={c.value}
        render={(props) => (
          <textarea
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            ref={(el) => {
              c.textareaRef.current = el;
              const r = (props as { ref?: React.Ref<HTMLTextAreaElement> }).ref;
              if (typeof r === 'function') r(el);
              else if (r) (r as React.RefObject<HTMLTextAreaElement | null>).current = el;
            }}
            rows={1}
            maxLength={c.maxLength}
            style={{ ['--_ag-composer-max-rows' as string]: maxRows }}
          />
        )}
        onValueChange={(v) => c.setValue(v)}
        onKeyDown={(e: React.KeyboardEvent<HTMLElement>) => {
          const ne = e.nativeEvent as KeyboardEvent;
          if (ne.isComposing || ne.keyCode === 229) return; // IME guard (REQ-SURF-117)
          if (e.key === 'Escape' && stopOnEscape && c.streaming) { c.stop(); return; }
          if (e.key !== 'Enter') return;
          const chord = e.metaKey || e.ctrlKey;
          if (chord) { e.preventDefault(); c.submit(); return; }
          if (submitOnEnter && !e.shiftKey) { e.preventDefault(); c.submit(); }
        }}
      />
    </Field.Root>
  );
}

export function ComposerAttachments() {
  const c = useComposer();
  if (c.attachments.length === 0) return null;
  return (
    <ul data-ag-part="attachments">
      {c.attachments.map((a) => (
        <li key={a.id} data-ag-part="attachment">
          <span data-ag-part="attachment-name">{a.file.name}</span>
          <button
            type="button"
            data-ag-part="attachment-remove"
            aria-label={(c.labels.removeAttachment ?? ((n: string) => `Remove ${n}`))(a.file.name)}
            onClick={() => c.removeFile(a.id)}
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
  onClick,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: 'attach' | 'custom' | undefined; icon?: AiIconName }) {
  const c = useComposer();
  const id = React.useId();
  const label = rest['aria-label'] ?? (kind === 'attach' ? (c.labels.attach ?? 'Attach file') : undefined)
    ?? (typeof rest.children === 'string' ? rest.children : undefined);
  const disabled = Boolean(rest.disabled);
  // A consumer that re-parts the button (e.g. data-ag-part="voice-input")
  // keeps it visible at every width, so it is not duplicated in the menu.
  const inMenu = rest['data-ag-part' as keyof typeof rest] === undefined && label !== undefined;
  // The menu item's click is forwarded to the action's onClick (same handler,
  // the event's currentTarget is the menu item).
  const select = React.useRef<(e: React.MouseEvent<HTMLElement>) => void>(() => undefined);
  select.current = (e) => {
    if (kind === 'attach') c.openPicker();
    onClick?.(e as React.MouseEvent<HTMLButtonElement>);
  };
  const { registerAction } = c;
  React.useEffect(() => {
    if (!inMenu || label === undefined) return;
    return registerAction({ id, label, icon, disabled }, (e) => select.current(e));
  }, [registerAction, inMenu, id, label, icon, disabled]);
  return (
    <button
      type="button"
      data-ag-part="action"
      data-kind={kind}
      aria-label={label}
      {...rest}
      onClick={(e) => {
        if (kind === 'attach') c.openPicker();
        onClick?.(e);
      }}
    >
      {icon ? <AiIcon name={icon} /> : null}
      {rest.children}
    </button>
  );
}

/**
 * REQ-SURF-119: below a 480 px container the `Composer.Action` buttons are
 * hidden by ai.css and reached through this one leading CMP Menu instead;
 * Submit/Stop stay visible. Above 480 px the menu itself is hidden.
 */
export function ComposerMenu() {
  const c = useComposer();
  if (c.actions.length === 0) return null;
  return (
    <div data-ag-part="composer-menu">
      <Menu.Root>
        <Menu.Trigger aria-label={c.labels.moreActions ?? 'More actions'} data-ag-part="composer-menu-trigger">
          <AiIcon name="chevron" />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Positioner>
            <Menu.Popup>
              {c.actions.map((a) => (
                <Menu.Item key={a.id} disabled={a.disabled} onClick={(e) => c.selectAction(a.id, e)}>
                  {a.icon ? <AiIcon name={a.icon} /> : null}
                  {a.label}
                </Menu.Item>
              ))}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    </div>
  );
}

export function ComposerActions({ children }: { children?: React.ReactNode }) {
  return (
    <div data-ag-part="actions">
      <ComposerMenu />
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

/** REQ-SURF-119: `{length}/{maxLength}`; speech goes only through the
    provider announcer, once at 90% and once at 100% (no own live region). */
export function ComposerCounter() {
  const c = useComposer();
  const { announce } = useAnnouncer();
  const len = c.value.length;
  const max = c.maxLength;
  const pct = max ? len / max : 0;
  const announced = React.useRef<'90' | '100' | null>(null);
  React.useEffect(() => {
    if (pct >= 1 && announced.current !== '100') { announced.current = '100'; announce(`${len} of ${max} characters`); }
    else if (pct >= 0.9 && pct < 1 && announced.current === null) { announced.current = '90'; announce(`${len} of ${max} characters`); }
    else if (pct < 0.9) announced.current = null;
  }, [pct, len, max, announce]);
  if (!max) return null;
  return (
    <output data-ag-part="counter" htmlFor={c.textareaId}>
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
  Menu: typeof ComposerMenu;
  Submit: typeof ComposerSubmit;
  Counter: typeof ComposerCounter;
}

export const Composer = Object.assign(ComposerRoot, {
  Root: ComposerRoot,
  Textarea: ComposerTextarea,
  Attachments: ComposerAttachments,
  Actions: ComposerActions,
  Action: ComposerAction,
  Menu: ComposerMenu,
  Submit: ComposerSubmit,
  Counter: ComposerCounter,
}) as ComposerComponent;
