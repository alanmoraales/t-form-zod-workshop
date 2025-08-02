export enum SubscriptionType {
  free = "free",
  premium = "premium",
}

export interface FreeSubscription {
  type: SubscriptionType.free;
}

export enum PaymentFrequency {
  monthly = "monthly",
  yearly = "yearly",
}

export interface PremiumSubscription {
  type: SubscriptionType.premium;
  paymentFrequency: PaymentFrequency;
}

export type UserSubscription = FreeSubscription | PremiumSubscription;
