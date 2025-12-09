import React from "react";

// Banner block from homepage.json (snake_case format)
interface BannerBlock {
  image?: string;
  image_mobile?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_link?: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
  text_alignment?: "left" | "center" | "right";
  text_color?: string;
  overlay_color?: string;
  overlay_opacity?: number;
}

interface StaticBanner1Settings {
  height?: "small" | "medium" | "large";
  titleFont?: string;
  descriptionFont?: string;
}

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
  // Support for JSON structure
  blocks?: BannerBlock[];
  settings?: StaticBanner1Settings;
}

const StaticBanner1: React.FC<StaticBanner1Props> = ({
  image: imageProp,
  imageMobile: imageMobileProp,
  title: titleProp,
  subtitle: subtitleProp,
  description: descriptionProp,
  buttonText: buttonTextProp,
  buttonLink: buttonLinkProp,
  secondaryButtonText: secondaryButtonTextProp,
  secondaryButtonLink: secondaryButtonLinkProp,
  textAlignment: textAlignmentProp = "center",
  textColor: textColorProp = "#FFFFFF",
  overlayColor: overlayColorProp = "#000000",
  overlayOpacity: overlayOpacityProp = 5,
  height = "medium",
  blocks = [],
  settings = {},
}) => {
  // Get first block if available (banner typically has one block)
  const block = blocks[0];

  // Merge block data with direct props (direct props take precedence)
  const image = imageProp ?? block?.image;
  const imageMobile = imageMobileProp ?? block?.image_mobile;
  const title = titleProp ?? block?.title;
  const subtitle = subtitleProp ?? block?.subtitle;
  const description = descriptionProp ?? block?.description;
  const buttonText = buttonTextProp ?? block?.button_text;
  const buttonLink = buttonLinkProp ?? block?.button_link;
  const secondaryButtonText = secondaryButtonTextProp ?? block?.secondary_button_text;
  const secondaryButtonLink = secondaryButtonLinkProp ?? block?.secondary_button_link;
  const textAlignment = textAlignmentProp ?? block?.text_alignment ?? "center";
  const textColor = textColorProp ?? block?.text_color ?? "#FFFFFF";
  const overlayColor = overlayColorProp ?? block?.overlay_color ?? "#000000";
  const overlayOpacity = overlayOpacityProp ?? block?.overlay_opacity ?? 5;

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
