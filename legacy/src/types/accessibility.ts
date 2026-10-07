import React from 'react';
// Accessibility type definitions
export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  focusVisible: boolean;
  colorBlindFriendly: boolean;
  largeText: boolean;
}

export type AriaRole =
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'button'
  | 'cell'
  | 'checkbox'
  | 'columnheader'
  | 'combobox'
  | 'complementary'
  | 'contentinfo'
  | 'definition'
  | 'dialog'
  | 'directory'
  | 'document'
  | 'feed'
  | 'figure'
  | 'form'
  | 'grid'
  | 'gridcell'
  | 'group'
  | 'heading'
  | 'img'
  | 'link'
  | 'list'
  | 'listbox'
  | 'listitem'
  | 'log'
  | 'main'
  | 'marquee'
  | 'math'
  | 'meter'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'presentation'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'search'
  | 'searchbox'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'switch'
  | 'tab'
  | 'table'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'textbox'
  | 'timer'
  | 'toolbar'
  | 'tooltip'
  | 'tree'
  | 'treegrid'
  | 'treeitem';

export type AriaLive = 'off' | 'assertive' | 'polite';

export type AriaCurrent = boolean | 'page' | 'step' | 'location' | 'date' | 'time';

export interface AriaProps {
  role?: AriaRole;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-details'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | AriaRole;
  'aria-hidden'?: boolean;
  'aria-live'?: AriaLive;
  'aria-atomic'?: boolean;
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
  'aria-autocomplete'?: 'none' | 'inline' | 'list' | 'both';
  'aria-checked'?: boolean | 'mixed';
  'aria-current'?: AriaCurrent;
  'aria-disabled'?: boolean;
  'aria-errormessage'?: string;
  'aria-flowto'?: string;
  'aria-invalid'?: boolean | 'grammar' | 'spelling';
  'aria-keyshortcuts'?: string;
  'aria-level'?: number;
  'aria-modal'?: boolean;
  'aria-multiline'?: boolean;
  'aria-multiselectable'?: boolean;
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-owns'?: string;
  'aria-placeholder'?: string;
  'aria-posinset'?: number;
  'aria-pressed'?: boolean;
  'aria-readonly'?: boolean;
  'aria-required'?: boolean;
  'aria-roledescription'?: string;
  'aria-rowcount'?: number;
  'aria-rowindex'?: number;
  'aria-rowspan'?: number;
  'aria-selected'?: boolean;
  'aria-setsize'?: number;
  'aria-sort'?: 'none' | 'ascending' | 'descending' | 'other';
  'aria-valuemax'?: number;
  'aria-valuemin'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
}

export interface FocusableProps {
  tabIndex?: number;
  autoFocus?: boolean;
  onFocus?: React.FocusEventHandler;
  onBlur?: React.FocusEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
  onKeyUp?: React.KeyboardEventHandler;
  onKeyPress?: React.KeyboardEventHandler;
}

export interface KeyboardNavigationProps {
  arrowNavigation?: boolean;
  homeEndNavigation?: boolean;
  pageUpDownNavigation?: boolean;
  escapeHandler?: () => void;
  enterHandler?: () => void;
  spaceHandler?: () => void;
}

export interface ScreenReaderProps {
  announceOnMount?: string;
  announceOnUnmount?: string;
  announceOnUpdate?: string;
  liveRegion?: AriaLive;
  atomic?: boolean;
}

export interface FocusManagementProps {
  initialFocusRef?: React.RefObject<HTMLElement>;
  restoreFocus?: boolean;
  restoreFocusRef?: React.RefObject<HTMLElement>;
  autoFocus?: boolean;
  trapFocus?: boolean;
  clickOutsideToClose?: boolean;
}