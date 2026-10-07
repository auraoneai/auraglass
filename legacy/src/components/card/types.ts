import React from 'react';

export interface GlassCardVariant {
  default: 'default';
  elevated: 'elevated';
  outlined: 'outlined';
  filled: 'filled';
  glass: 'glass';
}

export type GlassCardVariantType = keyof GlassCardVariant;

export interface GlassCardSize {
  sm: 'sm';
  md: 'md';
  lg: 'lg';
  xl: 'xl';
}

export type GlassCardSizeType = keyof GlassCardSize;

export interface GlassCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'size'> {
  /** Card variant */
  variant?: GlassCardVariantType;

  /** Card size */
  size?: GlassCardSizeType;

  /** Glass morphism variant */
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';

  /** Blur strength */
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';

  /** Border radius */
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /** Enable hover effects */
  hoverable?: boolean;

  /** Hover elevation */
  hoverElevation?: number;

  /** Enable interactive effects */
  interactive?: boolean;

  /** Loading state */
  loading?: boolean;

  /** Custom styles */
  glassStyles?: React.CSSProperties;

  /** Card padding */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /** Children */
  children?: React.ReactNode;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

export interface GlassCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Header variant */
  variant?: 'default' | 'compact' | 'expanded';

  /** Show divider */
  divider?: boolean;

  /** Header actions */
  actions?: React.ReactNode;

  /** Custom styles */
  styles?: React.CSSProperties;
}

export interface GlassCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Title level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;

  /** Title variant */
  variant?: 'default' | 'muted' | 'accent';

  /** Title alignment */
  align?: 'left' | 'center' | 'right';

  /** Truncate long titles */
  truncate?: boolean;

  /** Maximum lines for truncation */
  maxLines?: number;
}

export interface GlassCardSubtitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Subtitle variant */
  variant?: 'default' | 'muted' | 'accent';

  /** Subtitle alignment */
  align?: 'left' | 'center' | 'right';
}

export interface GlassCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content padding */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';

  /** Content alignment */
  align?: 'left' | 'center' | 'right';

  /** Enable scrolling for overflow */
  scrollable?: boolean;

  /** Maximum height for scrolling */
  maxHeight?: string | number;
}

export interface GlassCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Footer variant */
  variant?: 'default' | 'compact' | 'expanded';

  /** Footer alignment */
  align?: 'left' | 'center' | 'right' | 'space-between';

  /** Show divider */
  divider?: boolean;

  /** Footer actions */
  actions?: React.ReactNode;
}

export interface GlassCardMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Media source */
  src?: string;

  /** Media alt text */
  alt?: string;

  /** Media aspect ratio */
  aspectRatio?: 'square' | 'video' | 'wide' | 'portrait' | number;

  /** Media position */
  position?: 'top' | 'bottom' | 'background';

  /** Enable overlay */
  overlay?: boolean;

  /** Overlay content */
  overlayContent?: React.ReactNode;

  /** Overlay opacity */
  overlayOpacity?: number;

  /** Enable hover zoom */
  hoverZoom?: boolean;

  /** Zoom scale */
  zoomScale?: number;
}

export interface GlassCardLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Link destination */
  href: string;

  /** Link target */
  target?: '_blank' | '_self' | '_parent' | '_top';

  /** Enable magnetic effect */
  magnetic?: boolean;

  /** Magnetic strength */
  magneticStrength?: number;

  /** Enable ripple effect */
  ripple?: boolean;

  /** Custom link styles */
  linkStyles?: React.CSSProperties;
}

// Card patterns and layouts
export interface CardPattern {
  name: string;
  layout: 'single' | 'grid' | 'masonry' | 'carousel';
  columns?: number;
  gap?: string | number;
  aspectRatio?: number;
  animation?: 'none' | 'stagger' | 'cascade' | 'parallax';
}

export interface CardGridProps {
  /** Grid pattern */
  pattern?: CardPattern;

  /** Cards to display */
  cards: React.ReactNode[];

  /** Grid columns */
  columns?: number | { sm: number; md: number; lg: number; xl: number };

  /** Grid gap */
  gap?: string | number;

  /** Enable responsive behavior */
  responsive?: boolean;

  /** Animation settings */
  animation?: {
    enabled: boolean;
    type: 'stagger' | 'cascade' | 'parallax';
    delay: number;
    duration: number;
  };
}

export interface CardMasonryProps {
  /** Masonry columns */
  columns?: number | { sm: number; md: number; lg: number; xl: number };

