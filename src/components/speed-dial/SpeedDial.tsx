"use client";
import React, {
  forwardRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

import SpeedDialAction from "./SpeedDialAction";
import SpeedDialIcon from "./SpeedDialIcon";
import { SpeedDialProps, SpeedDialActionProps } from "./types";
import styles from "./SpeedDial.module.css";
import { ContrastGuard } from "../accessibility/ContrastGuard";
import { ANIMATION } from "../../tokens/designConstants";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const COLOR_VARIANT_CLASS: Record<string, keyof typeof styles> = {
  primary: "fabSolidPrimary",
  secondary: "fabSolidSecondary",
  error: "fabSolidError",
  info: "fabSolidInfo",
  success: "fabSolidSuccess",
  warning: "fabSolidWarning",
  default: "fabSolidDefault",
};

const resolvePositionStyle = (position: SpeedDialProps["position"]) => {
  if (!position) return undefined;
  const entries = Object.entries(position);
  if (entries.length === 0) return undefined;
  return entries.reduce<Record<string, string>>((acc, [key, value]) => {
    if (value === undefined) return acc;
    acc[key] = typeof value === "number" ? `${value}px` : value;
    return acc;
  }, {});
};

const mergeRefs =
  <T,>(
    ...refs: Array<
      | React.ForwardedRef<T>
      | React.MutableRefObject<T | null>
      | null
      | undefined
    >
  ) =>
  (value: T | null) => {
    refs.forEach((ref) => {
      if (!ref) return;
      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };

/**
 * SpeedDial Component Implementation
 */
function SpeedDialComponent(
  props: SpeedDialProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    className,
    style,
    icon,
    children,
    defaultOpen = false,
    open: controlledOpen,
    direction = "up",
    disabled = false,
    onOpen,
    onClose,
    onActionClick,
    hideOnScroll = false,
    position = { bottom: 16, right: 16 },
    size = "medium",
    color = "default",
    glass = false,
    glassActions = false,
    showTooltips = true,
    ariaLabel,
    transition = true,
    ...rest
  } = props;

  // Refs
  const rootRef = useRef<HTMLDivElement | null>(null);

  // State for uncontrolled component
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [visible, setVisible] = useState(true);

  // Determine if component is controlled
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const colorClass = useMemo(() => {
    const key = COLOR_VARIANT_CLASS[color] ?? COLOR_VARIANT_CLASS.default;
    return styles[key] ?? styles.fabSolidDefault;
  }, [color]);

  // Toggle open state
  const toggle = useCallback(() => {
    if (disabled) return;

    const newOpen = !open;

    if (!isControlled) {
      setInternalOpen(newOpen);
    }

    if (newOpen && onOpen) {
      onOpen();
    } else if (!newOpen && onClose) {
      onClose();
    }
  }, [disabled, open, isControlled, onOpen, onClose]);

  // Handle action click
  const handleActionClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>, actionIndex: number) => {
      if (onActionClick) {
        onActionClick(event, actionIndex);
      }

      // Close the speed dial after an action is clicked
      if (!isControlled) {
        setInternalOpen(false);
      }

      if (onClose) {
        onClose();
      }
    },
    [isControlled, onClose, onActionClick]
  );

  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    if (!isControlled) {
      setInternalOpen(false);
    }

    if (onClose) {
      onClose();
    }
  }, [isControlled, onClose]);

  // Hide on scroll
  useEffect(() => {
    if (!hideOnScroll) return;

    let lastScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;
    let scrollTimer: number | undefined;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop + 10) {
        // Scrolling down
        setVisible(false);

        // Close the speed dial
        if (open && !isControlled) {
          setInternalOpen(false);
        }
      } else if (scrollTop < lastScrollTop - 10) {
        // Scrolling up
        setVisible(true);
      }

      lastScrollTop = scrollTop;

      // Clear the previous timer
      if (scrollTimer) {
        window.clearTimeout(scrollTimer);
      }

      // Set a new timer to show the speed dial after scrolling stops
      scrollTimer = window.setTimeout(() => {
        setVisible(true);
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer) {
        window.clearTimeout(scrollTimer);
      }
    };
  }, [hideOnScroll, open, isControlled]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        if (!isControlled) {
          setInternalOpen(false);
        }

        if (onClose) {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, isControlled, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(styles.backdrop, open && styles.backdropVisible)}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* SpeedDial */}
      <div
        ref={mergeRefs(ref, rootRef)}
        className={cn(
          styles.root,
          "glass-speed-dial",
          !visible && styles.hidden,
          className
        )}
        style={{ ...resolvePositionStyle(position), ...(style ?? {}) }}
        {...rest}
      >
        <div className={styles.container}>
          <div
            className={cn(
              styles.actions,
              open && styles.actionsOpen,
              direction === "up" || direction === "down"
                ? styles.actionsVertical
                : styles.actionsHorizontal
            )}
            aria-hidden={!open}
          >
            {React.Children.toArray(children).map((child, index) => {
              // Check if the action is a valid React element before rendering
              if (!React.isValidElement(child)) {
                return null;
              }

              // Extract props from the valid element
              const actionProps = child.props as SpeedDialActionProps;

              return (
                <SpeedDialAction
                  key={child.key || index}
                  {...actionProps}
                  onClick={(event) => handleActionClick(event, index)}
                  glass={glassActions}
                  index={index}
                  totalActions={React.Children.count(children)}
                  direction={direction}
                  transition={transition}
                  open={open}
                  showTooltip={showTooltips}
                  size={size}
                />
              );
            })}
          </div>

          {/* Main button */}
          <button
            type="button"
            onClick={toggle}
            aria-label={ariaLabel}
            aria-expanded={open}
            aria-haspopup="true"
            disabled={disabled}
            className={cn(
              styles.fab,
              glass ? styles.fabGlass : colorClass,
              size === "small" && styles.fabSmall,
              size === "medium" && styles.fabMedium,
              size === "large" && styles.fabLarge,
              disabled && styles.fabDisabled
            )}
          >
            <SpeedDialIcon icon={icon} open={open} />
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * SpeedDial Component
 *
 * A floating action button that expands to show multiple actions.
 */
const SpeedDial = forwardRef(SpeedDialComponent);

/**
 * GlassSpeedDial Component
 *
 * Glass variant of the SpeedDial component.
 */
const GlassSpeedDial = forwardRef<HTMLDivElement, SpeedDialProps>(
  (props, ref) => (
    <SpeedDial {...props} glass={true} glassActions={true} ref={ref} />
  )
);

GlassSpeedDial.displayName = "GlassSpeedDial";

export default SpeedDial;
export { SpeedDial, GlassSpeedDial };
