// Root barrel slice for SURF (contract S-28 ROOT_EXPORTS.surf). Lane blocks
// are owned by SURF lanes W1..W5; edit only your own block.
// A re-export line lands only when the component's import graph is free of
// @ag-contract-seed markers (index rule) — empty until lanes deliver.

// --- lane W1 begin ---
// W1 (SURF-113): the CMP + MAT streams landed — every import-graph seam is
// real now, so the root flagship exports go live.
export { Tabs } from '../components/tabs/Tabs';
export { TabBar } from '../components/tab-bar/TabBar';
export { Breadcrumbs } from '../components/breadcrumbs/Breadcrumbs';
export { Pagination } from '../components/pagination/Pagination';
export { CommandPalette } from '../components/command-palette/CommandPalette';
export { Command } from '../components/command-palette/Command';
export { SourceTransition } from '../components/source-transition/SourceTransition';
// --- lane W1 end ---

// --- lane W2 begin ---
// REQ-SURF-96/97: Timeline + ActivityFeed are seed-free (Timeline imports only
// its own css; ActivityFeed composes Timeline).
export { Timeline } from '../components/timeline/Timeline';
export type { TimelineItem, TimelineProps } from '../components/timeline/Timeline';
export { ActivityFeed } from '../components/timeline/ActivityFeed';
export type { ActivityItem, ActivityFeedProps } from '../components/timeline/ActivityFeed';
// --- lane W2 end ---

// --- lane W3 begin ---
// REQ-SURF-02/170: the W3 surface is the `./ai` subpath (11 exports); the
// contract keeps the root barrel free of AI components at 5.0. Statics land
// on their component objects (Message.Parts, Thread.RenderersProvider, …),
// never as root exports.
// --- lane W3 end ---

// --- lane W4 begin ---
// --- lane W4 end ---

// --- lane W5 begin ---
// --- lane W5 end ---

export {};
