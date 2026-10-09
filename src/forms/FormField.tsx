'use client';
/* REQ-CMP-31 — FormField: binds a react-hook-form field to an AuraGlass
   control through Field.Root invalid state + Field.Error.

   - mode="native" (TextField/NumberField/SearchField): the control's `ref`
     prop resolves to the inner input — RHF registers it (register()-style).
   - mode="controller" (Switch/Checkbox/Select/Combobox): bound via RHF
     Controller — value/checked + onValueChange/onCheckedChange forward to
     field.value/onChange; `name` on the hidden input submits the value. */
import * as React from 'react';
import { useFormField } from './useFormField';
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
}

export function FormField({ name, mode = 'native', control, label, error, valueProp, changeProp, disabled }: FormFieldProps) {
  const { bindNative, controller, invalid, error: rhfError } = useFormField(name);
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
  return (
    <Field.Root name={name} invalid={invalid} disabled={disabled}>
      {label != null ? <Field.Label>{label}</Field.Label> : null}
      {ctl}
      {message ? <Field.Error>{message}</Field.Error> : null}
    </Field.Root>
  );
}
