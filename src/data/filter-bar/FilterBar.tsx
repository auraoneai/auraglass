'use client';
/* FilterBar (SURF-196, REQ-SURF-87): schema-driven rule chips, quick-filters,
   search field, clear-all, announced result count. Composes CMP parts only
   through their public modules (seam S-30): SearchField, ToggleGroup
   (aria-pressed quick filters), IconButton (chip remove), Popover (chip
   editor: initial focus on the first field, focus back to the chip on close)
   and Sheet (side="bottom", the < 480 px collapsed "Filters (n)" view).
   Responsive behaviour is container-query driven (filter-bar.css); the only
   measurement is the 480–767 px two-line clamp, which counts the chips the
   clamp hides to label "+n more". */
import * as React from 'react';
import { SearchField } from '../../components/search-field';
import { ToggleGroup } from '../../components/toggle-group';
import { IconButton } from '../../components/icon-button';
import { Popover } from '../../components/popover';
import { Sheet } from '../../components/sheet';
import { Button } from '../../components/button';
import { useAnnouncer } from '../../theme';
import { applyModel } from './filter-model-ops';
import {
  DEFAULT_OPERATORS,
  VALUELESS_OPERATORS,
  emptyGroup,
  makeRule,
  type FilterField,
  type FilterGroup,
  type FilterModel,
  type FilterRange,
  type FilterRule,
  type FilterValue,
} from './filter-model';
import { parse, serialize } from './filter-serialize';

export interface FilterBarLabels {
  filters?: string | undefined;
  clearAll?: string | undefined;
  addFilter?: string | undefined;
  results?: string | undefined;
  /** Supports {field}, {operator}, {value} (and {label} = the whole chip text). */
  removeFilter?: string | undefined;
  quickFilters?: string | undefined;
  /** Collapsed (< 480 px) trigger text; {n} = active rule count. */
  filtersCount?: string | undefined;
  /** 480–767 px overflow toggle; {n} = chips hidden by the two-line clamp. */
  more?: string | undefined;
  fewer?: string | undefined;
  editFilter?: string | undefined;
  operator?: string | undefined;
  value?: string | undefined;
  from?: string | undefined;
  to?: string | undefined;
  apply?: string | undefined;
  done?: string | undefined;
  yes?: string | undefined;
  no?: string | undefined;
}

export interface FilterBarProps {
  schema: readonly FilterField[];
  value?: FilterGroup | undefined;
  defaultValue?: FilterGroup | undefined;
  onValueChange?: ((g: FilterGroup) => void) | undefined;
  search?: { value: string; onValueChange: (v: string) => void; placeholder?: string | undefined } | undefined;
  quickFilters?: readonly { id: string; label: string; rule: FilterRule }[] | undefined;
  onClearAll?: (() => void) | undefined;
  /** Shown next to the bar; each change is announced politely ("{n} results"). */
  resultCount?: number | undefined;
  labels?: FilterBarLabels | undefined;
  className?: string | undefined;
}

type Msgs = Required<{ [K in keyof FilterBarLabels]: string }>;

const DEFAULT_MSGS: Msgs = {
  filters: 'Filters',
  clearAll: 'Clear all',
  addFilter: 'Add filter',
  results: '{n} results',
  removeFilter: 'Remove filter {field} {operator} {value}',
  quickFilters: 'Quick filters',
  filtersCount: 'Filters ({n})',
  more: '+{n} more',
  fewer: 'Show fewer',
  editFilter: 'Edit filter {field}',
  operator: 'Operator',
  value: 'Value',
  from: 'From',
  to: 'To',
  apply: 'Apply',
  done: 'Done',
  yes: 'True',
  no: 'False',
};

const fill = (tpl: string, vars: Record<string, string>) =>
  tpl.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? vars[k]! : m));

const operatorsOf = (f: FilterField) => (f.operators ?? DEFAULT_OPERATORS[f.type]) as readonly string[];

const isRangeValue = (v: FilterValue | undefined): v is FilterRange<string> | FilterRange<number> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

