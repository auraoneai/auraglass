import React from 'react';

export interface TreeItem {
  id: string;
  label: string;
  children?: TreeItem[];
  icon?: React.ReactNode;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  data?: any;
}

export interface TreeViewProps extends React.HTMLAttributes<HTMLUListElement> {
  items?: TreeItem[];
  selectedIds?: string[];
  expandedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onExpansionChange?: (expandedIds: string[]) => void;
  multiSelect?: boolean;
  showIcons?: boolean;
  showLines?: boolean;
  glassVariant?: 'frosted' | 'dynamic' | 'clear' | 'tinted' | 'luminous';
  blurStrength?: 'none' | 'light' | 'standard' | 'heavy';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  glass?: boolean;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

  /** Glass surface intent */
  intent?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  
  /** Glass surface elevation */
  elevation?: 'level1' | 'level2' | 'level3' | 'level4';
  
  /** Performance tier */
  tier?: 'low' | 'medium' | 'high';
}

export interface TreeViewContextProps {
  expanded: string[];
  selected: string[];
  focused: string[];
  multiSelect: boolean;
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
  glass: boolean;
  selectNode?: (nodeId: string) => void;
  toggleNode?: (nodeId: string) => void;
  focusNode?: (nodeId: string) => void;
  showIcons?: boolean;
  showLines?: boolean;
}
