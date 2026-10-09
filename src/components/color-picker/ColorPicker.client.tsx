/* CMP-319: ColorPicker — Trigger + Popover content (PRD-09 seam). Area is a
   single focusable role='slider' with aria-roledescription='2D slider'
   (arrows step s/v, PageUp/PageDown coarse); Hue is a horizontal slider.
   Value is hex; hsv/oklch helpers live in ./colors. */
"use client";
import * as React from "react";
import { cn } from "../../internal/index";
import { Popover } from "../popover";
import { hexToHsv, hsvToHex, type Hsv } from "./colors";

interface Ctx {
  hsv: Hsv;
  setHsv: (h: Hsv, commit?: boolean) => void;
  hex: string;
  setHex: (hex: string) => void;
}
const ColorCtx = React.createContext<Ctx | null>(null);

export interface ColorPickerRootProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string, details: { committed: boolean }) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, details: unknown) => void;
}

function Root({
  value,
  defaultValue = "#3b82f6", // @ag-literal-allowed: product-default-swatch
  onValueChange,
  open,
  defaultOpen,
  onOpenChange,
  children,
  className,
  ref,
  ...rest
}: ColorPickerRootProps & { ref?: React.Ref<HTMLSpanElement> | undefined }) {
  const [uncontrolled, setUncontrolled] = React.useState(() =>
    hexToHsv(defaultValue)
  );
  const hsv = value !== undefined ? hexToHsv(value) : uncontrolled;
  const hex = hsvToHex(hsv);
  const ctx = React.useMemo<Ctx>(
    () => ({
      hsv,
      hex,
      setHsv: (next, commit = true) => {
        if (value === undefined) setUncontrolled(next);
        onValueChange?.(hsvToHex(next), { committed: commit });
      },
      setHex: (next) => {
        if (/^#[0-9a-fA-F]{6}$/.test(next)) {
          const h = hexToHsv(next);
          if (value === undefined) setUncontrolled(h);
          onValueChange?.(next.toLowerCase(), { committed: true });
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hsv.h, hsv.s, hsv.v, value]
  );
  return (
    <ColorCtx.Provider value={ctx}>
      <Popover.Root
        {...(open !== undefined ? { open } : {})}
        {...(defaultOpen !== undefined ? { defaultOpen } : {})}
        onOpenChange={onOpenChange}
      >
        <span
          {...rest}
          ref={ref}
          data-ag-part="root"
          className={cn("ag-color-picker", className)}
        >
          {children}
        </span>
      </Popover.Root>
    </ColorCtx.Provider>
  );
}

function Trigger({
  className,
  ref,
  ...rest
}: React.ComponentProps<typeof Popover.Trigger>) {
  const ctx = React.useContext(ColorCtx);
  return (
    <Popover.Trigger
      {...rest}
      ref={ref}
      data-ag-part="trigger"
      className={cn("ag-color-picker-trigger", className)}
    >
      <span
        data-ag-part="swatch"
        className="ag-color-picker-swatch"
        style={{ backgroundColor: ctx?.hex }}
        aria-hidden="true"
      />
      {rest.children ?? ctx?.hex}
    </Popover.Trigger>
  );
}

function Content(props: React.ComponentProps<typeof Popover.Content>) {
  const { children, ...rest } = props;
  return (
    <Popover.Portal>
      <Popover.Positioner
        {...rest}
        className={cn("ag-color-picker-content", rest.className)}
      >
        <Popover.Popup>{children}</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  );
}

export interface AreaProps extends React.HTMLAttributes<HTMLDivElement> {
  "aria-label"?: string;
}

function Area({
  className,
  ref,
  "aria-label": ariaLabel,
  ...rest
}: AreaProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const ctx = React.useContext(ColorCtx);
  if (!ctx) return null;
  const { hsv, setHsv } = ctx;
  const move = (ds: number, dv: number, e: React.KeyboardEvent) => {
    e.preventDefault();
    setHsv({
      ...hsv,
      s: Math.min(1, Math.max(0, hsv.s + ds)),
      v: Math.min(1, Math.max(0, hsv.v + dv)),
    });
  };
  const point = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const s = Math.min(
      1,
      Math.max(0, (e.clientX - r.left) / Math.max(1, r.width))
    );
    const v = Math.min(
      1,
      Math.max(0, 1 - (e.clientY - r.top) / Math.max(1, r.height))
    );
    setHsv({ ...hsv, s, v });
  };
  return (
    <div
      {...rest}
      ref={ref}
      role="slider"
      aria-roledescription="2D slider"
      aria-label={ariaLabel ?? "Saturation and brightness"}
      aria-valuetext={`saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
      tabIndex={0}
      data-ag-part="area"
      className={cn("ag-color-picker-area", className)}
      style={{
        backgroundColor: hsvToHex({ h: hsv.h, s: 1, v: 1 }),
        ...rest.style,
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId);
        point(e);
      }}
      onPointerMove={(e) => {
        if (e.buttons === 1) point(e);
      }}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 0.1 : 0.01;
        if (e.key === "ArrowRight") move(step, 0, e);
        else if (e.key === "ArrowLeft") move(-step, 0, e);
        else if (e.key === "ArrowUp") move(0, step, e);
        else if (e.key === "ArrowDown") move(0, -step, e);
        else if (e.key === "PageUp") {
          e.preventDefault();
          setHsv({ ...hsv, v: 1 });
        } else if (e.key === "PageDown") {
          e.preventDefault();
          setHsv({ ...hsv, v: 0 });
        }
      }}
    >
      <span
        data-ag-part="area-thumb"
        className="ag-color-picker-area-thumb"
        style={{
          insetInlineStart: `${hsv.s * 100}%`,
          insetBlockStart: `${(1 - hsv.v) * 100}%`,
        }}
      />
    </div>
  );
}

function Hue({
  className,
  ref,
  "aria-label": ariaLabel,
  ...rest
}: AreaProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const ctx = React.useContext(ColorCtx);
  if (!ctx) return null;
  const { hsv, setHsv } = ctx;
  return (
    <div
      {...rest}
      ref={ref}
      role="slider"
      aria-label={ariaLabel ?? "Hue"}
      aria-orientation="horizontal"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hsv.h)}
      tabIndex={0}
      data-ag-part="hue"
      className={cn("ag-color-picker-hue", className)}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 15 : 1;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          setHsv({ ...hsv, h: (hsv.h + step) % 360 });
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          setHsv({ ...hsv, h: (hsv.h - step + 360) % 360 });
        }
      }}
    >
      <span
        data-ag-part="hue-thumb"
        className="ag-color-picker-hue-thumb"
        style={{ insetInlineStart: `${(hsv.h / 360) * 100}%` }}
      />
    </div>
  );
}

export const ColorPicker = { Root, Trigger, Content, Area, Hue };
