"use client";
// Typography tokens available via typography.css (imported in index.css)
import React from "react";
import { cn } from "../../../lib/utilsComprehensive";
import { glassTokenUtils } from "../../../tokens/glass";

export interface TabItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  active?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * ID of the tab panel this tab controls
   */
  "aria-controls"?: string;
  /**
   * Index of the tab for keyboard navigation
   */
  index?: number;
  /**
   * Total number of tabs for keyboard navigation
   */
  totalTabs?: number;
  /**
   * Callback for keyboard navigation
   */
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
}

const TabItemComponent: React.FC<TabItemProps> = ({
  id,
  label,
  icon,
  badge,
  disabled = false,
  active = false,
  onClick,
  "aria-controls": ariaControls,
  index = 0,
  totalTabs = 1,
  onKeyDown,
  className,
  style,
  ...rest
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
      return;
    }

    const parent = e.currentTarget.parentElement;
    if (!parent) return;

    const tabs = Array.from(
      parent.querySelectorAll('[role="tab"]')
    ) as HTMLButtonElement[];
    const currentIndex = tabs.indexOf(e.currentTarget);

    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        const prevIndex =
          currentIndex - 1 < 0 ? tabs.length - 1 : currentIndex - 1;
        tabs[prevIndex]?.focus();
        tabs[prevIndex]?.click();
        break;
      case "ArrowRight":
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % tabs.length;
        tabs[nextIndex]?.focus();
        tabs[nextIndex]?.click();
        break;
      case "Home":
        e.preventDefault();
        tabs[0]?.focus();
        tabs[0]?.click();
        break;
      case "End":
        e.preventDefault();
        tabs[tabs.length - 1]?.focus();
        tabs[tabs.length - 1]?.click();
        break;
    }
  };

  return (
    <button
      data-glass-component
      id={`tab-${id}`}
      role="tab"
      aria-selected={active}
      aria-controls={ariaControls || undefined}
      aria-disabled={disabled}
      tabIndex={active ? 0 : -1}
      style={{
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        maxWidth: "100%",
        minWidth: 0,
        gap: "6px",
        padding: "8px 16px",
        background: active
          ? glassTokenUtils.getSurface("neutral", "level1").surface.base
          : "transparent",
        border: "none",
        borderRadius: "6px",
        color: active
          ? "var(--glass-white)"
          : glassTokenUtils.getSurface("neutral", "level1").text.secondary,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: "0.875rem", // body text
        fontWeight: active ? 600 : 400,
        transition: "all 0.2s ease",
        ...style,
      }}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={cn(
        "glass-focus glass-touch-target glass-contrast-guard glass-focus glass-touch-target glass-contrast-guard",
        className
      )}
      {...rest}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span
        style={{
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      {badge && (
        <span
          aria-label={`${badge} notifications`}
          style={{
            background: "hsl(var(--glass-color-danger))",
            color: "white",
            borderRadius: "10px",
            padding: "2px 6px",
            fontSize: "0.625rem",
            fontWeight: "var(--typography-heading-weight)", // semi-bold
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

export const TabItem = TabItemComponent;

export default TabItemComponent;
