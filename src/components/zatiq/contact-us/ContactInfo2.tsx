import React from "react";
import * as LucideIcons from "lucide-react";

interface ContactItem {
  id: string;
  type: string;
  settings: {
    icon?: string;
    label?: string;
    title?: string;
    content?: string;
    link?: string;
  };
}

interface FeatureItem {
  id: string;
  type: string;
  settings: {
    title?: string;
    description?: string;
  };
}

interface SocialLink {
  id: string;
  type: string;
  settings: {
    platform?: string;
    url?: string;
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
}

interface ContactInfo2Props {
  settings?: ContactInfo2Settings;
  blocks?: ContactItem[];
  features?: FeatureItem[];
  socials?: SocialLink[];
}

// Icon mapping helper - converts kebab-case to PascalCase and returns the icon component
const getIcon = (iconName?: string, size = 20) => {
  if (!iconName) return <LucideIcons.MapPin size={size} strokeWidth={1.5} />;

  // Handle legacy icon names for backwards compatibility
  const iconNameMap: Record<string, string> = {
    location: "map-pin",
    address: "map-pin",
    map: "map-pin",
    phone: "phone",
    call: "phone",
    email: "mail",
    clock: "clock",
    hours: "clock",
    time: "clock",
    chat: "message-circle",
    message: "message-circle",
    website: "globe",
    web: "globe",
    office: "building",
    building: "building",
    support: "headphones",
    help: "headphones",
  };

  // Use mapped name if available, otherwise use original
  const mappedName = iconNameMap[iconName] || iconName;

  // Convert kebab-case to PascalCase (e.g., 'credit-card' -> 'CreditCard')
  const pascalCase = mappedName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  // Get the icon component from lucide-react
  const IconComponent = (
    LucideIcons as Record<
      string,
      React.ComponentType<{ size?: number; strokeWidth?: number }>
    >
  )[pascalCase];

  if (IconComponent) {
    return <IconComponent size={size} strokeWidth={1.5} />;
  }

  // Fallback to MapPin icon if not found
  return <LucideIcons.MapPin size={size} strokeWidth={1.5} />;
};

// Get social icon
const getSocialIcon = (platform?: string) => {
  const size = 16;
  switch (platform?.toLowerCase()) {
    case "facebook":
      return <LucideIcons.Facebook size={size} strokeWidth={1.5} />;
    case "twitter":
    case "x":
      return <LucideIcons.Twitter size={size} strokeWidth={1.5} />;
    case "linkedin":
      return <LucideIcons.Linkedin size={size} strokeWidth={1.5} />;
    case "instagram":
      return <LucideIcons.Instagram size={size} strokeWidth={1.5} />;
    case "telegram":
      return <LucideIcons.Send size={size} strokeWidth={1.5} />;
    default:
      return <LucideIcons.Globe size={size} strokeWidth={1.5} />;
  }
};

const ContactInfo2: React.FC<ContactInfo2Props> = ({
  settings = {},
  blocks = [],
  features = [],
  socials = [],
}) => {
  const {
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    accentColor = "#111827",
    title = "Contact us",
    subtitle = "We'd love to hear from you",
    image = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    showSocials = true,
    showFeatures = true,
    // Individual social link settings
    showFacebook = true,
    facebookUrl = "#",
    showTwitter = true,
    twitterUrl = "#",
    showLinkedin = true,
    linkedinUrl = "#",
    showInstagram = false,
    instagramUrl = "#",
    showTelegram = false,
    telegramUrl = "#",
  } = settings;

  // Build socials array from individual settings
  const builtSocials: SocialLink[] = [];
  if (showFacebook && facebookUrl) {
    builtSocials.push({
      id: "social_facebook",
      type: "social_link",
      settings: { platform: "facebook", url: facebookUrl },
    });
  }
  if (showTwitter && twitterUrl) {
    builtSocials.push({
      id: "social_twitter",
      type: "social_link",
      settings: { platform: "twitter", url: twitterUrl },
    });
  }
  if (showLinkedin && linkedinUrl) {
    builtSocials.push({
      id: "social_linkedin",
      type: "social_link",
      settings: { platform: "linkedin", url: linkedinUrl },
    });
  }
  if (showInstagram && instagramUrl) {
    builtSocials.push({
      id: "social_instagram",
      type: "social_link",
      settings: { platform: "instagram", url: instagramUrl },
    });
  }
  if (showTelegram && telegramUrl) {
    builtSocials.push({
      id: "social_telegram",
      type: "social_link",
      settings: { platform: "telegram", url: telegramUrl },
    });
  }

  // Use built socials if available, otherwise fall back to defaults
  const defaultSocials: SocialLink[] = builtSocials.length > 0 ? builtSocials : [
    {
      id: "social_1",
      type: "social_link",
      settings: { platform: "facebook", url: "#" },
    },
    {
      id: "social_2",
      type: "social_link",
      settings: { platform: "twitter", url: "#" },
    },
    {
      id: "social_3",
      type: "social_link",
      settings: { platform: "linkedin", url: "#" },
    },
  ];

  // Default features when none provided
  const defaultFeatures: FeatureItem[] = [
    {
      id: "feature_1",
      type: "feature_item",
      settings: {
        title: "Free Shipping",
        description: "Free shipping on all orders over $100",
      },
    },
    {
      id: "feature_2",
      type: "feature_item",
      settings: {
        title: "24/7 Support",
        description: "Our support team is available around the clock",
      },
    },
    {
      id: "feature_3",
      type: "feature_item",
      settings: {
        title: "Easy Returns",
        description: "30-day hassle-free return policy",
      },
    },
  ];

  const displaySocials = socials.length > 0 ? socials : defaultSocials;
  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  // If no blocks provided, don't render
  if (blocks.length === 0) return null;

  return (
    <section className="py-12 md:py-16 lg:py-20" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Main Content - Image + Contact Info */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left - Image */}
          <div className="relative">
            <img
              src={image}
              alt="Contact"
              className="w-full h-[400px] lg:h-[500px] object-cover rounded-lg"
            />
          </div>

          {/* Right - Contact Info */}
          <div>
            {/* Subtitle */}
            {subtitle && (
              <p className="text-gray-500 text-base italic mb-2">{subtitle}</p>
            )}

            {/* Title */}
            {title && (
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8"
                style={{ color: textColor }}
              >
                {title}
              </h2>
            )}

            {/* Contact Items */}
            <div className="space-y-6">
              {blocks.map((item) => (
                <div key={item.id} className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 border border-gray-200"
                    style={{ color: textColor }}
                  >
                    {getIcon(item.settings.icon)}
                  </div>

                  {/* Content */}
                  <div>
                    {/* Label */}
                    {item.settings.label && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                        {item.settings.label}
                      </p>
                    )}
                    {/* Value */}
                    {item.settings.link ? (
                      <a
                        href={item.settings.link}
                        className="text-base font-medium hover:opacity-70 transition-opacity"
                        style={{ color: textColor }}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: (item.settings.content || "").replace(
                              /\n/g,
                              "<br/>"
                            ),
                          }}
                        />
                      </a>
                    ) : (
                      <p
                        className="text-base"
                        style={{ color: textColor }}
                        dangerouslySetInnerHTML={{
                          __html: (item.settings.content || "").replace(
                            /\n/g,
                            "<br/>"
                          ),
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            {showSocials && displaySocials.length > 0 && (
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                {displaySocials.map((social) => (
                  <a
                    key={social.id}
                    href={social.settings.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-100">
            {displayFeatures.map((feature) => (
              <div key={feature.id} className="text-center">
                <h3
                  className="text-sm font-semibold uppercase tracking-wider mb-3"
                  style={{ color: textColor }}
                >
                  {feature.settings.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.settings.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactInfo2;
