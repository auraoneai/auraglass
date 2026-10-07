"use client";

import React, { forwardRef } from "react";
import { Calendar } from "../../icons";
import { GlassInput, type GlassInputProps } from "./GlassInput";

export interface GlassDateFieldProps
  extends Omit<GlassInputProps, "type" | "leftIcon"> {}

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
