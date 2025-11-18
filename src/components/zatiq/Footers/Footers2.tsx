import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footers2: React.FC = () => {
  return (
    <footer className="w-full bg-white overflow-hidden font-sans">
      {/* Main Footer Content */}
      <div className="w-full bg-gray-50 py-8 md:py-12 px-2 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Logo and Description - Full width on mobile/tablet */}
          <div className="mb-8 lg:hidden">
            <div className="mb-6">
              <img 
                src="/src/assets/image/nav/nav1.png" 
                alt="Logo" 
                className="h-8 max-w-full"
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Digital Haven is a top-notch store offering a wide range of digital products at unbeatable prices from renowned global brands. Dive in now to discover fresh designs and take advantage of fantastic deals and discounts.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
            {/* Brand Description - Desktop Only */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="mb-6">
                <img 
                  src="/src/assets/image/nav/nav1.png" 
                  alt="Logo" 
                  className="h-8 max-w-full"
                />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Digital Haven is a top-notch store offering a wide range of digital products at unbeatable prices from renowned global brands. Dive in now to discover fresh designs and take advantage of fantastic deals and discounts.
              </p>
            </div>

            {/* Contact Us - First on mobile */}
            <div className="order-1 lg:order-4">
              <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-3 md:mb-4">
                Contact us
              </h3>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <div className="text-xs md:text-sm text-gray-600">
                    <p className="font-medium text-gray-900">WhatsApp</p>
                    <p className="wrap-break-word">009612345678932</p>
                  </div>
                </li>
                <li>
                  <div className="text-xs md:text-sm text-gray-600">
                    <p className="font-medium text-gray-900">Mobile</p>
                    <p className="wrap-break-word">009612345678932</p>
                  </div>
                </li>
                <li>
                  <div className="text-xs md:text-sm text-gray-600">
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="wrap-break-word">support@zatiq.com</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* My Account - Second on mobile */}
            <div className="order-2 lg:order-2">
              <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-3 md:mb-4">
                My Account
              </h3>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                    My Orders
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                    Shopping Cart
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                    Favorites
                  </a>
                </li>
              </ul>
            </div>

            {/* Important Links - Third on mobile */}
            <div className="order-3 lg:order-3">
              <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-3 md:mb-4">
                Important Links
              </h3>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                    Terms and Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                    Technical Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow us on - Desktop Only (5th column) */}
            <div className="hidden lg:block lg:order-5 lg:col-span-1">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                Follow us on
              </h4>
              <div className="flex gap-3">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Follow us on - Mobile/Tablet Only */}
          <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden">
            <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-4">
              Follow us on
            </h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Dark Section */}
      <div className="w-full bg-gray-800 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-white text-sm">
            All rights reserved for Zatiq Ltd © 2025
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <img 
              src="/src/assets/image/payment/bkash.png" 
              alt="bKash" 
              className="h-8 object-contain"
            />
            <img 
              src="/src/assets/image/payment/paypal.png" 
              alt="PayPal" 
              className="h-8 object-contain"
            />
            <img 
              src="/src/assets/image/payment/master.png" 
              alt="Mastercard" 
              className="h-8 object-contain"
            />
            <img 
              src="/src/assets/image/payment/visa.png" 
              alt="Visa" 
              className="h-8 object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footers2;
