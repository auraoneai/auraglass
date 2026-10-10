'use client';
/* REQ-CMP-31 — useFormField: the react-hook-form seam for AuraGlass
   controls. RHF is an OPTIONAL peer (^7, pinned 7.89.0): everything in
   this entry lives under src/forms/** only, so a consumer without the
   peer never touches it (the lint gate in tests/controls asserts that). */
import * as React from 'react';
import { useController, useFormContext, type Control, type FieldPath, type FieldValues, type UseControllerReturn } from 'react-hook-form';

export interface UseFormFieldResult<Name extends string = string> {
  /** Binds a native input by ref: resolves the control's inner input/textarea
      and hands it to RHF's field.ref, plus input/blur listeners so
      onChange/onBlur validation modes see updates. Spread as `ref` prop. */
  bindNative: (el: HTMLElement | null) => void;
  /** Controller binding for compound/hidden-input controls (Switch/Checkbox/Select/Combobox). */
  controller: UseControllerReturn<FieldValues, FieldPath<FieldValues>>;
  /** Field name. */
  name: Name;
  /** Current invalid state + first error message for Field.Root/Field.Error. */
  invalid: boolean;
  error: string | undefined;
}

/** useFormField(name) — must be rendered inside a react-hook-form <FormProvider>. */
export function useFormField<Name extends string = string>(name: Name, control?: Control<FieldValues>): UseFormFieldResult<Name> {
  const ctx = useFormContext<FieldValues>();
  const ctl = control ?? ctx?.control;
  if (!ctl) throw new Error('useFormField: no react-hook-form Control — wrap the form in <FormProvider>');
  const controller = useController<FieldValues, FieldPath<FieldValues>>({ name: name as FieldPath<FieldValues>, control: ctl });
  const err = controller.fieldState.error;
  const { field } = controller;
  const setRef = field.ref as (e: HTMLInputElement | null) => void;

  const bindNative = React.useCallback((el: HTMLElement | null) => {
    if (!el) { setRef(null); return; }
    const input = (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)
      ? el
      : el.querySelector('input, textarea, select');
    if (!input) return;
    input.addEventListener('input', () => field.onChange({ target: input, type: 'input' }));
    input.addEventListener('change', () => field.onChange({ target: input, type: 'change' }));
    input.addEventListener('blur', () => field.onBlur());
    setRef(input as HTMLInputElement);
  }, [field, setRef]);

  return { bindNative, controller, name, invalid: controller.fieldState.invalid, error: err?.message };
}
