import React from "react";
import { createGlassStyle } from "../core/mixins/glassMixins";
// Element type detection and utilities

export type ElementCategory =
  | "interactive"
  | "static"
  | "form"
  | "navigation"
  | "media"
  | "layout"
  | "feedback";

export type ElementRole =
  | "button"
  | "link"
  | "input"
  | "select"
  | "textarea"
  | "checkbox"
  | "radio"
  | "switch"
  | "slider"
  | "progressbar"
  | "tab"
  | "tabpanel"
  | "menu"
  | "menuitem"
  | "dialog"
  | "tooltip"
  | "alert"
  | "status"
  | "img"
  | "video"
  | "audio"
  | "canvas"
  | "svg"
  | "div"
  | "span"
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "ul"
  | "ol"
  | "li"
  | "table"
  | "tr"
  | "td"
  | "th"
  | "form"
  | "label"
  | "fieldset"
  | "legend"
  | "article"
  | "section"
  | "header"
  | "footer"
  | "aside"
  | "main"
  | "nav";

export interface ElementInfo {
  tagName: string;
  role: ElementRole;
  category: ElementCategory;
  interactive: boolean;
  focusable: boolean;
  semantic: boolean;
  formElement: boolean;
}

export interface ElementCapabilities {
  supportsHover: boolean;
  supportsFocus: boolean;
  supportsKeyboard: boolean;
  supportsTouch: boolean;
  supportsAnimation: boolean;
  supportsBackdropFilter: boolean;
  supportsCSSGrid: boolean;
  supportsFlexbox: boolean;
}

// Element type detection
export const getElementInfo = (element: Element): ElementInfo => {
  const tagName = element.tagName.toLowerCase();
  const role = getElementRole(element);
  const category = getElementCategory(element);
  const interactive = isInteractiveElement(element);
  const focusable = isFocusableElement(element);
  const semantic = isSemanticElement(element);
  const formElement = isFormElement(element);

  return {
    tagName,
    role,
    category,
    interactive,
    focusable,
    semantic,
    formElement,
  };
};

const getElementRole = (element: Element): ElementRole => {
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute("role");

  // Check explicit role first
  if (role) {
    switch (role) {
      case "button":
        return "button";
      case "link":
        return "link";
      case "textbox":
        return "input";
      case "checkbox":
        return "checkbox";
      case "radio":
        return "radio";
      case "switch":
        return "switch";
      case "slider":
        return "slider";
      case "progressbar":
        return "progressbar";
      case "tab":
        return "tab";
      case "tabpanel":
        return "tabpanel";
      case "menu":
        return "menu";
      case "menuitem":
        return "menuitem";
      case "dialog":
        return "dialog";
      case "tooltip":
        return "tooltip";
      case "alert":
        return "alert";
      case "status":
        return "status";
      case "img":
        return "img";
    }
  }

  // Map by tag name
  switch (tagName) {
    case "button":
      return "button";
    case "a":
      return "link";
    case "input": {
      const type = (element as HTMLInputElement).type;
      switch (type) {
        case "checkbox":
          return "checkbox";
        case "radio":
          return "radio";
        default:
          return "input";
      }
    }
    case "select":
      return "select";
    case "textarea":
      return "textarea";
    case "img":
      return "img";
    case "video":
      return "video";
    case "audio":
      return "audio";
    case "canvas":
      return "canvas";
    case "svg":
      return "svg";
    case "div":
      return "div";
    case "span":
      return "span";
    case "p":
      return "p";
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    case "ul":
      return "ul";
    case "ol":
      return "ol";
    case "li":
      return "li";
    case "table":
      return "table";
    case "tr":
      return "tr";
    case "td":
      return "td";
    case "th":
      return "th";
    case "form":
      return "form";
    case "label":
      return "label";
    case "fieldset":
      return "fieldset";
    case "legend":
      return "legend";
    case "article":
      return "article";
    case "section":
      return "section";
    case "header":
      return "header";
    case "footer":
      return "footer";
    case "aside":
      return "aside";
    case "main":
      return "main";
    case "nav":
      return "nav";
    default:
      return "div";
  }
};

