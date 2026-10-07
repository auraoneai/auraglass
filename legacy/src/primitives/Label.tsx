"use client";

import React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (props, ref) => <label ref={ref} {...props} />
);

Label.displayName = "Label";

export const Root = Label;

export default Label;
