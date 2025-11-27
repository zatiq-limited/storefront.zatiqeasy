import React from "react";

interface ContactMap1Settings {
  backgroundColor?: string;
  title?: string;
  subtitle?: string;
  mapUrl?: string;
  height?: string;
  accentColor?: string;
}

interface ContactMap1Props {
  settings?: ContactMap1Settings;
}

const ContactMap1: React.FC<ContactMap1Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#FFFFFF",
    title = "Find Us",
    subtitle = "Visit our office and meet the team in person",
    mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841902907894!2d-73.98570908459418!3d40.74881797932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
    height = "500px",
    accentColor = "#6366F1",
  } = settings;

  return (
    <section className="w-full py-4 md:py-8" style={{ backgroundColor }}>
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header */}
        {(title || subtitle) && (
          <div className="text-center mb-6 md:mb-8">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto">{subtitle}</p>
            )}
          </div>
        )}

        {/* Map Container */}
        <div className="relative">
          {/* Map Frame */}
          <div
            className="rounded-2xl overflow-hidden shadow-lg"
            style={{
              boxShadow: `0 15px 40px -10px rgba(0, 0, 0, 0.12)`,
            }}
          >
            <iframe
              src={mapUrl}
              width="100%"
              height="350px"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
              className="grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>

          {/* Floating Info Card */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-auto md:max-w-xs z-20">
            <div
              className="bg-white rounded-xl p-4 shadow-lg backdrop-blur-sm border border-gray-100"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-0.5">Our Location</h3>
                  <p className="text-gray-600 text-xs leading-relaxed">
                    123 Business Avenue, Suite 500<br />
                    New York, NY 10001
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-medium transition-colors hover:opacity-80"
                    style={{ color: accentColor }}
                  >
                    Get Directions
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactMap1;
