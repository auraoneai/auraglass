/* GlassPagination — 4.x compat adapter (SC-34). Delegates to the 5.0 component and
   warns once per session via warnDeprecated; prop mapping per
   fragments/codemods/surf.ts W1 rows. */
'use client';
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Pagination } from '../../../components/pagination/Pagination';

export type GlassPaginationProps = Record<string, unknown> & { children?: React.ReactNode };

export function GlassPagination(props: GlassPaginationProps) {
  warnDeprecated('DEP-S0679');
  const { currentPage, totalPages, onChange, ...rest } = props as Record<string, React.ReactNode>;
  return <Pagination.Root page={currentPage as number} pageCount={totalPages as number} onPageChange={onChange as never} {...rest} />;
}
