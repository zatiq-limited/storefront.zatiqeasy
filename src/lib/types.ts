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
  enabled: boolean;
  settings: Record<string, any>;
  blocks?: Block[];
}

export interface Block {
  id: string;
  type: string;
  settings: Record<string, any>;
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

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  variants: ProductVariant[];
  tags: string[];
  vendor?: string;
  type?: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  sku?: string;
  available: boolean;
}

export interface Collection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: string;
  products: Product[];
}
