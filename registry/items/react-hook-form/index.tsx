// registry/items/react-hook-form — PLAT-366. Adapter binding CMP Field +
// TextField to react-hook-form's Controller grammar. The dep is
// consumer-installed; import it lazily so the module graph still builds
// without it (the adapter is only meaningful once installed).
import { useEffect, useState } from 'react';
import { Field, TextField } from 'aura-glass';
import type { ReactNode } from 'react';

export interface RHFAdapter {
  Controller: React.ComponentType<{
    name: string; control: unknown; rules?: Record<string, unknown>;
    render: (args: { field: { value: unknown; onChange: (v: unknown) => void; onBlur: () => void; ref: unknown }; fieldState: { error?: { message?: string } } }) => ReactNode;
  }>;
}

export interface RhfFieldProps {
  name: string;
  control: unknown;
  label: ReactNode;
  rules?: Record<string, unknown>;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  /** Pre-loaded react-hook-form module for tests/doubles. */
  rhf?: RHFAdapter;
}

const RHF_SPECIFIER = 'react-hook-form';
let cached: RHFAdapter | null = null;
export function useRhf(injected?: RHFAdapter): RHFAdapter | null {
  const [mod, setMod] = useState<RHFAdapter | null>(injected ?? cached);
  useEffect(() => {
    if (injected || mod) return;
    let live = true;
    import(/* @vite-ignore */ RHF_SPECIFIER).then((m) => { if (live) { cached = m as RHFAdapter; setMod(cached); } }).catch(() => {});
    return () => { live = false; };
  }, [injected, mod]);
  return mod;
}

/** Field bound through RHF Controller → CMP Field + TextField. */
export function RhfTextField({ name, control, label, rules, type, required, placeholder, autoComplete, rhf: injected }: RhfFieldProps) {
  const rhf = useRhf(injected);
  if (!rhf || !control) {
    /* Engine not installed yet — render the field uncontrolled so the form
       still displays (submit handlers just get the DOM value). */
    return <TextField label={label} name={name} type={type} required={required} placeholder={placeholder} autoComplete={autoComplete} />;
  }
  const { Controller } = rhf;
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <Field.Root invalid={!!fieldState.error}>
          <Field.Label>{label}</Field.Label>
          <Field.Control>
            <TextField
              name={field.name ?? name}
              type={type}
              required={required}
              placeholder={placeholder}
              autoComplete={autoComplete}
              value={field.value == null ? '' : String(field.value)}
              onValueChange={(v) => field.onChange(v)}
              invalid={!!fieldState.error}
            />
          </Field.Control>
          {fieldState.error?.message ? <Field.Error>{fieldState.error.message}</Field.Error> : null}
        </Field.Root>
      )}
    />
  );
}
