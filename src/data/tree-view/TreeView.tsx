'use client';
/* TreeView<T> (SURF-201, REQ-SURF-81..83): React Aria Components Tree.
   items + getKey/getChildren/getTextValue, or static TreeView.Item children;
   controlled/uncontrolled selection + expansion; loadChildren sets aria-busy;
   preset 'files' swaps decorative icons; virtualize wraps the RAC Tree in a
   RAC <Virtualizer layout={ListLayout}> so only the visible slice of the
   expanded tree is in the DOM (REQ-SURF-83). Roles come from
   ./treeSemantics (OD-20 default: treegrid). */
import * as React from 'react';
import { ChevronRightIcon } from '../../icons/navigation/chevron-right';
import { FolderIcon } from '../../icons/navigation/folder';
import { FolderOpenIcon } from '../../icons/action/folder-open';
import { FileIcon } from '../../icons/data/file';
import {
  Button as RACButton,
  Tree as RACTree,
  TreeItem as RACTreeItem,
  TreeItemContent as RACTreeItemContent,
  Collection,
  ListLayout,
  Rect,
  Virtualizer,
  useLocale,
} from 'react-aria-components';
import { TREE_ITEM_SELECTOR } from './treeSemantics';

/** REQ-SURF-83: fixed row height the virtualizer lays rows out at (px). */
const DEFAULT_VIRTUAL_ROW_HEIGHT = 32;

/* RAC ListLayout has no overscan option: widen the visible rect by
   `overscan` rows on both sides before asking for the visible layout infos. */
function createTreeLayout(rowHeight: number, overscan: number): ListLayout<unknown> {
  class OverscanListLayout extends ListLayout<unknown> {
    override getVisibleLayoutInfos(rect: Rect) {
      if (overscan <= 0) return super.getVisibleLayoutInfos(rect);
      const extra = overscan * rowHeight;
      const y = Math.max(0, rect.y - extra);
      return super.getVisibleLayoutInfos(new Rect(rect.x, y, rect.width, rect.height + (rect.y - y) + extra));
    }
  }
  return new OverscanListLayout({ rowHeight });
}

export interface TreeItemData {
  [key: string]: unknown;
}

export interface TreeViewLabels {
  /** Accessible name of the expand/collapse chevron. Default "Expand". */
  expand?: string | undefined;
  /** Chevron name while the item is expanded. Default "Collapse". */
  collapse?: string | undefined;
}

export interface TreeViewBaseProps<T extends TreeItemData> {
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
  /** REQ-SURF-83: render only the visible rows. `estimateRowHeight` is the
      fixed row height in px the rows are laid out at (default 32);
      `overscan` adds that many rows above and below the viewport (default 0).
      The tree becomes its own scroll container and fills its parent's
      block size, so give the parent a height. */
  virtualize?: boolean | { estimateRowHeight?: number; overscan?: number } | undefined;
  /** Localised strings (chevron names). */
  labels?: TreeViewLabels | undefined;
  className?: string | undefined;
}

/** REQ-SURF-81: the tree must be named — `aria-label` or `aria-labelledby`
    is a required union (omitting both is a type error). */
export type TreeViewLabelling =
  | { 'aria-label': string; 'aria-labelledby'?: string | undefined }
  | { 'aria-labelledby': string; 'aria-label'?: string | undefined };

