import React from 'react';

interface ContactMap2Settings {
  backgroundColor?: string;
  mapUrl?: string;
  height?: string;
  rounded?: boolean;
  shadow?: boolean;
  contained?: boolean;
  viewMode?: 'desktop' | 'tablet' | 'mobile' | null;
}

interface ContactMap2Props {
  settings: ContactMap2Settings;
}

const ContactMap2 = ({ settings }: ContactMap2Props) => {
  const {
    backgroundColor = '#F9FAFB',
    mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1841902907894!2d-73.98570908459418!3d40.74881797932847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus',
    height = '500px',
    rounded = true,
    shadow = true,
    contained = true,
    viewMode = null,
  } = settings;
  // Responsive layout detection based on viewMode (preview) or CSS (production)
  const showMobileLayout = viewMode === 'mobile';
  const showTabletLayout = viewMode === 'tablet';
  const showDesktopLayout = viewMode === 'desktop';

  // Parse height to apply responsive sizing
  const heightValue = parseInt(height) || 500;

  const mapHeightStyle = viewMode
    ? showMobileLayout
      ? `${Math.round(heightValue * 0.6)}px`
      : showTabletLayout
      ? `${Math.round(heightValue * 0.8)}px`
      : height
    : height;

  // Responsive classes with viewMode support
  const sectionPaddingClass = viewMode
    ? showMobileLayout
      ? 'py-8'
      : showTabletLayout
      ? 'py-12'
      : 'py-16'
    : 'py-8 md:py-12 lg:py-16';

  const containerPaddingClass = viewMode
    ? showMobileLayout
      ? 'px-4'
      : showTabletLayout
      ? 'px-4'
      : 'px-4 2xl:px-0'
    : 'px-4 2xl:px-0';

  const roundedClass = viewMode
    ? rounded
      ? showMobileLayout
        ? 'rounded-2xl'
        : 'rounded-3xl'
      : ''
    : rounded
      ? 'rounded-2xl md:rounded-3xl'
      : '';

  return (
    <section className={`w-full ${sectionPaddingClass}`} style={{ backgroundColor }}>
      <div className={contained ? `container mx-auto ${containerPaddingClass}` : 'w-full'}>
        <div
          className={`overflow-hidden ${roundedClass} ${shadow ? 'shadow-xl' : ''}`}
          style={{
            boxShadow: shadow ? '0 25px 50px -12px rgba(0, 0, 0, 0.15)' : undefined,
          }}
        >
          <iframe
            src={mapUrl}
            width="100%"
            height={mapHeightStyle}
            style={{ border: 0, display: 'block' }}
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