  /** Masonry gap */
  gap?: string | number;

  /** Cards to display */
  cards: React.ReactNode[];

  /** Enable responsive behavior */
  responsive?: boolean;
}

export interface CardCarouselProps {
  /** Carousel cards */
  cards: React.ReactNode[];

  /** Show dots indicator */
  showDots?: boolean;

  /** Show arrows */
  showArrows?: boolean;

  /** Enable autoplay */
  autoplay?: boolean;

  /** Autoplay delay */
  autoplayDelay?: number;

  /** Enable infinite loop */
  infinite?: boolean;

  /** Animation type */
  animation?: 'slide' | 'fade' | 'scale';

  /** Animation duration */
  animationDuration?: number;
}

// Theme integration types
export interface CardThemeTokens {
  colors: {
    background: Record<GlassCardVariantType, string>;
    border: Record<GlassCardVariantType, string>;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
  };
  spacing: {
    padding: Record<GlassCardSizeType, string>;
    margin: Record<GlassCardSizeType, string>;
    gap: string;
  };
  typography: {
    title: {
      fontSize: Record<GlassCardSizeType, string>;
      fontWeight: string | number;
      lineHeight: number;
    };
    subtitle: {
      fontSize: Record<GlassCardSizeType, string>;
      fontWeight: string | number;
      lineHeight: number;
    };
    body: {
      fontSize: string;
      lineHeight: number;
    };
  };
  effects: {
    borderRadius: Record<NonNullable<GlassCardProps['borderRadius']>, string>;
    boxShadow: Record<GlassCardVariantType, string>;
    backdropFilter: Record<NonNullable<GlassCardProps['blurStrength']>, string>;
    hover: {
      elevation: Record<GlassCardVariantType, string>;
      transform: string;
    };
  };
}

// Animation and interaction types
export interface CardAnimationConfig {
  /** Enable entrance animation */
  entrance?: boolean;

  /** Entrance animation type */
  entranceType?: 'fadeIn' | 'slideIn' | 'scaleIn' | 'bounceIn';

  /** Entrance animation duration */
  entranceDuration?: number;

  /** Stagger delay for multiple cards */
  staggerDelay?: number;

  /** Enable hover animations */
  hoverAnimations?: boolean;

  /** Hover animation type */
  hoverType?: 'lift' | 'glow' | 'scale' | 'tilt';

  /** Hover animation duration */
  hoverDuration?: number;

  /** Enable loading animations */
  loadingAnimations?: boolean;
}

export interface CardAccessibilityProps {
  /** ARIA label */
  'aria-label'?: string;

  /** ARIA description */
  'aria-describedby'?: string;

  /** ARIA role */
  role?: 'article' | 'region' | 'complementary' | 'main';

  /** Focus management */
  tabIndex?: number;

  /** Keyboard navigation */
  keyboardNavigation?: boolean;
}

// State types
export interface CardState {
  isHovered: boolean;
  isFocused: boolean;
  isLoading: boolean;
  isExpanded: boolean;
  isSelected: boolean;
}

// Event handler types
export interface CardEventHandlers {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onExpand?: (expanded: boolean) => void;
  onSelect?: (selected: boolean) => void;
}

// Ref types
export type GlassCardRef = React.RefObject<HTMLDivElement>;
export type GlassCardHeaderRef = React.RefObject<HTMLDivElement>;
export type GlassCardContentRef = React.RefObject<HTMLDivElement>;
export type GlassCardFooterRef = React.RefObject<HTMLDivElement>;

// Compound component types
export interface CardCompoundComponent {
  Root: React.ComponentType<GlassCardProps & CardAccessibilityProps>;
  Header: React.ComponentType<GlassCardHeaderProps>;
  Title: React.ComponentType<GlassCardTitleProps>;
  Subtitle: React.ComponentType<GlassCardSubtitleProps>;
  Content: React.ComponentType<GlassCardContentProps>;
  Footer: React.ComponentType<GlassCardFooterProps>;
  Media: React.ComponentType<GlassCardMediaProps>;
  Link: React.ComponentType<GlassCardLinkProps>;
  Grid: React.ComponentType<CardGridProps>;
  Masonry: React.ComponentType<CardMasonryProps>;
  Carousel: React.ComponentType<CardCarouselProps>;
}

// Utility types
export type CardComponentProps = GlassCardProps & CardAccessibilityProps & CardEventHandlers;

// All types are already exported as named exports above
