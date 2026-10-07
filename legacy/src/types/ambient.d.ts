// Minimal ambient module declarations to satisfy typechecker for missing libs

declare module '@storybook/preview-api' {
  export function useArgs(): any;
}

declare module 'bcryptjs' {
  export function hash(data: string, saltOrRounds?: number | string): Promise<string> | string;
  export function compare(data: string, encrypted: string): Promise<boolean> | boolean;
  export function genSalt(rounds?: number): Promise<string> | string;
}

declare module '*.css';

