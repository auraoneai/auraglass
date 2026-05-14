"use client";

import React, { forwardRef } from "react";
import { Search, X } from "../../icons";
import { GlassInput, type GlassInputProps } from "./GlassInput";
import { GlassButton } from "../button/GlassButton";

export interface GlassSearchFieldProps
  extends Omit<GlassInputProps, "type" | "leftIcon" | "rightIcon"> {
  onClear?: () => void;
  clearLabel?: string;
}

export const GlassSearchField = forwardRef<
  HTMLInputElement,
  GlassSearchFieldProps
>(
  (
    {
      placeholder = "Search",
      label = "Search",
      clearable = true,
      onClear,
      clearLabel = "Clear search",
      value,
      ...props
    },
    ref
  ) => {
    const hasValue =
      typeof value === "string" ? value.length > 0 : value !== undefined;

    return (
      <GlassInput
        ref={ref}
        type="search"
        role="searchbox"
        placeholder={placeholder}
        label={label}
        value={value}
        leftIcon={<Search aria-hidden="true" />}
        rightIcon={
          clearable && hasValue && onClear ? (
            <GlassButton
              type="button"
              size="sm"
              variant="ghost"
              onClick={onClear}
              aria-label={clearLabel}
            >
              <X aria-hidden="true" className="glass-h-4 glass-w-4" />
            </GlassButton>
          ) : undefined
        }
        {...props}
      />
    );
  }
);

GlassSearchField.displayName = "GlassSearchField";
