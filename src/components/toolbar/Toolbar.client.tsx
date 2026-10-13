'use client';
import { MenuPortal, MenuPositioner, MenuPopup } from '../menu/Menu.client';
import * as React from 'react';
import { Toolbar as Base } from '@base-ui/react/toolbar';
import { componentMaterialProps } from '../../material/internal';
import { surfaceGroupAttributes } from '../../material/stateAttributes';
import { cn } from '../../internal';
import { Button } from '../button/Button.client';
import { IconButton } from '../icon-button/IconButton.client';
import { Menu } from '../menu/Menu.client';
import type {
  ToolbarRootProps, ToolbarButtonProps, ToolbarIconButtonProps,
  ToolbarGroupProps, ToolbarSeparatorProps, ToolbarLinkProps,
} from './Toolbar.types';

/* REQ-CMP-40 overflow: below its content width, the top-level items with
   priority="low" leave the bar and move into a trailing "More actions" Menu
   whose trigger is itself a toolbar item, so the roving order stays the
   inline items followed by the trigger. A CSS container query cannot compare
   an element with its own content width (an inline-size container's width
   may not depend on its content), so one ResizeObserver measures the bar's
   full content width while expanded against the inline space its parent
   offers. Nothing new is emitted: the low items simply unmount. */
function availableInline(root: HTMLElement): number {
  const parent = root.parentElement;
  if (!parent) return Number.POSITIVE_INFINITY;
  const cs = getComputedStyle(parent);
  let avail = parent.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
  /* in a flex row the bar shares the line with its siblings */
  if (/flex/.test(cs.display) && !/column/.test(cs.flexDirection) && !/wrap/.test(cs.flexWrap)) {
    const gap = parseFloat(cs.columnGap) || 0;
    for (const sib of Array.from(parent.children)) {
      if (sib === root || !(sib instanceof HTMLElement)) continue;
      const ss = getComputedStyle(sib);
      if (ss.display === 'none' || ss.position === 'absolute' || ss.position === 'fixed') continue;
      avail -= sib.getBoundingClientRect().width + (parseFloat(ss.marginLeft) || 0) + (parseFloat(ss.marginRight) || 0) + gap;
    }
  }
  return avail;
}

/* REQ-CMP-40: Home/End jump to the first/last roving item. Base UI's
   Toolbar composite leaves Home/End off, so the root handles them: focusing
   an item moves Base UI's roving stop with it. Disabled items are skipped
   unless focusableWhenDisabled (Base UI marks those data-focusable). */
const ROVING = 'button, a[href], input, select, textarea, [tabindex]';
function rovingItems(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(ROVING)).filter((el) => {
    if (el.closest('[role="toolbar"]') !== root) return false;
    if (el.closest('[data-ag-part="hit-area"]')) return false;
    const disabled = el.hasAttribute('disabled') || el.hasAttribute('data-disabled') || el.getAttribute('aria-disabled') === 'true';
    return !disabled || el.hasAttribute('data-focusable');
  });
}

function onHomeEnd(e: React.KeyboardEvent<HTMLElement>): void {
  if (e.defaultPrevented || (e.key !== 'Home' && e.key !== 'End') || e.altKey || e.ctrlKey || e.metaKey) return;
  const target = e.target as HTMLElement;
  /* text fields keep Home/End for the caret */
  if (target.matches('input, textarea, select, [contenteditable="true"]')) return;
  const items = rovingItems(e.currentTarget);
  const next = e.key === 'Home' ? items[0] : items[items.length - 1];
  if (!next) return;
  e.preventDefault();
  next.focus();
}

