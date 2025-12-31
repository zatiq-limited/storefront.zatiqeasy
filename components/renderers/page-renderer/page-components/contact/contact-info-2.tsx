import React from 'react';
import * as LucideIcons from 'lucide-react';

// Icon mapping helper - converts kebab-case to PascalCase and returns the icon component
const getIcon = (iconName, size = 20) => {
  // Handle legacy icon names for backwards compatibility
  const iconNameMap = {
    location: 'map-pin',
    address: 'map-pin',
    map: 'map-pin',
    phone: 'phone',
    call: 'phone',
    email: 'mail',
    clock: 'clock',
    hours: 'clock',
    time: 'clock',
    chat: 'message-circle',
    message: 'message-circle',
    website: 'globe',
    web: 'globe',
    office: 'building',
    building: 'building',
    support: 'headphones',
    help: 'headphones',
  };

  // Use mapped name if available, otherwise use original
  const mappedName = iconNameMap[iconName] || iconName;

  // Convert kebab-case to PascalCase (e.g., 'credit-card' -> 'CreditCard')
  const pascalCase = mappedName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Get the icon component from lucide-react
  const IconComponent = LucideIcons[pascalCase];

  if (IconComponent) {
    return <IconComponent size={size} strokeWidth={1.5} />;
  }

  // Fallback to MapPin icon if not found
  return <LucideIcons.MapPin size={size} strokeWidth={1.5} />;
};

// Get social icon
const getSocialIcon = (platform: string) => {
  const size = 16;
  switch (platform?.toLowerCase()) {
    case 'facebook':
      return <LucideIcons.Facebook size={size} strokeWidth={1.5} />;
    case 'twitter':
    case 'x':
      return <LucideIcons.Twitter size={size} strokeWidth={1.5} />;
    case 'linkedin':
      return <LucideIcons.Linkedin size={size} strokeWidth={1.5} />;
    case 'instagram':
      return <LucideIcons.Instagram size={size} strokeWidth={1.5} />;
    case 'telegram':
      return <LucideIcons.Send size={size} strokeWidth={1.5} />;
    default:
      return <LucideIcons.Globe size={size} strokeWidth={1.5} />;
  }
};

interface ContactBlock {
  id: string;
  type: string;
  settings: {
    icon: string;
    label: string;
    content: string;
    link?: string;
  };
}

interface Feature {
  id: string;
  type: string;
  settings: {
    icon: string;
    text: string;
  };
}

interface Social {
  id: string;
  type: string;
  settings: {
    platform: string;
    url: string;
  };
}

interface ContactInfo2Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  showSocials?: boolean;
  showFeatures?: boolean;
  blocks?: ContactBlock[];
  features?: Feature[];
  socials?: Social[];
  // Individual social link settings
  showFacebook?: boolean;
  facebookUrl?: string;
  showTwitter?: boolean;
  twitterUrl?: string;
  showLinkedin?: boolean;
  linkedinUrl?: string;
  showInstagram?: boolean;
  instagramUrl?: string;
  showTelegram?: boolean;
  telegramUrl?: string;
  viewMode?: 'desktop' | 'tablet' | 'mobile' | null;
}

interface ContactInfo2Props {
  settings: ContactInfo2Settings;
}

