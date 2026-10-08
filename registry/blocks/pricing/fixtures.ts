// fixtures.ts — deterministic sample data for pricing.
import type { PricingPlan } from './index';

export const plans: PricingPlan[] = [
  { id: 'starter', name: 'Starter', monthlyAmount: 9, yearlyAmount: 90, features: ['1 workspace', '3 seats', 'Community support'] },
  { id: 'team', name: 'Team', monthlyAmount: 29, yearlyAmount: 290, features: ['Unlimited workspaces', '25 seats', 'SSO'], featured: true },
  { id: 'enterprise', name: 'Enterprise', monthlyAmount: 99, yearlyAmount: 990, features: ['SAML + SCIM', 'Audit log', 'Dedicated support'] },
];

export const pricingProps = { plans, locale: 'en-US', currency: 'USD' };
export const pricingPropsDE = { plans, locale: 'de-DE', currency: 'EUR' };
export const pricingPropsJP = { plans, locale: 'ja-JP', currency: 'JPY' };
