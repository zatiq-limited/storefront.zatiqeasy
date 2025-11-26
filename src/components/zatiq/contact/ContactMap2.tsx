import React from "react";

interface ContactMap2Settings {
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  title?: string;
  subtitle?: string;
  mapUrl?: string;
  height?: string;
  address?: string;
  phone?: string;
  email?: string;
  workingHours?: string;
}

interface ContactMap2Props {
  settings?: ContactMap2Settings;
}

const ContactMap2: React.FC<ContactMap2Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#F8FAFC",
    textColor = "#0F172A",
    accentColor = "#6366F1",
    title = "Visit Our Office",
    subtitle = "We'd love to meet you in person. Stop by and say hello!",
    mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841902907894!2d-73.98570908459418!3d40.74881797932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
    height = "100%",
    address = "123 Business Avenue, Suite 500\nNew York, NY 10001",
    phone = "+1 (555) 123-4567",
    email = "hello@company.com",
    workingHours = "Mon - Fri: 9AM - 6PM",
  } = settings;

  const contactItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: "Address",
      value: address,
      link: "https://maps.google.com",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: "Phone",
      value: phone,
      link: `tel:${phone.replace(/\D/g, '')}`,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: "Email",
      value: email,
      link: `mailto:${email}`,
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Working Hours",
      value: workingHours,
    },
  ];

  return (
    <section className="w-full py-4 md:py-8" style={{ backgroundColor }}>
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
          {/* Left Side - Info */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Header */}
            <div className="mb-5">
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3"
                style={{
                  backgroundColor: `${accentColor}15`,
                  color: accentColor,
                }}
              >
                Location
              </span>
              <h2
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: textColor }}
              >
                {title}
              </h2>
              <p className="text-gray-600 text-sm">{subtitle}</p>
            </div>

            {/* Contact Items */}
            <div className="space-y-3 flex-1">
              {contactItems.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300"
                    style={{
                      backgroundColor: `${accentColor}15`,
                      color: accentColor,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-xs font-medium text-gray-500 mb-0.5"
                    >
                      {item.label}
                    </h4>
                    {item.link ? (
                      <a
                        href={item.link}
                        target={item.link.startsWith('http') ? '_blank' : undefined}
                        rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-gray-900 font-medium whitespace-pre-line hover:opacity-70 transition-opacity text-sm"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-medium whitespace-pre-line text-sm">
                        {item.value}
                      </p>
                    )}
                  </div>
                  {item.link && (
                    <div
                      className="opacity-0 group-hover:opacity-100 transition-opacity self-center"
                      style={{ color: accentColor }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-sm"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 8px 20px -8px ${accentColor}80`,
              }}
            >
              Get Directions
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>

          {/* Right Side - Map */}
          <div className="lg:col-span-3">
            <div
              className="rounded-2xl overflow-hidden shadow-lg h-full min-h-[300px] lg:min-h-[400px]"
              style={{
                boxShadow: `0 15px 40px -10px rgba(0, 0, 0, 0.1)`,
              }}
            >
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '300px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap2;
