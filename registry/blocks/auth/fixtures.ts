// fixtures.ts — deterministic sample data for the auth block (no clocks,
// no randomness, no network — contract §3.3 block file contract).
import type { AuthBlockProps } from './index';

export const authProviders = [
  { id: 'github', label: 'Continue with GitHub' },
  { id: 'google', label: 'Continue with Google' },
];

export const authProps: AuthBlockProps = {
  defaultFlow: 'sign-in',
  providers: authProviders,
};

export const signUpProps: AuthBlockProps = {
  defaultFlow: 'sign-up',
  providers: authProviders,
};

export const resetProps: AuthBlockProps = {
  defaultFlow: 'reset',
};

export const errorProps: AuthBlockProps = {
  defaultFlow: 'sign-in',
  error: 'Invalid email or password.',
};

export const loadingProps: AuthBlockProps = {
  defaultFlow: 'sign-in',
  loading: true,
};
