/* audit-log query (REQ-SURF-178): the server side of the block's manual
   pagination — evaluate the FilterBar model (enum is / is-not rules, and/or
   groups) against the events, then return only the requested page plus the
   filtered total. The block never hands the Table more than one page. */
import type { FilterGroup, FilterRule } from 'aura-glass/data';
import type { AuditEvent } from './fixtures';

function matchesRule(e: AuditEvent, rule: FilterRule): boolean {
  if (rule.fieldId !== 'actor' && rule.fieldId !== 'action') return true;
  const v = rule.value;
  if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) return true;
  const values = Array.isArray(v) ? v.map(String) : [String(v)];
  const hit = values.includes(e[rule.fieldId]);
  return rule.operator === 'is-not' ? !hit : hit;
}

function matchesGroup(e: AuditEvent, g: FilterGroup): boolean {
  if (g.children.length === 0) return true;
  const hits = g.children.map((c) => (c.kind === 'group' ? matchesGroup(e, c) : matchesRule(e, c)));
  return g.combinator === 'or' ? hits.some(Boolean) : hits.every(Boolean);
}

export interface AuditPage { rows: AuditEvent[]; total: number; pageCount: number }

export function queryAuditPage(events: readonly AuditEvent[], model: FilterGroup, pageIndex: number, pageSize: number): AuditPage {
  const filtered = events.filter((e) => matchesGroup(e, model));
  const start = pageIndex * pageSize;
  return {
    rows: filtered.slice(start, start + pageSize),
    total: filtered.length,
    pageCount: Math.max(1, Math.ceil(filtered.length / pageSize)),
  };
}
