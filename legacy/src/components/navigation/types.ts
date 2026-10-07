import React from 'react';
// Navigation component types
export interface NavigationItem {
  id?: string;
  key: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: NavigationItem[];
  disabled?: boolean;
  badge?: string | number;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  tooltip?: string;
  href?: string;
  external?: boolean;
  customElement?: React.ReactNode;
}

export interface GlassNavigationProps {
  items?: NavigationItem[];
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'minimal' | 'prominent' | 'standard';
  glassIntensity?: number;
  sticky?: boolean;
  compact?: boolean;
  centered?: boolean;
  zIndex?: number;
  width?: string | number;
  maxWidth?: string | number;
  activeItem?: string;
  onItemClick?: (item: NavigationItem) => void;
  onMenuToggle?: (open: boolean) => void;
  showLabels?: boolean;
  showDivider?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  initialCollapsed?: boolean;
  initialExpandedItems?: string[];
  onCollapseChange?: (collapsed: boolean) => void;
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

// Tab bar specific types
export interface TabItem {
  id?: string;
  value?: string | number;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  href?: string;
  target?: string;
}

export interface ScrollPosition {
  x: number;
  y: number;
  left: number;
  top: number;
}

export interface ScrollAnimationRef {
  rafId: number | null;
  velocity: { x: number; y: number };
  timestamp: number;
  active: boolean;
}

export interface TabBarRef {
  getContainerElement: () => HTMLDivElement | null;
  getTabElements: () => (HTMLButtonElement | null)[];
  getTabElement: (index: number) => HTMLButtonElement | null;
  selectTab: (index: number) => void;
  scrollToTab: (index: number, smooth?: boolean) => void;
  toggleBadge: (index: number, show: boolean) => void;
  updateBadge: (index: number, value: number | string) => void;
  isScrolling: () => boolean;
  getActiveTab: () => number;
  setActiveTab: (index: number) => void;
}

export interface GlassTabBarProps {
  tabs?: TabItem[];
  activeTab?: number;
  onChange?: (event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
  onTabChange?: (index: number) => void;
  onTabClick?: (tab: TabItem, index: number) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline';
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
  animationStyle?: 'spring' | 'tween' | 'keyframes';
  physics?: {
    tension: number;
    friction: number;
    mass: number;
  };
  alignment?: 'start' | 'center' | 'end';
  color?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  centered?: boolean;
  scrollable?: boolean;
  showLabels?: boolean;
  elevated?: boolean;
  background?: boolean;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  showScrollButtons?: boolean;
  maxVisibleTabs?: number;
  animationEnabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onContextMenu?: React.MouseEventHandler<HTMLDivElement>;
  renderTab?: (tab: TabItem, index: number, isActive: boolean) => React.ReactNode;
  iconPosition?: 'top' | 'left' | 'right';
  verticalDisplayMode?: 'expanded' | 'compact';
  placement?: 'top' | 'bottom' | 'left' | 'right';
  responsiveOrientation?: 'horizontal' | 'vertical';
  responsiveConfig?: any;
  collapseTabs?: boolean;
  renderCollapsedMenu?: (tabs: TabItem[], activeTab: number, onSelect: (index: number) => void) => React.ReactNode;
  keyboardNavigation?: boolean;
  tabIndex?: number;
  ariaLabel?: string;
  tabStyle?: React.CSSProperties;
  tabClassName?: string;
  activeTabClassName?: string;
  defaultBadgeAnimation?: boolean;
  badgeStyle?: React.CSSProperties;
  animationConfig?: any;
  disableAnimation?: boolean;
}
