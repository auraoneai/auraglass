'use client';
// Typography tokens available via typography.css (imported in index.css)
import React, {
  forwardRef,
  useEffect,
  useState,
  useMemo,
} from "react";
import { cn } from "@/lib/utils";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Box } from "../layout/Box";
import { GlassButton as Button } from "../button";
import { Typography } from "../data-display/Typography";
// Import correct path for glowEffects

import { GlobalCookieConsentProps as CookieConsentProps } from "./types";
import styles from "./CookieConsent.module.css";

// Physics/Animation Imports
import {
  useGalileoStateSpring,
} from "../../hooks/useGalileoStateSpring";
import { useAnimationContext } from "../../contexts/AnimationContext";
import {
  SpringConfig,
  SpringPresets,
} from "../../animations/physics/springPhysics";

// Cookie management utility
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

const POSITION_CLASS_MAP: Record<
  NonNullable<CookieConsentProps["position"]>,
  string
> = {
  bottom: styles.positionCenterBottom,
  top: styles.positionCenterTop,
  "bottom-left": styles.positionBottomLeft,
  "bottom-right": styles.positionBottomRight,
  "top-left": styles.positionTopLeft,
  "top-right": styles.positionTopRight,
};

type CookieConsentStyleVars = React.CSSProperties & {
  ['--cookie-blur-scale']?: string | number;
  ['--cookie-box-shadow']?: string;
};

/**
 * Cookie Consent component for displaying cookie consent banners
 */
export const CookieConsent = forwardRef<HTMLDivElement, CookieConsentProps>(
  (
    {
      title = "Cookie Consent",
      message = "We use cookies to improve your experience on our site.",
      position = "bottom-right",
      acceptButtonText = "Accept",
      declineButtonText = "Decline",
      settingsButtonText = "Customize",
      onAccept,
      onDecline,
      onSettings,
      enableSettings = false,
      glassIntensity = 0.7,
      privacyPolicyUrl,
      privacyPolicyText = "Privacy Policy",
      className,
      animate = true,
      delay = 500,
      timeout = 0,
      onTimeout,
      dismissible = true,
      cookieExpiration = 365,
      style,
      animationConfig,
      disableAnimation,
      motionSensitivity,
      ...rest
    }: CookieConsentProps,
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const { defaultSpring } = useAnimationContext();

    const finalDisableAnimation = disableAnimation ?? prefersReducedMotion;
    const shouldAnimate = animate && !finalDisableAnimation;

    useEffect(() => {
      // Check if user has already made a choice
      const consentValue = getCookie("cookie-consent");
      if (!consentValue) {
        // Show the consent banner after delay
        const timer = setTimeout(() => {
          setVisible(true);
        }, delay);

        return () => clearTimeout(timer);
      }
    }, [delay]);

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

    const finalSpringConfig = useMemo(() => {
      const baseConfig: SpringConfig = SpringPresets.default;
      let contextConfig: Partial<SpringConfig> = {};
      const contextSource = defaultSpring;
      if (typeof contextSource === "string" && contextSource in SpringPresets) {
        contextConfig =
          SpringPresets[contextSource as keyof typeof SpringPresets];
      } else if (typeof contextSource === "object") {
        contextConfig = contextSource ?? {};
      }
      let propConfig = {};
      const propSource = animationConfig;
      if (typeof propSource === "string" && propSource in SpringPresets) {
        propConfig = SpringPresets[propSource as keyof typeof SpringPresets];
      } else if (
        typeof propSource === "object" &&
        ("tension" in propSource || "friction" in propSource)
      ) {
        propConfig = propSource as Partial<SpringConfig>;
      }
      return { ...baseConfig, ...contextConfig, ...propConfig };
    }, [defaultSpring, animationConfig]);

    const isTop = position?.startsWith("top");
    const exitY = isTop ? -20 : 20;

    const { value: animatedOpacity } = useGalileoStateSpring(visible ? 1 : 0, {
      ...finalSpringConfig,
      immediate: !shouldAnimate,
    });

    const { value: animatedTranslateY } = useGalileoStateSpring(
      visible ? 0 : exitY,
      {
        ...finalSpringConfig,
        immediate: !shouldAnimate,
      }
    );

    const positionClass = POSITION_CLASS_MAP[position ?? "bottom-right"] ?? styles.positionBottomRight;
    const depth = Math.max(0.5, Math.min(2, glassIntensity));
    const shadowDepth = (28 * depth).toFixed(2);
    const containerStyleVars: CookieConsentStyleVars = {
      "--cookie-blur-scale": depth,
      "--cookie-box-shadow": `0 12px ${shadowDepth}px rgba(15, 23, 42, 0.18)`,
    };

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

    return (
      <div
        ref={ref}
        className={cn(styles.container, positionClass, className)}
        style={{ ...containerStyleVars, ...animatedStyle, ...style }}
        aria-hidden={!visible}
        {...rest}
      >
        <Box>
          {title && (
            <Typography variant="h6" className='mb-2 font-semibold'>
              {title}
            </Typography>
          )}

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

          <div className={styles.buttonContainer}>
            {dismissible && (
              <Button
                variant="outline"
                onClick={onDecline}
                size="sm"
                className="glass-focus glass-touch-target"
              >
                {declineButtonText}
              </Button>
            )}

            {enableSettings && (
              <Button
                variant="outline"
                onClick={onSettings}
                size="sm"
                className="glass-focus glass-touch-target"
              >
                {settingsButtonText}
              </Button>
            )}

            <Button
              variant="primary"
              onClick={onAccept}
              size="sm"
              className="glass-focus glass-touch-target"
            >
              {acceptButtonText}
            </Button>
          </div>
        </Box>
      </div>
    );
  }
);

CookieConsent.displayName = "CookieConsent";

// Glass version of the CookieConsent component
export const GlassCookieConsent = forwardRef<
  HTMLDivElement,
  CookieConsentProps
>((props: CookieConsentProps, ref) => (
  <CookieConsent ref={ref} glassIntensity={0.8} {...props} />
));

GlassCookieConsent.displayName = "GlassCookieConsent";
