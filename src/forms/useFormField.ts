'use client';
/* REQ-CMP-31 — useFormField: the react-hook-form seam for AuraGlass
   controls. RHF is an OPTIONAL peer (^7, pinned 7.89.0): everything in
   this entry lives under src/forms/** only, so a consumer without the
   peer never touches it (the lint gate in tests/controls asserts that).

   REQ-CMP-01: the public types below are AuraGlass-owned structural
   shapes (the src/date/shared.ts pattern) — the emitted d.ts never names
   react-hook-form, so a consumer without the optional peer can still
   typecheck every packed entry (canaries/types-strict, skipLibCheck:
   false). RHF's Control / UseControllerReturn / RegisterOptions instances
   satisfy these shapes; the casts to the peer's types stay inside this
   module, the one place the peer is imported. */
import * as React from 'react';
import { useController, useFormContext, type Control, type FieldPath, type FieldValues, type UseControllerProps } from 'react-hook-form';

/** Opaque handle for the form's control object: pass the `control` from
    react-hook-form's useForm (or omit it inside a <FormProvider>). It is
    only ever handed back to RHF — AuraGlass reads no member of it. */
export type FormControl = object;

export type FormValidationRule<V> = V | { value: V | undefined; message: string };

export type FormValidateResult = string | string[] | boolean | undefined;

/** One validator: RHF calls it with the field value and all form values. */
export type FormValidate = (value: unknown, formValues: Record<string, unknown>) => FormValidateResult | Promise<FormValidateResult>;

/** RHF validation rules for the field (required, min, pattern, validate, …),
    structurally RHF's controller rules (RegisterOptions minus the
    value-coercion keys a Controller registration does not take). */
export interface FormFieldRules {
  required?: string | FormValidationRule<boolean> | undefined;
  min?: FormValidationRule<number | string> | undefined;
  max?: FormValidationRule<number | string> | undefined;
  maxLength?: FormValidationRule<number> | undefined;
  minLength?: FormValidationRule<number> | undefined;
  pattern?: FormValidationRule<RegExp> | undefined;
  validate?: FormValidate | Record<string, FormValidate> | undefined;
  /** Other field names whose changes revalidate this field. */
  deps?: string | string[] | undefined;
}

/** One field error as RHF reports it (`type` is the failed rule's name). */
export interface FormFieldError {
  type?: string | undefined;
  message?: string | undefined;
}

/** The controller binding for compound/hidden-input controls, structurally
    RHF's ControllerRenderProps. */
export interface FormFieldBinding {
  name: string;
  value: unknown;
  onChange: (...event: unknown[]) => void;
  onBlur: () => void;
  ref: (instance: HTMLElement | null) => void;
  disabled?: boolean | undefined;
}

/** Field-level state, structurally RHF's ControllerFieldState. */
export interface FormFieldState {
  invalid: boolean;
  isTouched: boolean;
  isDirty: boolean;
  isValidating: boolean;
  error?: FormFieldError | undefined;
}

/** Form-level state flags, structurally RHF's FormState. */
export interface FormStateSnapshot {
  isDirty: boolean;
  isValid: boolean;
  isValidating: boolean;
  isLoading: boolean;
  isSubmitted: boolean;
  isSubmitting: boolean;
  isSubmitSuccessful: boolean;
  submitCount: number;
  errors: Record<string, FormFieldError | undefined>;
}

/** Controller binding for compound/hidden-input controls (Switch/Checkbox/Select/Combobox),
    structurally RHF's UseControllerReturn. */
export interface FormFieldController {
  field: FormFieldBinding;
  fieldState: FormFieldState;
  formState: FormStateSnapshot;
}

export interface UseFormFieldResult<Name extends string = string> {
  /** Binds a native input by ref: resolves the control's inner input/textarea
      and hands it to RHF's field.ref, plus input/blur listeners so
      onChange/onBlur validation modes see updates. Spread as `ref` prop. */
  bindNative: (el: HTMLElement | null) => void;
  /** Controller binding for compound/hidden-input controls (Switch/Checkbox/Select/Combobox). */
  controller: FormFieldController;
  /** Field name. */
  name: Name;
  /** Current invalid state + first error message for Field.Root/Field.Error. */
  invalid: boolean;
  error: string | undefined;
}

/** useFormField(name, control?, rules?) — must be rendered inside a react-hook-form <FormProvider>
    (or given `control`). `rules` are the field's RHF validation rules: the
    controller registration owns the field, so rules must be passed here
    rather than through a separate register() call (which it overrides). */
export function useFormField<Name extends string = string>(name: Name, control?: FormControl, rules?: FormFieldRules): UseFormFieldResult<Name> {
  const ctx = useFormContext<FieldValues>();
  const ctl = (control as Control<FieldValues> | undefined) ?? ctx?.control;
  if (!ctl) throw new Error('useFormField: no react-hook-form Control — wrap the form in <FormProvider>');
  const controller = useController<FieldValues, FieldPath<FieldValues>>({
    name: name as FieldPath<FieldValues>,
    control: ctl,
    ...(rules ? { rules: rules as NonNullable<UseControllerProps<FieldValues, FieldPath<FieldValues>>['rules']> } : {}),
  });
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

  return {
    bindNative,
    controller: controller as FormFieldController,
    name,
    invalid: controller.fieldState.invalid,
    error: err?.message,
  };
}
