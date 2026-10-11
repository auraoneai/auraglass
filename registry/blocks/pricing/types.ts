// Shared plan model for the pricing block (SURF-591/-592).
export type BillingPeriod = 'monthly' | 'yearly';

export interface PricingPlan {
  id: string;
  name: string;
  monthlyAmount: number;
  yearlyAmount: number;
  features: string[];
  featured?: boolean;
}
