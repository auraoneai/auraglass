import * as React from 'react';
import { Toolbar as Base } from '@base-ui/react/toolbar';
import { materialProps } from '../../material';
import { cn } from '../../internal';
import { Button } from '../button/Button.client';
import { IconButton } from '../icon-button/IconButton.client';
import { Menu } from '../menu/Menu.client';
import type {
  ToolbarRootProps, ToolbarButtonProps, ToolbarIconButtonProps,
  ToolbarGroupProps, ToolbarSeparatorProps, ToolbarLinkProps,
} from './Toolbar.types';

function ToolbarRoot({
  orientation = 'horizontal',
  loop = true,
  spacing = '2',
  variant = 'regular',
  thickness = 'regular',
  prominent,
  refraction,
  className,
  children,
  ref,
  ...rest
}: ToolbarRootProps) {
  /* REQ-CMP-37: the root IS the SurfaceGroup — merged attrs (chrome surface,
     data-ag-group, data-ag-spacing, shape=capsule when horizontal), no nested
     wrapper element. */
  return (
    <Base.Root
      {...rest}
      render={rest.render as React.ComponentProps<typeof Base.Root>['render']}
      {...materialProps({
        layer: 'chrome',
        variant,
        thickness,
        ...(prominent === true ? { prominent } : {}),
        ...(refraction === true ? { refraction } : {}),
      })}
      orientation={orientation}
      data-ag-part="root"
      data-ag-group=""
      data-ag-spacing={spacing}
      data-ag-shape={orientation === 'horizontal' ? 'capsule' : undefined}
      className={cn('ag-toolbar', 'ag-surface', 'ag-toolbar-surface', className)}
      ref={ref}
    >
      {children}
      {lowPriorityItems(children).length > 0 ? (
        <span data-ag-part="overflow" className="ag-toolbar-overflow">
          <Menu.Root>
            <Menu.Trigger>
              <IconButton label="More actions" icon={<span aria-hidden="true">⋯</span>} size="sm" />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner>
                <Menu.Popup>
                  {lowPriorityItems(children).map((it) => (
                    <Menu.Item key={it.key} onClick={it.onClick as React.MouseEventHandler | undefined}>
                      {it.icon}{it.label}
                    </Menu.Item>
                  ))}
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
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

function ToolbarButton({ className, children, priority, ...rest }: ToolbarButtonProps) {
  const { aura, dom } = splitButtonProps(rest as Record<string, unknown>);
  return (
    <Base.Button
      {...dom}
      render={<Button {...aura} data-ag-part="button" {...(priority === 'low' ? { 'data-ag-priority': 'low' } : {})} className={className}>{children}</Button>}
    />
  );
}

function ToolbarIconButton({ label, icon, className, priority, ...rest }: ToolbarIconButtonProps) {
  const { aura, dom } = splitButtonProps(rest as Record<string, unknown>);
  return (
    <Base.Button
      {...dom}
      render={<IconButton {...aura} label={label} icon={icon} data-ag-part="button" {...(priority === 'low' ? { 'data-ag-priority': 'low' } : {})} className={className} />}
    />
  );
}

/* REQ-CMP-40 overflow: low-priority children render both inline (hidden by
   the container query at narrow widths) and as Menu.Items inside the
   trailing overflow Menu — roving order is consistent because the Menu
   trigger is simply the last tabbable element in the toolbar. */
function lowPriorityItems(children: React.ReactNode) {
  const items: { key: React.Key; label: React.ReactNode; onClick?: unknown; icon?: React.ReactNode }[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    const props = child.props as Record<string, unknown>;
    if (props.priority !== 'low') return;
    const isIconBtn = 'icon' in props || 'label' in props;
    items.push({
      key: child.key ?? items.length,
      label: isIconBtn ? (props.label as React.ReactNode) : (props.children as React.ReactNode),
      onClick: props.onClick,
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
  IconButton: ToolbarIconButton,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator,
  Link: ToolbarLink,
};
