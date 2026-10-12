/* CMP-297 + REQ-CMP-112: Stack — T0 server layout. direction row|column uses
   logical flex axes (RTL-aware without prop changes); gap takes a SpaceToken
   ('0'…'16', or the same index as a number) mapped to var(--ag-space-N), or a
   raw CSS length; separator nodes render between children, aria-hidden when
   `separatorDecorative` (default true). Absorbs GlassFlex and Box (compat in
   src/compat/cmp/layout); HStack/VStack are removed names with no adapter. */
import * as React from 'react';
import { cn } from '../../internal/index';

/* Same literal set as SpaceToken in src/contracts/tokens.ts. It is restated
   here because auraglass/contract-boundary forbids src/** from importing
   contracts/; keep the two unions in sync. Grid imports it from this file. */
export type SpaceTokenLike = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16' | number | (string & {});

/** SpaceToken index (number or numeric string) -> var(--ag-space-N); any other string is a raw CSS length. */
export function spaceGap(gap: SpaceTokenLike): string {
  return typeof gap === 'number' || /^\d+$/.test(gap) ? `var(--ag-space-${gap})` : gap;
}

export interface StackProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  direction?: 'row' | 'column';
  /** SpaceToken index, a number (→ var(--ag-space-N)), or a raw CSS length. */
  gap?: SpaceTokenLike;
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
    gap: gap === undefined ? undefined : spaceGap(gap),
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
