import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

interface Footers2Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function Footers2({ settings, blocks, pageData }: Footers2Props) {
  // Extract settings with defaults
  const logo = settings?.logo || '/assets/nav/nav1.png';
  const description = settings?.description || "Digital Haven is a top-notch store offering a wide range of digital products at unbeatable prices from renowned global brands. Dive in now to discover fresh designs and take advantage of fantastic deals and discounts.";
  const copyright = settings?.copyright || "All rights reserved for Zatiq Ltd © 2025";
  
  const contactInfo = settings?.contactInfo || {
    whatsapp: '009612345678932',
    mobile: '009612345678932',
    email: 'support@zatiq.com'
  };

  const footerSections = settings?.footerSections || [
    {
      title: 'My Account',
      links: [
        { label: 'My Orders', href: '#' },
        { label: 'Shopping Cart', href: '#' },
        { label: 'Favorites', href: '#' }
      ]
    },
    {
      title: 'Important Links',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms and Conditions', href: '#' },
        { label: 'Technical Support', href: '#' }
      ]
    }
  ];

  const socialLinks = settings?.socialLinks || [
    { icon: 'facebook', href: '#', Component: Facebook },
    { icon: 'instagram', href: '#', Component: Instagram },
    { icon: 'twitter', href: '#', Component: Twitter },
    { icon: 'linkedin', href: '#', Component: Linkedin }
  ];

  const paymentMethods = settings?.paymentMethods || [
    { name: 'bKash', logo: '/assets/payment/bkash.png' },
    { name: 'PayPal', logo: '/assets/payment/paypal.png' },
    { name: 'Mastercard', logo: '/assets/payment/master.png' },
    { name: 'Visa', logo: '/assets/payment/visa.png' }
  ];

  return (
    <footer className="w-full bg-white overflow-hidden font-sans">
      {/* Main Footer Content */}
      <div className="w-full bg-gray-50 py-8 md:py-12 px-2 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Logo and Description - Full width on mobile/tablet */}
          <div className="mb-8 lg:hidden">
            <div className="mb-6">
              <img 
                src={logo}
                alt="Logo" 
                className="h-8 max-w-full"
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
            {/* Brand Description - Desktop Only */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="mb-6">
                <img 
                  src={logo}
                  alt="Logo" 
                  className="h-8 max-w-full"
                />
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
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
                    <p className="wrap-break-word">{contactInfo.whatsapp}</p>
                  </div>
                </li>
                <li>
                  <div className="text-xs md:text-sm text-gray-600">
                    <p className="font-medium text-gray-900">Mobile</p>
                    <p className="wrap-break-word">{contactInfo.mobile}</p>
                  </div>
                </li>
                <li>
                  <div className="text-xs md:text-sm text-gray-600">
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="wrap-break-word">{contactInfo.email}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* My Account - Second on mobile */}
            <div className="order-2 lg:order-2">
              <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-3 md:mb-4">
                {footerSections[0].title}
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {footerSections[0].links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Links - Third on mobile */}
            <div className="order-3 lg:order-3">
              <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-3 md:mb-4">
                {footerSections[1].title}
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {footerSections[1].links.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Follow us on - Desktop Only (5th column) */}
            <div className="hidden lg:block lg:order-5 lg:col-span-1">
              <h4 className="text-base font-semibold text-gray-900 mb-4">
                Follow us on
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.Component;
                  return (
                    <a key={index} href={social.href} className="text-gray-600 hover:text-gray-900">
                      <IconComponent className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Follow us on - Mobile/Tablet Only */}
          <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden">
            <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-4">
              Follow us on
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.Component;
                return (
                  <a key={index} href={social.href} className="text-gray-600 hover:text-gray-900">
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Dark Section */}
      <div className="w-full bg-gray-800 py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-white text-sm">
            {copyright}
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            {paymentMethods.map((method, index) => (
              <img 
                key={index}
                src={method.logo}
                alt={method.name}
                className="h-8 object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
