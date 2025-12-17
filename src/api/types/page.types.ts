/**
 * Page-related type definitions
 */

import type { Product, Collection, Pagination, ProductFilters } from './product.types';
import type { Block, SEOConfig, SectionSettings } from './theme.types';

export interface PageData<T = unknown> {
  sections: PageSection[];
  seo?: SEOConfig;
  data?: T;
}

export interface PageSection {
  id: string;
  type: string;
  enabled?: boolean;
  settings?: SectionSettings;
  blocks?: Block[];
  products?: Product[];
  posts?: Post[];
  reviews?: Review[];
  testimonials?: Testimonial[];
  breadcrumbs?: Breadcrumb[];
}

export interface Post {
  id: string;
  handle: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  author?: string;
  publishedAt: string;
  tags?: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title?: string;
  content: string;
  date: string;
  verified?: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  company?: string;
  content: string;
  image?: string;
  rating?: number;
}

export interface Breadcrumb {
  label: string;
  url: string;
}

// Specific page data types
export interface HomepageData extends PageData {
  featuredProducts?: Product[];
  featuredCollections?: Collection[];
}

export interface ProductsPageData extends PageData {
  products: Product[];
  pagination: Pagination;
  filters?: ProductFilters;
  activeFilters?: Record<string, string>;
}

export interface ProductDetailPageData extends PageData {
  product: Product;
  relatedProducts?: Product[];
  reviews?: Review[];
}

export interface CollectionsPageData extends PageData {
  collections: Collection[];
}

export interface CollectionDetailPageData extends PageData {
  collection: Collection;
  products: Product[];
  pagination: Pagination;
}

export interface CheckoutPageData extends PageData {
  paymentMethods?: PaymentMethod[];
  deliveryOptions?: DeliveryOption[];
  delivery_options?: DeliveryOption[];
  payment_methods?: PaymentMethod[];
  order?: unknown;
  currency?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon?: string;
  description?: string;
}

export interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

export interface SearchPageData extends PageData {
  products: Product[];
  query: string;
  pagination: Pagination;
}

// Shop configuration
export interface ShopConfig {
  id: string;
  name: string;
  domain: string;
  locale: string;
  currency: CurrencyConfig;
  contact: ContactInfo;
  social: SocialLinks;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  format: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  pinterest?: string;
  youtube?: string;
  tiktok?: string;
}
