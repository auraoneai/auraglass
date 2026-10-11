/* CMP-319: ColorPicker — Trigger + Popover content (PRD-09 seam). Area is a
   single focusable role='slider' with aria-roledescription='2D slider'
   (arrows step s/v, PageUp/PageDown coarse); Hue is a horizontal slider.
   Value is hex; hsv/oklch helpers live in ./colors. */
'use client';
import * as React from 'react';
import { cn } from '../../internal/index';
import { Popover } from '../popover';
import { Slider } from '../slider';
import { hsvToHex, serializeColor, parseColorString, type Hsv } from './colors';

export interface ColorPickerValue {
  space: 'srgb' | 'oklch';
  value: string;
}

interface Ctx {
  hsv: Hsv;
  alpha: number;
  space: 'srgb' | 'oklch';
  setHsv: (h: Hsv, commit?: boolean) => void;
  setAlpha: (a: number) => void;
  setColorString: (input: string) => boolean;
  hex: string;
  serialized: ColorPickerValue;
}
const ColorCtx = React.createContext<Ctx | null>(null);

type PickerValueLike = ColorPickerValue | string;

function toHsvAlpha(v: PickerValueLike | undefined, fallback: Hsv): { hsv: Hsv; alpha: number; space: 'srgb' | 'oklch' } {
  if (v === undefined) return { hsv: fallback, alpha: 1, space: 'srgb' };
  const space = typeof v === 'string' ? 'srgb' : v.space;
  const str = typeof v === 'string' ? v : v.value;
  const parsed = parseColorString(str);
  if (!parsed) return { hsv: fallback, alpha: 1, space };
  return { hsv: parsed.hsv, alpha: parsed.alpha, space };
}

export interface ColorPickerRootProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Controlled color: { space:'srgb'|'oklch', value:'#rrggbb[aa]'|'oklch(l c h[ / a])' }.
     A bare string is treated as space:'srgb'. */
  value?: PickerValueLike;
  defaultValue?: PickerValueLike;
  onValueChange?: (value: ColorPickerValue, details: { committed: boolean }) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: unknown) => void;
}

