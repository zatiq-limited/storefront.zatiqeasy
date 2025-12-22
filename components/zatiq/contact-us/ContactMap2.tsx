import React from "react";

interface ContactMap2Settings {
  backgroundColor?: string;
  mapUrl?: string;
  height?: string;
  rounded?: boolean;
  shadow?: boolean;
  contained?: boolean;
}

interface ContactMap2Props {
  settings?: ContactMap2Settings;
}

const ContactMap2: React.FC<ContactMap2Props> = ({ settings = {} }) => {
  const {
    backgroundColor,
    mapUrl,
    height = "500px",
    rounded = true,
    shadow = true,
    contained = true,
  } = settings;

  // If no mapUrl provided, don't render
  if (!mapUrl) return null;

  return (
    <section
      className="w-full py-8 md:py-12 lg:py-16"
      style={{ backgroundColor: backgroundColor || "#F9FAFB" }}
    >
      <div className={contained ? "max-w-[1440px] mx-auto px-4 2xl:px-0" : "w-full"}>
        <div
          className={`overflow-hidden ${rounded ? "rounded-2xl md:rounded-3xl" : ""} ${
            shadow ? "shadow-xl" : ""
          }`}
          style={{
            boxShadow: shadow ? "0 25px 50px -12px rgba(0, 0, 0, 0.15)" : undefined,
          }}
        >
          <iframe
            src={mapUrl}
            width="100%"
            height={height}
            style={{ border: 0, display: "block" }}
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

export default ContactMap2;