"use client";

import { convertSettingsKeys } from "@/lib/settings-utils";

interface ContactMap1Settings {
  backgroundColor?: string;
  mapUrl?: string;
  height?: string;
  grayscale?: boolean;
}

interface ContactMap1Props {
  settings?: ContactMap1Settings;
}

export default function ContactMap1({ settings = {} }: ContactMap1Props) {
  const s = convertSettingsKeys(settings as Record<string, unknown>) as ContactMap1Settings;

  return (
    <section
      className="w-full"
      style={{ backgroundColor: s.backgroundColor || '#FFFFFF' }}
    >
      <div
        className="w-full overflow-hidden"
        style={{
          height: s.height || '450px',
          filter: s.grayscale ? 'grayscale(100%)' : 'none',
        }}
      >
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
    </section>
  );
}