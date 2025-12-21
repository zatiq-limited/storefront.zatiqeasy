import { create } from 'zustand';
import { createJSONStorage, persist, subscribeWithSelector } from 'zustand/middleware';
import { StaticTheme, ThemeConfig, ThemeMode } from '@/types/theme';

interface ThemeStore {
  // Current theme state
  currentTheme: string;
  themeMode: ThemeMode;
  isPreview: boolean;
  previewTheme?: StaticTheme;

  // Theme collections
  staticThemes: StaticTheme[];
  customThemes: StaticTheme[];

  // Actions
  setTheme: (themeId: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  enablePreview: (themeData: StaticTheme) => void;
  disablePreview: () => void;
  registerTheme: (theme: StaticTheme) => void;
  unregisterTheme: (themeId: string) => void;
  updateTheme: (themeId: string, updates: Partial<StaticTheme>) => void;

  // Getters
  getThemeConfig: (themeId?: string) => StaticTheme | undefined;
  getCurrentTheme: () => StaticTheme | undefined;
  getAllThemes: () => StaticTheme[];
  isThemeActive: (themeId: string) => boolean;
}

export const useThemeStore = create<ThemeStore>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        currentTheme: 'basic',
        themeMode: 'light',
        isPreview: false,
        staticThemes: [],
        customThemes: [],

        // Theme management actions
        setTheme: (themeId: string) => {
          console.log(`🎨 Setting theme: ${themeId}`);
          set({ currentTheme: themeId });

          // Update document attribute for CSS targeting
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', themeId);
          }
        },

        setThemeMode: (mode: ThemeMode) => {
          console.log(`🌓 Setting theme mode: ${mode}`);
          set({ themeMode: mode });

          // Update document class for mode-specific styling
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('light', 'dark');
            document.documentElement.classList.add(mode);
          }
        },

        enablePreview: (themeData: StaticTheme) => {
          console.log('👁️ Enabling theme preview');
          set({
            isPreview: true,
            previewTheme: themeData
          });

          // Apply preview theme immediately
          if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme-preview', 'true');
            document.documentElement.setAttribute('data-theme', themeData.id);
          }
        },

        disablePreview: () => {
          console.log('👁️ Disabling theme preview');
          set({
            isPreview: false,
            previewTheme: undefined
          });

          // Remove preview attributes
          if (typeof document !== 'undefined') {
            document.documentElement.removeAttribute('data-theme-preview');
            // Restore current theme
            const { currentTheme } = get();
            document.documentElement.setAttribute('data-theme', currentTheme);
          }
        },

        registerTheme: (theme: StaticTheme) => {
          console.log(`📝 Registering theme: ${theme.id}`);
          set((state) => {
            const existingIndex = state.staticThemes.findIndex(t => t.id === theme.id);
            let updatedThemes;

            if (existingIndex >= 0) {
              // Update existing theme
              updatedThemes = [...state.staticThemes];
              updatedThemes[existingIndex] = theme;
            } else {
              // Add new theme
              updatedThemes = [...state.staticThemes, theme];
            }

            return {
              staticThemes: updatedThemes
            };
          });
        },

        unregisterTheme: (themeId: string) => {
          console.log(`🗑️ Unregistering theme: ${themeId}`);
          set((state) => ({
            staticThemes: state.staticThemes.filter(t => t.id !== themeId),
            // Switch to default theme if current theme is removed
            currentTheme: state.currentTheme === themeId ? 'basic' : state.currentTheme
          }));
        },

        updateTheme: (themeId: string, updates: Partial<StaticTheme>) => {
          console.log(`✏️ Updating theme: ${themeId}`);
          set((state) => ({
            staticThemes: state.staticThemes.map(theme =>
              theme.id === themeId ? { ...theme, ...updates } : theme
            )
          }));
        },

        // Getter methods
        getThemeConfig: (themeId?: string) => {
          const { currentTheme, staticThemes, customThemes, previewTheme, isPreview } = get();
          const targetThemeId = themeId || currentTheme;

          // Return preview theme if in preview mode
          if (isPreview && !themeId && previewTheme) {
            return previewTheme;
          }

          // Search in static themes first
          let theme = staticThemes.find(t => t.id === targetThemeId);

          // Then search in custom themes
          if (!theme) {
            theme = customThemes.find(t => t.id === targetThemeId);
          }

          return theme;
        },

        getCurrentTheme: () => {
          const { getThemeConfig, currentTheme } = get();
          return getThemeConfig(currentTheme);
        },

        getAllThemes: () => {
          const { staticThemes, customThemes } = get();
          return [...staticThemes, ...customThemes];
        },

        isThemeActive: (themeId: string) => {
          const { currentTheme, isPreview, previewTheme } = get();
          return isPreview ? previewTheme?.id === themeId : currentTheme === themeId;
        }
      }),
      {
        name: 'theme-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          currentTheme: state.currentTheme,
          themeMode: state.themeMode,
          // Don't persist preview state or theme configs
          staticThemes: [],
          customThemes: []
        }),
        version: 1,
        onRehydrateStorage: () => (state) => {
          if (state) {
            console.log('🔄 Theme store rehydrated:', {
              theme: state.currentTheme,
              mode: state.themeMode
            });

            // Apply theme to DOM after rehydration
            if (typeof document !== 'undefined') {
              document.documentElement.setAttribute('data-theme', state.currentTheme);
              document.documentElement.classList.remove('light', 'dark');
              document.documentElement.classList.add(state.themeMode);
            }
          }
        }
      }
    )
  )
);

