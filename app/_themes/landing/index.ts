// Landing Page Themes
export { GripLandingPage } from "./themes/grip";
export { gripThemeConfig } from "./themes/grip/theme.config";
export { ArcadiaLandingPage } from "./themes/arcadia";
export { arcadiaThemeConfig } from "./themes/arcadia/theme.config";
export { NirvanaLandingPage } from "./themes/nirvana";
export { nirvanaThemeConfig } from "./themes/nirvana/theme.config";

// Shared Components
export { LandingNavbar, ProductImagesGrid } from "./components";

// Context
export {
  LandingProductProvider,
  useLandingProduct,
} from "./context/landing-product-context";
export type {
  LandingProductContextValue,
  ProductPricingType,
  ProductActionController,
} from "./context/landing-product-context";

// Theme Registry (for future expansion)
export const landingThemes = {
  Grip: {
    component: () =>
      import("./themes/grip").then((mod) => mod.GripLandingPage),
    config: () =>
      import("./themes/grip/theme.config").then((mod) => mod.gripThemeConfig),
  },
  Arcadia: {
    component: () =>
      import("./themes/arcadia").then((mod) => mod.ArcadiaLandingPage),
    config: () =>
      import("./themes/arcadia/theme.config").then((mod) => mod.arcadiaThemeConfig),
  },
  Nirvana: {
    component: () =>
      import("./themes/nirvana").then((mod) => mod.NirvanaLandingPage),
    config: () =>
      import("./themes/nirvana/theme.config").then((mod) => mod.nirvanaThemeConfig),
  },
} as const;

export type LandingThemeName = keyof typeof landingThemes;
