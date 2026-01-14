"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";

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

export default function ContactMap2({ settings = {} }: ContactMap2Props) {
  const s = convertSettingsKeys(
    settings as Record<string, unknown>
  ) as ContactMap2Settings;

  const containerClass = s.contained ? "container" : "";
  const mapClasses = [
    "w-full overflow-hidden",
    s.rounded ? "rounded-lg" : "",
    s.shadow ? "shadow-lg" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className="py-12 md:py-16 lg:py-20"
      style={{ backgroundColor: s.backgroundColor || "#F9FAFB" }}
    >
      <div className={containerClass}>
        <div className={mapClasses} style={{ height: s.height || "500px" }}>
          {s.mapUrl && (
            <iframe
              src={s.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </div>
      </div>
    </section>
  );
}
