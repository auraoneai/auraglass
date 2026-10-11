/* Server Breadcrumbs (SURF-076): nav > ol > li structure, chevron separators
   (aria-hidden), Current span aria-current=page. No surface/backdrop filter,
   no context/hooks — the overflow island receives serializable props only
   (SURF-077). */

import * as React from 'react';
import { ChevronRightIcon } from '../../icons/navigation/chevron-right';
import { partElement } from '../../app-shell/_internal/partElement';
import type { PartProps } from '../../contracts/components';
import { BreadcrumbsOverflow } from './Breadcrumbs.Overflow';

export type BreadcrumbsLabels = {
  breadcrumb?: string | undefined;
  /** Computed server-side; functions never cross the RSC boundary. */
  showMore?: ((n: number) => string) | undefined;
};

export type BreadcrumbsRootProps = Omit<PartProps<'nav'>, 'aria-label'> & {
  /** Collapse middle items into the overflow menu when the count exceeds this. */
  maxItems?: number | undefined;
  /** Items kept after the collapsed middle (default 2). */
  itemsAfterCollapse?: number | undefined;
  labels?: BreadcrumbsLabels | undefined;
  'aria-label'?: string | undefined;
};

function BreadcrumbsRoot({
  maxItems,
  itemsAfterCollapse = 2,
  labels,
  'aria-label': ariaLabel,
  children,
  render,
  ...rest
}: BreadcrumbsRootProps) {
  const label = ariaLabel ?? labels?.breadcrumb ?? 'Breadcrumb';
  const items = React.Children.toArray(children).filter(Boolean);
  const collapse = maxItems !== undefined && items.length > maxItems;
  const overflowCount = collapse ? items.length - itemsAfterCollapse - 1 : 0;
  const head = collapse ? items.slice(0, 1) : items;
  const tail = collapse ? items.slice(items.length - itemsAfterCollapse) : [];
  // SURF-056: collapse items to serializable {href,label} pairs — pull the
  // href off a nested Breadcrumbs.Link when present.
  const middle = collapse
    ? items
        .slice(1, items.length - itemsAfterCollapse)
        .map((item) => {
          if (!React.isValidElement(item)) return { label: item };
          const kids = (item.props as { children?: React.ReactNode }).children;
          let href: string | undefined;
          let label: React.ReactNode = kids ?? item;
          React.Children.forEach(kids, (k) => {
            if (
              React.isValidElement(k) &&
              typeof (k.props as { href?: string }).href === 'string'
            ) {
              href = (k.props as { href?: string }).href;
              label = (k.props as { children?: React.ReactNode }).children ?? label;
            }
          });
          return { href, label };
        })
    : [];
  const moreLabel = labels?.showMore?.(overflowCount) ?? `Show ${overflowCount} more`;
  return partElement('nav', {
    render: render as React.ReactElement | undefined,
    'aria-label': label,
    'data-ag-part': 'breadcrumbs',
    ...rest,
    children: (
      <ol data-ag-part="list" className="ag-breadcrumbs__list">
        {withSeparators([
          ...head,
          ...(collapse
            ? [
                <BreadcrumbsItem key="ag-breadcrumbs-overflow">
                  <BreadcrumbsOverflow label={moreLabel} items={middle} />
                </BreadcrumbsItem>,
              ]
            : []),
          ...tail,
        ])}
      </ol>
    ),
  });
}
BreadcrumbsRoot.displayName = 'Breadcrumbs.Root';

/* SURF-055: separators sit *between* items — every Item except the last gets
   one (an explicit `separator` prop wins); the last/Current item has none. */
function withSeparators(children: React.ReactNode): React.ReactNode[] {
  const list = React.Children.toArray(children).filter(Boolean);
  return list.map((child, i) => {
    if (!React.isValidElement(child) || child.type !== BreadcrumbsItem) return child;
    const props = child.props as BreadcrumbsItemProps;
    if (props.separator !== undefined) return child;
    return React.cloneElement(child as React.ReactElement<BreadcrumbsItemProps>, {
      separator: i < list.length - 1,
    });
  });
}

export function BreadcrumbsList({ children, render, ...rest }: PartProps<'ol'>) {
  return partElement('ol', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'list',
    className: 'ag-breadcrumbs__list',
    ...rest,
    children: withSeparators(children),
  });
}
BreadcrumbsList.displayName = 'Breadcrumbs.List';

export type BreadcrumbsItemProps = PartProps<'li'> & {
  /** Trailing separator. Root/List set it on every item but the last. */
  separator?: boolean | undefined;
};

export function BreadcrumbsItem({ separator = false, children, render, ...rest }: BreadcrumbsItemProps) {
  return partElement('li', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'item',
    ...rest,
    children: (
      <>
        {children}
        {separator ? <BreadcrumbsSeparator /> : null}
      </>
    ),
  });
}
BreadcrumbsItem.displayName = 'Breadcrumbs.Item';

export type BreadcrumbsLinkProps = PartProps<'a'> & { href: string };

function BreadcrumbsLink({ href, children, render, ...rest }: BreadcrumbsLinkProps) {
  // SURF-057: links truncate at 16ch (CSS); a plain-text label stays the
  // full accessible name and the hover title.
  const fullText = typeof children === 'string' || typeof children === 'number' ? String(children) : undefined;
  return partElement('a', {
    render: render as React.ReactElement | undefined,
    href,
    'data-ag-part': 'link',
    className: 'ag-breadcrumbs__link',
    ...(fullText !== undefined ? { title: fullText } : {}),
    ...rest,
    children,
  });
}
BreadcrumbsLink.displayName = 'Breadcrumbs.Link';

export function BreadcrumbsCurrent({ children, render, ...rest }: PartProps<'span'>) {
  return partElement('span', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'current',
    'aria-current': 'page',
    className: 'ag-breadcrumbs__current',
    ...rest,
    children,
  });
}
BreadcrumbsCurrent.displayName = 'Breadcrumbs.Current';

export function BreadcrumbsSeparator({ render, ...rest }: PartProps<'span'>) {
  return partElement('span', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'separator',
    'aria-hidden': true,
    className: 'ag-breadcrumbs__separator',
    ...rest,
    children: <ChevronRightIcon aria-hidden data-ag-part="glyph" />,
  });
}
BreadcrumbsSeparator.displayName = 'Breadcrumbs.Separator';

/** Static, server-safe ellipsis glyph (aria-hidden). The interactive
    overflow menu is Breadcrumbs.Overflow (client island). */
export function BreadcrumbsEllipsis({ render, ...rest }: PartProps<'span'>) {
  return partElement('span', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'ellipsis',
    'aria-hidden': true,
    className: 'ag-breadcrumbs__ellipsis',
    ...rest,
    children: '\u2026',
  });
}
BreadcrumbsEllipsis.displayName = 'Breadcrumbs.Ellipsis';

export const Breadcrumbs = {
  Root: BreadcrumbsRoot,
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
  Current: BreadcrumbsCurrent,
  Separator: BreadcrumbsSeparator,
  Ellipsis: BreadcrumbsEllipsis,
  Overflow: BreadcrumbsOverflow,
};
