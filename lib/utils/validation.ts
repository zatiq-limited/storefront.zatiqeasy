/**
 * Validation utilities - centralized validation functions
 * Used across the codebase for consistent validation
 */

/**
 * Bangladesh phone number regex pattern
 * Matches: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits
 */
export const BD_PHONE_REGEX = /^(01[3-9]\d{8})$/;

/**
 * Validate phone number for Bangladesh
 */
export function validatePhoneNumber(phone: string): boolean {
  return BD_PHONE_REGEX.test(phone);
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `${cleaned.substring(0, 3)}-${cleaned.substring(
      3,
      7
    )}-${cleaned.substring(7)}`;
  }
  return phone;
}
