import CryptoJS from "crypto-js";

// Encryption key from environment
const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "b3817f6f8bb8e5ed1c16c4c578f9ed8e";

// Generate IV from SHA256 hash of empty string (matching old project)
const getEncryptionIV = (): string => {
  const hash = CryptoJS.SHA256("");
  const hashedIv = hash.toString(CryptoJS.enc.Hex);
  return hashedIv.slice(0, 16);
};

/**
 * Encrypt data using AES with IV (matching old project implementation)
 * @param plainData - The data to encrypt (can be object or primitive)
 * @returns Encrypted string
 */
export const encryptData = (plainData: unknown): string => {
  try {
    const iv = getEncryptionIV();
    const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
    const ivParsed = CryptoJS.enc.Utf8.parse(iv);

    // Convert to base64 first (matching old project)
    const jsonString = JSON.stringify(plainData);
    const base64Data = btoa(jsonString);

    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Base64.parse(base64Data),
      key,
      { iv: ivParsed }
    );

    return encrypted.toString();
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt data");
  }
};

/**
 * Decrypt data using AES with IV (matching old project implementation)
 * @param encryptedData - The encrypted string to decrypt
 * @returns Decrypted data (parsed JSON)
 */
export const decryptData = (encryptedData: string): unknown => {
  try {
    const iv = getEncryptionIV();
    const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
    const ivParsed = CryptoJS.enc.Utf8.parse(iv);

    const decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(encryptedData),
      } as CryptoJS.lib.CipherParams,
      key,
      { iv: ivParsed }
    );

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error("Invalid encrypted data or key");
    }

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Failed to decrypt data");
  }
};

/**
 * Create encrypted payload for API requests (matching old project structure)
 */
export const createEncryptedPayload = (data: unknown) => {
  return {
    payload: encryptData(data),
  };
};

/**
 * Decrypt API response (matching old project structure)
 * Old project receives encrypted string directly in response.data
 */
export const decryptApiResponse = (response: unknown) => {
  // Response.data is the encrypted string from the server
  if (typeof response === "string") {
    return decryptData(response);
  }
  // If already decrypted or not encrypted
  return response;
};
