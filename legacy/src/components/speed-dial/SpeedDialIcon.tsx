"use client";
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

import { SpeedDialIconProps } from "./types";
import styles from "./SpeedDialIcon.module.css";

// Default icons
const DefaultIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" />
  </svg>
);

const DefaultOpenIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19 13H5V11H19V13Z" fill="currentColor" />
  </svg>
);

const isOpenIconProvided = (props: SpeedDialIconProps) =>
  Object.prototype.hasOwnProperty.call(props, "openIcon");

function SpeedDialIconComponent(
  props: SpeedDialIconProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const { className, style, icon, openIcon, open = false, ...rest } = props;

  // Default icons
  const iconToShow = icon || <DefaultIcon />;
  const openIconToShow = openIcon || <DefaultOpenIcon />;

  // If only using one icon, rotate it
  if (!openIcon && !isOpenIconProvided(props)) {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-speed-dial-icon",
          styles.icon,
          open && styles.iconOpen,
          className
        )}
        style={{ ...(style || {}) }}
        {...rest}
      >
        {iconToShow}
      </div>
    );
  }

  // Using two separate icons for open/closed states
  return (
    <div
      ref={ref}
      className={cn("glass-speed-dial-icon", styles.iconContainer, className)}
      style={{ ...(style || {}) }}
      {...rest}
    >
      <div className={cn(styles.iconLayer, !open && styles.iconLayerActive)}>
        {iconToShow}
      </div>
      <div className={cn(styles.iconLayer, open && styles.iconLayerActive)}>
        {openIconToShow}
      </div>
    </div>
  );
}

/**
 * SpeedDialIcon Component
 *
 * An icon component for the SpeedDial that transitions between open and closed states.
 */
export const SpeedDialIcon = forwardRef(SpeedDialIconComponent);

export default SpeedDialIcon;
