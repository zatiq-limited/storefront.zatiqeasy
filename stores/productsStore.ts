import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Types
export interface Product {
  id: number;
  name: string;
  product_code?: string;
  slug?: string;
  price: number;
  old_price?: number | null;
  buying_price?: number;
  image_url: string;
  images?: string[];
  quantity: number;
  initial_product_sold?: number;
  inventory_view_count?: number;
  inventory_type?: string;
  unit_name?: string;
  warranty?: string;
  description?: string;
  short_description?: string;
  brand?: string;
  condition?: string;
  video_link?: string | null;
  custom_fields?: Record<string, string>;
  has_variant?: boolean;
  is_stock_manage_by_variant?: boolean;
  image_variant_type_id?: number | null;
  categories?: Array<{ id: number; name: string }>;
  variant_types?: VariantType[];
  stocks?: Stock[];
  review_summary?: ReviewSummary;
  reviews?: Review[];
  related_products?: Product[];
  isApplyDefaultDeliveryCharge?: boolean;
  specific_delivery_charges?: Record<string, number> | null;
  others_delivery_charge?: number | null;
  is_active?: boolean;
  serial?: number;
  shop_id?: number;
  created_at?: string;
  updated_at?: string;
  theme?: ProductTheme;
  // Card display properties
  badge?: string | null;
  rating?: number;
  review_count?: number;
  colors?: string[];
}

export interface VariantType {
  id: number;
  title: string;
  is_mandatory: boolean;
  variants: Variant[];
}

export interface Variant {
  id: number;
  name: string;
  price: number;
  image_url?: string | null;
}

export interface Stock {
  id: number;
  combination: string;
  quantity: number;
  is_active: boolean;
}

export interface ReviewSummary {
  average_rating: number;
  total_reviews: number;
  rating_distribution?: Record<string, number>;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  reviewer_type?: string;
  description: string;
  images?: string[] | null;
  serial?: number;
  inventory_id?: number;
  shop_id?: number;
  created_at?: string;
}

export interface ProductTheme {
  id: number;
  slug: string;
  page_title: string;
  page_description: string;
  theme_name: string;
  theme_data: Record<string, unknown>;
  preview: string;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  from: number;
  to: number;
}

export interface ProductFilters {
  page: number;
  limit: number;
  category: string | null;
  search: string | null;
  sort: string;
}

interface ProductsState {
  // Products list
  products: Product[];
  pagination: Pagination | null;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;

  // Products page config
  productsPageConfig: Record<string, unknown> | null;

  // Actions
  setProducts: (products: Product[]) => void;
  setPagination: (pagination: Pagination | null) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setProductsPageConfig: (config: Record<string, unknown>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialFilters: ProductFilters = {
  page: 1,
  limit: 20,
  category: null,
  search: null,
  sort: "newest",
};

export const useProductsStore = create<ProductsState>()(
  devtools(
    (set) => ({
      products: [],
      pagination: null,
      filters: initialFilters,
      isLoading: false,
      error: null,
      productsPageConfig: null,

      setProducts: (products) => set({ products }),
      setPagination: (pagination) => set({ pagination }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      setProductsPageConfig: (config) => set({ productsPageConfig: config }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () =>
        set({
          products: [],
          pagination: null,
          filters: initialFilters,
          isLoading: false,
          error: null,
        }),
    }),
    { name: "products-store" }
  )
);