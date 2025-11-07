import React, { forwardRef, useEffect, useState, useMemo, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { cn } from '@/lib/utils';

import { createGlassStyle } from '../../core/mixins/glassMixins';
import { createThemeContext } from '../../core/themeContext';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { GlassButton as Button } from '../button';
import { Typography } from '../data-display/Typography';

import { useGalileoStateSpring, GalileoStateSpringOptions } from '../../hooks/useGalileoStateSpring';
import { useAnimationContext } from '../../contexts/AnimationContext';
import { SpringConfig, SpringPresets } from '../../animations/physics/springPhysics';

interface CompactCookieNoticeProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: 'bottom' | 'top' | 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  glassIntensity?: number;
  message?: string;
  acceptText?: string;
  declineText?: string;
  moreInfoText?: string;
  privacyPolicyUrl?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onMoreInfo?: () => void;
  theme?: any;
  animate?: boolean;
}

// Cookie management utility
const setCookie = (name: string, value: string, days: number): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const StyledCompactCookieNotice = styled.div<{
  $position: CompactCookieNoticeProps['position'];
  $glassIntensity: number;
}>`
  position: fixed;
  z-index: 1000;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  box-sizing: border-box;
  width: auto;
  max-width: 100%;
  box-shadow: 0 2px 10px rgba(var(--glass-color-black) / var(--glass-opacity-10));
  will-change: transform, opacity;

  ${({ $position }) => {
    switch ($position) {
      case 'bottom':
        return `
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'top':
        return `
          top: 16px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'bottom-left':
        return `
          bottom: 16px;
          left: 16px;
        `;
      case 'bottom-right':
        return `
          bottom: 16px;
          right: 16px;
        `;
      case 'top-left':
        return `
          top: 16px;
          left: 16px;
        `;
      case 'top-right':
        return `
          top: 16px;
          right: 16px;
        `;
      default:
        return `
          bottom: 16px;
          left: 16px;
        `;
    }
  }}

  ${(props: any) => {
    const glassStyles = createGlassStyle({ elevation: 'level2', intent: 'neutral' });
    return Object.entries(glassStyles)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value};`)
      .join('');
  }}
  
  ${({ theme }) => `
    border: 1px solid var(--glass-bg-default);
  `}
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;

    ${({ $position }) =>
      ($position === 'top' || $position === 'bottom') &&
      `
        width: calc(100% - 32px);
        left: 16px;
        right: 16px;
        transform: none;
      `}
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;

  @media (max-width: 600px) {
    margin-left: 0;
    width: 100%;

    & > button {
      flex: 1;
    }
  }
`;

/**
 * A compact cookie consent notice that takes minimal screen space
 */
export const CompactCookieNotice = forwardRef<HTMLDivElement, CompactCookieNoticeProps>(
  (
    {
      message = 'We use cookies for a better experience.',
      acceptText = 'Accept',
      moreInfoText = 'More Info',
      onAccept,
      onMoreInfo,
      style,
      className,
      glassIntensity = 0.6,
      position = 'bottom-left',
      animate = true,
      ...rest
    }: CompactCookieNoticeProps,
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [isRendered, setIsRendered] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const { defaultSpring } = useAnimationContext();

    const shouldAnimate = animate && !prefersReducedMotion;

    useEffect(() => {
      // Check if user has already made a choice
      const consentValue = getCookie('cookie-consent');
      if (!consentValue) {
        // Show the notice
        setVisible(true);
      }
    }, []);

    const handleAccept = () => {
      setCookie('cookie-consent', 'accepted', 365);
      setVisible(false);
      if (onAccept) {
        onAccept();
      }
    };

    const handleMoreInfo = () => {
      if (onMoreInfo) {
        onMoreInfo();
      }
    };

    // --- Animation Setup ---
    const finalSpringConfig = useMemo(() => {
      const baseConfig: SpringConfig = SpringPresets.default;
      let contextConfig: Partial<SpringConfig> = {};
      if (typeof defaultSpring === 'string' && defaultSpring in SpringPresets) {
        contextConfig = SpringPresets[defaultSpring as keyof typeof SpringPresets];
      } else if (typeof defaultSpring === 'object') {
        contextConfig = defaultSpring ?? {};
      }
      return { ...baseConfig, ...contextConfig };
    }, [defaultSpring]);

    const isTop = position?.startsWith('top');
    const exitY = isTop ? -15 : 15;

    // Spring for Opacity
    const { value: animatedOpacity } = useGalileoStateSpring(visible ? 1 : 0, {
      ...finalSpringConfig,
      immediate: !shouldAnimate,
    });

    // Spring for TranslateY
    const { value: animatedTranslateY } = useGalileoStateSpring(visible ? 0 : exitY, {
      ...finalSpringConfig,
      immediate: !shouldAnimate,
    });

    // Immediately render when becoming visible
    useEffect(() => {
      if (visible) {
        setIsRendered(true);
      }
    }, [visible]);

    // Calculate transform
    const isCentered = position === 'top' || position === 'bottom';
    const animatedStyle: React.CSSProperties = {
      opacity: animatedOpacity,
      transform: `translateY(${animatedTranslateY}px)${isCentered ? ' translateX(-50%)' : ''}`,
    };

    if (!visible && !isRendered) {
      return null;
    }

    return (
      <StyledCompactCookieNotice
        ref={ref}
        $position={position}
        $glassIntensity={glassIntensity}
        className={className}
        style={{ ...style, ...animatedStyle }}
        aria-hidden={!visible}
        {...rest}
      >
        <Typography variant="p">
          {message}
        </Typography>

        <ButtonGroup>
          <Button variant="link" onClick={handleMoreInfo} size="sm">
            {moreInfoText}
          </Button>

          <Button variant="primary" onClick={handleAccept} size="sm">
            {acceptText}
          </Button>
        </ButtonGroup>
      </StyledCompactCookieNotice>
    );
  }
);

CompactCookieNotice.displayName = 'CompactCookieNotice';

// Glass version of the CompactCookieNotice
export const GlassCompactCookieNotice = forwardRef<HTMLDivElement, CompactCookieNoticeProps>(
  (props: CompactCookieNoticeProps, ref) => (
    <CompactCookieNotice ref={ref} glassIntensity={0.75} {...props} />
  )
);

GlassCompactCookieNotice.displayName = 'GlassCompactCookieNotice';
