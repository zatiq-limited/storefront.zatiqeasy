/**
 * Static Theme Type Definitions
 * Used for pre-built themes like Basic, Premium, Aurora, etc.
 */

export type ThemeMode = 'light' | 'dark' | 'system';

export interface StaticTheme {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  author: string;
  category: 'basic' | 'premium' | 'luxury' | 'minimal' | 'modern';
  isDefault?: boolean;
  isPremium?: boolean;
  supportsDarkMode?: boolean;

  // Theme configuration
  config: ThemeConfig;

  // Component mappings (dynamic imports)
  components: Record<string, () => Promise<any>>;

  // Module mappings
  modules: Record<string, () => Promise<any>>;

  // Layout mappings
  layouts?: Record<string, () => Promise<any>>;

  // Theme styles
  styles: ThemeStyles;

  // Preview images
  preview: ThemePreview;

  // Dependencies
  dependencies: string[];
}

export interface ThemeConfig {
  colors: ThemeColors;
  spacing: Record<string, string>;
  fonts: ThemeFonts;
  borderRadius: Record<string, string>;
}

export interface ThemeColors {
  // Primary brand colors
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;

  // Secondary colors
  secondary: string;
  secondaryHover: string;
  secondaryLight: string;
  secondaryDark: string;

  // Accent colors
  accent: string;
  accentHover: string;

  // Semantic colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Neutral colors
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;

  // Surface colors
  surface: string;
  surfaceVariant: string;
  surfaceHover: string;
}

export interface ThemeFonts {
  primary: string;
  secondary: string;
  mono: string;
  display: string;
  body: string;
  heading: string;
}

export interface ThemeStyles {
  globals: string;
  components: string;
  utilities: string;
}

export interface ThemePreview {
  image: string;
  thumbnail: string;
  demoUrl: string;
}
