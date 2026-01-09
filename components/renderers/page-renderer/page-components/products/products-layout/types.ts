/**
 * Products Layout Types
 */

import type { ProductFilters, Product } from "@/stores/productsStore";

export interface Category {
  id: number | string;
  name: string;
  description?: string;
  image_url?: string;
  parent_id?: number | string | null;
  sub_categories?: Category[];
  products_count?: number;
}

export interface LayoutSettings {
  // Display options
  default_view?: "grid" | "list";
  show_search?: boolean;
  show_sort?: boolean;
  show_view_toggle?: boolean;
  sticky?: boolean;
  columns?: number;
  gap?: number;
  card_type?: string;
  products_per_page?: number;

  // Sidebar options
  show_sidebar?: boolean;
  sidebar_position?: "left" | "right";
  sidebar_type?: string;
  pagination_type?: string;

  // Color customization
  filter_bar_bg_color?: string;
  search_border_color?: string;
  sort_border_color?: string;
  product_count_bg_color?: string;
  product_count_text_color?: string;
  pagination_active_color?: string;
  view_toggle_active_bg_color?: string;
  view_toggle_active_icon_color?: string;
  view_toggle_inactive_bg_color?: string;
  view_toggle_inactive_icon_color?: string;
  card_button_bg_color?: string;
  card_button_text_color?: string;
  sidebar_button_bg_color?: string;
  sidebar_button_text_color?: string;
}

export interface ProductsLayoutProps {
  settings?: LayoutSettings;
  products: Product[];
  categories?: Category[];
  filters: ProductFilters;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  isLoading?: boolean;
}

export interface FilterBarProps {
  showSearch: boolean;
  showSort: boolean;
  showViewToggle: boolean;
  showSidebar: boolean;
  sticky: boolean;
  currentView: "grid" | "list";
  searchValue: string;
  sortValue: string;
  totalProducts: number;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onViewChange: (view: "grid" | "list") => void;
  onOpenMobileSidebar: () => void;
  // Styling
  filterBarBgColor: string;
  searchBorderColor: string;
  sortBorderColor: string;
  productCountBgColor: string;
  productCountTextColor: string;
  viewToggleActiveBgColor: string;
  viewToggleActiveIconColor: string;
  viewToggleInactiveBgColor: string;
  viewToggleInactiveIconColor: string;
}

export interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  resultsCount: number;
  children: React.ReactNode;
}

export interface ProductsGridProps {
  products: Product[];
  cardType: string;
  columns: number;
  gap: number;
  buttonBgColor: string;
  buttonTextColor: string;
}

export interface ProductsListProps {
  products: Product[];
}

export interface PriceRange {
  min: number;
  max: number;
}
