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
    accentColor = "#111827",
    title = "Get in Touch",
    subtitle = "We're here to help. Reach out through any of the following channels.",
  } = settings;

  const defaultBlocks: ContactItem[] = [
    {
      id: "1",
      type: "contact_item",
      settings: {
        icon: "location",
        title: "Visit Us",
        content: "123 Business Street, Suite 100\nNew York, NY 10001",
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
        content: "support@store.com",
        link: "mailto:support@store.com",
      },
    },
  ];

  const items = blocks.length > 0 ? blocks : defaultBlocks;

  const getIcon = (iconName?: string) => {
    const iconClass = "w-5 h-5";
    switch (iconName) {
      case "location":
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        );
      case "phone":
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
        );
      case "email":
        return (
          <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        );
      default:
        return <span className="text-lg">{iconName}</span>;
    }
  };

  return (
    <section className="w-full py-10 md:py-14" style={{ backgroundColor }}>
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Side - Title & Description */}
          <div>
            <h2
              className="text-2xl md:text-3xl font-semibold mb-3"
              style={{ color: textColor }}
            >
              {title}
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {subtitle}
            </p>

            {/* Business Hours */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Business Hours
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gray-100"
                  style={{ color: accentColor }}
                >
                  {getIcon(item.settings.icon)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-semibold mb-1"
                    style={{ color: textColor }}
                  >
                    {item.settings.title}
                  </h3>
                  {item.settings.link ? (
                    <a
                      href={item.settings.link}
                      className="text-gray-600 text-sm whitespace-pre-line hover:text-gray-900 transition-colors"
                    >
                      {item.settings.content}
                    </a>
                  ) : (
                    <p className="text-gray-600 text-sm whitespace-pre-line">
                      {item.settings.content}
                    </p>
                  )}
                </div>

                {/* Arrow for links */}
                {item.settings.link && (
                  <svg
                    className="w-4 h-4 text-gray-400 shrink-0 mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo2;
