import React from 'react';
// Form component types
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: (data: Record<string, any>) => void | Promise<void>;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  defaultValues?: Record<string, any>;
  glassIntensity?: 'subtle' | 'medium' | 'strong' | 'intense';
}

export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined' | 'underlined';
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof FormFieldProps>, FormFieldProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, keyof FormFieldProps>, FormFieldProps {
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  rows?: number;
}

export interface SelectProps extends FormFieldProps {
  options: SelectOption[];
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  placeholder?: string;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: React.ReactNode;
}

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  indeterminate?: boolean;
}

export interface RadioGroupProps extends FormFieldProps {
  options: RadioOption[];
  orientation?: 'horizontal' | 'vertical';
}

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}
