import { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, ChevronDown, X } from 'lucide-react';

interface Navbar3Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function Navbar3({ settings, blocks, pageData }: Navbar3Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleSearchClick = () => {
    setIsMobileMenuOpen(true);
  };

  useEffect(() => {
    if (isMobileMenuOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isMobileMenuOpen]);

  const logoImage = settings?.logoImage || '/assets/nav/nav1.png';
  const menuIcon = settings?.menuIcon || '/assets/menu_icon.svg';
  const cartCount = settings?.cartCount || 2;
  const cartTotal = settings?.cartTotal || '12,000 BDT';
  const searchPlaceholder = settings?.searchPlaceholder || 'Discover exactly what you need with a simple search';
  const language = settings?.language || 'EN';

  const categories = settings?.categories || [
    {
      name: 'All Products',
      hasDropdown: true,
      items: ['Electronics', 'Fashion', 'Home & Garden', 'Sports']
    },
    {
      name: 'Headphones',
      hasDropdown: true,
      items: ['Wireless', 'Wired', 'Gaming', 'Noise Cancelling']
    },
    {
      name: 'Electronics',
      hasDropdown: true,
      items: ['Laptops', 'Tablets', 'Cameras', 'Smart Watches']
    },
    {
      name: 'Computer Monitors',
      hasDropdown: true,
      items: ['4K Monitors', 'Gaming Monitors', 'Curved', 'Ultrawide']
    },
    {
      name: 'Accessories',
      hasDropdown: true,
      items: ['Cases', 'Chargers', 'Cables', 'Screen Protectors']
    },
    {
      name: 'Digital Cameras',
      hasDropdown: true,
      items: ['DSLR', 'Mirrorless', 'Point & Shoot', 'Action Cameras']
    },
    {
      name: 'Digital Headphones',
      hasDropdown: true,
      items: ['Bluetooth', 'USB-C', 'Lightning', 'Wireless Earbuds']
    },
    {
      name: 'Mobile Phones',
      hasDropdown: true,
      items: ['iPhone', 'Samsung', 'Google Pixel', 'OnePlus']
    }
  ];

  return (
    <nav className="bg-white">
      {/* Top Row */}
      <div className="border-b border-gray-200 px-3 sm:px-4 md:px-8 lg:px-16 py-3 md:py-4">
        <div className="flex justify-between items-center gap-2">
          {/* Logo */}
          <div className="shrink-0">
            <img src={logoImage} alt="nextek" className="h-5 w-20 sm:h-6 sm:w-24 md:h-8 md:w-32" />
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 shrink-0">
            {/* Search Icon - Mobile */}
            <button
              onClick={handleSearchClick}
              className="md:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>

            {/* Shopping Cart */}
            <button className="flex items-center gap-2 hover:bg-gray-100 p-1.5 sm:p-2 rounded-lg transition-colors relative shrink-0">
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
                <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[9px] sm:text-xs rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-xs text-gray-500 whitespace-nowrap">Shopping Cart</div>
                <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">{cartTotal}</div>
              </div>
            </button>

            {/* User Icon */}
            <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
              <User className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
            </button>

            {/* Language Selector */}
            <button className="hidden md:flex items-center gap-1 px-2 py-1.5 md:px-3 md:py-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
              <span className="text-sm font-medium text-gray-700">{language}</span>
              <ChevronDown className="w-4 h-4 text-gray-700" />
            </button>

            {/* Hamburger Menu - Mobile */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <img src={menuIcon} alt="Menu" className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row - Category Navigation - Desktop */}
      <div className="hidden lg:block bg-blue-600 px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-center gap-0.5">
          {categories.map((category: any, index: number) => (
            <div key={index} className="relative group shrink-0">
              <button
                onMouseEnter={() => setOpenDropdown(category.name)}
                onMouseLeave={() => setOpenDropdown(null)}
                className="flex items-center gap-1 px-2 lg:px-3 py-3 text-white hover:bg-blue-700 transition-colors text-xs lg:text-sm font-medium whitespace-nowrap"
              >
                <span className="truncate max-w-20 xl:max-w-[120px] 2xl:max-w-none">{category.name}</span>
                {category.hasDropdown && <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" />}
              </button>
              {category.hasDropdown && openDropdown === category.name && (
                <div
                  onMouseEnter={() => setOpenDropdown(category.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                >
                  {category.items.map((item: string, idx: number) => (
                    <a
                      key={idx}
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors text-sm"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-6 max-h-[80vh] overflow-y-auto">
            {/* Mobile Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Mobile Categories */}
            <div className="flex flex-col">
              {categories.map((category: any, index: number) => (
                <div key={index} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleDropdown(`mobile-${category.name}`)}
                    className="flex items-center justify-between w-full text-gray-600 hover:text-blue-600 py-3 transition-colors"
                  >
                    <span>{category.name}</span>
                    {category.hasDropdown && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === `mobile-${category.name}` ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                  {category.hasDropdown && openDropdown === `mobile-${category.name}` && (
                    <div className="pb-3 flex flex-col">
                      {category.items.map((item: string, idx: number) => (
                        <a
                          key={idx}
                          href="#"
                          className="text-gray-500 hover:text-blue-600 transition-colors py-2 pl-4 text-sm"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Language Selector */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors justify-center">
                <span className="text-sm font-medium text-gray-700">English ({language})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
