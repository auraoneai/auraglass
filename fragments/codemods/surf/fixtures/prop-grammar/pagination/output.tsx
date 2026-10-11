// @ts-nocheck — frozen 4.x consumer usage, codemod input (do not "fix").
import { GlassPagination } from 'aura-glass';

export function Pager({ page, pages, go }) {
  return <GlassPagination page={page} pageCount={pages} onPageChange={go} />;
}
