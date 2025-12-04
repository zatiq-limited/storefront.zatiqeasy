import React from "react";

interface ContactMap1Settings {
  backgroundColor?: string;
  mapUrl?: string;
  height?: string;
  grayscale?: boolean;
}

interface ContactMap1Props {
  settings?: ContactMap1Settings;
}

const ContactMap1: React.FC<ContactMap1Props> = ({ settings = {} }) => {
  const {
    backgroundColor = "#FFFFFF",
    mapUrl,
    height = "450px",
    grayscale = false,
  } = settings;

  // If no mapUrl provided, don't render
  if (!mapUrl) return null;

  return (
    <section className="w-full" style={{ backgroundColor }}>
      <div className="w-full">
        <iframe
          src={mapUrl}
          width="100%"
          height={height}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
          className={grayscale ? "grayscale" : ""}
        />
      </div>
    </section>
  );
};

export default ContactMap1;
