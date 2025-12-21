/**
 * Delivery utilities - centralized delivery charge calculations
 * Used across the codebase for consistent delivery logic
 */

/**
 * Dhaka area names for delivery charge calculation
 */
export const DHAKA_AREAS = [
  "dhaka",
  "mirpur",
  "dhanmondi",
  "gulshan",
  "banani",
  "uttara",
  "mohammadpur",
  "farmgate",
  "shahbagh",
  "new market",
  "azampur",
  "kawran bazar",
  "bashundhara",
  "baridhara",
  "badda",
  "khilgaon",
  "malibagh",
  "mogbazar",
  "tejgaon",
] as const;

/**
 * Check if address is inside Dhaka
 */
export function isInsideDhaka(address: string): boolean {
  const addressLower = address.toLowerCase();
  return DHAKA_AREAS.some((area) => addressLower.includes(area));
}

/**
 * Calculate delivery charge based on address
 */
export function calculateDeliveryCharge(
  address: string,
  insideDhakaCharge: number,
  outsideDhakaCharge: number
): number {
  return isInsideDhaka(address) ? insideDhakaCharge : outsideDhakaCharge;
}
