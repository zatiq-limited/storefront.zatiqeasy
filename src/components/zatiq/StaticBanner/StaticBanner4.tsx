import React from "react";

interface StaticBanner4Props {
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

const StaticBanner4: React.FC<StaticBanner4Props> = ({
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
    height === "small" ? "h-[350px] md:h-[400px] lg:h-[450px] xl:h-[480px]" :
    height === "large" ? "h-[550px] md:h-[600px] lg:h-[650px] xl:h-[680px]" :
    "h-[450px] md:h-[500px] lg:h-[550px] xl:h-[580px]"; // medium or undefined

  return (
    <div className={`relative w-full ${heightClass} overflow-hidden mb-8 sm:mb-14`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt="Banner Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlay */}
      {overlayColor && overlayOpacity !== undefined ? (
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: overlayColor, 
            opacity: overlayOpacity / 100 
          }}
        ></div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30"></div>
      )}

      {/* Content Container - Centered */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        {/* Small Label */}
        {subtitle && (
          <div className="mb-4 sm:mb-6 md:mb-8 font-avenir">
            <span 
              className="font-normal tracking-[10%] uppercase text-xs sm:text-sm"
              style={{ color: textColor }}
            >
              {subtitle}
            </span>
          </div>
        )}

        {/* Main Heading */}
        {title && (
          <h1 
            className="font-caslon text-center font-medium mb-4 sm:mb-6 md:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[6%] leading-[1.3] font-serif max-w-[90%] sm:max-w-[85%] md:max-w-[900px] lg:max-w-[1000px] xl:max-w-[1100px] px-2"
            style={{ color: textColor }}
          >
            {title.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br className="hidden sm:block" />
                {i < title.split('\n').length - 1 && <span className="sm:hidden"> </span>}
              </React.Fragment>
            ))}
          </h1>
        )}

        {/* Description */}
        {description && (
          <p 
            className="font-avenir text-center font-normal text-sm sm:text-base md:text-lg lg:text-xl leading-[1.6] tracking-[0.3px] max-w-[90%] sm:max-w-[80%] md:max-w-full px-2"
            style={{ color: textColor }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StaticBanner4;
