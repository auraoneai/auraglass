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
  const middle = collapse
    ? items
        .slice(1, items.length - itemsAfterCollapse)
        .map((item) =>
          React.isValidElement(item)
            ? ((item.props as { children?: React.ReactNode }).children ?? item)
            : item,
        )
    : [];
  const moreLabel = labels?.showMore?.(overflowCount) ?? `Show ${overflowCount} more`;
  return partElement('nav', {
    render: render as React.ReactElement | undefined,
    'aria-label': label,
    'data-ag-part': 'breadcrumbs',
    ...rest,
    children: (
      <ol data-ag-part="list" className="ag-breadcrumbs__list">
        {head}
        {collapse ? (
          <li data-ag-part="item">
            <BreadcrumbsOverflow label={moreLabel} items={middle} />
          </li>
        ) : null}
        {tail}
      </ol>
    ),
  });
}
BreadcrumbsRoot.displayName = 'Breadcrumbs.Root';

export function BreadcrumbsList({ children, render, ...rest }: PartProps<'ol'>) {
  return partElement('ol', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'list',
    className: 'ag-breadcrumbs__list',
    ...rest,
    children,
  });
}
BreadcrumbsList.displayName = 'Breadcrumbs.List';

export function BreadcrumbsItem({ children, render, ...rest }: PartProps<'li'>) {
  return partElement('li', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'item',
    ...rest,
    children: (
      <>
        {children}
        <BreadcrumbsSeparator />
      </>
    ),
  });
}
BreadcrumbsItem.displayName = 'Breadcrumbs.Item';

export type BreadcrumbsLinkProps = PartProps<'a'> & { href: string };

function BreadcrumbsLink({ href, children, render, ...rest }: BreadcrumbsLinkProps) {
  return partElement('a', {
    render: render as React.ReactElement | undefined,
    href,
    'data-ag-part': 'link',
    className: 'ag-breadcrumbs__link',
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

export const Breadcrumbs = {
  Root: BreadcrumbsRoot,
  List: BreadcrumbsList,
  Item: BreadcrumbsItem,
  Link: BreadcrumbsLink,
  Current: BreadcrumbsCurrent,
  Separator: BreadcrumbsSeparator,
  Ellipsis: BreadcrumbsOverflow,
};
