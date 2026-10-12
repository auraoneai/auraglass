'use client';

/* REQ-CMP-31 — FormField: binds a react-hook-form field to an AuraGlass
   control through Field.Root invalid state + Field.Error.

   - mode="native" (TextField/NumberField/SearchField): the control's `ref`
     prop resolves to the inner input — RHF registers it (register()-style).
   - mode="controller" (Switch/Checkbox/Select/Combobox): bound via RHF
     Controller — value/checked + onValueChange/onCheckedChange forward to
     field.value/onChange; `name` on the hidden input submits the value.
     The Base UI hidden <input name> is handed to RHF as the field's `ref`
     (controller.field.ref), so setFocus() and shouldFocusError reach the
     control: Base UI forwards focus from that input to the visible control
     (switch/checkbox root, select trigger, combobox input). Resolved from the
     rendered Field.Root, so no control needs a public inputRef prop. */
import * as React from 'react';
import { useFormField, type FormFieldRules } from './useFormField';
import { Field } from '../components/field/index';

export interface FormFieldProps {
  /** RHF field name — also the submitted key. */
  name: string;
  /** 'native' binds the inner input ref; 'controller' wires value/onChange via RHF Controller. */
  mode?: 'native' | 'controller';
  /** Control element: e.g. <TextField/>, <Switch/>, <Select.Root>. */
  control: React.ReactElement;
  /** Field.Label content. */
  label?: React.ReactNode;
  /** Field.Error override — defaults to the RHF error message. */
  error?: React.ReactNode;
  /** Prop the control takes its value from (controller mode). Default 'value' (Switch/Checkbox use 'checked'). */
  valueProp?: string;
  /** Prop the control reports changes through. Default auto-detected ('onCheckedChange' when the control defines it, else 'onValueChange'). */
  changeProp?: string;
  disabled?: boolean;
  /** RHF validation rules (required, min, pattern, validate, …). */
  rules?: FormFieldRules;
}

export function FormField({ name, mode = 'native', control, label, error, valueProp, changeProp, disabled, rules }: FormFieldProps) {
  const { bindNative, controller, invalid, error: rhfError } = useFormField(name, undefined, rules);
  /* Switch/Checkbox are checked/onCheckedChange; selects/combobox value/onValueChange. */
  const typeName = control.type ? ((control.type as { displayName?: string; name?: string }).displayName ?? (control.type as { name?: string }).name ?? '') : '';
  const checkable = /switch|checkbox/i.test(typeName);
  const vProp = valueProp ?? (checkable ? 'checked' : 'value');
  const cProp = changeProp ?? (checkable ? 'onCheckedChange' : 'onValueChange');
  const bound: Record<string, unknown> = mode === 'native'
    ? { ref: bindNative }
    : {
        name,
        [vProp]: controller.field.value,
        [cProp]:
          (v: unknown, details?: unknown) => controller.field.onChange(v),
        onBlur: controller.field.onBlur,
      };
  const ctl = React.cloneElement(control, bound);
  const message = error ?? rhfError;

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const boundInput = React.useRef<HTMLInputElement | null>(null);
  const fieldRef = controller.field.ref;
  React.useLayoutEffect(() => {
    if (mode !== 'controller' || !rootRef.current) return;
    const candidates = Array.from(rootRef.current.querySelectorAll<HTMLInputElement>('input[name]'))
      .filter((el) => el.name === name);
    const input = candidates.find((el) => el.getAttribute('aria-hidden') === 'true') ?? candidates[0] ?? null;
    if (input && input !== boundInput.current) {
      boundInput.current = input;
      fieldRef(input);
    }
  });

  return (
    <Field.Root ref={rootRef} name={name} invalid={invalid} disabled={disabled ?? false}>
      {label != null ? <Field.Label>{label}</Field.Label> : null}
      {ctl}
      {/* RHF owns validity here, so the error always matches when present
          (Base Field.Error otherwise waits for native constraint validity). */}
      {message ? <Field.Error match={true}>{message}</Field.Error> : null}
    </Field.Root>
  );
}
