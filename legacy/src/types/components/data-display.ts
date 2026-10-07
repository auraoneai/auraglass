import React from "react";
// Data display component types
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "outline";
  size?: "xs" | "sm" | "md" | "lg";
  dot?: boolean;
  closable?: boolean;
  onClose?: () => void;
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square" | "rounded";
  fallback?: string | React.ReactNode;
  showBorder?: boolean;
  status?: "online" | "offline" | "busy" | "away";
}

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  closable?: boolean;
  onClose?: () => void;
  color?: string;
  variant?: "default" | "outline" | "solid";
}

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  min?: number;
  showValue?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "success" | "warning" | "error";
  striped?: boolean;
  animated?: boolean;
}

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: string;
  thickness?: number;
  speed?: number;
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
  width?: number | string;
  height?: number | string;
  animation?: "pulse" | "wave" | false;
}

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "success" | "info" | "warning" | "error";
  title?: string;
  closable?: boolean;
  onClose?: () => void;
  showIcon?: boolean;
  banner?: boolean;
}

export interface TooltipProps {
  title: React.ReactNode;
  children: React.ReactElement;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | "leftTop"
    | "leftBottom"
    | "rightTop"
    | "rightBottom";
  trigger?: "hover" | "focus" | "click";
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
}

export interface PopoverProps extends Omit<TooltipProps, "title"> {
  content: React.ReactNode;
  title?: React.ReactNode;
}

export type TableRecord = Record<string, unknown>;
export type TableCellValue = unknown;
export type TableFilterValue = unknown;

export interface TablePaginationState {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
}

export interface TableColumn<T extends TableRecord = TableRecord> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: TableCellValue, record: T, index: number) => React.ReactNode;
  sorter?: (a: T, b: T) => number;
  filters?: { text: string; value: TableFilterValue }[];
  onFilter?: (value: TableFilterValue, record: T) => boolean;
}

export interface TableProps<T extends TableRecord = TableRecord> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: TablePaginationState;
  onChange?: (
    pagination: TablePaginationState,
    filters: Record<string, TableFilterValue | TableFilterValue[]>,
    sorter: TableColumn<T> | null
  ) => void;
  rowKey?: string | ((record: T, index: number) => string);
  size?: "small" | "middle" | "large";
  bordered?: boolean;
  scroll?: { x?: number | string; y?: number | string };
  expandable?: {
    expandedRowRender?: (record: T, index: number) => React.ReactNode;
    rowExpandable?: (record: T) => boolean;
  };
}
