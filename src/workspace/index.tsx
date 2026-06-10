"use client";

import React from "react";

import { cn } from "../lib/utilsComprehensive";
import {
  GlassActionBar,
  GlassCommandDock,
  GlassPage,
  GlassPageHeader,
  GlassSplitPane,
  type GlassPageHeaderProps,
  type GlassSplitPaneProps,
} from "../app-shell";

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type DivPropsWithNodeTitle = Omit<DivProps, "title">;

export interface GlassWorkspaceProps extends DivProps {
  header?: React.ReactNode;
  commandDock?: React.ReactNode;
  inspector?: React.ReactNode;
}

export const GlassWorkspace = React.forwardRef<
  HTMLDivElement,
  GlassWorkspaceProps
>(({ className, header, commandDock, inspector, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass-workspace glass-flex glass-min-h-0 glass-flex-1 glass-flex-col glass-gap-3",
      className
    )}
    {...props}
  >
    {header}
    {commandDock}
    <div
      className={cn(
        "glass-grid glass-min-h-0 glass-flex-1 glass-gap-3",
        inspector
          ? "glass-grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)]"
          : "glass-grid-cols-1"
      )}
    >
      <div className="glass-min-w-0 glass-overflow-auto">{children}</div>
      {inspector ? (
        <aside className="glass-min-h-0 glass-overflow-auto glass-rounded-xl glass-border glass-border-white/12 glass-bg-white/5 glass-p-3">
          {inspector}
        </aside>
      ) : null}
    </div>
  </div>
));
GlassWorkspace.displayName = "GlassWorkspace";

export interface GlassWorkspaceHeaderProps extends GlassPageHeaderProps {
  tabs?: React.ReactNode;
}

export const GlassWorkspaceHeader = React.forwardRef<
  HTMLDivElement,
  GlassWorkspaceHeaderProps
>(({ className, tabs, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass-workspace-header glass-flex glass-flex-col glass-gap-3",
      className
    )}
  >
    <GlassPageHeader {...props} />
    {tabs ? (
      <div className="glass-flex glass-items-center glass-gap-2">{tabs}</div>
    ) : null}
  </div>
));
GlassWorkspaceHeader.displayName = "GlassWorkspaceHeader";

export interface GlassWorkspaceTabsProps extends DivProps {
  value?: string;
  onValueChange?: (value: string) => void;
}

