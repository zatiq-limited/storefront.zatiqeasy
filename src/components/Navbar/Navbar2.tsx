import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Moon, Search, ShoppingCart, X } from 'lucide-react';

interface Navbar2Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function Navbar2({ settings, blocks, pageData }: Navbar2Props) {
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
  const bagsOptions = settings?.bagsOptions || [
    'Handbags',
    'Backpacks',
    'Clutches',
    'Tote Bags'
  ];
  const shoesOptions = settings?.shoesOptions || [
    'Sneakers',
    'Formal Shoes',
    'Sandals',
    'Boots'
  ];

  return (
    <nav className="bg-white px-3 sm:px-4 md:px-8 lg:px-16 py-3 md:py-4 border-b border-gray-200">
      <div className="flex justify-between items-center gap-2">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
          <img src={logoImage} alt="nextek" className="h-5 w-20 sm:h-6 sm:w-24 md:h-8 md:w-32 shrink-0" />

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Bags Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setOpenDropdown('bags')}
                onMouseLeave={() => setOpenDropdown(null)}
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
              >
                {settings?.bagsLabel || 'Bags'}
                <ChevronDown className="w-4 h-4" />
              </button>
              {openDropdown === 'bags' && (
                <div
                  onMouseEnter={() => setOpenDropdown('bags')}
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                >
                  {bagsOptions.map((option: string, index: number) => (
                    <a
                      key={index}
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    >
                      {option}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Shoes Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setOpenDropdown('shoes')}
                onMouseLeave={() => setOpenDropdown(null)}
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
              >
                {settings?.shoesLabel || 'Shoes'}
                <ChevronDown className="w-4 h-4" />
              </button>
              {openDropdown === 'shoes' && (
                <div
                  onMouseEnter={() => setOpenDropdown('shoes')}
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                >
                  {shoesOptions.map((option: string, index: number) => (
                    <a
                      key={index}
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    >
                      {option}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Lookbook */}
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors whitespace-nowrap">
              {settings?.lookbookLabel || 'Lookbook'}
            </a>
          </div>

        </div>

        {/* Right Section: Dark Mode, Search, Cart */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
          {/* Dark Mode Toggle */}
          <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
            <Moon className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          </button>

          {/* Search */}
          <button
            onClick={handleSearchClick}
            className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
          >
            <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          </button>

          {/* Shopping Cart */}
          <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          </button>

          {/* Hamburger Menu Button - Mobile */}
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
                  placeholder={settings?.searchPlaceholder || 'Search...'}
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col">
              {/* Bags Dropdown - Mobile */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleDropdown('bags-mobile')}
                  className="flex items-center justify-between w-full text-gray-600 hover:text-blue-600 py-3 transition-colors"
                >
                  <span>{settings?.bagsLabel || 'Bags'}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openDropdown === 'bags-mobile' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openDropdown === 'bags-mobile' && (
                  <div className="pb-3 flex flex-col">
                    {bagsOptions.map((option: string, index: number) => (
                      <a
                        key={index}
                        href="#"
                        className="text-gray-500 hover:text-blue-600 transition-colors py-2 pl-4 text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {option}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Shoes Dropdown - Mobile */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => toggleDropdown('shoes-mobile')}
                  className="flex items-center justify-between w-full text-gray-600 hover:text-blue-600 py-3 transition-colors"
                >
                  <span>{settings?.shoesLabel || 'Shoes'}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openDropdown === 'shoes-mobile' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openDropdown === 'shoes-mobile' && (
                  <div className="pb-3 flex flex-col">
                    {shoesOptions.map((option: string, index: number) => (
                      <a
                        key={index}
                        href="#"
                        className="text-gray-500 hover:text-blue-600 transition-colors py-2 pl-4 text-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {option}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Lookbook - Mobile */}
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 py-3 text-center transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {settings?.lookbookLabel || 'Lookbook'}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
