/**
 * ========================================
 * ZATIQ STOREFRONT TYPES
 * ========================================
 */

export interface ZatiqTheme {
  id: string;
  name: string;
  version: string;
  globalSections: {
    announcement?: Section;
    header: Section;
    footer: Section;
  };
  templates: Record<string, Template>;
  designSystem: DesignSystem;
}

export interface Template {
  name: string;
  layout: string;
  sections: Section[];
  seo?: SEOConfig;
}

export interface Section {
  id: string;
  type: string;
  enabled?: boolean;
  settings?: Record<string, unknown>;
  blocks?: Block[];
  products?: unknown[];
  posts?: unknown[];
  reviews?: unknown[];
  testimonials?: unknown[];
  tabs?: unknown[];
  breadcrumbs?: Block[];
  sidebar?: unknown;
}

export interface Block {
  id: string;
  type: string;
  settings: Record<string, unknown>;
}

export interface DesignSystem {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    error: string;
    success: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    full: string;
  };
}

export interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  favicon?: string;
  canonical?: string;
  og?: {
    title: string;
    description: string;
    image: string;
    type: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
}

export interface ShopConfig {
  id: string;
  name: string;
  domain: string;
  locale: string;
  currency: {
    code: string;
    symbol: string;
    format: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    pinterest?: string;
  };
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
  category: string | null;
  search: string | null;
  sort: string;
}