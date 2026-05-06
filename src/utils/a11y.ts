/**
 * AuraGlass Accessibility Utilities
 * WCAG 2.1 AA compliance and accessibility helpers
 */

import { useId, useState, useEffect, useRef, useCallback } from "react";

type DebouncedCallback<TArgs extends unknown[]> = (...args: TArgs) => void;

/**
 * ARIA role mappings for interactive elements
 */
export const ARIA_ROLES = {
  button: "button",
  link: "link",
  menu: "menu",
  menuitem: "menuitem",
  menubar: "menubar",
  menuitemcheckbox: "menuitemcheckbox",
  menuitemradio: "menuitemradio",
  dialog: "dialog",
  alert: "alert",
  alertdialog: "alertdialog",
  tab: "tab",
  tablist: "tablist",
  tabpanel: "tabpanel",
  navigation: "navigation",
  complementary: "complementary",
  main: "main",
  search: "search",
  form: "form",
  region: "region",
  combobox: "combobox",
  listbox: "listbox",
  option: "option",
  group: "group",
  radiogroup: "radiogroup",
  checkbox: "checkbox",
  radio: "radio",
  switch: "switch",
  slider: "slider",
  spinbutton: "spinbutton",
  progressbar: "progressbar",
  status: "status",
  log: "log",
  marquee: "marquee",
  timer: "timer",
} as const;

/**
 * Generate unique IDs for ARIA relationships
 */
export function generateAriaId(prefix = "glass"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Comprehensive ARIA attributes interface
 */
export interface AriaProps {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?:
    | boolean
    | "false"
    | "true"
    | "menu"
    | "listbox"
    | "tree"
    | "grid"
    | "dialog";
  "aria-pressed"?: boolean;
  "aria-checked"?: boolean | "mixed";
  "aria-selected"?: boolean;
  "aria-disabled"?: boolean;
  "aria-hidden"?: boolean;
  "aria-live"?: "polite" | "assertive" | "off";
  "aria-atomic"?: boolean;
  "aria-busy"?: boolean;
  "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";
  "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling";
  "aria-required"?: boolean;
  "aria-controls"?: string;
  "aria-owns"?: string;
  "aria-activedescendant"?: string;
  "aria-modal"?: boolean;
  "aria-multiline"?: boolean;
  "aria-multiselectable"?: boolean;
  "aria-readonly"?: boolean;
  "aria-autocomplete"?: "none" | "inline" | "list" | "both";
  "aria-orientation"?: "horizontal" | "vertical";
  "aria-sort"?: "none" | "ascending" | "descending" | "other";
  "aria-valuemin"?: number;
  "aria-valuemax"?: number;
  "aria-valuenow"?: number;
  "aria-valuetext"?: string;
  "aria-posinset"?: number;
  "aria-setsize"?: number;
  "aria-level"?: number;
  "aria-rowcount"?: number;
  "aria-colcount"?: number;
  "aria-rowindex"?: number;
  "aria-colindex"?: number;
  "aria-colspan"?: number;
  "aria-rowspan"?: number;
  "aria-errormessage"?: string;
}

export function buildAriaProps(options: {
  role?: string;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  expanded?: boolean;
  disabled?: boolean;
  pressed?: boolean;
  checked?: boolean;
  invalid?: boolean;
  required?: boolean;
}): AriaProps {
  const props: AriaProps = {};

  if (options.role) props.role = options.role;
  if (options.label) props["aria-label"] = options.label;
  if (options.labelledBy) props["aria-labelledby"] = options.labelledBy;
  if (options.describedBy) props["aria-describedby"] = options.describedBy;
  if (options.expanded !== undefined) props["aria-expanded"] = options.expanded;
  if (options.disabled !== undefined) props["aria-disabled"] = options.disabled;
  if (options.pressed !== undefined) props["aria-pressed"] = options.pressed;
  if (options.checked !== undefined) props["aria-checked"] = options.checked;
  if (options.invalid !== undefined) props["aria-invalid"] = options.invalid;
  if (options.required !== undefined) props["aria-required"] = options.required;

  return props;
}

/**
 * Check if an element is visible to screen readers
 */
export function isAriaVisible(element: HTMLElement): boolean {
  // Check aria-hidden
  if (element.getAttribute("aria-hidden") === "true") return false;

  // Check parent aria-hidden
  let parent = element.parentElement;
  while (parent) {
    if (parent.getAttribute("aria-hidden") === "true") return false;
    parent = parent.parentElement;
  }

  // Check CSS visibility
  const styles = window.getComputedStyle(element);
  if (styles.display === "none" || styles.visibility === "hidden") return false;

  return true;
}

/**
 * Manage live regions for dynamic content
 */
export class LiveRegion {
  private element: HTMLDivElement;
  private queue: string[] = [];
  private isProcessing = false;

  constructor(priority: "polite" | "assertive" = "polite") {
    this.element = document.createElement("div");
    this.element.setAttribute("role", "status");
    this.element.setAttribute("aria-live", priority);
    this.element.setAttribute("aria-atomic", "true");
    this.element.className = "glass-sr-only"; // Visually hidden
    this.element.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(this.element);
  }

  announce(message: string) {
    this.queue.push(message);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const message = this.queue.shift()!;

    // Clear and set new message
    this.element.textContent = "";
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.element.textContent = message;

    // Wait before processing next
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.isProcessing = false;

    // Process next message
    this.processQueue();
  }

  destroy() {
    document.body.removeChild(this.element);
  }
}

/**
 * Keyboard navigation helpers
 */
export const KEYS = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
  PAGE_UP: "PageUp",
  PAGE_DOWN: "PageDown",
} as const;

