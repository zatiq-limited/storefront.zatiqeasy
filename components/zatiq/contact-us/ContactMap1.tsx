import React from "react";

interface ContactMap1Settings {
  backgroundColor?: string;
  mapHeight?: string;
  mapEmbedUrl?: string;
  grayscale?: boolean;
  showOverlay?: boolean;
  overlayTitle?: string;
  overlayDescription?: string;
}

interface ContactMap1Props {
  settings?: ContactMap1Settings;
}

const ContactMap1: React.FC<ContactMap1Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#FFFFFF",
    mapHeight = "450px",
    mapEmbedUrl,
    grayscale = false,
    showOverlay = false,
    overlayTitle,
    overlayDescription,
  } = settings;

  // If no mapEmbedUrl provided, don't render
  if (!mapEmbedUrl) return null;

  return (
    <section className="w-full" style={{ backgroundColor }}>
      <div className="w-full relative">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height={mapHeight}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
          className={grayscale ? "grayscale" : ""}
        />

        {/* Overlay Content */}
        {showOverlay && (overlayTitle || overlayDescription) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-lg shadow-lg max-w-md mx-4 text-center pointer-events-auto">
              {overlayTitle && (
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                  {overlayTitle}
                </h3>
              )}
              {overlayDescription && (
                <p className="text-gray-600 text-sm md:text-base">
                  {overlayDescription}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactMap1;