export type TreeViewProps<T extends TreeItemData> = TreeViewBaseProps<T> & TreeViewLabelling;

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
  labels,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  className,
}: TreeViewProps<T>) {
  const chevronExpand = labels?.expand ?? 'Expand';
  const chevronCollapse = labels?.collapse ?? 'Collapse';
  const { direction } = useLocale();
  const virtualRowHeight =
    typeof virtualize === 'object' && virtualize.estimateRowHeight !== undefined ? virtualize.estimateRowHeight : DEFAULT_VIRTUAL_ROW_HEIGHT;
  const virtualOverscan = typeof virtualize === 'object' && virtualize.overscan !== undefined ? virtualize.overscan : 0;
  const isVirtual = virtualize !== undefined && virtualize !== false;
  // One layout instance per (row height, overscan); RAC's Virtualizer keeps
  // it for its lifetime.
  const layout = React.useMemo(
    () => (isVirtual ? createTreeLayout(virtualRowHeight, virtualOverscan) : null),
    [isVirtual, virtualRowHeight, virtualOverscan],
  );
  if (process.env['NODE_ENV'] === 'development' && ariaLabel === undefined && ariaLabelledBy === undefined) {
    console.warn('[auraglass] TreeView: aria-label or aria-labelledby is required.');
  }
  const keyOf = React.useCallback(
    (item: T, index: number) => (getKey !== undefined ? getKey(item) : ((item['id'] as React.Key | undefined) ?? (item['key'] as React.Key | undefined) ?? index)),
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
  // SURF-081: expanding a node with no loaded children triggers loadChildren
  // (the '+' button is gone). flatRef maps key->item so onExpandedChange can
  // resolve which item needs loading.
  const flatRef = React.useRef(new Map<React.Key, T>());
  const prevExpanded = React.useRef<Set<React.Key>>(new Set());
  const [internalExpanded, setInternalExpanded] = React.useState<Set<React.Key>>(
    () => new Set(defaultExpandedKeys as Iterable<React.Key> | undefined),
  );
  const [loadTick, forceRender] = React.useReducer((x: number) => x + 1, 0);
  // RAC caches item renders per item object: everything renderTreeItem reads
  // besides the item itself must be listed so loading state, lazily loaded
  // children and label/preset changes re-render the rows.
  const deps = [loadingKeys, loadTick, chevronExpand, chevronCollapse, preset, renderItem, keyOf, childrenOf, textOf, loadChildren];

  const renderTreeItem = (item: T, level: number): React.ReactNode => {
    flatRef.current.set(keyOf(item, 0), item);
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
        // RAC's filterDOMProps drops aria-busy from TreeItem props, so the
        // attribute is applied to the row element directly (re-run on every
        // render of this item via the dependencies list).
        ref={(el: HTMLDivElement | null) => {
          if (el === null) return;
          if (isLoading) el.setAttribute('aria-busy', 'true');
          else el.removeAttribute('aria-busy');
        }}
        className="ag-tree__item"
      >
        <RACTreeItemContent>
          {({ isExpanded, isSelected, level: l, hasChildItems: expandable }) => (
            // SURF-081: indentation = (level-1) x --_ag-tree-indent (20px,
            // 12px below 480px — tree-view.css); no inline px.
            <span className="ag-tree__label" style={{ '--_ag-tree-level': l - 1 } as React.CSSProperties}>
              {expandable ? (
                <RACButton slot="chevron" className="ag-tree__chevron" aria-label={isExpanded ? chevronCollapse : chevronExpand}>
                  <ChevronRightIcon
                    aria-hidden="true"
                    size="1em"
                    className={`ag-tree__chevron-glyph${isExpanded ? ' ag-tree__chevron-glyph--open' : ''}`}
                  />
                </RACButton>
              ) : null}
              {preset === 'files' ? (
                // Decorative CMP icons (aria-hidden svg) — replaces the
                // GlassFileTree/GlassFileExplorer glyphs.
                hasKids || loadChildren !== undefined ? (
                  isExpanded ? (
                    <FolderOpenIcon aria-hidden="true" size="1em" className="ag-tree__icon" data-ag-icon="folder-open" />
                  ) : (
                    <FolderIcon aria-hidden="true" size="1em" className="ag-tree__icon" data-ag-icon="folder" />
                  )
                ) : (
                  <FileIcon aria-hidden="true" size="1em" className="ag-tree__icon" data-ag-icon="file" />
                )
              ) : null}
              {renderItem !== undefined
                ? renderItem(item, { level: l, isExpanded, isSelected, hasChildren: hasKids })
                : textOf(item)}
              {isLoading ? (
                <span className="ag-tree__spinner" aria-hidden="true" data-ag-part="tree-loading" />
              ) : null}
            </span>
          )}
        </RACTreeItemContent>
        {hasKids ? <Collection items={kids as T[]} dependencies={deps}>{(k) => renderTreeItem(k, level + 1)}</Collection> : null}
      </RACTreeItem>
    );
  };

  const applyExpanded = (next: Set<React.Key>) => {
    // SURF-081: lazy-load on expand — an expandable item with no
    // children yet fires loadChildren and holds aria-busy until it lands.
    if (loadChildren !== undefined) {
      for (const k of next) {
        if (prevExpanded.current.has(k) || loadedChildren.current.has(k)) continue;
        const item = flatRef.current.get(k);
        if (item === undefined) continue;
        if (childrenOf(item) !== undefined && (childrenOf(item) as readonly T[]).length > 0) continue;
        setLoadingKeys((prev) => new Set(prev).add(k));
        void loadChildren(item).then((kids2) => {
          loadedChildren.current.set(k, kids2);
          setLoadingKeys((prev) => {
            const n = new Set(prev);
            n.delete(k);
            return n;
          });
          forceRender();
        });
      }
    }
    prevExpanded.current = next;
    if (expandedKeys === undefined) setInternalExpanded(next);
    onExpandedChange?.(next);
  };

  const kidsOf = (item: T): readonly T[] | undefined => childrenOf(item) ?? loadedChildren.current.get(keyOf(item, 0));

  /* Data-driven lookup of an item's sibling list (the parent's children, or
     the root items). Walks the data, not the DOM, so it also works when the
     virtualizer has not rendered every sibling. */
  const siblingsOf = (key: string): readonly T[] | undefined => {
    if (items === undefined) return undefined;
    const stack: Array<readonly T[]> = [items];
    while (stack.length > 0) {
      const list = stack.pop() as readonly T[];
      for (const it of list) {
        if (String(keyOf(it, 0)) === key) return list;
        const k = kidsOf(it);
        if (k !== undefined && k.length > 0) stack.push(k);
      }
    }
    return undefined;
  };

  const currentExpanded = (): Set<React.Key> =>
    new Set(expandedKeys !== undefined ? (expandedKeys as Iterable<React.Key>) : internalExpanded);

  /* REQ-SURF-82: the two APG tree keys RAC's Tree does not implement.
     - Right on an expanded parent row moves focus to its first child (RAC
       would move focus into the row's chevron button instead).
     - '*' expands every expandable sibling of the focused item.
     Everything else (Up/Down, Home/End, Left collapse/parent, Right expand,
     type-ahead, Enter action, Space selection) is RAC's. */
  const onTreeKeyDownCapture = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (items === undefined || e.altKey || e.ctrlKey || e.metaKey) return;
    const target = e.target as HTMLElement;
    if (!target.matches(TREE_ITEM_SELECTOR)) return;
    const key = target.getAttribute('data-key');
    if (key === null) return;
    if (e.key === '*') {
      const siblings = siblingsOf(key);
      if (siblings === undefined) return;
      const next = currentExpanded();
      let changed = false;
      for (const s of siblings) {
        const k = kidsOf(s);
        const expandable = (k !== undefined && k.length > 0) || loadChildren !== undefined;
        if (expandable && !next.has(keyOf(s, 0))) {
          next.add(keyOf(s, 0));
          changed = true;
        }
      }
      e.preventDefault();
      e.stopPropagation();
      if (changed) applyExpanded(next);
      return;
    }
    const expandKey = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    if (e.key === expandKey && target.getAttribute('aria-expanded') === 'true') {
      const parent = siblingsOf(key)?.find((s) => String(keyOf(s, 0)) === key);
      const first = parent !== undefined ? kidsOf(parent)?.[0] : undefined;
      if (first === undefined) return;
      const firstKey = String(keyOf(first, 0));
      const tree = target.closest('[data-ag-part="tree-view"]');
      const row = [...(tree?.querySelectorAll<HTMLElement>(TREE_ITEM_SELECTOR) ?? [])].find(
        (r) => r.getAttribute('data-key') === firstKey,
      );
      if (row === undefined) return;
      e.preventDefault();
      e.stopPropagation();
      row.focus();
    }
  };

  const tree = (
    <RACTree
      data-ag-part="tree-view"
      className={`ag-tree ag-tree--${preset}${layout !== null ? ' ag-tree--virtual' : ''}${className ? ` ${className}` : ''}`}
      selectionMode={selectionMode}
      dependencies={deps}
      {...(items !== undefined ? { items: items as T[] } : {})}
      {...(selectedKeys !== undefined ? { selectedKeys: selectedKeys as Iterable<import('react-aria-components').Key> } : {})}
      {...(defaultSelectedKeys !== undefined ? { defaultSelectedKeys: defaultSelectedKeys as Iterable<import('react-aria-components').Key> } : {})}
      {...(onSelectionChange !== undefined ? { onSelectionChange: (s) => onSelectionChange(s as Set<React.Key>) } : {})}
      {...(expandedKeys !== undefined ? { expandedKeys: expandedKeys as Iterable<import('react-aria-components').Key> } : {})}
      {...(defaultExpandedKeys !== undefined ? { defaultExpandedKeys: defaultExpandedKeys as Iterable<import('react-aria-components').Key> } : {})}
      {...((expandedKeys === undefined ? { expandedKeys: internalExpanded as Iterable<import('react-aria-components').Key> } : {}))}
      onExpandedChange={(s) => applyExpanded(new Set(s as Set<React.Key>))}
      {...(disabledKeys !== undefined ? { disabledKeys: disabledKeys as Iterable<import('react-aria-components').Key> } : {})}
      {...(onAction !== undefined ? { onAction: (k) => onAction(k) } : {})}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
      {...(ariaLabelledBy !== undefined ? { 'aria-labelledby': ariaLabelledBy } : {})}
    >
      {items !== undefined ? (item: T) => renderTreeItem(item, 1) : children}
    </RACTree>
  );

  // The host only exists to see key events before RAC's row handlers (RAC
  // Tree forwards no keyboard props); display:contents keeps it out of layout.
  return (
    <div style={{ display: 'contents' }} onKeyDownCapture={onTreeKeyDownCapture}>
      {layout !== null ? <Virtualizer layout={layout}>{tree}</Virtualizer> : tree}
    </div>
  );
}