/**
 * Check if keyboard event is a navigation key
 */
export function isNavigationKey(key: string): boolean {
  const navigationKeys: readonly string[] = [
    KEYS.TAB,
    KEYS.ARROW_UP,
    KEYS.ARROW_DOWN,
    KEYS.ARROW_LEFT,
    KEYS.ARROW_RIGHT,
    KEYS.HOME,
    KEYS.END,
    KEYS.PAGE_UP,
    KEYS.PAGE_DOWN,
  ];
  return navigationKeys.includes(key);
}

/**
 * Check if keyboard event is an activation key
 */
export function isActivationKey(key: string): boolean {
  return key === KEYS.ENTER || key === KEYS.SPACE;
}

/**
 * Ensure minimum touch target size (WCAG 2.5.5)
 */
export function ensureMinimumTouchTarget(element: HTMLElement, minSize = 44) {
  const rect = element.getBoundingClientRect();

  if (rect.width < minSize || rect.height < minSize) {
    // Add padding to meet minimum size
    const paddingX = Math.max(0, (minSize - rect.width) / 2);
    const paddingY = Math.max(0, (minSize - rect.height) / 2);

    element.style.padding = `${paddingY}px ${paddingX}px`;
  }
}

/**
 * Make element screen reader only
 */
export function srOnly(element: HTMLElement) {
  element.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  `;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  return window.matchMedia("(prefers-contrast: high)").matches;
}

/**
 * Create skip link for keyboard navigation
 */
export function createSkipLink(
  targetId: string,
  text = "Skip to main content"
): HTMLAnchorElement {
  const link = document.createElement("a");
  link.href = `#${targetId}`;
  link.textContent = text;
  link.className = "glass-skip-link";
  link.style.cssText = `
    position: absolute;
    left: -10000px;
    top: auto;
    width: 1px;
    height: 1px;
    overflow: hidden;
  `;

  // Show on focus
  link.addEventListener("focus", () => {
    link.style.cssText = `
      position: absolute;
      left: 50%;
      top: 10px;
      transform: translateX(-50%);
      z-index: 100000;
      padding: 8px 16px;
      background: var(--glass-bg-strong);
      border: 2px solid var(--glass-border-strong);
      border-radius: var(--glass-radius-md);
      color: var(--glass-text-primary);
      text-decoration: none;
      /* Backdrop blur via tokenized surfaces */
    `;
  });

  link.addEventListener("blur", () => {
    link.style.cssText = `
      position: absolute;
      left: -10000px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
  });

  return link;
}

/**
 * Debounce function for reducing announcement frequency
 */
export function debounceAnnouncement<TArgs extends unknown[]>(
  func: DebouncedCallback<TArgs>,
  delay = 500
) {
  let timeoutId: NodeJS.Timeout;

  return (...args: TArgs) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Format number for screen reader announcement
 */
export function formatNumberForAnnouncement(num: number): string {
  // Add spaces between digits for better pronunciation
  return num.toString().split("").join(" ");
}

/**
 * Build descriptive text for complex UI elements
 */
export function buildDescription(parts: (string | undefined)[]): string {
  return parts.filter(Boolean).join(", ");
}

/**
 * React hook for generating consistent accessibility IDs
 */
export const useA11yId = (prefix?: string): string => {
  const id = useId();
  return prefix ? `${prefix}-${id}` : id;
};

/**
 * Form field accessibility helpers
 */
export interface FormFieldA11yProps extends AriaProps {
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-required"?: boolean;
  "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling";
  "aria-errormessage"?: string;
}

export function createFormFieldA11y(options: {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  labelId?: string;
  descriptionId?: string;
  errorId?: string;
}): FormFieldA11yProps {
  const {
    id,
    label,
    description,
    error,
    required = false,
    invalid = false,
    disabled = false,
    labelId,
    descriptionId,
    errorId,
  } = options;

  const attrs: FormFieldA11yProps = {};

  if (id) attrs.id = id;
  if (label && !labelId) attrs["aria-label"] = label;
  if (labelId) attrs["aria-labelledby"] = labelId;
  if (required) attrs["aria-required"] = true;
  if (invalid) attrs["aria-invalid"] = true;
  if (disabled) attrs["aria-disabled"] = true;

  // Build describedby from available descriptions
  const describedByIds = [];
  if (description && descriptionId) describedByIds.push(descriptionId);
  if (error && errorId) describedByIds.push(errorId);
  if (describedByIds.length > 0) {
    attrs["aria-describedby"] = describedByIds.join(" ");
  }

  if (error && errorId) {
    attrs["aria-errormessage"] = errorId;
  }

  return attrs;
}

/**
 * Button accessibility helpers
 */
export interface ButtonA11yProps extends AriaProps {
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-pressed"?: boolean;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-haspopup"?:
    | boolean
    | "false"
    | "true"
    | "menu"
    | "listbox"
    | "tree"
    | "grid"
    | "dialog";
}

export function createButtonA11y(options: {
  id?: string;
  label?: string;
  description?: string;
  pressed?: boolean;
  expanded?: boolean;
  controls?: string;
  haspopup?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog";
  disabled?: boolean;
  descriptionId?: string;
}): ButtonA11yProps {
  const {
    id,
    label,
    description,
    pressed,
    expanded,
    controls,
    haspopup,
    disabled = false,
    descriptionId,
  } = options;

  const attrs: ButtonA11yProps = {};

  if (id) attrs.id = id;
  if (label) attrs["aria-label"] = label;
  if (description && descriptionId) attrs["aria-describedby"] = descriptionId;
  if (pressed !== undefined) attrs["aria-pressed"] = pressed;
  if (expanded !== undefined) attrs["aria-expanded"] = expanded;
  if (controls) attrs["aria-controls"] = controls;
  if (haspopup !== undefined) attrs["aria-haspopup"] = haspopup;
  if (disabled) attrs["aria-disabled"] = true;

  return attrs;
}

/**
 * Navigation accessibility helpers
 */
export interface NavigationA11yProps extends AriaProps {
  id?: string;
  "aria-label"?: string;
  "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time";
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
  "aria-owns"?: string;
  "aria-level"?: number;
  "aria-posinset"?: number;
  "aria-setsize"?: number;
}

export function createNavigationA11y(options: {
  id?: string;
  label?: string;
  current?: boolean | "page" | "step" | "location" | "date" | "time";
  expanded?: boolean;
  controls?: string;
  owns?: string;
  level?: number;
  posinset?: number;
  setsize?: number;
}): NavigationA11yProps {
  const {
    id,
    label,
    current,
    expanded,
    controls,
    owns,
    level,
    posinset,
    setsize,
  } = options;

  const attrs: NavigationA11yProps = {};

  if (id) attrs.id = id;
  if (label) attrs["aria-label"] = label;
  if (current !== undefined) attrs["aria-current"] = current;
  if (expanded !== undefined) attrs["aria-expanded"] = expanded;
  if (controls) attrs["aria-controls"] = controls;
  if (owns) attrs["aria-owns"] = owns;
  if (level !== undefined) attrs["aria-level"] = level;
  if (posinset !== undefined) attrs["aria-posinset"] = posinset;
  if (setsize !== undefined) attrs["aria-setsize"] = setsize;

  return attrs;
}

/**
 * Modal accessibility helpers
 */
export interface ModalA11yProps extends AriaProps {
  id?: string;
  role: "dialog";
  "aria-modal"?: boolean;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

export function createModalA11y(options: {
  id?: string;
  titleId?: string;
  descriptionId?: string;
  modal?: boolean;
}): ModalA11yProps {
  const { id, titleId, descriptionId, modal = true } = options;

  const attrs: ModalA11yProps = {
    role: "dialog",
  };

  if (id) attrs.id = id;
  if (modal) attrs["aria-modal"] = true;
  if (titleId) attrs["aria-labelledby"] = titleId;
  if (descriptionId) attrs["aria-describedby"] = descriptionId;

  return attrs;
}

/**
 * Combobox/Select accessibility helpers
 */
export function createComboboxA11y(options: {
  id?: string;
  label?: string;
  expanded?: boolean;
  controls?: string;
  activedescendant?: string;
  hasPopup?: "listbox" | "menu" | "tree" | "grid" | "dialog";
  autocomplete?: "none" | "inline" | "list" | "both";
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  labelId?: string;
  descriptionId?: string;
}): AriaProps {
  const {
    id,
    label,
    expanded,
    controls,
    activedescendant,
    hasPopup = "listbox",
    autocomplete = "list",
    required = false,
    invalid = false,
    disabled = false,
    labelId,
    descriptionId,
  } = options;

  const attrs: AriaProps = {
    role: "combobox",
    "aria-autocomplete": autocomplete,
  };

  if (id) attrs.id = id;
  if (label && !labelId) attrs["aria-label"] = label;
  if (labelId) attrs["aria-labelledby"] = labelId;
  if (descriptionId) attrs["aria-describedby"] = descriptionId;
  if (expanded !== undefined) attrs["aria-expanded"] = expanded;
  if (controls) attrs["aria-controls"] = controls;
  if (activedescendant) attrs["aria-activedescendant"] = activedescendant;
  if (hasPopup) attrs["aria-haspopup"] = hasPopup;
  if (required) attrs["aria-required"] = true;
  if (invalid) attrs["aria-invalid"] = true;
  if (disabled) attrs["aria-disabled"] = true;

  return attrs;
}

/**
 * Listbox option accessibility helpers
 */
export function createListboxOptionA11y(options: {
  id?: string;
  selected?: boolean;
  disabled?: boolean;
  posinset?: number;
  setsize?: number;
}): AriaProps {
  const { id, selected, disabled, posinset, setsize } = options;

  const attrs: AriaProps = {
    role: "option",
  };

  if (id) attrs.id = id;
  if (selected !== undefined) attrs["aria-selected"] = selected;
  if (disabled) attrs["aria-disabled"] = true;
  if (posinset !== undefined) attrs["aria-posinset"] = posinset;
  if (setsize !== undefined) attrs["aria-setsize"] = setsize;

  return attrs;
}

/**
 * Pagination accessibility helpers
 */
export function createPaginationA11y(options: {
  id?: string;
  label?: string;
  current?: boolean;
  disabled?: boolean;
  page?: number;
}): AriaProps {
  const { id, label, current, disabled, page } = options;

  const attrs: AriaProps = {};

  if (id) attrs.id = id;
  if (label) attrs["aria-label"] = label;
  if (current) attrs["aria-current"] = "page";
  if (disabled) attrs["aria-disabled"] = true;

  return attrs;
}

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Set focus to element by ID with optional delay
   */
  focusById: (id: string, delay = 0): void => {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.focus();
      }
    }, delay);
  },

  /**
   * Focus first focusable element within container
   */
  focusFirst: (container: HTMLElement): void => {
    const focusable = container.querySelector(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    ) as HTMLElement;

    if (focusable) {
      focusable.focus();
    }
  },

  /**
   * Focus last focusable element within container
   */
  focusLast: (container: HTMLElement): void => {
    const focusable = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );

    const lastFocusable = focusable[focusable.length - 1] as HTMLElement;
    if (lastFocusable) {
      lastFocusable.focus();
    }
  },

  /**
   * Get all focusable elements within container
   */
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const elements = container.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    );

    return Array.from(elements) as HTMLElement[];
  },
};

/**
 * Keyboard event handlers for common accessibility patterns
 */
export const keyboardHandlers = {
  /**
   * Handle escape key
   */
  onEscape:
    (callback: () => void) => (event: KeyboardEvent | React.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        callback();
      }
    },

  /**
   * Handle enter or space key for button-like elements
   */
  onActivate:
    (callback: () => void) => (event: KeyboardEvent | React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        callback();
      }
    },

  /**
   * Handle arrow navigation
   */
  onArrowNavigation:
    (options: {
      onArrowUp?: () => void;
      onArrowDown?: () => void;
      onArrowLeft?: () => void;
      onArrowRight?: () => void;
      onHome?: () => void;
      onEnd?: () => void;
    }) =>
    (event: KeyboardEvent | React.KeyboardEvent) => {
      const {
        onArrowUp,
        onArrowDown,
        onArrowLeft,
        onArrowRight,
        onHome,
        onEnd,
      } = options;

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          onArrowUp?.();
          break;
        case "ArrowDown":
          event.preventDefault();
          onArrowDown?.();
          break;
        case "ArrowLeft":
          event.preventDefault();
          onArrowLeft?.();
          break;
        case "ArrowRight":
          event.preventDefault();
          onArrowRight?.();
          break;
        case "Home":
          event.preventDefault();
          onHome?.();
          break;
        case "End":
          event.preventDefault();
          onEnd?.();
          break;
      }
    },
};

/**
 * Announce messages to screen readers
 */
export const announceToScreenReader = (
  message: string,
  priority: "polite" | "assertive" = "polite"
): void => {
  const announcement = document.createElement("div");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = "glass-sr-only";
  announcement.style.cssText = `
    position: absolute;
    left: -10000px;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  `;
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
};

/**
 * Generate loading state accessibility attributes
 */
export const createLoadingA11y = (
  loading: boolean,
  loadingText = "Loading"
): AriaProps => {
  return {
    "aria-busy": loading,
    "aria-live": loading ? "polite" : undefined,
    ...(loading && { "aria-label": loadingText }),
  };
};

// Consciousness-specific accessibility utilities

/**
 * WCAG 2.1 AA compliance standards for consciousness features
 */
export const CONSCIOUSNESS_A11Y_STANDARDS = {
  EYE_TRACKING: {
    KEYBOARD_ALTERNATIVE: true,
    FOCUS_INDICATORS: true,
    ESCAPE_MECHANISM: true,
    TIMEOUT_WARNINGS: true,
  },
  BIOMETRIC_ADAPTATION: {
    MANUAL_OVERRIDE: true,
    STATUS_ANNOUNCEMENT: true,
    PRIVACY_CONTROLS: true,
    OPT_OUT: true,
  },
  SPATIAL_AUDIO: {
    VISUAL_ALTERNATIVES: true,
    VOLUME_CONTROLS: true,
    DISABLE_OPTION: true,
    SUBTITLE_EQUIVALENT: true,
  },
  PREDICTIVE_FEATURES: {
    TRANSPARENCY: true,
    USER_CONTROL: true,
    EXPLANATION_AVAILABLE: true,
    CONFIDENCE_LEVELS: true,
  },
} as const;

/**
 * Consciousness accessibility context
 */
export interface ConsciousnessA11yContext {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersReducedData: boolean;
  screenReaderActive: boolean;
  keyboardNavigation: boolean;
  consciousnessFeatures: {
    eyeTracking: boolean;
    biometricAdaptation: boolean;
    spatialAudio: boolean;
    predictiveFeatures: boolean;
  };
}

export interface ConsciousnessFeatureFlags {
  eyeTracking?: boolean;
  biometricResponsive?: boolean;
  biometricAdaptation?: boolean;
  spatialAudio?: boolean;
  predictive?: boolean;
}

export interface ConsciousnessA11yViolation {
  rule: string;
  severity: "error" | "warning";
  element?: Element;
  description: string;
  remediation: string;
}

export interface ConsciousnessA11yValidationResult {
  isValid: boolean;
  violations: ConsciousnessA11yViolation[];
}

/**
 * Hook for consciousness accessibility context
 */
export const useConsciousnessA11y = (): ConsciousnessA11yContext => {
  const [context, setContext] = useState<ConsciousnessA11yContext>({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersReducedData: false,
    screenReaderActive: false,
    keyboardNavigation: false,
    consciousnessFeatures: {
      eyeTracking: false,
      biometricAdaptation: false,
      spatialAudio: false,
      predictiveFeatures: false,
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check media queries for accessibility preferences
    const reducedMotionMQ = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const highContrastMQ = window.matchMedia("(prefers-contrast: high)");
    const reducedDataMQ = window.matchMedia("(prefers-reduced-data: reduce)");

    // Check for screen reader
    const screenReaderActive =
      "speechSynthesis" in window ||
      navigator.userAgent.includes("NVDA") ||
      navigator.userAgent.includes("JAWS") ||
      navigator.userAgent.includes("VoiceOver");

    // Update context
    setContext((prev) => ({
      ...prev,
      prefersReducedMotion: reducedMotionMQ.matches,
      prefersHighContrast: highContrastMQ.matches,
      prefersReducedData: reducedDataMQ.matches,
      screenReaderActive,
    }));

    // Listen for changes
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setContext((prev) => ({ ...prev, prefersReducedMotion: e.matches }));
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setContext((prev) => ({ ...prev, prefersHighContrast: e.matches }));
    };

    const handleReducedDataChange = (e: MediaQueryListEvent) => {
      setContext((prev) => ({ ...prev, prefersReducedData: e.matches }));
    };

    reducedMotionMQ.addEventListener("change", handleReducedMotionChange);
    highContrastMQ.addEventListener("change", handleHighContrastChange);
    reducedDataMQ.addEventListener("change", handleReducedDataChange);

    // Listen for keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setContext((prev) => ({ ...prev, keyboardNavigation: true }));
      }
    };

    const handleMouseDown = () => {
      setContext((prev) => ({ ...prev, keyboardNavigation: false }));
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      reducedMotionMQ.removeEventListener("change", handleReducedMotionChange);
      highContrastMQ.removeEventListener("change", handleHighContrastChange);
      reducedDataMQ.removeEventListener("change", handleReducedDataChange);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return context;
};

/**
 * Consciousness accessibility validator
 */
export class ConsciousnessA11yValidator {
  private violations: ConsciousnessA11yViolation[] = [];

  // Validate eye tracking accessibility
  validateEyeTracking(element: Element, features: ConsciousnessFeatureFlags) {
    if (!features.eyeTracking) return;

    // Check for keyboard alternative
    const hasKeyboardAlternative =
      element.hasAttribute("tabindex") ||
      element.closest("[tabindex]") ||
      element.tagName.toLowerCase() === "button";

    if (!hasKeyboardAlternative) {
      this.violations.push({
        rule: "eye-tracking-keyboard-alternative",
        severity: "error",
        element,
        description: "Eye tracking features must have keyboard alternatives",
        remediation: "Add tabindex or ensure keyboard navigation is available",
      });
    }

    // Check for escape mechanism
    if (!element.closest("[data-consciousness-escape]")) {
      this.violations.push({
        rule: "eye-tracking-escape",
        severity: "error",
        element,
        description: "Eye tracking interfaces must provide escape mechanisms",
        remediation:
          "Add data-consciousness-escape attribute to parent container",
      });
    }
  }

  // Validate biometric adaptation accessibility
  validateBiometricAdaptation(
    element: Element,
    features: ConsciousnessFeatureFlags
  ) {
    if (!features.biometricResponsive && !features.biometricAdaptation) return;

    // Check for manual override
    const hasManualOverride =
      element.querySelector("[data-biometric-override]") ||
      element.closest("[data-biometric-override]");

    if (!hasManualOverride) {
      this.violations.push({
        rule: "biometric-manual-override",
        severity: "error",
        element,
        description:
          "Biometric adaptation must provide manual override controls",
        remediation:
          "Add manual override controls with data-biometric-override attribute",
      });
    }

    // Check for status announcements
    const hasAriaLive =
      element.hasAttribute("aria-live") || element.querySelector("[aria-live]");

    if (!hasAriaLive) {
      this.violations.push({
        rule: "biometric-status-announcement",
        severity: "warning",
        element,
        description: "Biometric adaptations should announce status changes",
        remediation: "Add aria-live region for status announcements",
      });
    }
  }

  // Validate spatial audio accessibility
  validateSpatialAudio(element: Element, features: ConsciousnessFeatureFlags) {
    if (!features.spatialAudio) return;

    // Check for visual alternatives
    const hasVisualAlternative =
      element.hasAttribute("aria-describedby") ||
      element.querySelector('[role="status"]') ||
      element.querySelector(".visual-audio-indicator");

    if (!hasVisualAlternative) {
      this.violations.push({
        rule: "spatial-audio-visual-alternative",
        severity: "error",
        element,
        description: "Spatial audio must provide visual alternatives",
        remediation:
          "Add visual indicators or aria-describedby for audio information",
      });
    }
  }

  // Comprehensive validation
  validate(
    element: Element,
    consciousnessFeatures: ConsciousnessFeatureFlags
  ): ConsciousnessA11yValidationResult {
    this.violations = []; // Reset violations

    this.validateEyeTracking(element, consciousnessFeatures);
    this.validateBiometricAdaptation(element, consciousnessFeatures);
    this.validateSpatialAudio(element, consciousnessFeatures);

    return {
      isValid:
        this.violations.filter((v) => v.severity === "error").length === 0,
      violations: this.violations,
    };
  }
}

/**
 * Hook for consciousness accessibility validation
 */
export const useConsciousnessA11yValidation = (
  elementRef: React.RefObject<Element>,
  consciousnessFeatures: ConsciousnessFeatureFlags,
  options: {
    autoValidate?: boolean;
    onViolation?: (violations: ConsciousnessA11yViolation[]) => void;
  } = {}
) => {
  const { autoValidate = true, onViolation } = options;
  const validatorRef = useRef(new ConsciousnessA11yValidator());
  const [validationResult, setValidationResult] =
    useState<ConsciousnessA11yValidationResult | null>(null);

  const validate = useCallback(() => {
    if (!elementRef.current) return null;

    const result = validatorRef.current.validate(
      elementRef.current,
      consciousnessFeatures
    );
    setValidationResult(result);

    if (onViolation && result.violations.length > 0) {
      onViolation(result.violations);
    }

    return result;
  }, [elementRef, consciousnessFeatures, onViolation]);

  useEffect(() => {
    if (autoValidate && elementRef.current) {
      validate();
    }
  }, [autoValidate, validate]);

  return {
    validate,
    validationResult,
    isValid: validationResult?.isValid ?? null,
    violations: validationResult?.violations ?? [],
  };
};

/**
 * Accessibility announcement utility for consciousness features
 */
export const useConsciousnessAnnouncements = () => {
  const announcerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create hidden announcer for screen readers
    if (!announcerRef.current) {
      const announcer = document.createElement("div");
      announcer.setAttribute("aria-live", "polite");
      announcer.setAttribute("aria-atomic", "true");
      announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;

      document.body.appendChild(announcer);
      announcerRef.current = announcer;
    }

    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current);
        announcerRef.current = null;
      }
    };
  }, []);

  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (announcerRef.current) {
        announcerRef.current.setAttribute("aria-live", priority);
        announcerRef.current.textContent = message;

        // Clear after announcement
        setTimeout(() => {
          if (announcerRef.current) {
            announcerRef.current.textContent = "";
          }
        }, 1000);
      }
    },
    []
  );

  const announceConsciousnessChange = useCallback(
    (feature: string, status: string) => {
      announce(`Consciousness feature ${feature} is now ${status}`, "polite");
    },
    [announce]
  );

  const announcePrivacyChange = useCallback(
    (change: string) => {
      announce(`Privacy setting changed: ${change}`, "assertive");
    },
    [announce]
  );

  return {
    announce,
    announceConsciousnessChange,
    announcePrivacyChange,
  };
};

/**
 * Create accessibility attributes for consciousness features
 */
export const createConsciousnessA11y = (
  features: ConsciousnessFeatureFlags
): AriaProps => {
  const attrs: AriaProps = {};

  // Add consciousness-specific attributes
  if (features.eyeTracking) {
    attrs["aria-describedby"] = "consciousness-eye-tracking-desc";
  }

  if (features.biometricResponsive) {
    attrs["aria-describedby"] = attrs["aria-describedby"]
      ? `${attrs["aria-describedby"]} consciousness-biometric-desc`
      : "consciousness-biometric-desc";
  }

  if (features.spatialAudio) {
    attrs["aria-describedby"] = attrs["aria-describedby"]
      ? `${attrs["aria-describedby"]} consciousness-spatial-audio-desc`
      : "consciousness-spatial-audio-desc";
  }

  if (features.predictive) {
    attrs["aria-describedby"] = attrs["aria-describedby"]
      ? `${attrs["aria-describedby"]} consciousness-predictive-desc`
      : "consciousness-predictive-desc";
  }

  return attrs;
};

// Export singleton validator
export const consciousnessA11yValidator = new ConsciousnessA11yValidator();
