import { ComponentType, ReactNode } from 'react';

// Theme mode types
export type ThemeMode = 'light' | 'dark';

// Color palette structure
export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryHover?: string;
  primaryLight?: string;
  primaryDark?: string;

  // Secondary colors
  secondary?: string;
  secondaryHover?: string;
  secondaryLight?: string;
  secondaryDark?: string;

  // Accent colors
  accent?: string;
  accentHover?: string;

  // Semantic colors
  success?: string;
  warning?: string;
  error?: string;
  info?: string;

  // Neutral colors
  background?: string;
  foreground?: string;
  muted?: string;
  mutedForeground?: string;
  border?: string;
  input?: string;
  ring?: string;

  // Text colors
  textPrimary?: string;
  textSecondary?: string;
  textMuted?: string;
  textInverse?: string;

  // Surface colors
  surface?: string;
  surfaceVariant?: string;
  surfaceHover?: string;

  // Custom colors
  [key: string]: string | undefined;
}

// Spacing configuration
export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  [key: string]: string | undefined;
}

// Typography configuration
export interface ThemeFonts {
  primary: string;
  secondary?: string;
  mono?: string;
  display?: string;
  body?: string;
  heading?: string;
  [key: string]: string | undefined;
}

// Border radius configuration
export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
  [key: string]: string | undefined;
}

// Theme configuration interface
export interface ThemeConfig {
  id: string;
  name: string;
  displayName?: string;
  description?: string;
  version: string;
  author?: string;

  // Theme characteristics
  mode?: ThemeMode | 'both'; // 'light', 'dark', or 'both'
  category?: 'basic' | 'premium' | 'minimal' | 'bold' | 'modern' | 'classic';

  // Visual configuration
  colors: ThemeColors;
  spacing?: ThemeSpacing;
  fonts?: ThemeFonts;
  borderRadius?: ThemeBorderRadius;

  // Component overrides
  components?: Record<string, ComponentThemeConfig>;

  // CSS custom properties
  cssVariables?: Record<string, string>;

  // Additional styles
  customCSS?: string;

  // Theme metadata
  preview?: {
    image?: string;
    thumbnail?: string;
    demoUrl?: string;
  };

  // Dependencies
  dependencies?: string[];

  // Theme flags
  isDefault?: boolean;
  isPremium?: boolean;
  isCustom?: boolean;
}

// Component theme configuration
export interface ComponentThemeConfig {
  // CSS class overrides
  className?: string;

  // Style overrides
  style?: Record<string, string | number>;

  // Props overrides
  props?: Record<string, any>;

  // Component-specific configuration
  variant?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';

  // Custom CSS
  css?: string;

  // Nested component styles
  components?: Record<string, ComponentThemeConfig>;
}

// Theme module interface
export interface ThemeModule {
  id: string;
  name: string;
  path: string;
  component?: ComponentType<any>;

  // Module configuration
  config?: {
    layout?: 'default' | 'centered' | 'full-width' | 'sidebar';
    padding?: string;
    background?: string;
    container?: boolean;
  };

  // Available components in this module
  components?: Record<string, ThemeComponent>;

  // Module metadata
  metadata?: {
    description?: string;
    tags?: string[];
    category?: string;
  };
}

// Theme component interface
export interface ThemeComponent {
  id: string;
  name: string;
  component: ComponentType<any>;

  // Component configuration
  defaultProps?: Record<string, any>;

  // Theme overrides
  theme?: ComponentThemeConfig;

  // Component metadata
  metadata?: {
    description?: string;
    category?: string;
    tags?: string[];
    isRequired?: boolean;
  };
}

// Static theme definition
export interface StaticTheme {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  version: string;
  author?: string;
  category?: 'basic' | 'premium' | 'minimal' | 'bold' | 'modern' | 'classic';

  // Theme configuration
  config: {
    colors: ThemeColors;
    spacing?: ThemeSpacing;
    fonts?: ThemeFonts;
    borderRadius?: ThemeBorderRadius;
  };

  // Component mappings
  components: Record<string, () => Promise<{ default: ComponentType<any> }>>;

  // Module mappings
  modules: Record<string, () => Promise<{ default: ComponentType<any> }>>;

  // Layout mappings
  layouts?: Record<string, () => Promise<{ default: ComponentType<any> }>>;

  // Theme styles
  styles?: {
    globals?: string;
    components?: string;
    utilities?: string;
  };

