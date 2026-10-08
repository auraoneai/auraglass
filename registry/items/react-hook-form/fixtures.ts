// fixtures.ts — deterministic adapter demo state (contract §3.3).
import type { RhfFieldProps } from './index';

export const rhfFieldProps: Omit<RhfFieldProps, 'control'> = {
  name: 'email',
  label: 'Email',
  type: 'email',
  required: true,
  placeholder: 'user@example.com',
  autoComplete: 'email',
  rules: { required: 'Email is required' },
};

/* A minimal control double: adapters accept any RHF control object. */
export const rhfControlDouble = { _formValues: { email: '' } };
