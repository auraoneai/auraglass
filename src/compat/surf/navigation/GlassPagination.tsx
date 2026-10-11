/* GlassPagination — 4.x compat adapter (REQ-SURF-13, DEP-S0020) →
   Pagination.Root. currentPage/totalPages → page/pageCount,
   onPageChange (legacy onChange accepted) → onPageChange, maxPageButtons →
   siblingCount (buttons either side of the current page), aria-label maps
   1:1. disabled/loading/size/showFirstLast have no 5.0 equivalent. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Pagination } from '../../../components/pagination/Pagination';
import { domProps } from '../_shared';

export interface GlassPaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onChange?: (page: number) => void;
  maxPageButtons?: number;
  'aria-label'?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassPagination` compat adapter (DEP-S0020).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Pagination from aura-glass}.
 */
export function GlassPagination(props: GlassPaginationProps) {
  warnDeprecated('DEP-S0020');
  const {
    currentPage = 1, totalPages = 1, onPageChange, onChange, maxPageButtons, 'aria-label': ariaLabel,
    children: _c, ...rest
  } = props;
  const handler = onPageChange ?? onChange;
  return (
    <Pagination.Root
      page={currentPage}
      pageCount={totalPages}
      {...(handler ? { onPageChange: handler } : {})}
      {...(maxPageButtons !== undefined ? { siblingCount: Math.max(0, Math.floor((maxPageButtons - 1) / 2)) } : {})}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      {...domProps(rest)}
    />
  );
}
