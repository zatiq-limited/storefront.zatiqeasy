import { CartProduct } from "@/types/cart.types";

type DeliveryCalculationParams = {
  selectedDeliveryZone: string;
  shop: any;
  products: CartProduct[];
};

/**
 * Calculate delivery charge based on zone, district, or upazila
 * Takes the maximum delivery charge from products or shop settings
 */
export const calculateDeliveryCharge = ({
  selectedDeliveryZone,
  shop,
  products: receiptItems,
}: DeliveryCalculationParams): number => {
  let charge = 0;

  if (selectedDeliveryZone === "Others") {
    receiptItems?.forEach((item: any) => {
      if (item?.isApplyDefaultDeliveryCharge === false) {
        if (
          item.others_delivery_charge !== null &&
          item.others_delivery_charge !== undefined
        ) {
          charge = Math.max(charge, item.others_delivery_charge * 1);
        } else {
          charge = Math.max(charge, shop?.others_delivery_charge ?? 0);
        }
      } else {
        charge = Math.max(charge, shop?.others_delivery_charge ?? 0);
      }
    });
  } else {
    receiptItems?.forEach((item: any) => {
      if (item?.isApplyDefaultDeliveryCharge === false) {
        if (
          item?.specific_delivery_charges?.[selectedDeliveryZone] !== null &&
          item?.specific_delivery_charges?.[selectedDeliveryZone] !== undefined
        ) {
          charge = Math.max(
            charge,
            item?.specific_delivery_charges?.[selectedDeliveryZone]
          );
        } else if (
          item.others_delivery_charge !== null &&
          item.others_delivery_charge !== undefined
        ) {
          charge = Math.max(charge, item.others_delivery_charge * 1);
        } else if (
          shop?.specific_delivery_charges?.[selectedDeliveryZone] !== null &&
          shop?.specific_delivery_charges?.[selectedDeliveryZone] !== undefined
        ) {
          charge = Math.max(
            charge,
            shop?.specific_delivery_charges?.[selectedDeliveryZone]
          );
        } else {
          charge = Math.max(charge, shop?.others_delivery_charge ?? 0);
        }
      } else {
        if (
          shop?.specific_delivery_charges?.[selectedDeliveryZone] !== null &&
          shop?.specific_delivery_charges?.[selectedDeliveryZone] !== undefined
        ) {
          charge = Math.max(
            charge,
            shop?.specific_delivery_charges?.[selectedDeliveryZone]
          );
        } else {
          charge = Math.max(charge, shop?.others_delivery_charge ?? 0);
        }
      }
    });
  }

  return charge;
};

type DeliveryZoneParams = {
  selectedDistrict: string | null | undefined;
  selectedUpazila: string | null | undefined;
  selectedDeliveryZone: string | null | undefined;
  shop: any;
};

/**
 * Determine the actual delivery zone based on selected location
 * Priority: Upazila > District > Selected Zone > Others
 */
export const getDeliveryZone = ({
  selectedDistrict,
  selectedUpazila,
  selectedDeliveryZone,
  shop,
}: DeliveryZoneParams): string => {
  if (
    selectedDistrict !== null &&
    selectedDistrict !== undefined &&
    selectedDistrict?.trim() !== ""
  ) {
    // Check upazila first
    if (
      selectedUpazila !== null &&
      selectedUpazila !== undefined &&
      selectedUpazila?.trim() !== "" &&
      shop.specific_delivery_charges &&
      shop.specific_delivery_charges[selectedUpazila ?? ""] !== null &&
      shop.specific_delivery_charges[selectedUpazila ?? ""] !== undefined
    ) {
      return selectedUpazila ?? "Others";
    }

    // Check district
    if (
      shop.specific_delivery_charges &&
      shop.specific_delivery_charges[selectedDistrict ?? ""] !== null &&
      shop.specific_delivery_charges[selectedDistrict ?? ""] !== undefined
    ) {
      return selectedDistrict ?? "Others";
    }
    return "Others";
  } else {
    return selectedDeliveryZone ?? "Others";
  }
};

/**
 * Calculate percentage amount
 */
export const getPercentAmount = (
  amount: number,
  percent: number = 0
): number => {
  return Math.floor((amount * percent) / 100);
};

/**
 * Calculate weight-based extra delivery charge
 */
export const calculateWeightBasedCharge = (
  products: CartProduct[],
  weightBasedCharges:
    | Array<{ weight: number; extra_charge: number }>
    | undefined
): number => {
  if (!weightBasedCharges || !Array.isArray(weightBasedCharges)) {
    return 0;
  }

  let totalWeight = 0;
  products?.forEach((item: any) => {
    const itemWeight = parseFloat(item.weight_kg) || 0;
    const itemQty = item.qty || 1;
    totalWeight += itemWeight * itemQty;
  });

  if (totalWeight === 0) {
    return 0;
  }

  const sortedCharges = [...weightBasedCharges].sort(
    (a, b) => b.weight - a.weight
  );
  const applicableCharge = sortedCharges.find(
    (wbc) => totalWeight >= wbc.weight
  );

  return applicableCharge?.extra_charge || 0;
};
