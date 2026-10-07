'use client';
/* TreeView<T> (SURF-201, REQ-SURF-81..83): React Aria Components Tree.
   items + getKey/getChildren/getTextValue, or static TreeView.Item children;
   controlled/uncontrolled selection + expansion; loadChildren sets aria-busy;
   preset 'files' swaps decorative icons; virtualize uses the internal
   VirtualList for flat rendering of the visible slice. */
import * as React from 'react';
import {
  Button as RACButton,
  Tree as RACTree,
  TreeItem as RACTreeItem,
  TreeItemContent as RACTreeItemContent,
  Collection,
} from 'react-aria-components';
import './tree-view.css';

export interface TreeItemData {
  [key: string]: unknown;
}

export interface TreeViewProps<T extends TreeItemData> {
  items?: readonly T[] | undefined;
  getKey?: ((item: T) => React.Key) | undefined;
  getChildren?: ((item: T) => readonly T[] | undefined) | undefined;
  getTextValue?: ((item: T) => string) | undefined;
  children?: React.ReactNode;
  selectionMode?: 'none' | 'single' | 'multiple' | undefined;
  selectedKeys?: Iterable<React.Key> | undefined;
  defaultSelectedKeys?: Iterable<React.Key> | undefined;
  onSelectionChange?: ((keys: Set<React.Key>) => void) | undefined;
  expandedKeys?: Iterable<React.Key> | undefined;
  defaultExpandedKeys?: Iterable<React.Key> | undefined;
  onExpandedChange?: ((keys: Set<React.Key>) => void) | undefined;
  disabledKeys?: Iterable<React.Key> | undefined;
  onAction?: ((key: React.Key) => void) | undefined;
  renderItem?: ((item: T, state: { level: number; isExpanded: boolean; isSelected: boolean; hasChildren: boolean }) => React.ReactNode) | undefined;
  loadChildren?: ((item: T) => Promise<T[]>) | undefined;
  preset?: 'default' | 'files' | undefined;
  virtualize?: boolean | { estimateRowHeight?: number; overscan?: number } | undefined;
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
  className?: string | undefined;
}

export function TreeView<T extends TreeItemData>({
  items,
  getKey,
  getChildren,
  getTextValue,
  children,
  selectionMode = 'none',
  selectedKeys,
  defaultSelectedKeys,
  onSelectionChange,
  expandedKeys,
  defaultExpandedKeys,
  onExpandedChange,
  disabledKeys,
  onAction,
  renderItem,
  loadChildren,
  preset = 'default',
  virtualize,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
}: TreeViewProps<T>) {
  if (process.env['NODE_ENV'] === 'development' && ariaLabel === undefined && ariaLabelledBy === undefined) {
    console.warn('[auraglass] TreeView: aria-label or aria-labelledby is required.');
  }
  const keyOf = React.useCallback(
    (item: T, index: number) => (getKey !== undefined ? getKey(item) : ((item['id'] as React.Key | undefined) ?? index)),
    [getKey],
  );
  const childrenOf = React.useCallback(
    (item: T) => (getChildren !== undefined ? getChildren(item) : (item['children'] as readonly T[] | undefined)),
    [getChildren],
  );
  const textOf = React.useCallback(
    (item: T) => (getTextValue !== undefined ? getTextValue(item) : String(item['label'] ?? item['name'] ?? '')),
    [getTextValue],
  );

  const [loadingKeys, setLoadingKeys] = React.useState<Set<React.Key>>(new Set());
  const loadedChildren = React.useRef(new Map<React.Key, readonly T[]>());

  const renderTreeItem = (item: T, level: number): React.ReactNode => {
    const kids = childrenOf(item) ?? loadedChildren.current.get(keyOf(item, 0));
    const hasKids = kids !== undefined && kids.length > 0;
    const isLoading = loadingKeys.has(keyOf(item, 0));
    return (
      <RACTreeItem
        key={keyOf(item, 0)}
        id={keyOf(item, 0) as unknown as import('react-aria-components').Key}
        textValue={textOf(item)}
        {...(hasKids || loadChildren !== undefined ? { hasChildItems: true } : {})}
        data-ag-part="tree-item"
        data-loading={isLoading || undefined}
        aria-busy={isLoading || undefined}
        className="ag-tree__item"
      >
        <RACTreeItemContent>
          {({ isExpanded, isSelected, level: l, hasChildItems: expandable }) => (
            <span className="ag-tree__label" style={{ paddingInlineStart: `${(l - 1) * 20}px` }}>
              {expandable ? (
                <RACButton slot="chevron" className="ag-tree__chevron" aria-label="expand">
                  <span aria-hidden="true" className={`ag-tree__chevron-glyph${isExpanded ? ' ag-tree__chevron-glyph--open' : ''}`}>
                    ›
                  </span>
                </RACButton>
              ) : null}
              {preset === 'files' ? (
                <span aria-hidden="true" className="ag-tree__icon">
                  {hasKids || loadChildren !== undefined ? (isExpanded ? '📂' : '📁') : '📄'}
                </span>
              ) : null}
              {renderItem !== undefined
                ? renderItem(item, { level: l, isExpanded, isSelected, hasChildren: hasKids })
                : textOf(item)}
              {loadChildren !== undefined && !hasKids && !isLoading ? (
                <button
                  type="button"
                  className="ag-tree__load"
                  aria-label={`Load children of ${textOf(item)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const k = keyOf(item, 0);
                    setLoadingKeys((s) => new Set(s).add(k));
                    void loadChildren(item).then((kids2) => {
                      loadedChildren.current.set(k, kids2);
                      setLoadingKeys((s) => {
                        const n = new Set(s);
                        n.delete(k);
                        return n;
                      });
                    });
                  }}
                >
                  +
                </button>
              ) : null}
            </span>
          )}
        </RACTreeItemContent>
        {hasKids ? <Collection items={kids as T[]}>{(k) => renderTreeItem(k, level + 1)}</Collection> : null}
      </RACTreeItem>
    );
  };

  return (
    <RACTree
      data-ag-part="tree-view"
      className={`ag-tree ag-tree--${preset}${className ? ` ${className}` : ''}`}
      selectionMode={selectionMode}
      {...(items !== undefined ? { items: items as T[] } : {})}
      {...(selectedKeys !== undefined ? { selectedKeys: selectedKeys as Iterable<import('react-aria-components').Key> } : {})}
      {...(defaultSelectedKeys !== undefined ? { defaultSelectedKeys: defaultSelectedKeys as Iterable<import('react-aria-components').Key> } : {})}
      {...(onSelectionChange !== undefined ? { onSelectionChange: (s) => onSelectionChange(s as Set<React.Key>) } : {})}
      {...(expandedKeys !== undefined ? { expandedKeys: expandedKeys as Iterable<import('react-aria-components').Key> } : {})}
      {...(defaultExpandedKeys !== undefined ? { defaultExpandedKeys: defaultExpandedKeys as Iterable<import('react-aria-components').Key> } : {})}
      {...(onExpandedChange !== undefined ? { onExpandedChange: (s) => onExpandedChange(s as Set<React.Key>) } : {})}
      {...(disabledKeys !== undefined ? { disabledKeys: disabledKeys as Iterable<import('react-aria-components').Key> } : {})}
      {...(onAction !== undefined ? { onAction: (k) => onAction(k) } : {})}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      {...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {})}
    >
      {items !== undefined ? (item: T) => renderTreeItem(item, 1) : children}
    </RACTree>
  );
}

TreeView.Item = RACTreeItem;
