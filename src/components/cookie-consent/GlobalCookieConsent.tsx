'use client';
// Typography tokens available via typography.css (imported in index.css)
import React, {
  forwardRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import styles from "./GlobalCookieConsent.module.css";

import { createThemeContext } from "../../core/themeContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useAnimationContext } from "../../contexts/AnimationContext";
import { Box } from "../layout/Box";
import { GlassButton as Button } from "../button";
import { Typography } from "../data-display/Typography";
import { GlassModal as Modal } from "../modal/GlassModal";
import { GlassCheckbox as Checkbox } from "../input/GlassCheckbox";

import { GlobalCookieConsentProps, CookieCategory } from "./types";

// Cookie management utilities
const setCookie = (name: string, value: string, days: number): void => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

// Physics/Animation Imports
import {
  useGalileoStateSpring,
  GalileoStateSpringOptions,
} from "../../hooks/useGalileoStateSpring";
import {
  SpringConfig,
  SpringPresets,
} from "../../animations/physics/springPhysics";

const POSITION_CLASS_MAP: Record<
  NonNullable<GlobalCookieConsentProps["position"]>,
  string
> = {
  bottom: styles.positionCenterBottom,
  top: styles.positionCenterTop,
  "bottom-left": styles.positionBottomLeft,
  "bottom-right": styles.positionBottomRight,
  "top-left": styles.positionTopLeft,
  "top-right": styles.positionTopRight,
};

/**
 * Global Cookie Consent component for comprehensive cookie consent management
 */
export const GlobalCookieConsent = forwardRef<
  HTMLDivElement,
  GlobalCookieConsentProps
>(
  (
    {
      title = "Manage Cookie Preferences",
      message = "We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.",
      position = "bottom",
      acceptButtonText = "Accept All",
      declineButtonText = "Decline All",
      settingsButtonText = "Save Preferences",
      onAccept,
      onDecline,
      onSave,
      onCategoryChange,
      enableSettings = true,
      glassIntensity = 0.8,
      privacyPolicyUrl,
      privacyPolicyText = "Privacy Policy",
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
      const consentValue = getCookie("cookie-consent");
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

      setSelectedCategories((prevSelected) => {
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
      const allCategoryIds = cookieCategories.map(
        (category: any) => category.id
      );
      setCookie("cookie-consent", "accepted", cookieExpiration);
      setCookie(
        "cookie-categories",
        JSON.stringify(allCategoryIds),
        cookieExpiration
      );
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

      setCookie("cookie-consent", "declined", cookieExpiration);
      setCookie(
        "cookie-categories",
        JSON.stringify(requiredCategoryIds),
        cookieExpiration
      );
      setVisible(false);

      if (onDecline) {
        onDecline();
      }
    };

    const handleSavePreferences = () => {
      setCookie("cookie-consent", "customized", cookieExpiration);
      setCookie(
        "cookie-categories",
        JSON.stringify(selectedCategories),
        cookieExpiration
      );
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
      if (typeof defaultSpring === "string" && defaultSpring in SpringPresets) {
        contextConfig =
          SpringPresets[defaultSpring as keyof typeof SpringPresets];
      } else if (typeof defaultSpring === "object") {
        contextConfig = defaultSpring ?? {};
      }
      return { ...baseConfig, ...contextConfig };
    }, [defaultSpring]);

    const positionClass = useMemo(() => {
      const key = position ?? "bottom";
      return POSITION_CLASS_MAP[key] ?? styles.positionCenterBottom;
    }, [position]);

    const containerStyleVars = useMemo<React.CSSProperties>(() => {
      const depth = Math.max(0.5, Math.min(2, glassIntensity));
      const shadowDepth = (32 * depth).toFixed(2);
      return {
        "--cookie-blur-scale": depth,
        "--cookie-box-shadow": `0 12px ${shadowDepth}px rgba(15, 23, 42, 0.18)`,
      } as React.CSSProperties;
    }, [glassIntensity]);

    const isTop = position?.startsWith("top");
    const exitY = isTop ? -30 : 30; // Use 30px like original CSS

    // Spring for Opacity
    const { value: animatedOpacity } = useGalileoStateSpring(visible ? 1 : 0, {
      ...finalSpringConfig,
      immediate: !shouldAnimate,
    });

    // Spring for TranslateY
    const { value: animatedTranslateY } = useGalileoStateSpring(
      visible ? 0 : exitY,
      {
        ...finalSpringConfig,
        immediate: !shouldAnimate,
      }
    );

    // Calculate transform
    const isCentered = position === "top" || position === "bottom";
    const animatedStyle: React.CSSProperties = {
      opacity: animatedOpacity,
      transform: `translateY(${animatedTranslateY}px)${isCentered ? " translateX(-50%)" : ""}`,
    };
    if (!visible) {
      return (
        <div
          ref={ref}
          className={cn(styles.container, positionClass, className)}
          style={{ ...containerStyleVars, display: "none", ...style }}
          aria-hidden
          {...rest}
        />
      );
    }

    // Create the categories section
    const renderCategories = () => (
      <div className={styles.categoryContainer}>
        {cookieCategories.map((category: any) => (
          <div key={category.id} className={styles.categoryItem}>
            <div className={styles.categoryHeader}>
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() =>
                  handleToggleCategory(category.id, category.required)
                }
                disabled={category.required}
              />
              <Typography variant="span" className='font-semibold'>
                {category.name} {category.required && <em>(Required)</em>}
              </Typography>
            </div>

            <div className={styles.categoryDescription}>
              <Typography variant="p">{category.description}</Typography>
            </div>

            {category.cookies && category.cookies.length > 0 && (
              <>
                <button
                  type="button"
                  className={styles.detailsToggle}
                  aria-expanded={expanded}
                  aria-controls="cookie-details"
                  onClick={(e) => {
                    // Logic to show cookie details could be expanded here
                  }}
                >
                  Show cookie details
                </button>

                {/* Cookie details could be expanded here */}
              </>
            )}
          </div>
        ))}
      </div>
    );

    return (
      <>
        <div
          ref={ref}
          className={cn(styles.container, positionClass, className)}
          style={{ ...containerStyleVars, ...animatedStyle, ...style }}
          aria-hidden={!visible}
          {...rest}
        >
          <Box>
            <Typography variant="h6" className='mb-2 font-semibold'>
              {title}
            </Typography>

            <Typography variant="p">
              {message}
              {privacyPolicyUrl && (
                <>
                  {" "}
                  <a
                    href={privacyPolicyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-focus glass-touch-target glass-contrast-guard"
                  >
                    {privacyPolicyText}
                  </a>
                </>
              )}
            </Typography>

            {customContent && <Box className="glass-mt-4">{customContent}</Box>}

            {!expanded && cookieCategories.length > 0 && (
              <Button
                variant="ghost"
                onClick={handleShowDetails}
                size="sm"
                className="glass-focus glass-touch-target"
              >
                Customize settings
              </Button>
            )}

            {(expanded || initiallyExpanded) && cookieCategories.length > 0 && (
              <div id="cookie-details">{renderCategories()}</div>
            )}

            <div className={styles.buttonContainer}>
              {dismissible && (
                <Button
                  variant="outline"
                  onClick={handleDeclineAll}
                  size="sm"
                  className="glass-focus glass-touch-target"
                >
                  {declineButtonText}
                </Button>
              )}

              {expanded && enableSettings && (
                <Button
                  variant="outline"
                  onClick={handleSavePreferences}
                  size="sm"
                  className="glass-focus glass-touch-target"
                >
                  {settingsButtonText}
                </Button>
              )}

              <Button
                variant="primary"
                onClick={handleAcceptAll}
                size="sm"
                className="glass-focus glass-touch-target"
              >
                {acceptButtonText}
              </Button>
            </div>
          </Box>
        </div>

        {useModalForDetails && (
          <Modal
            open={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
          >
            <div className='dialog-container'>
              <div className='dialog-header'>
                <Typography variant="h6">Cookie Settings</Typography>
                <Button
                  variant="ghost"
                  onClick={(e) => setShowDetailsModal(false)}
                  className="glass-focus glass-touch-target"
                >
                  ×
                </Button>
              </div>
              <div className='dialog-content'>{renderCategories()}</div>
              <div className='dialog-actions'>
                <Button
                  variant="outline"
                  onClick={(e) => setShowDetailsModal(false)}
                  className="glass-focus glass-touch-target"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={(e) => {
                    handleSavePreferences();
                    setShowDetailsModal(false);
                  }}
                  className="glass-focus glass-touch-target"
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

GlobalCookieConsent.displayName = "GlobalCookieConsent";

// Glass version of the GlobalCookieConsent
export const GlassGlobalCookieConsent = forwardRef<
  HTMLDivElement,
  GlobalCookieConsentProps
>((props: GlobalCookieConsentProps, ref) => (
  <GlobalCookieConsent ref={ref} glassIntensity={0.9} {...props} />
));

GlassGlobalCookieConsent.displayName = "GlassGlobalCookieConsent";
