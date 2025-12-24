import type { InventoryProduct, InventoryCategory } from "./inventory.types";

// Shop Profile
export interface ShopProfile {
  id: number;
  shop_uuid: string;
  shop_name: string;
  shop_email?: string;
  shop_phone: string;
  image_url?: string;
  favicon_url?: string;
  address: string;
  details?: string;
  vat_tax: number;
  specific_delivery_charges: Record<string, number>;
  others_delivery_charge: number;
  payment_methods?: string[];
  country_code: string;
  country_currency: string;
  currency_code?: string;
  shopCurrencySymbol?: string;
  baseUrl: string;
  baseFullUrl: string;
  shop_theme: ShopTheme;
  theme_color?: ThemeColor;

  // Analytics
  hasPixelAccess?: boolean;
  pixel_id?: string;
  pixel_access_token?: string;
  hasGTMAccess?: boolean;
  gtm_id?: string;
  hasTikTokPixelAccess?: boolean;
  tiktok_pixel_id?: string;
  analytics_id?: string;

  // Settings
  default_language_code?: string;
  delivery_option?: string;
  message_on_top?: string;
  order_verification_enabled?: boolean;
  advance_payment_type?: "fixed" | "percentage";
  advanced_payment_fixed_amount?: number;
  advanced_payment_percentage?: number;
  is_delivery_charge_not_refundable?: boolean;

  // Self MFS
  self_mfs?: {
    mfs_provider?: string;
    mfs_number?: string;
    qr_code?: string;
  };

  // Metadata
  metadata?: {
    settings?: {
      shop_settings?: {
        show_email_for_place_order?: boolean;
        enable_promo_code_for_place_order?: boolean;
      };
      delivery_support?: {
        zone_cod_enabled?: Record<string, boolean>;
        default_cod_enabled?: boolean;
        weight_based_charges?: Array<{
          weight: number;
          extra_charge: number;
        }>;
      };
    };
  };

  // Payment custom message
  payment_custom_message?: string;

  // Social
  social_links?: SocialLinks;

  // Subscription
  created_at?: string;
  subscription?: ShopSubscription;
}

export interface ShopSubscription {
  easybill?: {
    plan_id: number;
    end_date?: string;
  };
}

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
  linkedIn?: string; // Capital I to match API
  telegram?: string;
  discord?: string;
  amazon?: string;
  walmart?: string;
  daraz?: string;
  whatsapp?: string;
}

export interface ThemeColor {
  primary_color?: string;
}

// Shop Theme
export interface ShopTheme {
  id: number;
  theme_type: "builder" | "static";

  // For static themes
  theme_name?: "Basic" | "Premium" | "Aurora" | "Luxura" | "Sellora";
  theme_mode?: "light" | "dark";

  // For builder themes
  theme_json?: ZatiqTheme;

  // Common theme data
  enable_buy_now_on_product_card: boolean;
  on_sale_inventories: InventoryProduct[];
  new_arrival_inventories?: InventoryProduct[];
  selected_categories: SelectedCategory[];
  carousels: Carousel[];
  primary_color?: string;
}

// Builder Theme Schema (V3.0)
export interface ZatiqTheme {
  global_sections?: {
    announcement?: BlockSchema;
    header?: BlockSchema;
    announcementAfterHeader?: BlockSchema;
    footer?: BlockSchema;
  };
  templates?: Record<string, PageTemplate>;
}

export interface PageTemplate {
  sections?: BlockSchema[];
}

export interface BlockSchema {
  tag?: string;
  className?: string;
  children?: BlockSchema[];
  content?: string;
  bind_content?: string;
  bind_src?: string;
  bind_href?: string;
  bind_class?: string;
  condition?: ConditionSchema;
  events?: EventSchema[];
  data_slot?: string;
  // Repeater
  repeater?: RepeaterSchema;
  // Swiper/Carousel
  swiper?: SwiperSchema;
  // Marquee
  marquee?: MarqueeSchema;
  // Icon
  icon?: string;
  // Component reference
  component?: string;
  props?: Record<string, unknown>;
}

export interface ConditionSchema {
  type: "show" | "hide";
  field: string;
  operator: "==" | "!=" | ">" | "<" | ">=" | "<=" | "includes" | "exists";
  value?: unknown;
}

export interface EventSchema {
  type: "click" | "hover" | "focus" | "blur";
  action:
    | "navigate"
    | "toggle_drawer"
    | "toggle_theme"
    | "search"
    | "slider_prev"
    | "slider_next";
  payload?: Record<string, unknown>;
}

export interface RepeaterSchema {
  data_source: string;
  item_variable?: string;
  template: BlockSchema;
}

export interface SwiperSchema {
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  loop?: boolean;
  autoplay?: boolean | { delay: number };
  pagination?: boolean;
  navigation?: boolean;
  breakpoints?: Record<
    number,
    { slidesPerView: number; spaceBetween?: number }
  >;
}

export interface MarqueeSchema {
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
}

// Selected Category for homepage
export interface SelectedCategory extends InventoryCategory {
  inventories?: InventoryProduct[];
}

// Carousel
export interface Carousel {
  id: number;
  title?: string;
  image_url: string;
  link?: string;
  mobile_image_url?: string;
}

// Division/District/Upazila for Bangladesh
export interface Division {
  id: number;
  name: string;
  bn_name: string;
  districts: District[];
}

export interface District {
  id: number;
  name: string;
  bn_name: string;
  upazilas: Upazila[];
}

export interface Upazila {
  id: number;
  name: string;
  bn_name: string;
}
