/* Server Pagination (SURF-081): nav + range items; link mode via getHref
   (fully server-renderable — no context, no hooks). Button mode lives in
   Pagination.button ('use client'). */

import * as React from 'react';
import { partElement } from '../../app-shell/_internal/partElement';
import type { PartProps } from '../../contracts/components';
import { getPaginationRange } from './getRange';
import { materialProps } from '../../material/materialProps';
import { PaginationButtons } from './Pagination.button';

export type PaginationLabels = {
  pagination?: string | undefined;
  previous?: string | undefined;
  next?: string | undefined;
  page?: ((n: number) => string) | undefined;
};

export type PaginationRootProps = Omit<PartProps<'nav'>, 'onChange' | 'aria-label'> & {
  page?: number | undefined;
  defaultPage?: number | undefined;
  pageCount: number;
  onPageChange?: ((page: number) => void) | undefined;
  siblingCount?: number | undefined;
  boundaryCount?: number | undefined;
  /** Link mode: href builder for each page (server-safe, no client state). */
  getHref?: ((page: number) => string) | undefined;
  labels?: PaginationLabels | undefined;
  'aria-label'?: string | undefined;
};

function PaginationRoot({
  page,
  defaultPage = 1,
  pageCount,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  getHref,
  labels,
  'aria-label': ariaLabel,
  children,
  render,
  ...rest
}: PaginationRootProps) {
  const current = Math.min(Math.max(1, Math.floor(page ?? defaultPage)), pageCount);
  const range = getPaginationRange({ page: current, pageCount, siblingCount, boundaryCount });
  const aria = ariaLabel ?? labels?.pagination ?? 'Pagination';
  const pageName = (n: number) => labels?.page?.(n) ?? `Page ${n}`;
  const prevLabel = labels?.previous ?? 'Previous page';
  const nextLabel = labels?.next ?? 'Next page';

  if (getHref === undefined) {
    // Button mode: state + handlers live in the client island.
    return (
      <PaginationButtons
        page={page}
        defaultPage={defaultPage}
        pageCount={pageCount}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        labels={{ previous: prevLabel, next: nextLabel, ...pageLabelForIsland(labels?.page) }}
        {...(onPageChange ? { onPageChange } : {})}
        ariaLabel={aria}
        render={render as React.ReactElement | undefined}
        rest={rest as Record<string, unknown>}
      >
        {children}
      </PaginationButtons>
    );
  }

  return partElement('nav', {
    render: render as React.ReactElement | undefined,
    'aria-label': aria,
    'data-ag-part': 'pagination',
    // SURF-059: content material, never a backdrop filter.
    ...materialProps({ layer: 'content' }),
    ...rest,
    children: (
      <>
      <span data-ag-part="status" className="ag-pagination__status">
        {`Page ${current} of ${pageCount}`}
      </span>
      <ol data-ag-part="pagination-list" className="ag-pagination__list">
        <li data-ag-part="item">
          <PaginationArrowLink
            part="previous"
            label={prevLabel}
            disabled={current <= 1}
            href={getHref(Math.max(1, current - 1))}
          />
        </li>
        {range.map((item, i) =>
          typeof item === 'number' ? (
            <li key={item} data-ag-part="item">
              <PaginationPageLink
                page={item}
                current={item === current}
                href={getHref(item)}
                label={pageName(item)}
              />
            </li>
          ) : (
            <li key={`${item}-${i}`} data-ag-part="item">
              <PaginationEllipsis />
            </li>
          ),
        )}
        <li data-ag-part="item">
          <PaginationArrowLink
            part="next"
            label={nextLabel}
            disabled={current >= pageCount}
            href={getHref(Math.min(pageCount, current + 1))}
          />
        </li>
      </ol>
      </>
    ),
  });
}
PaginationRoot.displayName = 'Pagination.Root';

/* SURF-058: labels.page is a function, which cannot cross the RSC boundary
   into the button-mode island. Probe it once with a sentinel page number and
   pass a serialisable `{page}` template; a label that does not echo the
   number verbatim (e.g. locale digit grouping) is passed as the function,
   which works whenever Root itself renders on the client. */
