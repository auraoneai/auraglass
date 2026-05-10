"use client";
import React, { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { OptimizedGlass } from "@/primitives";

export interface CollaborationParticipant {
  id: string;
  name: string;
  presence?: "active" | "idle" | "offline";
  color?: string;
  cursorLabel?: string;
}

export interface MultiUserGlassEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  users?: CollaborationParticipant[];
  className?: string;
  header?: string;
  lastUpdatedAt?: Date | string;
  onContentChange?: (value: string) => void;
  textareaClassName?: string;
}

const statusAccent: Record<
  NonNullable<CollaborationParticipant["presence"]>,
  React.CSSProperties
> = {
  active: {
    background:
      '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
  },
  idle: {
    background:
      '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
  },
  offline: {
    background:
      '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
  },
};

const DEFAULT_USERS: CollaborationParticipant[] = [
  {
    id: "1",
    name: "Nova",
    presence: "active",
    color: "var(--glass-color-info)",
  },
  {
    id: "2",
    name: "Orion",
    presence: "idle",
    color: "var(--glass-color-secondary)",
  },
  {
    id: "3",
    name: "Lyra",
    presence: "offline",
    color: "var(--glass-color-secondary)",
  },
];

export function MultiUserGlassEditor({
  users,
  className,
  header = "Collaborative Glass Editor",
  lastUpdatedAt,
  onContentChange,
  value,
  defaultValue,
  readOnly,
  textareaClassName,
  ...textareaProps
}: MultiUserGlassEditorProps) {
  const normalizeValue = (
    input: typeof defaultValue | typeof value
  ): string => {
    if (typeof input === "string") return input;
    if (typeof input === "number") return String(input);
    if (Array.isArray(input)) return input.join("\n");
    return "";
  };

  const fallbackValue = normalizeValue(defaultValue);
  const initialValue = normalizeValue(value) || fallbackValue;
  const [internalValue, setInternalValue] = useState<string>(initialValue);

  useEffect(() => {
    const updated = normalizeValue(value);
    if (value !== undefined) {
      setInternalValue(updated);
    }
  }, [value]);

  const participants = useMemo(() => {
    const activeUsers = users ?? DEFAULT_USERS;
    return activeUsers.map((user, index) => ({
      ...user,
      presence: user.presence ?? (index === 0 ? "active" : "idle"),
      color:
        user.color ??
        [
          "var(--glass-color-info)",
          "var(--glass-color-secondary)",
          "var(--glass-color-warning)",
        ][index % 3],
    }));
  }, [users]);

  const displayValue =
    value !== undefined ? normalizeValue(value) : internalValue;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!readOnly && typeof value !== "string") {
      setInternalValue(event.target.value);
    }
    onContentChange?.(event.target.value);
    textareaProps.onChange?.(event);
  };

  const formattedTimestamp = useMemo(() => {
    if (!lastUpdatedAt) return "live";
    const date =
      typeof lastUpdatedAt === "string"
        ? new Date(lastUpdatedAt)
        : lastUpdatedAt;
    if (Number.isNaN(date.getTime())) return "live";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [lastUpdatedAt]);

  return (
    <OptimizedGlass
      role="region"
      aria-label={header}
      className={cn(
        "glass-radius-2xl glass-border glass-border-subtle glass-p-6 glass-space-y-4",
        className
      )}
      style={{
        background:
          '/* Use createGlassStyle({ intent: "primary", elevation: "level2" }) */',
      }}
    >
      <header className="glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-4">
        <div>
          <h2 className="glass-text-xl glass-font-semibold glass-text-primary">
            {header}
          </h2>
          <p className="glass-text-sm glass-text-primary-opacity-70">
            Synced presence across team members with glass awareness.
          </p>
        </div>
        <span className="glass-radius-full glass-border glass-border-white/10 glass-surface-subtle/10 glass-px-3 glass-py-1 glass-text-xs glass-text-primary-opacity-70">
          Updated {formattedTimestamp}
        </span>
      </header>

      <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-3">
        {participants.map((user) => (
          <span
            key={user.id}
            className="glass-flex glass-items-center glass-gap-2 glass-radius-full glass-border glass-border-white/10 glass-surface-subtle/5 glass-px-3 glass-py-1 glass-text-xs glass-text-primary"
            style={{ boxShadow: `0 0 25px -12px ${user.color}` }}
          >
            <span
              className="glass-flex glass-radius-full"
              style={{
                width: 10,
                height: 10,
                backgroundColor: user.presence
                  ? undefined
                  : "var(--glass-gray-500)",
              }}
            >
              {user.presence && (
                <span
                  className="glass-radius-full"
                  style={{
                    width: 10,
                    height: 10,
                    ...statusAccent[user.presence],
                  }}
                />
              )}
            </span>
            <span className="glass-font-medium" style={{ color: user.color }}>
              {user.name}
            </span>
            <span className="glass-text-primary-opacity-50">
              {user.presence ?? "active"}
            </span>
          </span>
        ))}
      </div>

      <textarea
        {...textareaProps}
        readOnly={readOnly}
        value={displayValue}
        onChange={handleChange}
        className={cn(
          "glass-w-full glass-radius-2xl glass-border glass-border-white/10 glass-surface-subtle/5 glass-p-5 glass-text-sm glass-text-primary glass-blur-backdrop glass-focus glass-touch-target glass-contrast-guard",
          readOnly && "glass-opacity-70 glass-disabled-cursor-not-allowed",
          textareaClassName
        )}
        style={{ minHeight: 200, resize: "vertical" }}
      />
    </OptimizedGlass>
  );
}

export default MultiUserGlassEditor;
