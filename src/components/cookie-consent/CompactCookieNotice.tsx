"use client";
import React, { forwardRef, useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { GlassButton as Button } from "../button";
import { Typography } from "../data-display/Typography";

import { useGalileoStateSpring } from "../../hooks/useGalileoStateSpring";
import { useAnimationContext } from "../../contexts/AnimationContext";
import {
  SpringConfig,
  SpringPresets,
} from "../../animations/physics/springPhysics";
import { ANIMATION } from "../../tokens/designConstants";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import styles from "./CompactCookieNotice.module.css";

interface CompactCookieNoticeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  position?:
    | "bottom"
    | "top"
    | "bottom-left"
    | "bottom-right"
    | "top-left"
    | "top-right";
  glassIntensity?: number;
  message?: string;
  acceptText?: string;
  declineText?: string;
  moreInfoText?: string;
  privacyPolicyUrl?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onMoreInfo?: () => void;
  theme?: unknown;
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
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const POSITION_CLASS_MAP: Record<
  NonNullable<CompactCookieNoticeProps["position"]>,
  string
> = {
  bottom: styles.positionBottom,
  top: styles.positionTop,
  "bottom-left": styles.positionBottomLeft,
  "bottom-right": styles.positionBottomRight,
  "top-left": styles.positionTopLeft,
  "top-right": styles.positionTopRight,
};

type CookieStyleVars = React.CSSProperties & {
  ["--cookie-blur-scale"]?: string | number;
  ["--cookie-box-shadow"]?: string;
};

/**
 * A compact cookie consent notice that takes minimal screen space
 */
export const CompactCookieNotice = forwardRef<
  HTMLDivElement,
  CompactCookieNoticeProps
>(
  (
    {
      message = "We use cookies for a better experience.",
      acceptText = "Accept",
      moreInfoText = "More Info",
      onAccept,
      onMoreInfo,
      style,
      className,
      glassIntensity = 0.6,
      position = "bottom-left",
      animate = true,
      ...rest
    }: CompactCookieNoticeProps,
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const { defaultSpring } = useAnimationContext();

    const shouldAnimate = animate && !prefersReducedMotion;

    useEffect(() => {
      // Check if user has already made a choice
      const consentValue = getCookie("cookie-consent");
      if (!consentValue) {
        // Show the notice
        setVisible(true);
      }
    }, []);

    const handleAccept = () => {
      setCookie("cookie-consent", "accepted", 365);
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
      if (typeof defaultSpring === "string" && defaultSpring in SpringPresets) {
        contextConfig =
          SpringPresets[defaultSpring as keyof typeof SpringPresets];
      } else if (typeof defaultSpring === "object") {
        contextConfig = defaultSpring ?? {};
      }
      return { ...baseConfig, ...contextConfig };
    }, [defaultSpring]);

    const isTop = position?.startsWith("top");
    const exitY = isTop ? -15 : 15;

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

    const positionClass =
      POSITION_CLASS_MAP[position ?? "bottom-left"] ??
      styles.positionBottomLeft;
    const depth = Math.max(0.5, Math.min(2, glassIntensity));
    const shadowDepth = (24 * depth).toFixed(2);
    const containerStyleVars: CookieStyleVars = {
      "--cookie-blur-scale": depth,
      "--cookie-box-shadow": `0 10px ${shadowDepth}px color-mix(in srgb, var(--glass-black) 16%, transparent)`,
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
        <Typography variant="p">{message}</Typography>

        <div className={styles.buttonGroup}>
          <Button variant="link" onClick={handleMoreInfo} size="sm">
            {moreInfoText}
          </Button>

          <Button variant="primary" onClick={handleAccept} size="sm">
            {acceptText}
          </Button>
        </div>
      </div>
    );
  }
);

CompactCookieNotice.displayName = "CompactCookieNotice";

// Glass version of the CompactCookieNotice
export const GlassCompactCookieNotice = forwardRef<
  HTMLDivElement,
  CompactCookieNoticeProps
>((props: CompactCookieNoticeProps, ref) => (
  <CompactCookieNotice ref={ref} glassIntensity={0.75} {...props} />
));

GlassCompactCookieNotice.displayName = "GlassCompactCookieNotice";
