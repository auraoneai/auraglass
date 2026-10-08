/* registry/blocks/overlay-flows fixtures — deterministic sample data (no
   Math.random, no wall clock, no network per the block file contract). */

export interface OverlayFlowsRow {
  id: string;
  name: string;
  role: string;
  lastSeen: string;
}

export const rows: OverlayFlowsRow[] = [
  { id: 'u-001', name: 'Amara Osei', role: 'Admin', lastSeen: '2026-09-30' },
  { id: 'u-002', name: 'Ben Iwata', role: 'Editor', lastSeen: '2026-10-01' },
  { id: 'u-003', name: 'Cora Lindqvist', role: 'Viewer', lastSeen: '2026-10-02' },
];

export const roles = ['Admin', 'Editor', 'Viewer'] as const;

export const contextMenuItems = [
  { id: 'open', label: 'Open' },
  { id: 'rename', label: 'Rename' },
  { id: 'archive', label: 'Archive' },
];
