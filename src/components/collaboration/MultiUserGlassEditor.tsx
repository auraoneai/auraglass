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

export interface MultiUserGlassEditorProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  users?: CollaborationParticipant[];
  className?: string;
  header?: string;
  lastUpdatedAt?: Date | string;
  onContentChange?: (value: string) => void;
  textareaClassName?: string;
}

const statusAccent: Record<
  NonNullable<CollaborationParticipant["presence"]>,
  string
> = {
  active: "bg-emerald-400/90",
  idle: "bg-amber-300/90",
  offline: "bg-slate-500/80",
};

const DEFAULT_USERS: CollaborationParticipant[] = [
  { id: "1", name: "Nova", presence: "active", color: "#38bdf8" },
  { id: "2", name: "Orion", presence: "idle", color: "#f472b6" },
  { id: "3", name: "Lyra", presence: "offline", color: "#a855f7" },
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
      color: user.color ?? ["#38bdf8", "#f472b6", "#facc15"][index % 3],
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
        "glass-radius-3xl glass-border glass-border-soft glass-p-6 space-y-6",
        "bg-gradient-to-br from-slate-950/80 via-slate-900/60 to-slate-900/40",
        className
      )}
    >
      <header className="glass-flex glass-flex-wrap glass-items-center glass-justify-between glass-gap-4">
        <div>
          <h2 className="glass-text-xl font-semibold text-primary">{header}</h2>
          <p className="glass-text-sm text-primary/70">
            Synced presence across team members with glass awareness.
          </p>
        </div>
        <span className="glass-radius-full glass-border glass-border-white/10 glass-surface-subtle/10 glass-px-3 glass-py-1 glass-text-xs text-primary/70">
          Updated {formattedTimestamp}
        </span>
      </header>

      <div className="glass-flex glass-flex-wrap glass-items-center glass-gap-3">
        {participants.map((user) => (
          <span
            key={user.id}
            className="glass-flex glass-items-center glass-gap-2 glass-radius-full glass-border glass-border-white/10 glass-surface-subtle/5 glass-px-3 glass-py-1 glass-text-xs text-primary"
            style={{ boxShadow: `0 0 25px -12px ${user.color}` }}
          >
            <span
              className="glass-flex h-2.5 w-2.5 glass-radius-full"
              style={{ backgroundColor: user.presence ? undefined : "#94a3b8" }}
            >
              {user.presence && (
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    statusAccent[user.presence]
                  )}
                />
              )}
            </span>
            <span className="font-medium" style={{ color: user.color }}>
              {user.name}
            </span>
            <span className="text-primary/50">{user.presence ?? "active"}</span>
          </span>
        ))}
      </div>

      <textarea
        {...textareaProps}
        readOnly={readOnly}
        value={displayValue}
        onChange={handleChange}
        className={cn(
          "min-h-[200px] w-full resize-y rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-primary shadow-inner backdrop-blur transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400",
          readOnly ? "opacity-70 cursor-not-allowed" : "hover:border-white/30",
          textareaClassName
        )}
      />
    </OptimizedGlass>
  );
}

export default MultiUserGlassEditor;
