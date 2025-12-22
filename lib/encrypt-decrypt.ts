// Simple encryption/decryption utilities
// In production, implement proper encryption

export const encryptData = (data: any): string => {
  try {
    // For now, use base64 encoding (not secure, just for demo)
    return btoa(JSON.stringify(data));
  } catch (error) {
    console.error("Encryption error:", error);
    return "";
  }
};

export const decryptData = (encryptedData: string): any => {
  try {
    // For now, use base64 decoding
    return JSON.parse(atob(encryptedData));
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedData;
  }
};