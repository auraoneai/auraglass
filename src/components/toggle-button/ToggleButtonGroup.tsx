'use client';

/**
 * ToggleButtonGroup Component
 *
 * A group of toggle buttons with glass morphism styling.
 */
import React, {
  forwardRef,
  Children,
  isValidElement,
  cloneElement,
  useState,
  useCallback,
} from 'react';
import { cn } from '@/lib/utils';
import { OptimizedGlass } from '../../primitives';
import { Motion } from '../../primitives';
import { ToggleButtonGroupProps, ToggleButtonProps } from './types';

// Get group orientation classes
const getGroupOrientationClasses = (orientation: 'horizontal' | 'vertical', fullWidth: boolean) => {
  return cn(
    'inline-flex glass-radius-md',
    orientation === 'vertical' ? 'flex-col' : 'flex-row',
    fullWidth ? 'w-full' : 'w-auto'
  );
};

/**
 * ToggleButtonGroup Component Implementation
 */
function ToggleButtonGroupComponent(
  props: ToggleButtonGroupProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const {
    children,
    value: controlledValue,
    defaultValue,
    onChange,
    exclusive = false,
    orientation = 'horizontal',
    className,
    style,
    glass = false,
    // Prevent custom props from leaking to DOM
    glassVariant,
    blurStrength,
    color = 'primary',
    size = 'medium',
    fullWidth = false,
    variant = 'outlined',
    ...rest
  } = props;

  // State for uncontrolled component
  const [internalValue, setInternalValue] = useState<any | any[]>(
    defaultValue !== undefined
      ? exclusive && Array.isArray(defaultValue)
        ? defaultValue[0] ?? null
        : defaultValue
      : null
  );

  // Determine if component is controlled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Handle button selection
  const handleButtonSelection = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>, buttonValue: any) => {
      // Always stop propagation to prevent parent handlers from being notified
      event.stopPropagation();

      let newValue: any | any[];

      if (exclusive) {
        // In exclusive mode, only one button can be selected
        newValue = value === buttonValue ? null : buttonValue;
      } else {
        // In non-exclusive mode, multiple buttons can be selected
        const valueArray = Array.isArray(value) ? value : value ? [value] : [];

        if (valueArray.includes(buttonValue)) {
          newValue = valueArray.filter((v: any) => v !== buttonValue);
          if ((newValue?.length || 0) === 0) newValue = null;
        } else {
          newValue = [...valueArray, buttonValue];
        }
      }

      // Update internal value if uncontrolled
      if (!isControlled) {
        setInternalValue(newValue);
      }

      // Notify parent if callback provided
      if (onChange) {
        onChange(event, newValue);
      }
    },
    [value, exclusive, isControlled, onChange]
  );

  // Prepare children with additional props
  const childrenCount = Children.count(children);
  const childrenWithProps = Children.map(children, (child, index) => {
    if (!isValidElement<ToggleButtonProps>(child)) {
      return child;
    }

    // Calculate group position flags
    const isGroupStart = index === 0;
    const isGroupEnd = index === childrenCount - 1;

    // Determine if this button is selected
    const isSelected = exclusive 
      ? child.props?.value === value
      : Array.isArray(value) 
        ? value.includes(child.props?.value)
        : child.props?.value === value;

    // Create props for the child button
    const childProps = {
      color,
      size,
      fullWidth,
      variant,
      glass,
      glassVariant,
      blurStrength,
      selected: isSelected,
      onChange: handleButtonSelection,
      grouped: true,
      groupOrientation: orientation,
      isGroupStart,
      isGroupEnd,
    };

    return cloneElement(child, childProps);
  });

  const groupClasses = getGroupOrientationClasses(orientation, fullWidth);

  return (
    <div
      ref={ref}
      role="group"
      className={cn(groupClasses, className)}
      style={style}
      {...rest}
    >
      {childrenWithProps}
    </div>
  );
}

/**
 * ToggleButtonGroup Component
 *
 * A group of toggle buttons.
 */
const ToggleButtonGroup = forwardRef(ToggleButtonGroupComponent);

/**
 * GlassToggleButtonGroup Component
 *
 * Glass variant of the ToggleButtonGroup component.
 */
const GlassToggleButtonGroup = forwardRef<HTMLDivElement, ToggleButtonGroupProps>((props, ref) => (
  <ToggleButtonGroup {...props} glass={true} ref={ref} />
));

GlassToggleButtonGroup.displayName = 'GlassToggleButtonGroup';

export default ToggleButtonGroup;
export { ToggleButtonGroup, GlassToggleButtonGroup };