export const GlassWorkspaceTabs = React.forwardRef<
  HTMLDivElement,
  GlassWorkspaceTabsProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="tablist"
    className={cn(
      "glass-workspace-tabs glass-inline-flex glass-rounded-xl glass-border glass-border-white/12 glass-bg-white/5 glass-p-1",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
GlassWorkspaceTabs.displayName = "GlassWorkspaceTabs";

export interface GlassWorkspaceTabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const GlassWorkspaceTab = React.forwardRef<
  HTMLButtonElement,
  GlassWorkspaceTabProps
>(({ className, active = false, type = "button" as const, ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    role="tab"
    aria-selected={active}
    className={cn(
      "glass-rounded-lg glass-px-3 glass-py-1.5 glass-text-sm glass-transition-colors",
      "focus-visible:glass-outline-none focus-visible:glass-ring-2 focus-visible:glass-ring-sky-300",
      active
        ? "glass-bg-sky-300/15 glass-text-sky-100"
        : "glass-text-secondary hover:glass-bg-white/10 hover:glass-text-primary",
      className
    )}
    {...props}
  />
));
GlassWorkspaceTab.displayName = "GlassWorkspaceTab";

export interface GlassWorkspacePanelProps extends DivPropsWithNodeTitle {
  title?: React.ReactNode;
  actions?: React.ReactNode;
}

export const GlassWorkspacePanel = React.forwardRef<
  HTMLDivElement,
  GlassWorkspacePanelProps
>(({ className, title, actions, children, ...props }, ref) => (
  <section
    ref={ref}
    className={cn(
      "glass-workspace-panel glass-rounded-xl glass-border glass-border-white/12 glass-bg-white/5 glass-backdrop-blur-xl",
      className
    )}
    {...props}
  >
    {(title || actions) && (
      <GlassActionBar className="glass-rounded-b-none glass-border-x-0 glass-border-t-0">
        <div className="glass-font-medium">{title}</div>
        {actions}
      </GlassActionBar>
    )}
    <div className="glass-p-4">{children}</div>
  </section>
));
GlassWorkspacePanel.displayName = "GlassWorkspacePanel";

export interface GlassInspectorPanelProps extends DivPropsWithNodeTitle {
  title?: React.ReactNode;
}

export const GlassInspectorPanel = React.forwardRef<
  HTMLDivElement,
  GlassInspectorPanelProps
>(({ className, title, children, ...props }, ref) => (
  <aside
    ref={ref}
    className={cn(
      "glass-inspector-panel glass-flex glass-min-h-0 glass-flex-col glass-rounded-xl",
      "glass-border glass-border-white/15 glass-bg-white/6 glass-backdrop-blur-xl",
      className
    )}
    {...props}
  >
    {title ? (
      <div className="glass-border-b glass-border-white/10 glass-p-3 glass-font-medium">
        {title}
      </div>
    ) : null}
    <div className="glass-min-h-0 glass-flex-1 glass-overflow-auto glass-p-3">
      {children}
    </div>
  </aside>
));
GlassInspectorPanel.displayName = "GlassInspectorPanel";

export interface GlassCanvasAreaProps extends DivProps {
  emptyState?: React.ReactNode;
}

export const GlassCanvasArea = React.forwardRef<
  HTMLDivElement,
  GlassCanvasAreaProps
>(({ className, emptyState, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass-canvas-area glass-grid glass-min-h-[24rem] glass-place-items-center glass-rounded-xl",
      "glass-border glass-border-white/12 glass-bg-white/4 glass-p-4",
      className
    )}
    {...props}
  >
    {children ?? emptyState}
  </div>
));
GlassCanvasArea.displayName = "GlassCanvasArea";

export interface GlassTimelineRailProps extends DivPropsWithNodeTitle {
  label?: React.ReactNode;
}

export const GlassTimelineRail = React.forwardRef<
  HTMLDivElement,
  GlassTimelineRailProps
>(({ className, label, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "glass-timeline-rail glass-rounded-xl glass-border glass-border-white/12 glass-bg-white/5 glass-p-3",
      className
    )}
    {...props}
  >
    {label ? (
      <div className="glass-mb-3 glass-text-xs glass-font-semibold glass-uppercase glass-tracking-widest glass-text-secondary">
        {label}
      </div>
    ) : null}
    <div className="glass-flex glass-flex-col glass-gap-2">{children}</div>
  </div>
));
GlassTimelineRail.displayName = "GlassTimelineRail";

export interface GlassWorkflowShellProps extends DivPropsWithNodeTitle {
  title: React.ReactNode;
  description?: React.ReactNode;
  command?: React.ReactNode;
  actions?: React.ReactNode;
  split?: GlassSplitPaneProps["ratio"];
  inspector?: React.ReactNode;
}

export const GlassWorkflowShell = React.forwardRef<
  HTMLDivElement,
  GlassWorkflowShellProps
>(
  (
    {
      className,
      title,
      description,
      command,
      actions,
      split = "two-thirds",
      inspector,
      children,
      ...props
    },
    ref
  ) => (
    <GlassPage
      ref={ref}
      className={cn("glass-workflow-shell", className)}
      {...props}
    >
      <GlassWorkspaceHeader
        title={title}
        description={description}
        actions={actions}
      />
      {command ? <GlassCommandDock>{command}</GlassCommandDock> : null}
      {inspector ? (
        <GlassSplitPane ratio={split}>
          <div>{children}</div>
          <GlassInspectorPanel title="Inspector">
            {inspector}
          </GlassInspectorPanel>
        </GlassSplitPane>
      ) : (
        children
      )}
    </GlassPage>
  )
);
GlassWorkflowShell.displayName = "GlassWorkflowShell";
