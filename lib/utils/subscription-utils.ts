import type { ShopProfile } from "@/types/shop.types";

/**
 * Check if shop has active subscription access (either trial or paid)
 */
export const hasSubscriptionAccess = (shop: ShopProfile | null | undefined): boolean => {
  if (!shop) return false;

  if (isTrail(shop)) {
    return true;
  }

  if (isSubscribed(shop)) {
    return true;
  }

  return false;
};

/**
 * Check if shop has premium access (subscribed with plan_id < 3)
 */
export const hasPremiumAccess = (shop: ShopProfile | null | undefined): boolean => {
  if (!shop) return false;

  if (isSubscribed(shop) && shop?.subscription?.easybill?.plan_id !== undefined && shop.subscription.easybill.plan_id < 3) {
    return true;
  }
  return false;
};

/**
 * Check if shop has an active paid subscription
 */
export const isSubscribed = (shop: ShopProfile | null | undefined): boolean => {
  if (!shop) return false;

  if (subscriptionLeft(shop) > 0) {
    return true;
  }

  return false;
};

/**
 * Check if shop is still in trial period
 */
export const isTrail = (shop: ShopProfile | null | undefined): boolean => {
  if (!shop) return false;

  if (trailLeft(shop) > 0) {
    return true;
  }
  return false;
};

/**
 * Calculate days left in trial period
 */
export const trailLeft = (shop: ShopProfile | null | undefined): number => {
  if (!shop?.created_at) return 0;

  const trialEndAt = new Date(shop.created_at);
  trialEndAt.setHours(0, 0, 0, 0);
  trialEndAt.setDate(trialEndAt.getDate() + trialDuration(shop));

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const differenceInTime = trialEndAt.getTime() - currentDate.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  if (differenceInDays >= 0) {
    return differenceInDays;
  }
  return 0;
};

/**
 * Calculate days left in subscription
 */
export const subscriptionLeft = (shop: ShopProfile | null | undefined): number => {
  if (!shop?.subscription?.easybill?.end_date) {
    return -1000;
  }

  const subscriptionEndAt = new Date(shop.subscription.easybill.end_date);
  subscriptionEndAt.setHours(0, 0, 0, 0);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const differenceInTime = subscriptionEndAt.getTime() - currentDate.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  return differenceInDays;
};

/**
 * Calculate how many days the shop has been active
 */
export const activeDays = (shop: ShopProfile | null | undefined): number => {
  if (!shop?.created_at) return 0;

  const createdAt = new Date(shop.created_at);
  createdAt.setHours(0, 0, 0, 0);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const differenceInTime = currentDate.getTime() - createdAt.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  return differenceInDays;
};

/**
 * Get trial duration based on country
 */
export const trialDuration = (shop: ShopProfile | null | undefined): number => {
  if (shop?.country_code !== "BD") {
    return 7;
  }
  return 3;
};

/**
 * Calculate days left until a given date
 */
export const daysLeft = (date: string | null | undefined): number => {
  if (!date) {
    return -1000;
  }

  const endsAt = new Date(date);
  endsAt.setHours(0, 0, 0, 0);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const differenceInTime = endsAt.getTime() - currentDate.getTime();
  const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));

  return differenceInDays;
};
