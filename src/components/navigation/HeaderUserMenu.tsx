import React, { useState, forwardRef } from "react";
import { cn } from "../../lib/utilsComprehensive";
import { GlassPopover } from "../modal/GlassPopover";
import { GlassAvatar } from "../data-display/GlassAvatar";
import { ChevronRight } from "lucide-react";
import { useA11yId } from "@/utils/a11y";
import { useReducedMotion } from "../../hooks/useReducedMotion";

export interface HeaderUserMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "default" | "danger";
  separator?: boolean;
}

export interface HeaderUserInfo {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  status?: "online" | "away" | "busy" | "offline";
}

export interface HeaderUserMenuProps {
  user: HeaderUserInfo;
  items: HeaderUserMenuItem[];
  className?: string;

  /** Glass surface intent */
  intent?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";

  /** Glass surface elevation */
  elevation?: "level1" | "level2" | "level3" | "level4";

  /** Performance tier */
  tier?: "low" | "medium" | "high";
  /**
   * Whether to respect motion preferences for animations
   */
  respectMotionPreference?: boolean;
}

export const HeaderUserMenu = forwardRef<
  HTMLButtonElement,
  HeaderUserMenuProps
>(({ user, items, respectMotionPreference = true, className }, ref) => {
  // Accessibility and motion preferences
  const menuId = useA11yId("user-menu");
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = respectMotionPreference && prefersReducedMotion;
  const [open, setOpen] = useState(false);

  const statusColor =
    user.status === "online"
      ? "bg-green-500"
      : user.status === "away"
        ? "bg-yellow-500"
        : user.status === "busy"
          ? "bg-red-500"
          : "bg-gray-500";

  return (
    <GlassPopover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottom-end"
      appearance="glass"
      contentClassName="w-80 glass-p-1 ring-1 ring-white/10 shadow-[0_20px_60px_rgba(2,8,23,0.55)] rounded-2xl"
      content={
        <div className="w-80">
          {/* User header */}
          <div className="glass-px-4 pt-4">
            <div
              className="glass-flex glass-items-center glass-gap-3 glass-px-3 glass-py-3 glass-gradient-primary glass-gradient-primary via-white/3 glass-gradient-primary glass-border glass-border-white/12 glass-shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              style={{ borderRadius: 18 }}
            >
              <GlassAvatar
                size="md"
                src={user.avatar}
                fallbackText={user.name}
                showStatus={!!user.status}
                status={user.status as any}
              />
              <div className="min-glass-w-0">
                <div className="font-semibold text-primary truncate">
                  {user.name}
                </div>
                {user.email && (
                  <div className="glass-text-xs text-primary/80 truncate">
                    {user.email}
                  </div>
                )}
                {user.status && (
                  <div className="glass-flex glass-items-center glass-gap-1 glass-mt-1">
                    <span
                      className={cn(
                        "inline-block w-2 h-2 glass-radius-full",
                        statusColor
                      )}
                    />
                    <span className="glass-text-xs text-primary/70 capitalize">
                      {user.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div className="glass-p-2">
            {items.map((item, idx) => (
              <React.Fragment key={item?.id}>
                {item?.separator && idx > 0 && (
                  <div className="glass-my-2 glass-border-t glass-border-white/10" />
                )}
                {item?.href ? (
                  <a
                    href={item?.href}
                    className={cn(
                      "group w-full flex items-center justify-between glass-gap-3 rounded-[14px] glass-px-3 glass-py-2.5 transition-colors",
                      "glass-text-primary/90 hover:glass-text-primary hover:bg-white/10",
                      "glass-focus glass-touch-target glass-contrast-guard"
                    )}
                    onClick={(e) => setOpen(false)}
                  >
                    <span className="glass-inline-flex glass-items-center glass-gap-3 truncate">
                      {item?.icon && (
                        <span className="text-primary/80">{item?.icon}</span>
                      )}
                      <span className="truncate">{item?.label}</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-primary/40 group-hover:text-primary/70" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      item?.onClick?.();
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between glass-gap-3 rounded-[14px] glass-px-3 glass-py-2.5 transition-colors",
                      "glass-focus glass-touch-target glass-contrast-guard",
                      item?.variant === "danger"
                        ? "text-red-300 hover:bg-red-500/10"
                        : "glass-text-primary/90 hover:glass-text-primary hover:bg-white/10"
                    )}
                  >
                    <span className="glass-inline-flex glass-items-center glass-gap-3 truncate">
                      {item?.icon && (
                        <span
                          className={cn(
                            item?.variant === "danger"
                              ? "text-red-400"
                              : "glass-text-primary/80"
                          )}
                        >
                          {item?.icon}
                        </span>
                      )}
                      <span className="truncate">{item?.label}</span>
                    </span>
                    {item?.variant !== "danger" && (
                      <ChevronRight className="w-4 h-4 text-primary/40 group-hover:text-primary/70" />
                    )}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      }
    >
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex items-center glass-gap-2 glass-px-1.5 glass-py-1 glass-radius-full",
          "bg-transparent text-foreground hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/30",
          "glass-focus glass-touch-target glass-contrast-guard",
          !shouldReduceMotion && "transition-all duration-200 hover:scale-105",
          className
        )}
        aria-label={user.name}
        aria-haspopup="menu"
        aria-expanded={open}
        id={menuId}
      >
        <GlassAvatar
          size="sm"
          src={user.avatar}
          fallbackText={user.name}
          showStatus={!!user.status}
          status={user.status as any}
        />
      </button>
    </GlassPopover>
  );
});

HeaderUserMenu.displayName = "HeaderUserMenu";
