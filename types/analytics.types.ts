// Analytics state for Zustand store
export interface AnalyticsState {
  // Facebook Pixel
  pixelId: string | null;
  pixelAccessToken: string | null;
  hasPixelAccess: boolean;

  // Google Tag Manager
  gtmId: string | null;
  hasGTMAccess: boolean;

  // TikTok Pixel
  tiktokPixelId: string | null;
  hasTikTokAccess: boolean;

  // Zatiq Analytics
  analyticsId: string | null;

  // Visitor tracking
  visitorId: string | null;
}

// Analytics actions
export interface AnalyticsActions {
  setPixelConfig: (config: {
    pixelId?: string;
    accessToken?: string;
    hasAccess?: boolean;
  }) => void;
  setGTMConfig: (config: {
    gtmId?: string;
    hasAccess?: boolean;
  }) => void;
  setTikTokConfig: (config: {
    pixelId?: string;
    hasAccess?: boolean;
  }) => void;
  setAnalyticsId: (id: string | null) => void;
  setVisitorId: (id: string | null) => void;
  initializeFromShop: (shopDetails: {
    pixel_id?: string;
    pixel_access_token?: string;
    hasPixelAccess?: boolean;
    gtm_id?: string;
    hasGTMAccess?: boolean;
    tiktok_pixel_id?: string;
    hasTikTokPixelAccess?: boolean;
    analytics_id?: string;
  }) => void;
}

// Facebook Pixel Events
export interface FBPixelViewContentParams {
  content_name: string;
  content_ids: string[];
  content_type: 'product' | 'product_group';
  value: number;
  currency: string;
}

export interface FBPixelAddToCartParams {
  content_name: string;
  content_ids: string[];
  content_type: 'product';
  value: number;
  currency: string;
  num_items?: number;
}

export interface FBPixelInitiateCheckoutParams {
  content_ids: string[];
  content_type: 'product';
  value: number;
  currency: string;
  num_items: number;
}

export interface FBPixelPurchaseParams {
  content_ids: string[];
  content_type: 'product';
  value: number;
  currency: string;
  num_items: number;
  order_id?: string;
}

// TikTok Pixel Events
export interface TikTokViewContentParams {
  content_id: string;
  content_type: 'product';
  content_name: string;
  price: number;
  currency: string;
}

export interface TikTokAddToCartParams {
  content_id: string;
  content_type: 'product';
  content_name: string;
  price: number;
  currency: string;
  quantity: number;
}

export interface TikTokCheckoutParams {
  content_ids: string[];
  content_type: 'product';
  value: number;
  currency: string;
  quantity: number;
}

export interface TikTokPurchaseParams {
  content_ids: string[];
  content_type: 'product';
  value: number;
  currency: string;
  quantity: number;
}

// GTM Data Layer
export interface GTMDataLayerEvent {
  event: string;
  ecommerce?: {
    currency?: string;
    value?: number;
    items?: GTMProduct[];
  };
  [key: string]: unknown;
}

export interface GTMProduct {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_category?: string;
  item_variant?: string;
}
