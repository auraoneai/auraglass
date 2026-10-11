/* ops-console copy and deterministic data (REQ-QUAL-58 / REQ-QUAL-59). */
import type { ActivityItem } from 'aura-glass';
import type { TableColumnDef } from 'aura-glass/data';

/** Fixed showcase epoch: 2026-03-02T09:30:00Z. */
export const SHOWCASE_EPOCH = Date.UTC(2026, 2, 2, 9, 30, 0);

const at = (minutes: number) => new Date(SHOWCASE_EPOCH + minutes * 60_000).toISOString();

export const COPY = {
  skip: 'Skip to incidents',
  pageTitle: 'Production incidents',
  pageDescription: '7 open incidents across 3 regions. Paging policy: payments and identity escalate after 10 minutes.',
  incidentsHeading: 'Open incidents',
  incidentsCaption: 'Open incidents by severity',
  topologyHeading: 'Service topology',
  detailHeading: 'checkout-api — eu-west-1',
  activityHeading: 'Recent activity',
  actions: 'Incident actions',
  resolveTitle: 'Resolve INC-4821?',
  resolveBody: 'Resolving closes the bridge, stops paging the payments rotation and posts the all-clear to the status page.',
  resolveAction: 'Resolve incident',
  ackTooltip: 'Acknowledge stops escalation for 30 minutes',
  toastTitle: 'Escalation paused',
  toastBody: 'INC-4821 acknowledged by Priya Raman.',
} as const;

export interface IncidentRow {
  id: string;
  severity: 'SEV-1' | 'SEV-2' | 'SEV-3';
  service: string;
  region: string;
  summary: string;
  commander: string;
  opened: string;
  status: 'Investigating' | 'Mitigating' | 'Monitoring';
}

export const INCIDENTS: IncidentRow[] = [
  { id: 'INC-4821', severity: 'SEV-2', service: 'checkout-api', region: 'eu-west-1', summary: 'p99 latency above 900 ms after 7.14.2 rollout', commander: 'Priya Raman', opened: '09:12', status: 'Mitigating' },
  { id: 'INC-4820', severity: 'SEV-3', service: 'search-gateway', region: 'us-east-2', summary: 'Intermittent 502s from edge pool B', commander: 'Diego Alvarez', opened: '08:47', status: 'Investigating' },
  { id: 'INC-4819', severity: 'SEV-1', service: 'identity', region: 'ap-south-1', summary: 'Token refresh failing for 4% of sessions', commander: 'Hana Sato', opened: '08:31', status: 'Mitigating' },
  { id: 'INC-4818', severity: 'SEV-3', service: 'notifications', region: 'eu-central-1', summary: 'SMS provider delivery delays', commander: 'Lars Nilsen', opened: '07:55', status: 'Monitoring' },
  { id: 'INC-4817', severity: 'SEV-2', service: 'ledger-writer', region: 'us-east-2', summary: 'Replication lag above 40 s on shard 7', commander: 'Amara Okafor', opened: '07:20', status: 'Investigating' },
  { id: 'INC-4816', severity: 'SEV-3', service: 'media-transcode', region: 'us-west-2', summary: 'Queue depth over 12,000 jobs', commander: 'Wen Li', opened: '06:58', status: 'Monitoring' },
  { id: 'INC-4815', severity: 'SEV-3', service: 'billing-export', region: 'eu-west-1', summary: 'Nightly export finished 52 minutes late', commander: 'Sofia Rossi', opened: '06:10', status: 'Monitoring' },
];

export const INCIDENT_COLUMNS: TableColumnDef<IncidentRow>[] = [
  { accessorKey: 'id', header: 'Incident', meta: { headerLabel: 'Incident' } },
  { accessorKey: 'severity', header: 'Severity', meta: { headerLabel: 'Severity' } },
  { accessorKey: 'service', header: 'Service', meta: { headerLabel: 'Service' } },
  { accessorKey: 'region', header: 'Region', meta: { headerLabel: 'Region' } },
  { accessorKey: 'summary', header: 'Summary', meta: { headerLabel: 'Summary' } },
  { accessorKey: 'commander', header: 'Commander', meta: { headerLabel: 'Incident commander' } },
  { accessorKey: 'opened', header: 'Opened (UTC)', meta: { headerLabel: 'Opened, UTC' } },
  { accessorKey: 'status', header: 'Status', meta: { headerLabel: 'Status' } },
];

export type TopologyNode = {
  id: string;
  label: string;
  children?: TopologyNode[];
};

export const TOPOLOGY: TopologyNode[] = [
  {
    id: 'eu-west-1',
    label: 'eu-west-1',
    children: [
      { id: 'checkout-api', label: 'checkout-api (12 pods, 2 degraded)' },
      { id: 'billing-export', label: 'billing-export (3 pods)' },
      { id: 'payments-db', label: 'payments-db (primary + 2 replicas)' },
    ],
  },
  {
    id: 'us-east-2',
    label: 'us-east-2',
    children: [
      { id: 'search-gateway', label: 'search-gateway (8 pods)' },
      { id: 'ledger-writer', label: 'ledger-writer (shard 7 lagging)' },
    ],
  },
  { id: 'ap-south-1', label: 'ap-south-1', children: [{ id: 'identity', label: 'identity (6 pods)' }] },
];

export const DETAIL_FIELDS = [
  { label: 'Current release', value: '7.14.2 (canary 25%)' },
  { label: 'Previous release', value: '7.14.1' },
  { label: 'Error rate', value: '0.42% (budget 0.10%)' },
  { label: 'p99 latency', value: '941 ms' },
  { label: 'Pool utilisation', value: '100% of 32 connections' },
  { label: 'On-call', value: 'Payments rotation — Priya Raman' },
] as const;

export const ACTIVITY: ActivityItem[] = [
  { id: 'a1', timestamp: at(-18), title: 'Canary rollback to 7.14.1 started', intent: 'info', actor: { name: 'Priya Raman' } },
  { id: 'a2', timestamp: at(-21), title: 'Paged payments on-call', intent: 'warning', actor: { name: 'Escalation policy' } },
  { id: 'a3', timestamp: at(-26), title: 'Alert: checkout p99 above 900 ms', intent: 'danger', actor: { name: 'Latency monitor' } },
  { id: 'a4', timestamp: at(-28), title: 'Deploy 7.14.2 reached 25% of eu-west-1', intent: 'neutral', actor: { name: 'Release train' } },
  { id: 'a5', timestamp: at(-43), title: 'Replication lag alert on ledger shard 7', intent: 'warning', actor: { name: 'DB monitor' } },
];
