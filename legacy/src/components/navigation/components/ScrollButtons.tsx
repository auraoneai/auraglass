"use client";
import React from "react";
import { createGlassStyle } from "../../../core/mixins/glassMixins";

export interface ScrollButtonsProps {
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
  showLeft?: boolean;
  showRight?: boolean;
  className?: string; // Add className to props
}

export const ScrollButtons: React.FC<ScrollButtonsProps> = ({
  onScrollLeft,
  onScrollRight,
  showLeft = false,
  showRight = false,
  className, // Destructure className
}) => {
  return (
    <>
      {showLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
          onClick={onScrollLeft}
          className={`glass-focus glass-touch-target glass-contrast-guard ${className}`} // Apply className here
        >
          ‹
        </button>
      )}
      {showRight && (
        <button
          type="button"
          aria-label="Scroll right"
          style={createGlassStyle({ intent: "neutral", elevation: "level2" })}
          onClick={onScrollRight}
          className={`glass-focus glass-touch-target glass-contrast-guard ${className}`} // Apply className here
        >
          ›
        </button>
      )}
    </>
  );
};

export default ScrollButtons;
