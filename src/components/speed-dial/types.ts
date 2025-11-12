import React from 'react';
export interface SpeedDialProps {
  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Additional style properties
   */
  style?: React.CSSProperties;

  /**
   * The icon to display in the main button
   */
  icon?: React.ReactNode;

  /**
   * The speed dial actions
   */
  children?: React.ReactNode;

  /**
   * If true, the speed dial is open by default
   */
  defaultOpen?: boolean;

  /**
   * If defined, the speed dial is controlled externally
   */
  open?: boolean;

  /**
   * The direction of the speed dial actions
   */
  direction?: 'up' | 'down' | 'left' | 'right';

  /**
   * If true, the speed dial is disabled
   */
  disabled?: boolean;

  /**
   * Callback fired when the speed dial is opened
   */
  onOpen?: () => void;

  /**
   * Callback fired when the speed dial is closed
   */
  onClose?: () => void;

  /**
   * Callback fired when an action is clicked
   */
  onActionClick?: (event: React.MouseEvent<HTMLDivElement>, index: number) => void;

  /**
   * If true, the speed dial hides when scrolling
   */
  hideOnScroll?: boolean;

  /**
   * The position of the speed dial
   */
  position?: {
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
  
  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
};

  /**
   * The size of the speed dial
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * The color theme of the speed dial
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default';

  /**
   * If true, glass morphism styling is applied
   */
  glass?: boolean;

  /**
   * If true, glass morphism styling is applied to actions
   */
  glassActions?: boolean;

  /**
   * If true, tooltips are shown for actions
   */
  showTooltips?: boolean;

  /**
   * The aria-label for the speed dial
   */
  ariaLabel?: string;

  /**
   * If true, transition animations are enabled
   */
  transition?: boolean;
}

export interface SpeedDialActionProps {
  /**
   * The content of the action button
   */
  children?: React.ReactNode;

  /**
   * The tooltip text for the action
   */
  tooltip?: string;

  /**
   * The direction of the speed dial
   */
  direction?: 'up' | 'down' | 'left' | 'right';

  /**
   * The index of this action in the speed dial
   */
  index?: number;

  /**
   * The total number of actions in the speed dial
   */
  totalActions?: number;

  /**
   * The size of the action button
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * If true, the action is disabled
   */
  disabled?: boolean;

  /**
   * If true, the speed dial is open
   */
  open?: boolean;

  /**
   * Callback fired when the action is clicked
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Additional style properties
   */
  style?: React.CSSProperties;

  /**
   * Icon for the action
   */
  icon?: React.ReactNode;

  /**
   * If true, glass morphism styling is applied
   */
  glass?: boolean;

  /**
   * Animation configuration
   */
  animationConfig?: any;

  /**
   * If true, animation is disabled
   */
  disableAnimation?: boolean;

  /**
   * Motion sensitivity level
   */
  motionSensitivity?: number;

  /**
   * Tooltip title (alternative to tooltip)
   */
  tooltipTitle?: string;

  /**
   * If true, transition animations are enabled
   */
  transition?: boolean;

  /**
   * If true, tooltip is shown
   */
  showTooltip?: boolean;

  /**
   * Accessible label for the action
   */
  'aria-label'?: string;

  /**
   * Test ID for the component
   */
  'data-testid'?: string;
}

export interface SpeedDialIconProps {
  /**
   * Custom icon to display when the speed dial is closed
   */
  icon?: React.ReactNode;

  /**
   * Custom icon to display when the speed dial is open
   */
  openIcon?: React.ReactNode;

  /**
   * If true, the speed dial is open
   */
  open?: boolean;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Additional style properties
   */
  style?: React.CSSProperties;
}
