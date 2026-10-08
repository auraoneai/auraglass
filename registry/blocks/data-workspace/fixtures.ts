/* data-workspace fixtures — deterministic values only. */
import type { FilterField } from 'aura-glass/data';

export interface Row { id: string; name: string; status: 'live' | 'draft' | 'archived'; updated: string; owner: string; views: number }

export const COLLECTIONS = [
  { id: 'all', label: 'All records' },
  { id: 'live', label: 'Live' },
  { id: 'archived', label: 'Archived' },
] as const;

export const FILTER_FIELDS: FilterField[] = [
  { id: 'status', label: 'Status', type: 'enum', options: ['live', 'draft', 'archived'] },
  { id: 'owner', label: 'Owner', type: 'text' },
  { id: 'views', label: 'Views', type: 'number' },
];

export const ROWS: Row[] = [
  { id: 'r1', name: 'Pricing page', status: 'live', updated: '2026-10-01T09:00:00Z', owner: 'mira', views: 40210 },
  { id: 'r2', name: 'Onboarding flow', status: 'draft', updated: '2026-10-03T14:20:00Z', owner: 'jon', views: 0 },
  { id: 'r3', name: 'Legacy banner', status: 'archived', updated: '2026-08-19T11:00:00Z', owner: 'mira', views: 1204 },
  { id: 'r4', name: 'Docs search', status: 'live', updated: '2026-10-05T16:45:00Z', owner: 'priya', views: 18930 },
];
