// Storage utilities for phone verification

const VERIFIED_PHONES_KEY = "verified_phones";

interface VerifiedPhone {
  phone: string;
  countryCode: string;
  shopId: number;
  verifiedAt: number;
  expiresAt: number;
}

/**
 * Save a verified phone number to local storage
 */
export const saveVerifiedPhone = async (
  shopId: number,
  phone: string,
  countryCode: string,
  daysValid: number = 30
): Promise<void> => {
  try {
    // Get existing verified phones from storage
    const existingData = localStorage.getItem(VERIFIED_PHONES_KEY);
    let verifiedPhones: VerifiedPhone[] = existingData
      ? JSON.parse(existingData)
      : [];

    // Calculate expiration timestamp
    const now = Date.now();
    const expiresAt = now + daysValid * 24 * 60 * 60 * 1000;

    // Check if this phone is already verified
    const existingIndex = verifiedPhones.findIndex(
      (vp) => vp.shopId === shopId && vp.phone === phone && vp.countryCode === countryCode
    );

    const verifiedPhone: VerifiedPhone = {
      phone,
      countryCode,
      shopId,
      verifiedAt: now,
      expiresAt,
    };

    if (existingIndex !== -1) {
      // Update existing entry
      verifiedPhones[existingIndex] = verifiedPhone;
    } else {
      // Add new entry
      verifiedPhones.push(verifiedPhone);
    }

    // Clean up expired entries
    verifiedPhones = verifiedPhones.filter((vp) => vp.expiresAt > now);

    // Save to localStorage
    localStorage.setItem(VERIFIED_PHONES_KEY, JSON.stringify(verifiedPhones));
  } catch (error) {
    console.error("Error saving verified phone:", error);
    throw error;
  }
};

/**
 * Check if a phone number is verified
 */
export const isPhoneVerified = async (
  shopId: number,
  phone: string
): Promise<boolean> => {
  try {
    // Get verified phones from storage
    const existingData = localStorage.getItem(VERIFIED_PHONES_KEY);
    if (!existingData) {
      return false;
    }

    const verifiedPhones: VerifiedPhone[] = JSON.parse(existingData);
    const now = Date.now();

    // Clean up expired entries
    const validPhones = verifiedPhones.filter((vp) => vp.expiresAt > now);

    // Save cleaned data back to storage
    if (validPhones.length !== verifiedPhones.length) {
      localStorage.setItem(VERIFIED_PHONES_KEY, JSON.stringify(validPhones));
    }

    // Check if phone is verified
    const isVerified = validPhones.some(
      (vp) => vp.shopId === shopId && vp.phone === phone
    );

    return isVerified;
  } catch (error) {
    console.error("Error checking phone verification:", error);
    return false;
  }
};

/**
 * Get verified phone details
 */
export const getVerifiedPhone = async (
  shopId: number,
  phone: string
): Promise<VerifiedPhone | null> => {
  try {
    const existingData = localStorage.getItem(VERIFIED_PHONES_KEY);
    if (!existingData) {
      return null;
    }

    const verifiedPhones: VerifiedPhone[] = JSON.parse(existingData);
    const now = Date.now();

    const verifiedPhone = verifiedPhones.find(
      (vp) => vp.shopId === shopId && vp.phone === phone && vp.expiresAt > now
    );

    return verifiedPhone || null;
  } catch (error) {
    console.error("Error getting verified phone:", error);
    return null;
  }
};

/**
 * Remove a verified phone from storage
 */
export const removeVerifiedPhone = async (
  shopId: number,
  phone: string
): Promise<void> => {
  try {
    const existingData = localStorage.getItem(VERIFIED_PHONES_KEY);
    if (!existingData) {
      return;
    }

    let verifiedPhones: VerifiedPhone[] = JSON.parse(existingData);
    verifiedPhones = verifiedPhones.filter(
      (vp) => !(vp.shopId === shopId && vp.phone === phone)
    );

    localStorage.setItem(VERIFIED_PHONES_KEY, JSON.stringify(verifiedPhones));
  } catch (error) {
    console.error("Error removing verified phone:", error);
    throw error;
  }
};

/**
 * Clear all verified phones for a shop
 */
export const clearShopVerifiedPhones = async (shopId: number): Promise<void> => {
  try {
    const existingData = localStorage.getItem(VERIFIED_PHONES_KEY);
    if (!existingData) {
      return;
    }

    let verifiedPhones: VerifiedPhone[] = JSON.parse(existingData);
    verifiedPhones = verifiedPhones.filter((vp) => vp.shopId !== shopId);

    localStorage.setItem(VERIFIED_PHONES_KEY, JSON.stringify(verifiedPhones));
  } catch (error) {
    console.error("Error clearing shop verified phones:", error);
    throw error;
  }
};