function valueText(field: FilterField | undefined, v: FilterValue | undefined, msgs: Msgs): string {
  if (v === undefined) return '';
  const opt = (x: string) => field?.options?.find((o) => o.value === x)?.label ?? x;
  if (Array.isArray(v)) return (v as readonly string[]).map(opt).join(', ');
  if (isRangeValue(v)) return `${String(v.start)}–${String(v.end)}`;
  if (typeof v === 'boolean') return v ? msgs.yes : msgs.no;
  return typeof v === 'string' ? opt(v) : String(v);
}

const sameRule = (a: FilterRule, b: FilterRule) =>
  a.fieldId === b.fieldId && a.operator === b.operator && JSON.stringify(a.value ?? null) === JSON.stringify(b.value ?? null);

/* ---- chip editor (inside the CMP Popover) ---- */

interface Draft {
  operator: string;
  a: string;
  b: string;
  list: string[];
}

function draftOf(rule: FilterRule): Draft {
  const v = rule.value;
  const d: Draft = { operator: rule.operator as string, a: '', b: '', list: [] };
  if (Array.isArray(v)) d.list = [...(v as readonly string[])];
  else if (isRangeValue(v)) {
    d.a = String(v.start);
    d.b = String(v.end);
  } else if (v !== undefined) d.a = String(v);
  return d;
}

/** Draft -> typed value; undefined when the inputs do not form a value yet. */
function valueOf(field: FilterField, d: Draft): FilterValue | undefined {
  if (VALUELESS_OPERATORS.includes(d.operator)) return undefined;
  const num = (s: string) => (s.trim() === '' || !Number.isFinite(Number(s)) ? undefined : Number(s));
  switch (field.type) {
    case 'number':
      if (d.operator === 'between') {
        const s = num(d.a);
        const e = num(d.b);
        return s === undefined || e === undefined ? undefined : { start: s, end: e };
      }
      return num(d.a);
    case 'date':
    case 'date-range':
      if (d.operator === 'between') return d.a === '' || d.b === '' ? undefined : { start: d.a, end: d.b };
      return d.a === '' ? undefined : d.a;
    case 'boolean':
      return d.a === 'true' ? true : d.a === 'false' ? false : undefined;
    case 'multi-enum':
      if (field.options !== undefined) return d.list;
      return d.a.trim() === '' ? [] : d.a.split(',').map((s) => s.trim()).filter((s) => s !== '');
    default:
      return d.a === '' && field.type === 'enum' ? undefined : d.a;
  }
}

