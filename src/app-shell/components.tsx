"use client";

import React from "react";

import { cn } from "../lib/utilsComprehensive";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type DivPropsWithNodeTitle = Omit<DivProps, "title">;
type NavProps = React.HTMLAttributes<HTMLElement>;
type NavPropsWithNodeTitle = Omit<NavProps, "title">;
type HeaderProps = React.HTMLAttributes<HTMLElement>;
type MainProps = React.HTMLAttributes<HTMLElement>;
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface GlassAppShellProps extends DivProps {
  topBar?: React.ReactNode;
  sidebar?: React.ReactNode;
  actionBar?: React.ReactNode;
  statusBar?: React.ReactNode;
  sidebarPlacement?: "left" | "right";
  density?: "compact" | "comfortable" | "spacious";
}

export const GlassAppShell = React.forwardRef<
  HTMLDivElement,
  GlassAppShellProps
>(
  (
    {
      className,
      topBar,
      sidebar,
      actionBar,
      statusBar,
      sidebarPlacement = "left",
      density = "comfortable",
      children,
      ...props
    },
    ref
  ) => {
    const densityClass = {
      compact: "glass-gap-2 glass-p-2",
      comfortable: "glass-gap-3 glass-p-3",
      spacious: "glass-gap-4 glass-p-4",
    }[density];

    return (
      <div
        ref={ref}
        className={cn(
          "glass-app-shell glass-min-h-screen glass-grid glass-bg-surface/30 glass-text-primary",
          "glass-grid-rows-[auto_1fr_auto]",
          densityClass,
          className
        )}
        data-sidebar-placement={sidebarPlacement}
        {...props}
      >
        {topBar}
        <div
          className={cn(
            "glass-app-shell__body glass-grid glass-min-h-0 glass-gap-3",
            sidebar
              ? sidebarPlacement === "right"
                ? "glass-grid-cols-[minmax(0,1fr)_auto]"
                : "glass-grid-cols-[auto_minmax(0,1fr)]"
              : "glass-grid-cols-1"
          )}
        >
          {sidebar && sidebarPlacement === "left" ? sidebar : null}
          <div className="glass-flex glass-min-w-0 glass-flex-col glass-gap-3">
            {actionBar}
            {children}
          </div>
          {sidebar && sidebarPlacement === "right" ? sidebar : null}
        </div>
        {statusBar}
      </div>
    );
  }
);
GlassAppShell.displayName = "GlassAppShell";

export interface GlassTopBarProps extends HeaderProps {
  brand?: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
  sticky?: boolean;
}

export const GlassTopBar = React.forwardRef<HTMLElement, GlassTopBarProps>(
  (
    {
      className,
      brand,
      navigation,
      actions,
      sticky = true,
      children,
      ...props
    },
    ref
  ) => (
    <header
      ref={ref}
      className={cn(
        "glass-top-bar glass-flex glass-min-h-14 glass-items-center glass-gap-3 glass-rounded-xl",
        "glass-border glass-border-white/12 glass-bg-black/35 glass-px-4 glass-py-2 glass-backdrop-blur-xl",
        sticky && "glass-sticky glass-top-3 glass-z-40",
        className
      )}
      {...props}
    >
      {brand ? (
        <div className="glass-top-bar__brand glass-flex glass-items-center glass-gap-2">
          {brand}
        </div>
      ) : null}
      {navigation ? (
        <nav className="glass-top-bar__nav glass-flex glass-flex-1 glass-items-center glass-gap-2">
          {navigation}
        </nav>
      ) : null}
      {children}
      {actions ? (
        <div className="glass-top-bar__actions glass-ml-auto glass-flex glass-items-center glass-gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  )
);
GlassTopBar.displayName = "GlassTopBar";

export interface GlassSidebarRailItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface GlassSidebarRailProps extends NavProps {
  items?: GlassSidebarRailItem[];
  "aria-label"?: string;
}

export const GlassSidebarRail = React.forwardRef<
  HTMLElement,
  GlassSidebarRailProps
>(
  (
    {
      className,
      items = [],
      "aria-label": ariaLabel = "Primary navigation",
      children,
      ...props
    },
    ref
  ) => (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        "glass-sidebar-rail glass-flex glass-w-16 glass-flex-col glass-items-center glass-gap-2",
        "glass-rounded-xl glass-border glass-border-white/12 glass-bg-black/30 glass-p-2 glass-backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-label={item.label}
          aria-current={item.active ? "page" : undefined}
          disabled={item.disabled}
          onClick={item.onSelect}
          className={cn(
            "glass-grid glass-h-10 glass-w-10 glass-place-items-center glass-rounded-lg glass-border glass-border-transparent",
            "glass-text-secondary glass-transition-colors hover:glass-bg-white/10 hover:glass-text-primary",
            "focus-visible:glass-outline-none focus-visible:glass-ring-2 focus-visible:glass-ring-sky-300",
            item.active &&
              "glass-border-sky-300/40 glass-bg-sky-300/15 glass-text-sky-100",
            item.disabled && "glass-opacity-40"
          )}
        >
          {item.icon ?? (
            <span aria-hidden="true">
              {item.label.slice(0, 1).toUpperCase()}
            </span>
          )}
        </button>
      ))}
      {children}
    </nav>
  )
);
GlassSidebarRail.displayName = "GlassSidebarRail";

