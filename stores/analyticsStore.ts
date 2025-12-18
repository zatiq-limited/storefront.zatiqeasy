import { create } from 'zustand';

interface AnalyticsState {
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

interface AnalyticsActions {
  setPixelConfig: (config: {
    pixelId?: string;
    accessToken?: string;
    hasAccess?: boolean;
  }) => void;
  setGTMConfig: (config: { gtmId?: string; hasAccess?: boolean }) => void;
  setTikTokConfig: (config: { pixelId?: string; hasAccess?: boolean }) => void;
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
  reset: () => void;
}

const initialState: AnalyticsState = {
  pixelId: null,
  pixelAccessToken: null,
  hasPixelAccess: false,
  gtmId: null,
  hasGTMAccess: false,
  tiktokPixelId: null,
  hasTikTokAccess: false,
  analyticsId: null,
  visitorId: null,
};

export const useAnalyticsStore = create<AnalyticsState & AnalyticsActions>(
  (set) => ({
    ...initialState,

    setPixelConfig: (config) =>
      set({
        pixelId: config.pixelId ?? null,
        pixelAccessToken: config.accessToken ?? null,
        hasPixelAccess: config.hasAccess ?? false,
      }),

    setGTMConfig: (config) =>
      set({
        gtmId: config.gtmId ?? null,
        hasGTMAccess: config.hasAccess ?? false,
      }),

    setTikTokConfig: (config) =>
      set({
        tiktokPixelId: config.pixelId ?? null,
        hasTikTokAccess: config.hasAccess ?? false,
      }),

    setAnalyticsId: (id) => set({ analyticsId: id }),

    setVisitorId: (id) => set({ visitorId: id }),

    initializeFromShop: (shopDetails) =>
      set({
        pixelId: shopDetails.pixel_id ?? null,
        pixelAccessToken: shopDetails.pixel_access_token ?? null,
        hasPixelAccess: shopDetails.hasPixelAccess ?? false,
        gtmId: shopDetails.gtm_id ?? null,
        hasGTMAccess: shopDetails.hasGTMAccess ?? false,
        tiktokPixelId: shopDetails.tiktok_pixel_id ?? null,
        hasTikTokAccess: shopDetails.hasTikTokPixelAccess ?? false,
        analyticsId: shopDetails.analytics_id ?? null,
      }),

    reset: () => set(initialState),
  })
);

// Selectors
export const selectHasPixelAccess = (state: AnalyticsState & AnalyticsActions) =>
  state.hasPixelAccess && !!state.pixelId;

export const selectHasGTMAccess = (state: AnalyticsState & AnalyticsActions) =>
  state.hasGTMAccess && !!state.gtmId;

export const selectHasTikTokAccess = (state: AnalyticsState & AnalyticsActions) =>
  state.hasTikTokAccess && !!state.tiktokPixelId;

export const selectAllAnalyticsConfig = (state: AnalyticsState & AnalyticsActions) => ({
  pixel: {
    id: state.pixelId,
    accessToken: state.pixelAccessToken,
    hasAccess: state.hasPixelAccess,
  },
  gtm: {
    id: state.gtmId,
    hasAccess: state.hasGTMAccess,
  },
  tiktok: {
    id: state.tiktokPixelId,
    hasAccess: state.hasTikTokAccess,
  },
  zatiq: {
    id: state.analyticsId,
  },
});
