import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

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
  fontFamily?: string;
  // Contact settings (flat format)
  contactTitle?: string;
  whatsapp?: string;
  mobile?: string;
  email?: string;
  // Column 1 settings (flat format)
  column1Title?: string;
  column1Link1Text?: string;
  column1Link1Url?: string;
  column1Link2Text?: string;
  column1Link2Url?: string;
  column1Link3Text?: string;
  column1Link3Url?: string;
  column1Link4Text?: string;
  column1Link4Url?: string;
  // Column 2 settings (flat format)
  column2Title?: string;
  column2Link1Text?: string;
  column2Link1Url?: string;
  column2Link2Text?: string;
  column2Link2Url?: string;
  column2Link3Text?: string;
  column2Link3Url?: string;
  column2Link4Text?: string;
  column2Link4Url?: string;
  // Payment icons settings (flat format)
  showPaymentIcons?: boolean;
  payment1Image?: string;
  payment1Alt?: string;
  payment2Image?: string;
  payment2Alt?: string;
  payment3Image?: string;
  payment3Alt?: string;
  payment4Image?: string;
  payment4Alt?: string;
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
    backgroundColor = "#F9FAFB",
    textColor = "#000000",
    bottomBarColor = "#1F2937",
    logo = "/src/assets/image/nav/nav1.png",
    description = "Digital Haven is a top-notch store offering a wide range of digital products at unbeatable prices from renowned global brands. Dive in now to discover fresh designs and take advantage of fantastic deals and discounts.",
    copyrightText = "All rights reserved for Zatiq Ltd © 2025",
    showSocial = true,
    facebookUrl = "#",
    instagramUrl = "#",
    twitterUrl = "#",
    linkedinUrl = "#",
    fontFamily,
    // Flat format settings
    contactTitle,
    whatsapp,
    mobile,
    email,
    column1Title,
    column1Link1Text,
    column1Link1Url,
    column1Link2Text,
    column1Link2Url,
    column1Link3Text,
    column1Link3Url,
    column1Link4Text,
    column1Link4Url,
    column2Title,
    column2Link1Text,
    column2Link1Url,
    column2Link2Text,
    column2Link2Url,
    column2Link3Text,
    column2Link3Url,
    column2Link4Text,
    column2Link4Url,
    showPaymentIcons = true,
    payment1Image,
    payment1Alt,
    payment2Image,
    payment2Alt,
    payment3Image,
    payment3Alt,
    payment4Image,
    payment4Alt,
  } = settings;

  // Build menu columns from flat settings if blocks not provided
  const buildColumnsFromSettings = (): MenuColumn[] => {
    const columns: MenuColumn[] = [];

    // Column 1
    if (column1Title) {
      const links: Link[] = [];
      if (column1Link1Text && column1Link1Url) links.push({ text: column1Link1Text, url: column1Link1Url });
      if (column1Link2Text && column1Link2Url) links.push({ text: column1Link2Text, url: column1Link2Url });
      if (column1Link3Text && column1Link3Url) links.push({ text: column1Link3Text, url: column1Link3Url });
      if (column1Link4Text && column1Link4Url) links.push({ text: column1Link4Text, url: column1Link4Url });
      if (links.length > 0) columns.push({ title: column1Title, links });
    }

    // Column 2
    if (column2Title) {
      const links: Link[] = [];
      if (column2Link1Text && column2Link1Url) links.push({ text: column2Link1Text, url: column2Link1Url });
      if (column2Link2Text && column2Link2Url) links.push({ text: column2Link2Text, url: column2Link2Url });
      if (column2Link3Text && column2Link3Url) links.push({ text: column2Link3Text, url: column2Link3Url });
      if (column2Link4Text && column2Link4Url) links.push({ text: column2Link4Text, url: column2Link4Url });
      if (links.length > 0) columns.push({ title: column2Title, links });
    }

    return columns;
  };

  // Build payment icons from flat settings if paymentIcons not provided
  const buildPaymentIconsFromSettings = (): PaymentIcon[] => {
    const icons: PaymentIcon[] = [];
    if (payment1Image) icons.push({ src: payment1Image, alt: payment1Alt || "Payment 1" });
    if (payment2Image) icons.push({ src: payment2Image, alt: payment2Alt || "Payment 2" });
    if (payment3Image) icons.push({ src: payment3Image, alt: payment3Alt || "Payment 3" });
    if (payment4Image) icons.push({ src: payment4Image, alt: payment4Alt || "Payment 4" });
    return icons;
  };

  // Use blocks prop if provided, otherwise build from flat settings
  const menuColumns = blocks.length > 0 ? blocks : buildColumnsFromSettings();

  // Use contact prop if provided, otherwise build from flat settings
  const contactInfo = contact || {
    title: contactTitle || "Contact us",
    whatsapp: whatsapp || "009612345678932",
    mobile: mobile || "009612345678932",
    email: email || "support@zatiq.com",
  };

  // Use paymentIcons prop if provided, otherwise build from flat settings
  const paymentIconsList = paymentIcons.length > 0 ? paymentIcons : buildPaymentIconsFromSettings();

  return (
    <footer
      className="w-full overflow-hidden font-sans"
      style={{
        backgroundColor,
        fontFamily: fontFamily || undefined
      }}
    >
      {/* Main Footer Content */}
      <div
        className="w-full py-8 md:py-12"
        style={{ backgroundColor, color: textColor }}
      >
        <div className="max-w-[1440px] mx-auto px-4">
          {/* Logo and Description - Full width on mobile/tablet */}
          <div className="mb-8 lg:hidden">
            <div className="mb-6">
              <img src={logo} alt="Logo" className="h-8 max-w-full" />
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
                <img src={logo} alt="Logo" className="h-8 max-w-full" />
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
                        <p className="wrap-break-word">
                          {contactInfo.whatsapp}
                        </p>
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
              <div
                key={index}
                className={`order-${index + 2} lg:order-${index + 2}`}
              >
                <h3 className="text-xs md:text-sm lg:text-base font-semibold text-gray-900 mb-3 md:mb-4">
                  {column.title}
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {column.links.map((link, idx) => (
                    <li key={idx}>
                      <a
                        href={link.url}
                        className="text-xs md:text-sm text-gray-600 hover:text-gray-900"
                      >
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
                    <a
                      href={facebookUrl}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {instagramUrl && (
                    <a
                      href={instagramUrl}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {twitterUrl && (
                    <a
                      href={twitterUrl}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {linkedinUrl && (
                    <a
                      href={linkedinUrl}
                      className="text-gray-600 hover:text-gray-900"
                    >
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
                  <a
                    href={facebookUrl}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                )}
                {instagramUrl && (
                  <a
                    href={instagramUrl}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {twitterUrl && (
                  <a
                    href={twitterUrl}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    className="text-gray-600 hover:text-gray-900"
                  >
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
          <p className="text-white text-sm">{copyrightText}</p>

          {/* Payment Methods */}
          {showPaymentIcons && paymentIconsList.length > 0 && (
            <div className="flex items-center gap-3">
              {paymentIconsList.map((icon, index) => (
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
