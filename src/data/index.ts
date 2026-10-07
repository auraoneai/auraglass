// ./data barrel (SURF-140/161/192/207): the frozen set — Table, TreeView,
// FilterBar, Chip, KeyValueEditor, StatCard, Sparkline, ChartFrame.
// VirtualList is internal (consumed by ai/Command) and intentionally NOT
// exported. Timeline/ActivityFeed are ROOT exports (src/components/timeline).
export { Table } from './table/Table';
export type { TableHandle, TableMessages, TableProps } from './table/Table';
export type { TableColumnDef, TableDensity, TableMode, SelectionMode } from './table/types';

export { TreeView } from './tree-view/TreeView';
export type { TreeViewProps } from './tree-view/TreeView';

export { FilterBar } from './filter-bar/FilterBar';
export type { FilterBarProps } from './filter-bar/FilterBar';
export type { FilterField, FilterGroup, FilterNode, FilterRule, FilterModel } from './filter-bar/filter-model';
export type {} from './filter-bar/filter-serialize';

export { Chip } from './chip';
export type { ChipProps } from './chip';

export { KeyValueEditor } from './key-value-editor';
export type { KeyValueEditorProps, KeyValuePair } from './key-value-editor';

export { StatCard } from './stat-card/StatCard';
export type { StatCardProps } from './stat-card/StatCard';

export { Sparkline } from './sparkline/Sparkline';
export type { SparklineProps } from './sparkline/Sparkline';

export { ChartFrame } from './chart-frame/ChartFrame';
export type { ChartFrameProps } from './chart-frame/ChartFrame';
export type { ChartAdapter, ChartContext, ChartSeries } from './chart-frame/types';
