import React from "react";

interface ContactItem {
  id: string;
  type: string;
  settings: {
    icon?: string;
    title?: string;
    content?: string;
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
    accentColor = "#2563EB",
    title = "Contact Information",
    subtitle = "Find us through any of these channels",
  } = settings;

  const defaultBlocks: ContactItem[] = [
    {
      id: "1",
      type: "contact_item",
      settings: {
        icon: "📍",
        title: "Our Office",
        content: "123 Business Avenue, Suite 500\nNew York, NY 10001",
      },
    },
    {
      id: "2",
      type: "contact_item",
      settings: {
        icon: "📞",
        title: "Phone",
        content: "+1 (555) 123-4567",
      },
    },
    {
      id: "3",
      type: "contact_item",
      settings: {
        icon: "✉️",
        title: "Email",
        content: "info@example.com",
      },
    },
    {
      id: "4",
      type: "contact_item",
      settings: {
        icon: "🕐",
        title: "Business Hours",
        content: "Mon - Fri: 9AM - 6PM",
      },
    },
  ];

  const items = blocks.length > 0 ? blocks : defaultBlocks;

  return (
    <section className="w-full py-16 md:py-20" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: textColor }}
          >
            {title}
          </h2>
          <p className="text-gray-600 text-lg">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                {item.settings.icon}
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: textColor }}
              >
                {item.settings.title}
              </h3>
              <p className="text-gray-600 whitespace-pre-line">
                {item.settings.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactInfo1;
