// fixtures.ts — deterministic sample data for comment-thread.
import type { ThreadComment } from './index';

export const comments: ThreadComment[] = [
  { id: 'c-1', author: 'Amara Osei', body: 'Ship looks good — one nit on the totals row.', at: '2026-09-30T14:02:00Z' },
  { id: 'c-2', author: 'Chen Wei', body: 'Fixed; the separator was missing on empty carts.', at: '2026-09-30T14:20:00Z' },
  { id: 'c-3', author: 'Dana Kim', body: 'Verified on RTL too — mirrors cleanly.', at: '2026-09-30T15:01:00Z' },
];

export const commentThreadProps = { comments };