/* REQ-CMP-01 / CMP-014: static children use an AuraGlass-owned item seam so
   the emitted d.ts never names react-aria-components (assigning RACTreeItem
   directly leaked its type into TreeView.d.ts). */
export interface TreeViewItemProps {
  /** Unique key of the item within the tree. */
  id: React.Key;
  /** Plain-text label used for typeahead and the accessible name. */
  textValue: string;
  /** Mark the item expandable before its children are known. */
  hasChildItems?: boolean | undefined;
  children?: React.ReactNode;
  className?: string | undefined;
  'aria-label'?: string | undefined;
}

function TreeViewItem({ id, textValue, hasChildItems, children, className, 'aria-label': ariaLabel }: TreeViewItemProps) {
  // Nested TreeView.Item children become child rows; everything else is the
  // row's content (RAC needs it inside TreeItemContent to render).
  const nested: React.ReactNode[] = [];
  const content: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === TreeViewItem) nested.push(child);
    else content.push(child);
  });
  const expandable = hasChildItems ?? nested.length > 0;
  return (
    <RACTreeItem
      id={id as unknown as import('react-aria-components').Key}
      textValue={textValue}
      {...(expandable ? { hasChildItems: true } : {})}
      data-ag-part="tree-item"
      className={`ag-tree__item${className !== undefined ? ` ${className}` : ''}`}
      {...(ariaLabel !== undefined ? { 'aria-label': ariaLabel } : {})}
    >
      <RACTreeItemContent>
        {({ level, hasChildItems: canExpand }) => (
          <span className="ag-tree__label" style={{ '--_ag-tree-level': level - 1 } as React.CSSProperties}>
            {canExpand ? (
              <RACButton slot="chevron" className="ag-tree__chevron" aria-label="Expand">
                <ChevronRightIcon aria-hidden="true" size="1em" className="ag-tree__chevron-glyph" />
              </RACButton>
            ) : null}
            {content}
          </span>
        )}
      </RACTreeItemContent>
      {nested}
    </RACTreeItem>
  );
}

TreeView.Item = TreeViewItem;
