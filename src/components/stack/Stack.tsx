/* CMP-297: Stack — T0 server layout. direction row|column uses logical flex
   axes (RTL-aware without prop changes); gap maps to space tokens via
   data-gap; separator nodes render between children, aria-hidden when
   `separatorDecorative` (default true). */
import * as React from 'react';
import { cn } from '../../internal/index';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  /** Space token index (0–8) or a raw CSS length. */
  gap?: number | string;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  /** Node rendered between each pair of children. */
  separator?: React.ReactNode;
  /** Decorative separators are aria-hidden (default true). */
  separatorDecorative?: boolean;
}

const JUSTIFY: Record<NonNullable<StackProps['justify']>, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

export function Stack({
  direction = 'column',
  gap,
  align,
  justify,
  wrap,
  separator,
  separatorDecorative = true,
  children,
  className,
  style,
  ref,
  ...rest
}: StackProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const cssStyle: React.CSSProperties = {
    flexDirection: direction === 'row' ? 'row' : 'column',
    gap: typeof gap === 'number' ? `var(--ag-space-${gap})` : gap,
    alignItems: align ? (align === 'start' ? 'flex-start' : align === 'end' ? 'flex-end' : align) : undefined,
    justifyContent: justify ? JUSTIFY[justify] : undefined,
    flexWrap: wrap ? 'wrap' : undefined,
    ...style,
  };
  const kids = React.Children.toArray(children);
  return (
    <div
      {...rest}
      ref={ref}
      data-ag-part="root"
      data-direction={direction}
      data-gap={gap === undefined ? undefined : String(gap)}
      className={cn('ag-stack', className)}
      style={cssStyle}
    >
      {separator
        ? kids.flatMap((child, i) =>
            i === 0
              ? [child]
              : [
                  <div
                    key={`__sep_${i}`}
                    data-ag-part="separator"
                    className="ag-stack-separator"
                    aria-hidden={separatorDecorative ? 'true' : undefined}
                  >
                    {separator}
                  </div>,
                  child,
                ],
          )
        : kids}
    </div>
  );
}
