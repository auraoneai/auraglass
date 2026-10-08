/* schema-viewer (REQ-SURF-174, DX-085): a JSON-schema document rendered as a
   TreeView — nodes are properties/keywords, children nest objects/arrays. */
'use client';
import * as React from 'react';
import { TreeView } from 'aura-glass/data';

interface Node { key: string; label: string; children?: Node[] | undefined }

function toNodes(obj: Record<string, unknown>, prefix: string): Node[] {
  return Object.entries(obj).map(([k, v]) => {
    const key = `${prefix}.${k}`;
    const label = `${k}: ${typeof v === 'object' && v !== null ? (Array.isArray(v) ? 'array' : (v as Record<string, unknown>).type ?? 'object') : JSON.stringify(v)}`;
    const children = typeof v === 'object' && v !== null && !Array.isArray(v)
      ? toNodes(v as Record<string, unknown>, key)
      : Array.isArray(v) && typeof v[0] === 'object'
        ? toNodes(v[0] as Record<string, unknown>, `${key}[]`)
        : undefined;
    return { key, label, ...(children !== undefined && children.length > 0 ? { children } : {}) };
  });
}

export interface SchemaViewerProps {
  schema: Record<string, unknown>;
  label?: string | undefined;
}

export function SchemaViewer({ schema, label = 'Schema' }: SchemaViewerProps) {
  const items = React.useMemo(() => toNodes(schema, '$'), [schema]);
  return (
    <div data-ag-part="schema-viewer" className="ag-schema-viewer">
      <TreeView items={items} aria-label={label} preset="files" defaultExpandedKeys={items.map((i) => i.key)} />
    </div>
  );
}
