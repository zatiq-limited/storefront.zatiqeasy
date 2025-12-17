import React from "react";
import * as LucideIcons from "lucide-react";

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

// Icon mapping helper - converts kebab-case to PascalCase and returns the icon component
const getIcon = (iconName?: string, size = 28) => {
  if (!iconName) return <LucideIcons.MapPin size={size} strokeWidth={1.5} />;

  // Handle legacy icon names for backwards compatibility
  const iconNameMap: Record<string, string> = {
    location: "map-pin",
    address: "map-pin",
    map: "map-pin",
    phone: "phone-call",
    call: "phone-call",
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
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[pascalCase];

  if (IconComponent) {
    return <IconComponent size={size} strokeWidth={1.5} />;
  }

  // Fallback to MapPin icon if not found
  return <LucideIcons.MapPin size={size} strokeWidth={1.5} />;
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
