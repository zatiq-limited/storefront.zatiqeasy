/**
 * Heading1 Component
 * Renders a section heading with title, subtitle, and optional button
 * Mirrors the merchant panel's Heading1 component
 */

"use client";

import Link from "next/link";

interface Heading1Settings {
  title?: string;
  subtitle?: string;
  alignment?: "left" | "center" | "right";
  top_padding?: number;
  bottom_padding?: number;
  title_font_family?: string;
  subtitle_font_family?: string;
  title_color?: string;
  subtitle_color?: string;
  title_font_size?: number;
  subtitle_font_size?: number;
  add_button?: boolean;
  button_text?: string;
  button_link?: string;
  button_bg?: string;
  button_position?: string;
  button_font_size?: number;
}

interface Heading1Props {
  settings: Heading1Settings;
}

export default function Heading1({ settings }: Heading1Props) {
  const {
    title = "Section Title",
    subtitle = "Section subtitle text goes here",
    alignment = "center",
    top_padding = 40,
    bottom_padding = 20,
    title_font_family = "inherit",
    subtitle_font_family = "inherit",
    title_color = "#252B42",
    subtitle_color = "#737373",
    title_font_size = 32,
    subtitle_font_size = 16,
    add_button = false,
    button_text = "View All",
    button_link = "/products",
    button_bg = "#252B42",
    button_position = "br",
    button_font_size = 14,
  } = settings;

  // Get alignment classes
  const getAlignmentClass = () => {
    switch (alignment) {
      case "left":
        return "text-left items-start";
      case "right":
        return "text-right items-end";
      case "center":
      default:
        return "text-center items-center";
    }
  };

  // Get button position config
  const getButtonPositionConfig = () => {
    const isTop = button_position.startsWith("t");
    const isBottom = button_position.startsWith("b");

    let horizontalClass = "justify-center";
    if (button_position.endsWith("l")) {
      horizontalClass = "justify-start";
    } else if (button_position.endsWith("r")) {
      horizontalClass = "justify-end";
    }

    return { isTop, isBottom, horizontalClass };
  };

  const buttonConfig = getButtonPositionConfig();

  // Render button
  const renderButton = () => {
    if (!add_button) return null;

    return (
      <div className={`w-full flex ${buttonConfig.horizontalClass}`}>
        <Link
          href={button_link}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-md text-white font-medium transition-opacity hover:opacity-90"
          style={{
            backgroundColor: button_bg,
            fontSize: `${button_font_size}px`,
          }}
        >
          {button_text}
        </Link>
      </div>
    );
  };

  return (
    <div
      className="w-full"
      style={{
        paddingTop: `${top_padding}px`,
        paddingBottom: `${bottom_padding}px`,
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className={`flex flex-col gap-2 md:gap-4 ${getAlignmentClass()}`}>
          {/* Top button position */}
          {buttonConfig.isTop && renderButton()}

          {/* Title */}
          {title && (
            <h2
              className="font-bold leading-tight"
              style={{
                color: title_color,
                fontFamily:
                  title_font_family !== "inherit" ? title_font_family : undefined,
                fontSize: `${title_font_size}px`,
              }}
            >
              {title}
            </h2>
          )}

          {/* Subtitle */}
          {subtitle && (
            <p
              className="leading-relaxed max-w-2xl"
              style={{
                color: subtitle_color,
                fontFamily:
                  subtitle_font_family !== "inherit"
                    ? subtitle_font_family
                    : undefined,
                fontSize: `${subtitle_font_size}px`,
              }}
            >
              {subtitle}
            </p>
          )}

          {/* Bottom button position */}
          {buttonConfig.isBottom && renderButton()}
        </div>
      </div>
    </div>
  );
}
