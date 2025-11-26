import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

// Images from public folder
const defaultLogoImage = "/assets/nav/nav1.png";
const menuIcon = "/assets/menu_icon.svg";

interface MenuItem {
  label: string;
  url: string;
}

interface Navbar1Props {
  logo?: string;
  show_search?: boolean;
  show_cart?: boolean;
  show_dark_mode?: boolean;
  background_color?: string;
  text_color?: string;
  sticky?: boolean;
  menu_items?: MenuItem[];
  search_placeholder?: string;
}

const Navbar1: React.FC<Navbar1Props> = ({
  logo = defaultLogoImage,
  show_search = true,
  show_cart = true,
  show_dark_mode = true,
  background_color = "#FFFFFF",
  text_color = "#000000",
  sticky = false,
  menu_items,
  search_placeholder = "Search for products or brands.....",
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Default menu items if none provided
  const defaultMenuItems: MenuItem[] = [
    { label: "Handbags", url: "#" },
    { label: "Watches", url: "#" },
    { label: "Skincare", url: "#" },
    { label: "Jewellery", url: "#" },
    { label: "Apparels", url: "#" },
  ];

  const menuLinks =
    menu_items && menu_items.length > 0 ? menu_items : defaultMenuItems;

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
    <nav
      className={`py-3 md:py-[18px] ${sticky ? "sticky top-0 z-50" : ""}`}
      style={{ backgroundColor: background_color }}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 sm:gap-4 md:gap-10">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <a href="/">
              <img
                src={logo}
                alt="Logo"
                className="h-5 w-20 sm:h-6 sm:w-24 md:h-8 md:w-32 object-contain"
              />
            </a>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {menuLinks.map((item, index) => (
              <a
                key={index}
                href={item.url}
                className="font-inter font-medium text-sm leading-[18px] transition-colors whitespace-nowrap hover:text-blue-600"
                style={{ color: text_color }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right Section: Search, Dark Mode, Cart */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-5 shrink-0">
          {/* Search Bar - Desktop */}
          {show_search && (
            <div className="hidden md:block relative w-[362px]">
              <Search className="w-6 h-6 text-gray-500 absolute left-2 top-2.5" />
              <input
                type="text"
                placeholder={search_placeholder}
                className="w-full h-11 px-4 pl-10 bg-gray-100 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Search Icon - Mobile */}
          {show_search && (
            <button
              onClick={handleSearchClick}
              className="md:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>
          )}

          {/* Dark Mode Toggle */}
          {show_dark_mode && (
            <button className="sm:p-1 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_804_31902)">
                  <path
                    d="M19.1911 12.3256C19.1075 12.2422 19.0019 12.1842 18.8866 12.1583C18.7714 12.1324 18.6511 12.1397 18.5398 12.1794C17.0444 12.7125 15.4284 12.8104 13.8796 12.4617C12.3308 12.113 10.9127 11.3319 9.79009 10.2092C8.66751 9.08659 7.88653 7.66846 7.53788 6.1196C7.18922 4.57075 7.28722 2.95475 7.82047 1.45937C7.86009 1.34808 7.86736 1.22783 7.84143 1.11257C7.8155 0.997306 7.75743 0.891756 7.67396 0.808153C7.59049 0.724549 7.48503 0.666316 7.36981 0.640205C7.25459 0.614093 7.13433 0.621173 7.02297 0.660623C5.67478 1.13671 4.4513 1.9107 3.44359 2.925C1.63711 4.73285 0.622564 7.18414 0.623047 9.73987C0.62353 12.2956 1.639 14.7465 3.44617 16.5537C5.25334 18.3608 7.70425 19.3763 10.26 19.3768C12.8157 19.3773 15.267 18.3627 17.0748 16.5562C18.0892 15.5484 18.8632 14.3247 19.3392 12.9762C19.3785 12.8649 19.3855 12.7447 19.3592 12.6295C19.333 12.5144 19.2747 12.409 19.1911 12.3256ZM16.1911 15.6725C15.3389 16.5223 14.3137 17.1788 13.1853 17.5974C12.0569 18.016 10.8517 18.1869 9.6514 18.0985C8.45112 18.0101 7.28391 17.6644 6.22903 17.085C5.17416 16.5055 4.25631 15.7059 3.53782 14.7404C2.81932 13.7748 2.317 12.666 2.06497 11.4891C1.81293 10.3123 1.81708 9.09496 2.07713 7.91985C2.33717 6.74474 2.84704 5.63934 3.57209 4.67872C4.29715 3.71809 5.22042 2.92473 6.27922 2.3525C5.96577 3.91296 6.04129 5.52658 6.49909 7.05095C6.95689 8.57532 7.7829 9.96356 8.90422 11.0931C10.0337 12.2146 11.4219 13.0408 12.9463 13.4986C14.4707 13.9564 16.0844 14.0318 17.6448 13.7181C17.2584 14.4372 16.7686 15.0956 16.1911 15.6725Z"
                    fill="#1B4B66"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_804_31902">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          )}

          {/* Shopping Cart */}
          {show_cart && (
            <button className="relative sm:p-1 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_804_31898)">
                  <path
                    d="M19.5787 6.75H4.42122C4.23665 6.75 4.05856 6.81806 3.92103 6.94115C3.7835 7.06425 3.69619 7.23373 3.67581 7.41718L2.34248 19.4172C2.33083 19.522 2.34143 19.6281 2.37357 19.7286C2.40572 19.829 2.4587 19.9216 2.52904 20.0002C2.59939 20.0788 2.68553 20.1417 2.78182 20.1847C2.87812 20.2278 2.98241 20.25 3.08789 20.25H20.912C21.0175 20.25 21.1218 20.2278 21.2181 20.1847C21.3144 20.1417 21.4005 20.0788 21.4708 20.0002C21.5412 19.9216 21.5942 19.829 21.6263 19.7286C21.6585 19.6281 21.6691 19.522 21.6574 19.4172L20.3241 7.41718C20.3037 7.23373 20.2164 7.06425 20.0789 6.94115C19.9413 6.81806 19.7632 6.75 19.5787 6.75Z"
                    stroke="#1B4B66"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.25 5.75C8.25 4.75544 8.64509 3.80161 9.34835 3.09835C10.0516 2.39509 11.0054 2 12 2C12.9946 2 13.9484 2.39509 14.6517 3.09835C15.3549 3.80161 15.75 4.75544 15.75 5.75"
                    stroke="#1B4B66"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_804_31898">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 md:w-5 md:h-5 bg-blue-600 text-white text-[9px] sm:text-[10px] md:text-xs rounded-full flex items-center justify-center font-medium">
                3
              </span>
            </button>
          )}

          {/* Hamburger Menu Button - Mobile */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-1 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <img
                src={menuIcon}
                alt="Menu"
                className="w-6 h-6 sm:w-6 sm:h-6"
              />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden border-t border-gray-200"
          style={{ backgroundColor: background_color }}
        >
          <div className="px-4 py-6">
            {/* Mobile Search Bar */}
            {show_search && (
              <div className="mb-6">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={search_placeholder}
                    className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="flex flex-col">
              {menuLinks.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  className={`py-3 text-center transition-colors hover:text-blue-600 ${
                    index < menuLinks.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                  style={{ color: text_color }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar1;
