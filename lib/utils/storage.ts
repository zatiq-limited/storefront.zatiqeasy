import localforage from "localforage";

// Cache for store instances per shop
const storeCache = new Map<number, LocalForage>();

// Get or create a localForage instance for a specific shop
const getShopStore = (shopId: number): LocalForage => {
  if (storeCache.has(shopId)) {
    return storeCache.get(shopId)!;
  }

  const store = localforage.createInstance({
    name: "zatiq-easy",
    storeName: `shop_${shopId}_verified_phones`,
    description: `Store for OTP verified phone numbers for shop ${shopId}`,
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
  });

  storeCache.set(shopId, store);
  return store;
};

// Interface for verified phone data
export interface VerifiedPhoneData {
  phone: string;
  countryCode: string;
  shopId: number;
  verifiedAt: number; // timestamp
  expiresAt: number; // timestamp
}

// Key generator for verified phones
const getVerifiedPhoneKey = (phone: string): string => {
  return `phone_${phone}`;
};

/**
 * Save verified phone number to storage
 * @param shopId - Shop ID
 * @param phone - Phone number without country code
 * @param countryCode - Country calling code (e.g., "+880")
 * @param expiryDays - Number of days until verification expires (default: 30 days)
 */
export const saveVerifiedPhone = async (
  shopId: number,
  phone: string,
  countryCode: string,
  expiryDays: number = 30
): Promise<void> => {
  try {
    const now = Date.now();
    const expiresAt = now + expiryDays * 24 * 60 * 60 * 1000;

    const data: VerifiedPhoneData = {
      phone,
      countryCode,
      shopId,
      verifiedAt: now,
      expiresAt,
    };

    const store = getShopStore(shopId);
    const key = getVerifiedPhoneKey(phone);
    await store.setItem(key, data);
  } catch (error) {
    console.error("Error saving verified phone:", error);
    throw error;
  }
};

/**
 * Check if a phone number is verified and not expired
 */
export const getVerifiedPhone = async (
  shopId: number,
  phone: string
): Promise<VerifiedPhoneData | null> => {
  try {
    const store = getShopStore(shopId);
    const key = getVerifiedPhoneKey(phone);
    const data = await store.getItem<VerifiedPhoneData>(key);

    if (!data) {
      return null;
    }

    // Check if verification has expired
    if (Date.now() > data.expiresAt) {
      await removeVerifiedPhone(shopId, phone);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error getting verified phone:", error);
    return null;
  }
};

/**
 * Check if a phone number is currently verified
 */
export const isPhoneVerified = async (
  shopId: number,
  phone: string
): Promise<boolean> => {
  const data = await getVerifiedPhone(shopId, phone);
  return data !== null;
};

/**
 * Remove verified phone from storage
 */
export const removeVerifiedPhone = async (
  shopId: number,
  phone: string
): Promise<void> => {
  try {
    const store = getShopStore(shopId);
    const key = getVerifiedPhoneKey(phone);
    await store.removeItem(key);
  } catch (error) {
    console.error("Error removing verified phone:", error);
    throw error;
  }
};

/**
 * Clear all verified phones for a specific shop
 */
export const clearVerifiedPhonesForShop = async (
  shopId: number
): Promise<void> => {
  try {
    const store = getShopStore(shopId);
    await store.clear();
  } catch (error) {
    console.error("Error clearing verified phones for shop:", error);
    throw error;
  }
};

/**
 * Clear expired verifications across all shops
 * Should be called on app initialization
 */
export const clearExpiredVerifications = async (): Promise<void> => {
  try {
    // Iterate through all cached stores and clear expired entries
    for (const [shopId, store] of storeCache.entries()) {
      const keys = await store.keys();
      for (const key of keys) {
        const data = await store.getItem<VerifiedPhoneData>(key);
        if (data && Date.now() > data.expiresAt) {
          await store.removeItem(key);
        }
      }
    }
  } catch (error) {
    console.error("Error clearing expired verifications:", error);
  }
};
