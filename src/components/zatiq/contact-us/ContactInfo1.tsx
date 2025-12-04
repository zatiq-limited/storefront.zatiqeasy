import React from "react";
import {
  MapPin,
  Mail,
  Clock,
  MessageCircle,
  Globe,
  Building,
  Headphones,
  PhoneCall,
} from "lucide-react";

interface ContactItem {
  id: string;
  type: string;
  settings: {
    icon?: string;
    title?: string;
    content?: string;
    link?: string;
  };
}

interface ContactInfo1Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  title?: string;
  titleStyle?: "normal" | "script";
  iconBackgroundColor?: string;
}

interface ContactInfo1Props {
  settings?: ContactInfo1Settings;
  blocks?: ContactItem[];
}

// Get lucide icon based on icon name
const getIcon = (iconName?: string) => {
  const iconClass = "w-7 h-7";
  switch (iconName) {
    case "location":
    case "address":
    case "map":
      return <MapPin className={iconClass} />;
    case "phone":
    case "call":
      return <PhoneCall className={iconClass} />;
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

const ContactInfo1: React.FC<ContactInfo1Props> = ({ settings = {}, blocks = [] }) => {
  const {
    backgroundColor,
    textColor,
    accentColor,
    title,
    titleStyle = "script",
    iconBackgroundColor,
  } = settings;

  // If no blocks provided, don't render
  if (blocks.length === 0) return null;

  return (
    <section
      className="py-12 md:py-16 lg:py-20"
      style={{ backgroundColor: backgroundColor || "#FFFFFF" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Title */}
        {title && (
          <h2
            className={`text-center mb-10 md:mb-14 ${
              titleStyle === "script"
                ? "font-serif italic text-3xl md:text-4xl"
                : "font-bold text-2xl md:text-3xl lg:text-4xl"
            }`}
            style={{ color: textColor || "#111827" }}
          >
            {title}
          </h2>
        )}

        {/* Contact Cards - Centered Grid */}
        <div
          className={`grid gap-8 md:gap-12 ${
            blocks.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : blocks.length === 2
              ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
              : blocks.length === 3
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }`}
        >
          {blocks.map((item) => (
            <div key={item.id} className="flex flex-col items-center text-center">
              {/* Icon Circle */}
              <div
                className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full mb-5"
                style={{
                  backgroundColor: iconBackgroundColor || "#F5F0EB",
                  color: accentColor || "#8B4513",
                }}
              >
                {getIcon(item.settings.icon)}
              </div>

              {/* Title */}
              {item.settings.title && (
                <h3
                  className="text-sm font-semibold uppercase tracking-wider mb-2"
                  style={{ color: textColor || "#111827" }}
                >
                  {item.settings.title}
                </h3>
              )}

              {/* Content */}
              {item.settings.link ? (
                <a
                  href={item.settings.link}
                  className="text-gray-600 hover:underline transition-colors text-sm md:text-base"
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: (item.settings.content || "").replace(/\n/g, "<br/>"),
                    }}
                  />
                </a>
              ) : (
                <p
                  className="text-gray-600 text-sm md:text-base"
                  dangerouslySetInnerHTML={{
                    __html: (item.settings.content || "").replace(/\n/g, "<br/>"),
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo1;
