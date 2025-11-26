import React from "react";

interface ContactMap1Settings {
  backgroundColor?: string;
  title?: string;
  subtitle?: string;
  mapUrl?: string;
  height?: string;
}

interface ContactMap1Props {
  settings?: ContactMap1Settings;
}

const ContactMap1: React.FC<ContactMap1Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#FFFFFF",
    title = "Find Us",
    subtitle = "Visit our office",
    mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841902907894!2d-73.98570908459418!3d40.74881797932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
    height = "400px",
  } = settings;

  return (
    <section className="w-full py-16 md:py-20" style={{ backgroundColor }}>
      <div className="max-w-[1440px] mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-gray-600 text-lg">{subtitle}</p>}
          </div>
        )}

        <div className="rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src={mapUrl}
            width="100%"
            height={height}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          />
        </div>
      </div>
    </section>
  );
};

export default ContactMap1;
