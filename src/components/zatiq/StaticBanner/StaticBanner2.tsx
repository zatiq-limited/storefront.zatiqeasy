import React from "react";

interface StaticBanner2Props {
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

const StaticBanner2: React.FC<StaticBanner2Props> = ({
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
    height === "small" ? "h-[350px] lg:h-[400px] xl:h-[424px]" :
    height === "large" ? "h-[550px] lg:h-[600px] xl:h-[624px]" :
    "h-[450px] lg:h-[500px] xl:h-[524px]"; // medium or undefined

  // Get text alignment classes
  const alignmentClasses = 
    textAlignment === "left" ? "justify-start text-left" :
    textAlignment === "right" ? "justify-end text-right" :
    "justify-center text-center";

  const contentAlignClasses = 
    textAlignment === "left" ? "md:justify-start md:text-left" :
    textAlignment === "right" ? "md:justify-end md:text-right" :
    "md:justify-center md:text-center";

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

      {/* Content Container */}
      <div className={`relative z-10 h-full flex items-center ${alignmentClasses} ${contentAlignClasses} px-4 sm:px-8 md:px-12 lg:px-20 xl:pl-52`}>
        <div className={`${textAlignment === "center" ? "text-center" : textAlignment === "right" ? "text-right" : "text-left"} md:${textAlignment === "center" ? "text-center" : textAlignment === "right" ? "text-right" : "text-left"} max-w-[90%] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[650px]`}>
          {/* Heading */}
          {title && (
            <h1 
              className="font-bold mb-3 sm:mb-4 leading-tight sm:leading-[50px] md:leading-[60px] lg:leading-[70px] text-3xl sm:text-4xl md:text-5xl"
              style={{ color: textColor }}
            >
              {title.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < title.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </h1>
          )}

          {/* Description */}
          {description && (
            <p 
              className="mb-6 sm:mb-7 md:mb-8 text-sm sm:text-base font-normal leading-6"
              style={{ color: textColor, opacity: 0.9 }}
            >
              {description}
            </p>
          )}

          {/* CTA Button */}
          {buttonText && buttonLink && (
            <a href={buttonLink}>
              <button className="bg-[#3465F0] min-w-40 sm:min-w-[180px] md:min-w-[200px] min-h-10 sm:min-h-12 md:min-h-14 text-white font-medium hover:bg-[#3758CC] transition-colors text-sm sm:text-base px-4 rounded leading-6">
                {buttonText}
              </button>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaticBanner2;
