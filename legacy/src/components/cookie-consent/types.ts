import React from "react";
export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required?: boolean;
  defaultEnabled?: boolean;
  cookies?: Array<{
    name: string;
    purpose: string;
    duration: string;
  }>;
}

export interface GlobalCookieConsentProps {
  title?: string;
  message?: string;
  position?:
    | "bottom"
    | "top"
    | "bottom-left"
    | "bottom-right"
    | "top-left"
    | "top-right";
  acceptButtonText?: string;
  declineButtonText?: string;
  settingsButtonText?: string;
  onAccept?: () => void;
  onDecline?: () => void;
  onSettings?: () => void;
  onSave?: (categories: string[]) => void;
  onCategoryChange?: (categories: string[]) => void;
  enableSettings?: boolean;
  glassIntensity?: number;
  privacyPolicyUrl?: string;
  privacyPolicyText?: string;
  animate?: boolean;
  delay?: number;
  timeout?: number;
  onTimeout?: () => void;
  dismissible?: boolean;
  cookieExpiration?: number;
  cookieCategories?: CookieCategory[];
  customContent?: React.ReactNode;
  initiallyExpanded?: boolean;
  useModalForDetails?: boolean;
  defaultSelectedCategories?: string[];
  forceVisible?: boolean;
  className?: string;
  style?: React.CSSProperties;
  animationConfig?: any;
  disableAnimation?: boolean;
  motionSensitivity?: number;
  theme?: any;

  /** Glass surface intent */
  intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";

  /** Glass surface elevation */
  elevation?: "level1" | "level2" | "level3" | "level4";

  /** Performance tier */
  tier?: "low" | "medium" | "high";
}
