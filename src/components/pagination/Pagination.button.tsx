'use client';
/* Button-mode Pagination (SURF-081): used only when Root has no getHref.
   Owns page state and onPageChange; Previous/Next are focusable buttons with
   aria-disabled at bounds (never the disabled attribute). */

import * as React from 'react';
import { partElement } from '../../app-shell/_internal/partElement';
import { getPaginationRange } from './getRange';

export type PaginationButtonsProps = {
  labels?: { previous?: string; next?: string; page?: string } | undefined;
  page?: number | undefined;
  defaultPage?: number | undefined;
  pageCount: number;
  onPageChange?: ((page: number) => void) | undefined;
  siblingCount?: number | undefined;
  boundaryCount?: number | undefined;
  ariaLabel: string;
  render?: React.ReactElement | undefined;
  rest?: Record<string, unknown> | undefined;
  children?: React.ReactNode;
};

export function PaginationButtons({
  page,
  defaultPage = 1,
  pageCount,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  labels,
  ariaLabel,
  render,
  rest,
  children,
}: PaginationButtonsProps) {
  const [internal, setInternal] = React.useState(defaultPage);
  const current = Math.min(Math.max(1, Math.floor(page ?? internal)), pageCount);
  const range = getPaginationRange({ page: current, pageCount, siblingCount, boundaryCount });

  const prevLabel = labels?.previous ?? 'Previous page';
  const nextLabel = labels?.next ?? 'Next page';
  const pageLabel = (n: number) => `${labels?.page ?? 'Page'} ${n}`;

  const goto = (n: number) => {
    const next = Math.min(Math.max(1, n), pageCount);
    if (page === undefined) setInternal(next);
    onPageChange?.(next);
  };

  const Btn = ({
    n,
    label,
    disabled,
    current: isCurrent,
    part,
  }: {
    n?: number;
    label: string;
    disabled?: boolean;
    current?: boolean;
    part: string;
  }) => (
    <li data-ag-part="item">
      <button
        type="button"
        data-ag-part={part}
        aria-label={label}
        aria-disabled={disabled || undefined}
        aria-current={isCurrent ? 'page' : undefined}
        className="ag-pagination__link"
        onClick={disabled || n === undefined ? undefined : () => goto(n)}
      >
        {part === 'page' ? n : part === 'previous' ? '\u2039' : '\u203a'}
      </button>
    </li>
  );

  return partElement('nav', {
    render,
    'aria-label': ariaLabel,
    'data-ag-part': 'pagination',
    ...(rest ?? {}),
    children: (
      <ol data-ag-part="pagination-list" className="ag-pagination__list">
        <Btn n={current - 1} label={prevLabel} disabled={current <= 1} part="previous" />
        {range.map((item, i) =>
          typeof item === 'number' ? (
            <Btn key={item} n={item} label={pageLabel(item)} current={item === current} part="page" />
          ) : (
            <li key={`${item}-${i}`} data-ag-part="item">
              <span data-ag-part="ellipsis" aria-hidden>
                …
              </span>
            </li>
          ),
        )}
        <Btn n={current + 1} label={nextLabel} disabled={current >= pageCount} part="next" />
        {children}
      </ol>
    ),
  });
}
