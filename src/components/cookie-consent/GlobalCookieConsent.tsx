// Typography tokens available via typography.css (imported in index.css)
import React, { forwardRef, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { cn } from '@/lib/utils';

import { createThemeContext } from '../../core/themeContext';
import { glassTokenUtils } from '../../tokens/glass';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useAnimationContext } from '../../contexts/AnimationContext';
import { Box } from '../layout/Box';
import { GlassButton as Button } from '../button';
import { Typography } from '../data-display/Typography';
import { GlassModal as Modal } from '../modal/GlassModal';
import { GlassCheckbox as Checkbox } from '../input/GlassCheckbox';

import { GlobalCookieConsentProps, CookieCategory } from './types';

// Cookie management utilities
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

// Physics/Animation Imports
import { useGalileoStateSpring, GalileoStateSpringOptions } from '../../hooks/useGalileoStateSpring';
import { SpringConfig, SpringPresets } from '../../animations/physics/springPhysics';

const StyledGlobalCookieConsent = styled.div<{
  $position: GlobalCookieConsentProps['position'];
  $glassIntensity: number;
}>`
  position: fixed;
  z-index: 1000;
  padding: 1.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
  box-shadow: var(--glass-elev-2);
  will-change: transform, opacity;

  ${({ $position }) => {
    switch ($position) {
      case 'bottom':
        return `
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'top':
        return `
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'bottom-left':
        return `
          bottom: 20px;
          left: 20px;
        `;
      case 'bottom-right':
        return `
          bottom: 20px;
          right: 20px;
        `;
      case 'top-left':
        return `
          top: 20px;
          left: 20px;
        `;
      case 'top-right':
        return `
          top: 20px;
          right: 20px;
        `;
      default:
        return `
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
        `;
    }
  }}

  background: var(--glass-bg-default);
  backdrop-filter: var(--glass-backdrop-blur);
  -webkit-backdrop-filter: var(--glass-backdrop-blur);
  border: 1px solid var(--glass-border-default);
  
  ${({ theme }) => `
    border: 1px solid var(--glass-border-hover);
  `}
  
  ${({ theme, $glassIntensity }) => `
    box-shadow: var(--glass-elev-2);
  `}
  
  @media (max-width: 540px) {
    max-width: 100%;
    width: calc(100% - 40px);
    left: 20px;
    right: 20px;
    transform: none;

    ${({ $position }) =>
      ($position === 'top' || $position === 'bottom') &&
      `
        left: 20px;
        right: 20px;
        width: calc(100% - 40px);
        transform: none;
      `}
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.25rem;
  justify-content: flex-end;

  @media (max-width: 540px) {
    flex-direction: column;

    & > button {
      width: 100%;
    }
  }
`;

const CategoryContainer = styled.div`
  margin-top: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${glassTokenUtils.getSurface('neutral', 'level1').surface.base};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${glassTokenUtils.getSurface('neutral', 'level1').border.color};
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--glass-bg-default);
  }
`;

const CategoryItem = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  background: var(--glass-bg-active);

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CategoryDescription = styled.div`
  margin-left: 2rem;
  font-size: 0.875rem;
  opacity: 0.85;
`;

const CookieDetailContainer = styled.div`
  margin-top: 0.75rem;
  margin-left: 2rem;
  padding: 0.5rem;
  font-size: 0.8rem;
  background: ${glassTokenUtils.getSurface('neutral', 'level1').surface.base};
  border-radius: 4px;
`;

const DetailsToggle = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 0.5rem;
  display: block;
  margin-left: 2rem;

  &:hover {
    opacity: 1;
  }
