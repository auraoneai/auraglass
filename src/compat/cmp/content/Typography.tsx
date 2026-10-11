/* CMP-111 compat: Typography (4.x) -> Text (5.0).
   warnDeprecated fires at call time, once per page load per symbol. The 4.x
   variant names map onto 5.0 type roles; unmappable variants warn once and
   fall back to 'body'. */
import * as React from 'react';
import { warnDeprecated } from '../../../internal';
import { Text } from '../../../components/text/Text';
import type { TextProps } from '../../../components/text/Text';

const DEP = 'DEP-C0265';

const VARIANT_TO_TYPE: Record<string, TextProps['type']> = {
  body: 'body',
  body1: 'body',
  body2: 'callout',
  caption: 'caption',
  callout: 'callout',
  label: 'label',
  overline: 'label',
  mono: 'mono',
  code: 'mono',
};

export interface TypographyProps extends Omit<TextProps, 'type'> {
  variant?: string | undefined;
}

export function Typography({ variant, ...rest }: TypographyProps) {
  warnDeprecated(DEP);
  const type = (variant !== undefined ? VARIANT_TO_TYPE[variant] : undefined) ?? 'body';
  return <Text type={type} {...rest} />;
}
