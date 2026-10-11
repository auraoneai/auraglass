"use client";

import React, { forwardRef } from "react";
import { Calendar } from "../../icons";
import { GlassInput, type GlassInputProps } from "./GlassInput";

export interface GlassDateFieldProps
  extends Omit<GlassInputProps, "type" | "leftIcon"> {}

/** @deprecated GlassDateField DEP-S0220 since 4.2.0, removed in 5.0.0. {@link DateField from aura-glass/date} */
export const GlassDateField = forwardRef<HTMLInputElement, GlassDateFieldProps>(
  ({ label = "Date", ...props }, ref) => (
    <GlassInput
      ref={ref}
      type="date"
      label={label}
      leftIcon={<Calendar aria-hidden="true" />}
      {...props}
    />
  )
);

GlassDateField.displayName = "GlassDateField";
