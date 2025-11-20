import React from "react";

interface StaticBanner1Props {
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

const StaticBanner1: React.FC<StaticBanner1Props> = ({
  image,
  imageMobile,
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  secondaryButtonText,
  secondaryButtonLink,
  textAlignment = "center",
  textColor = "#FFFFFF",
  overlayColor = "#000000",
  overlayOpacity = 5,
  height = "medium",
}) => {

  return (
    <div className="relative w-full h-[450px] lg:h-[500px] xl:h-[524px] bg-black overflow-hidden mb-8 sm:mb-14">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt="Banner Background"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Dark Overlay */}
      <div className={`absolute inset-0 bg-black/${overlayOpacity}`}></div>

      {/* Content Container - Centered with max-width */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="w-full max-w-[1440px] flex items-center justify-center md:justify-end">
          <div className="text-center md:text-right max-w-[90%] sm:max-w-[500px] md:max-w-[550px] lg:max-w-[600px] md:mr-8 lg:mr-12">
            {/* Heading */}
            {title && (
              <h1
                className="font-bold mb-4 sm:mb-5 md:mb-6 text-3xl sm:text-4xl md:text-5xl leading-tight sm:leading-[50px] md:leading-[60px] lg:leading-[70px]"
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
                className="mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base leading-6 font-normal"
                style={{ color: textColor, opacity: 0.9 }}
              >
                {description}
              </p>
            )}

            {/* CTA Button */}
            {buttonText && buttonLink && (
              <a href={buttonLink}>
                <button className="bg-[#4169E1] min-w-40 sm:min-w-[180px] md:min-w-[200px] min-h-12 sm:min-h-13 md:min-h-14 text-white font-semibold hover:bg-[#3758CC] transition-colors text-sm sm:text-base px-4 rounded leading-6">
                  {buttonText}
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticBanner1;