`;

/**
 * Global Cookie Consent component for comprehensive cookie consent management
 */
export const GlobalCookieConsent = forwardRef<HTMLDivElement, GlobalCookieConsentProps>(
  (
    {
      title = 'Manage Cookie Preferences',
      message = 'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.',
      position = 'bottom',
      acceptButtonText = 'Accept All',
      declineButtonText = 'Decline All',
      settingsButtonText = 'Save Preferences',
      onAccept,
      onDecline,
      onSave,
      onCategoryChange,
      enableSettings = true,
      glassIntensity = 0.8,
      privacyPolicyUrl,
      privacyPolicyText = 'Privacy Policy',
      className,
      animate = true,
      delay = 700,
      timeout = 0,
      onTimeout,
      dismissible = true,
      cookieExpiration = 365,
      style,
      cookieCategories = [],
      customContent,
      initiallyExpanded = false,
      useModalForDetails = false,
      defaultSelectedCategories = [],
      ...rest
    }: GlobalCookieConsentProps,
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState(initiallyExpanded);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [isRendered, setIsRendered] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const { defaultSpring } = useAnimationContext();

    const shouldAnimate = animate && !prefersReducedMotion;

    // Memoize initial categories to prevent infinite loops
    const initialCategories = useMemo(() => {
      const categories = [...defaultSelectedCategories];

      // Always include required categories
      cookieCategories
        .filter((category: any) => category.required)
        .forEach((category: any) => {
          if (!categories.includes(category.id)) {
            categories.push(category.id);
          }
        });

      return categories;
    }, [cookieCategories, defaultSelectedCategories]);

    // Track if categories have been initialized to prevent loops
    const categoriesInitialized = useRef(false);

    // Set initial selected categories only once
    useEffect(() => {
      if (!categoriesInitialized.current) {
        setSelectedCategories(initialCategories);
        categoriesInitialized.current = true;
      }
    }, [initialCategories]);

    // Check if consent was previously given
    useEffect(() => {
      const consentValue = getCookie('cookie-consent');
      if (!consentValue) {
        const timer = setTimeout(() => {
          setVisible(true);
        }, delay);

        return () => clearTimeout(timer);
      }
    }, [delay]);

    // Handle timeout
    useEffect(() => {
      if (visible && timeout > 0) {
        const timer = setTimeout(() => {
          setVisible(false);
          if (onTimeout) {
            onTimeout();
          }
        }, timeout);

        return () => clearTimeout(timer);
      }
    }, [visible, timeout, onTimeout]);

    const handleToggleCategory = (categoryId: string, required = false) => {
      if (required) return; // Can't toggle required categories

      setSelectedCategories(prevSelected => {
        const newSelected = prevSelected.includes(categoryId)
          ? prevSelected.filter((id: any) => id !== categoryId)
          : [...prevSelected, categoryId];

        if (onCategoryChange) {
          onCategoryChange(newSelected);
        }

        return newSelected;
      });
    };

    const handleAcceptAll = () => {
      const allCategoryIds = cookieCategories.map((category: any) => category.id);
      setCookie('cookie-consent', 'accepted', cookieExpiration);
      setCookie('cookie-categories', JSON.stringify(allCategoryIds), cookieExpiration);
      setVisible(false);

      if (onAccept) {
        onAccept();
      }
    };

    const handleDeclineAll = () => {
      // Only include required categories when declining all
      const requiredCategoryIds = cookieCategories
        .filter((category: any) => category.required)
        .map((category: any) => category.id);

      setCookie('cookie-consent', 'declined', cookieExpiration);
      setCookie('cookie-categories', JSON.stringify(requiredCategoryIds), cookieExpiration);
      setVisible(false);

      if (onDecline) {
        onDecline();
      }
    };

    const handleSavePreferences = () => {
      setCookie('cookie-consent', 'customized', cookieExpiration);
      setCookie('cookie-categories', JSON.stringify(selectedCategories), cookieExpiration);
      setVisible(false);

      if (onSave) {
        onSave(selectedCategories);
      }
    };

    const toggleExpanded = () => {
      setExpanded(!expanded);
    };

    const handleShowDetails = () => {
      if (useModalForDetails) {
        setShowDetailsModal(true);
      } else {
        setExpanded(true);
      }
    };

    // Calculate final spring config
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
    const exitY = isTop ? -30 : 30; // Use 30px like original CSS

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

    // Create the categories section
    const renderCategories = () => (
      <CategoryContainer>
        {cookieCategories.map((category: any) => (
          <CategoryItem key={category.id}>
            <CategoryHeader>
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleToggleCategory(category.id, category.required)}
                disabled={category.required}
              />
              <Typography variant="span" className="font-semibold">
                {category.name} {category.required && <em>(Required)</em>}
              </Typography>
            </CategoryHeader>

            <CategoryDescription>
              <Typography variant="p">{category.description}</Typography>
            </CategoryDescription>

            {category.cookies && category.cookies.length > 0 && (
              <>
                <DetailsToggle
                  aria-expanded={expanded}
                  aria-controls="cookie-details"
                  onClick={(e) => {
                    // Logic to show cookie details could be expanded here
                  }}
                >
                  Show cookie details
                </DetailsToggle>

                {/* Cookie details could be expanded here */}
              </>
            )}
          </CategoryItem>
        ))}
      </CategoryContainer>
    );

    return (
      <>
        <StyledGlobalCookieConsent
          ref={ref}
          $position={position}
          $glassIntensity={glassIntensity}
          className={className}
          style={{ ...style, ...animatedStyle }}
          aria-hidden={!visible}
          {...rest}
        >
          <Box>
            <Typography variant="h6" className="mb-2 font-semibold">
              {title}
            </Typography>

            <Typography variant="p">
              {message}
              {privacyPolicyUrl && (
                <>
                  {' '}
                  <a href={privacyPolicyUrl} target="_blank" rel="noopener noreferrer">
                    {privacyPolicyText}
                  </a>
                </>
              )}
            </Typography>

            {customContent && <Box className="glass-mt-4">{customContent}</Box>}

            {!expanded && cookieCategories.length > 0 && (
              <Button variant="ghost" onClick={handleShowDetails} size="sm">
                Customize settings
              </Button>
            )}

            {(expanded || initiallyExpanded) && cookieCategories.length > 0 && (
              <div id="cookie-details">{renderCategories()}</div>
            )}

            <ButtonContainer>
              {dismissible && (
                <Button variant="outline" onClick={handleDeclineAll} size="sm">
                  {declineButtonText}
                </Button>
              )}

              {expanded && enableSettings && (
                <Button variant="outline" onClick={handleSavePreferences} size="sm">
                  {settingsButtonText}
                </Button>
              )}

              <Button variant="primary" onClick={handleAcceptAll} size="sm">
                {acceptButtonText}
              </Button>
            </ButtonContainer>
          </Box>
        </StyledGlobalCookieConsent>

        {useModalForDetails && (
          <Modal open={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
            <div className="dialog-container">
              <div className="dialog-header">
                <Typography variant="h6">Cookie Settings</Typography>
                <Button variant="ghost" onClick={(e) => setShowDetailsModal(false)}>
                  ×
                </Button>
              </div>
              <div className="dialog-content">{renderCategories()}</div>
              <div className="dialog-actions">
                <Button variant="outline" onClick={(e) => setShowDetailsModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={(e) => {
                    handleSavePreferences();
                    setShowDetailsModal(false);
                  }}
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </>
    );
  }
);

GlobalCookieConsent.displayName = 'GlobalCookieConsent';

// Glass version of the GlobalCookieConsent
export const GlassGlobalCookieConsent = forwardRef<HTMLDivElement, GlobalCookieConsentProps>(
  (props: GlobalCookieConsentProps, ref) => (
    <GlobalCookieConsent ref={ref} glassIntensity={0.9} {...props} />
  )
);

GlassGlobalCookieConsent.displayName = 'GlassGlobalCookieConsent';
