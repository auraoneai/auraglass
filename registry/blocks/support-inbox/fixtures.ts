/* support-inbox fixtures — deterministic values only. */
export interface Ticket { id: string; subject: string; requester: string; priority: 'low' | 'normal' | 'high'; status: 'open' | 'pending' | 'closed'; updated: string }
export interface Msg { id: string; author: string; body: string; at: string }

export const TICKETS: Ticket[] = [
  { id: 'T-1042', subject: 'Cannot reset password', requester: 'ava@ex.com', priority: 'high', status: 'open', updated: '2026-10-07T08:00:00Z' },
  { id: 'T-1041', subject: 'Billing question', requester: 'sam@ex.com', priority: 'normal', status: 'pending', updated: '2026-10-06T19:00:00Z' },
  { id: 'T-1039', subject: 'SSO setup help', requester: 'lee@ex.com', priority: 'low', status: 'closed', updated: '2026-10-05T11:30:00Z' },
];

export const MESSAGES: Record<string, Msg[]> = {
  'T-1042': [
    { id: 'm1', author: 'Ava', body: 'Reset link never arrives.', at: '2026-10-07T08:00:00Z' },
    { id: 'm2', author: 'Support', body: 'Checking the mail queue now.', at: '2026-10-07T08:05:00Z' },
  ],
};
