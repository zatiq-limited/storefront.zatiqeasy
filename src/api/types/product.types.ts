/**
 * Product-related type definitions
 */

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  tags: string[];
  vendor?: string;
  type?: string;
  reviewSummary?: ReviewSummary;
  customFields?: Record<string, string>;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  available: boolean;
  inventoryQuantity?: number;
  options?: VariantOption[];
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
}

export interface ProductFilters {
  page?: number;
  perPage?: number;
  category?: string;
  collection?: string;
  sort?: ProductSortKey;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
}

export type ProductSortKey =
  | 'price_asc'
  | 'price_desc'
  | 'title_asc'
  | 'title_desc'
  | 'created_at_desc'
  | 'created_at_asc'
  | 'best_selling';

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: string;
  products?: Product[];
}

export interface CollectionWithProducts {
  collection: Collection;
  products: Product[];
}