const getElementCategory = (element: Element): ElementCategory => {
  const info = getElementInfo(element);

  if (info.interactive) {
    return "interactive";
  }

  if (info.formElement) {
    return "form";
  }

  if (["nav", "menu", "menuitem", "tab", "tabpanel"].includes(info.role)) {
    return "navigation";
  }

  if (["img", "video", "audio", "canvas", "svg"].includes(info.role)) {
    return "media";
  }

  if (
    [
      "div",
      "span",
      "section",
      "article",
      "header",
      "footer",
      "aside",
      "main",
    ].includes(info.role)
  ) {
    return "layout";
  }

  if (["alert", "status", "tooltip", "dialog"].includes(info.role)) {
    return "feedback";
  }

  return "static";
};

const isInteractiveElement = (element: Element): boolean => {
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute("role");
  const hasClickHandler =
    element.hasAttribute("onclick") || element.hasAttribute("onClick");

  return (
    ["button", "a", "input", "select", "textarea"].includes(tagName) ||
    [
      "button",
      "link",
      "checkbox",
      "radio",
      "switch",
      "slider",
      "tab",
      "menuitem",
    ].includes(role || "") ||
    hasClickHandler ||
    element.getAttribute("tabindex") === "0"
  );
};

const isFocusableElement = (element: Element): boolean => {
  const tagName = element.tagName.toLowerCase();

  // Naturally focusable elements
  if (["button", "input", "select", "textarea", "a"].includes(tagName)) {
    // Check if disabled
    if (element.hasAttribute("disabled")) return false;
    if (tagName === "a" && !element.hasAttribute("href")) return false;
    return true;
  }

  // Elements with tabindex
  const tabindex = element.getAttribute("tabindex");
  if (tabindex) {
    return parseInt(tabindex) >= 0;
  }

  // Elements with explicit role
  const role = element.getAttribute("role");
  if (
    [
      "button",
      "link",
      "textbox",
      "checkbox",
      "radio",
      "switch",
      "slider",
      "tab",
      "menuitem",
    ].includes(role || "")
  ) {
    return true;
  }

  return false;
};

const isSemanticElement = (element: Element): boolean => {
  const tagName = element.tagName.toLowerCase();
  return [
    "article",
    "aside",
    "details",
    "figcaption",
    "figure",
    "footer",
    "header",
    "main",
    "mark",
    "nav",
    "section",
    "summary",
    "time",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "blockquote",
    "pre",
    "ol",
    "ul",
    "li",
    "dl",
    "dt",
    "dd",
    "table",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td",
    "caption",
  ].includes(tagName);
};

const isFormElement = (element: Element): boolean => {
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute("role");

  return (
    [
      "input",
      "select",
      "textarea",
      "button",
      "form",
      "label",
      "fieldset",
      "legend",
    ].includes(tagName) ||
    ["textbox", "checkbox", "radio", "switch", "slider", "button"].includes(
      role || ""
    )
  );
};

// Browser capability detection
export const detectElementCapabilities = (): ElementCapabilities => {
  const testElement = document.createElement("div");

  return {
    supportsHover: window.matchMedia("(hover: hover)").matches,
    supportsFocus: true, // All modern browsers support focus
    supportsKeyboard: true, // All modern browsers support keyboard events
    supportsTouch: "ontouchstart" in window,
    supportsAnimation: "animate" in testElement,
    supportsBackdropFilter:
      "backdropFilter" in testElement.style ||
      "webkitBackdropFilter" in testElement.style,
    supportsCSSGrid: "grid" in testElement.style,
    supportsFlexbox: "flex" in testElement.style,
  };
};

