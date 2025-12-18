// Inventory Product
export interface InventoryProduct {
  id: number;
  shop_id: number;
  name: string;
  handle?: string;
  image_url?: string;
  price: number;
  quantity: number;
  old_price: number;
  is_active: boolean;
  has_variant: boolean;
  images?: string[];
  categories: InventoryCategory[];
  variant_types: VariantType[];
  stocks: Stock[];
  is_stock_manage_by_variant: boolean;
  reviews: Review[];
  total_inventory_sold: number;
  video_link?: string;
  description?: string;
  short_description?: string;
  sku?: string;
  weight?: number;
  weight_unit?: string;

  // Delivery charge settings
  isApplyDefaultDeliveryCharge?: boolean;
  specific_delivery_charges?: Record<string, number>;
  others_delivery_charge?: number;

  // SEO
  meta_title?: string;
  meta_description?: string;

  // Timestamps
  created_at?: string;
  updated_at?: string;
}

// Variant Type (e.g., "Size", "Color")
export interface VariantType {
  id: number;
  title: string;
  is_mandatory?: boolean;
  variants: Variant[];
}

// Variant (e.g., "Large", "Red")
export interface Variant {
  id: number;
  name: string;
  price: number;
  image_url?: string;
}

// Stock for variant combinations
export interface Stock {
  id: number;
  combination: string; // e.g., "1-2" for variant IDs
  quantity: number;
  sku?: string;
  price?: number;
}

// Category
export interface InventoryCategory {
  id: string | number;
  parent_id?: number;
  name: string;
  image_url?: string;
  sub_categories?: InventoryCategory[];
  handle?: string;
  description?: string;
}

// Review
export interface Review {
  id: number;
  rating: number;
  comment?: string;
  customer_name?: string;
  customer_image?: string;
  created_at?: string;
  images?: string[];
}

// Product filters
export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: ProductSortOption;
  minPrice?: number;
  maxPrice?: number;
}

export type ProductSortOption =
  | 'newest'
  | 'oldest'
  | 'price_low_to_high'
  | 'price_high_to_low'
  | 'name_a_to_z'
  | 'name_z_to_a'
  | 'best_selling';

// Pagination
export interface Pagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
  has_next: boolean;
  has_prev: boolean;
}

// API Response wrapper
export interface ProductsResponse {
  products: InventoryProduct[];
  pagination: Pagination;
}
