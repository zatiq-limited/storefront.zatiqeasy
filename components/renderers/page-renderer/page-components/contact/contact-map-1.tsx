import React from 'react';

interface ContactMap1Settings {
  backgroundColor?: string;
  mapUrl?: string;
  height?: string;
  grayscale?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile' | null;
}

interface ContactMap1Props {
  settings: ContactMap1Settings;
}

const ContactMap1 = ({ settings }: ContactMap1Props) => {
  const {
    backgroundColor = '#FFFFFF',
    mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841902907894!2d-73.98570908459418!3d40.74881797932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus',
    height = '450px',
    grayscale = false,
    viewMode = null,
  } = settings;
  // Responsive layout detection based on viewMode (preview) or CSS (production)
  const showMobileLayout = viewMode === 'mobile';
  const showTabletLayout = viewMode === 'tablet';
  const showDesktopLayout = viewMode === 'desktop';

  // Parse height to apply responsive sizing
  const heightValue = parseInt(height) || 450;

  const mapHeightStyle = viewMode
    ? showMobileLayout
      ? `${Math.round(heightValue * 0.7)}px`
      : showTabletLayout
      ? `${Math.round(heightValue * 0.85)}px`
      : height
    : height;

  return (
    <section className="w-full" style={{ backgroundColor }}>
      <div className="w-full">
        <iframe
          src={mapUrl}
          width="100%"
          height={mapHeightStyle}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
          className={grayscale ? 'grayscale' : ''}
        />
      </div>
    </section>
  );
};

export default ContactMap1;