// Element behavior utilities
export const elementBehaviors = {
  // Get appropriate cursor for element type
  getCursor: (element: Element): string => {
    const info = getElementInfo(element);

    switch (info.role) {
      case "button":
      case "link":
        return "pointer";
      case "input":
      case "textarea":
        return "text";
      case "select":
        return "pointer";
      default:
        return "default";
    }
  },

  // Get appropriate user select behavior
  getUserSelect: (element: Element): string => {
    const info = getElementInfo(element);

    if (info.interactive || info.formElement) {
      return "none";
    }

    return "text";
  },

  // Get appropriate pointer events
  getPointerEvents: (element: Element): string => {
    const info = getElementInfo(element);

    if (info.interactive) {
      return "auto";
    }

    return "none";
  },

  // Check if element supports certain interactions
  supportsInteraction: (
    element: Element,
    interaction: "hover" | "focus" | "touch" | "keyboard"
  ): boolean => {
    const capabilities = detectElementCapabilities();
    const info = getElementInfo(element);

    switch (interaction) {
      case "hover":
        return capabilities.supportsHover && info.interactive;
      case "focus":
        return capabilities.supportsFocus && info.focusable;
      case "touch":
        return capabilities.supportsTouch;
      case "keyboard":
        return capabilities.supportsKeyboard && info.focusable;
      default:
        return false;
    }
  },
};

// Element styling utilities
export const elementStyles = {
  // Get base styles for element type
  getBaseStyles: (element: Element): Record<string, any> => {
    const info = getElementInfo(element);
    const capabilities = detectElementCapabilities();

    const baseStyles: Record<string, any> = {
      cursor: elementBehaviors.getCursor(element),
      userSelect: elementBehaviors.getUserSelect(element),
      pointerEvents: elementBehaviors.getPointerEvents(element),
    };

    // Add focus styles for focusable elements
    if (info.focusable) {
      baseStyles.outline = "none";
      baseStyles["&:focus-visible"] = {
        outline: "2px solid hsl(var(--glass-color-primary)/0.5)",
        outlineOffset: "2px",
      };
    }

    // Add hover styles for interactive elements
    if (info.interactive && capabilities.supportsHover) {
      baseStyles.transition = "all 0.2s ease";
      baseStyles["&:hover"] = {
        opacity: 0.8,
      };
    }

    // Add touch styles for touch devices
    if (capabilities.supportsTouch && info.interactive) {
      baseStyles.minWidth = "44px";
      baseStyles.minHeight = "44px";
      baseStyles.WebkitTapHighlightColor = "transparent";
    }

    return baseStyles;
  },

  // Get glassmorphism styles for element
  getGlassStyles: (element: Element): Record<string, any> => {
    const capabilities = detectElementCapabilities();

    if (!capabilities.supportsBackdropFilter) {
      return createGlassStyle({ intent: "neutral", elevation: "level2" });
    }

    return createGlassStyle({ intent: "neutral", elevation: "level2" });
  },

  // Get animation styles for element
  getAnimationStyles: (element: Element): Record<string, any> => {
    const capabilities = detectElementCapabilities();
    const info = getElementInfo(element);

    if (!capabilities.supportsAnimation) {
      return {};
    }

    if (info.interactive) {
      return {
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:active": {
          transform: "scale(0.98)",
        },
      };
    }

    return {
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    };
  },
};

// Element accessibility utilities
export const elementAccessibility = {
  // Get appropriate ARIA attributes
  getAriaAttributes: (element: Element): Record<string, string> => {
    const info = getElementInfo(element);
    const attributes: Record<string, string> = {};

    // Add role if not already present and needed
    if (!element.hasAttribute("role") && info.semantic) {
      attributes.role = info.role;
    }

    // Add focus management
    if (info.focusable && !element.hasAttribute("tabindex")) {
      attributes.tabindex = "0";
    }

    // Add live region for dynamic content
    if (["alert", "status", "log", "progressbar"].includes(info.role)) {
      attributes["aria-live"] = "polite";
    }

    return attributes;
  },

  // Check accessibility compliance
  isAccessible: (element: Element): boolean => {
    const info = getElementInfo(element);

    // Check focus management
    if (info.interactive && !info.focusable) {
      return false;
    }

    // Check semantic structure
    if (!info.semantic && !element.getAttribute("role")) {
      return false;
    }

    // Check form elements
    if (info.formElement) {
      const hasLabel =
        element.hasAttribute("aria-label") ||
        element.hasAttribute("aria-labelledby") ||
        (element.hasAttribute("id") &&
          document.querySelector(`label[for="${element.id}"]`));

      if (!hasLabel) {
        return false;
      }
    }

    return true;
  },
};
