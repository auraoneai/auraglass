"use client";
/* aura-glass/forms — REQ-CMP-142 / CMP-31 forms seam.
   FormField wires a RHF-style {name, control?} grammar onto the CMP Field
   compound; useFormField exposes the enclosing field's state to any control
   inside it (label ids, error, invalid, name) — the shadcn-parity contract. */
import * as React from "react";
import { useFieldRootContext } from "@base-ui/react/internals/field-root-context";
import { Field } from "../components/field";
import type { FieldRootProps } from "../components/field";

export interface FormFieldContextValue {
  name: string | undefined;
  invalid: boolean;
  errorId: string;
  descriptionId: string;
  controlId: string;
}

const FormFieldContext = React.createContext<FormFieldContextValue | null>(
  null
);

/** Read the enclosing FormField's wiring: ids the control should use for
    aria-describedby/aria-errormessage plus the field's invalid state. Safe
    outside a FormField — returns field state only (no ids) so controls can
    be used inside bare Field.Root too. */
export function useFormField(): FormFieldContextValue {
  const fieldCtx = React.useContext(FormFieldContext);
  const rootCtx = useFieldRootContext(true);
  return React.useMemo<FormFieldContextValue>(() => {
    if (fieldCtx) return fieldCtx;
    return {
      name: rootCtx.name,
      invalid: rootCtx.invalid === true,
      errorId: "",
      descriptionId: "",
      controlId: "",
    };
  }, [fieldCtx, rootCtx.name, rootCtx.invalid]);
}

export interface FormFieldProps extends FieldRootProps {
  /** RHF-parity: the field's form name (forwarded to Field.Root). */
  name?: string;
}

/** Field.Root with shadcn-parity context: children (Label | control |
    Description | Error) get name/invalid + generated ids via useFormField. */
export function FormField({ name, children, ...rest }: FormFieldProps) {
  const id = React.useId();
  const value = React.useMemo<FormFieldContextValue>(
    () => ({
      name,
      invalid: false,
      controlId: `${id}-control`,
      errorId: `${id}-error`,
      descriptionId: `${id}-description`,
    }),
    [id, name]
  );
  return React.createElement(
    Field.Root,
    { name, ...rest },
    React.createElement(FormFieldContext.Provider, { value }, children)
  );
}