function RuleEditor({
  field,
  rule,
  msgs,
  firstFieldRef,
  onCommit,
}: {
  field: FilterField;
  rule: FilterRule;
  msgs: Msgs;
  firstFieldRef: React.RefObject<HTMLSelectElement | null>;
  onCommit: (patch: { operator: FilterRule['operator']; value: FilterValue | undefined }) => void;
}) {
  const id = React.useId();
  const [draft, setDraft] = React.useState<Draft>(() => draftOf(rule));
  const set = (p: Partial<Draft>) => setDraft((d) => ({ ...d, ...p }));
  const valueless = VALUELESS_OPERATORS.includes(draft.operator);
  const between = draft.operator === 'between';
  const inputType = field.type === 'number' ? 'number' : field.type === 'date' || field.type === 'date-range' ? 'date' : 'text';

  let valueControl: React.ReactNode = null;
  if (valueless) valueControl = null;
  else if (between) {
    valueControl = (
      <>
        <label htmlFor={`${id}-a`}>{msgs.from}</label>
        <input id={`${id}-a`} type={inputType} value={draft.a} onChange={(e) => set({ a: e.target.value })} />
        <label htmlFor={`${id}-b`}>{msgs.to}</label>
        <input id={`${id}-b`} type={inputType} value={draft.b} onChange={(e) => set({ b: e.target.value })} />
      </>
    );
  } else if (field.type === 'boolean') {
    valueControl = (
      <>
        <label htmlFor={`${id}-a`}>{msgs.value}</label>
        <select id={`${id}-a`} value={draft.a} onChange={(e) => set({ a: e.target.value })}>
          <option value="" disabled>
            {msgs.value}
          </option>
          <option value="true">{msgs.yes}</option>
          <option value="false">{msgs.no}</option>
        </select>
      </>
    );
  } else if ((field.type === 'enum' || field.type === 'multi-enum') && field.options !== undefined) {
    const multiple = field.type === 'multi-enum';
    valueControl = (
      <>
        <label htmlFor={`${id}-a`}>{msgs.value}</label>
        <select
          id={`${id}-a`}
          multiple={multiple}
          value={multiple ? draft.list : draft.a}
          onChange={(e) =>
            multiple ? set({ list: Array.from(e.target.selectedOptions, (o) => o.value) }) : set({ a: e.target.value })
          }
        >
          {multiple ? null : (
            <option value="" disabled>
              {msgs.value}
            </option>
          )}
          {field.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </>
    );
  } else {
    valueControl = (
      <>
        <label htmlFor={`${id}-a`}>{msgs.value}</label>
        <input id={`${id}-a`} type={inputType} value={draft.a} onChange={(e) => set({ a: e.target.value })} />
      </>
    );
  }

  return (
    <form
      className="ag-filter-bar__editor-form"
      onSubmit={(e) => {
        e.preventDefault();
        onCommit({ operator: draft.operator as FilterRule['operator'], value: valueOf(field, draft) });
      }}
    >
      <label htmlFor={`${id}-op`}>{msgs.operator}</label>
      <select
        id={`${id}-op`}
        ref={firstFieldRef}
        value={draft.operator}
        onChange={(e) => set({ operator: e.target.value })}
      >
        {operatorsOf(field).map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
      {valueControl}
      <Button type="submit" size="sm">
        {msgs.apply}
      </Button>
    </form>
  );
}

/* ---- one chip: edit trigger + remove IconButton + anchored Popover ---- */

function RuleChip({
  rule,
  field,
  msgs,
  open,
  clamped,
  onOpenChange,
  onRemove,
  onCommit,
}: {
  rule: FilterRule;
  field: FilterField | undefined;
  msgs: Msgs;
  open: boolean;
  clamped: boolean;
  onOpenChange: (open: boolean) => void;
  onRemove: () => void;
  onCommit: (patch: { operator: FilterRule['operator']; value: FilterValue | undefined }) => void;
}) {
  const [chipEl, setChipEl] = React.useState<HTMLSpanElement | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const firstFieldRef = React.useRef<HTMLSelectElement | null>(null);
  const fieldLabel = field?.label ?? rule.fieldId;
  const vText = valueText(field, rule.value, msgs);
  const label = `${fieldLabel} ${String(rule.operator)}${vText !== '' ? ` ${vText}` : ''}`;
  return (
    <span
      ref={setChipEl}
      data-ag-part="filter-rule-chip"
      className="ag-filter-bar__chip"
      data-editing={open || undefined}
      {...(clamped ? { 'data-ag-clamped': '' } : {})}
    >
      <Popover.Root open={open} onOpenChange={(o) => onOpenChange(o)}>
        <Popover.Trigger
          ref={triggerRef}
          data-ag-part="filter-rule-edit"
          className="ag-filter-bar__chip-label"
          aria-label={`${fill(msgs.editFilter, { field: fieldLabel })}: ${label}`}
        >
          {label}
        </Popover.Trigger>
        {open && field !== undefined ? (
          <Popover.Portal>
            <Popover.Positioner anchor={chipEl} side="bottom" align="start">
              <Popover.Popup
                className="ag-filter-bar__editor"
                aria-label={fill(msgs.editFilter, { field: fieldLabel })}
                initialFocus={firstFieldRef}
                finalFocus={triggerRef}
              >
                <RuleEditor field={field} rule={rule} msgs={msgs} firstFieldRef={firstFieldRef} onCommit={onCommit} />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        ) : null}
      </Popover.Root>
      <IconButton
        data-ag-part="filter-rule-remove"
        suppressInnerParts
        variant="identity"
        size="sm"
        className="ag-filter-bar__chip-remove"
        label={fill(msgs.removeFilter, { field: fieldLabel, operator: String(rule.operator), value: vText, label })}
        icon={<span aria-hidden="true">×</span>}
        onClick={onRemove}
      />
    </span>
  );
}

/* ---- add-filter control: a placeholder option, so every field (including
   the first) fires a change; the new rule gets the first operator valid for
   its field type and its editor opens. ---- */
function AddFilter({ schema, label, onAdd }: { schema: readonly FilterField[]; label: string; onAdd: (f: FilterField) => void }) {
  return (
    <select
      data-ag-part="filter-add"
      className="ag-filter-bar__add"
      aria-label={label}
      value=""
      onChange={(e) => {
        const f = schema.find((x) => x.id === e.target.value);
        if (f !== undefined) onAdd(f);
      }}
    >
      <option value="" disabled>
        {label}
      </option>
      {schema.map((f) => (
        <option key={f.id} value={f.id}>
          {f.label}
        </option>
      ))}
    </select>
  );
}

type Editing = { id: string; where: 'inline' | 'sheet' } | null;

export function FilterBar({
  schema,
  value,
  defaultValue,
  onValueChange,
  search,
  quickFilters,
  onClearAll,
  resultCount,
  labels,
  className,
}: FilterBarProps) {
  // SURF-085: the bar runs on its own public model hook (looked up on the
  // component so the static stays the single implementation).
  const model = FilterBar.useModel(schema, { value, defaultValue, onValueChange });
  const group = model.value;
  const msgs = { ...DEFAULT_MSGS } as Msgs;
  for (const [k, v] of Object.entries(labels ?? {})) if (v !== undefined) msgs[k as keyof Msgs] = v;

  const allRules = React.useMemo(() => {
    const out: FilterRule[] = [];
    const walk = (g: FilterGroup) => g.children.forEach((c) => (c.kind === 'group' ? walk(c) : out.push(c)));
    walk(group);
    return out;
  }, [group]);

  const fieldById = React.useMemo(() => new Map(schema.map((f) => [f.id, f])), [schema]);
  const [editing, setEditing] = React.useState<Editing>(null);
  const [expanded, setExpanded] = React.useState(false);
  const [firstClamped, setFirstClamped] = React.useState(-1);
  const chipsRef = React.useRef<HTMLDivElement | null>(null);

  // Two-line clamp (480–767 px, CSS): count the chips whose box falls below
  // the clamped list so "+n more" is exact. Outside that band the list is not
  // clamped (or not displayed) and nothing is hidden.
  const measure = React.useCallback(() => {
    const list = chipsRef.current;
    if (list === null || expanded) return;
    const limit = list.clientHeight;
    const chips = Array.from(list.querySelectorAll<HTMLElement>(':scope > [data-ag-part="filter-rule-chip"]'));
    const idx = chips.findIndex((c) => c.offsetHeight > 0 && c.offsetTop + c.offsetHeight > limit + 1);
    setFirstClamped(idx);
  }, [expanded]);
  React.useEffect(() => {
    measure();
    const list = chipsRef.current;
    if (list === null || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(() => measure());
    ro.observe(list);
    return () => ro.disconnect();
  }, [measure, allRules]);
  const hiddenCount = firstClamped < 0 ? 0 : allRules.length - firstClamped;

  // "{n} results" goes through the MAT announcer seam, once per change.
  const { announce } = useAnnouncer();
  const lastCount = React.useRef(resultCount);
  React.useEffect(() => {
    if (resultCount !== undefined && resultCount !== lastCount.current) {
      announce(fill(msgs.results, { n: String(resultCount) }));
    }
    lastCount.current = resultCount;
  }, [resultCount, announce, msgs.results]);

  const addField = (f: FilterField, where: 'inline' | 'sheet') => {
    const rule = makeRule(f, operatorsOf(f)[0] as never);
    model.addRule(rule);
    setEditing({ id: rule.id, where });
  };

  // Removing a chip unmounts its focused remove button: move focus to the
  // chip now at that index, else the previous one, else the add-filter control.
  const rulesRef = React.useRef<HTMLDivElement | null>(null);
  const sheetRegionRef = React.useRef<HTMLDivElement | null>(null);
  const pendingFocus = React.useRef<{ where: 'inline' | 'sheet'; index: number } | null>(null);
  React.useEffect(() => {
    const p = pendingFocus.current;
    if (p === null) return;
    pendingFocus.current = null;
    const region = p.where === 'inline' ? rulesRef.current : sheetRegionRef.current;
    if (region === null) return;
    const chips = Array.from(region.querySelectorAll<HTMLElement>('.ag-filter-bar__chip-label'));
    (chips[p.index] ?? chips[p.index - 1] ?? region.querySelector<HTMLElement>('.ag-filter-bar__add'))?.focus();
  }, [allRules]);

  const renderChips = (where: 'inline' | 'sheet') =>
    allRules.map((r, i) => (
      <RuleChip
        key={r.id}
        rule={r}
        field={fieldById.get(r.fieldId)}
        msgs={msgs}
        open={editing?.id === r.id && editing.where === where}
        clamped={where === 'inline' && !expanded && firstClamped >= 0 && i >= firstClamped}
        onOpenChange={(o) => setEditing(o ? { id: r.id, where } : null)}
        onRemove={() => {
          pendingFocus.current = { where, index: i };
          model.removeRule(r.id);
        }}
        onCommit={(patch) => {
          model.updateRule(r.id, patch);
          setEditing(null);
        }}
      />
    ));

  const activeQuick = (quickFilters ?? []).filter((q) => allRules.some((r) => sameRule(r, q.rule))).map((q) => q.id);

  return (
    <div
      data-ag-part="filter-bar"
      className={`ag-filter-bar${className ? ` ${className}` : ''}`}
      role="group"
      aria-label={msgs.filters}
    >
      {search !== undefined ? (
        <div data-ag-part="filter-search" className="ag-filter-bar__search">
          <SearchField
            value={search.value}
            onValueChange={(v) => search.onValueChange(v)}
            {...(search.placeholder !== undefined ? { placeholder: search.placeholder } : {})}
            aria-label={search.placeholder ?? msgs.filters}
            size="sm"
          />
        </div>
      ) : null}
      {quickFilters !== undefined && quickFilters.length > 0 ? (
        <div data-ag-part="filter-quick" role="group" aria-label={msgs.quickFilters} className="ag-filter-bar__quick">
          <ToggleGroup.Root
            multiple
            value={activeQuick}
            onValueChange={(next) => {
              for (const q of quickFilters) {
                const on = next.includes(q.id);
                const existing = allRules.find((r) => sameRule(r, q.rule));
                if (on && existing === undefined) model.addRule({ ...q.rule, id: `r-${q.id}-${allRules.length}` });
                else if (!on && existing !== undefined) model.removeRule(existing.id);
              }
            }}
          >
            {quickFilters.map((q) => (
              <ToggleGroup.Item key={q.id} value={q.id} className="ag-filter-bar__quick-toggle">
                {q.label}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </div>
      ) : null}
      <div ref={rulesRef} data-ag-part="filter-rules" className="ag-filter-bar__rules">
        <div ref={chipsRef} className="ag-filter-bar__chips" data-expanded={expanded || undefined}>
          {renderChips('inline')}
        </div>
        <button
          type="button"
          data-ag-part="filter-more"
          className="ag-filter-bar__more"
          aria-expanded={expanded}
          hidden={!expanded && hiddenCount === 0}
          onClick={() => {
            if (expanded) setFirstClamped(-1);
            setExpanded(!expanded);
          }}
        >
          {expanded ? msgs.fewer : fill(msgs.more, { n: String(hiddenCount) })}
        </button>
        <AddFilter schema={schema} label={msgs.addFilter} onAdd={(f) => addField(f, 'inline')} />
      </div>
      <Sheet.Root side="bottom" detents={[0.5, 1]}>
        <Sheet.Trigger data-ag-part="filter-collapsed" className="ag-filter-bar__collapsed">
          {fill(msgs.filtersCount, { n: String(allRules.length) })}
        </Sheet.Trigger>
        <Sheet.Content className="ag-filter-bar__sheet">
          <Sheet.Handle />
          <Sheet.Header>
            <Sheet.Title>{msgs.filters}</Sheet.Title>
          </Sheet.Header>
          <Sheet.Body>
            <div ref={sheetRegionRef}>
              <div className="ag-filter-bar__sheet-chips">{renderChips('sheet')}</div>
              <AddFilter schema={schema} label={msgs.addFilter} onAdd={(f) => addField(f, 'sheet')} />
            </div>
          </Sheet.Body>
          <Sheet.Footer>
            {allRules.length > 0 ? (
              <Button
                variant="identity"
                onClick={() => {
                  model.clear();
                  onClearAll?.();
                }}
              >
                {msgs.clearAll}
              </Button>
            ) : null}
            <Sheet.Close>{msgs.done}</Sheet.Close>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet.Root>
      {allRules.length > 0 ? (
        <button
          type="button"
          data-ag-part="filter-clear"
          className="ag-filter-bar__clear"
          onClick={() => {
            model.clear();
            onClearAll?.();
          }}
        >
          {msgs.clearAll}
        </button>
      ) : null}
      {resultCount !== undefined ? (
        <span data-ag-part="filter-count" className="ag-filter-bar__count">
          {fill(msgs.results, { n: String(resultCount) })}
        </span>
      ) : null}
    </div>
  );
}

export interface FilterModelOptions {
  value?: FilterGroup | undefined;
  defaultValue?: FilterGroup | undefined;
  onValueChange?: ((g: FilterGroup) => void) | undefined;
}

/** REQ-SURF-85: FilterBar.useModel(schema, { value?, defaultValue?,
    onValueChange? }). Actions are referentially stable for the component's
    lifetime (they read the latest value/handlers through a ref), never
    mutate, and share structure — only the edited path is new. Calls in the
    same tick chain (each sees the previous result). */
FilterBar.useModel = function useModel(schema: readonly FilterField[], opts: FilterModelOptions = {}): FilterModel {
  const [inner, setInner] = React.useState<FilterGroup>(() => opts.defaultValue ?? emptyGroup());
  const controlled = opts.value !== undefined;
  const group = controlled ? opts.value! : inner;
  const latest = React.useRef({ group, controlled, onValueChange: opts.onValueChange, schema });
  latest.current = { group, controlled, onValueChange: opts.onValueChange, schema };
  const actions = React.useMemo(() => {
    const run = (fn: Parameters<typeof applyModel>[1]) => {
      const l = latest.current;
      const next = applyModel(l.group, fn);
      if (next === l.group) return;
      l.group = next;
      if (!l.controlled) setInner(next);
      l.onValueChange?.(next);
    };
    const checkRule = (r: FilterRule) => {
      if (process.env['NODE_ENV'] !== 'development') return;
      const field = latest.current.schema.find((f) => f.id === r.fieldId);
      if (field === undefined) {
        console.warn(`[auraglass] FilterBar: rule field "${r.fieldId}" is not in the schema.`);
        return;
      }
      const allowed = (field.operators ?? DEFAULT_OPERATORS[field.type]) as readonly string[];
      if (!allowed.includes(r.operator as string)) {
        console.warn(`[auraglass] FilterBar: operator "${String(r.operator)}" is invalid for field "${field.id}" (${field.type}).`);
      }
    };
    return {
      addRule: (r: FilterRule, gid?: string) => { checkRule(r); run((m) => m.addRule(r, gid)); },
      updateRule: (id: string, p: Partial<Omit<FilterRule, 'id' | 'kind'>>) => run((m) => m.updateRule(id, p)),
      removeRule: (id: string) => run((m) => m.removeRule(id)),
      addGroup: (g?: FilterGroup, pid?: string) => run((m) => m.addGroup(g, pid)),
      removeGroup: (id: string) => run((m) => m.removeGroup(id)),
      setCombinator: (id: string, c: 'and' | 'or') => run((m) => m.setCombinator(id, c)),
      clear: () => run((m) => m.clear()),
    };
  }, []);
  return React.useMemo(() => ({ value: group, ...actions }), [group, actions]);
};

FilterBar.serialize = serialize;
FilterBar.parse = parse;