function useToolbarOverflow(enabled: boolean): [boolean, (el: HTMLDivElement | null) => void] {
  const [collapsed, setCollapsed] = React.useState(false);
  const [el, setEl] = React.useState<HTMLDivElement | null>(null);
  const needed = React.useRef(0);
  const collapsedRef = React.useRef(false);
  React.useLayoutEffect(() => { collapsedRef.current = collapsed; }, [collapsed]);
  React.useLayoutEffect(() => {
    if (!enabled || !el || typeof ResizeObserver === 'undefined') {
      if (collapsedRef.current) setCollapsed(false);
      return;
    }
    const measure = () => {
      /* content width is only knowable while every item is inline */
      if (!collapsedRef.current) needed.current = el.scrollWidth;
      const next = needed.current > availableInline(el) + 0.5;
      if (next !== collapsedRef.current) setCollapsed(next);
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    measure();
    return () => ro.disconnect();
  }, [enabled, el]);
  return [collapsed && enabled, setEl];
}

function ToolbarRoot({
  orientation = 'horizontal',
  loop = true,
  spacing = '2',
  variant = 'regular',
  thickness,
  prominent,
  refraction,
  className,
  children,
  ref,
  ...rest
}: ToolbarRootProps) {
  const lows = lowPriorityItems(children);
  const [collapsed, setOverflowEl] = useToolbarOverflow(orientation === 'horizontal' && lows.length > 0);
  const setRefs = React.useCallback((el: HTMLDivElement | null) => {
    setOverflowEl(el);
    let cleanup: unknown;
    if (typeof ref === 'function') cleanup = ref(el);
    else if (ref) ref.current = el;
    if (!el) return undefined;
    return () => {
      setOverflowEl(null);
      if (typeof cleanup === 'function') (cleanup as () => void)();
      else if (typeof ref === 'function') ref(null);
      else if (ref) ref.current = null;
    };
  }, [ref, setOverflowEl]);
  const inline = collapsed
    ? React.Children.map(children, (child) =>
        React.isValidElement(child) && (child.props as Record<string, unknown>).priority === 'low' ? null : child)
    : children;
  /* REQ-CMP-37: the root IS the SurfaceGroup — merged attrs (chrome surface,
     data-ag-group, data-ag-spacing, shape=capsule when horizontal), no nested
     wrapper element. */
  return (
    <Base.Root
      {...rest}
      render={rest.render as React.ComponentProps<typeof Base.Root>['render']}
      {...componentMaterialProps({
        layer: 'chrome',
        variant,
        ...(thickness !== undefined ? { thickness } : {}),
        ...(orientation === 'horizontal' ? { shape: 'capsule' as const } : {}),
        ...(prominent === true ? { prominent } : {}),
        ...(refraction === true ? { refraction } : {}),
      }, 'bar') /* REQ-MAT-23 (D-07): bar size class -> regular thickness */}
      {...surfaceGroupAttributes(spacing)}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        (rest as { onKeyDown?: React.KeyboardEventHandler<HTMLDivElement> }).onKeyDown?.(e);
        onHomeEnd(e);
      }}
      orientation={orientation}
      loopFocus={loop}
      data-ag-part="root"
      className={cn('ag-toolbar', 'ag-surface', className)}
      ref={setRefs}
    >
      {inline}
      {collapsed ? (
        <span data-ag-part="overflow">
          <Menu.Root>
            <Base.Button
              render={
                <Menu.Trigger
                  render={<IconButton label="More actions" icon={<span aria-hidden="true">⋯</span>} size="sm" />}
                />
              }
            />
            <MenuPortal>
              <MenuPositioner>
                <MenuPopup>
                  {lows.map((it) => (
                    <Menu.Item disabled={it.disabled} key={it.key} onClick={it.onClick as React.MouseEventHandler | undefined}>
                      {it.icon}{it.label}
                    </Menu.Item>
                  ))}
                </MenuPopup>
              </MenuPositioner>
            </MenuPortal>
          </Menu.Root>
        </span>
      ) : null}
    </Base.Root>
  );
}

/* AuraGlass props go to our Button via `render`; only DOM/Base props go to Toolbar.Button. */
const AURA_PROPS = [
  'variant', 'thickness', 'prominent', 'intent', 'size', 'refraction', 'loading',
  'startIcon', 'endIcon', 'pressed', 'defaultPressed', 'onPressedChange', 'pointerLight',
  'focusableWhenDisabled',
] as const;

