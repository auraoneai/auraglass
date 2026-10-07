// Root barrel slice for SURF (contract S-28 ROOT_EXPORTS.surf). Lane blocks
// are owned by SURF lanes W1..W5; edit only your own block.
// A re-export line lands only when the component's import graph is free of
// @ag-contract-seed markers (index rule) — empty until lanes deliver.

// --- lane W1 begin ---
// W1 (SURF-113): no exports land yet. Tabs, Command and SourceTransition are
// implemented, but their import graphs reach @ag-contract-seed barrels
// (../../motion, ../../theme); TabBar/Breadcrumbs/Pagination/CommandPalette
// additionally reach seeded CMP seams (search-field, menu, dialog). Each
// re-export lands in the PR where the owning stream replaces its seed:
//   export { Tabs } from '../components/tabs/Tabs';
//   export { TabBar } from '../components/tab-bar/TabBar';
//   export { Breadcrumbs } from '../components/breadcrumbs/Breadcrumbs';
//   export { Pagination } from '../components/pagination/Pagination';
//   export { CommandPalette } from '../components/command-palette/CommandPalette';
//   export { Command } from '../components/command-palette/Command';
//   export { SourceTransition } from '../components/source-transition/SourceTransition';
// --- lane W1 end ---

// --- lane W2 begin ---
// REQ-SURF-96/97: Timeline + ActivityFeed are seed-free (Timeline imports only
// its own css; ActivityFeed composes Timeline).
export { Timeline, formatTimestamp } from '../components/timeline/Timeline';
export type { TimelineItem, TimelineProps } from '../components/timeline/Timeline';
export { ActivityFeed } from '../components/timeline/ActivityFeed';
export type { ActivityItem, ActivityFeedProps } from '../components/timeline/ActivityFeed';
// --- lane W2 end ---

// --- lane W3 begin ---
// --- lane W3 end ---

// --- lane W4 begin ---
// --- lane W4 end ---

// --- lane W5 begin ---
// --- lane W5 end ---

export {};
