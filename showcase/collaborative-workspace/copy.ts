/* collaborative-workspace copy and deterministic data (REQ-QUAL-58 / REQ-QUAL-59). */
import type { AgMessage } from 'aura-glass/ai';

/** Fixed showcase epoch: 2026-03-02T09:30:00Z. */
export const SHOWCASE_EPOCH = Date.UTC(2026, 2, 2, 9, 30, 0);

const at = (minutes: number) => new Date(SHOWCASE_EPOCH + minutes * 60_000).toISOString();

export const COPY = {
  product: 'Fieldnote',
  skip: 'Skip to document',
  docTitle: 'Q2 launch brief — Harbor payments',
  docMeta: 'Edited by Mei Chen 6 minutes ago · 4 collaborators',
  commentsHeading: 'Comments',
  shareTitle: 'Share “Q2 launch brief”',
  shareDescription: 'People you add can comment. Only owners can change who has access.',
  shareLabel: 'Add people',
  publishTitle: 'Publish to the company wiki?',
  publishBody: 'Publishing creates a read-only copy at wiki/launches/harbor-payments. Comments stay in Fieldnote.',
  tabs: { brief: 'Brief', plan: 'Rollout plan', risks: 'Risks' },
  cohortsHeading: 'First-wave cohorts',
  cohortsCaption: 'Sellers per country in the first wave, with monthly volume and go-live date',
} as const;

export const BREADCRUMBS = [
  { href: '#workspace', label: 'Harbor workspace' },
  { href: '#launches', label: 'Launches' },
] as const;

export const PEOPLE = ['Mei Chen', 'Tomás Herrera', 'Aisha Bello', 'Jonas Weber', 'Ravi Patel', 'Elena Petrova', 'Kwame Asante'];

export const COLLABORATORS = ['Mei Chen', 'Tomás Herrera', 'Aisha Bello', 'Jonas Weber'] as const;

export const SECTIONS = [
  {
    id: 'summary',
    heading: 'Summary',
    body: [
      'Harbor payments lets marketplace sellers in 11 EU countries receive payouts in local currency within one business day.',
      'Launch targets 2,400 sellers in the first wave, chosen from accounts with more than €20,000 in monthly volume and no open disputes.',
    ],
  },
  {
    id: 'goals',
    heading: 'Goals',
    body: [
      'Cut median payout time from 3.2 days to under 1 day for first-wave sellers.',
      'Keep payout failure rate under 0.3% for the first 30 days, measured against settled transfers.',
      'Move 15% of eligible volume from card settlement to bank transfer by the end of Q2.',
    ],
  },
  {
    id: 'audience',
    heading: 'Audience',
    body: [
      'Primary: sellers who already invoice in euros and reconcile weekly. Secondary: finance teams at agencies managing more than ten storefronts.',
    ],
  },
] as const;

export const COHORT_COLUMNS = ['Country', 'Sellers', 'Monthly volume', 'Go-live', 'Owner'] as const;

/** First-wave cohorts; seller counts add up to the 2,400 in the Summary. */
export const COHORTS = [
  ['Germany', '640', '€18.4M', '14 April', 'Jonas Weber'],
  ['Netherlands', '310', '€7.9M', '28 April', 'Aisha Bello'],
  ['Ireland', '120', '€3.1M', '14 April', 'Mei Chen'],
  ['France', '420', '€11.2M', '5 May', 'Elena Petrova'],
  ['Spain', '280', '€6.6M', '5 May', 'Tomás Herrera'],
  ['Italy', '260', '€6.0M', '12 May', 'Ravi Patel'],
  ['Belgium', '140', '€3.4M', '12 May', 'Aisha Bello'],
  ['Austria', '230', '€5.2M', '19 May', 'Kwame Asante'],
] as const;

export const PLAN_STEPS = [
  'Week 1 — enable for 200 design-partner sellers and monitor reconciliation.',
  'Week 3 — expand to 1,000 sellers in Germany, the Netherlands and Ireland.',
  'Week 5 — open to the remaining first-wave sellers; publish the help-centre guide.',
  'Week 8 — review failure rate and support volume before the second wave.',
] as const;

export const RISKS = [
  'Bank holidays shift settlement windows; the payout calendar must read the TARGET2 schedule.',
  'Sellers on legacy IBAN validation may see their first payout held for manual review.',
  'Support volume could double in week 3 if onboarding emails go out before the guide.',
] as const;

export const COMMENTS: AgMessage[] = [
  {
    id: 'c-1',
    role: 'user',
    parts: [{ type: 'text', text: 'Can we state the dispute threshold explicitly? Finance asked whether “no open disputes” means the last 90 days.' }],
    metadata: { createdAt: at(-52) },
  },
  {
    id: 'c-2',
    role: 'assistant',
    parts: [{ type: 'text', text: 'Yes — 90 days, matching the risk policy. I will add it to the Summary. (Tomás)' }],
    metadata: { createdAt: at(-47) },
  },
  {
    id: 'c-3',
    role: 'user',
    parts: [{ type: 'text', text: 'Week 3 overlaps the Dutch King’s Day holiday. Should we start that cohort on the Tuesday instead?' }],
    metadata: { createdAt: at(-21) },
  },
  {
    id: 'c-4',
    role: 'assistant',
    parts: [{ type: 'text', text: 'Agreed, moving the NL cohort to Tuesday 28 April and noting it under Risks. (Aisha)' }],
    metadata: { createdAt: at(-6) },
  },
];
