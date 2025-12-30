/**
 * Delivery option types
 */
export const DELIVERY_OPTION = {
  ZONES: "zones",
  DISTRICTS: "districts",
  UPAZILAS: "upazilas",
} as const;

export type DeliveryOption =
  (typeof DELIVERY_OPTION)[keyof typeof DELIVERY_OPTION];
