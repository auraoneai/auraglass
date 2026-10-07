/* audit-log fixtures — deterministic values only (5.2 block, REQ-SURF-178). */
export interface AuditEvent { id: string; at: string; actor: string; action: string; target: string; ip: string }

export const EVENTS: AuditEvent[] = Array.from({ length: 24 }, (_, i) => ({
  id: `evt-${String(i + 1).padStart(3, '0')}`,
  at: `2026-10-0${(i % 7) + 1}T0${i % 9}:15:00Z`,
  actor: ['mira', 'jon', 'priya', 'system'][i % 4]!,
  action: ['user.invited', 'key.rotated', 'role.changed', 'export.created'][i % 4]!,
  target: `subject-${(i % 6) + 1}`,
  ip: `10.0.0.${i + 2}`,
}));

export const FIELDS = [
  { id: 'actor', label: 'Actor', type: 'enum' as const, options: ['mira', 'jon', 'priya', 'system'] },
  { id: 'action', label: 'Action', type: 'enum' as const, options: ['user.invited', 'key.rotated', 'role.changed', 'export.created'] },
];

export const TOTAL_EVENTS = 183;
export const PAGE_SIZE = 10;