function splitButtonProps(props: Record<string, unknown>) {
  const aura: Record<string, unknown> = {};
  const dom: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if ((AURA_PROPS as readonly string[]).includes(k)) aura[k] = v;
    else dom[k] = v;
  }
  return { aura, dom };
}

function ToolbarButton({ className, children, priority, render, ...rest }: ToolbarButtonProps) {
  const { aura, dom } = splitButtonProps(rest as Record<string, unknown>);
  /* REQ-CMP-40: disabled items are skipped by the roving focus unless
     focusableWhenDisabled (Base UI's toolbar default is true). */
  dom['focusableWhenDisabled'] = rest.focusableWhenDisabled === true;
  /* REQ-CMP-37: icon actions are `Toolbar.Button render={<IconButton …/>}` — a caller
     element replaces the default Button and receives the AuraGlass props and the part. */
  const el = React.isValidElement<Record<string, unknown>>(render)
    ? React.cloneElement(render, { ...aura, 'data-ag-part': 'button', ...(priority === 'low' ? { 'data-priority': 'low' } : {}), ...(className !== undefined ? { className } : {}) })
    : <Button {...aura} data-ag-part="button" {...(priority === 'low' ? { 'data-priority': 'low' } : {})} className={className}>{children}</Button>;
  return <Base.Button {...dom} render={el} />;
}

function ToolbarIconButton({ label, icon, className, priority, ...rest }: ToolbarIconButtonProps) {
  const { aura, dom } = splitButtonProps(rest as Record<string, unknown>);
  dom['focusableWhenDisabled'] = rest.focusableWhenDisabled === true;
  return (
    <Base.Button
      {...dom}
      render={<IconButton {...aura} label={label} icon={icon} data-ag-part="button" {...(priority === 'low' ? { 'data-priority': 'low' } : {})} className={className} />}
    />
  );
}

/* REQ-CMP-40: the top-level priority="low" items, as Menu.Item data. */
function lowPriorityItems(children: React.ReactNode) {
  const items: { key: React.Key; label: React.ReactNode; onClick?: unknown; disabled?: boolean; icon?: React.ReactNode }[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as Record<string, unknown>;
    if (props.priority !== 'low') return;
    const isIconBtn = 'icon' in props || 'label' in props;
    items.push({
      key: child.key ?? items.length,
      label: isIconBtn ? (props.label as React.ReactNode) : (props.children as React.ReactNode),
      onClick: props.onClick,
      disabled: props.disabled === true,
      icon: props.icon as React.ReactNode | undefined,
    });
  });
  return items;
}

function ToolbarGroup({ className, children, ref }: ToolbarGroupProps) {
  return (
    <Base.Group data-ag-part="group" className={cn('ag-toolbar-group', className)} ref={ref}>
      {children}
    </Base.Group>
  );
}

function ToolbarSeparator({ orientation, className, ref }: ToolbarSeparatorProps) {
  return (
    <Base.Separator
      data-ag-part="separator"
      orientation={orientation}
      className={cn('ag-toolbar-separator', className)}
      ref={ref}
    />
  );
}

function ToolbarLink({ className, children, ref, ...rest }: ToolbarLinkProps) {
  return (
    <Base.Link
      {...rest}
      data-ag-part="link"
      data-ag-focus-inset=""
      className={cn('ag-toolbar-link', className)}
      ref={ref}
    >
      {children}
    </Base.Link>
  );
}

export const Toolbar = {
  Root: ToolbarRoot,
  Button: ToolbarButton,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator,
  Link: ToolbarLink,
};

/** Not contract surface (REQ-CMP-06/-37): in-repo composition only; public icon actions use
    `Toolbar.Button render={<IconButton …/>}`. */
export { ToolbarIconButton };
