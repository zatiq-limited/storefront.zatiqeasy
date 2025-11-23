import React from "react";

interface StaticBanner3Props {
  image?: string;
  imageMobile?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  textAlignment?: "left" | "center" | "right";
  textColor?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  height?: "small" | "medium" | "large";
}

const StaticBanner3: React.FC<StaticBanner3Props> = ({
  image,
  imageMobile,
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  secondaryButtonText,
  secondaryButtonLink,
  textAlignment,
  textColor,
  overlayColor,
  overlayOpacity,
  height,
}) => {
  // Get height class based on height prop
  const heightClass = 
    height === "small" ? "h-[310px] lg:h-[340px] xl:h-[363px]" :
    height === "large" ? "h-[510px] lg:h-[540px] xl:h-[563px]" :
    "h-[410px] lg:h-[440px] xl:h-[463px]"; // medium or undefined

  // Get text alignment classes
  const alignmentClasses = 
    textAlignment === "left" ? "justify-start text-left" :
    textAlignment === "right" ? "justify-end text-right" :
    "justify-center text-center";

  return (
    <div className={`relative w-full ${heightClass} bg-black overflow-hidden mb-8 sm:mb-14`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt="Banner Background"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Dark Overlay */}
      {overlayColor && overlayOpacity !== undefined && (
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: overlayColor, 
            opacity: overlayOpacity / 100 
          }}
        ></div>
      )}

      {/* Content Container - Centered */}
      <div className={`relative z-10 h-full flex items-center ${alignmentClasses} px-4 sm:px-6 md:px-8`}>
        <div className={textAlignment === "center" ? "text-center" : textAlignment === "right" ? "text-right" : "text-left"}>
          {/* Heading */}
          {title && (
            <h1 
              className="font-bold leading-none mb-4 sm:mb-5 md:mb-6 lg:mb-7 text-3xl sm:text-4xl md:text-5xl lg:text-[60px] tracking-tight"
              style={{ color: textColor }}
            >
              {title}
            </h1>
          )}

          {/* Description */}
          {description && (
            <p 
              className="leading-relaxed mb-6 sm:mb-7 md:mb-8 lg:mb-9 text-sm sm:text-[15px] md:text-base leading-6 sm:leading-[26px] max-w-[90%] sm:max-w-[500px] md:max-w-[580px] lg:max-w-[640px] mx-auto px-2"
              style={{ color: textColor, opacity: 0.95 }}
            >
              {description}
            </p>
          )}

          {/* CTA Button */}
          {buttonText && buttonLink && (
            <a href={buttonLink}>
              <button className="bg-[#4169E1] text-white font-medium hover:bg-[#3758CC] transition-colors text-sm sm:text-[15px] py-3 sm:py-[14px] px-8 sm:px-10 md:px-11 rounded-[3px] tracking-[0.2px]">
                {buttonText}
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaticBanner3;
