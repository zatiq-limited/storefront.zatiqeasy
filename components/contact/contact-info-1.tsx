"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";
import * as LucideIcons from "lucide-react";

interface ContactInfo1Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  title?: string;
  titleStyle?: 'script' | 'normal';
  iconBackgroundColor?: string;
  info1Icon?: string;
  info1Title?: string;
  info1Content?: string;
  info1Link?: string;
  info2Icon?: string;
  info2Title?: string;
  info2Content?: string;
  info2Link?: string;
  info3Icon?: string;
  info3Title?: string;
  info3Content?: string;
  info3Link?: string;
  // Allow additional properties for dynamic access
  [key: string]: string | undefined;
}

interface ContactInfo1Props {
  settings?: ContactInfo1Settings;
}

// Icon mapping helper - converts kebab-case to PascalCase and returns the icon component
const getIcon = (iconName?: string, size = 28, color?: string) => {
  if (!iconName) return <LucideIcons.MapPin size={size} strokeWidth={1.5} color={color} />;

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
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>>)[pascalCase];

  if (IconComponent) {
    return <IconComponent size={size} strokeWidth={1.5} color={color} />;
  }

  // Fallback to MapPin icon if not found
  return <LucideIcons.MapPin size={size} strokeWidth={1.5} color={color} />;
};

const ContactInfoItems = [
  {
    icon: 'info1Icon',
    title: 'info1Title',
    content: 'info1Content',
    link: 'info1Link'
  },
  {
    icon: 'info2Icon',
    title: 'info2Title',
    content: 'info2Content',
    link: 'info2Link'
  },
  {
    icon: 'info3Icon',
    title: 'info3Title',
    content: 'info3Content',
    link: 'info3Link'
  }
];

export default function ContactInfo1({ settings = {} }: ContactInfo1Props) {
  const s = convertSettingsKeys(settings as Record<string, unknown>) as ContactInfo1Settings;

  return (
    <section
      className="py-12 md:py-16 lg:py-20"
      style={{ backgroundColor: s.backgroundColor || "#FFFFFF" }}
    >
      <div className="max-w-[1440px] mx-auto px-4 2xl:px-0">
        {/* Title */}
        {s.title && (
          <h2
            className={`text-center mb-10 md:mb-14 ${
              s.titleStyle === "script"
                ? "font-serif italic text-3xl md:text-4xl"
                : "font-bold text-2xl md:text-3xl lg:text-4xl"
            }`}
            style={{ color: s.textColor || "#111827" }}
          >
            {s.title}
          </h2>
        )}

        {/* Contact Cards - Centered Grid */}
        <div className="grid gap-8 md:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {ContactInfoItems.map((item, index) => {
            const iconName = s[item.icon];
            const title = s[item.title];
            const content = s[item.content];
            const link = s[item.link];

            if (!title && !content) return null;

            return (
              <div key={index} className="flex flex-col items-center text-center">
                {/* Icon Circle */}
                <div
                  className="flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full mb-5"
                  style={{
                    backgroundColor: s.iconBackgroundColor || "#F5F0EB",
                    color: s.accentColor || "#8B4513",
                  }}
                >
                  {getIcon(iconName, 32, s.accentColor || "#8B4513")}
                </div>

                {/* Title */}
                {title && (
                  <h3
                    className="text-sm font-semibold uppercase tracking-wider mb-2"
                    style={{ color: s.textColor || "#111827" }}
                  >
                    {title}
                  </h3>
                )}

                {/* Content */}
                {link ? (
                  <a
                    href={link}
                    className="text-gray-600 hover:underline transition-colors text-sm md:text-base"
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: (content || "").replace(/\n/g, "<br/>"),
                      }}
                    />
                  </a>
                ) : (
                  <p
                    className="text-gray-600 text-sm md:text-base"
                    dangerouslySetInnerHTML={{
                      __html: (content || "").replace(/\n/g, "<br/>"),
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}