const ContactInfo2 = ({ settings }: ContactInfo2Props) => {
  const {
    backgroundColor = '#FFFFFF',
    textColor = '#111827',
    accentColor = '#111827',
    title = 'Contact us',
    subtitle = "We'd love to hear from you",
    image = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    showSocials = true,
    showFeatures = true,
    blocks = [],
    features = [],
    socials = [],
    // Individual social link settings
    showFacebook = true,
    facebookUrl = '#',
    showTwitter = true,
    twitterUrl = '#',
    showLinkedin = true,
    linkedinUrl = '#',
    showInstagram = false,
    instagramUrl = '#',
    showTelegram = false,
    telegramUrl = '#',
    viewMode = null,
  } = settings;
  // Responsive layout detection based on viewMode (preview) or CSS (production)
  const showMobileLayout = viewMode === 'mobile';
  const showTabletLayout = viewMode === 'tablet';
  const showDesktopLayout = viewMode === 'desktop';
  // Default blocks for preview
  const defaultBlocks = [
    {
      id: 'info_1',
      type: 'contact_item',
      settings: {
        icon: 'location',
        label: 'Address',
        content: '14 Ringe lane, Las Vegas, NV 89156',
      },
    },
    {
      id: 'info_2',
      type: 'contact_item',
      settings: {
        icon: 'phone',
        label: 'Phone',
        content: '+00-1234567890',
        link: 'tel:+001234567890',
      },
    },
    {
      id: 'info_3',
      type: 'contact_item',
      settings: {
        icon: 'email',
        label: 'Email',
        content: 'demo@support.com',
        link: 'mailto:demo@support.com',
      },
    },
  ];

  // Build socials array from individual settings
  const builtSocials = [];
  if (showFacebook) {
    builtSocials.push({ id: 'social_facebook', type: 'social_link', settings: { platform: 'facebook', url: facebookUrl } });
  }
  if (showTwitter) {
    builtSocials.push({ id: 'social_twitter', type: 'social_link', settings: { platform: 'twitter', url: twitterUrl } });
  }
  if (showLinkedin) {
    builtSocials.push({ id: 'social_linkedin', type: 'social_link', settings: { platform: 'linkedin', url: linkedinUrl } });
  }
  if (showInstagram) {
    builtSocials.push({ id: 'social_instagram', type: 'social_link', settings: { platform: 'instagram', url: instagramUrl } });
  }
  if (showTelegram) {
    builtSocials.push({ id: 'social_telegram', type: 'social_link', settings: { platform: 'telegram', url: telegramUrl } });
  }

  const defaultSocials = builtSocials.length > 0 ? builtSocials : [
    { id: 'social_1', type: 'social_link', settings: { platform: 'facebook', url: '#' } },
    { id: 'social_2', type: 'social_link', settings: { platform: 'twitter', url: '#' } },
    { id: 'social_3', type: 'social_link', settings: { platform: 'linkedin', url: '#' } },
  ];

  const defaultFeatures = [
    {
      id: 'feature_1',
      type: 'feature_item',
      settings: { title: 'Fast Response', description: 'We respond to all inquiries within 24 hours.' },
    },
    {
      id: 'feature_2',
      type: 'feature_item',
      settings: { title: 'Expert Support', description: 'Our team is here to help you succeed.' },
    },
    {
      id: 'feature_3',
      type: 'feature_item',
      settings: { title: 'Global Reach', description: 'Serving customers in over 50 countries.' },
    },
  ];

  const displayBlocks = blocks.length > 0 ? blocks : defaultBlocks;
  const displaySocials = socials.length > 0 ? socials : defaultSocials;
  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  // Responsive classes with viewMode support
  const sectionPaddingClass = viewMode
    ? showMobileLayout
      ? 'py-12'
      : showTabletLayout
      ? 'py-16'
      : 'py-20'
    : 'py-12 md:py-16 lg:py-20';

  const containerPaddingClass = viewMode
    ? showMobileLayout
      ? 'px-4'
      : showTabletLayout
      ? 'px-4'
      : 'px-4 2xl:px-0'
    : 'px-4 2xl:px-0';

  const gridGapClass = viewMode
    ? showMobileLayout
      ? 'gap-10'
      : showTabletLayout
      ? 'gap-12'
      : 'gap-16'
    : 'gap-10 lg:gap-16';

  const gridColsClass = viewMode
    ? showMobileLayout
      ? 'grid-cols-1'
      : showTabletLayout
      ? 'grid-cols-1'
      : 'grid-cols-2'
    : 'grid-cols-1 lg:grid-cols-2';

  const imageHeightClass = viewMode
    ? showMobileLayout
      ? 'h-[400px]'
      : showTabletLayout
      ? 'h-[450px]'
      : 'h-[500px]'
    : 'h-[400px] lg:h-[500px]';

  const subtitleTextClass = viewMode
    ? showMobileLayout
      ? 'text-sm'
      : 'text-base'
    : 'text-sm md:text-base';

  const titleSizeClass = viewMode
    ? showMobileLayout
      ? 'text-3xl'
      : showTabletLayout
      ? 'text-4xl'
      : 'text-5xl'
    : 'text-3xl md:text-4xl lg:text-5xl';

  const titleMarginClass = viewMode
    ? showMobileLayout
      ? 'mb-6'
      : 'mb-8'
    : 'mb-6 md:mb-8';

  const contactItemsGapClass = viewMode
    ? showMobileLayout
      ? 'space-y-5'
      : 'space-y-6'
    : 'space-y-5 md:space-y-6';

  const iconSizeClass = viewMode
    ? showMobileLayout
      ? 'w-9 h-9'
      : 'w-10 h-10'
    : 'w-9 h-9 md:w-10 md:h-10';

  const labelTextClass = viewMode
    ? showMobileLayout
      ? 'text-xs'
      : 'text-xs'
    : 'text-xs';

  const contentTextClass = viewMode
    ? showMobileLayout
      ? 'text-sm'
      : 'text-base'
    : 'text-sm md:text-base';

  const socialsMarginClass = viewMode
    ? showMobileLayout
      ? 'mt-6 pt-5'
      : 'mt-8 pt-6'
    : 'mt-6 pt-5 md:mt-8 md:pt-6';

  const socialIconClass = viewMode
    ? showMobileLayout
      ? 'w-8 h-8'
      : 'w-9 h-9'
    : 'w-8 h-8 md:w-9 md:h-9';

  const featuresGridClass = viewMode
    ? showMobileLayout
      ? 'grid-cols-1 gap-6'
      : showTabletLayout
      ? 'grid-cols-2 gap-7'
      : 'grid-cols-3 gap-8'
    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7 lg:gap-8';

  const featuresMarginClass = viewMode
    ? showMobileLayout
      ? 'mt-12 pt-12'
      : 'mt-16 pt-16'
    : 'mt-12 pt-12 md:mt-16 md:pt-16';

  const featureTitleClass = viewMode
    ? showMobileLayout
      ? 'text-xs'
      : 'text-sm'
    : 'text-xs md:text-sm';

  const featureDescClass = viewMode
    ? showMobileLayout
      ? 'text-xs'
      : 'text-sm'
    : 'text-xs md:text-sm';

  return (
    <section className={sectionPaddingClass} style={{ backgroundColor }}>
      <div className={`container mx-auto ${containerPaddingClass}`}>
        {/* Main Content - Image + Contact Info */}
        <div className={`grid ${gridColsClass} ${gridGapClass} items-center`}>
          {/* Left - Image */}
          <div className="relative">
            <img src={image} alt="Contact" className={`w-full ${imageHeightClass} object-cover rounded-lg`} />
          </div>

          {/* Right - Contact Info */}
          <div>
            {/* Subtitle */}
            {subtitle && <p className={`text-gray-500 ${subtitleTextClass} italic mb-2`}>{subtitle}</p>}

            {/* Title */}
            {title && (
              <h2 className={`${titleSizeClass} font-bold ${titleMarginClass}`} style={{ color: textColor }}>
                {title}
              </h2>
            )}

            {/* Contact Items */}
            <div className={contactItemsGapClass}>
              {displayBlocks.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center ${iconSizeClass} rounded-full shrink-0 border border-gray-200`}
                    style={{ color: textColor }}
                  >
                    {getIcon(item.settings.icon)}
                  </div>

                  {/* Content */}
                  <div>
                    {/* Label */}
                    {item.settings.label && (
                      <p className={`${labelTextClass} font-semibold uppercase tracking-wider text-gray-400 mb-1`}>
                        {item.settings.label}
                      </p>
                    )}
                    {/* Value */}
                    {item.settings.link ? (
                      <a
                        href={item.settings.link}
                        className={`${contentTextClass} font-medium hover:opacity-70 transition-opacity`}
                        style={{ color: textColor }}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: (item.settings.content || '').replace(/\n/g, '<br/>'),
                          }}
                        />
                      </a>
                    ) : (
                      <p
                        className={contentTextClass}
                        style={{ color: textColor }}
                        dangerouslySetInnerHTML={{
                          __html: (item.settings.content || '').replace(/\n/g, '<br/>'),
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            {showSocials && displaySocials.length > 0 && (
              <div className={`flex items-center gap-4 ${socialsMarginClass} border-t border-gray-100`}>
                {displaySocials.map((social) => (
                  <a
                    key={social.id}
                    href={social.settings.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center ${socialIconClass} rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors`}
                  >
                    {getSocialIcon(social.settings.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        {showFeatures && displayFeatures.length > 0 && (
          <div className={`grid ${featuresGridClass} ${featuresMarginClass} border-t border-gray-100`}>
            {displayFeatures.map((feature) => (
              <div key={feature.id} className="text-center">
                <h3 className={`${featureTitleClass} font-semibold uppercase tracking-wider mb-3`} style={{ color: textColor }}>
                  {feature.settings.title}
                </h3>
                <p className={`text-gray-500 ${featureDescClass} leading-relaxed`}>{feature.settings.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactInfo2;
