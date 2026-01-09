/**
 * Product Cards Registry
 * Maps card type strings to their components for dynamic rendering
 */

import type { ComponentType } from "react";
import ProductCard1 from "./product-card-1";
import ProductCard2 from "./product-card-2";
import ProductCard3 from "./product-card-3";
import ProductCard4 from "./product-card-4";
import ProductCard5 from "./product-card-5";
import ProductCard6 from "./product-card-6";
import ProductCard7 from "./product-card-7";
import ProductCard8 from "./product-card-8";
import ProductCard9 from "./product-card-9";
import ProductCard10 from "./product-card-10";
import ProductCard11 from "./product-card-11";
import ProductCard12 from "./product-card-12";
import ProductCard13 from "./product-card-13";
import ProductCard14 from "./product-card-14";
import ProductCard15 from "./product-card-15";
import ProductCard16 from "./product-card-16";

// Base props all product cards share
export interface ProductCardBaseProps {
  id: number | string;
  handle: string;
  title: string;
  vendor?: string;
  price: number;
  comparePrice?: number;
  image: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

// Extended props for cards that need additional data
export interface ProductCardExtendedProps extends ProductCardBaseProps {
  subtitle?: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  colors?: string[];
}

// Card component type that accepts extended props
type ProductCardComponent = ComponentType<ProductCardExtendedProps>;

// Registry mapping card types to components
export const PRODUCT_CARD_REGISTRY: Record<string, ProductCardComponent> = {
  "card-1": ProductCard1 as ProductCardComponent,
  "card-2": ProductCard2 as ProductCardComponent,
  "card-3": ProductCard3 as ProductCardComponent,
  "card-4": ProductCard4 as ProductCardComponent,
  "card-5": ProductCard5 as ProductCardComponent,
  "card-6": ProductCard6 as ProductCardComponent,
  "card-7": ProductCard7 as ProductCardComponent,
  "card-8": ProductCard8 as ProductCardComponent,
  "card-9": ProductCard9 as ProductCardComponent,
  "card-10": ProductCard10 as ProductCardComponent,
  "card-11": ProductCard11 as ProductCardComponent,
  "card-12": ProductCard12 as ProductCardComponent,
  "card-13": ProductCard13 as ProductCardComponent,
  "card-14": ProductCard14 as ProductCardComponent,
  "card-15": ProductCard15 as ProductCardComponent,
  "card-16": ProductCard16 as ProductCardComponent,
};

// Default card type
export const DEFAULT_CARD_TYPE = "card-1";

// Get product card component by type
export function getProductCardComponent(
  cardType: string
): ProductCardComponent {
  return PRODUCT_CARD_REGISTRY[cardType] || PRODUCT_CARD_REGISTRY[DEFAULT_CARD_TYPE];
}

// Re-export individual cards for direct imports if needed
export {
  ProductCard1,
  ProductCard2,
  ProductCard3,
  ProductCard4,
  ProductCard5,
  ProductCard6,
  ProductCard7,
  ProductCard8,
  ProductCard9,
  ProductCard10,
  ProductCard11,
  ProductCard12,
  ProductCard13,
  ProductCard14,
  ProductCard15,
  ProductCard16,
};
