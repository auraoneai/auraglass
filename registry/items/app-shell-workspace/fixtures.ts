/* app-shell-workspace fixtures — deterministic (fixed ISO timestamps, UTC
   absolute formatting in Timeline, so server and client output match). */
export const WORKSPACE_TABS = [
  { id: 'editor', label: 'Editor' },
  { id: 'preview', label: 'Preview' },
  { id: 'history', label: 'History' },
] as const;

export const WORKSPACE_TITLE = 'Untitled document';

export const WORKSPACE_CARDS = [
  { id: 'outline', title: 'Outline', body: '3 sections, 12 paragraphs' },
  { id: 'comments', title: 'Comments', body: '2 open threads' },
  { id: 'stats', title: 'Statistics', body: '1,284 words' },
] as const;

export const WORKSPACE_ACTIVITY = [
  { id: 'a1', timestamp: '2026-01-05T09:00:00.000Z', title: 'Document created' },
  { id: 'a2', timestamp: '2026-01-05T10:30:00.000Z', title: 'Section "Overview" edited' },
  { id: 'a3', timestamp: '2026-01-06T14:15:00.000Z', title: 'Comment resolved' },
] as const;
