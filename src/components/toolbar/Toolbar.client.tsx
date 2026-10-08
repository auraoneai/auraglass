'use client';
import * as React from 'react';
import { Toolbar as Base } from '@base-ui/react/toolbar';
import { materialProps, SurfaceGroup } from '../../material';
import { cn } from '../../internal';
import { Button } from '../button/Button.client';
import { IconButton } from '../icon-button/IconButton.client';
import type {
  ToolbarRootProps, ToolbarButtonProps, ToolbarIconButtonProps,
  ToolbarGroupProps, ToolbarSeparatorProps, ToolbarLinkProps,
} from './Toolbar.types';

function ToolbarRoot({
  orientation = 'horizontal',
  loop = true,
  variant = 'regular',
  thickness = 'regular',
  prominent,
  refraction,
  className,
  children,
  ref,
  ...rest
}: ToolbarRootProps) {
  return (
    <SurfaceGroup className="ag-toolbar-surface">
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
        data-ag-shape={orientation === 'horizontal' ? 'capsule' : undefined}
        className={cn('ag-toolbar', className)}
        ref={ref}
      >
        {children}
      </Base.Root>
    </SurfaceGroup>
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

function ToolbarButton({ className, children, ...rest }: ToolbarButtonProps) {
  const { aura, dom } = splitButtonProps(rest as Record<string, unknown>);
  return (
    <Base.Button
      {...dom}
      render={<Button {...aura} data-ag-part="button" className={className}>{children}</Button>}
    />
  );
}

function ToolbarIconButton({ label, icon, className, ...rest }: ToolbarIconButtonProps) {
  const { aura, dom } = splitButtonProps(rest as Record<string, unknown>);
  return (
    <Base.Button
      {...dom}
      render={<IconButton {...aura} label={label} icon={icon} data-ag-part="button" className={className} />}
    />
  );
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
