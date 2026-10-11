/* GlassPage — 4.x `aura-glass/app-shell` compat adapter (REQ-SURF-13,
   DEP-S0037) → CMP Container (PRD-4 §7 shell row). constrained (default true)
   keeps the 4.x max-w-7xl bound as Container size="xl"; constrained={false}
   is size="full". */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Container } from '../../../components/container';
import { domProps } from '../_shared';

export interface GlassPageProps {
  constrained?: boolean;
  children?: React.ReactNode;
  [legacy: string]: unknown;
}

/**
 * 4.x `GlassPage` compat adapter (DEP-S0037).
 * @deprecated since 4.3.0, removed in 5.0.0. Use {@link Container from aura-glass}.
 */
export function GlassPage(props: GlassPageProps) {
  warnDeprecated('DEP-S0037');
  const { constrained = true, children, ...rest } = props;
  return (
    <Container size={constrained ? 'xl' : 'full'} {...domProps(rest)}>
      {children}
    </Container>
  );
}
