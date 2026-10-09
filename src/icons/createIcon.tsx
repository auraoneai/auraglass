/* createIcon (CMP-037): pure factory for server-safe glyph components.
   Decorative by default: <svg aria-hidden='true' focusable='false'>; when
   aria-label or title is provided the svg is role='img' and the title is
   linked via aria-labelledby. Ref arrives as a normal prop (REQ-CMP-03). */
import * as React from 'react';
import type { IconComponent, IconNode, IconProps } from './types';

export function createIcon(displayName: string, iconNode: readonly IconNode[]): IconComponent {
  const Component = (props: IconProps) => {
    const {
      color = 'currentColor',
      size = 24,
      strokeWidth = 2,
      absoluteStrokeWidth,
      children,
      title,
      ref,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      ...rest
    } = props;
    const titleId = React.useId();
    const numericSize = typeof size === 'number' ? size : Number.parseFloat(String(size));
    const renderedStrokeWidth =
      absoluteStrokeWidth && Number.isFinite(numericSize) && numericSize > 0
        ? (Number(strokeWidth) * 24) / numericSize
        : strokeWidth;
    const labelled = Boolean(ariaLabel || title || ariaLabelledby);
    const labelledBy = title ? [ariaLabelledby, titleId].filter(Boolean).join(' ') : ariaLabelledby;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={renderedStrokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={labelled ? 'img' : undefined}
        aria-hidden={labelled ? undefined : true}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        focusable="false"
        data-ag-part="root"
        {...rest}
      >
        {title ? <title id={titleId}>{title}</title> : null}
        {iconNode.map(([tag, attrs], index) =>
          React.createElement(tag, { key: index, ...attrs }),
        )}
        {children}
      </svg>
    );
  };
  Component.displayName = displayName;
  return Component;
}
