/**
 * Basic Theme Configuration
 * Extends the base theme with additional settings and overrides
 */

import { BasicTheme } from './index';

// Extended theme configuration interface
interface ExtendedThemeConfig {
  mode?: string;
  components?: Record<string, any>;
  cssVariables?: Record<string, string>;
  customCSS?: string;
}

// Enhanced theme configuration
export const basicThemeConfig: ExtendedThemeConfig = {
  // Additional theme settings
  mode: 'both', // Supports both light and dark mode

  // Component-specific theme overrides
  components: {
    // Header component configuration
    Header: {
      className: 'bg-white shadow-sm border-b border-gray-200',
      style: {
        position: 'sticky',
        top: 0,
        zIndex: 50
      },
      props: {
        showCart: true,
        showSearch: true,
        showUserMenu: true
      },
      components: {
        // Nested header navigation config
        Navigation: {
          className: 'hidden md:flex items-center space-x-8',
          props: {
            orientation: 'horizontal',
            showLogo: true
          }
        },
        // Cart button config
        CartButton: {
          className: 'relative p-2 text-gray-600 hover:text-gray-900',
          props: {
            showCount: true,
            animateIcon: true
          }
        }
      }
    },

    // Product card configuration
    ProductCard: {
      className: 'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200',
      props: {
        showAddToCart: true,
        showQuickView: false,
        imageAspectRatio: 'square',
        lazyLoad: true
      },
      components: {
        // Product image config
        ProductImage: {
          className: 'w-full h-48 object-cover rounded-t-lg',
          style: {
            aspectRatio: '1 / 1'
          }
        },
        // Product title config
        ProductTitle: {
          className: 'text-lg font-semibold text-gray-900 mb-1 line-clamp-2',
          style: {
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }
        },
        // Product price config
        ProductPrice: {
          className: 'text-xl font-bold text-primary mb-2',
          components: {
            // Sale price config
            SalePrice: {
              className: 'text-lg font-bold text-red-600'
            },
            // Original price config
            OriginalPrice: {
              className: 'text-sm text-gray-500 line-through ml-2'
            }
          }
        }
      }
    },

    // Button component configuration
    Button: {
      className: 'px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      variants: {
        primary: {
          className: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary'
        },
        secondary: {
          className: 'bg-secondary text-white hover:bg-secondary-hover focus:ring-secondary'
        },
        outline: {
          className: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-primary'
        },
        ghost: {
          className: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary'
        }
      },
      sizes: {
        sm: {
          className: 'px-3 py-1.5 text-sm'
        },
        md: {
          className: 'px-4 py-2 text-base'
        },
        lg: {
          className: 'px-6 py-3 text-lg'
        }
      }
    },

    // Form input configuration
    Input: {
      className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
      style: {
        transition: 'all 0.2s ease'
      },
      props: {
        placeholder: '',
        disabled: false
      }
    },

    // Modal configuration
    Modal: {
      className: 'fixed inset-0 z-50 flex items-center justify-center',
      components: {
        ModalOverlay: {
          className: 'absolute inset-0 bg-black bg-opacity-50'
        },
        ModalContent: {
          className: 'relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto'
        },
        ModalHeader: {
          className: 'px-6 py-4 border-b border-gray-200'
        },
        ModalBody: {
          className: 'px-6 py-4'
        },
        ModalFooter: {
          className: 'px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg'
        }
      }
    }
  },

  // Custom CSS variables
  cssVariables: {
    ...BasicTheme.config.colors,
    'header-height': '64px',
    'sidebar-width': '280px',
    'border-radius-lg': '0.5rem',
    'transition-fast': '150ms',
    'transition-normal': '300ms',
    'transition-slow': '500ms'
  },

  // Additional custom CSS
  customCSS: `
/* Animation utilities */
.transition-all {
  transition: all var(--transition-normal) cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-fast {
  transition-duration: var(--transition-fast);
}

.transition-slow {
  transition-duration: var(--transition-slow);
}

/* Hover effects */
.hover-lift:hover {
  transform: translateY(-2px);
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Focus visible utilities */
.focus-ring:focus-visible {
  outline: 2px solid rgb(var(--theme-primary));
  outline-offset: 2px;
}

/* Card styles */
.card {
  background-color: rgb(var(--theme-background));
  border: 1px solid rgb(var(--theme-border));
  border-radius: var(--border-radius-lg);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.card-hover:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Badge styles */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.25rem;
}

.badge-primary {
  background-color: rgb(var(--theme-primary-light));
  color: rgb(var(--theme-primary-dark));
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  [data-theme="basic"].dark {
    /* Adjust colors for dark mode */
    --theme-background: #111827;
    --theme-foreground: #f9fafb;
    --theme-surface: #1f2937;
    --theme-surface-variant: #374151;
    --theme-border: #374151;
    --theme-text-primary: #f9fafb;
    --theme-text-secondary: #d1d5db;
    --theme-text-muted: #9ca3af;
  }
}

/* Responsive utilities */
@responsive {
}
  `
};

// Export theme configuration
export default basicThemeConfig;