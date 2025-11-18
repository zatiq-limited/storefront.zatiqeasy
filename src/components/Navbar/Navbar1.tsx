import { useState, useRef, useEffect } from 'react';
import { Search, Moon, ShoppingBag, X } from 'lucide-react';

interface Navbar1Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function Navbar1({ settings, blocks, pageData }: Navbar1Props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const logoImage = settings?.logoImage || '/assets/nav/nav1.png';
  const menuIcon = settings?.menuIcon || '/assets/menu_icon.svg';
  const cartCount = settings?.cartCount || 3;
  const navLinks = settings?.navLinks || ['Handbags', 'Watches', 'Skincare', 'Jewellery', 'Apparels'];
  const searchPlaceholder = settings?.searchPlaceholder || 'Search for products or brands.....';

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

  return (
    <nav className="bg-white px-3 sm:px-4 md:px-8 lg:px-10 py-3 md:py-[18px]">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 sm:gap-4 md:gap-10">
          <div className="flex items-center shrink-0">
            <img src={logoImage} alt="nextek" className="h-5 w-20 sm:h-6 sm:w-24 md:h-8 md:w-32" />
          </div>

          <div className="hidden lg:flex gap-8">
            {navLinks.map((link, idx) => (
              <a key={idx} href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors whitespace-nowrap">
                {link}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-5 shrink-0">
          <div className="hidden md:block relative">
            <Search className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              className="w-60 lg:w-80 px-4 py-3 pl-10 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button onClick={handleSearchClick} className="md:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </button>

          <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
          </button>

          <button className="relative p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 md:w-5 md:h-5 bg-blue-600 text-white text-[9px] sm:text-[10px] md:text-xs rounded-full flex items-center justify-center font-medium">
              {cartCount}
            </span>
          </button>

          <button onClick={toggleMobileMenu} className="lg:hidden p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <img src={menuIcon} alt="Menu" className="w-6 h-6 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-6">
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

            <div className="flex flex-col">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`text-gray-600 hover:text-blue-600 py-3 text-center transition-colors ${idx < navLinks.length - 1 ? 'border-b border-gray-100' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
