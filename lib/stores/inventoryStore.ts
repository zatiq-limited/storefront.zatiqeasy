import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  old_price?: number;
  image_url?: string;
  images?: string[];
  description?: string;
  quantity?: number;
  category_id?: string;
  category_name?: string;
  sku?: string;
  brand_name?: string;
  has_variant?: boolean;
  variant_types?: any[];
}

interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

interface InventoryState {
  // Product data
  products: Product[];
  categories: Category[];

  // Filtering and search
  searchText: string;
  selectedCategory: string | null;
  sortOption: string;
  filteredProducts: Product[];

  // Pagination
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;

  // Loading states
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;

  // Actions
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setSearchText: (text: string) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setSortOption: (option: string) => void;
  setFilters: (filters: Partial<{ searchText: string; selectedCategory: string | null; sortOption: string; currentPage: number }>) => void;
  setCurrentPage: (page: number) => void;
  setIsLoading: (loading: boolean) => void;
  setIsFetching: (fetching: boolean) => void;
  setError: (error: string | null) => void;

  // Getters
  getProductById: (id: string) => Product | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  clearFilters: () => void;
  refreshProducts: () => Promise<void>;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      categories: [],
      searchText: '',
      selectedCategory: null,
      sortOption: '',
      filteredProducts: [],
      currentPage: 1,
      itemsPerPage: 12,
      totalPages: 1,
      isLoading: false,
      isFetching: false,
      error: null,

      // Set products
      setProducts: (products) => {
        set({ products });
        // Re-apply filters
        const { searchText, selectedCategory, sortOption } = get();
        get().setFilters({ searchText, selectedCategory, sortOption });
      },

      // Set categories
      setCategories: (categories) => set({ categories }),

      // Set search text
      setSearchText: (searchText) => {
        set({ searchText, currentPage: 1 });
        get().setFilters({ searchText, selectedCategory: get().selectedCategory, sortOption: get().sortOption });
      },

      // Set selected category
      setSelectedCategory: (selectedCategory) => {
        set({ selectedCategory, currentPage: 1 });
        get().setFilters({ searchText: get().searchText, selectedCategory, sortOption: get().sortOption });
      },

      // Set sort option
      setSortOption: (sortOption) => {
        set({ sortOption, currentPage: 1 });
        get().setFilters({ searchText: get().searchText, selectedCategory: get().selectedCategory, sortOption });
      },

      // Set multiple filters
      setFilters: (filters) => {
        const state = get();
        const { searchText = state.searchText, selectedCategory = state.selectedCategory, sortOption = state.sortOption } = filters;

        let filtered = [...state.products];

        // Apply search filter
        if (searchText.trim()) {
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchText.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchText.toLowerCase())
          );
        }

        // Apply category filter
        if (selectedCategory) {
          filtered = filtered.filter(product =>
            product.category_id === selectedCategory
          );
        }

        // Apply sort
        switch (sortOption) {
          case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
          case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
          default:
            // Default sorting (by id or creation date)
            break;
        }

        // Calculate pagination
        const totalPages = Math.ceil(filtered.length / state.itemsPerPage);

        set({
          searchText,
          selectedCategory,
          sortOption,
          filteredProducts: filtered,
          totalPages,
          currentPage: filters.currentPage || state.currentPage
        });
      },

      // Set current page
      setCurrentPage: (currentPage) => set({ currentPage }),

      // Set loading state
      setIsLoading: (isLoading) => set({ isLoading }),

      // Set fetching state
      setIsFetching: (isFetching) => set({ isFetching }),

      // Set error
      setError: (error) => set({ error }),

      // Get product by ID
      getProductById: (id) => {
        return get().products.find(product => product.id === id);
      },

      // Get category by ID
      getCategoryById: (id) => {
        return get().categories.find(category => category.id === id);
      },

      // Get products by category
      getProductsByCategory: (categoryId) => {
        return get().products.filter(product => product.category_id === categoryId);
      },

      // Clear all filters
      clearFilters: () => {
        set({
          searchText: '',
          selectedCategory: null,
          sortOption: '',
          currentPage: 1,
          filteredProducts: get().products
        });
      },

      // Refresh products (mock API call)
      refreshProducts: async () => {
        const { setIsLoading, setError, setProducts } = get();

        try {
          setIsLoading(true);
          setError(null);

          // Mock API call - replace with actual API
          const response = await fetch('/api/products');
          if (!response.ok) throw new Error('Failed to fetch products');

          const data = await response.json();
          setProducts(data.products || []);
        } catch (error) {
          console.error('Failed to refresh products:', error);
          setError(error instanceof Error ? error.message : 'Failed to load products');
        } finally {
          setIsLoading(false);
        }
      }
    }),
    {
      name: 'inventory-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        searchText: state.searchText,
        selectedCategory: state.selectedCategory,
        sortOption: state.sortOption,
        currentPage: state.currentPage
      }),
      version: 1
    }
  )
);

// Selectors for optimized subscriptions
export const selectProducts = (state: InventoryState) => state.products;
export const selectCategories = (state: InventoryState) => state.categories;
export const selectFilteredProducts = (state: InventoryState) => state.filteredProducts;
export const selectCurrentPage = (state: InventoryState) => state.currentPage;
export const selectTotalPages = (state: InventoryState) => state.totalPages;
export const selectIsLoading = (state: InventoryState) => state.isLoading;

// Computed selectors
export const selectProductsByCategory = (categoryId: string) => (state: InventoryState) =>
  state.products.filter(product => product.category_id === categoryId);

export const selectProductById = (id: string) => (state: InventoryState) =>
  state.products.find(product => product.id === id);

// Mock data for development
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Classic T-Shirt',
    price: 29.99,
    old_price: 39.99,
    image_url: '/products/tshirt.jpg',
    images: ['/products/tshirt-1.jpg', '/products/tshirt-2.jpg'],
    description: 'Comfortable cotton t-shirt perfect for everyday wear',
    quantity: 50,
    category_id: 'cat1',
    category_name: 'Clothing',
    sku: 'TSH001'
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    price: 99.99,
    image_url: '/products/headphones.jpg',
    images: ['/products/headphones-1.jpg', '/products/headphones-2.jpg'],
    description: 'High-quality wireless headphones with noise cancellation',
    quantity: 30,
    category_id: 'cat2',
    category_name: 'Electronics',
    sku: 'WH001'
  },
  {
    id: '3',
    name: 'Running Shoes',
    price: 79.99,
    old_price: 99.99,
    image_url: '/products/shoes.jpg',
    images: ['/products/shoes-1.jpg', '/products/shoes-2.jpg'],
    description: 'Professional running shoes for athletes',
    quantity: 25,
    category_id: 'cat3',
    category_name: 'Footwear',
    sku: 'RS001'
  }
];

export const mockCategories: Category[] = [
  {
    id: 'cat1',
    name: 'Clothing',
    description: 'Fashion and apparel',
    image_url: '/categories/clothing.jpg'
  },
  {
    id: 'cat2',
    name: 'Electronics',
    description: 'Gadgets and devices',
    image_url: '/categories/electronics.jpg'
  },
  {
    id: 'cat3',
    name: 'Footwear',
    description: 'Shoes and sandals',
    image_url: '/categories/footwear.jpg'
  }
];

// Initialize with mock data if empty
if (typeof window !== 'undefined') {
  const state = useInventoryStore.getState();
  if (state.products.length === 0) {
    state.setProducts(mockProducts);
  }
  if (state.categories.length === 0) {
    state.setCategories(mockCategories);
  }
}