import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Globe,
  Building,
  Headphones,
  Facebook,
  Twitter,
  Linkedin,
  Send,
} from "lucide-react";

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
}

interface ContactInfo2Props {
  settings?: ContactInfo2Settings;
  blocks?: ContactItem[];
  features?: FeatureItem[];
  socials?: SocialLink[];
}

// Get lucide icon based on icon name
const getIcon = (iconName?: string) => {
  const iconClass = "w-5 h-5";
  switch (iconName) {
    case "location":
    case "address":
    case "map":
      return <MapPin className={iconClass} />;
    case "phone":
    case "call":
      return <Phone className={iconClass} />;
    case "email":
    case "mail":
      return <Mail className={iconClass} />;
    case "clock":
    case "hours":
    case "time":
      return <Clock className={iconClass} />;
    case "chat":
    case "message":
      return <MessageCircle className={iconClass} />;
    case "website":
    case "web":
      return <Globe className={iconClass} />;
    case "office":
    case "building":
      return <Building className={iconClass} />;
    case "support":
    case "help":
      return <Headphones className={iconClass} />;
    default:
      return <MessageCircle className={iconClass} />;
  }
};

// Get social icon
const getSocialIcon = (platform?: string) => {
  const iconClass = "w-4 h-4";
  switch (platform?.toLowerCase()) {
    case "facebook":
      return <Facebook className={iconClass} />;
    case "twitter":
    case "x":
      return <Twitter className={iconClass} />;
    case "linkedin":
      return <Linkedin className={iconClass} />;
    case "telegram":
      return <Send className={iconClass} />;
    default:
      return <Globe className={iconClass} />;
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
  } = settings;

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
                            __html: (item.settings.content || "").replace(/\n/g, "<br/>"),
                          }}
                        />
                      </a>
                    ) : (
                      <p
                        className="text-base"
                        style={{ color: textColor }}
                        dangerouslySetInnerHTML={{
                          __html: (item.settings.content || "").replace(/\n/g, "<br/>"),
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            {showSocials && socials.length > 0 && (
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
                {socials.map((social) => (
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
        {showFeatures && features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-100">
            {features.map((feature) => (
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
