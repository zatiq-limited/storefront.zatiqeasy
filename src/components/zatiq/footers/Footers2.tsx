import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

// Type definitions
interface Link {
  text: string;
  url: string;
}

interface PaymentIcon {
  src: string;
  alt: string;
}

interface ContactBlock {
  id: string;
  type: 'contact';
  settings: {
    title: string;
    whatsapp?: string;
    mobile?: string;
    email?: string;
  };
}

interface MenuColumnBlock {
  id: string;
  type: 'menu_column';
  settings: {
    title: string;
    links: Link[];
  };
}

type FooterBlock = ContactBlock | MenuColumnBlock;

interface Footers2Props {
  logo: string;
  description: string;
  copyrightText: string;
  paymentIcons: PaymentIcon[];
  blocks: FooterBlock[];
}

const Footers2: React.FC<Footers2Props> = ({
  logo,
  description,
  copyrightText,
  paymentIcons,
  blocks
}) => {
  // Return null if no data provided
  if (!logo || !description || !copyrightText || !paymentIcons || !blocks || blocks.length === 0) {
    return null;
  }

  // Separate contact block from menu columns
  const contactBlock = blocks.find((block): block is ContactBlock => block.type === 'contact');
  const menuColumns = blocks.filter((block): block is MenuColumnBlock => block.type === 'menu_column');

  return (
    <footer className="w-full bg-white overflow-hidden font-sans">
      {/* Main Footer Content */}
      <div className="w-full bg-gray-50 py-8 md:py-12">
        <div className="max-w-[1440px] mx-auto px-4">
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
            {contactBlock && (
              <div className="order-1 lg:order-4">
                <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-3 md:mb-4">
                  {contactBlock.settings.title}
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {contactBlock.settings.whatsapp && (
                    <li>
                      <div className="text-xs md:text-sm text-gray-600">
                        <p className="font-medium text-gray-900">WhatsApp</p>
                        <p className="wrap-break-word">{contactBlock.settings.whatsapp}</p>
                      </div>
                    </li>
                  )}
                  {contactBlock.settings.mobile && (
                    <li>
                      <div className="text-xs md:text-sm text-gray-600">
                        <p className="font-medium text-gray-900">Mobile</p>
                        <p className="wrap-break-word">{contactBlock.settings.mobile}</p>
                      </div>
                    </li>
                  )}
                  {contactBlock.settings.email && (
                    <li>
                      <div className="text-xs md:text-sm text-gray-600">
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="wrap-break-word">{contactBlock.settings.email}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Menu Columns from blocks */}
            {menuColumns.map((column, index) => (
              <div key={column.id} className={`order-${index + 2} lg:order-${index + 2}`}>
                <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-3 md:mb-4">
                  {column.settings.title}
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {column.settings.links.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.url} className="text-xs md:text-sm text-gray-600 hover:text-gray-900">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

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
      <div className="w-full bg-gray-800 py-4">
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-white text-sm">
            {copyrightText}
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            {paymentIcons.map((icon, index) => (
              <img
                key={index}
                src={icon.src}
                alt={icon.alt}
                className="h-8 object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footers2;
