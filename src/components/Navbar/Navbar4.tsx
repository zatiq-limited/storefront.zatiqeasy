import { useState, useRef, useEffect } from 'react';
import { Search, Moon, ShoppingBag, X } from 'lucide-react';

interface Navbar4Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function Navbar4({ settings, blocks, pageData }: Navbar4Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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

  const logoImage = settings?.logoImage || '/assets/nav/logo2.png';
  const menuIcon = settings?.menuIcon || '/assets/menu_icon.svg';
  const searchPlaceholder = settings?.searchPlaceholder || 'Search...';

  const navLinks = settings?.navLinks || [
    { name: 'New Arrivals', href: '#' },
    { name: 'Kurti', href: '#' },
    { name: 'Collections', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Demos', href: '#' }
  ];

  return (
    <nav className="bg-white px-3 sm:px-4 md:px-6 lg:px-6 py-3 md:py-4">
      <div className="flex justify-between items-center gap-2">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <img
            src={logoImage}
            alt="Sellora"
            className="h-6 sm:h-8 md:h-10 w-auto"
          />
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navLinks.map((link: any, index: number) => (
            <a
              key={index}
              href={link.href}
              className="text-gray-700 hover:text-gray-900 font-medium transition-colors whitespace-nowrap text-sm xl:text-base"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Section: Dark Mode, Search, Cart */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            aria-label="Toggle dark mode"
          >
            <Moon className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>

          {/* Search */}
          <button
            onClick={handleSearchClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            aria-label="Search"
          >
            <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>

          {/* Shopping Cart */}
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
          </button>

          {/* Hamburger Menu Button - Mobile */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <img src={menuIcon} alt="Menu" className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-6">
            {/* Mobile Search Bar */}
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

            {/* Mobile Navigation Links */}
            <div className="flex flex-col">
              {navLinks.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.href}
                  className={`text-gray-600 hover:text-gray-900 py-3 text-center transition-colors ${
                    index < navLinks.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
