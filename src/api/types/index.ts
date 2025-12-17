/**
 * API Types - Central export
 */

// Product types
export type {
  Product,
  ProductImage,
  ProductVariant,
  VariantOption,
  ReviewSummary,
  ProductFilters,
  ProductSortKey,
  ProductsResponse,
  Pagination,
  Collection,
  CollectionWithProducts,
} from './product.types';

// Cart types
export type {
  CartItem,
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  RemoveFromCartRequest,
  CartResponse,
} from './cart.types';

// Theme types
export type {
  ZatiqTheme,
  GlobalSettings,
  ThemeColors,
  ThemeFonts,
  BorderRadiusConfig,
  ComponentStyle,
  GlobalSections,
  GlobalSection,
  SectionSettings,
  Block,
  BlockStyle,
  BlockData,
  BlockCondition,
  ConditionOperator,
  BlockEvents,
  BlockEvent,
  TemplateConfig,
  SEOConfig,
  OpenGraphConfig,
  TwitterConfig,
} from './theme.types';

// Page types
export type {
  PageData,
  PageSection,
  Post,
  Review,
  Testimonial,
  Breadcrumb,
  HomepageData,
  ProductsPageData,
  ProductDetailPageData,
  CollectionsPageData,
  CollectionDetailPageData,
  CheckoutPageData,
  PaymentMethod,
  DeliveryOption,
  SearchPageData,
  ShopConfig,
  CurrencyConfig,
  ContactInfo,
  SocialLinks,
} from './page.types';