export interface GlassSidebarPanelProps extends NavPropsWithNodeTitle {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  collapsed?: boolean;
}

export const GlassSidebarPanel = React.forwardRef<
  HTMLElement,
  GlassSidebarPanelProps
>(
  (
    { className, title, footer, collapsed = false, children, ...props },
    ref
  ) => (
    <aside
      ref={ref}
      className={cn(
        "glass-sidebar-panel glass-flex glass-min-h-0 glass-flex-col glass-rounded-xl",
        "glass-border glass-border-white/12 glass-bg-black/25 glass-backdrop-blur-xl",
        collapsed
          ? "glass-w-0 glass-overflow-hidden glass-border-0"
          : "glass-w-72",
        className
      )}
      aria-hidden={collapsed || undefined}
      {...props}
    >
      {title ? (
        <div className="glass-border-b glass-border-white/10 glass-p-4 glass-font-medium">
          {title}
        </div>
      ) : null}
      <div className="glass-min-h-0 glass-flex-1 glass-overflow-auto glass-p-3">
        {children}
      </div>
      {footer ? (
        <div className="glass-border-t glass-border-white/10 glass-p-3">
          {footer}
        </div>
      ) : null}
    </aside>
  )
);
GlassSidebarPanel.displayName = "GlassSidebarPanel";

export const GlassMain = React.forwardRef<HTMLElement, MainProps>(
  ({ className, children, ...props }, ref) => (
    <main
      ref={ref}
      className={cn(
        "glass-main glass-min-h-0 glass-flex-1 glass-overflow-auto glass-rounded-xl glass-border glass-border-white/10",
        "glass-bg-black/20 glass-p-4 glass-backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {children}
    </main>
  )
);
GlassMain.displayName = "GlassMain";

export interface GlassPageProps extends DivProps {
  constrained?: boolean;
}

export const GlassPage = React.forwardRef<HTMLDivElement, GlassPageProps>(
  ({ className, constrained = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass-page glass-mx-auto glass-flex glass-w-full glass-flex-col glass-gap-5",
        constrained && "glass-max-w-7xl",
        className
      )}
      {...props}
    />
  )
);
GlassPage.displayName = "GlassPage";

export interface GlassPageHeaderProps extends DivPropsWithNodeTitle {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

export const GlassPageHeader = React.forwardRef<
  HTMLDivElement,
  GlassPageHeaderProps
>(
  (
    { className, eyebrow, title, description, actions, children, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "glass-page-header glass-flex glass-items-start glass-justify-between glass-gap-4",
        className
      )}
      {...props}
    >
      <div className="glass-min-w-0">
        {eyebrow ? (
          <p className="glass-mb-2 glass-text-xs glass-font-semibold glass-uppercase glass-tracking-widest glass-text-sky-200">
            {eyebrow}
          </p>
        ) : null}
        {title ? (
          <h1 className="glass-text-3xl glass-font-semibold glass-leading-tight">
            {title}
          </h1>
        ) : null}
        {description ? (
          <p className="glass-mt-2 glass-max-w-3xl glass-text-sm glass-leading-6 glass-text-secondary">
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {actions ? (
        <div className="glass-flex glass-shrink-0 glass-items-center glass-gap-2">
          {actions}
        </div>
      ) : null}
    </div>
  )
);
GlassPageHeader.displayName = "GlassPageHeader";

export interface GlassBreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface GlassBreadcrumbsProps extends NavProps {
  items: GlassBreadcrumbItem[];
}

export const GlassBreadcrumbs = React.forwardRef<
  HTMLElement,
  GlassBreadcrumbsProps
>(({ className, items, ...props }, ref) => (
  <nav
    ref={ref}
    aria-label="Breadcrumb"
    className={cn(
      "glass-breadcrumbs glass-text-sm glass-text-secondary",
      className
    )}
    {...props}
  >
    <ol className="glass-flex glass-flex-wrap glass-items-center glass-gap-2">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={index} className="glass-flex glass-items-center glass-gap-2">
            {item.href && !isLast ? (
              <a className="hover:glass-text-primary" href={item.href}>
                {item.label}
              </a>
            ) : (
              <span aria-current={isLast ? "page" : undefined}>
                {item.label}
              </span>
            )}
            {!isLast ? <span aria-hidden="true">/</span> : null}
          </li>
        );
      })}
    </ol>
  </nav>
));
GlassBreadcrumbs.displayName = "GlassBreadcrumbs";

