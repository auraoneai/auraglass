// fixtures.ts — deterministic sample data for presence-stack.
import type { PresenceUser } from './index';

export const presenceUsers: PresenceUser[] = [
  { id: 'u-amara', name: 'Amara Osei' },
  { id: 'u-bert', name: 'Bert Hughes' },
  { id: 'u-chen', name: 'Chen Wei' },
  { id: 'u-dana', name: 'Dana Kim' },
  { id: 'u-eli', name: 'Eli Novak' },
  { id: 'u-farid', name: 'Farid Aziz' },
  { id: 'u-gita', name: 'Gita Rao' },
];

export const presenceProps = { users: presenceUsers, max: 5 };
