/* CMP-273..280 (REQ-CMP-102/103/104/105/22): Menu/ContextMenu/Menubar prop
   types. BU render-prop shapes declared locally (foundation pattern). */
import type * as React from 'react';
import type { OverlayOpenChangeDetails } from '../overlays/_shared/overlayTypes';

type RenderProp = React.ReactElement | ((props: any) => React.ReactElement);

export interface MenuRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: ((open: boolean, details: OverlayOpenChangeDetails) => void) | undefined;
  /** wrap arrow-key navigation — default true */
  loop?: boolean | undefined;
  orientation?: 'horizontal' | 'vertical' | undefined;
  children?: React.ReactNode;
}

export interface MenuTriggerProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
  disabled?: boolean | undefined;
  /** hover-open — dev warning outside Menubar contexts */
  openOnHover?: boolean | undefined;
  delay?: number | undefined;
  children?: React.ReactNode;
}

export interface MenuPortalProps {
  children?: React.ReactNode;
  keepMounted?: boolean | undefined;
}

export interface MenuPositionerProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: RenderProp | undefined;
  side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end' | undefined;
  align?: 'start' | 'center' | 'end' | undefined;
  sideOffset?: number | undefined;
  children?: React.ReactNode;
}

export interface MenuPopupProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: RenderProp | undefined;
  children?: React.ReactNode;
}

export interface MenuArrowProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
}

export interface MenuItemProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
  /** aria-disabled, still focusable per APG */
  disabled?: boolean | undefined;
  /** false → tabIndex -1 so the disabled item leaves the tab/roving order */
  focusableWhenDisabled?: boolean | undefined;
  closeOnClick?: boolean | undefined;
  /** text used by typeahead when children aren't plain text */
  label?: string | undefined;
  /** e.g. "Ctrl+S" — renders as kbd + aria-keyshortcuts on the item */
  shortcut?: string | undefined;
  children?: React.ReactNode;
}

export interface MenuLinkItemProps extends MenuItemProps {
  href?: string | undefined;
  target?: string | undefined;
  rel?: string | undefined;
}

export interface MenuCheckboxItemProps extends MenuItemProps {
  checked?: boolean | 'indeterminate' | undefined;
  defaultChecked?: boolean | undefined;
  onCheckedChange?: ((checked: boolean | 'indeterminate') => void) | undefined;
}

export interface MenuCheckboxItemIndicatorProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
  children?: React.ReactNode;
}

export interface MenuRadioGroupProps {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: ((value: string) => void) | undefined;
  children?: React.ReactNode;
}

export interface MenuRadioItemProps extends MenuItemProps {
  value: string;
}

export interface MenuRadioItemIndicatorProps extends MenuCheckboxItemIndicatorProps {}

export interface MenuGroupProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
  children?: React.ReactNode;
}

export interface MenuGroupLabelProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
  children?: React.ReactNode;
}

export interface MenuSeparatorProps extends React.HTMLAttributes<HTMLElement> {
  render?: RenderProp | undefined;
}

export interface MenuSubmenuProps extends MenuRootProps {}

export interface MenuSubmenuTriggerProps extends MenuItemProps {}

export interface ContextMenuRootProps extends Omit<MenuRootProps, 'orientation'> {}

export interface ContextMenuTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  render?: RenderProp | undefined;
  children?: React.ReactNode;
}

export interface MenubarProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical' | undefined;
  children?: React.ReactNode;
}
