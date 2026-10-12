import { Pagination } from 'aura-glass';

export default function PaginationMinimal() {
  return <Pagination.Root defaultPage={5} pageCount={12} aria-label="Results pages" />;
}
