"use client";
import React from "react";
import { GlassButton } from "../button/GlassButton";
import { cn } from "../../lib/utilsComprehensive";
import {
  Select as GlassSelect,
  SelectTrigger as GlassSelectTrigger,
  SelectValue as GlassSelectValue,
  SelectContent as GlassSelectContent,
  SelectItem as GlassSelectItem,
} from "../input/GlassSelectCompound";

export interface FieldDef {
  id: string;
  label: string;
  type: "text" | "number" | "select";
  options?: { label: string; value: string }[];
}
export interface Rule {
  field: string;
  op: string;
  value: unknown;
}
export interface RuleGroup {
  combinator: "AND" | "OR";
  rules: (Rule | RuleGroup)[];
}

export interface GlassQueryBuilderProps {
  fields?: FieldDef[];
  value?: RuleGroup;
  onChange?: (v: RuleGroup) => void;
  className?: string;
  /**
   * Custom data-testid for testing
   */
  "data-testid"?: string;
}

function isGroup(x: unknown): x is RuleGroup {
  return Boolean(
    x &&
      typeof x === "object" &&
      Array.isArray((x as { rules?: unknown }).rules)
  );
}

const getRuleInputValue = (value: unknown): string => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  return "";
};

const lightOnDarkButtonStyle: React.CSSProperties = {
  color: "rgba(255, 255, 255, 0.95)",
};

export function GlassQueryBuilder({
  fields = [],
  value = { combinator: "AND", rules: [] },
  onChange = () => {},
  className,
  "data-testid": dataTestId,
}: GlassQueryBuilderProps) {
  const update = (group: RuleGroup) => onChange({ ...group });

  const renderRule = (rule: Rule, idx: number, parent: RuleGroup) => {
    const field = fields.find((f) => f.id === rule.field) || fields[0];
    return (
      <div
        data-glass-component
        key={idx}
        className="glass-flex glass-flex-wrap glass-items-center glass-gap-2"
      >
        <GlassSelect
          value={rule.field}
          onValueChange={(v) => {
            rule.field = v;
            update(value);
          }}
        >
          <GlassSelectTrigger
            className="glass-w-40 glass-h-8 glass-text-sm"
            aria-label="Select field"
          >
            <GlassSelectValue placeholder="Field" />
          </GlassSelectTrigger>
          <GlassSelectContent>
            {fields.map((f: any) => (
              <GlassSelectItem key={f.id} value={f.id}>
                {f.label}
              </GlassSelectItem>
            ))}
          </GlassSelectContent>
        </GlassSelect>
        <GlassSelect
          value={rule.op}
          onValueChange={(v) => {
            rule.op = v;
            update(value);
          }}
        >
          <GlassSelectTrigger
            className="glass-w-28 glass-h-8 glass-text-sm"
            aria-label="Select operator"
          >
            <GlassSelectValue placeholder="Op" />
          </GlassSelectTrigger>
          <GlassSelectContent>
            {["=", "!=", ">", ">=", "<", "<=", "contains"].map((op) => (
              <GlassSelectItem key={op} value={op}>
                {op}
              </GlassSelectItem>
            ))}
          </GlassSelectContent>
        </GlassSelect>
        {field.type === "select" ? (
          <GlassSelect
            value={getRuleInputValue(rule.value)}
            onValueChange={(v) => {
              const next = v === "__clear__" ? "" : v;
              rule.value = next;
              update(value);
            }}
          >
            <GlassSelectTrigger
              className="glass-w-48 glass-h-8 glass-text-sm"
              aria-label="Select value"
            >
              <GlassSelectValue placeholder="Value" />
            </GlassSelectTrigger>
            <GlassSelectContent>
              <GlassSelectItem value="__clear__">—</GlassSelectItem>
              {field.options?.map((o) => (
                <GlassSelectItem key={o.value} value={o.value}>
                  {o.label}
                </GlassSelectItem>
              ))}
            </GlassSelectContent>
          </GlassSelect>
        ) : (
          <input
            value={getRuleInputValue(rule.value)}
            onChange={(e) => {
              rule.value = e.target.value;
              update(value);
            }}
            className="glass-min-w-0 glass-flex-1 glass-bg-white/10 glass-border glass-border-white/35 glass-radius-md glass-px-2 glass-py-1 glass-text-sm glass-text-white glass-placeholder-white/70 glass-focus glass-touch-target glass-contrast-guard"
          />
        )}
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={(e) => {
            parent.rules.splice(idx, 1);
            update(value);
          }}
          className="glass-text-white hover:glass-text-white"
          style={lightOnDarkButtonStyle}
        >
          Remove
        </GlassButton>
      </div>
    );
  };

  const renderGroup = (group: RuleGroup, parent?: RuleGroup) => (
    <div className="glass-radius-xl glass-border glass-border-white/25 glass-bg-white/10 glass-backdrop-blur-md glass-p-3 glass-space-y-3 glass-text-white glass-contrast-guard">
      <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-2">
        <GlassSelect
          value={group.combinator}
          onValueChange={(v) => {
            group.combinator = v as any;
            update(value);
          }}
        >
          <GlassSelectTrigger
            className="glass-w-24 glass-h-8 glass-text-sm"
            aria-label="Select combinator (AND/OR)"
          >
            <GlassSelectValue />
          </GlassSelectTrigger>
          <GlassSelectContent>
            <GlassSelectItem value="AND">AND</GlassSelectItem>
            <GlassSelectItem value="OR">OR</GlassSelectItem>
          </GlassSelectContent>
        </GlassSelect>
        <GlassButton
          size="sm"
          variant="secondary"
          onClick={(e) => {
            group.rules.push({ field: fields[0].id, op: "=", value: "" });
            update(value);
          }}
        >
          + Rule
        </GlassButton>
        <GlassButton
          size="sm"
          variant="ghost"
          onClick={(e) => {
            group.rules.push({ combinator: "AND", rules: [] });
            update(value);
          }}
          className="glass-text-white hover:glass-text-white"
          style={lightOnDarkButtonStyle}
        >
          + Group
        </GlassButton>
        {parent && (
          <GlassButton
            size="sm"
            variant="ghost"
            onClick={(e) => {
              parent.rules.splice(parent.rules.indexOf(group), 1);
              update(value);
            }}
            className="glass-text-white hover:glass-text-white"
            style={lightOnDarkButtonStyle}
          >
            Remove
          </GlassButton>
        )}
      </div>
      <div className="glass-space-y-2">
        {group.rules.map((r, i) =>
          isGroup(r) ? (
            <div key={i}>{renderGroup(r, group)}</div>
          ) : (
            renderRule(r as Rule, i, group)
          )
        )}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "glass-w-full glass-max-w-3xl glass-space-y-2 glass-text-white",
        className
      )}
      data-testid={dataTestId}
      role="group"
      aria-label="Query builder"
    >
      {renderGroup(value)}
    </div>
  );
}

export default GlassQueryBuilder;
