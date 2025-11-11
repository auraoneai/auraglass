'use client';
import React from 'react';

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
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '32px',
            background: '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            zIndex: 10,
          }}
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
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '32px',
            background: '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            zIndex: 10,
          }}
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
