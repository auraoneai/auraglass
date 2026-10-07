"use client";

import React from "react";
import { Slot } from "./Slot";

type Orientation = "horizontal" | "vertical" | "both";

type RovingFocusContextValue = {
  orientation: Orientation;
  loop: boolean;
  dir: "ltr" | "rtl";
  currentTabStopId: string | null;
  setCurrentTabStopId: (id: string) => void;
  registerItem: (id: string, node: HTMLElement) => void;
  unregisterItem: (id: string) => void;
  focusByDelta: (id: string, delta: number) => void;
  focusFirst: () => void;
  focusLast: () => void;
};

const RovingFocusContext = React.createContext<RovingFocusContextValue | null>(
  null
);

export interface RovingFocusGroupRootProps
  extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: Orientation;
  loop?: boolean;
  defaultCurrentTabStopId?: string;
  dir?: "ltr" | "rtl";
}

export const RovingFocusGroupRoot = React.forwardRef<
  HTMLDivElement,
  RovingFocusGroupRootProps
>(
  (
    {
      orientation = "horizontal",
      loop = false,
      defaultCurrentTabStopId,
      dir = "ltr",
      children,
      ...props
    },
    ref
  ) => {
    const itemsRef = React.useRef<Map<string, HTMLElement>>(new Map());
    const [currentTabStopId, setCurrentTabStopId] = React.useState<
      string | null
    >(defaultCurrentTabStopId ?? null);

    const registerItem = React.useCallback((id: string, node: HTMLElement) => {
      itemsRef.current.set(id, node);
      setCurrentTabStopId((current) => current ?? id);
    }, []);

    const unregisterItem = React.useCallback((id: string) => {
      itemsRef.current.delete(id);
      setCurrentTabStopId((current) => (current === id ? null : current));
    }, []);

    const focusByDelta = React.useCallback(
      (id: string, delta: number) => {
        const entries = Array.from(itemsRef.current.entries()).filter(
          ([, node]) =>
            !node.hasAttribute("disabled") &&
            node.getAttribute("aria-disabled") !== "true"
        );
        const index = entries.findIndex(([entryId]) => entryId === id);
        if (index === -1 || entries.length === 0) return;

        let nextIndex = index + delta;
        if (loop) {
          nextIndex = (nextIndex + entries.length) % entries.length;
        } else {
          nextIndex = Math.max(0, Math.min(entries.length - 1, nextIndex));
        }

        const [nextId, nextNode] = entries[nextIndex];
        setCurrentTabStopId(nextId);
        nextNode.focus();
      },
      [loop]
    );

    const focusByIndex = React.useCallback((index: number) => {
      const entries = Array.from(itemsRef.current.entries()).filter(
        ([, node]) =>
          !node.hasAttribute("disabled") &&
          node.getAttribute("aria-disabled") !== "true"
      );
      const [nextId, nextNode] = entries[index] || [];
      if (!nextId || !nextNode) return;

      setCurrentTabStopId(nextId);
      nextNode.focus();
    }, []);

    const focusFirst = React.useCallback(() => {
      focusByIndex(0);
    }, [focusByIndex]);

    const focusLast = React.useCallback(() => {
      const enabledCount = Array.from(itemsRef.current.values()).filter(
        (node) =>
          !node.hasAttribute("disabled") &&
          node.getAttribute("aria-disabled") !== "true"
      ).length;
      focusByIndex(enabledCount - 1);
    }, [focusByIndex]);

    const value = React.useMemo(
      () => ({
        orientation,
        loop,
        dir,
        currentTabStopId,
        setCurrentTabStopId,
        registerItem,
        unregisterItem,
        focusByDelta,
        focusFirst,
        focusLast,
      }),
      [
        currentTabStopId,
        dir,
        focusFirst,
        focusLast,
        focusByDelta,
        loop,
        orientation,
        registerItem,
        unregisterItem,
      ]
    );

    return (
      <RovingFocusContext.Provider value={value}>
        <div
          ref={ref}
          role={props.role}
          dir={dir}
          data-roving-focus-group=""
          {...props}
        >
          {children}
        </div>
      </RovingFocusContext.Provider>
    );
  }
);

RovingFocusGroupRoot.displayName = "RovingFocusGroupRoot";

export interface RovingFocusGroupItemProps
  extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  disabled?: boolean;
}

export const RovingFocusGroupItem = React.forwardRef<
  HTMLElement,
  RovingFocusGroupItemProps
>(
  (
    { asChild = false, disabled = false, onKeyDown, onFocus, ...props },
    ref
  ) => {
    const context = React.useContext(RovingFocusContext);
    const id = React.useId();
    const localRef = React.useRef<HTMLElement | null>(null);
    const Comp = asChild ? Slot : "div";

    React.useEffect(() => {
      if (!context || !localRef.current) return;

      context.registerItem(id, localRef.current);
      return () => context.unregisterItem(id);
    }, [context, id]);

    const setRef = React.useCallback(
      (node: HTMLElement | null) => {
        localRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      [ref]
    );

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || !context) return;

      const horizontal =
        context.orientation === "horizontal" || context.orientation === "both";
      const vertical =
        context.orientation === "vertical" || context.orientation === "both";

      if (event.key === "Home") {
        event.preventDefault();
        context.focusFirst();
      } else if (event.key === "End") {
        event.preventDefault();
        context.focusLast();
      } else if (horizontal && event.key === "ArrowRight") {
        event.preventDefault();
        context.focusByDelta(id, context.dir === "rtl" ? -1 : 1);
      } else if (horizontal && event.key === "ArrowLeft") {
        event.preventDefault();
        context.focusByDelta(id, context.dir === "rtl" ? 1 : -1);
      } else if (vertical && event.key === "ArrowDown") {
        event.preventDefault();
        context.focusByDelta(id, 1);
      } else if (vertical && event.key === "ArrowUp") {
        event.preventDefault();
        context.focusByDelta(id, -1);
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
      onFocus?.(event);
      context?.setCurrentTabStopId(id);
    };

    const tabIndex = context?.currentTabStopId === id ? 0 : -1;

    return (
      <Comp
        ref={setRef}
        tabIndex={disabled ? undefined : tabIndex}
        data-roving-focus-item=""
        aria-disabled={disabled || undefined}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

RovingFocusGroupItem.displayName = "RovingFocusGroupItem";

export const RovingFocusGroup = {
  Root: RovingFocusGroupRoot,
  Item: RovingFocusGroupItem,
};

export const GlassRovingFocusGroup = RovingFocusGroup;

export default RovingFocusGroup;
