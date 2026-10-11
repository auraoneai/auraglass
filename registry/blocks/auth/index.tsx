// registry/blocks/auth — PLAT-358. Sign-in / sign-up / reset flows on the
// CMP field grammar (replaces the 4.x auth recipe surfaces). All data comes
// in by props; the block renders a token-only card inside a container-query
// shell so it adapts without viewport classes.
import { useState } from 'react';
import {
  Button, Card, Link, Separator, Text, TextField,
} from 'aura-glass';

export type AuthFlow = 'sign-in' | 'sign-up' | 'reset';

export interface AuthBlockProps {
  flow?: AuthFlow;
  defaultFlow?: AuthFlow;
  onFlowChange?: (flow: AuthFlow) => void;
  /** Called with the submitted credentials. Async errors surface inline. */
  onSubmit?: (values: { flow: AuthFlow; email: string; password?: string; name?: string }) => void | Promise<void>;
  /** Optional SSO providers rendered above the form. */
  providers?: readonly { id: string; label: string }[];
  onProvider?: (id: string) => void;
  loading?: boolean;
  error?: string;
}

const COPY: Record<AuthFlow, { title: string; action: string; hint: string }> = {
  'sign-in': { title: 'Sign in', action: 'Sign in', hint: 'Use your account email.' },
  'sign-up': { title: 'Create account', action: 'Sign up', hint: 'Start your workspace.' },
  reset: { title: 'Reset password', action: 'Send reset link', hint: 'We email a sign-in link.' },
};

function useControlled<T>(value: T | undefined, fallback: T, onChange?: (v: T) => void): [T, (v: T) => void] {
  const [internal, setInternal] = useState(fallback);
  const current = value ?? internal;
  return [current, (v) => { setInternal(v); onChange?.(v); }];
}

export function AuthBlock({
  flow, defaultFlow = 'sign-in', onFlowChange, onSubmit,
  providers, onProvider, loading = false, error,
}: AuthBlockProps) {
  const [current, setCurrent] = useControlled(flow, defaultFlow, onFlowChange);
  const [localError, setLocalError] = useState<string>();
  const copy = COPY[current];
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    try {
      setLocalError(undefined);
      await onSubmit?.({
        flow: current,
        email: String(data.get('email') ?? ''),
        ...(current === 'reset' ? {} : { password: String(data.get('password') ?? '') }),
        ...(current === 'sign-up' ? { name: String(data.get('name') ?? '') } : {}),
      });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <Card.Root data-ag-part="root" className="@container">
      <Card.Header data-ag-part="header">
        <Card.Title>{copy.title}</Card.Title>
        <Text muted>{copy.hint}</Text>
      </Card.Header>
      <Card.Body data-ag-part="body">
        {providers?.length ? (
          <div data-ag-part="providers" className="grid gap-2 @sm:grid-cols-2">
            {providers.map((p) => (
              <Button key={p.id} onClick={() => onProvider?.(p.id)} disabled={loading}>
                {p.label}
              </Button>
            ))}
            <div data-ag-part="providers-separator" className="grid items-center gap-2">
              <Separator decorative />
              <Text size="sm" muted>or</Text>
            </div>
          </div>
        ) : null}
        <form data-ag-part="form" onSubmit={submit} className="grid gap-4">
          {current === 'sign-up' ? <TextField label="Name" name="name" autoComplete="name" required /> : null}
          <TextField label="Email" name="email" type="email" autoComplete="email" placeholder="user@example.com" required />
          {current !== 'reset' ? (
            <TextField label="Password" name="password" type="password"
              autoComplete={current === 'sign-in' ? 'current-password' : 'new-password'} required />
          ) : null}
          {error || localError ? <Text intent="danger" size="sm">{error ?? localError}</Text> : null}
          <Button data-ag-part="submit" type="submit" variant="identity" loading={loading}>
            {copy.action}
          </Button>
        </form>
      </Card.Body>
      <Card.Footer data-ag-part="footer">
        {current === 'sign-in' ? (
          <>
            <Link href="#" onClick={(e) => { e.preventDefault(); setCurrent('reset'); }}>Forgot password?</Link>
            <Link href="#" onClick={(e) => { e.preventDefault(); setCurrent('sign-up'); }}>Create account</Link>
          </>
        ) : (
          <Link href="#" onClick={(e) => { e.preventDefault(); setCurrent('sign-in'); }}>Back to sign in</Link>
        )}
      </Card.Footer>
    </Card.Root>
  );
}
