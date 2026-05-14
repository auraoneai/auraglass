"use client";

import React, { forwardRef } from "react";
import { Clock } from "../../icons";
import { GlassInput, type GlassInputProps } from "./GlassInput";

export interface GlassTimeFieldProps
  extends Omit<GlassInputProps, "type" | "leftIcon"> {}

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