// Selectors for optimized subscriptions
export const selectCurrentTheme = (state: ThemeStore) => state.currentTheme;
export const selectThemeMode = (state: ThemeStore) => state.themeMode;
export const selectIsPreview = (state: ThemeStore) => state.isPreview;
export const selectCurrentThemeConfig = (state: ThemeStore) => state.getCurrentTheme();
export const selectAllThemes = (state: ThemeStore) => state.getAllThemes();
export const selectStaticThemes = (state: ThemeStore) => state.staticThemes;
export const selectCustomThemes = (state: ThemeStore) => state.customThemes;

// Theme utilities
export const themeUtils = {
  // Generate CSS custom properties from theme config
  generateCSSVariables: (themeConfig: ThemeConfig): string => {
    const variables: string[] = [];

    // Generate color variables
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
      const cssVar = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      variables.push(`${cssVar}: ${value};`);
    });

    // Generate spacing variables
    Object.entries(themeConfig.spacing).forEach(([key, value]) => {
      const cssVar = `--theme-spacing-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      variables.push(`${cssVar}: ${value};`);
    });

    // Generate font variables
    if (themeConfig.fonts) {
      Object.entries(themeConfig.fonts).forEach(([key, value]) => {
        const cssVar = `--theme-font-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        variables.push(`${cssVar}: ${value};`);
      });
    }

    // Generate border radius variables
    if (themeConfig.borderRadius) {
      Object.entries(themeConfig.borderRadius).forEach(([key, value]) => {
        const cssVar = `--theme-radius-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        variables.push(`${cssVar}: ${value};`);
      });
    }

    return variables.join('\n  ');
  },

  // Generate theme CSS class
  generateThemeCSS: (theme: StaticTheme): string => {
    const cssVars = themeUtils.generateCSSVariables(theme.config);

    return `
  [data-theme="${theme.id}"] {
    ${cssVars}
  }

  [data-theme="${theme.id}"].dark {
    color-scheme: dark;
  }

  [data-theme="${theme.id}"].light {
    color-scheme: light;
  }`;
  }
};

// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Subscribe to theme changes for debugging
  useThemeStore.subscribe(
    (state) => ({
      theme: state.currentTheme,
      mode: state.themeMode,
      preview: state.isPreview
    }),
    (themeState) => {
      console.log('🎨 Theme state changed:', themeState);
    }
  );
}