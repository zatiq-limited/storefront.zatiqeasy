import React from 'react';
import { Facebook, Instagram, Youtube, Send, Share2 } from 'lucide-react';

const Footers1: React.FC = () => {
  return (
    <footer className="w-full bg-white py-8 md:py-12 px-4 md:px-8 overflow-hidden font-sans">
      <div className="w-full max-w-7xl mx-auto">
        {/* Logo and Newsletter - Mobile/Tablet First */}
        <div className="w-full mb-8 lg:hidden">
          <img 
            src="/src/assets/image/nav/nav1.png" 
            alt="Logo" 
            className="h-8 mb-6 max-w-full"
          />
          <p className="text-gray-600 text-sm mb-6 leading-relaxed break-words">
            Unlock exclusive deals, early access to sales, and the latest product drops. Stay ahead of the curve with personalized recommendations and style tips delivered to your inbox.
          </p>
          <div className="w-full relative mb-8">
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md">
              <Send className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="w-full grid grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
          {/* Company Section */}
          <div className="w-full lg:col-span-1">
            <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
              Company
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Shop Section */}
          <div className="w-full lg:col-span-1">
            <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
              Shop
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Brands
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Dresses
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Shoes
                </a>
              </li>
            </ul>
          </div>

          {/* Help Center Section */}
          <div className="w-full lg:col-span-1">
            <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
              Help Center
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Data Protection
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section - Desktop Only */}
          <div className="w-full hidden lg:block lg:col-span-2">
            <img 
              src="/src/assets/image/nav/nav1.png" 
              alt="Logo" 
              className="h-8 mb-6 max-w-full"
            />
            <p className="text-gray-600 text-sm mb-6 leading-relaxed break-words">
              Unlock exclusive deals, early access to sales, and the latest product drops. Stay ahead of the curve with personalized recommendations and style tips delivered to your inbox.
            </p>
            <div className="w-full relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-md">
                <Send className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="w-full flex justify-start items-center gap-3 md:gap-4 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-200">
          <a href="#" className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-md">
            <Facebook className="w-5 h-5 text-gray-700" />
          </a>
          <a href="#" className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-md">
            <Instagram className="w-5 h-5 text-gray-700" />
          </a>
          <a href="#" className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-md">
            <Share2 className="w-5 h-5 text-gray-700" />
          </a>
          <a href="#" className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-md">
            <Youtube className="w-5 h-5 text-gray-700" />
          </a>
          <a href="#" className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-md">
            <Send className="w-5 h-5 text-gray-700" />
          </a>
        </div>

        {/* Copyright */}
        <div className="w-full text-left">
          <p className="text-gray-500 text-sm break-words">
            © 2025 Quantum Retail. Style for the future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footers1;
