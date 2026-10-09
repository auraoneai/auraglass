"use client";

import React, { forwardRef } from "react";
import { Clock } from "../../icons";
import { GlassInput, type GlassInputProps } from "./GlassInput";

export interface GlassTimeFieldProps
  extends Omit<GlassInputProps, "type" | "leftIcon"> {}

/** @deprecated GlassTimeField DEP-S0221 since 4.2.0, removed in 5.0.0. {@link TimeField from aura-glass/date} */
export const GlassTimeField = forwardRef<HTMLInputElement, GlassTimeFieldProps>(
  ({ label = "Time", ...props }, ref) => (
    <GlassInput
      ref={ref}
      type="time"
      label={label}
      leftIcon={<Clock aria-hidden="true" />}
      {...props}
    />
  )
);

GlassTimeField.displayName = "GlassTimeField";
