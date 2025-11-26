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
}

interface ContactMap2Props {
  settings?: ContactMap2Settings;
}

const ContactMap2: React.FC<ContactMap2Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#F9FAFB",
    textColor = "#111827",
    accentColor = "#2563EB",
    title = "Visit Our Office",
    subtitle = "We'd love to meet you in person",
    mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841902907894!2d-73.98570908459418!3d40.74881797932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
    height = "350px",
    address = "123 Business Avenue, Suite 500\nNew York, NY 10001",
    phone = "+1 (555) 123-4567",
    email = "info@example.com",
  } = settings;

  return (
    <section className="w-full py-16 md:py-20" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Info */}
          <div className="lg:col-span-1 flex flex-col justify-center">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: textColor }}
            >
              {title}
            </h2>
            <p className="text-gray-600 text-lg mb-8">{subtitle}</p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                  📍
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: textColor }}>
                    Address
                  </h4>
                  <p className="text-gray-600 whitespace-pre-line">{address}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                  📞
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: textColor }}>
                    Phone
                  </h4>
                  <p className="text-gray-600">{phone}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                  ✉️
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: textColor }}>
                    Email
                  </h4>
                  <p className="text-gray-600">{email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden shadow-lg h-full min-h-[350px]">
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: height }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap2;