function Root({
  value,
  defaultValue,
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  children,
  className,
  ref,
  ...rest
}: ColorPickerRootProps & { ref?: React.Ref<HTMLSpanElement> | undefined }) {
  /* Default swatch ≈ accent blue (as HSV so no colour literal ships). */
  const FALLBACK_HSV: Hsv = { h: 217, s: 0.76, v: 0.96 };
  const [uncontrolled, setUncontrolled] = React.useState(() => toHsvAlpha(defaultValue, FALLBACK_HSV));
  const resolved = value !== undefined ? toHsvAlpha(value, uncontrolled.hsv) : uncontrolled;
  const { hsv, alpha } = resolved;
  const space = (typeof value === 'object' ? value.space : resolved.space) ?? 'srgb';
  const hex = hsvToHex(hsv);
  const ctx = React.useMemo<Ctx>(
    () => {
      const commit = (next: Hsv, a: number, commitFlag: boolean, sp: 'srgb' | 'oklch') => {
        if (value === undefined) setUncontrolled({ hsv: next, alpha: a, space: sp });
        onValueChange?.({ space: sp, value: serializeColor(next, a, sp) }, { committed: commitFlag });
      };
      return {
        hsv,
        alpha,
        space,
        hex,
        serialized: { space, value: serializeColor(hsv, alpha, space) },
        setHsv: (next, commitFlag = true) => commit(next, alpha, commitFlag, space),
        setAlpha: (a) => commit(hsv, Math.min(1, Math.max(0, a)), true, space),
        setColorString: (input) => {
          const parsed = parseColorString(input);
          if (!parsed) return false;
          const nextSpace = /^\s*oklch\(/i.test(input) ? 'oklch' : 'srgb';
          commit(parsed.hsv, parsed.alpha, true, nextSpace);
          return true;
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hsv.h, hsv.s, hsv.v, alpha, space, value],
  );
  return (
    <ColorCtx.Provider value={ctx}>
      <Popover.Root {...(open !== undefined ? { open } : {})} {...(defaultOpen !== undefined ? { defaultOpen } : {})} onOpenChange={onOpenChange}>
        <span {...rest} ref={ref} data-ag-part="root" className={cn('ag-color-picker', className)}>
          {children}
        </span>
      </Popover.Root>
    </ColorCtx.Provider>
  );
}

function Trigger({ className, ref, ...rest }: React.ComponentProps<typeof Popover.Trigger>) {
  const ctx = React.useContext(ColorCtx);
  return (
    <Popover.Trigger {...rest} ref={ref} data-ag-part="trigger" className={cn('ag-color-picker-trigger', className)}>
      <span data-ag-part="swatch" className="ag-color-picker-swatch" style={{ backgroundColor: ctx?.hex }} aria-hidden="true" />
      {rest.children ?? ctx?.hex}
    </Popover.Trigger>
  );
}

function Content(props: React.ComponentProps<typeof Popover.Content>) {
  const { children, ...rest } = props;
  return (
    <Popover.Portal>
      <Popover.Positioner {...rest} className={cn('ag-color-picker-content', rest.className)}>
        <Popover.Popup>{children}</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}

export interface AreaProps extends React.HTMLAttributes<HTMLDivElement> {
  'aria-label'?: string;
}

function Area({ className, ref, 'aria-label': ariaLabel, ...rest }: AreaProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const ctx = React.useContext(ColorCtx);
  if (!ctx) return null;
  const { hsv, setHsv } = ctx;
  const move = (ds: number, dv: number, e: React.KeyboardEvent) => {
    e.preventDefault();
    setHsv({ ...hsv, s: Math.min(1, Math.max(0, hsv.s + ds)), v: Math.min(1, Math.max(0, hsv.v + dv)) });
  };
  const point = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const s = Math.min(1, Math.max(0, (e.clientX - r.left) / Math.max(1, r.width)));
    const v = Math.min(1, Math.max(0, 1 - (e.clientY - r.top) / Math.max(1, r.height)));
    setHsv({ ...hsv, s, v });
  };
  return (
    <div
      {...rest}
      ref={ref}
      role="slider"
      aria-roledescription="2D slider"
      aria-label={ariaLabel ?? 'Saturation and brightness'}
      aria-valuetext={`saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
      tabIndex={0}
      data-ag-part="area"
      className={cn('ag-color-picker-area', className)}
      style={{ backgroundColor: hsvToHex({ h: hsv.h, s: 1, v: 1 }), ...rest.style }}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); point(e); }}
      onPointerMove={(e) => { if (e.buttons === 1) point(e); }}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 0.1 : 0.01;
        if (e.key === 'ArrowRight') move(step, 0, e);
        else if (e.key === 'ArrowLeft') move(-step, 0, e);
        else if (e.key === 'ArrowUp') move(0, step, e);
        else if (e.key === 'ArrowDown') move(0, -step, e);
        else if (e.key === 'PageUp') { e.preventDefault(); setHsv({ ...hsv, v: 1 }); }
        else if (e.key === 'PageDown') { e.preventDefault(); setHsv({ ...hsv, v: 0 }); }
      }}
    >
      <span
        data-ag-part="area-thumb"
        className="ag-color-picker-area-thumb"
        style={{ insetInlineStart: `${hsv.s * 100}%`, insetBlockStart: `${(1 - hsv.v) * 100}%` }}
      />
    </div>
  );
}

function Hue({ className, ref, 'aria-label': ariaLabel, ...rest }: AreaProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const ctx = React.useContext(ColorCtx);
  if (!ctx) return null;
  const { hsv, setHsv } = ctx;
  return (
    <div
      {...rest}
      ref={ref}
      role="slider"
      aria-label={ariaLabel ?? 'Hue'}
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hsv.h)}
      tabIndex={0}
      data-ag-part="hue"
      className={cn('ag-color-picker-hue', className)}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 15 : 1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setHsv({ ...hsv, h: (hsv.h + step) % 360 }); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setHsv({ ...hsv, h: (hsv.h - step + 360) % 360 }); }
      }}
    >
      <span data-ag-part="hue-thumb" className="ag-color-picker-hue-thumb" style={{ insetInlineStart: `${(hsv.h / 360) * 100}%` }} />
    </div>
  );
}

export interface ChannelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onValueChange' | 'defaultValue'> {
  /** Channel to edit: hsv h/s/v or rgb r/g/b. */
  channel: 'h' | 's' | 'v' | 'r' | 'g' | 'b';
  'aria-label'?: string;
}

const CHANNEL_RANGE: Record<string, [number, number, number]> = {
  h: [0, 360, 1], s: [0, 100, 1], v: [0, 100, 1], r: [0, 255, 1], g: [0, 255, 1], b: [0, 255, 1],
};

function Channel({ channel, className, ref, 'aria-label': ariaLabel, ...rest }: ChannelProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const ctx = React.useContext(ColorCtx);
  if (!ctx) return null;
  const { hsv, setHsv } = ctx;
  const [min, max, step] = CHANNEL_RANGE[channel];
  const rgbFrom = (r: number, g: number, b: number) => {
    const nmx = Math.max(r, g, b), nmn = Math.min(r, g, b), d = nmx - nmn;
    let h = 0;
    if (d > 0) h = nmx === r ? 60 * (((g - b) / d) % 6) : nmx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
    const s = nmx === 0 ? 0 : d / nmx;
    return { h: (h + 360) % 360, s, v: nmx };
  };
  const get = () => {
    if (channel === 'h') return hsv.h;
    if (channel === 's') return hsv.s * 100;
    if (channel === 'v') return hsv.v * 100;
    const { r, g, b } = (() => { const [r, g, b] = hexToRgbInternal(hsvToHex(hsv)); return { r, g, b }; })();
    return channel === 'r' ? r : channel === 'g' ? g : b;
  };
  const set = (next: number) => {
    if (channel === 'h') setHsv({ ...hsv, h: next });
    else if (channel === 's') setHsv({ ...hsv, s: next / 100 });
    else if (channel === 'v') setHsv({ ...hsv, v: next / 100 });
    else {
      const [r, g, b] = hexToRgbInternal(hsvToHex(hsv));
      const n = rgbFrom(channel === 'r' ? next / 255 : r, channel === 'g' ? next / 255 : g, channel === 'b' ? next / 255 : b);
      setHsv(n);
    }
  };
  const labels: Record<string, string> = { h: 'Hue', s: 'Saturation', v: 'Brightness', r: 'Red', g: 'Green', b: 'Blue' };
  return (
    <div {...rest} ref={ref} data-ag-part="channel" data-ag-channel={channel} className={cn('ag-color-picker-channel', className)}>
      <Slider.Root
        value={get()}
        min={min}
        max={max}
        step={step}
        aria-label={ariaLabel ?? labels[channel]}
        onValueChange={(v) => set(Array.isArray(v) ? v[0] : v)}
      />
    </div>
  );
}

function hexToRgbInternal(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export interface AlphaProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onValueChange' | 'defaultValue'> {
  'aria-label'?: string;
}

function Alpha({ className, ref, 'aria-label': ariaLabel, ...rest }: AlphaProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const ctx = React.useContext(ColorCtx);
  if (!ctx) return null;
  return (
    <div {...rest} ref={ref} data-ag-part="alpha" className={cn('ag-color-picker-alpha', className)}>
      <Slider.Root
        value={ctx.alpha}
        min={0}
        max={1}
        step={0.01}
        aria-label={ariaLabel ?? 'Alpha'}
        onValueChange={(v) => ctx.setAlpha(Array.isArray(v) ? v[0] : v)}
      />
    </div>
  );
}

export interface InputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onValueChange' | 'defaultValue'> {
  'aria-label'?: string;
}

function Input({ className, ref, 'aria-label': ariaLabel, ...rest }: InputProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const ctx = React.useContext(ColorCtx);
  const [draft, setDraft] = React.useState<string | null>(null);
  const [invalid, setInvalid] = React.useState(false);
  if (!ctx) return null;
  const display = draft ?? ctx.serialized.value;
  const submit = (str: string) => {
    const ok = ctx.setColorString(str);
    setInvalid(!ok);
    setDraft(null);
  };
  return (
    <div {...rest} ref={ref} data-ag-part="input" className={cn('ag-color-picker-input', className)}>
      <input
        type="text"
        aria-label={ariaLabel ?? 'Color value'}
        aria-invalid={invalid || undefined}
        className="ag-color-picker-input-field"
        value={display}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(e.currentTarget.value); } }}
        onBlur={(e) => { if (draft !== null) submit(e.currentTarget.value); }}
      />
    </div>
  );
}

export const ColorPicker = { Root, Trigger, Content, Area, Hue, Channel, Alpha, Input };
