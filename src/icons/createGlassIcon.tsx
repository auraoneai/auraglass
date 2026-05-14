import * as React from "react";

export type GlassIconNode = readonly [
  tag: keyof React.JSX.IntrinsicElements,
  attrs: Record<string, string | number | boolean | undefined>,
];

export interface GlassIconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  absoluteStrokeWidth?: boolean;
}

export type GlassIcon = React.ForwardRefExoticComponent<
  Omit<GlassIconProps, "ref"> & React.RefAttributes<SVGSVGElement>
>;

export function createGlassIcon(
  displayName: string,
  iconNode: readonly GlassIconNode[]
): GlassIcon {
  const Icon = React.forwardRef<SVGSVGElement, GlassIconProps>(
    (
      {
        color = "currentColor",
        size = 24,
        strokeWidth = 2,
        absoluteStrokeWidth,
        children,
        ...rest
      },
      ref
    ) => {
      const numericSize =
        typeof size === "number" ? size : Number.parseFloat(size);
      const renderedStrokeWidth =
        absoluteStrokeWidth && Number.isFinite(numericSize) && numericSize > 0
          ? (Number(strokeWidth) * 24) / numericSize
          : strokeWidth;

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
          {...rest}
          aria-hidden={rest["aria-hidden"] ?? true}
        >
          {iconNode.map(([tag, attrs], index) =>
            React.createElement(tag, { key: index, ...attrs })
          )}
          {children}
        </svg>
      );
    }
  );

  Icon.displayName = displayName;
  return Icon;
}
