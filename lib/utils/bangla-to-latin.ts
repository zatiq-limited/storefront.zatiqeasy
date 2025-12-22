/**
 * Convert Bangla digits to Latin/English digits
 * Used for phone number normalization
 */
export const convertBanglaToLatin = (phone: string): string => {
  const banglaToLatinMap: { [key: string]: string } = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };

  return phone.replace(/[০-৯]/g, (match) => banglaToLatinMap[match] || match);
};
