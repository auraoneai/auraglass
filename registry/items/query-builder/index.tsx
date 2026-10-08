/* query-builder (REQ-SURF-174): nested groups over FilterBar.useModel —
   the model does all the logic; this file only renders the tree. */
'use client';
import * as React from 'react';
import { FilterBar, type FilterField, type FilterGroup, type FilterNode, type FilterRule } from 'aura-glass/data';

function isGroup(n: FilterNode): n is FilterGroup { return n.kind === 'group'; }

function NodeEditor({ node, model, schema, depth }: { node: FilterNode; model: ReturnType<typeof FilterBar.useModel>; schema: readonly FilterField[]; depth: number }) {
  if (!isGroup(node)) {
    const rule = node as FilterRule;
    const field = schema.find((f) => f.id === rule.fieldId);
    return (
      <li data-ag-part="qb-rule">
        <span>{field?.label ?? rule.fieldId} {rule.operator} {String(rule.value ?? '')}</span>
        <button type="button" aria-label={`Remove rule ${rule.fieldId}`}
          onClick={() => model.removeRule(rule.id)}>Remove</button>
      </li>
    );
  }
  const firstField = schema[0];
  return (
    <li data-ag-part="qb-group">
      <fieldset>
        <legend>
          Match
          <select aria-label="Combinator" value={node.combinator}
            onChange={(e) => model.setCombinator(node.id, e.target.value as 'and' | 'or')}>
            <option value="and">all</option>
            <option value="or">any</option>
          </select>
          {depth === 0 ? null : (
            <button type="button" aria-label="Remove group" onClick={() => model.removeGroup(node.id)}>Remove group</button>
          )}
        </legend>
        <ol>
          {node.children.map((c: FilterNode) => (
            <NodeEditor key={c.id} node={c} model={model} schema={schema} depth={depth + 1} />
          ))}
        </ol>
        <button type="button" disabled={firstField === undefined}
          onClick={() => {
            if (firstField === undefined) return;
            model.addRule(
              {
                kind: 'rule',
                id: `qb-${node.id}-${node.children.length}`,
                fieldId: firstField.id,
                operator: (firstField.operators?.[0] ?? 'is') as FilterRule['operator'],
              },
              node.id,
            );
          }}>Add rule</button>
        <button type="button" onClick={() => model.addGroup(undefined, node.id)}>Add group</button>
      </fieldset>
    </li>
  );
}

export interface QueryBuilderProps {
  schema: readonly FilterField[];
  value?: FilterGroup | undefined;
  defaultValue?: FilterGroup | undefined;
  onValueChange?: ((g: FilterGroup) => void) | undefined;
}

export function QueryBuilder({ schema, value, defaultValue, onValueChange }: QueryBuilderProps) {
  const model = FilterBar.useModel(schema, { value, defaultValue, onValueChange });
  return (
    <div data-ag-part="query-builder" className="ag-query-builder">
      <ol>
        <NodeEditor node={model.value} model={model} schema={schema} depth={0} />
      </ol>
      <button type="button" onClick={() => model.clear()}>Clear all</button>
    </div>
  );
}
