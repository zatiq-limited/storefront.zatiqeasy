/**
 * Validation utilities - centralized validation functions
 * Used across the codebase for consistent validation
 */

import { parsePhoneNumber, CountryCode } from "libphonenumber-js";
import { convertBanglaToLatin } from "./bangla-to-latin";

/**
 * Bangladesh phone number regex pattern
 * Matches: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits
 */
export const BD_PHONE_REGEX = /^(01[3-9]\d{8})$/;

/**
 * Validate phone number for Bangladesh (simple validation)
 * @deprecated Use validatePhoneNumberWithCountry for international support
 */
export function validatePhoneNumber(phone: string): boolean {
  return BD_PHONE_REGEX.test(phone);
}

/**
 * Validate phone number with country code support using libphonenumber-js
 * Returns true if valid, or an error message string if invalid
 */
export function validatePhoneNumberWithCountry(
  phone: string,
  country: CountryCode
): boolean | string {
  const countryCode = country.length > 2 ? country.slice(1, 3) : country;

  if (phone.length >= 7 && phone.length <= 15) {
    try {
      const normalizedPhoneNumber = convertBanglaToLatin(phone);

      const parsedNumber = parsePhoneNumber(
        normalizedPhoneNumber,
        countryCode as CountryCode
      );

      if (parsedNumber && parsedNumber.isValid()) {
        return true;
      } else {
        return "Invalid phone number for your country";
      }
    } catch {
      return "Invalid phone number format";
    }
  } else {
    return "Phone number must be between 7-15 digits";
  }
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

/**
 * Validate if a string is a valid URL (HTTP/HTTPS)
 * @param url - The URL string to validate
 * @returns true if valid URL, false otherwise
 */
export const isValidURL = (url: string): boolean => {
  const urlRegex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
  return urlRegex.test(url);
};
