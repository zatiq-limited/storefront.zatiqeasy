import React, { useState, useRef, useEffect } from 'react';
import { Search, Moon, ShoppingBag, X } from 'lucide-react';
const logoImage = '/assets/nav/logo2.png';
const menuIcon = '/assets/menu_icon.svg';

const Navbar4: React.FC = () => {
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

  const navLinks = [
    { name: 'New Arrivals', href: '#' },
    { name: 'Kurti', href: '#' },
    { name: 'Collections', href: '#' },
    { name: 'About Us', href: '#' },
    { name: 'Demos', href: '#' }
  ];

  return (
    <nav className="bg-white py-3 md:py-4">
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 flex justify-between items-center gap-2">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <img
            src={logoImage}
            alt="Sellora"
            className="w-[100px] h-[34px]"
          />
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-gray-700 hover:text-gray-900 font-roboto font-normal text-sm leading-[100%] transition-colors whitespace-nowrap text-center"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Section: Dark Mode, Search, Cart */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
          {/* Dark Mode Toggle */}
          <button
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            aria-label="Toggle dark mode"
          >
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_804_32062)">
                <path d="M28.7876 18.4884C28.6622 18.3633 28.5038 18.2763 28.3309 18.2374C28.158 18.1986 27.9777 18.2096 27.8107 18.2691C25.5676 19.0688 23.1436 19.2157 20.8204 18.6926C18.4971 18.1694 16.37 16.9978 14.6861 15.3139C13.0022 13.6299 11.8308 11.5027 11.3078 9.17942C10.7848 6.85613 10.9318 4.43214 11.7317 2.18907C11.7911 2.02212 11.802 1.84175 11.7631 1.66886C11.7242 1.49597 11.6371 1.33765 11.5119 1.21224C11.3867 1.08684 11.2285 0.999486 11.0557 0.960319C10.8829 0.921152 10.7025 0.931771 10.5354 0.990947C8.51314 1.70508 6.67793 2.86606 5.16637 4.38751C2.45664 7.09929 0.934822 10.7762 0.935547 14.6098C0.936272 18.4434 2.45948 22.1198 5.17023 24.8305C7.88099 27.5413 11.5574 29.0645 15.3909 29.0652C19.2245 29.0659 22.9015 27.5441 25.6132 24.8344C27.1348 23.3226 28.2958 21.487 29.0098 19.4644C29.0688 19.2973 29.0792 19.117 29.0398 18.9443C29.0005 18.7716 28.9131 18.6135 28.7876 18.4884ZM24.2876 23.5088C23.0093 24.7835 21.4716 25.7683 19.779 26.3961C18.0864 27.024 16.2785 27.2804 14.4781 27.1477C12.6777 27.0151 10.9268 26.4966 9.34453 25.6275C7.76221 24.7583 6.38544 23.5589 5.3077 22.1105C4.22996 20.6622 3.47648 18.999 3.09843 17.2337C2.72037 15.4684 2.72659 13.6424 3.11667 11.8798C3.50674 10.1171 4.27153 8.45903 5.35911 7.01809C6.4467 5.57715 7.83161 4.38711 9.41981 3.52876C8.94964 5.86945 9.0629 8.28989 9.74961 10.5764C10.4363 12.863 11.6753 14.9453 13.3573 16.6397C15.0515 18.322 17.1338 19.5612 19.4204 20.2479C21.707 20.9346 24.1276 21.0477 26.4682 20.5772C25.8886 21.6557 25.1539 22.6434 24.2876 23.5088Z" fill="#181D25" />
              </g>
              <defs>
                <clipPath id="clip0_804_32062">
                  <rect width="30" height="30" fill="white" />
                </clipPath>
              </defs>
            </svg>

          </button>

          {/* Search */}
          <button
            onClick={handleSearchClick}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            aria-label="Search"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.5605 30C24.4641 30 30.0605 24.4036 30.0605 17.5C30.0605 10.5964 24.4641 5 17.5605 5C10.657 5 5.06055 10.5964 5.06055 17.5C5.06055 24.4036 10.657 30 17.5605 30Z" stroke="#181D25" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round" />
              <path d="M26.3984 26.3391L35.0594 35" stroke="#181D25" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round" />
            </svg>

          </button>

          {/* Shopping Cart */}
          <button
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            aria-label="Shopping cart"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.3327 11.6667H26.666C29.8087 11.6667 31.38 11.6667 32.3563 12.643C33.3327 13.6193 33.3327 15.1906 33.3327 18.3333V25C33.3327 30.4997 33.3327 33.2495 31.6242 34.9582C29.9155 36.6667 27.1657 36.6667 21.666 36.6667H18.3327C12.833 36.6667 10.0831 36.6667 8.37457 34.9582C6.66602 33.2495 6.66602 30.4997 6.66602 25V18.3333C6.66602 15.1906 6.66602 13.6193 7.64233 12.643C8.61863 11.6667 10.19 11.6667 13.3327 11.6667Z" stroke="#181D25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M26.6673 15.8333C26.6673 9.39003 23.6825 3.33334 20.0007 3.33334C16.3188 3.33334 13.334 9.39003 13.334 15.8333" stroke="#181D25" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

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
                  placeholder="Search..."
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`text-gray-600 hover:text-gray-900 py-3 text-center transition-colors ${index < navLinks.length - 1 ? 'border-b border-gray-100' : ''
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
};

export default Navbar4;
