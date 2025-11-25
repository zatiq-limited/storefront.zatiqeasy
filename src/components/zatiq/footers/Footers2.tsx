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

interface MenuColumn {
  title: string;
  links: Link[];
}

interface ContactInfo {
  title: string;
  whatsapp?: string;
  mobile?: string;
  email?: string;
}

interface Footers2Settings {
  backgroundColor?: string;
  textColor?: string;
  bottomBarColor?: string;
  logo?: string;
  description?: string;
  copyrightText?: string;
  showSocial?: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
}

interface Footers2Props {
  settings?: Footers2Settings;
  blocks?: MenuColumn[];
  contact?: ContactInfo;
  paymentIcons?: PaymentIcon[];
}

const Footers2: React.FC<Footers2Props> = ({
  settings = {},
  blocks = [],
  contact,
  paymentIcons = [],
}) => {
  const {
    backgroundColor = '#F9FAFB',
    textColor = '#000000',
    bottomBarColor = '#1F2937',
    logo = '/src/assets/image/nav/nav1.png',
    description = 'Digital Haven is a top-notch store offering a wide range of digital products at unbeatable prices from renowned global brands. Dive in now to discover fresh designs and take advantage of fantastic deals and discounts.',
    copyrightText = 'All rights reserved for Zatiq Ltd © 2025',
    showSocial = true,
    facebookUrl = '#',
    instagramUrl = '#',
    twitterUrl = '#',
    linkedinUrl = '#',
  } = settings;

  const menuColumns = blocks;
  const contactInfo = contact || {
    title: 'Contact us',
    whatsapp: '009612345678932',
    mobile: '009612345678932',
    email: 'support@zatiq.com',
  };

  return (
    <footer className="w-full overflow-hidden font-sans" style={{ backgroundColor }}>
      {/* Main Footer Content */}
      <div className="w-full py-8 md:py-12" style={{ backgroundColor, color: textColor }}>
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
            {contactInfo && (
              <div className="order-1 lg:order-4">
                <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-3 md:mb-4">
                  {contactInfo.title}
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {contactInfo.whatsapp && (
                    <li>
                      <div className="text-xs md:text-sm text-gray-600">
                        <p className="font-medium text-gray-900">WhatsApp</p>
                        <p className="wrap-break-word">{contactInfo.whatsapp}</p>
                      </div>
                    </li>
                  )}
                  {contactInfo.mobile && (
                    <li>
                      <div className="text-xs md:text-sm text-gray-600">
                        <p className="font-medium text-gray-900">Mobile</p>
                        <p className="wrap-break-word">{contactInfo.mobile}</p>
                      </div>
                    </li>
                  )}
                  {contactInfo.email && (
                    <li>
                      <div className="text-xs md:text-sm text-gray-600">
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="wrap-break-word">{contactInfo.email}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Menu Columns from blocks */}
            {menuColumns.map((column, index) => (
              <div key={index} className={`order-${index + 2} lg:order-${index + 2}`}>
                <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-3 md:mb-4">
                  {column.title}
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {column.links.map((link, idx) => (
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
            {showSocial && (
              <div className="hidden lg:block lg:order-5 lg:col-span-1">
                <h4 className="text-base font-semibold text-gray-900 mb-4">
                  Follow us on
                </h4>
                <div className="flex gap-3">
                  {facebookUrl && (
                    <a href={facebookUrl} className="text-gray-600 hover:text-gray-900">
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {instagramUrl && (
                    <a href={instagramUrl} className="text-gray-600 hover:text-gray-900">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {twitterUrl && (
                    <a href={twitterUrl} className="text-gray-600 hover:text-gray-900">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {linkedinUrl && (
                    <a href={linkedinUrl} className="text-gray-600 hover:text-gray-900">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Follow us on - Mobile/Tablet Only */}
          {showSocial && (
            <div className="mt-8 pt-6 border-t border-gray-200 lg:hidden">
              <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-4">
                Follow us on
              </h4>
              <div className="flex gap-4">
                {facebookUrl && (
                  <a href={facebookUrl} className="text-gray-600 hover:text-gray-900">
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {instagramUrl && (
                  <a href={instagramUrl} className="text-gray-600 hover:text-gray-900">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {twitterUrl && (
                  <a href={twitterUrl} className="text-gray-600 hover:text-gray-900">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {linkedinUrl && (
                  <a href={linkedinUrl} className="text-gray-600 hover:text-gray-900">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer - Dark Section */}
      <div className="w-full py-4" style={{ backgroundColor: bottomBarColor }}>
        <div className="max-w-[1440px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-white text-sm">
            {copyrightText}
          </p>

          {/* Payment Methods */}
          {paymentIcons.length > 0 && (
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
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footers2;