export const GlassActionBar = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass-action-bar glass-flex glass-items-center glass-justify-between glass-gap-3 glass-rounded-xl",
        "glass-border glass-border-white/10 glass-bg-black/20 glass-p-3 glass-backdrop-blur-xl",
        className
      )}
      {...props}
    />
  )
);
GlassActionBar.displayName = "GlassActionBar";

export interface GlassSplitPaneProps extends DivProps {
  ratio?: "third" | "half" | "two-thirds";
  direction?: "horizontal" | "vertical";
}

export const GlassSplitPane = React.forwardRef<
  HTMLDivElement,
  GlassSplitPaneProps
>(({ className, ratio = "half", direction = "horizontal", ...props }, ref) => {
  const ratioClass =
    direction === "vertical"
      ? "glass-grid-rows-2"
      : ratio === "third"
        ? "glass-grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
        : ratio === "two-thirds"
          ? "glass-grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
          : "glass-grid-cols-2";
  return (
    <div
      ref={ref}
      className={cn(
        "glass-split-pane glass-grid glass-min-h-0 glass-gap-3",
        ratioClass,
        className
      )}
      data-direction={direction}
      {...props}
    />
  );
});
GlassSplitPane.displayName = "GlassSplitPane";

export interface GlassResizablePanelProps extends DivProps {
  minSize?: number | string;
  maxSize?: number | string;
}

export const GlassResizablePanel = React.forwardRef<
  HTMLDivElement,
  GlassResizablePanelProps
>(({ className, minSize = 220, maxSize = "1fr", style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass-resizable-panel glass-min-h-0 glass-overflow-auto glass-rounded-xl glass-border glass-border-white/10 glass-bg-white/5 glass-p-3",
      className
    )}
    style={{ minWidth: minSize, maxWidth: maxSize, ...style }}
    {...props}
  />
));
GlassResizablePanel.displayName = "GlassResizablePanel";

export interface GlassCommandDockProps extends DivProps {
  input?: React.ReactNode;
  actions?: React.ReactNode;
}

export const GlassCommandDock = React.forwardRef<
  HTMLDivElement,
  GlassCommandDockProps
>(({ className, input, actions, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass-command-dock glass-flex glass-items-center glass-gap-3 glass-rounded-2xl glass-border",
      "glass-border-sky-300/25 glass-bg-black/45 glass-p-2 glass-backdrop-blur-2xl",
      className
    )}
    {...props}
  >
    <div className="glass-min-w-0 glass-flex-1">{input ?? children}</div>
    {actions ? (
      <div className="glass-flex glass-items-center glass-gap-2">{actions}</div>
    ) : null}
  </div>
));
GlassCommandDock.displayName = "GlassCommandDock";

export const GlassStatusBar = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="status"
      className={cn(
        "glass-status-bar glass-flex glass-min-h-9 glass-items-center glass-justify-between glass-gap-3",
        "glass-rounded-xl glass-border glass-border-white/10 glass-bg-black/20 glass-px-3 glass-text-xs glass-text-secondary",
        className
      )}
      {...props}
    />
  )
);
GlassStatusBar.displayName = "GlassStatusBar";

export interface GlassMobileShellProps extends DivProps {
  topBar?: React.ReactNode;
  bottomBar?: React.ReactNode;
}

export const GlassMobileShell = React.forwardRef<
  HTMLDivElement,
  GlassMobileShellProps
>(({ className, topBar, bottomBar, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass-mobile-shell glass-grid glass-min-h-screen glass-grid-rows-[auto_1fr_auto]",
      "glass-bg-surface/30 glass-text-primary",
      className
    )}
    {...props}
  >
    {topBar}
    <main className="glass-min-h-0 glass-overflow-auto glass-p-3">
      {children}
    </main>
    {bottomBar}
  </div>
));
GlassMobileShell.displayName = "GlassMobileShell";

export interface GlassIconButtonProps extends ButtonProps {
  label: string;
}

export const GlassIconButton = React.forwardRef<
  HTMLButtonElement,
  GlassIconButtonProps
>(({ className, label, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    aria-label={label}
    className={cn(
      "glass-grid glass-h-9 glass-w-9 glass-place-items-center glass-rounded-lg glass-border glass-border-white/10",
      "glass-bg-white/5 glass-text-secondary glass-transition-colors hover:glass-bg-white/10 hover:glass-text-primary",
      "focus-visible:glass-outline-none focus-visible:glass-ring-2 focus-visible:glass-ring-sky-300",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
GlassIconButton.displayName = "GlassIconButton";
