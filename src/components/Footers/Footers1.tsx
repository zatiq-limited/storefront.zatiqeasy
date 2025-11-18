import React from 'react';
import { Facebook, Instagram, Youtube, Send, Share2 } from 'lucide-react';

interface Footers1Props {
  settings?: Record<string, any>;
  blocks?: any[];
  pageData?: any;
}

export default function Footers1({ settings, blocks, pageData }: Footers1Props) {
  // Extract settings with defaults
  const logo = settings?.logo || '/assets/nav/nav1.png';
  const newsletterText = settings?.newsletterText || "Unlock exclusive deals, early access to sales, and the latest product drops. Stay ahead of the curve with personalized recommendations and style tips delivered to your inbox.";
  const copyright = settings?.copyright || "© 2025 Quantum Retail. Style for the future.";
  
  const footerSections = settings?.footerSections || [
    {
      title: 'Company',
      links: [
        { label: 'Our Story', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Sustainability', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Blog', href: '#' }
      ]
    },
    {
      title: 'Shop',
      links: [
        { label: 'New Arrivals', href: '#' },
        { label: 'Best Sellers', href: '#' },
        { label: 'Brands', href: '#' },
        { label: 'Dresses', href: '#' },
        { label: 'Shoes', href: '#' }
      ]
    },
    {
      title: 'Help Center',
      links: [
        { label: 'Data Protection', href: '#' },
        { label: 'Terms & Conditions', href: '#' },
        { label: 'Size Guide', href: '#' },
        { label: 'Returns', href: '#' }
      ]
    }
  ];

  const socialLinks = settings?.socialLinks || [
    { icon: 'facebook', href: '#', Component: Facebook },
    { icon: 'instagram', href: '#', Component: Instagram },
    { icon: 'share2', href: '#', Component: Share2 },
    { icon: 'youtube', href: '#', Component: Youtube },
    { icon: 'send', href: '#', Component: Send }
  ];

  return (
    <footer className="w-full bg-white py-8 md:py-12 px-4 md:px-8 overflow-hidden font-sans">
      <div className="w-full max-w-7xl mx-auto">
        {/* Logo and Newsletter - Mobile/Tablet First */}
        <div className="w-full mb-8 lg:hidden">
          <img 
            src={logo}
            alt="Logo" 
            className="h-8 mb-6 max-w-full"
          />
          <p className="text-gray-600 text-sm mb-6 leading-relaxed break-words">
            {newsletterText}
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
          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="w-full lg:col-span-1">
              <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-3 md:mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2 md:space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Section - Desktop Only */}
          <div className="w-full hidden lg:block lg:col-span-2">
            <img 
              src={logo}
              alt="Logo" 
              className="h-8 mb-6 max-w-full"
            />
            <p className="text-gray-600 text-sm mb-6 leading-relaxed break-words">
              {newsletterText}
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
          {socialLinks.map((social, index) => {
            const IconComponent = social.Component;
            return (
              <a 
                key={index}
                href={social.href} 
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-md"
              >
                <IconComponent className="w-5 h-5 text-gray-700" />
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <div className="w-full text-left">
          <p className="text-gray-500 text-sm break-words">
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
