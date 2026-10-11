/* audit-log fixtures — deterministic values only (5.2 block, REQ-SURF-178).
   EVENTS is the whole (fixture) audit stream; the block pages it through
   queryAuditPage (audit-query.ts) as a server would: filter, then slice. */
export interface AuditEvent { id: string; at: string; actor: string; action: string; target: string; ip: string }

export const ACTORS = ['mira', 'jon', 'priya', 'system'] as const;
export const ACTIONS = ['user.invited', 'key.rotated', 'role.changed', 'export.created'] as const;

export const TOTAL_EVENTS = 183;
export const PAGE_SIZE = 10;

export const EVENTS: AuditEvent[] = Array.from({ length: TOTAL_EVENTS }, (_, i) => ({
  id: `evt-${String(i + 1).padStart(3, '0')}`,
  at: `2026-10-0${(i % 7) + 1}T0${i % 9}:15:00Z`,
  actor: ACTORS[i % 4]!,
  action: ACTIONS[Math.floor(i / 4) % 4]!,
  target: `subject-${(i % 6) + 1}`,
  ip: `10.0.${Math.floor(i / 250)}.${(i % 250) + 2}`,
}));

export const FIELDS = [
  { id: 'actor', label: 'Actor', type: 'enum' as const, options: [{ value: 'mira', label: 'Mira' }, { value: 'jon', label: 'Jon' }, { value: 'priya', label: 'Priya' }, { value: 'system', label: 'System' }] },
  { id: 'action', label: 'Action', type: 'enum' as const, options: [{ value: 'user.invited', label: 'User.invited' }, { value: 'key.rotated', label: 'Key.rotated' }, { value: 'role.changed', label: 'Role.changed' }, { value: 'export.created', label: 'Export.created' }] },
];
