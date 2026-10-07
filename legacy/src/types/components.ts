import React from "react";
// Component-specific type definitions
export * from "./components/button";
export * from "./components/layout";
export * from "./components/form";
export * from "./components/data-display";

// Base component interfaces
export interface GlassComponentProps {
  glassIntensity?: "subtle" | "medium" | "strong" | "intense";
  blur?: number;
  backdrop?: boolean;
  interactive?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Common component variants
export type ButtonVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "outline"
  | "ghost"
  | "link"
  | "text";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export type InputVariant = "default" | "filled" | "outlined" | "underlined";

export type CardVariant = "default" | "elevated" | "outlined" | "glass";

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

// Layout component types
export interface ContainerProps {
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  centerContent?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
}

export interface GridProps {
  columns?:
    | number
    | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  alignItems?: "start" | "center" | "end" | "stretch";
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

export interface FlexProps {
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

// Form component types
export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

// Data display component types
export type TableRecord = Record<string, unknown>;
export type TableCellValue = unknown;

export interface TablePaginationState {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
}

export interface TableColumn<T extends TableRecord = TableRecord> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: TableCellValue, record: T, index: number) => React.ReactNode;
}

export interface TableProps<T extends TableRecord = TableRecord> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: TablePaginationState;
  onChange?: (
    pagination: TablePaginationState,
    filters: Record<string, TableCellValue | TableCellValue[]>,
    sorter: TableColumn<T> | null
  ) => void;
}

// Modal and overlay types
export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  closable?: boolean;
  maskClosable?: boolean;
  centered?: boolean;
  footer?: React.ReactNode | null;
}

// Navigation types
export interface NavItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  disabled?: boolean;
  path?: string;
}

export interface BreadcrumbItem {
  title: string;
  path?: string;
  icon?: React.ReactNode;
}

// Chart types
export interface ChartProps {
  data: Array<Record<string, unknown>>;
  type: "line" | "bar" | "area" | "pie" | "scatter" | "radar";
  width?: number | string;
  height?: number | string;
  colors?: string[];
  showLegend?: boolean;
  showTooltip?: boolean;
}

// Animation and interaction types
export interface PhysicsInteractionProps {
  stiffness?: number;
  damping?: number;
  mass?: number;
  scale?: number;
  rotation?: number;
  duration?: number;
  delay?: number;
}

export interface RippleEffectProps {
  color?: string;
  duration?: number;
  disabled?: boolean;
}
