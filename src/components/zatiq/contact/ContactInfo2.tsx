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

interface ContactInfo2Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  title?: string;
  subtitle?: string;
}

interface ContactInfo2Props {
  settings?: ContactInfo2Settings;
  blocks?: ContactItem[];
}

const ContactInfo2: React.FC<ContactInfo2Props> = ({ settings = {}, blocks = [] }) => {
  const {
    backgroundColor = "#F9FAFB",
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
  ];

  const items = blocks.length > 0 ? blocks : defaultBlocks;

  return (
    <section className="w-full py-16 md:py-20" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Title */}
          <div className="lg:col-span-1">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: textColor }}
            >
              {title}
            </h2>
            <p className="text-gray-600 text-lg">{subtitle}</p>
            <div
              className="mt-6 w-16 h-1 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </div>

          {/* Right Side - Info Items */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-4 p-4 rounded-lg hover:bg-white transition-colors duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                    style={{ backgroundColor: accentColor, color: "#FFFFFF" }}
                  >
                    {item.settings.icon}
                  </div>
                  <div>
                    <h3
                      className="text-lg font-semibold mb-1"
                      style={{ color: textColor }}
                    >
                      {item.settings.title}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {item.settings.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo2;
