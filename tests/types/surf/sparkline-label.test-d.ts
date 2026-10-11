/* REQ-SURF-91: Sparkline `label` is required unless `aria-hidden` (tsc-only
 * assertions — never executed; run by the SURF type-test job). Uses
 * createElement because the SURF type-test config includes *.ts only. */
import { createElement } from 'react';
import { Sparkline } from '../../../src/data/sparkline/Sparkline';
import type { SparklineProps } from '../../../src/data/sparkline/Sparkline';

// @ts-expect-error label is required when the sparkline is not aria-hidden
const unnamed = createElement(Sparkline, { data: [1] });
// @ts-expect-error aria-hidden={false} still needs a label
const unnamedVisible = createElement(Sparkline, { data: [1], 'aria-hidden': false });

const named = createElement(Sparkline, { data: [1], label: 'Weekly signups' });
const decorative = createElement(Sparkline, { data: [1], 'aria-hidden': true });
const both = createElement(Sparkline, { data: [1], label: 'Trend', 'aria-hidden': true });

const p1: SparklineProps = { data: [1, null, 3], label: 'T' };
const p2: SparklineProps = { data: [], 'aria-hidden': true };
// @ts-expect-error object form: label missing and not aria-hidden
const p3: SparklineProps = { data: [1] };

void [unnamed, unnamedVisible, named, decorative, both, p1, p2, p3];
