import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

const defaultLogoImage = "/assets/nav/nav1.png";
const menuIcon = "/assets/menu_icon.svg";

interface MenuItemChild {
  label: string;
  url: string;
}

interface MenuItem {
  label: string;
  type?: string;
  url?: string;
  items?: MenuItemChild[];
}

interface Navbar2Props {
  logo?: string;
  show_search?: boolean;
  show_cart?: boolean;
  show_dark_mode?: boolean;
  background_color?: string;
  text_color?: string;
  transparent?: boolean;
  sticky?: boolean;
  menu_items?: MenuItem[];
  search_placeholder?: string;
  fontFamily?: string;
}

const Navbar2: React.FC<Navbar2Props> = ({
  logo = defaultLogoImage,
  show_search = true,
  show_cart = true,
  show_dark_mode = true,
  background_color = "#FFFFFF",
  text_color = "#000000",
  transparent = false,
  sticky = false,
  menu_items,
  search_placeholder = "Search...",
  fontFamily,
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

  // Default menu items if none provided
  const defaultMenuItems: MenuItem[] = [
    {
      label: "Bags",
      type: "dropdown",
      items: [
        { label: "Handbags", url: "#" },
        { label: "Backpacks", url: "#" },
        { label: "Clutches", url: "#" },
        { label: "Tote Bags", url: "#" },
      ],
    },
    {
      label: "Shoes",
      type: "dropdown",
      items: [
        { label: "Sneakers", url: "#" },
        { label: "Formal Shoes", url: "#" },
        { label: "Sandals", url: "#" },
        { label: "Boots", url: "#" },
      ],
    },
    {
      label: "Lookbook",
      type: "link",
      url: "#",
    },
  ];

  const menuLinks =
    menu_items && menu_items.length > 0 ? menu_items : defaultMenuItems;

  return (
    <nav
      className={`py-3 md:py-4 border-b border-gray-200 mb-1 ${
        sticky ? "sticky top-0 z-50" : ""
      } ${transparent ? "bg-transparent" : ""}`}
      style={{
        backgroundColor: transparent ? "transparent" : background_color,
        fontFamily: fontFamily || undefined
      }}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0 flex justify-between items-center gap-2">
        {/* Logo and Navigation */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
          <a href="/">
            <img
              src={logo}
              alt="Logo"
              className="w-[90px] h-[22px] shrink-0 object-contain"
            />
          </a>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
            {menuLinks.map((item, index) => {
              const hasDropdown =
                item.type === "dropdown" && item.items && item.items.length > 0;

              if (hasDropdown) {
                return (
                  <div key={index} className="relative group">
                    <button
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                      className="flex items-center gap-1 hover:text-blue-600 font-assistant font-normal text-sm leading-[150%] tracking-[0.02em] transition-colors whitespace-nowrap"
                      style={{ color: text_color }}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {openDropdown === item.label && (
                      <div
                        onMouseEnter={() => setOpenDropdown(item.label)}
                        onMouseLeave={() => setOpenDropdown(null)}
                        className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                      >
                        {item.items?.map((subItem, subIndex) => (
                          <a
                            key={subIndex}
                            href={subItem.url || "#"}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-assistant font-normal text-sm leading-[150%] tracking-[0.02em] transition-colors"
                          >
                            {subItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={index}
                  href={item.url || "#"}
                  className="hover:text-blue-600 font-assistant font-normal text-sm leading-[150%] tracking-[0.02em] transition-colors whitespace-nowrap"
                  style={{ color: text_color }}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Section: Dark Mode, Search, Cart */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-2 shrink-0">
          {/* Dark Mode Toggle */}
          {show_dark_mode && (
            <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_804_31923)">
                  <path
                    d="M19.1911 12.3256C19.1075 12.2422 19.0019 12.1842 18.8866 12.1583C18.7714 12.1324 18.6511 12.1397 18.5398 12.1794C17.0444 12.7125 15.4284 12.8104 13.8796 12.4617C12.3308 12.113 10.9127 11.3319 9.79009 10.2092C8.66751 9.0866 7.88653 7.66846 7.53788 6.11961C7.18922 4.57075 7.28722 2.95475 7.82047 1.45938C7.86009 1.34808 7.86736 1.22783 7.84143 1.11257C7.8155 0.997308 7.75743 0.891758 7.67396 0.808154C7.59049 0.724551 7.48503 0.666318 7.36981 0.640207C7.25459 0.614095 7.13433 0.621175 7.02297 0.660625C5.67478 1.13671 4.4513 1.9107 3.44359 2.925C1.63711 4.73285 0.622564 7.18415 0.623047 9.73987C0.62353 12.2956 1.639 14.7465 3.44617 16.5537C5.25334 18.3608 7.70425 19.3763 10.26 19.3768C12.8157 19.3773 15.267 18.3627 17.0748 16.5563C18.0892 15.5484 18.8632 14.3247 19.3392 12.9762C19.3785 12.8649 19.3855 12.7447 19.3592 12.6295C19.333 12.5144 19.2747 12.409 19.1911 12.3256ZM16.1911 15.6725C15.3389 16.5223 14.3137 17.1788 13.1853 17.5974C12.0569 18.016 10.8517 18.1869 9.6514 18.0985C8.45112 18.0101 7.28391 17.6644 6.22903 17.085C5.17416 16.5055 4.25631 15.7059 3.53782 14.7404C2.81932 13.7748 2.317 12.666 2.06497 11.4891C1.81293 10.3123 1.81708 9.09496 2.07713 7.91985C2.33717 6.74474 2.84704 5.63935 3.57209 4.67872C4.29715 3.71809 5.22042 2.92473 6.27922 2.3525C5.96577 3.91296 6.04129 5.52659 6.49909 7.05095C6.95689 8.57532 7.7829 9.96356 8.90422 11.0931C10.0337 12.2146 11.4219 13.0408 12.9463 13.4986C14.4707 13.9564 16.0844 14.0318 17.6448 13.7181C17.2584 14.4372 16.7686 15.0956 16.1911 15.6725Z"
                    fill="#181D25"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_804_31923">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          )}

          {/* Search */}
          {show_search && (
            <button
              onClick={handleSearchClick}
              className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.0108 13.7179C11.7372 14.8278 10.0721 15.5 8.25 15.5C4.24594 15.5 1 12.2541 1 8.25C1 4.24594 4.24594 1 8.25 1C12.2541 1 15.5 4.24594 15.5 8.25C15.5 10.0721 14.8278 11.7372 13.7179 13.0108L19.8536 19.1464L19.1464 19.8536L13.0108 13.7179ZM14.5 8.25C14.5 11.7018 11.7018 14.5 8.25 14.5C4.79822 14.5 2 11.7018 2 8.25C2 4.79822 4.79822 2 8.25 2C11.7018 2 14.5 4.79822 14.5 8.25Z"
                  fill="black"
                />
              </svg>
            </button>
          )}

          {/* Shopping Cart */}
          {show_cart && (
            <button className=" hover:bg-gray-100 rounded-lg transition-colors shrink-0">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.9416 12H11.7816L11.0116 23.6C10.965 24.2838 11.0594 24.9699 11.2891 25.6156C11.5188 26.2614 11.8788 26.853 12.3468 27.3538C12.8147 27.8546 13.3806 28.2538 14.0094 28.5266C14.6381 28.7995 15.3162 28.9402 16.0016 28.94H23.3816C24.0661 28.9401 24.7433 28.7997 25.3713 28.5274C25.9993 28.2552 26.5647 27.8569 27.0325 27.3572C27.5003 26.8575 27.8605 26.2671 28.0909 25.6226C28.3212 24.978 28.4167 24.293 28.3716 23.61L27.5916 12H21.2666H14.9416ZM12.7216 13H14.9416V13.63C14.9416 14.2538 15.0644 14.8714 15.3031 15.4477C15.5419 16.024 15.8917 16.5477 16.3328 16.9888C16.7739 17.4298 17.2975 17.7797 17.8738 18.0184C18.4501 18.2571 19.0678 18.38 19.6916 18.38C20.3154 18.38 20.933 18.2571 21.5093 18.0184C22.0856 17.7797 22.6093 17.4298 23.0503 16.9888C23.4914 16.5477 23.8413 16.024 24.08 15.4477C24.3187 14.8714 24.4416 14.2538 24.4416 13.63V13H26.6616L27.3816 23.67C27.4186 24.2175 27.3426 24.7669 27.1582 25.2838C26.9739 25.8007 26.6851 26.2741 26.3099 26.6746C25.9347 27.0752 25.4811 27.3942 24.9773 27.6119C24.4736 27.8296 23.9304 27.9413 23.3816 27.94H16.0016C15.4536 27.9399 14.9115 27.8272 14.4089 27.6089C13.9063 27.3906 13.4539 27.0713 13.0798 26.671C12.7057 26.2706 12.4178 25.7976 12.2341 25.2814C12.0503 24.7652 11.9746 24.2167 12.0116 23.67L12.7216 13ZM15.9416 13H23.4416V13.63C23.4416 14.6246 23.0465 15.5784 22.3432 16.2816C21.64 16.9849 20.6861 17.38 19.6916 17.38C18.697 17.38 17.7432 16.9849 17.0399 16.2816C16.3367 15.5784 15.9416 14.6246 15.9416 13.63V13Z"
                  fill="black"
                />
              </svg>
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
              <img src={menuIcon} alt="Menu" className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden border-t border-gray-200"
          style={{ backgroundColor: transparent ? "white" : background_color }}
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
              {menuLinks.map((item, index) => {
                const hasDropdown =
                  item.type === "dropdown" &&
                  item.items &&
                  item.items.length > 0;
                const mobileDropdownKey = `mobile-${item.label}`;

                if (hasDropdown) {
                  return (
                    <div key={index} className="border-b border-gray-100">
                      <button
                        onClick={() => toggleDropdown(mobileDropdownKey)}
                        className="flex items-center justify-between w-full hover:text-blue-600 py-3 transition-colors"
                        style={{ color: text_color }}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            openDropdown === mobileDropdownKey
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      {openDropdown === mobileDropdownKey && (
                        <div className="pb-3 flex flex-col">
                          {item.items?.map((subItem, subIndex) => (
                            <a
                              key={subIndex}
                              href={subItem.url || "#"}
                              className="text-gray-500 hover:text-blue-600 transition-colors py-2 pl-4 text-sm"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subItem.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <a
                    key={index}
                    href={item.url || "#"}
                    className="hover:text-blue-600 py-3 text-center transition-colors border-b border-gray-100"
                    style={{ color: text_color }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar2;