const PAGE_SENTINEL = 987654321;
function pageLabelForIsland(
  page: ((n: number) => string) | undefined,
): { pageTemplate?: string; page?: (n: number) => string } {
  if (page === undefined) return {};
  const probe = page(PAGE_SENTINEL);
  const at = probe.indexOf(String(PAGE_SENTINEL));
  if (at >= 0 && probe.indexOf(String(PAGE_SENTINEL), at + 1) < 0 && !probe.includes('{page}')) {
    return { pageTemplate: probe.replace(String(PAGE_SENTINEL), '{page}') };
  }
  return { page };
}

function PaginationPageLink({
  page,
  current,
  href,
  label,
}: {
  page: number;
  current: boolean;
  href: string | undefined;
  label: string;
}) {
  return (
    <a
      data-ag-part="page"
      href={href}
      aria-label={label}
      aria-current={current ? 'page' : undefined}
      className="ag-pagination__link"
    >
      {page}
    </a>
  );
}

function PaginationArrowLink({
  part,
  label,
  disabled,
  href,
}: {
  part: 'previous' | 'next';
  label: string;
  disabled: boolean;
  href: string | undefined;
}) {
  return (
    <a
      data-ag-part={part}
      href={disabled ? undefined : href}
      role="link"
      aria-label={label}
      aria-disabled={disabled || undefined}
      tabIndex={0}
      className="ag-pagination__link"
    >
      {part === 'previous' ? '‹' : '›'}
    </a>
  );
}

export type PaginationItemProps = Omit<PartProps<'a'>, 'value'> & {
  page: number;
  current?: boolean | undefined;
  href?: string | undefined;
};

/** Manual-composition item for consumers building their own range. */
export function PaginationItem({ page, current, href, children, render, ...rest }: PaginationItemProps) {
  return (
    <li data-ag-part="item">
      {partElement('a', {
        render: render as React.ReactElement | undefined,
        href,
        'data-ag-part': 'page',
        'aria-label': `Page ${page}`,
        'aria-current': current ? ('page' as const) : undefined,
        className: 'ag-pagination__link',
        ...rest,
        children: children ?? page,
      })}
    </li>
  );
}
PaginationItem.displayName = 'Pagination.Item';

export type PaginationArrowProps = PartProps<'a'> & {
  href?: string | undefined;
  disabled?: boolean | undefined;
};

export function PaginationPrevious({ href, disabled, render, ...rest }: PaginationArrowProps) {
  return (
    <li data-ag-part="item">
      {partElement('a', {
        render: render as React.ReactElement | undefined,
        href: disabled ? undefined : href,
        role: 'link',
        'data-ag-part': 'previous',
        'aria-label': 'Previous page',
        'aria-disabled': disabled || undefined,
        tabIndex: 0,
        className: 'ag-pagination__link',
        ...rest,
        children: '‹',
      })}
    </li>
  );
}
PaginationPrevious.displayName = 'Pagination.Previous';

export function PaginationNext({ href, disabled, render, ...rest }: PaginationArrowProps) {
  return (
    <li data-ag-part="item">
      {partElement('a', {
        render: render as React.ReactElement | undefined,
        href: disabled ? undefined : href,
        role: 'link',
        'data-ag-part': 'next',
        'aria-label': 'Next page',
        'aria-disabled': disabled || undefined,
        tabIndex: 0,
        className: 'ag-pagination__link',
        ...rest,
        children: '›',
      })}
    </li>
  );
}
PaginationNext.displayName = 'Pagination.Next';

export function PaginationEllipsis({ render, ...rest }: PartProps<'span'>) {
  return partElement('span', {
    render: render as React.ReactElement | undefined,
    'data-ag-part': 'ellipsis',
    'aria-hidden': true,
    ...rest,
    children: '…',
  });
}
PaginationEllipsis.displayName = 'Pagination.Ellipsis';

export const Pagination = {
  Root: PaginationRoot,
  Previous: PaginationPrevious,
  Next: PaginationNext,
  Item: PaginationItem,
  Ellipsis: PaginationEllipsis,
  getRange: getPaginationRange,
};