  // Preview information
  preview?: {
    image: string;
    thumbnail?: string;
    demoUrl?: string;
  };

  // Dependencies
  dependencies?: string[];

  // Theme flags
  isDefault?: boolean;
  isPremium?: boolean;
  supportsDarkMode?: boolean;
}

// Theme renderer props
export interface ThemeRendererProps {
  theme: string;
  module: string;
  component?: string;
  props?: Record<string, any>;
  fallback?: ReactNode;
  wrapper?: ComponentType<{ children: ReactNode }>;

  // Rendering options
  lazy?: boolean;
  suspense?: boolean;
  errorBoundary?: boolean;

  // Theme overrides
  themeConfig?: Partial<ThemeConfig>;
  mode?: ThemeMode;
}

// Theme context interface
export interface ThemeContextValue {
  // Current theme
  theme: ThemeConfig;
  mode: ThemeMode;
  isPreview: boolean;

  // Theme configuration
  config: ThemeConfig;

  // Actions
  setTheme: (themeId: string) => void;
  setMode: (mode: ThemeMode) => void;
  updateTheme: (updates: Partial<ThemeConfig>) => void;

  // Component rendering
  getComponent: (componentId: string) => ComponentType<any> | undefined;
  getModule: (moduleId: string) => ComponentType<any> | undefined;

  // CSS utilities
  getCSSVariable: (name: string) => string | undefined;
  setCSSVariable: (name: string, value: string) => void;
}

// Theme registry options
export interface ThemeRegistryOptions {
  // Default theme
  defaultTheme?: string;

  // Default mode
  defaultMode?: ThemeMode;

  // Enable CSS injection
  injectCSS?: boolean;

  // CSS injection target
  cssTarget?: string;

  // Enable theme transitions
  enableTransitions?: boolean;

  // Transition duration
  transitionDuration?: number;

  // Theme loading strategy
  loadingStrategy?: 'eager' | 'lazy' | 'preload';

  // Error handling
  errorBoundary?: boolean;
  fallbackComponent?: ComponentType<{ error: Error }>;
}

// Theme switcher component props
export interface ThemeSwitcherProps {
  // Available themes
  themes?: ThemeConfig[];

  // Display options
  showPreview?: boolean;
  showLabels?: boolean;
  gridColumns?: number;

  // Customization
  className?: string;
  itemClassName?: string;

  // Events
  onThemeChange?: (themeId: string) => void;
  onPreviewStart?: (themeId: string) => void;
  onPreviewEnd?: (themeId: string) => void;
}

// Theme wrapper component props
export interface ThemeWrapperProps {
  // Theme configuration
  theme: string;
  mode?: ThemeMode;

  // Children
  children: ReactNode;

  // Options
  injectCSS?: boolean;
  enableTransitions?: boolean;

  // Customization
  className?: string;
  style?: Record<string, string | number>;
}

// Preset theme configurations
export const PRESET_THEMES: Record<string, Partial<ThemeConfig>> = {
  basic: {
    category: 'basic',
    isDefault: true,
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      accent: '#f59e0b',
      background: '#ffffff',
      foreground: '#111827',
      textPrimary: '#111827',
      textSecondary: '#6b7280',
      surface: '#f9fafb',
      border: '#e5e7eb'
    }
  },
  premium: {
    category: 'premium',
    isPremium: true,
    colors: {
      primary: '#8b5cf6',
      secondary: '#4b5563',
      accent: '#ec4899',
      background: '#ffffff',
      foreground: '#111827',
      textPrimary: '#111827',
      textSecondary: '#4b5563',
      surface: '#f8fafc',
      border: '#e2e8f0'
    }
  },
  aurora: {
    category: 'modern',
    colors: {
      primary: '#06b6d4',
      secondary: '#64748b',
      accent: '#f97316',
      background: '#0f172a',
      foreground: '#f1f5f9',
      textPrimary: '#f1f5f9',
      textSecondary: '#94a3b8',
      surface: '#1e293b',
      border: '#334155'
    }
  }
};

// Utility types
export type ThemeId = string;
export type ModuleId = string;
export type ComponentId = string;

// Export commonly used types
export type {
  ThemeConfig as IThemeConfig,
  ThemeColors as IThemeColors,
  ThemeModule as IThemeModule,
  ThemeComponent as IThemeComponent,
  StaticTheme as IStaticTheme
};