import React from "react";

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
  subtitle?: string;
}

interface ContactInfo1Props {
  settings?: ContactInfo1Settings;
  blocks?: ContactItem[];
}

const ContactInfo1: React.FC<ContactInfo1Props> = ({ settings = {}, blocks = [] }) => {
  const {
    backgroundColor = "#FFFFFF",
    textColor = "#111827",
    accentColor = "#6366F1",
    title = "Contact Information",
    subtitle = "Reach out to us through any of these channels. We're always happy to help!",
  } = settings;

  const defaultBlocks: ContactItem[] = [
    {
      id: "1",
      type: "contact_item",
      settings: {
        icon: "location",
        title: "Visit Us",
        content: "123 Business Avenue, Suite 500\nNew York, NY 10001",
      },
    },
    {
      id: "2",
      type: "contact_item",
      settings: {
        icon: "phone",
        title: "Call Us",
        content: "+1 (555) 123-4567",
        link: "tel:+15551234567",
      },
    },
    {
      id: "3",
      type: "contact_item",
      settings: {
        icon: "email",
        title: "Email Us",
        content: "hello@company.com",
        link: "mailto:hello@company.com",
      },
    },
    {
      id: "4",
      type: "contact_item",
      settings: {
        icon: "clock",
        title: "Working Hours",
        content: "Mon - Fri: 9AM - 6PM\nSat - Sun: Closed",
      },
    },
  ];

  const items = blocks.length > 0 ? blocks : defaultBlocks;

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case "location":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case "phone":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case "email":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "clock":
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return <span className="text-2xl">{iconName}</span>;
    }
  };

  return (
    <section className="w-full pb-8 md:pb-14" style={{ backgroundColor }}>
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: textColor }}
          >
            {title}
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">{subtitle}</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-xl p-5 shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100 overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Hover Background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}08 0%, ${accentColor}15 100%)`,
                }}
              />

              {/* Icon */}
              <div
                className="relative w-11 h-11 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                {getIcon(item.settings.icon)}
              </div>

              {/* Content */}
              <div className="relative">
                <h3
                  className="text-base font-semibold mb-1"
                  style={{ color: textColor }}
                >
                  {item.settings.title}
                </h3>
                {item.settings.link ? (
                  <a
                    href={item.settings.link}
                    className="text-gray-600 whitespace-pre-line hover:opacity-70 transition-opacity"
                  >
                    {item.settings.content}
                  </a>
                ) : (
                  <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                    {item.settings.content}
                  </p>
                )}
              </div>

              {/* Corner Accent */}
              <div
                className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full opacity-0 group-hover:opacity-20 transition-all duration-500 blur-2xl"
                style={{ backgroundColor: accentColor }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo1;
