import type { InventoryProduct } from './inventory.types';
import type { Section } from '@/lib/types';

// Landing page theme names
export enum SingleProductTheme {
  Arcadia = 'Arcadia',
  Nirvana = 'Nirvana',
  Grip = 'Grip',
  BlockBased = 'BlockBased', // For block-based landing pages
}

// Content types for banners
export enum ContentType {
  TOP = 'TOP',
  FEATURED = 'FEATURED',
  SHOWCASE = 'SHOWCASE',
  STANDALONE = 'STANDALONE',
  TEXT = 'TEXT',
  TEXTONLY = 'TEXTONLY',
  IMAGE_BANNER = 'IMAGE_BANNER',
}

// Product video types
export enum ProductVideoType {
  TOP = 'TOP',
  FEATURED = 'FEATURED',
}

// Product image types
export enum ProductImageType {
  SIMPLE = 'SIMPLE',
}

// Feature types
export enum FeatureType {
  SIMPLE = 'SIMPLE',
}

// Banner/Content interface
export interface ContentInterface {
  image_url: string | null;
  title: string | null;
  tag: string | null;
  subtitle: string | null;
  type: ContentType | string;
  description: string | null;
  button_text: string | null;
  link: string | null;
}

// Product video configuration
export interface ProductVideoInterface {
  video_url: string;
  type: ProductVideoType | string;
  title: string | null;
  description: string | null;
  button_text: string | null;
  link: string | null;
}

// Product images configuration
export interface ProductImageInterface {
  title: string | null;
  type: ProductImageType | string;
  content: string[]; // Array of image URLs
}

// Feature sections
export interface FeatureInterface {
  title: string | null;
  subtitle: string | null;
  type: FeatureType | string;
  content: ContentInterface[];
}

// Theme color configuration
export interface ThemeColorConfig {
  primary_color: string;
  secondary_color: string;
}

// Main theme data interface
export interface SingleProductThemeData {
  theme_name?: SingleProductTheme;
  show_product_details?: boolean;
  banners: ContentInterface[] | null;
  color?: ThemeColorConfig;
  features?: FeatureInterface[] | null;
  product_videos: ProductVideoInterface[] | null;
  product_image: ProductImageInterface | null;
  message_on_top?: string;
}

// Single product page (landing page)
export interface SingleProductPage {
  id: number;
  page_title: string;
  page_description: string;
  slug: string;
  theme_name: SingleProductTheme | string;
  theme_data: SingleProductThemeData[];
  inventory: InventoryProduct;
  shop_id: number;
  // For block-based landing pages
  sections?: Section[];
}

// Helper to check if landing page is block-based
export function isBlockBasedLandingPage(page: SingleProductPage): boolean {
  return (
    page.theme_name === SingleProductTheme.BlockBased ||
    (Array.isArray(page.sections) && page.sections.length > 0)
  );
}

// Landing page props
export interface SingleProductPageProps {
  single_product_page: SingleProductPage;
  divisions?: DivisionData[];
  districts?: Record<string, DistrictData[]>;
  upazilas?: Record<string, Record<string, UpazilaData[]>>;
}

// Simplified location data for landing pages
export interface DivisionData {
  id: number;
  name: string;
  bn_name: string;
}

export interface DistrictData {
  id: number;
  name: string;
  bn_name: string;
}

export interface UpazilaData {
  id: number;
  name: string;
  bn_name: string;
}

// Theme constraints (for admin builder validation)
export interface ThemeConstraints {
  banners?: {
    TOP?: { max: number; ratio?: number };
    FEATURED?: { max: number };
    SHOWCASE?: { max: number };
    STANDALONE?: { max: number };
    TEXT?: { max: number };
    TEXTONLY?: { max: number };
    IMAGE_BANNER?: { max: number };
  };
  product_videos?: {
    TOP?: { max: number };
    FEATURED?: { max: number };
  };
  product_image?: {
    SIMPLE?: { max: number };
  };
  features?: {
    SIMPLE?: { max: number };
  };
}

// Landing page store state
export interface LandingPageState {
  pageData: SingleProductPage | null;
  primaryColor: string;
  secondaryColor: string;
}

// Landing page store actions
export interface LandingPageActions {
  setPageData: (data: SingleProductPage) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  reset: () => void;
}
