import CryptoJS from "crypto-js";

/**
 * Decrypt encrypted data from API responses
 * @param encryptedData - Base64 encoded encrypted string
 * @returns Decrypted object
 */
export function decryptData(encryptedData: string): unknown {
  const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";

  // Use crypto-js instead of Node.js crypto (works in browser and server)
  const hashedIv = CryptoJS.SHA256("").toString();
  const ENCRYPTION_IV = hashedIv.slice(0, 16);

  const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Utf8.parse(ENCRYPTION_IV);

  const decrypted = CryptoJS.AES.decrypt(
    {
      ciphertext: CryptoJS.enc.Base64.parse(encryptedData),
    } as CryptoJS.lib.CipherParams,
    key,
    { iv: iv }
  );

  return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
}

/**
 * Encrypt data before sending to API
 * @param plainData - Plain object to encrypt
 * @returns Encrypted base64 string
 */
export function encryptData(plainData: unknown): string {
  const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "";

  // Use crypto-js instead of Node.js crypto (works in browser and server)
  const hashedIv = CryptoJS.SHA256("").toString();
  const ENCRYPTION_IV = hashedIv.slice(0, 16);

  const key = CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY);
  const iv = CryptoJS.enc.Utf8.parse(ENCRYPTION_IV);

  // Convert to base64 using crypto-js (no Buffer dependency)
  const base64Data = CryptoJS.enc.Utf8.parse(JSON.stringify(plainData)).toString(CryptoJS.enc.Base64);

  const encrypted = CryptoJS.AES.encrypt(
    CryptoJS.enc.Base64.parse(base64Data),
    key,
    { iv: iv }
  );

  return encrypted.toString();
}
