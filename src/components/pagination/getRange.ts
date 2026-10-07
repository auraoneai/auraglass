/**
 * Pure pagination range (SURF-003).
 * Canonical boundary+siblings+ellipses algorithm (same semantics as the
 * widely-used usePagination): the emitted list has a stable length once
 * ellipsized — boundary pages, an optional ellipsis per side, and a
 * 2*siblingCount+1 window anchored on the current page, widening to keep
 * the total constant near the edges.
 */

export interface PaginationRangeArgs {
  page: number;
  pageCount: number;
  siblingCount?: number | undefined;
  boundaryCount?: number | undefined;
}

export type PaginationRangeItem = number | 'ellipsis-start' | 'ellipsis-end';

export function getPaginationRange({
  page,
  pageCount,
  siblingCount = 1,
  boundaryCount = 1,
}: PaginationRangeArgs): PaginationRangeItem[] {
  const total = Math.max(0, Math.floor(pageCount));
  if (total === 0) return [];
  const current = Math.min(Math.max(1, Math.floor(page)), total);
  const sib = Math.max(0, Math.floor(siblingCount));
  const bnd = Math.max(0, Math.floor(boundaryCount));

  const startPages = range(1, Math.min(bnd, total));
  const endPages = range(Math.max(total - bnd + 1, bnd + 1), total);

  const siblingsStart = Math.max(
    Math.min(current - sib, total - bnd - sib * 2 - 1),
    bnd + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(current + sib, bnd + sib * 2 + 2),
    (endPages[0] ?? total + 1) - 2,
  );

  const items: PaginationRangeItem[] = [...startPages];
  if (siblingsStart > bnd + 2) {
    items.push('ellipsis-start');
  } else if (bnd + 1 < total - bnd) {
    items.push(bnd + 1);
  }
  items.push(...range(siblingsStart, siblingsEnd));
  if (siblingsEnd < total - bnd - 1) {
    items.push('ellipsis-end');
  } else if (total - bnd > bnd) {
    items.push(total - bnd);
  }
  items.push(...endPages);
  return items;
}

function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}
