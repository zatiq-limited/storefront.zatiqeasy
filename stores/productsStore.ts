import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Types
export interface Product {
  id: number | string;
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
  // Additional fields from API
  category_id?: string;
  category_name?: string;
  sku?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  parent_id?: number | string | null;
  sub_categories?: Category[];
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
  categories: Category[];
  pagination: Pagination | null;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;

  // Products page config
  productsPageConfig: Record<string, unknown> | null;

  // Computed values
  filteredProducts: Product[];
  currentPage: number;
  totalPages: number;
  searchQuery: string;
  sortOption: string;

  // Actions
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setPagination: (pagination: Pagination | null) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setProductsPageConfig: (config: Record<string, unknown>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortOption: (option: string) => void;
  setCurrentPage: (page: number) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
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
    (set, get) => ({
      products: [],
      categories: [],
      pagination: null,
      filters: initialFilters,
      isLoading: false,
      error: null,
      productsPageConfig: null,

      // Computed values
      get filteredProducts() {
        const { products, filters, searchQuery, sortOption } = get();
        let filtered = products;

        // Apply search filter
        if (searchQuery) {
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply category filter
        if (filters.category) {
          filtered = filtered.filter(product =>
            product.category_id === filters.category?.toString()
          );
        }

        // Apply sorting
        switch (sortOption) {
          case 'price-asc':
            filtered = [...filtered].sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filtered = [...filtered].sort((a, b) => b.price - a.price);
            break;
          case 'name-asc':
            filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
            break;
          default:
            // Keep original order for 'newest'
            break;
        }

        return filtered;
      },

      get currentPage() {
        return get().filters.page;
      },

      get totalPages() {
        const { filteredProducts, filters } = get();
        return Math.ceil(filteredProducts.length / filters.limit);
      },

      get searchQuery() {
        return get().filters.search || '';
      },

      get sortOption() {
        return get().filters.sort;
      },

      // Actions
      setProducts: (products) => set({ products }),
      setCategories: (categories) => set({ categories }),
      setPagination: (pagination) => set({ pagination }),
      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),
      setProductsPageConfig: (config) => set({ productsPageConfig: config }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setSearchQuery: (query) =>
        set((state) => ({
          filters: { ...state.filters, search: query, page: 1 }
        })),
      setSortOption: (option) =>
        set((state) => ({
          filters: { ...state.filters, sort: option, page: 1 }
        })),
      setCurrentPage: (page) =>
        set((state) => ({
          filters: { ...state.filters, page }
        })),
      getProductById: (id) => {
        const { products } = get();
        return products.find(p => String(p.id) === id);
      },
      getProductsByCategory: (categoryId) => {
        const { products } = get();
        return products.filter(p => p.category_id === categoryId);
      },
      reset: () =>
        set({
          products: [],
          categories: [],
          pagination: null,
          filters: initialFilters,
          isLoading: false,
          error: null,
        }),
    }),
    { name: "products-store" }
  )
);
