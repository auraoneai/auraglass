import React from 'react';
export interface MultiSelectOption<T = string | number> {
  id?: string;
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface OptionGroup<T extends string | number = string> {
  id?: string;
  label: string;
  options: MultiSelectOption<T>[];
}

export interface Step {
  id: string | number;
  title: string;
  label?: string;
  description?: string;
  completed?: boolean;
  active?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface GlassStepInternalProps {
  step?: Step;
  index: number;
  active: boolean;
  completed: boolean;
  orientation: 'horizontal' | 'vertical';
  clickable?: boolean;
  onClick?: (step: Step) => void;
  className?: string;
  style?: React.CSSProperties;

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

export interface MultiSelectProps<T extends string | number = string> {
  options: MultiSelectOption<T>[];
  value?: T[];
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  fullWidth?: boolean;
  width?: string | number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'standard';
  multiple?: boolean;
  maxItems?: number;
  searchable?: boolean;
  creatable?: boolean;
  clearable?: boolean;
  grouped?: boolean;
  virtualized?: boolean;
  maxHeight?: number;
  renderOption?: (option: MultiSelectOption<T>, selected: boolean) => React.ReactNode;
  renderValue?: (selected: MultiSelectOption<T>[]) => React.ReactNode;
  renderToken?: (option: MultiSelectOption<T>, onRemove: (value: T) => void) => React.ReactNode;
  filterOptions?: (options: MultiSelectOption<T>[], input: string) => MultiSelectOption<T>[];
  onCreateOption?: (inputValue: string) => void;
  onInputChange?: (inputValue: string) => void;
  onRemove?: (value: T) => void;
  onSelect?: (option: MultiSelectOption<T>) => void;
  onOpen?: () => void;
  onClose?: () => void;
  loading?: boolean;
  loadingText?: string;
  noOptionsText?: string;
  closeOnSelect?: boolean;
  clearInputOnSelect?: boolean;
  keyboardNavigation?: boolean;
  withGroups?: boolean;
  groups?: OptionGroup<T>[];
  filterFunction?: (options: MultiSelectOption<T>[], input: string) => MultiSelectOption<T>[];
  autoFocus?: boolean;
  ariaLabel?: string;
  openUp?: boolean;
  physics?: any;
  maxSelections?: number;
  renderGroup?: (group: OptionGroup<T>) => React.ReactNode;
  async?: any;
  dataTestId?: string;
  itemRemoveAnimation?: any;
  id?: string;
  errorMessage?: string;
  className?: string;
  style?: React.CSSProperties;
}
