import React from "react";

interface ContactHero1Settings {
  backgroundColor?: string;
  textColor?: string;
  headline?: string;
  subheadline?: string;
  description?: string;
  image?: string;
  overlayOpacity?: number;
  accentColor?: string;
}

interface ContactHero1Props {
  settings?: ContactHero1Settings;
}

const ContactHero1: React.FC<ContactHero1Props> = ({ settings = {} }) => {
  const {
    headline = "Let's Start a Conversation",
    subheadline = "Contact Us",
    description = "We're here to help and answer any questions you might have. We look forward to hearing from you.",
    image = "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80",
    overlayOpacity = 0.6,
    accentColor = "#10B981",
  } = settings;

  return (
    <section className="relative w-full overflow-hidden pb-8 md:pb-14">
      {/* Background Image with Parallax Effect */}
      <div className="relative w-full min-h-[300px] md:min-h-[450px] lg:min-h-[600px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${image})` }}
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, rgba(0, 0, 0, ${overlayOpacity}) 0%, rgba(0, 0, 0, ${overlayOpacity * 0.7}) 100%)`,
          }}
        />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: accentColor }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ backgroundColor: accentColor }} />

        {/* Content */}
        <div className="relative z-10 h-full flex items-center justify-center min-h-[300px] md:min-h-[350px] lg:min-h-[400px]">
          <div className="max-w-[1200px] mx-auto px-4 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
              <span className="text-sm font-medium text-white/90 tracking-wide uppercase">
                {subheadline}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white leading-tight">
              {headline.split(' ').map((word, idx) => (
                <span key={idx}>
                  {idx === headline.split(' ').length - 1 ? (
                    <span style={{ color: accentColor }}>{word}</span>
                  ) : (
                    word + ' '
                  )}
                </span>
              ))}
            </h1>

            {/* Description */}
            <p className="text-base md:text-lg max-w-xl mx-auto text-white/80 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute -bottom-px left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none">
            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H0Z" fill="white"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default ContactHero1;
