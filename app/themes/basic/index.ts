/**
 * Basic Theme - Zatiq Storefront
 * A clean, minimalist theme optimized for e-commerce
 */

import { StaticTheme } from '@/types/theme';

// Theme configuration
export const BasicTheme: StaticTheme = {
  id: 'basic',
  name: 'basic',
  displayName: 'Basic Theme',
  description: 'Clean and minimalist design perfect for any online store',
  version: '1.0.0',
  author: 'Zatiq Team',
  category: 'basic',
  isDefault: true,
  isPremium: false,
  supportsDarkMode: true,

  // Theme configuration
  config: {
    colors: {
      // Primary brand colors
      primary: '#3b82f6',         // blue-500
      primaryHover: '#2563eb',    // blue-600
      primaryLight: '#dbeafe',    // blue-100
      primaryDark: '#1e40af',     // blue-800

      // Secondary colors
      secondary: '#6b7280',       // gray-500
      secondaryHover: '#4b5563',  // gray-600
      secondaryLight: '#f3f4f6',  // gray-100
      secondaryDark: '#374151',   // gray-700

      // Accent colors
      accent: '#f59e0b',          // amber-500
      accentHover: '#d97706',     // amber-600

      // Semantic colors
      success: '#10b981',         // emerald-500
      warning: '#f59e0b',         // amber-500
      error: '#ef4444',           // red-500
      info: '#3b82f6',            // blue-500

      // Neutral colors
      background: '#ffffff',      // white
      foreground: '#111827',      // gray-900
      muted: '#f3f4f6',           // gray-100
      mutedForeground: '#6b7280', // gray-500
      border: '#e5e7eb',          // gray-200
      input: '#ffffff',           // white
      ring: '#3b82f6',            // blue-500

      // Text colors
      textPrimary: '#111827',     // gray-900
      textSecondary: '#6b7280',   // gray-500
      textMuted: '#9ca3af',       // gray-400
      textInverse: '#ffffff',     // white

      // Surface colors
      surface: '#ffffff',         // white
      surfaceVariant: '#f8fafc',  // slate-50
      surfaceHover: '#f9fafb',    // gray-50
    },

    // Spacing system
    spacing: {
      xs: '0.25rem',    // 4px
      sm: '0.5rem',     // 8px
      md: '1rem',       // 16px
      lg: '1.5rem',     // 24px
      xl: '2rem',       // 32px
      '2xl': '3rem',    // 48px
      '3xl': '4rem',    // 64px
      '4xl': '6rem',    // 96px
    },

    // Typography
    fonts: {
      primary: 'Inter, system-ui, -apple-system, sans-serif',
      secondary: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace',
      display: 'Inter, system-ui, -apple-system, sans-serif',
      body: 'Inter, system-ui, -apple-system, sans-serif',
      heading: 'Inter, system-ui, -apple-system, sans-serif',
    },

    // Border radius
    borderRadius: {
      none: '0',
      sm: '0.125rem',    // 2px
      md: '0.375rem',    // 6px
      lg: '0.5rem',      // 8px
      xl: '0.75rem',     // 12px
      full: '9999px',
    }
  },

  // Component mappings (dynamic imports)
  components: {
    // Header components
    Header: () => import('./components/header/header'),
    // Navigation: () => import('./components/header/navigation'),
    // CartButton: () => import('./components/header/cart-button'),

    // Footer components (not yet created)
    // Footer: () => import('./components/footer/footer'),
    // FooterLinks: () => import('./components/footer/footer-links'),

    // Animation components
    HeightAnimation: () => import('../../components/animations/height-animation'),
    LazyAnimation: () => import('../../components/animations/lazy-animation'),

    // Modal components (not yet created)
    // Modal: () => import('@/components/modal/modal'),
    // SuccessModal: () => import('@/components/modal/success-modal'),

    // Input components (not yet created)
    // RadioInput: () => import('@/components/inputs/radio-input'),

    // Skeleton components (not yet created)
    // CategorySkeleton: () => import('@/components/skeletons/category-skeleton'),
    // ProductSkeleton: () => import('@/components/skeletons/product-skeleton'),

    // Product components (not yet created)
    // RelatedProducts: () => import('@/components/product/related-products'),
  },

  // Module mappings
  modules: {
    // Page modules
    'basic-home-page': () => import('./modules/home/basic-home-page'),
    // 'category-page': () => import('./modules/category/category-page'),
    // 'product-page': () => import('./modules/product/basic-product-page'),
    // 'checkout': () => import('./modules/checkout/basic-checkout'),
    // 'payment-confirm': () => import('./modules/payment/payment-confirm'),
  },

  // Layout mappings (not yet created)
  // layouts: {
  //   'shop-layout': () => import('./layouts/shop-layout'),
  //   'product-layout': () => import('./layouts/product-layout'),
  // },

  // Theme styles
  styles: {
    // Global styles
    globals: `
/* Basic Theme - Global Styles */
:root {
  /* Custom scrollbar */
  --scrollbar-width: 8px;
  --scrollbar-track: transparent;
  --scrollbar-thumb: rgba(156, 163, 175, 0.5);
  --scrollbar-thumb-hover: rgba(156, 163, 175, 0.7);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Focus styles */
*:focus-visible {
  outline: 2px solid rgb(var(--theme-primary));
  outline-offset: 2px;
}

/* Selection styles */
::selection {
  background-color: rgb(var(--theme-primary-light));
  color: rgb(var(--theme-primary-dark));
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
}

::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}
    `,

    // Component-specific styles
    components: `
/* Basic Theme - Component Styles */

/* Product cards */
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Button styles */
.btn-primary {
  background-color: rgb(var(--theme-primary));
  color: white;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: rgb(var(--theme-primary-hover));
}

/* Form inputs */
.form-input {
  border-color: rgb(var(--theme-border));
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  border-color: rgb(var(--theme-primary));
  box-shadow: 0 0 0 3px rgba(var(--theme-primary), 0.1);
}

/* Loading states */
.loading-skeleton {
  background: linear-gradient(
    90deg,
    rgb(var(--theme-muted)) 25%,
    rgba(var(--theme-muted), 0.8) 50%,
    rgb(var(--theme-muted)) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
    `,

    // Utility classes
    utilities: `
/* Basic Theme - Utility Classes */

/* Text utilities */
.text-primary {
  color: rgb(var(--theme-text-primary));
}

.text-secondary {
  color: rgb(var(--theme-text-secondary));
}

.text-muted {
  color: rgb(var(--theme-text-muted));
}

/* Background utilities */
.bg-surface {
  background-color: rgb(var(--theme-surface));
}

.bg-surface-variant {
  background-color: rgb(var(--theme-surface-variant));
}

/* Border utilities */
.border-theme {
  border-color: rgb(var(--theme-border));
}

/* Spacing utilities using theme variables */
.space-y-theme > * + * {
  margin-top: var(--theme-spacing-md);
}

.space-x-theme > * + * {
  margin-left: var(--theme-spacing-md);
}
    `
  },

  // Preview image
  preview: {
    image: '/themes/basic/preview.png',
    thumbnail: '/themes/basic/thumbnail.png',
    demoUrl: 'https://demo.zatiq.com/themes/basic'
  },

  // Dependencies
  dependencies: [
    'lucide-react',
    'clsx',
    'tailwind-merge'
  ]
};

// Export theme configuration
export default BasicTheme;

// Export components
export { BasicHomePage } from './modules/home/basic-home-page';
export { BasicCategoryPage } from './modules/home/basic-category-page';

// Export theme utilities
export const basicThemeUtils = {
  // Get theme color as RGB tuple for Tailwind
  getColor(colorName: string): [number, number, number] {
    const color = BasicTheme.config.colors[colorName as keyof typeof BasicTheme.config.colors];
    if (!color) return [0, 0, 0];

    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
  },

  // Get CSS custom property value
  getCSSVar(varName: string): string {
    const themeVar = BasicTheme.config.colors[varName as keyof typeof BasicTheme.config.colors];
    return themeVar || '';
  },

  // Generate Tailwind color config
  generateTailwindColors(): Record<string, string> {
    const colors: Record<string, string> = {};

    Object.entries(BasicTheme.config.colors).forEach(([key, value]) => {
      colors[key] = value.replace('#', '');
    });

    return colors;
  }
};