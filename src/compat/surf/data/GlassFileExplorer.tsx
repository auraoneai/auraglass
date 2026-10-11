/* GlassFileExplorer — 4.x compat adapter (REQ-SURF-13, DEP-S0207) →
   TreeView preset="files" (shared LegacyFileTree mapping). files
   {id,name,type,path,children} → items, selectedFiles[0] → selected key,
   onFileSelect(file) ← selection, onFileOpen(file) ← tree action (Enter /
   double activation is the 5.0 TreeView onAction). currentPath, toolbar,
   breadcrumb, search and grid view are app chrome in 5.0 and not rendered. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { LegacyFileTree, type LegacyFileNode } from './GlassFileTree';

export interface GlassFileExplorerProps {
  files?: LegacyFileNode[];
  currentPath?: string;
  selectedFiles?: string[];
  onFileSelect?: (file: LegacyFileNode) => void;
  'aria-label'?: string;
  className?: string;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassFileExplorer` compat adapter (DEP-S0207).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link TreeView from aura-glass/data}.
 */
export function GlassFileExplorer(props: GlassFileExplorerProps) {
  warnDeprecated('DEP-S0207');
  const { files, currentPath, selectedFiles, onFileSelect, className } = props;
  return (
    <LegacyFileTree
      nodes={files ?? []}
      {...(selectedFiles?.[0] !== undefined ? { selectedNodeId: selectedFiles[0] } : {})}
      {...(onFileSelect ? { onNodeSelect: onFileSelect } : {})}
      aria-label={props['aria-label'] ?? (currentPath ? `Files in ${currentPath}` : 'Files')}
      {...(className ? { className } : {})}
    />
  );
}
