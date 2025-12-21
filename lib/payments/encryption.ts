import CryptoJS from 'crypto-js';

// Encryption key from environment
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'b3817f6f8bb8e5ed1c16c4c578f9ed8e';

/**
 * Encrypt data using AES
 */
export const encryptData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data using AES
 */
export const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error('Invalid encrypted data or key');
    }

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Create encrypted payload for API requests
 */
export const createEncryptedPayload = (data: any) => {
  return {
    encrypted: true,
    data: encryptData(data)
  };
};

/**
 * Decrypt API response
 */
export const decryptApiResponse = (response: any) => {
  if (response?.encrypted && response?.data) {
    return decryptData(response.data);
  }
  return response;
};