import React, { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, ChevronDown, X } from "lucide-react";

const defaultLogoImage = "/assets/nav/nav1.png";
const menuIcon = "/assets/menu_icon.svg";

interface CategoryItem {
  label: string;
  url: string;
}

interface Category {
  label: string;
  type?: string;
  url?: string;
  items?: CategoryItem[];
}

interface Navbar3Props {
  logo?: string;
  show_search?: boolean;
  show_cart?: boolean;
  show_user_icon?: boolean;
  show_language_selector?: boolean;
  background_color?: string;
  category_bar_color?: string;
  text_color?: string;
  sticky?: boolean;
  search_placeholder?: string;
  cart_count?: number;
  cart_total?: string;
  categories?: Category[];
}

const Navbar3: React.FC<Navbar3Props> = ({
  logo = defaultLogoImage,
  show_search = true,
  show_cart = true,
  show_user_icon = true,
  show_language_selector = true,
  background_color = "#FFFFFF",
  category_bar_color = "#3465F0",
  sticky = true,
  search_placeholder = "Discover exactly what you need with a simple search",
  cart_count = 2,
  cart_total = "12,000 BDT",
  categories: propCategories,
}) => {
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

  // Default categories if none provided
  const defaultCategories = [
    {
      label: "All Products",
      type: "dropdown",
      items: [
        { label: "Electronics", url: "#" },
        { label: "Fashion", url: "#" },
        { label: "Home & Garden", url: "#" },
        { label: "Sports", url: "#" },
      ],
    },
    {
      label: "Headphones",
      type: "dropdown",
      items: [
        { label: "Wireless", url: "#" },
        { label: "Wired", url: "#" },
        { label: "Gaming", url: "#" },
        { label: "Noise Cancelling", url: "#" },
      ],
    },
    {
      label: "Electronics",
      type: "dropdown",
      items: [
        { label: "Laptops", url: "#" },
        { label: "Tablets", url: "#" },
        { label: "Cameras", url: "#" },
        { label: "Smart Watches", url: "#" },
      ],
    },
  ];

  // Use provided categories or default
  const categories =
    propCategories && propCategories.length > 0
      ? propCategories
      : defaultCategories;

  return (
    <nav
      className={`mb-1 ${sticky ? "sticky top-0 z-50" : ""}`}
      style={{ backgroundColor: background_color }}
    >
      {/* Top Row */}
      <div className="border-b border-gray-200 px-3 sm:px-4 md:px-8 lg:px-16 py-3 md:py-8">
        <div className="flex justify-center items-center gap-2">
          {/* Logo */}
          <div className="shrink-0">
            <a href="/">
              <img
                src={logo}
                alt="Logo"
                className="h-5 w-20 sm:h-6 sm:w-24 md:h-10 md:w-44 object-contain"
              />
            </a>
          </div>

          {/* Search Bar - Desktop */}
          {show_search && (
            <div className="hidden md:flex flex-1 max-w-lg min-h-11 mx-4 lg:mx-12">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={search_placeholder}
                  className="w-full py-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-sm font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0">
            {/* Search Icon - Mobile */}
            <button
              onClick={handleSearchClick}
              className="md:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            </button>

            {/* Shopping Cart */}
            {show_cart && (
              <button className="flex items-center gap-2 p-1.5 sm:p-2 rounded-lg transition-colors relative shrink-0">
                <div className="relative w-10 h-10 bg-[#F8F8F8] rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
                  <span className="absolute -top-1.5 -right-1.5 sm:-top-0.5 sm:-right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                    {cart_count}
                  </span>
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-sm font-normal text-gray-500 whitespace-nowrap">
                    Shopping Cart
                  </div>
                  <div className="text-base font-normal text-gray-900 whitespace-nowrap">
                    {cart_total}
                  </div>
                </div>
              </button>
            )}

            {/* Divider */}
            {show_cart && show_user_icon && (
              <div className="hidden md:block h-3 w-px bg-gray-200 mx-2"></div>
            )}

            {/* User Icon */}
            {show_user_icon && (
              <button className="w-10 h-10 bg-[#F8F8F8] rounded-full p-1.5 sm:p-2 hover:bg-gray-100 transition-colors shrink-0">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.00002 21.8174C4.6026 22 5.41649 22 6.8 22H17.2C18.5835 22 19.3974 22 20 21.8174M4.00002 21.8174C3.87082 21.7783 3.75133 21.7308 3.63803 21.673C3.07354 21.3854 2.6146 20.9265 2.32698 20.362C2 19.7202 2 18.8802 2 17.2V6.8C2 5.11984 2 4.27976 2.32698 3.63803C2.6146 3.07354 3.07354 2.6146 3.63803 2.32698C4.27976 2 5.11984 2 6.8 2H17.2C18.8802 2 19.7202 2 20.362 2.32698C20.9265 2.6146 21.3854 3.07354 21.673 3.63803C22 4.27976 22 5.11984 22 6.8V17.2C22 18.8802 22 19.7202 21.673 20.362C21.3854 20.9265 20.9265 21.3854 20.362 21.673C20.2487 21.7308 20.1292 21.7783 20 21.8174M4.00002 21.8174C4.00035 21.0081 4.00521 20.5799 4.07686 20.2196C4.39249 18.6329 5.63288 17.3925 7.21964 17.0769C7.60603 17 8.07069 17 9 17H15C15.9293 17 16.394 17 16.7804 17.0769C18.3671 17.3925 19.6075 18.6329 19.9231 20.2196C19.9948 20.5799 19.9996 21.0081 20 21.8174M16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5C8 7.29086 9.79086 5.5 12 5.5C14.2091 5.5 16 7.29086 16 9.5Z"
                    stroke="#666666"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            )}

            {/* Divider */}
            {show_user_icon && show_language_selector && (
              <div className="hidden md:block h-3 w-px bg-gray-200 mx-2"></div>
            )}

            {/* Language Selector */}
            {show_language_selector && (
              <button className="hidden md:flex items-center gap-1 px-2 py-1.5 md:px-3 md:py-2 rounded-lg transition-colors shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <rect
                    width="20"
                    height="20"
                    rx="10"
                    fill="url(#pattern0_804_32007)"
                  />
                  <defs>
                    <pattern
                      id="pattern0_804_32007"
                      patternContentUnits="objectBoundingBox"
                      width="1"
                      height="1"
                    >
                      <use
                        xlinkHref="#image0_804_32007"
                        transform="scale(0.025)"
                      />
                    </pattern>
                    <image
                      id="image0_804_32007"
                      width="40"
                      height="40"
                      preserveAspectRatio="none"
                      xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAydpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMS1jMDAxIDc5LjE0NjI4OTk3NzcsIDIwMjMvMDYvMjUtMjM6NTc6MTQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMDI0IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo4QzdDRTU4M0Q3RDcxMUVFOENERERDNjdFNkYzMEZDMSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo4QzdDRTU4NEQ3RDcxMUVFOENERERDNjdFNkYzMEZDMSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjhDN0NFNTgxRDdENzExRUU4Q0REREM2N0U2RjMwRkMxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjhDN0NFNTgyRDdENzExRUU4Q0REREM2N0U2RjMwRkMxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+PPjkBAAACu1JREFUeNrM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"
                    />
                  </defs>
                </svg>

                <span className="text-sm font-medium text-gray-700">EN</span>
                <ChevronDown className="w-4 h-4 text-gray-700" />
              </button>
            )}

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
      <div
        className="hidden lg:block min-h-12 px-4 md:px-8 lg:px-16"
        style={{ backgroundColor: category_bar_color }}
      >
        <div className="flex items-center justify-center gap-0.5">
          {categories.map((category, index) => {
            const hasDropdown =
              category.type === "dropdown" &&
              category.items &&
              category.items.length > 0;
            return (
              <div key={index} className="relative group shrink-0">
                <button
                  onMouseEnter={() => setOpenDropdown(category.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                  className="flex items-center gap-1 px-2 lg:px-6 py-3 text-white hover:bg-blue-700 transition-colors text-xs lg:text-sm font-normal whitespace-nowrap leading-6"
                >
                  <span className="truncate max-w-20 xl:max-w-[120px] 2xl:max-w-none">
                    {category.label}
                  </span>
                  {hasDropdown && (
                    <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" />
                  )}
                </button>
                {hasDropdown && openDropdown === category.label && (
                  <div
                    onMouseEnter={() => setOpenDropdown(category.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    className="absolute top-full left-0 mt-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                  >
                    {category.items?.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.url || "#"}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors text-sm"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-6 max-h-[80vh] overflow-y-auto">
            {/* Mobile Search */}
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

            {/* Mobile Categories */}
            <div className="flex flex-col">
              {categories.map((category, index) => {
                const hasDropdown =
                  category.type === "dropdown" &&
                  category.items &&
                  category.items.length > 0;
                return (
                  <div key={index} className="border-b border-gray-100">
                    <button
                      onClick={() => toggleDropdown(`mobile-${category.label}`)}
                      className="flex items-center justify-between w-full text-gray-600 hover:text-blue-600 py-3 transition-colors"
                    >
                      <span>{category.label}</span>
                      {hasDropdown && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openDropdown === `mobile-${category.label}`
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      )}
                    </button>
                    {hasDropdown &&
                      openDropdown === `mobile-${category.label}` && (
                        <div className="pb-3 flex flex-col">
                          {category.items?.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.url || "#"}
                              className="text-gray-500 hover:text-blue-600 transition-colors py-2 pl-4 text-sm"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {item.label}
                            </a>
                          ))}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Language Selector */}
            {show_language_selector && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    English (EN)
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar3;
